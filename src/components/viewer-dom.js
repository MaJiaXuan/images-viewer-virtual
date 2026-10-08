/**
 * 查看器 DOM 构建 — BEM 命名规范
 *
 * 拆成若干职责单一的小函数，buildDOM 只负责按既定顺序编排。
 * 各子函数统一从 viewer.options 读取配置，避免参数列表膨胀。
 */

import { createBtn, createDiv, createImg, on } from '../utils/dom.js'

const ZOOM_STEP = 0.2 // 工具栏缩放按钮的单步倍率
const ROTATE_STEP_DEG = 90 // 工具栏旋转按钮的单步角度
const FALLBACK_BORDER_RADIUS = '50%' // 主题未指定圆角时的兜底值

export function buildDOM(viewer) {
  const opts = viewer.options
  const container = createContainer(opts, opts.theme, opts.className)
  const stage = createStage(opts.className)
  viewer.stage = stage

  // 以下顺序即 DOM 中 stage 子节点的顺序，不要随意调整
  buildMainImage(viewer, stage)
  buildLoading(viewer, stage)
  buildTitle(viewer, stage)
  buildCounter(viewer, stage)
  buildZoomIndicator(viewer, stage)
  buildInfoPanel(viewer, stage)
  buildNavButtons(viewer, stage)
  buildTopCloseButton(viewer, stage)
  buildToolbar(viewer, stage)

  container.appendChild(stage)
  document.body.appendChild(container)
  viewer.container = container

  buildThumbBar(viewer, container)

  return { container, stage }
}

function createContainer(opts, t, ns) {
  return createDiv(ns, {
    position: 'fixed',
    inset: '0',
    zIndex: String(opts.zIndex),
    background: t.viewerBgColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    userSelect: 'none',
    opacity: '0',
    transition: `opacity ${t.transitionSpeed}`,
  })
}

function createStage(ns) {
  return createDiv(ns + '__stage', {
    position: 'relative',
    flex: '1',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
  })
}

function buildMainImage(viewer, stage) {
  const { className: ns, theme: t } = viewer.options
  const mainImg = createImg(ns + '__image', {
    maxWidth: '90vw',
    maxHeight: '85vh',
    objectFit: 'contain',
    transition: `transform ${t.transitionSpeed} ease`,
    willChange: 'transform',
    userSelect: 'none',
    pointerEvents: 'auto',
  })

  const onMainLoad = () => viewer._onMainLoad()
  const onMainError = () => viewer._onMainError()
  on(mainImg, 'load', onMainLoad)
  on(mainImg, 'error', onMainError)
  mainImg.loading = 'lazy'
  mainImg.decoding = 'async'

  stage.appendChild(mainImg)
  viewer.mainImg = mainImg
  viewer._onMainLoadRef = onMainLoad
  viewer._onMainErrorRef = onMainError
}

function buildLoading(viewer, stage) {
  const { className: ns, theme: t, i18n } = viewer.options
  const loading = createDiv(ns + '__loading', {
    position: 'absolute',
    color: t.textColor,
    fontSize: '14px',
    display: 'none',
    pointerEvents: 'none',
  })
  loading.textContent = i18n.buttons.loading
  stage.appendChild(loading)
  viewer.loadingEl = loading
}

function buildTitle(viewer, stage) {
  const { className: ns, theme: t, showTitle } = viewer.options
  if (!showTitle) return

  const titleEl = createDiv(ns + '__title', {
    position: 'absolute',
    bottom: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: t.textColor,
    fontSize: '14px',
    opacity: '0.9',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '80%',
  })
  stage.appendChild(titleEl)
  viewer.titleEl = titleEl
}

function buildCounter(viewer, stage) {
  const { className: ns, theme: t, showCounter } = viewer.options
  if (!showCounter) return

  const counter = createDiv(ns + '__counter', {
    position: 'absolute',
    bottom: '96px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: t.textColor,
    fontSize: '13px',
    opacity: '0.8',
  })
  stage.appendChild(counter)
  viewer.counterEl = counter
}

function buildZoomIndicator(viewer, stage) {
  const { className: ns, theme: t } = viewer.options
  const zoomInd = createDiv(ns + '__zoom-indicator', {
    position: 'absolute',
    top: t.zoomIndicatorTop,
    left: t.zoomIndicatorLeft,
    background: t.zoomIndicatorBg,
    color: t.textColor,
    fontSize: t.zoomIndicatorFontSize,
    padding: t.zoomIndicatorPadding,
    borderRadius: t.zoomIndicatorBorderRadius,
    opacity: '0',
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  })
  stage.appendChild(zoomInd)
  viewer.zoomIndEl = zoomInd
}

function buildInfoPanel(viewer, stage) {
  const { className: ns, theme: t } = viewer.options
  const infoPanel = createDiv(ns + '__info', {
    position: 'absolute',
    top: t.infoTop,
    left: t.infoLeft,
    background: t.infoBgColor,
    color: t.textColor,
    fontSize: t.infoFontSize,
    padding: t.infoPadding,
    borderRadius: t.infoBorderRadius,
    maxWidth: '240px',
    display: 'none',
    pointerEvents: 'none',
  })
  stage.appendChild(infoPanel)
  viewer.infoPanel = infoPanel
}

