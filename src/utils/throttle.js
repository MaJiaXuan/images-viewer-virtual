/**
 * 节流函数
 */

export function throttle(fn, wait = 16) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * requestAnimationFrame 节流
 */
export function rafThrottle(fn) {
  let ticking = false
  return function (...args) {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        fn.apply(this, args)
      })
    }
  }
}
