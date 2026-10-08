/**
 * ImagesViewer - 原生图片查看器，支持虚拟列表
 * 入口文件
 */

import './style.css'

import { buildInfoPanelHtml } from './components/info-panel.js'
import { applyOrientation } from './components/orientation.js'
import { initVirtualThumbnails } from './components/thumbnails.js'
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
import { clearToast, clamp, off } from './utils/dom.js'
import { copyImageFromUrl, downloadImageFile } from './utils/image-file.js'
import { mergeOptions } from './utils/options.js'

const MAX_RETRY_COUNT = 3 // 加载失败后的最大自动重试次数
const RETRY_DELAY_MS = 1000 // 失败重试的间隔
const DEFAULT_PLAY_INTERVAL_MS = 5000 // play() 未指定 interval 时的轮播间隔
const ZOOM_INDICATOR_HIDE_MS = 1500 // 缩放指示器自动隐藏延时
const PERCENT = 100 // 缩放倍率 → 百分比
const MS_PER_SECOND = 1000 // 解析 transitionSpeed（形如 '0.3s'）用
const DEFAULT_CLOSE_DELAY_MS = 300 // 过渡时长解析失败时的关闭延时

// 销毁时需清理的定时器：字段名 → 对应的取消函数
const TIMER_CLEARERS = [
  ['_zoomTimer', clearTimeout],
  ['_retryTimer', clearTimeout],
  ['_closeTimer', clearTimeout],
  ['_showRaf', cancelAnimationFrame],
  ['_playInterval', clearInterval],
]

