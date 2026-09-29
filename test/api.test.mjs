/**
 * ImagesViewer 综合测试 — ESM 格式
 * 运行: node --import test/loader.mjs test/api.test.mjs
 */

import assert from 'assert'
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

import './setup.mjs'
import { VirtualThumbnailList } from '../src/components/virtual-list.js'
import ImagesViewer from '../src/index.js'
import { clamp, createDiv, createBtn } from '../src/utils/dom.js'
import { throttle, rafThrottle } from '../src/utils/throttle.js'

register(pathToFileURL('./test/loader.mjs'))

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✅ ${name}`)
  } catch (e) {
    failed++
    console.error(`  ❌ ${name}: ${e.message}`)
  }
}

console.log('\n========== ImagesViewer API 测试 ==========\n')

// ===== 1. dom utils =====
console.log('📦 utils/dom.js')
test('clamp 正常范围', () => assert.strictEqual(clamp(5, 0, 10), 5))
test('clamp 低于最小值', () => assert.strictEqual(clamp(-2, 0, 10), 0))
test('clamp 高于最大值', () => assert.strictEqual(clamp(15, 0, 10), 10))
test('createDiv 创建 div', () => {
  const el = createDiv('test-class', { width: '100px' })
  assert.strictEqual(el.tagName, 'div')
  assert.strictEqual(el.className, 'test-class')
  assert.strictEqual(el.style.width, '100px')
})
test('createBtn 创建按钮', () => {
  const btn = createBtn('+', 'btn', {
    size: '40px',
    fontSize: '18px',
    bg: '#000',
    hoverBg: '#333',
    radius: '50%',
    textColor: '#fff',
  })
  assert.strictEqual(btn.tagName, 'button')
  assert.strictEqual(btn.textContent, '+')
})

// ===== 2. LRUCache ===== (已移除：缓存由浏览器 img lazy 接管)
// ===== 3. throttle =====
console.log('\n📦 utils/throttle.js')
test('throttle 限制调用频率', () => {
  let count = 0
  const fn = throttle(() => count++, 50)
  fn()
  fn()
  fn()
  assert.strictEqual(count, 1)
})

// ===== 4. VirtualThumbnailList =====
console.log('\n📦 components/virtual-list.js')
const container = document.createElement('div')
container.style.width = '1000px'
container.style.height = '90px'

test('VirtualThumbnailList 构造', () => {
  const list = new VirtualThumbnailList(container, { total: 100 })
  assert.strictEqual(list.options.total, 100)
  assert.strictEqual(list.options.direction, 'horizontal')
  list.destroy()
})
test('VirtualThumbnailList 计算可见数量', () => {
  const list = new VirtualThumbnailList(container, { total: 100, itemWidth: 80, gap: 10 })
  assert(list.visibleCount > 0)
  list.destroy()
})
test('VirtualThumbnailList 对象池复用', () => {
  const list = new VirtualThumbnailList(container, { total: 100 })
  assert(list.pool.length > 0)
  list.destroy()
})
test('VirtualThumbnailList scrollToIndex 滚动', () => {
  const list = new VirtualThumbnailList(container, { total: 100 })
  list.scrollToIndex(50)
  assert(list.wrapperEl.scrollLeft >= 0)
  list.destroy()
})
test('VirtualThumbnailList updateTotal', () => {
  const list = new VirtualThumbnailList(container, { total: 50 })
  list.updateTotal(200)
  assert.strictEqual(list.options.total, 200)
  list.destroy()
})
test('VirtualThumbnailList refreshActive', () => {
  const list = new VirtualThumbnailList(container, { total: 100 })
  list.refreshActive(5, '#4a9eff')
  list.destroy()
})
test('VirtualThumbnailList destroy 清理', () => {
  const list = new VirtualThumbnailList(container, { total: 100 })
  list.destroy()
  assert(list.wrapperEl.parentNode === null || list.wrapperEl.parentNode === undefined)
})

// ===== 5. ImagesViewer 构造 =====
console.log('\n📦 src/index.js — 构造选项')

test('ImagesViewer 字符串数组', () => {
  const v = new ImagesViewer(['https://a.jpg', 'https://b.jpg'])
  assert.strictEqual(v.images.length, 2)
  assert.strictEqual(v.images[0].url, 'https://a.jpg')
  v.hide()
})

test('ImagesViewer 对象数组', () => {
  const v = new ImagesViewer({
    images: [{ url: 'https://a.jpg', title: 'A', thumbnail: 'https://a-t.jpg' }],
  })
  assert.strictEqual(v.images[0].title, 'A')
  v.hide()
})

test('ImagesViewer 空数组', () => {
  const v = new ImagesViewer({ images: [] })
  assert.strictEqual(v.images.length, 0)
  v.hide()
})

test('ImagesViewer 自定义 props 映射', () => {
  const v = new ImagesViewer({
    images: [{ src: 'https://a.jpg', name: 'A', thumb: 'https://a-t.jpg' }],
    props: { url: 'src', title: 'name', thumbnail: 'thumb' },
  })
  assert.strictEqual(v.images[0].url, 'https://a.jpg')
  assert.strictEqual(v.images[0].title, 'A')
  v.hide()
})

test('ImagesViewer props 函数映射', () => {
  const v = new ImagesViewer({
    images: [{ src: 'https://a.jpg' }],
    props: { url: 'src', title: (item, idx) => `图片 ${idx + 1}` },
  })
  assert.strictEqual(v.images[0].title, '图片 1')
  v.hide()
})

test('ImagesViewer fallback 字段保留', () => {
  const v = new ImagesViewer({
    images: [{ url: 'https://a.jpg', fallback: 'https://fb.jpg' }],
  })
  assert.strictEqual(v.images[0].fallback, 'https://fb.jpg')
  v.hide()
})

test('ImagesViewer 默认 fallback', () => {
  const v = new ImagesViewer({
    images: [{ url: 'https://a.jpg' }],
    defaultFallbackImage: 'https://default.jpg',
  })
  assert.strictEqual(v._getFallback(0), 'https://default.jpg')
  v.hide()
})

test('ImagesViewer 单图 fallback 覆盖全局', () => {
  const v = new ImagesViewer({
    images: [{ url: 'https://a.jpg', fallback: 'https://single.jpg' }],
    defaultFallbackImage: 'https://default.jpg',
  })
  assert.strictEqual(v._getFallback(0), 'https://single.jpg')
  v.hide()
})

test('ImagesViewer 选项合并', () => {
  const v = new ImagesViewer({
    images: ['https://a.jpg'],
    loop: false,
    minScale: 0.5,
  })
  assert.strictEqual(v.options.loop, false)
  assert.strictEqual(v.options.minZoomRatio, 0.5)
  assert.strictEqual(v.options.maxZoomRatio, 5)
  v.hide()
})

test('ImagesViewer i18n 合并', () => {
  const v = new ImagesViewer({
    images: ['https://a.jpg'],
    i18n: { buttons: { prev: 'Previous' } },
  })
  assert.strictEqual(v.options.i18n.buttons.prev, 'Previous')
  assert.strictEqual(v.options.i18n.buttons.next, '下一张')
  v.hide()
})

// ===== 6. 实例方法 =====
console.log('\n📦 src/index.js — 实例方法')

test('prev() 循环', () => {
  const v = new ImagesViewer({ images: ['a', 'b', 'c'], initialIndex: 0 })
  v.prev()
  assert.strictEqual(v.currentIndex, 2)
  v.hide()
})

test('prev() 不循环', () => {
  const v = new ImagesViewer({ images: ['a', 'b', 'c'], loop: false, initialViewIndex: 0 })
  v.prev()
  assert.strictEqual(v.currentIndex, 0)
  v.hide()
})

test('next() 循环', () => {
  const v = new ImagesViewer({ images: ['a', 'b', 'c'], initialViewIndex: 2 })
  v.next()
  assert.strictEqual(v.currentIndex, 0)
  v.hide()
})

test('next() 不循环', () => {
  const v = new ImagesViewer({ images: ['a', 'b', 'c'], loop: false, initialViewIndex: 2 })
  v.next()
  assert.strictEqual(v.currentIndex, 2)
  v.hide()
})

test('zoom() 缩放', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.zoom(0.5)
  assert.strictEqual(v.scale, 1.5)
  v.hide()
})

test('zoom() 最小限制', () => {
  const v = new ImagesViewer({ images: ['a'], minZoomRatio: 0.5 })
  v.zoom(-10)
  assert.strictEqual(v.scale, 0.5)
  v.hide()
})

test('rotate() 旋转', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.rotate(90)
  assert.strictEqual(v.rotation, 90)
  v.rotate(-90)
  assert.strictEqual(v.rotation, 0)
  v.hide()
})

test('reset() 重置', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.zoom(0.5)
  v.rotate(90)
  v.reset()
  assert.strictEqual(v.scale, 1)
  assert.strictEqual(v.rotation, 0)
  assert.strictEqual(v.translateX, 0)
  assert.strictEqual(v.translateY, 0)
  v.hide()
})

test('toggleThumbnails() 切换显隐', () => {
  const v = new ImagesViewer({ images: ['a'] })
  const orig = v.thumbBar.style.display
  v.toggleThumbnails()
  assert.notStrictEqual(v.thumbBar.style.display, orig)
  v.hide()
})

test('toggleImageInfo() 切换显隐', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.toggleImageInfo()
  assert.strictEqual(v.infoPanel.style.display, 'block')
  v.toggleImageInfo()
  assert.strictEqual(v.infoPanel.style.display, 'none')
  v.hide()
})

test('close() 销毁后不可见', () => {
  const v = new ImagesViewer({ images: ['a'] })
  assert.strictEqual(v.visible, true)
  v.hide()
  assert.strictEqual(v.visible, false)
})

test('destroy 恢复 body.overflow', () => {
  document.body.style.overflow = 'scroll'
  const v = new ImagesViewer({ images: ['a'] })
  v.hide()
  assert.strictEqual(v._bodyOverflow, 'scroll')
})

// ===== 7. 事件系统 =====
console.log('\n📦 components/viewer-events.js')

test('bindEvents 绑定 handlers', () => {
  const v = new ImagesViewer({ images: ['a'] })
  assert(v._handlers !== null)
  assert(typeof v._handlers.click === 'function' || v._handlers.click === undefined)
  v.hide()
})

test('unbindEvents 清理 handlers', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.hide()
  // 手动触发 destroy，因为 close 有 setTimeout 延迟
  v._destroy()
  assert.strictEqual(v._handlers, null)
})

// ===== 8. 回调触发 =====
console.log('\n📦 src/index.js — 回调')

test('onShow 触发', () => {
  let called = false
  const v = new ImagesViewer({
    images: ['a'],
    onShow: () => {
      called = true
    },
  })
  assert.strictEqual(called, true)
  v.hide()
})

test('onChange 触发', () => {
  let data = null
  const v = new ImagesViewer({
    images: ['a', 'b'],
    onChange: d => {
      data = d
    },
  })
  v.next()
  assert.strictEqual(data.index, 1)
  assert.strictEqual(data.oldIndex, 0)
  assert.strictEqual(data.direction, 'next')
  v.hide()
})

test('onImageError 回调注册', () => {
  const v = new ImagesViewer({ images: ['a'], onImageError: () => {} })
  assert(typeof v.options.onImageError === 'function')
  v.hide()
})

// ===== 9. 按钮配置 =====
console.log('\n📦 src/index.js — 按钮配置')

test('buttons 全部隐藏', () => {
  const v = new ImagesViewer({
    images: ['a'],
    buttons: {
      zoomIn: false,
      zoomOut: false,
      rotateLeft: false,
      rotateRight: false,
      reset: false,
      download: false,
      fullscreen: false,
      prev: false,
      next: false,
      close: false,
      topClose: false,
      thumbnails: false,
      info: false,
    },
  })
  assert(v.toolbarEl.children.length === 0)
  v.hide()
})

test('customButtons 自定义按钮', () => {
  const v = new ImagesViewer({
    images: ['a'],
    customButtons: [['测试', function () {}]],
  })
  assert(v.toolbarEl.children.length > 0)
  v.hide()
})

// ===== 10. 帮助面板内容 =====
console.log('\n📦 src/index.js — 帮助面板')

test('toggleImageInfo() 包含操作指引', () => {
  const v = new ImagesViewer({ images: ['a'] })
  v.toggleImageInfo()
  const html = v.infoPanel.innerHTML
  assert(html.includes('操作指引'))
  assert(html.includes('快捷键'))
  assert(html.includes('手势'))
  v.hide()
})

// ===== 11. 显示/隐藏控制 =====
console.log('\n📦 src/index.js — 显示/隐藏控制')

test('showTitle: false 不创建 title', () => {
  const v = new ImagesViewer({ images: ['a'], showTitle: false })
  assert.strictEqual(v.titleEl, undefined)
  v.hide()
})

test('showCounter: false 不创建 counter', () => {
  const v = new ImagesViewer({ images: ['a'], showCounter: false })
  assert.strictEqual(v.counterEl, undefined)
  v.hide()
})

test('showNavButtons: false 不创建导航按钮', () => {
  const v = new ImagesViewer({ images: ['a', 'b'], showNavButtons: false })
  assert.strictEqual(v._navPrevEl, undefined)
  assert.strictEqual(v._navNextEl, undefined)
  v.hide()
})

test('toggleTitle() 切换显示', () => {
  const v = new ImagesViewer({ images: ['a'], showTitle: true })
  assert(v.titleEl)
  const before = v.titleEl.style.display || ''
  v.toggleTitle()
  assert.strictEqual(v.titleEl.style.display, 'none')
  v.toggleTitle()
  assert.strictEqual(v.titleEl.style.display, before)
  v.hide()
})

test('toggleCounter() 切换显示', () => {
  const v = new ImagesViewer({ images: ['a'], showCounter: true })
  assert(v.counterEl)
  const before = v.counterEl.style.display || ''
  v.toggleCounter()
  assert.strictEqual(v.counterEl.style.display, 'none')
  v.toggleCounter()
  assert.strictEqual(v.counterEl.style.display, before)
  v.hide()
})

test('toggleNavButtons() 切换显示', () => {
  const v = new ImagesViewer({ images: ['a', 'b'], showNavButtons: true })
  assert(v._navPrevEl)
  assert(v._navNextEl)
  const prevBefore = v._navPrevEl.style.display || ''
  const nextBefore = v._navNextEl.style.display || ''
  v.toggleNavButtons()
  assert.strictEqual(v._navPrevEl.style.display, 'none')
  assert.strictEqual(v._navNextEl.style.display, 'none')
  v.toggleNavButtons()
  assert.strictEqual(v._navPrevEl.style.display, prevBefore)
  assert.strictEqual(v._navNextEl.style.display, nextBefore)
  v.hide()
})

// ===== 总结 =====
console.log('\n========== 测试结果 ==========')
console.log(`通过: ${passed} / ${passed + failed}`)
console.log(`失败: ${failed} / ${passed + failed}`)

if (failed > 0) {
  process.exit(1)
} else {
  console.log('\n✅ 所有测试通过！')
}
