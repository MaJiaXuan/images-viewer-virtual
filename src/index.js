/**
 * ImagesViewer - 原生图片查看器，支持虚拟列表
 * 入口文件
 */

import './style.css'
import { copyImageToClipboard } from 'copy-image-clipboard'

import { buildDOM } from './components/viewer-dom.js'
import { bindEvents, unbindEvents } from './components/viewer-events.js'
import {
  applyTransform,
  onDragStart,
  onDragMove,
  onDragEnd,
  zoom as doZoom,
  zoomAt as doZoomAt,
  rotate as doRotate,
  reset as doReset,
} from './components/viewer-transform.js'
import { VirtualThumbnailList } from './components/virtual-list.js'
import { clamp, showToast, clearToast, off } from './utils/dom.js'

const DEFAULT_OPTIONS = {
  images: [],
  props: { url: 'url', title: 'title', thumbnail: 'thumbnail' },
  backdrop: false,
  minZoomRatio: 0.1,
  maxZoomRatio: 5,
  loop: true,
  retryOnError: false,
  defaultFallbackImage: '',
  zIndex: 5000,
  className: 'images-viewer',
  showThumbBar: true,
  showTitle: true,
  showCounter: true,
  showNavButtons: true,
  itemClass: '',
  activeItemClass: '',
  errorClass: '',
  buttons: {
    zoomIn: true,
    zoomOut: true,
    rotateLeft: true,
    rotateRight: true,
    reset: true,
    download: true,
    copy: false,
    fullscreen: true,
    prev: true,
    next: true,
    close: true,
    topClose: true,
    thumbnails: true,
    info: true,
  },
  customButtons: [],
  initialViewIndex: 0,
  imageInfo: { visible: false, showName: true, showDimensions: true },
  i18n: {
    buttons: { prev: '上一张', next: '下一张', close: '关闭', loading: '加载中...' },
    info: { name: '名称:', dimensions: '尺寸:' },
    helpTitle: '操作指引',
    helpKeys: '快捷键',
    helpGestures: '手势',
    helpButtons: '按钮',
  },
  theme: {
    viewerBgColor: 'rgba(0,0,0,0.85)',
    toolbarBgColor: 'rgba(40,40,40,0.8)',
    toolbarBorderRadius: '30px',
    toolbarPadding: '8px 16px',
    toolbarBottom: '24px',
    buttonBgColor: 'rgba(255,255,255,0.1)',
    buttonHoverBg: 'rgba(255,255,255,0.25)',
    buttonSize: '40px',
    buttonFontSize: '18px',
    buttonBorderRadius: '50%',
    navButtonBgColor: 'rgba(255,255,255,0.1)',
    navButtonHoverBg: 'rgba(255,255,255,0.25)',
    navButtonSize: '48px',
    navButtonFontSize: '20px',
    navButtonBorderRadius: '50%',
    topCloseBtnSize: '44px',
    topCloseBtnTop: '16px',
    topCloseBtnRight: '16px',
    topCloseBtnFontSize: '22px',
    topCloseBtnBgColor: 'rgba(255,255,255,0.1)',
    topCloseBtnHoverBg: 'rgba(255,255,255,0.25)',
    infoBgColor: 'rgba(40,40,40,0.8)',
    infoBorderRadius: '8px',
    infoPadding: '10px 14px',
    infoFontSize: '13px',
    infoTop: '60px',
    infoLeft: '16px',
    zoomIndicatorBg: 'rgba(40,40,40,0.8)',
    zoomIndicatorBorderRadius: '16px',
    zoomIndicatorPadding: '6px 12px',
    zoomIndicatorFontSize: '13px',
    zoomIndicatorTop: '16px',
    zoomIndicatorLeft: '16px',
    activeColor: '#4a9eff',
    textColor: '#fff',
    transitionSpeed: '0.3s',
    thumbItemWidth: 80,
    thumbItemHeight: 56,
    thumbGap: 10,
    thumbBarHeight: 90,
  },
  onShow: null,
  onClose: null,
  onChange: null,
  onRotate: null,
  onDrag: null,
  onZoom: null,
  onImageError: null,
  onInfo: null,
  onCounter: null,
}

