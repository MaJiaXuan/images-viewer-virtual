/**
 * 图片复制 / 下载
 *
 * 下载采用多级降级策略：canvas 导出 → fetch blob → a[download] → 新窗口打开，
 * 每一级独立成函数，便于单独失败时继续降级。
 */

import { copyImageToClipboard } from 'copy-image-clipboard'

import { showToast } from './dom.js'

const CANVAS_FALLBACK_WIDTH = 1920
const CANVAS_FALLBACK_HEIGHT = 1080
const PNG_MIME = 'image/png'
const JPEG_MIME = 'image/jpeg'
const PNG_EXT = '.png'
const JPEG_EXT = '.jpg'
const DEFAULT_FILE_TITLE = 'image'
const UNSUPPORTED_COPY_HINT = 'Cannot copy this type of image'

function makeToast(viewer) {
  const toastClass = viewer.options.className + '__toast'
  return (msg, type) => showToast(msg, type, viewer.container, toastClass)
}

function triggerDownload(href, filename, target) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  if (target) a.target = target
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// 方式 A：canvas 导出 dataURL + a.download（图片已加载）
function downloadViaCanvas(viewer, title) {
  const img = viewer.mainImg
  try {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width || CANVAS_FALLBACK_WIDTH
    canvas.height = img.naturalHeight || img.height || CANVAS_FALLBACK_HEIGHT
    canvas.getContext('2d').drawImage(img, 0, 0)
    triggerDownload(canvas.toDataURL(PNG_MIME), title + PNG_EXT)
    return true
  } catch {
    return false
  }
}

// 方式 B：fetch blob + URL.createObjectURL + a.download（尝试跨域）
async function downloadViaFetch(url, title) {
  try {
    const res = await fetch(url, { mode: 'cors', cache: 'no-store' })
    if (!res.ok) return false
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    triggerDownload(blobUrl, title + (blob.type === JPEG_MIME ? JPEG_EXT : PNG_EXT))
    URL.revokeObjectURL(blobUrl)
    return true
  } catch {
    return false
  }
}

// 方式 C：直接 a[download]（同域有效，跨域可能不生效）
function downloadViaAnchor(url, title) {
  try {
    triggerDownload(url, title, '_blank')
    return true
  } catch {
    return false
  }
}

// 方式 D：最后降级，在新窗口打开
function downloadViaWindow(url) {
  try {
    window.open(url, '_blank')
    return true
  } catch {
    return false
  }
}

export async function downloadImageFile(viewer) {
  const url = viewer._getUrl(viewer.currentIndex)
  const title = viewer._getTitle(viewer.currentIndex) || DEFAULT_FILE_TITLE
  const toast = makeToast(viewer)

  toast('正在下载...', 'info')

  if (downloadViaCanvas(viewer, title)) {
    toast('已开始下载', 'success')
    return
  }
  if (await downloadViaFetch(url, title)) {
    toast('已开始下载', 'success')
    return
  }
  if (downloadViaAnchor(url, title)) {
    toast('已开始下载', 'success')
    return
  }
  if (downloadViaWindow(url)) {
    toast('已在新窗口打开图片', 'success')
    return
  }
  toast('下载失败', 'error')
}

export async function copyImageFromUrl(viewer) {
  const url = viewer._getUrl(viewer.currentIndex)
  const toast = makeToast(viewer)

  toast('正在复制...', 'info')

  try {
    await copyImageToClipboard(url)
    toast('图片已复制到剪贴板', 'success')
    return true
  } catch (err) {
    const msg = err.message || ''
    if (msg.includes(UNSUPPORTED_COPY_HINT)) {
      toast('复制失败：仅支持 PNG 和 JPG 格式图片', 'error')
    } else {
      toast('复制失败：' + msg, 'error')
    }
    return false
  }
}
