---
layout: home

hero:
  name: ImagesViewer
  text: viewer.js 性能延伸版
  image:
    src: /logo.svg
    alt: ImagesViewer
  tagline: 在 viewer.js 的基础上为性能而生 — 虚拟列表轻松承载万级图集 · API 设计对齐 viewer.js，零依赖、任意框架开箱即用
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线演示
      link: /demo.html
    - theme: alt
      text: GitHub
      link: https://github.com/MaJiaXuan/images-viewer-virtual

features:
  - icon: 🚀
    title: viewer.js 延伸
    details: API 设计全面对齐 viewer.js，熟悉 viewer.js 可零成本迁移，同时补齐虚拟列表与万级图集能力
  - icon: 📦
    title: 虚拟列表
    details: 缩略图栏只渲染视口内 DOM 节点，通过对象池复用，万级图集依然流畅不卡顿
  - icon: ⚡
    title: 浏览器级懒加载
    details: 主图与缩略图统一由浏览器原生 lazy loading 调度，移除手动缓存与预加载，代码更简、内存更省
  - icon: 🎨
    title: 高度可定制
    details: 40+ 主题变量、自定义工具栏按钮、自定义信息面板与计数器、完整 i18n，轻松适配任意设计体系
  - icon: 📱
    title: 手势与键盘
    details: 滚轮缩放、拖拽平移（带弹性边界）、双击切换、移动端滑动切换，全键盘快捷键覆盖
  - icon: 🛡️
    title: 错误图片恢复
    details: 全局默认错误图 + 单图独立 fallback，加载失败自动降级，配合 errorClass 自定义错误样式
  - icon: 🔧
    title: 微前端友好
    details: 完整的生命周期管理，hide() 自动清理所有事件、Timer、DOM 和内存，跨框架与微前端场景零泄漏
---

<p align="center" style="margin: -8px 0 24px">
  <a href="https://www.npmjs.com/package/images-viewer-virtual" target="_blank"><img src="https://img.shields.io/npm/v/images-viewer-virtual.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/images-viewer-virtual" target="_blank"><img src="https://img.shields.io/npm/dm/images-viewer-virtual.svg" alt="npm downloads" /></a>
  <a href="https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/images-viewer-virtual.svg" alt="license" /></a>
</p>

## 快速体验

```js
import ImagesViewer from 'images-viewer-virtual'

new ImagesViewer({
  images: [
    {
      url: 'https://example.com/1.jpg',
      thumbnail: 'https://example.com/1-thumb.jpg',
      title: '示例 1',
    },
    {
      url: 'https://example.com/2.jpg',
      thumbnail: 'https://example.com/2-thumb.jpg',
      title: '示例 2',
    },
  ],
})
```

## 安装

```bash
# npm
npm install images-viewer-virtual

# pnpm
pnpm add images-viewer-virtual

# yarn
yarn add images-viewer-virtual
```

## 浏览器支持

基于 [.browserslistrc](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/.browserslistrc) 和 [Vite Legacy 插件](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 构建，覆盖全球 95% 以上用户浏览器。

| 浏览器     | 最低版本（ESM） | 最低版本（UMD Legacy） | 支持情况    |
| ---------- | --------------- | ---------------------- | ----------- |
| Chrome     | 90+             | 60+                    | ✅ 完全支持 |
| Edge       | 90+             | 79+                    | ✅ 完全支持 |
| Firefox    | 90+             | 60+                    | ✅ 完全支持 |
| Safari     | 14+             | 12+                    | ✅ 完全支持 |
| IE 11      | —               | —                      | ❌ 不支持   |
| Opera Mini | —               | —                      | ❌ 不支持   |

- **ESM 构建** (`images-viewer.es.js`)：使用原生 ES2022+，体积更小，适合现代浏览器。
- **UMD 构建** (`images-viewer.umd.js`)：通过 `@vitejs/plugin-legacy` 自动注入 polyfill，兼容旧浏览器。
- 不支持 IE 11 和 Opera Mini。

## 感谢

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。
