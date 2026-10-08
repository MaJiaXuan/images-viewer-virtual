/**
 * 测试环境 DOM 模拟
 */

const mockElement = tag => ({
  tagName: tag,
  style: {
    setProperty(name, value) {
      this[name] = value
    },
    getPropertyValue(name) {
      return this[name] || ''
    },
  },
  className: '',
  classList: {
    _cls: '',
    add(c) {
      this._cls += (this._cls ? ' ' : '') + c
    },
    remove(c) {
      this._cls = this._cls
        .split(' ')
        .filter(s => s !== c)
        .join(' ')
    },
    contains(c) {
      return this._cls.split(' ').includes(c)
    },
  },
  textContent: '',
  dataset: {},
  src: '',
  parentNode: null,
  children: [],
  appendChild(child) {
    this.children.push(child)
    child.parentNode = this
  },
  removeChild(child) {
    const idx = this.children.indexOf(child)
    if (idx !== -1) this.children.splice(idx, 1)
  },
  remove() {
    if (this.parentNode) this.parentNode.removeChild(this)
    this.parentNode = null
  },
  addEventListener() {},
  removeEventListener() {},
  getBoundingClientRect() {
    return { width: 1000, height: 90, left: 0, top: 0 }
  },
  requestFullscreen() {
    return Promise.resolve()
  },
  scrollTo(pos) {
    this.scrollLeft = pos.left || 0
    this.scrollTop = pos.top || 0
  },
  clientWidth: 1000,
  clientHeight: 90,
  scrollLeft: 0,
  scrollTop: 0,
})

const body = mockElement('body')

class MockImage {
  constructor() {
    this.src = ''
    this.complete = false
    this.decoding = ''
    this.naturalWidth = 0
    this.naturalHeight = 0
  }
}

global.document = {
  body,
  createElement(tag) {
    return mockElement(tag)
  },
  addEventListener() {},
  removeEventListener() {},
  fullscreenElement: null,
  exitFullscreen() {
    return Promise.resolve()
  },
}

global.window = {}
global.Image = MockImage
global.requestAnimationFrame = cb => setTimeout(cb, 0)
global.cancelAnimationFrame = id => clearTimeout(id)
global.getComputedStyle = el => {
  const style = el.style || {}
  return {
    getPropertyValue(name) {
      return style.getPropertyValue ? style.getPropertyValue(name) : style[name] || ''
    },
    marginLeft: style.marginLeft || '0px',
    marginRight: style.marginRight || '0px',
    paddingLeft: style.paddingLeft || '0px',
    paddingRight: style.paddingRight || '0px',
  }
}
