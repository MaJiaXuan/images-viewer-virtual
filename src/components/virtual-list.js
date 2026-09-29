/**
 * 虚拟列表组件 — BEM 命名规范
 * 只渲染视口内的 DOM 节点，通过对象池复用
 * 支持横向/纵向两种方向
 */

import { on, createDiv, createImg } from '../utils/dom.js'

export class VirtualThumbnailList {
  constructor(container, options) {
    this.container = container
    this.options = {
      direction: 'horizontal',
      itemWidth: 80,
      itemHeight: 56,
      gap: 10,
      buffer: 30,
      total: 0,
      onRender: () => {},
      onClick: () => {},
      className: 'images-viewer',
      ...options,
    }

    this.scrollPos = 0
    this.visibleCount = 0
    this.startIndex = 0
    this.endIndex = 0
    this.pool = []
    this.poolSize = 0

    this._init()
  }

  _init() {
    const ns = this.options.className
    const wrapper = createDiv(ns + '__thumb-list', {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'auto',
      scrollbarWidth: 'none',
    })

    const content = createDiv(ns + '__thumb-content', {
      position: 'relative',
    })
    this.contentEl = content

    wrapper.appendChild(content)
    this.container.appendChild(wrapper)
    this.wrapperEl = wrapper

    this._calcVisibleCount()
    this._initPool()
    this._updateTotalSize()
    this._computeMargin()
    this._render()

    on(wrapper, 'scroll', this._onScroll.bind(this), { passive: true })
  }

  _computeMargin() {
    const { direction, itemWidth, itemHeight, gap } = this.options
    const rect = this.container.getBoundingClientRect()
    const viewportSize = direction === 'horizontal' ? rect.width : rect.height
    const itemSizeVisible = direction === 'horizontal' ? itemWidth : itemHeight
    const margin = Math.max(0, Math.round(viewportSize / 2 - itemSizeVisible / 2 - gap))
    this._marginLeft = margin
    this._marginRight = margin
  }

  _calcVisibleCount() {
    const { direction, itemWidth, itemHeight, gap } = this.options
    const rect = this.container.getBoundingClientRect()
    const itemSize = direction === 'horizontal' ? itemWidth + gap : itemHeight + gap
    const viewportSize = direction === 'horizontal' ? rect.width : rect.height
    this.visibleCount = Math.ceil(viewportSize / itemSize) + 2
    this.poolSize = this.visibleCount + this.options.buffer * 2
  }

  _initPool() {
    const { itemWidth, itemHeight, gap } = this.options
    const ns = this.options.className

    for (let i = 0; i < this.poolSize; i++) {
      const el = createDiv(ns + '__thumb-item', {
        position: 'absolute',
        cursor: 'pointer',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        overflow: 'hidden',
        borderRadius: '4px',
      })

      const img = createImg('', {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
        borderRadius: '4px',
      })
      img.loading = 'lazy'
      img.decoding = 'async'

      el.appendChild(img)
      this.contentEl.appendChild(el)

      on(el, 'click', () => {
        const idx = parseInt(el.dataset.index, 10)
        if (!isNaN(idx)) this.options.onClick(idx)
      })

      this.pool.push({ el, img, index: -1 })
    }
  }

  _updateTotalSize() {
    const { direction, itemWidth, itemHeight, gap, total } = this.options
    const itemSize = direction === 'horizontal' ? itemWidth + gap : itemHeight + gap
    const totalSize = total * itemSize + gap

    if (direction === 'horizontal') {
      this.contentEl.style.width = totalSize + 'px'
      this.contentEl.style.height = '100%'
      this.contentEl.style.boxSizing = 'content-box'
    } else {
      this.contentEl.style.height = totalSize + 'px'
      this.contentEl.style.width = '100%'
      this.contentEl.style.boxSizing = 'content-box'
    }
  }

  _onScroll() {
    const { direction } = this.options
    this.scrollPos =
      direction === 'horizontal' ? this.wrapperEl.scrollLeft : this.wrapperEl.scrollTop
    this._render()
  }

