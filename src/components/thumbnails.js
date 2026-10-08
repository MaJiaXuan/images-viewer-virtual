/**
 * 缩略图虚拟列表初始化 —— 查看器与 VirtualThumbnailList 之间的粘合层
 */

import { VirtualThumbnailList } from './virtual-list.js'

const BUFFER_SIZE = 3 // 视口外额外渲染的缩略图数量

export function initVirtualThumbnails(viewer) {
  const t = viewer.options.theme
  const ns = viewer.options.className

  viewer.vList = new VirtualThumbnailList(viewer.thumbBar, {
    direction: 'horizontal',
    total: viewer.images.length,
    itemWidth: t.thumbItemWidth,
    itemHeight: t.thumbItemHeight,
    gap: t.thumbGap,
    buffer: BUFFER_SIZE,
    className: ns,
    onRender: (index, el, img) => {
      const src = viewer._getThumb(index)
      const fallback = viewer._getFallback(index)
      const imageData = viewer.images[index]
      const isActive = index === viewer.currentIndex

      // 应用 itemClass
      const baseClass = ns + '__thumb-item'
      const itemClass = imageData?.itemClass || viewer.options.itemClass
      let className = itemClass ? `${baseClass} ${itemClass}` : baseClass
      if (isActive) {
        const activeClass = imageData?.activeItemClass || viewer.options.activeItemClass
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
    onClick: index => viewer.loadCurrentImage(index),
    getItemClass: index => viewer.images[index]?.itemClass || viewer.options.itemClass,
    getActiveItemClass: index =>
      viewer.images[index]?.activeItemClass || viewer.options.activeItemClass,
  })
}