// 旧选项名 → 新选项名 兼容映射
const OPTION_ALIASES = {
  minScale: 'minZoomRatio',
  maxScale: 'maxZoomRatio',
  namespace: 'className',
  closeOnMaskClick: 'backdrop',
  initialIndex: 'initialViewIndex',
}

class ImagesViewer {
  constructor(options) {
    if (typeof options === 'string') options = { images: [options] }
    if (Array.isArray(options)) options = { images: options }

    this.options = this._mergeOptions(options)
    this.images = this._normalizeImages(this.options.images)
    this.currentIndex = clamp(this.options.initialViewIndex || 0, 0, this.images.length - 1)
    this.visible = false

    // 变换状态
    this.scale = 1
    this.rotation = 0
    this.translateX = 0
    this.translateY = 0
    this.dragging = false
    this.dragStart = { x: 0, y: 0 }

    // 错误恢复状态
    this._retryCounts = new Map()

    this._show()
  }

  /**
   * 触发回调，所有回调统一入参：
   * { viewer, index, image, total, ...事件特有字段 }
   */
  _emit(name, extra = {}) {
    const cb = this.options[name]
    if (typeof cb !== 'function') return undefined
    return cb({
      viewer: this,
      index: this.currentIndex,
      image: this.images[this.currentIndex] || null,
      total: this.images.length,
      ...extra,
    })
  }

  _mergeOptions(opts) {
    // 旧名称兼容映射
    const normalizedOpts = {}
    for (const key in opts) {
      const targetKey = OPTION_ALIASES[key] || key
      normalizedOpts[targetKey] = opts[key]
    }

    const merged = { ...DEFAULT_OPTIONS }
    for (const key in normalizedOpts) {
      if (
        typeof normalizedOpts[key] === 'object' &&
        !Array.isArray(normalizedOpts[key]) &&
        normalizedOpts[key] !== null
      ) {
        merged[key] = this._deepMerge(merged[key], normalizedOpts[key])
      } else {
        merged[key] = normalizedOpts[key]
      }
    }
    return merged
  }