  _render() {
    const { direction, itemWidth, itemHeight, gap, total, buffer } = this.options
    const itemSize = direction === 'horizontal' ? itemWidth + gap : itemHeight + gap
    const { scrollPos } = this

    let start = Math.floor((scrollPos - this._marginLeft) / itemSize)
    start = Math.max(0, start - buffer)
    let end = start + this.visibleCount + buffer * 2
    end = Math.min(total, end)

    const used = new Set()

    for (let i = start; i < end; i++) {
      let poolItem = this.pool.find(p => p.index === i)
      if (!poolItem) {
        poolItem = this.pool.find(
          p => !used.has(p) && (p.index < start || p.index >= end || p.index === -1)
        )
      }
      if (!poolItem) {
        poolItem = this.pool.find(p => !used.has(p))
      }

      if (poolItem) {
        used.add(poolItem)
        this._updatePoolItem(poolItem, i)
      }
    }

    this.pool.forEach(p => {
      if (!used.has(p)) {
        p.index = -1
        p.el.style.display = 'none'
        p.img.src = '' // 释放内存
      }
    })

    this.startIndex = start
    this.endIndex = end
  }

  _updatePoolItem(poolItem, index) {
    const { direction, itemWidth, itemHeight, gap } = this.options
    if (poolItem.index === index) return

    poolItem.index = index
    const { el, img } = poolItem
    el.style.display = 'block'
    el.dataset.index = index

    const pos = index * (direction === 'horizontal' ? itemWidth + gap : itemHeight + gap) + gap

    if (direction === 'horizontal') {
      el.style.left = pos + 'px'
      el.style.top = '50%'
      el.style.transform = 'translateY(-50%)'
      el.style.width = itemWidth + 'px'
      el.style.height = itemHeight + 'px'
    } else {
      el.style.top = pos + 'px'
      el.style.left = '50%'
      el.style.transform = 'translateX(-50%)'
      el.style.width = itemWidth + 'px'
      el.style.height = itemHeight + 'px'
    }

    this.options.onRender(index, el, img)
  }

  scrollToIndex(index, animated = true) {
    const { direction, itemWidth, itemHeight, gap, total } = this.options
    const itemSize = direction === 'horizontal' ? itemWidth + gap : itemHeight + gap
    const viewportSize =
      direction === 'horizontal' ? this.wrapperEl.clientWidth : this.wrapperEl.clientHeight

    if (viewportSize === 0) {
      requestAnimationFrame(() => this.scrollToIndex(index, animated))
      return
    }

    const totalSize = total * itemSize + gap
    const itemSizeVisible = direction === 'horizontal' ? itemWidth : itemHeight

    const itemPos = index * itemSize + gap
    const itemCenter = itemPos + this._marginLeft + itemSizeVisible / 2
    let scrollPos = itemCenter - viewportSize / 2

    const maxScroll = Math.max(0, totalSize + this._marginLeft + this._marginRight - viewportSize)
    scrollPos = Math.max(0, Math.min(scrollPos, maxScroll))

    const behavior = animated ? 'smooth' : 'auto'
    if (direction === 'horizontal') {
      this.wrapperEl.scrollTo({ left: scrollPos, behavior })
    } else {
      this.wrapperEl.scrollTo({ top: scrollPos, behavior })
    }
  }

  updateTotal(total) {
    this.options.total = total
    this._updateTotalSize()
    this._render()
  }

  refreshActive(currentIndex, activeColor) {
    const ns = this.options.className
    this.pool.forEach(p => {
      if (p.index === -1) return
      const isActive = p.index === currentIndex
      p.el.style.border = isActive ? `2px solid ${activeColor}` : '2px solid transparent'

      // 重新应用 class
      const baseClass = ns + '__thumb-item'
      const itemClass = this.options.getItemClass
        ? this.options.getItemClass(p.index)
        : this.options.itemClass || ''
      const activeItemClass = this.options.getActiveItemClass
        ? this.options.getActiveItemClass(p.index)
        : this.options.activeItemClass || ''

      let className = baseClass
      if (itemClass) className += ' ' + itemClass
      if (isActive && activeItemClass) className += ' ' + activeItemClass
      p.el.className = className
    })
  }

  destroy() {
    this.pool.forEach(p => {
      p.img.src = ''
    })
    this.wrapperEl.remove()
  }
}
