/**
 * 查看器 DOM 构建 — BEM 命名规范
 */

import { createBtn, createDiv, createImg, on } from '../utils/dom.js'

export function buildDOM(viewer) {
  const opts = viewer.options
  const t = opts.theme
  const ns = opts.className

  const container = createDiv(ns, {
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

  // 主舞台
  const stage = createDiv(ns + '__stage', {
    position: 'relative',
    flex: '1',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
  })

  // 主图 img（纯原生）
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

  // Loading
  const loading = createDiv(ns + '__loading', {
    position: 'absolute',
    color: t.textColor,
    fontSize: '14px',
    display: 'none',
    pointerEvents: 'none',
  })
  loading.textContent = opts.i18n.buttons.loading
  stage.appendChild(loading)
  viewer.loadingEl = loading

  // 标题
  if (opts.showTitle) {
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

  // 计数器
  if (opts.showCounter) {
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

  // 缩放指示器
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

  // 信息面板
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

  // 导航按钮
  const btnCfg = {
    size: t.navButtonSize,
    fontSize: t.navButtonFontSize,
    bg: t.navButtonBgColor,
    hoverBg: t.navButtonHoverBg,
    radius: t.navButtonBorderRadius,
    textColor: t.textColor,
  }

  if (opts.showNavButtons && opts.buttons.prev && viewer.images.length > 1) {
    const prevBtn = createBtn('←', ns + '__nav-btn ' + ns + '__nav-btn--prev', btnCfg)
    prevBtn.title = '上一张'
    on(prevBtn, 'click', e => {
      e.stopPropagation()
      viewer.prev()
    })
    stage.appendChild(prevBtn)
    viewer._navPrevEl = prevBtn
  }
  if (opts.showNavButtons && opts.buttons.next && viewer.images.length > 1) {
    const nextBtn = createBtn('→', ns + '__nav-btn ' + ns + '__nav-btn--next', btnCfg)
    nextBtn.title = '下一张'
    on(nextBtn, 'click', e => {
      e.stopPropagation()
      viewer.next()
    })
    stage.appendChild(nextBtn)
    viewer._navNextEl = nextBtn
  }

  // 右上角关闭
  if (opts.buttons.topClose) {
    const closeBtn = createBtn('×', ns + '__close-btn', {
      size: t.topCloseBtnSize,
      fontSize: t.topCloseBtnFontSize,
      bg: t.topCloseBtnBgColor,
      hoverBg: t.topCloseBtnHoverBg,
      radius: t.topCloseBtnBorderRadius || '50%',
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

  // 工具栏
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

  const toolBtnCfg = {
    size: t.buttonSize,
    fontSize: t.buttonFontSize,
    bg: t.buttonBgColor,
    hoverBg: t.buttonHoverBg,
    radius: t.buttonBorderRadius,
    textColor: t.textColor,
  }

  const btnDefs = [
    ['zoomIn', '+', opts.i18n.buttons.zoomIn || '放大', () => viewer.zoom(0.2)],
    ['zoomOut', '-', opts.i18n.buttons.zoomOut || '缩小', () => viewer.zoom(-0.2)],
    ['rotateLeft', '↺', opts.i18n.buttons.rotateLeft || '向左旋转', () => viewer.rotate(-90)],
    ['rotateRight', '↻', opts.i18n.buttons.rotateRight || '向右旋转', () => viewer.rotate(90)],
    ['reset', '⌂', opts.i18n.buttons.reset || '重置', () => viewer.reset()],
    ['download', '↓', opts.i18n.buttons.download || '下载', () => viewer.downloadImage()],
    ['copy', '⧉', opts.i18n.buttons.copy || '复制', () => viewer.copyImage()],
    ['fullscreen', '⛶', opts.i18n.buttons.fullscreen || '全屏', () => viewer.toggleFullscreen()],
    ['info', 'ℹ', opts.i18n.buttons.info || '信息', () => viewer.toggleImageInfo()],
    ['thumbnails', '☰', opts.i18n.buttons.thumbnails || '缩略图', () => viewer.toggleThumbnails()],
    ['close', '✕', opts.i18n.buttons.close || '关闭', () => viewer.hide()],
  ]

  btnDefs.forEach(([key, label, title, handler]) => {
    if (opts.buttons[key]) {
      const btn = createBtn(label, ns + '__tool-btn ' + ns + '__tool-btn--' + key, toolBtnCfg)
      btn.title = title
      on(btn, 'click', e => {
        e.stopPropagation()
        handler()
      })
      toolbar.appendChild(btn)
    }
  })

  opts.customButtons.forEach(([label, handler]) => {
    const btn = createBtn(label, ns + '__tool-btn ' + ns + '__tool-btn--custom', toolBtnCfg)
    btn.title = label
    on(btn, 'click', e => {
      e.stopPropagation()
      handler.call(viewer)
    })
    toolbar.appendChild(btn)
  })

  stage.appendChild(toolbar)
  viewer.toolbarEl = toolbar

  container.appendChild(stage)
  document.body.appendChild(container)
  viewer.container = container
  viewer.stage = stage

  // 缩略图栏（虚拟列表容器）
  if (opts.showThumbBar) {
    const thumbBar = createDiv(ns + '__thumb-bar', {
      width: '100%',
      height: t.thumbBarHeight + 'px',
      flexShrink: '0',
      background: 'rgba(0,0,0,0.3)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: opts.buttons.thumbnails ? 'block' : 'none',
    })
    viewer.thumbBar = thumbBar
    container.appendChild(thumbBar)
  } else {
    viewer.thumbBar = null
  }

  return { container, stage }
}