  _deepMerge(target, source) {
    if (typeof target !== 'object' || target === null) return source
    if (typeof source !== 'object' || source === null) return source
    if (Array.isArray(source)) return source
    const result = { ...target }
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(result[key], source[key])
      } else {
        result[key] = source[key]
      }
    }
    return result
  }

  _normalizeImages(images) {
    const { props } = this.options
    return images.map((item, idx) => {
      if (typeof item === 'string') {
        return { url: item, title: `图片 ${idx + 1}`, thumbnail: item }
      }
      const get = key => {
        const prop = props[key]
        if (typeof prop === 'function') return prop(item, idx)
        return item[prop !== undefined ? prop : key]
      }
      return {
        url: get('url') || '',
        title: get('title') || `图片 ${idx + 1}`,
        thumbnail: get('thumbnail') || get('url') || '',
        fallback: get('fallback') || '',
        itemClass: get('itemClass') || '',
        activeItemClass: get('activeItemClass') || '',
        errorClass: get('errorClass') || '',
        raw: item,
      }
    })
  }

  _getUrl(index) {
    const img = this.images[index]
    return img ? img.url : ''
  }
  _getThumb(index) {
    const img = this.images[index]
    return img ? img.thumbnail : ''
  }
  _getTitle(index) {
    const img = this.images[index]
    return img ? img.title : ''
  }

  _getFallback(index) {
    const img = this.images[index]
    return img
      ? img.fallback || this.options.defaultFallbackImage
      : this.options.defaultFallbackImage
  }

  _show() {
    if (this.visible) return
    this.visible = true
    this._bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    this._firstOpen = true

    buildDOM(this)
    bindEvents(this)

    if (this.options.showThumbBar && this.options.buttons.thumbnails) {
      this._initVirtualThumbnails()
    }

    this.loadCurrentImage(this.currentIndex, false)

    this._showRaf = requestAnimationFrame(() => {
      if (this.container) this.container.style.opacity = '1'
    })

    if (this.options.imageInfo.visible) {
      this.toggleImageInfo()
    }

    this._emit('onShow')
  }

  _initVirtualThumbnails() {
    const t = this.options.theme
    const ns = this.options.className
    this.vList = new VirtualThumbnailList(this.thumbBar, {
      direction: 'horizontal',
      total: this.images.length,
      itemWidth: t.thumbItemWidth,
      itemHeight: t.thumbItemHeight,
      gap: t.thumbGap,
      buffer: 3,
      className: ns,
      onRender: (index, el, img) => {
        const src = this._getThumb(index)
        const fallback = this._getFallback(index)
        const imageData = this.images[index]
        const isActive = index === this.currentIndex

        // 应用 itemClass
        const baseClass = ns + '__thumb-item'
        const itemClass = imageData?.itemClass || this.options.itemClass
        let className = itemClass ? `${baseClass} ${itemClass}` : baseClass
        if (isActive) {
          const activeClass = imageData?.activeItemClass || this.options.activeItemClass
          if (activeClass) className += ` ${activeClass}`
        }
        el.className = className

        el.style.border = isActive ? `2px solid ${t.activeColor}` : '2px solid transparent'
        if (img.dataset.src !== src) {
          img.dataset.src = src
          img.src = src
          img.onerror = () => {
            if (fallback && img.src !== fallback) {
              img.src = fallback
            }
          }
        }
      },
      onClick: index => this.loadCurrentImage(index),
      getItemClass: index => this.images[index]?.itemClass || this.options.itemClass,
      getActiveItemClass: index =>
        this.images[index]?.activeItemClass || this.options.activeItemClass,
    })
  }

  // ===== 图片加载 =====
  loadCurrentImage(index, animated = true) {
    const oldIndex = this.currentIndex
    this.currentIndex = clamp(index, 0, this.images.length - 1)
    const url = this._getUrl(this.currentIndex)

    this._updateCounter()

    // 更新标题
    if (this.titleEl) {
      this.titleEl.textContent = this._getTitle(this.currentIndex)
    }

    // 重置变换
    this.scale = 1
    this.rotation = 0
    this.translateX = 0
    this.translateY = 0
    applyTransform(this)

    // 重置错误恢复状态
    if (this.mainImg) {
      delete this.mainImg.dataset.fallbackTried
      delete this.mainImg.dataset.usingFallback
      const errCls = this.images[this.currentIndex]?.errorClass || this.options.errorClass
      if (errCls && this.mainImg.classList) this.mainImg.classList.remove(errCls)
      this._retryCounts.delete(this.currentIndex)
    }

    this.loadingEl.style.display = 'block'
    this.mainImg.style.opacity = '0.5'
    this.mainImg.src = url

    // 应用 EXIF 方向旋转
    const orientation = this.images[this.currentIndex]?.orientation
    if (orientation && orientation > 1) {
      this._applyExifOrientation(orientation)
    }

    if (this.vList) {
      this.vList.scrollToIndex(this.currentIndex, animated)
      this.vList.refreshActive(this.currentIndex, this.options.theme.activeColor)
    }

    this._emit('onChange', {
      oldIndex,
      direction: this.currentIndex > oldIndex ? 'next' : 'prev',
    })

    // 信息面板已显示时，自动更新内容
    if (this.infoPanel && this.infoPanel.style.display === 'block') {
      this._refreshInfoPanel()
    }
    return this
  }

  _refreshInfoPanel() {
    const panel = this.infoPanel
    const { imageInfo, i18n, className } = this.options
    const ns = className
    const img = this.images[this.currentIndex]
    let html = ''
    const custom = this._emit('onInfo', {
      scale: this.scale,
      rotation: this.rotation,
    })
    if (typeof custom === 'string') {
      html = custom
    } else {
      if (imageInfo.showName) html += `<div>${i18n.info.name} ${img.title}</div>`
      if (imageInfo.showDimensions) {
        html += `<div>${i18n.info.dimensions} ${this.mainImg.naturalWidth || '-'} × ${this.mainImg.naturalHeight || '-'}</div>`
      }
    }

    html += `
      <div class="${ns}__info-divider"></div>
      <div class="${ns}__help-title">${i18n.helpTitle}</div>
      <div class="${ns}__help-section">
        <div class="${ns}__help-label">${i18n.helpKeys}</div>
        <div class="${ns}__help-row"><kbd>←</kbd> / <kbd>→</kbd> <span>上一张 / 下一张</span></div>
        <div class="${ns}__help-row"><kbd>+</kbd> / <kbd>-</kbd> <span>放大 / 缩小</span></div>
        <div class="${ns}__help-row"><kbd>0</kbd> <span>重置缩放与旋转</span></div>
        <div class="${ns}__help-row"><kbd>f</kbd> <span>切换全屏</span></div>
        <div class="${ns}__help-row"><kbd>i</kbd> <span>切换信息面板</span></div>
        <div class="${ns}__help-row"><kbd>Esc</kbd> <span>关闭查看器</span></div>
        <div class="${ns}__help-row"><kbd>g</kbd> <span>跳转到指定图片</span></div>
      </div>
      <div class="${ns}__help-section">
        <div class="${ns}__help-label">${i18n.helpGestures}</div>
        <div class="${ns}__help-row"><span>双击</span> <span>重置变换</span></div>
        <div class="${ns}__help-row"><span>滚轮</span> <span>缩放</span></div>
        <div class="${ns}__help-row"><span>拖拽</span> <span>平移图片（缩放后）</span></div>
      </div>
    `

    panel.innerHTML = html
  }

  _onMainLoad() {
    this.loadingEl.style.display = 'none'
    this.mainImg.style.opacity = '1'
    delete this.mainImg.dataset.fallbackTried
    this._retryCounts.delete(this.currentIndex)

    delete this.mainImg.dataset.usingFallback

    // 移除错误 class
    const errCls = this.images[this.currentIndex]?.errorClass || this.options.errorClass
    if (errCls && this.mainImg.classList) this.mainImg.classList.remove(errCls)
  }

  _onMainError() {
    this.loadingEl.style.display = 'none'

    const url = this._getUrl(this.currentIndex)
    const fallback = this._getFallback(this.currentIndex)

    // 先尝试 fallback（每张图只尝试一次）
    if (!this.mainImg.dataset.fallbackTried && fallback) {
      this.mainImg.dataset.fallbackTried = '1'
      this.mainImg.dataset.usingFallback = '1'
      this.mainImg.src = fallback
      return
    }

    delete this.mainImg.dataset.fallbackTried
    delete this.mainImg.dataset.usingFallback

    // 应用错误 class
    const errCls = this.images[this.currentIndex]?.errorClass || this.options.errorClass
    if (errCls && this.mainImg.classList) this.mainImg.classList.add(errCls)

    this._emit('onImageError', { url })

    if (this.options.retryOnError) {
      const retryCount = (this._retryCounts.get(this.currentIndex) || 0) + 1
      if (retryCount > 3) return
      this._retryCounts.set(this.currentIndex, retryCount)
      this._retryTimer = setTimeout(() => {
        if (this.mainImg) this.mainImg.src = url + '?retry=' + Date.now()
      }, 1000)
    }
  }

  // ===== 变换操作（代理到组件）=====
  _onDragStart(e) {
    onDragStart(this, e)
  }
  _onDragMove(e) {
    onDragMove(this, e)
  }
  _onDragEnd() {
    onDragEnd(this)
  }
  _zoomAt(delta, cx, cy) {
    doZoomAt(this, delta, cx, cy)
  }

  zoom(delta) {
    doZoom(this, delta)
    return this
  }
  rotate(deg) {
    doRotate(this, deg)
    return this
  }
  reset() {
    doReset(this)
    return this
  }

  // 对齐 Viewer.js API
  zoomTo(ratio) {
    this.scale = clamp(ratio, this.options.minZoomRatio, this.options.maxZoomRatio)
    applyTransform(this)
    return this
  }

  rotateTo(degree) {
    this.rotation = degree
    applyTransform(this)
    this._emit('onRotate', { rotation: this.rotation })
    return this
  }

  move(x, y = x) {
    this.translateX += x
    this.translateY += y
    applyTransform(this)
    return this
  }

  moveTo(x, y = x) {
    this.translateX = x
    this.translateY = y
    applyTransform(this)
    return this
  }

  scale(scaleX, scaleY = scaleX) {
    // 仅支持翻转（负值）或重置，不扩展为自由缩放
    if (scaleX < 0 || scaleY < 0) {
      this.mainImg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale * scaleX}, ${this.scale * scaleY}) rotate(${this.rotation}deg)`
    }
    return this
  }

  scaleX(scaleX) {
    return this.scale(scaleX, 1)
  }

  scaleY(scaleY) {
    return this.scale(1, scaleY)
  }

  toggle() {
    // 在自然尺寸和初始尺寸之间切换
    const naturalW = this.mainImg.naturalWidth || this.mainImg.width || 1
    const naturalH = this.mainImg.naturalHeight || this.mainImg.height || 1
    const stageW = this.stage.clientWidth
    const stageH = this.stage.clientHeight
    const ratio = Math.min(stageW / naturalW, stageH / naturalH)
    const targetScale = this.scale === 1 ? ratio : 1
    this.scale = clamp(targetScale, this.options.minZoomRatio, this.options.maxZoomRatio)
    applyTransform(this)
    return this
  }

  play() {
    this._playInterval = setInterval(() => this.next(), this.options.interval || 5000)
    return this
  }

  stop() {
    if (this._playInterval) {
      clearInterval(this._playInterval)
      this._playInterval = null
    }
    return this
  }

  update() {
    // 重新初始化图片数据，用于动态增删图片
    this._normalizeImages()
    if (this.vList) {
      this.vList.updateTotal(this.images.length)
      this.vList.refreshActive(this.currentIndex, this.options.theme.activeColor)
    }
    this._updateCounter()
    return this
  }

  tooltip() {
    // 显示当前缩放百分比
    if (this.zoomIndEl) {
      this.zoomIndEl.textContent = `缩放: ${Math.round(this.scale * 100)}%`
      this.zoomIndEl.style.opacity = '1'
      clearTimeout(this._zoomTimer)
      this._zoomTimer = setTimeout(() => {
        this.zoomIndEl.style.opacity = '0'
      }, 1500)
    }
    return this
  }

  // ===== 导航 =====
  view(index, animated = true) {
    const total = this.images.length
    if (total === 0) return this
    let idx = index
    if (idx < 0) idx = 0
    if (idx >= total) idx = total - 1
    if (idx === this.currentIndex) return this
    this.loadCurrentImage(idx, animated)
    return this
  }

  prev() {
    let idx = this.currentIndex - 1
    const total = this.images.length
    if (idx < 0) {
      if (this.options.loop) {
        idx = total - 1
        // 首尾循环时去掉动画
        this.loadCurrentImage(idx, false)
        return this
      }
      idx = 0
    }
    this.loadCurrentImage(idx)
    return this
  }

  next() {
    let idx = this.currentIndex + 1
    const total = this.images.length
    if (idx >= total) {
      if (this.options.loop) {
        idx = 0
        // 首尾循环时去掉动画
        this.loadCurrentImage(idx, false)
        return this
      }
      idx = total - 1
    }
    this.loadCurrentImage(idx)
    return this
  }

  // ===== UI =====
  _updateCounter() {
    if (!this.counterEl) return
    const custom = this._emit('onCounter')
    this.counterEl.textContent =
      typeof custom === 'string' ? custom : `${this.currentIndex + 1} / ${this.images.length}`
  }

  toggleTitle() {
    if (this.titleEl) {
      this.titleEl.style.display = this.titleEl.style.display === 'none' ? '' : 'none'
    }
    return this
  }

  toggleCounter() {
    if (this.counterEl) {
      this.counterEl.style.display = this.counterEl.style.display === 'none' ? '' : 'none'
    }
    return this
  }

  toggleNavButtons() {
    if (this._navPrevEl) {
      this._navPrevEl.style.display = this._navPrevEl.style.display === 'none' ? '' : 'none'
    }
    if (this._navNextEl) {
      this._navNextEl.style.display = this._navNextEl.style.display === 'none' ? '' : 'none'
    }
    return this
  }

  toggleImageInfo() {
    const panel = this.infoPanel
    const isVisible = panel.style.display !== 'none'
    if (isVisible) {
      panel.style.display = 'none'
      return this
    }
    this._refreshInfoPanel()
    panel.style.display = 'block'
    return this
  }

  toggleThumbnails() {
    if (!this.thumbBar) return this
    const isHidden = this.thumbBar.style.display === 'none'
    this.thumbBar.style.display = isHidden ? 'block' : 'none'
    if (isHidden && this.vList) {
      this.vList.scrollToIndex(this.currentIndex)
    }
    return this
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    return this
  }

  async copyImage() {
    const url = this._getUrl(this.currentIndex)
    const toastClass = this.options.className + '__toast'

    showToast('正在复制...', 'info', this.container, toastClass)

    try {
      await copyImageToClipboard(url)
      showToast('图片已复制到剪贴板', 'success', this.container, toastClass)
      return true
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Cannot copy this type of image')) {
        showToast('复制失败：仅支持 PNG 和 JPG 格式图片', 'error', this.container, toastClass)
      } else {
        showToast('复制失败：' + msg, 'error', this.container, toastClass)
      }
      return false
    }
  }

  async downloadImage() {
    const url = this._getUrl(this.currentIndex)
    const title = this._getTitle(this.currentIndex) || 'image'
    const img = this.mainImg
    const toastClass = this.options.className + '__toast'
    const toast = (msg, ok) => showToast(msg, ok ? 'success' : 'error', this.container, toastClass)

    showToast('正在下载...', 'info', this.container, toastClass)

    // 方式 A：canvas 导出 dataURL + a.download（图片已加载）
    try {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || img.width || 1920
      canvas.height = img.naturalHeight || img.height || 1080
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = title + '.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast('已开始下载', true)
      return
    } catch {
      // 继续降级
    }

    // 方式 B：fetch blob + URL.createObjectURL + a.download（尝试跨域）
    try {
      const res = await fetch(url, { mode: 'cors', cache: 'no-store' })
      if (res.ok) {
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = title + (blob.type === 'image/jpeg' ? '.jpg' : '.png')
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
        toast('已开始下载', true)
        return
      }
    } catch {
      // 继续降级
    }

    // 方式 C：直接 a[download]（同域有效，跨域可能不生效）
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = title
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast('已开始下载', true)
      return
    } catch {
      // 继续降级
    }

    // 方式 D：最后降级，在新窗口打开
    try {
      window.open(url, '_blank')
      toast('已在新窗口打开图片', true)
    } catch {
      toast('下载失败', false)
    }
  }

  // ===== 关闭 =====
  hide() {
    if (!this.visible) return this
    this.visible = false
    this.container.style.opacity = '0'
    const delay = parseFloat(this.options.theme.transitionSpeed) * 1000 || 300
    this._closeTimer = setTimeout(() => this._destroy(), delay)
    return this
  }

  _destroy() {
    unbindEvents(this)

    // 清理所有 timer
    if (this._zoomTimer) {
      clearTimeout(this._zoomTimer)
      this._zoomTimer = null
    }
    if (this._retryTimer) {
      clearTimeout(this._retryTimer)
      this._retryTimer = null
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer)
      this._closeTimer = null
    }
    if (this._showRaf) {
      cancelAnimationFrame(this._showRaf)
      this._showRaf = null
    }
    if (this._playInterval) {
      clearInterval(this._playInterval)
      this._playInterval = null
    }

    // 清理 toast
    clearToast()
    const ns = this.options.className
    if (document.querySelectorAll) {
      document.querySelectorAll('.' + ns + '__toast').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el)
      })
    }

    if (this._onMainLoadRef && this.mainImg) {
      off(this.mainImg, 'load', this._onMainLoadRef)
      this._onMainLoadRef = null
    }
    if (this._onMainErrorRef && this.mainImg) {
      off(this.mainImg, 'error', this._onMainErrorRef)
      this._onMainErrorRef = null
    }
    if (this._retryCounts) {
      this._retryCounts.clear()
    }
    if (this.vList) this.vList.destroy()
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    this.container = null
    this.mainImg = null
    this._handlers = null
    document.body.style.overflow = this._bodyOverflow || ''
    this._emit('onClose')
  }
}

export default ImagesViewer
