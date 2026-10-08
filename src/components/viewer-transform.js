/**
 * 查看器变换操作（缩放、旋转、拖拽）
 */

import { clamp } from '../utils/dom.js'

const ELASTIC_DISTANCE = 60 // 弹性距离，允许超出边界 60px
const PERCENT = 100 // 缩放倍率 → 百分比
const ZOOM_INDICATOR_HIDE_MS = 1500 // 缩放指示器自动隐藏延时
const HALF = 2 // 取半：尺寸差 / 视口的一半，即单侧的可移动行程

/**
 * 组合最终 transform：EXIF 方向变换（如有）在最外层，用户变换在内层。
 * _orientationTransform 由 index.js 的 _applyOrientation() 设置，默认为空。
 */
export function composeTransform(viewer) {
  const s = clamp(viewer.scale, viewer.options.minZoomRatio, viewer.options.maxZoomRatio)
  const base = `translate(${viewer.translateX}px, ${viewer.translateY}px) scale(${s}) rotate(${viewer.rotation}deg)`
  const orientation = viewer._orientationTransform
  return orientation ? `${orientation} ${base}` : base
}

export function applyTransform(viewer) {
  const s = clamp(viewer.scale, viewer.options.minZoomRatio, viewer.options.maxZoomRatio)
  viewer.mainImg.style.transform = composeTransform(viewer)

  // 缩放指示器
  if (viewer.zoomIndEl) {
    viewer.zoomIndEl.textContent = `缩放: ${Math.round(s * PERCENT)}%`
    viewer.zoomIndEl.style.opacity = s !== 1 ? '1' : '0'
    clearTimeout(viewer._zoomTimer)
    viewer._zoomTimer = setTimeout(() => {
      viewer.zoomIndEl.style.opacity = '0'
    }, ZOOM_INDICATOR_HIDE_MS)
  }

  viewer._emit('onZoom', { scale: s })
  viewer._emit('onDrag', { translateX: viewer.translateX, translateY: viewer.translateY })
}

/**
 * 计算拖拽边界
 * 图片中心可移动范围：|scaledSize - stageSize| / 2
 * 当图片比舞台大：移动查看不同区域，边缘对齐舞台边缘
 * 当图片比舞台小：在舞台内自由移动，可到任意位置
 */
function getDragBounds(viewer) {
  const { stage } = viewer
  const { mainImg } = viewer
  if (!stage || !mainImg) return null

  const { scale } = viewer
  const stageW = stage.clientWidth
  const stageH = stage.clientHeight

  let imgW = mainImg.naturalWidth
  let imgH = mainImg.naturalHeight
  if (!imgW || imgW <= 0) {
    const rect = mainImg.getBoundingClientRect()
    imgW = rect.width || stageW
    imgH = rect.height || stageH
  }

  const scaledW = imgW * scale
  const scaledH = imgH * scale

  const maxX = Math.abs(scaledW - stageW) / HALF
  const maxY = Math.abs(scaledH - stageH) / HALF

  return { minX: -maxX, maxX, minY: -maxY, maxY }
}

export function onDragStart(viewer, e) {
  viewer.dragging = true
  viewer.dragStart = {
    x: e.clientX - viewer.translateX,
    y: e.clientY - viewer.translateY,
  }
  viewer.mainImg.style.transition = 'none'
  if (viewer.stage) viewer.stage.style.cursor = 'grabbing'
}

export function onDragMove(viewer, e) {
  if (!viewer.dragging) return
  const bounds = getDragBounds(viewer)
  let newX = e.clientX - viewer.dragStart.x
  let newY = e.clientY - viewer.dragStart.y
  if (bounds) {
    // 使用弹性边界，允许稍微超出正常边界
    newX = clamp(newX, bounds.minX - ELASTIC_DISTANCE, bounds.maxX + ELASTIC_DISTANCE)
    newY = clamp(newY, bounds.minY - ELASTIC_DISTANCE, bounds.maxY + ELASTIC_DISTANCE)
  }
  viewer.translateX = newX
  viewer.translateY = newY
  applyTransform(viewer)
}

export function onDragEnd(viewer) {
  viewer.dragging = false
  if (viewer.stage) viewer.stage.style.cursor = 'grab'

  const bounds = getDragBounds(viewer)
  if (bounds) {
    let newX = viewer.translateX
    let newY = viewer.translateY
    let needBounce = false

    // 如果超出正常边界（临界点），回弹到边界
    if (newX < bounds.minX) {
      newX = bounds.minX
      needBounce = true
    }
    if (newX > bounds.maxX) {
      newX = bounds.maxX
      needBounce = true
    }
    if (newY < bounds.minY) {
      newY = bounds.minY
      needBounce = true
    }
    if (newY > bounds.maxY) {
      newY = bounds.maxY
      needBounce = true
    }

    if (needBounce) {
      viewer.translateX = newX
      viewer.translateY = newY
      viewer.mainImg.style.transition = `transform ${viewer.options.theme.transitionSpeed} ease`
      applyTransform(viewer)
    } else {
      // 在边界内，保持位置，不触发回弹
      viewer.mainImg.style.transition = `transform ${viewer.options.theme.transitionSpeed} ease`
    }
  } else {
    viewer.mainImg.style.transition = `transform ${viewer.options.theme.transitionSpeed} ease`
  }
}

export function zoom(viewer, delta) {
  viewer.scale = clamp(
    viewer.scale + delta,
    viewer.options.minZoomRatio,
    viewer.options.maxZoomRatio
  )
  applyTransform(viewer)
}

export function zoomAt(viewer, delta, centerX, centerY) {
  const oldScale = viewer.scale
  const newScale = clamp(
    viewer.scale + delta,
    viewer.options.minZoomRatio,
    viewer.options.maxZoomRatio
  )
  if (newScale === oldScale) return

  const { stage } = viewer
  const stageCX = stage.clientWidth / HALF
  const stageCY = stage.clientHeight / HALF
  const dx = centerX - stageCX - viewer.translateX
  const dy = centerY - stageCY - viewer.translateY

  const scaleRatio = newScale / oldScale
  viewer.translateX -= dx * (scaleRatio - 1)
  viewer.translateY -= dy * (scaleRatio - 1)
  viewer.scale = newScale

  applyTransform(viewer)
}

export function rotate(viewer, deg) {
  viewer.rotation += deg
  applyTransform(viewer)
  viewer._emit('onRotate', { rotation: viewer.rotation })
}

export function reset(viewer) {
  viewer.scale = 1
  viewer.rotation = 0
  viewer.translateX = 0
  viewer.translateY = 0
  applyTransform(viewer)
}
