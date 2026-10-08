/**
 * DOM 工具函数
 */

export const $ = (selector, context = document) => context.querySelector(selector)
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector))
export const on = (el, type, fn, opts = false) => el.addEventListener(type, fn, opts)
export const off = (el, type, fn) => el.removeEventListener(type, fn)
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

/**
 * 创建带样式的按钮
 */
export function createBtn(text, className, { size, fontSize, bg, hoverBg, radius, textColor }) {
  const btn = document.createElement('button')
  btn.className = className
  btn.textContent = text
  btn.style.cssText = `
    width:${size};height:${size};border:none;border-radius:${radius};
    background:${bg};color:${textColor};font-size:${fontSize};
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:background 0.2s;outline:none;
  `
  on(btn, 'mouseenter', () => {
    btn.style.background = hoverBg
  })
  on(btn, 'mouseleave', () => {
    btn.style.background = bg
  })
  return btn
}

/**
 * 创建 div 并设置样式
 */
export function createDiv(className, styles = {}) {
  const el = document.createElement('div')
  el.className = className
  Object.assign(el.style, styles)
  return el
}

/**
 * 创建 img 并设置样式
 */
export function createImg(className, styles = {}) {
  const img = document.createElement('img')
  img.className = className
  img.decoding = 'async'
  Object.assign(img.style, styles)
  return img
}

// Toast 动画与驻留时长
const TOAST_FADE_MS = 300 // 淡出过渡时长，与下方 transition 保持一致
const TOAST_DURATION_MS = 2000 // 自动消失前的展示时长

// 单例 Toast 状态
let toastEl = null
let toastTimer = null
let toastRaf = null

/**
 * 显示 Toast 提示（单例模式，新提示覆盖旧提示）
 * @param {string} msg - 提示文字
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {HTMLElement} container - 挂载容器，默认 document.body
 */
export function showToast(msg, type = 'info', container = document.body, className = '') {
  // 清除上一个 toast 的计时器
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  if (toastRaf) {
    cancelAnimationFrame(toastRaf)
    toastRaf = null
  }

  // 移除上一个 toast（如果存在且仍在 DOM 中）
  if (toastEl && toastEl.parentNode) {
    toastEl.parentNode.removeChild(toastEl)
  }

  const colors = {
    success: { bg: 'rgba(40,167,69,0.9)', icon: '✓' },
    error: { bg: 'rgba(220,53,69,0.9)', icon: '✗' },
    info: { bg: 'rgba(30,30,40,0.9)', icon: 'ℹ' },
  }
  const c = colors[type] || colors.info

  toastEl = document.createElement('div')
  if (className) toastEl.className = className
  toastEl.style.cssText = `
    position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
    z-index:1000000;padding:12px 20px;border-radius:8px;
    background:${c.bg};color:#fff;font-size:14px;
    display:flex;align-items:center;gap:8px;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);
    transition:opacity 0.3s,transform 0.3s;
    opacity:0;transform:translate(-50%,-50%) scale(0.9);
    pointer-events:none;white-space:nowrap;
  `
  toastEl.textContent = `${c.icon} ${msg}`
  container.appendChild(toastEl)

  toastRaf = requestAnimationFrame(() => {
    if (toastEl) {
      toastEl.style.opacity = '1'
      toastEl.style.transform = 'translate(-50%,-50%) scale(1)'
    }
  })

  toastTimer = setTimeout(() => {
    if (toastEl) {
      toastEl.style.opacity = '0'
      toastEl.style.transform = 'translate(-50%,-50%) scale(0.9)'
      toastTimer = setTimeout(() => {
        if (toastEl && toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl)
        }
        toastEl = null
      }, TOAST_FADE_MS)
    }
  }, TOAST_DURATION_MS)

  return toastEl
}

/**
 * 清理当前 Toast（销毁时调用）
 */
export function clearToast() {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  if (toastRaf) {
    cancelAnimationFrame(toastRaf)
    toastRaf = null
  }
  if (toastEl && toastEl.parentNode) {
    toastEl.parentNode.removeChild(toastEl)
  }
  toastEl = null
}