function buildNavButtons(viewer, stage) {
  const opts = viewer.options
  const ns = opts.className
  const t = opts.theme
  const enabled = opts.showNavButtons && viewer.images.length > 1

  const btnCfg = {
    size: t.navButtonSize,
    fontSize: t.navButtonFontSize,
    bg: t.navButtonBgColor,
    hoverBg: t.navButtonHoverBg,
    radius: t.navButtonBorderRadius,
    textColor: t.textColor,
  }

  if (enabled && opts.buttons.prev) {
    const prevBtn = createBtn('←', ns + '__nav-btn ' + ns + '__nav-btn--prev', btnCfg)
    prevBtn.title = '上一张'
    on(prevBtn, 'click', e => {
      e.stopPropagation()
      viewer.prev()
    })
    stage.appendChild(prevBtn)
    viewer._navPrevEl = prevBtn
  }
  if (enabled && opts.buttons.next) {
    const nextBtn = createBtn('→', ns + '__nav-btn ' + ns + '__nav-btn--next', btnCfg)
    nextBtn.title = '下一张'
    on(nextBtn, 'click', e => {
      e.stopPropagation()
      viewer.next()
    })
    stage.appendChild(nextBtn)
    viewer._navNextEl = nextBtn
  }
}

function buildTopCloseButton(viewer, stage) {
  const opts = viewer.options
  const ns = opts.className
  const t = opts.theme
  if (!opts.buttons.topClose) return

  const closeBtn = createBtn('×', ns + '__close-btn', {
    size: t.topCloseBtnSize,
    fontSize: t.topCloseBtnFontSize,
    bg: t.topCloseBtnBgColor,
    hoverBg: t.topCloseBtnHoverBg,
    radius: t.topCloseBtnBorderRadius || FALLBACK_BORDER_RADIUS,
    textColor: t.textColor,
  })
  closeBtn.title = '关闭'
  closeBtn.style.cssText += `position:absolute;top:${t.topCloseBtnTop};right:${t.topCloseBtnRight};`
  on(closeBtn, 'click', e => {
    e.stopPropagation()
    viewer.hide()
  })
  stage.appendChild(closeBtn)
}

function buildToolbar(viewer, stage) {
  const opts = viewer.options
  const ns = opts.className
  const t = opts.theme

  const toolbar = createDiv(ns + '__toolbar', {
    position: 'absolute',
    bottom: t.toolbarBottom,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    background: t.toolbarBgColor,
    padding: t.toolbarPadding,
    borderRadius: t.toolbarBorderRadius,
    backdropFilter: 'blur(8px)',
  })

  const cfg = {
    size: t.buttonSize,
    fontSize: t.buttonFontSize,
    bg: t.buttonBgColor,
    hoverBg: t.buttonHoverBg,
    radius: t.buttonBorderRadius,
    textColor: t.textColor,
  }

  for (const [key, label, title, handler] of TOOL_BUTTONS) {
    if (!opts.buttons[key]) continue
    const btn = createBtn(label, ns + '__tool-btn ' + ns + '__tool-btn--' + key, cfg)
    btn.title = opts.i18n.buttons[key] || title
    on(btn, 'click', e => {
      e.stopPropagation()
      handler(viewer)
    })
    toolbar.appendChild(btn)
  }

  for (const [label, handler] of opts.customButtons) {
    const btn = createBtn(label, ns + '__tool-btn ' + ns + '__tool-btn--custom', cfg)
    btn.title = label
    on(btn, 'click', e => {
      e.stopPropagation()
      handler.call(viewer)
    })
    toolbar.appendChild(btn)
  }

  stage.appendChild(toolbar)
  viewer.toolbarEl = toolbar
}

// [配置键, 图标, 兜底标题, 动作]
const TOOL_BUTTONS = [
  ['zoomIn', '+', '放大', viewer => viewer.zoom(ZOOM_STEP)],
  ['zoomOut', '-', '缩小', viewer => viewer.zoom(-ZOOM_STEP)],
  ['rotateLeft', '↺', '向左旋转', viewer => viewer.rotate(-ROTATE_STEP_DEG)],
  ['rotateRight', '↻', '向右旋转', viewer => viewer.rotate(ROTATE_STEP_DEG)],
  ['reset', '⌂', '重置', viewer => viewer.reset()],
  ['download', '↓', '下载', viewer => viewer.downloadImage()],
  ['copy', '⧉', '复制', viewer => viewer.copyImage()],
  ['fullscreen', '⛶', '全屏', viewer => viewer.toggleFullscreen()],
  ['info', 'ℹ', '信息', viewer => viewer.toggleImageInfo()],
  ['thumbnails', '☰', '缩略图', viewer => viewer.toggleThumbnails()],
  ['close', '✕', '关闭', viewer => viewer.hide()],
]

function buildThumbBar(viewer, container) {
  const opts = viewer.options
  const ns = opts.className
  if (!opts.showThumbBar) {
    viewer.thumbBar = null
    return
  }

  const thumbBar = createDiv(ns + '__thumb-bar', {
    width: '100%',
    height: opts.theme.thumbBarHeight + 'px',
    flexShrink: '0',
    background: 'rgba(0,0,0,0.3)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: opts.buttons.thumbnails ? 'block' : 'none',
  })
  viewer.thumbBar = thumbBar
  container.appendChild(thumbBar)
}
