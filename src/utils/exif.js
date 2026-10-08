/**
 * JPEG EXIF Orientation 解析与 CSS transform 映射
 *
 * 只处理 JPEG（以 FFD8 开头）：遍历 APPn 段找到 APP1/Exif，
 * 读取 TIFF IFD0 中的 Orientation 标签（0x0112，SHORT 类型，值 1-8）。
 */

// JPEG 段结构
const JPEG_SOI = 0xffd8 // 文件起始标记
const SOI_LENGTH = 2
const APP1_MARKER = 0xffe1 // EXIF 所在段
const SOS_MARKER = 0xffda // 压缩数据起始，其后不再是元数据段
const MARKER_PREFIX_MASK = 0xff00
const MARKER_BYTES = 2 // 段标记长度
const SEGMENT_LENGTH_OFFSET = 2 // 段长度字段相对段起始的偏移
const PAYLOAD_OFFSET = 4 // 段内容相对段起始的偏移（marker + length）
const EXIF_HEADER = 'Exif\0\0'

// TIFF 结构
const BYTE_ORDER_LE = 'II' // 小端字节序
const BYTE_ORDER_BE = 'MM' // 大端字节序
const BYTE_ORDER_LENGTH = 2
const TIFF_MAGIC = 0x002a
const TIFF_MAGIC_OFFSET = 2 // 魔数相对 TIFF 头的偏移
const IFD_OFFSET_FIELD = 4 // IFD0 偏移字段相对 TIFF 头的偏移
const TIFF_HEADER_SIZE = 8
const IFD_COUNT_BYTES = 2 // 目录项计数字段长度
const IFD_ENTRY_SIZE = 12 // 每个目录项：tag(2) + type(2) + count(4) + value(4)
const TAG_TYPE_OFFSET = 2 // 类型字段相对目录项的偏移
const TAG_VALUE_OFFSET = 8 // 值字段相对目录项的偏移
const TAG_ORIENTATION = 0x0112
const TYPE_SHORT = 3
const EXIF_MIN = 1
const EXIF_MAX = 8

/**
 * EXIF Orientation → CSS transform 映射。
 * 作为整条变换链的最外层：用户缩放/旋转/平移仍按无方向图片计算。
 * 组合项（5/7）中 scaleX(-1) 先作用于图片本身，rotate 作用于其结果。
 */
const ORIENTATION_TRANSFORMS = {
  2: 'scaleX(-1)',
  3: 'rotate(180deg)',
  4: 'scaleY(-1)',
  5: 'rotate(-90deg) scaleX(-1)',
  6: 'rotate(90deg)',
  7: 'rotate(90deg) scaleX(-1)',
  8: 'rotate(-90deg)',
}

/** 返回 orientation 对应的 CSS transform；1 / 未提供 / 非法值返回 '' */
export function getOrientationTransform(orientation) {
  if (!Number.isInteger(orientation)) return ''
  return ORIENTATION_TRANSFORMS[orientation] || ''
}

const MIN_JPEG_SIZE = 4 // 至少包含 SOI(2) + 一个段标记(2)

/**
 * 从 JPEG 的 ArrayBuffer 中解析 EXIF Orientation。
 * 非 JPEG、结构损坏或无该标签时返回 undefined。
 */
export function parseExifOrientation(buffer) {
  if (!buffer || buffer.byteLength < MIN_JPEG_SIZE) return undefined
  const view = new DataView(buffer)
  if (view.getUint16(0) !== JPEG_SOI) return undefined

  let offset = SOI_LENGTH
  while (offset + MARKER_BYTES + SEGMENT_LENGTH_OFFSET <= view.byteLength) {
    const marker = view.getUint16(offset)
    if ((marker & MARKER_PREFIX_MASK) !== MARKER_PREFIX_MASK) return undefined // 段结构损坏
    if (marker === SOS_MARKER) return undefined

    const length = view.getUint16(offset + SEGMENT_LENGTH_OFFSET)
    if (marker === APP1_MARKER) {
      const orientation = readApp1Orientation(view, offset + PAYLOAD_OFFSET)
      if (orientation !== undefined) return orientation
    }
    offset += MARKER_BYTES + length
  }
  return undefined
}

/** 解析 APP1 段内容；非 Exif 段或解析失败返回 undefined */
function readApp1Orientation(view, payload) {
  if (readAscii(view, payload, EXIF_HEADER.length) !== EXIF_HEADER) return undefined
  return readTiffOrientation(view, payload + EXIF_HEADER.length)
}

function readAscii(view, start, length) {
  if (start + length > view.byteLength) return ''
  let s = ''
  for (let i = 0; i < length; i++) s += String.fromCharCode(view.getUint8(start + i))
  return s
}

/** 解析 TIFF 头，返回 { le, ifdPos }；结构非法返回 undefined */
function readTiffOrientation(view, tiffStart) {
  if (tiffStart + TIFF_HEADER_SIZE > view.byteLength) return undefined

  const byteOrder = readAscii(view, tiffStart, BYTE_ORDER_LENGTH)
  if (byteOrder !== BYTE_ORDER_LE && byteOrder !== BYTE_ORDER_BE) return undefined
  const le = byteOrder === BYTE_ORDER_LE
  if (view.getUint16(tiffStart + TIFF_MAGIC_OFFSET, le) !== TIFF_MAGIC) return undefined

  const ifdPos = tiffStart + view.getUint32(tiffStart + IFD_OFFSET_FIELD, le)
  if (ifdPos + IFD_COUNT_BYTES > view.byteLength) return undefined
  return findOrientationInIfd(view, ifdPos, le)
}

/** 遍历 IFD0 查找 Orientation 标签 */
function findOrientationInIfd(view, ifdPos, le) {
  const entryCount = view.getUint16(ifdPos, le)
  for (let i = 0; i < entryCount; i++) {
    const entry = ifdPos + IFD_COUNT_BYTES + i * IFD_ENTRY_SIZE
    if (entry + IFD_ENTRY_SIZE > view.byteLength) return undefined
    if (view.getUint16(entry, le) !== TAG_ORIENTATION) continue
    // SHORT 类型且 count 为 1 时，值直接存于值字段的前 2 字节（按 TIFF 字节序）
    if (view.getUint16(entry + TAG_TYPE_OFFSET, le) !== TYPE_SHORT) return undefined
    const value = view.getUint16(entry + TAG_VALUE_OFFSET, le)
    return value >= EXIF_MIN && value <= EXIF_MAX ? value : undefined
  }
  return undefined
}

// 同一 URL 的 EXIF 不会变化，缓存解析结果（含失败结果）避免重复下载
const orientationCache = new Map()

/**
 * 异步读取图片的 EXIF Orientation。
 * 需要 CORS 放行或同源；fetch 失败 / 非 JPEG / 无标签均静默返回 undefined。
 */
export async function readExifOrientation(url) {
  if (typeof url !== 'string' || !url) return undefined
  if (!orientationCache.has(url)) {
    orientationCache.set(
      url,
      fetchOrientation(url).catch(() => undefined)
    )
  }
  return orientationCache.get(url)
}

async function fetchOrientation(url) {
  const res = await fetch(url)
  if (!res.ok) return undefined
  return parseExifOrientation(await res.arrayBuffer())
}
