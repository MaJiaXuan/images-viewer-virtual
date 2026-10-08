/**
 * 信息面板内容构建
 *
 * 把「图片信息 + 操作指引」两段 HTML 的拼装从查看器主类里独立出来。
 */

/**
 * @param {object} ctx
 * @param {string} ctx.ns - BEM 命名空间
 * @param {object} ctx.i18n - 文案配置
 * @param {object} ctx.imageInfo - 信息面板显示项
 * @param {string} ctx.title - 当前图片标题
 * @param {HTMLImageElement} ctx.mainImg - 主图元素（读取自然尺寸）
 * @param {string} [ctx.custom] - onInfo 回调返回的自定义 HTML
 * @returns {string}
 */
export function buildInfoPanelHtml({ ns, i18n, imageInfo, title, mainImg, custom }) {
  let html = ''

  if (typeof custom === 'string') {
    html = custom
  } else {
    if (imageInfo.showName) html += `<div>${i18n.info.name} ${title}</div>`
    if (imageInfo.showDimensions) {
      html += `<div>${i18n.info.dimensions} ${mainImg.naturalWidth || '-'} × ${mainImg.naturalHeight || '-'}</div>`
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

  return html
}
