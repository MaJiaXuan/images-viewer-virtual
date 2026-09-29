/**
 * 查看器事件绑定
 */

import { on, off } from '../utils/dom.js'

export function bindEvents(viewer) {
  const { container, stage, options } = viewer

  const handlers = {}

  // 遮罩点击关闭
  if (options.backdrop) {
    handlers.click = e => {
      if (e.target === container || e.target === stage) viewer.hide()
    }
    on(container, 'click', handlers.click)
  }

  // 鼠标拖拽（任何缩放倍率下都可用）
  handlers.mousedown = e => viewer._onDragStart(e)
  on(stage, 'mousedown', handlers.mousedown)

  handlers.mousemove = e => {
    if (viewer.dragging) {
      viewer._onDragMove(e)
    }
  }
  on(document, 'mousemove', handlers.mousemove)

  handlers.mouseup = () => {
    if (viewer.dragging) viewer._onDragEnd()
  }
  on(document, 'mouseup', handlers.mouseup)

  // 触摸拖拽（任何缩放倍率下都可用）
  handlers.touchstart = e => {
    viewer._onDragStart(e.touches[0])
  }
  on(stage, 'touchstart', handlers.touchstart, { passive: false })

  handlers.touchmove = e => {
    if (viewer.dragging) {
      viewer._onDragMove(e.touches[0])
      e.preventDefault()
    }
  }
  on(document, 'touchmove', handlers.touchmove, { passive: false })

  handlers.touchend = () => {
    if (viewer.dragging) viewer._onDragEnd()
  }
  on(document, 'touchend', handlers.touchend)

  // 滚轮缩放（以鼠标位置为中心）
  handlers.wheel = e => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const rect = stage.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    viewer._zoomAt(delta, cx, cy)
  }
  on(stage, 'wheel', handlers.wheel, { passive: false })

  // 键盘
  handlers.keydown = e => _onKey(viewer, e)
  on(document, 'keydown', handlers.keydown)

  // 双击重置
  handlers.dblclick = () => viewer.reset()
  on(stage, 'dblclick', handlers.dblclick)

  viewer._handlers = handlers
}

function _onKey(viewer, e) {
  switch (e.key) {
    case 'ArrowLeft':
      viewer.prev()
      break
    case 'ArrowRight':
      viewer.next()
      break
    case 'Home':
      viewer.view(0, false)
      break
    case 'End':
      viewer.view(viewer.images.length - 1, false)
      break
    case 'Escape':
      viewer.hide()
      break
    case '+':
    case '=':
      viewer.zoom(0.2)
      break
    case '-':
    case '_':
      viewer.zoom(-0.2)
      break
    case '0':
      viewer.reset()
      break
    case 'f':
      viewer.toggleFullscreen()
      break
    case 'g':
    case 'G':
      {
        const n = parseInt(
          prompt('跳转到第几张图片? (1 - ' + viewer.images.length + ')') || '0',
          10
        )
        if (!Number.isNaN(n) && n > 0) viewer.view(n - 1)
      }
      break
    case 'i':
      viewer.toggleImageInfo()
      break
  }
}

export function unbindEvents(viewer) {
  const { container, stage, _handlers } = viewer
  if (!_handlers) return

  if (_handlers.click) off(container, 'click', _handlers.click)
  if (_handlers.mousedown) off(stage, 'mousedown', _handlers.mousedown)
  if (_handlers.mousemove) off(document, 'mousemove', _handlers.mousemove)
  if (_handlers.mouseup) off(document, 'mouseup', _handlers.mouseup)
  if (_handlers.touchstart) off(stage, 'touchstart', _handlers.touchstart)
  if (_handlers.touchmove) off(document, 'touchmove', _handlers.touchmove)
  if (_handlers.touchend) off(document, 'touchend', _handlers.touchend)
  if (_handlers.wheel) off(stage, 'wheel', _handlers.wheel)
  if (_handlers.keydown) off(document, 'keydown', _handlers.keydown)
  if (_handlers.dblclick) off(stage, 'dblclick', _handlers.dblclick)

  viewer._handlers = null
}