class ImagesViewer {
  constructor(options) {
    if (typeof options === 'string') options = { images: [options] }
    if (Array.isArray(options)) options = { images: options }

    this.options = mergeOptions(options)
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
        orientation: get('orientation'),
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

  _itemErrorClass(index) {
    return this.images[index]?.errorClass || this.options.errorClass
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
      initVirtualThumbnails(this)
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

  // ===== 图片加载 =====
  loadCurrentImage(index, animated = true, { resetTransform = true } = {}) {
    const oldIndex = this.currentIndex
    this.currentIndex = clamp(index, 0, this.images.length - 1)
    const url = this._getUrl(this.currentIndex)

    this._updateCounter()
    this._syncTitle()

    // 重置变换（update() 刷新数据时若当前图片未变化会跳过，保留用户缩放状态）
    if (resetTransform) this._resetTransform()
    this._resetErrorState()

    this.loadingEl.style.display = 'block'
    this.mainImg.style.opacity = '0.5'
    this.mainImg.src = url

    this._applyOrientation()
    this._syncThumbnails(animated)

    // 索引未变化时不视为“切换”，避免数据刷新（update）触发误报
    if (oldIndex !== this.currentIndex) {
      this._emit('onChange', {
        oldIndex,
        direction: this.currentIndex > oldIndex ? 'next' : 'prev',
      })
    }

    // 信息面板已显示时，自动更新内容
    if (this.infoPanel && this.infoPanel.style.display === 'block') {
      this._refreshInfoPanel()
    }
    return this
  }

  _syncTitle() {
    if (this.titleEl) {
      this.titleEl.textContent = this._getTitle(this.currentIndex)
    }
  }

  _resetTransform() {
    this.scale = 1
    this.rotation = 0
    this.translateX = 0
    this.translateY = 0
    applyTransform(this)
  }

  _resetErrorState() {
    if (!this.mainImg) return

    delete this.mainImg.dataset.fallbackTried
    delete this.mainImg.dataset.usingFallback
    const errCls = this._itemErrorClass(this.currentIndex)
    if (errCls && this.mainImg.classList) this.mainImg.classList.remove(errCls)
    this._retryCounts.delete(this.currentIndex)
  }

  /**
   * 应用图片方向（EXIF 1-8 → CSS transform），逻辑见 components/orientation.js：
   * 数据里显式的 orientation 优先，其次 autoOrientation 自动解析，否则清除方向。
   */
  _applyOrientation() {
    applyOrientation(this)
  }

  _syncThumbnails(animated) {
    if (!this.vList) return

    this.vList.scrollToIndex(this.currentIndex, animated)
    this.vList.refreshActive(this.currentIndex, this.options.theme.activeColor)
  }

  _refreshInfoPanel() {
    const img = this.images[this.currentIndex]
    const custom = this._emit('onInfo', {
      scale: this.scale,
      rotation: this.rotation,
    })

    this.infoPanel.innerHTML = buildInfoPanelHtml({
      ns: this.options.className,
      i18n: this.options.i18n,
      imageInfo: this.options.imageInfo,
      title: img.title,
      mainImg: this.mainImg,
      custom,
    })
  }

  _onMainLoad() {
    this.loadingEl.style.display = 'none'
    this.mainImg.style.opacity = '1'
    delete this.mainImg.dataset.fallbackTried
    delete this.mainImg.dataset.usingFallback
    this._retryCounts.delete(this.currentIndex)

    // 移除错误 class
    const errCls = this._itemErrorClass(this.currentIndex)
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
    const errCls = this._itemErrorClass(this.currentIndex)
    if (errCls && this.mainImg.classList) this.mainImg.classList.add(errCls)

    this._emit('onImageError', { url })

    if (this.options.retryOnError) {
      const retryCount = (this._retryCounts.get(this.currentIndex) || 0) + 1
      if (retryCount > MAX_RETRY_COUNT) return
      this._retryCounts.set(this.currentIndex, retryCount)
      this._retryTimer = setTimeout(() => {
        if (this.mainImg) this.mainImg.src = url + '?retry=' + Date.now()
      }, RETRY_DELAY_MS)
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
    this._playInterval = setInterval(
      () => this.next(),
      this.options.interval || DEFAULT_PLAY_INTERVAL_MS
    )
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
    // 重新初始化图片数据，用于动态增删/替换图片
    const prevIndex = this.currentIndex
    const prevUrl = this._getUrl(prevIndex)

    this.images = this._normalizeImages(this.options.images)
    this._retryCounts.clear()

    // 数据源可能被整体替换（长度不变但 URL 变化），需强制缩略图池重跑渲染
    if (this.vList) {
      this.vList.updateTotal(this.images.length)
      this.vList.invalidate()
    }

    // 图片被全部删除时没有可加载的内容，仅同步计数器
    if (this.images.length === 0) {
      this.currentIndex = 0
      this._updateCounter()
      return this
    }

    // 图片被删除后当前索引可能越界，先收敛再加载
    // 注意不要在调用 loadCurrentImage 前改写 currentIndex，否则其内部记录的 oldIndex 会失真
    const idx = clamp(prevIndex, 0, this.images.length - 1)

    // 当前图片未变化时保留缩放/旋转状态，仅换图才重置变换
    const sameImage = idx === prevIndex && this._getUrl(idx) === prevUrl
    this.loadCurrentImage(idx, false, { resetTransform: !sameImage })
    return this
  }

  tooltip() {
    // 显示当前缩放百分比
    if (this.zoomIndEl) {
      this.zoomIndEl.textContent = `缩放: ${Math.round(this.scale * PERCENT)}%`
      this.zoomIndEl.style.opacity = '1'
      clearTimeout(this._zoomTimer)
      this._zoomTimer = setTimeout(() => {
        this.zoomIndEl.style.opacity = '0'
      }, ZOOM_INDICATOR_HIDE_MS)
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
    return copyImageFromUrl(this)
  }

  async downloadImage() {
    await downloadImageFile(this)
  }

  // ===== 关闭 =====
  hide() {
    if (!this.visible) return this
    this.visible = false
    this.container.style.opacity = '0'
    const delay =
      parseFloat(this.options.theme.transitionSpeed) * MS_PER_SECOND || DEFAULT_CLOSE_DELAY_MS
    this._closeTimer = setTimeout(() => this._destroy(), delay)
    return this
  }

  _clearTimers() {
    for (const [key, clear] of TIMER_CLEARERS) {
      if (this[key]) {
        clear(this[key])
        this[key] = null
      }
    }
  }

  _removeToastNodes() {
    clearToast()
    if (!document.querySelectorAll) return

    const ns = this.options.className
    document.querySelectorAll('.' + ns + '__toast').forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el)
    })
  }

  _detachImageHandlers() {
    if (this._onMainLoadRef && this.mainImg) {
      off(this.mainImg, 'load', this._onMainLoadRef)
      this._onMainLoadRef = null
    }
    if (this._onMainErrorRef && this.mainImg) {
      off(this.mainImg, 'error', this._onMainErrorRef)
      this._onMainErrorRef = null
    }
  }

  _destroy() {
    unbindEvents(this)
    this._clearTimers()
    this._removeToastNodes()
    this._detachImageHandlers()

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
