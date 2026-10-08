/**
 * 查看器事件绑定
 */

import { on, off } from '../utils/dom.js'

const WHEEL_ZOOM_STEP = 0.1 // 滚轮每格的缩放步长
const KEY_ZOOM_STEP = 0.2 // 快捷键 +/- 的缩放步长

// 事件类型 → 解绑目标（viewer 上的字段名，或全局的 'document'）
const BOUND_EVENTS = [
  ['click', 'container'],
  ['mousedown', 'stage'],
  ['mousemove', 'document'],
  ['mouseup', 'document'],
  ['touchstart', 'stage'],
  ['touchmove', 'document'],
  ['touchend', 'document'],
  ['wheel', 'stage'],
  ['keydown', 'document'],
  ['dblclick', 'stage'],
]

// 快捷键 → 动作。查表替代 switch，避免 keydown 处理函数的分支堆积
const KEY_ACTIONS = {
  ArrowLeft: viewer => viewer.prev(),
  ArrowRight: viewer => viewer.next(),
  Home: viewer => viewer.view(0, false),
  End: viewer => viewer.view(viewer.images.length - 1, false),
  Escape: viewer => viewer.hide(),
  '+': viewer => viewer.zoom(KEY_ZOOM_STEP),
  '=': viewer => viewer.zoom(KEY_ZOOM_STEP),
  '-': viewer => viewer.zoom(-KEY_ZOOM_STEP),
  _: viewer => viewer.zoom(-KEY_ZOOM_STEP),
  0: viewer => viewer.reset(),
  f: viewer => viewer.toggleFullscreen(),
  g: gotoImage,
  G: gotoImage,
  i: viewer => viewer.toggleImageInfo(),
}

function gotoImage(viewer) {
  const answer = prompt('跳转到第几张图片? (1 - ' + viewer.images.length + ')') || '0'
  const n = parseInt(answer, 10)
  if (!Number.isNaN(n) && n > 0) viewer.view(n - 1)
}

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
    const delta = e.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP
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
  const action = KEY_ACTIONS[e.key]
  if (action) action(viewer)
}

function resolveTarget(viewer, key) {
  return key === 'document' ? document : viewer[key]
}

export function unbindEvents(viewer) {
  const handlers = viewer._handlers
  if (!handlers) return

  for (const [type, targetKey] of BOUND_EVENTS) {
    const fn = handlers[type]
    if (fn) off(resolveTarget(viewer, targetKey), type, fn)
  }

  viewer._handlers = null
}
