/**
 * EXIF 方向应用逻辑（从 index.js 拆出）
 *
 * 优先级：数据里显式的 orientation > autoOrientation 自动解析 > 无方向。
 * 方向是图片固有属性，reset() 等用户变换重置不影响它。
 */

import { composeTransform } from './viewer-transform.js'
import { getOrientationTransform, readExifOrientation } from '../utils/exif.js'

export function applyOrientation(viewer) {
  const orientation = viewer.images[viewer.currentIndex]?.orientation
  if (orientation) {
    setOrientationTransform(viewer, getOrientationTransform(orientation))
    return
  }
  setOrientationTransform(viewer, '')
  detectExifOrientation(viewer)
}

export function setOrientationTransform(viewer, transform) {
  viewer._orientationTransform = transform
  if (viewer.mainImg) viewer.mainImg.style.transform = composeTransform(viewer)
}

/** 自动解析 JPEG EXIF 方向（需开启 autoOrientation，结果按 URL 缓存） */
function detectExifOrientation(viewer) {
  if (!viewer.options.autoOrientation) return
  const url = viewer.images[viewer.currentIndex]?.url || ''
  const index = viewer.currentIndex
  readExifOrientation(url).then(o => {
    // 用户可能已切换图片或销毁，过期结果直接丢弃
    if (!viewer.mainImg || viewer.currentIndex !== index) return
    const transform = getOrientationTransform(o)
    if (transform && viewer._orientationTransform !== transform) {
      setOrientationTransform(viewer, transform)
    }
  })
}
