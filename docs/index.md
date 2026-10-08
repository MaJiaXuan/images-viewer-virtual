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
    details: 滚轮缩放、拖拽平移（带弹性边界与回弹）、双击重置变换、移动端滑动切换，全键盘快捷键覆盖
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

两种产物的构建目标不同，兼容范围也不同：

| 浏览器     | ESM 产物（`esnext`，不降级） | UMD 产物（按 `.browserslistrc` 降级） |
| ---------- | ---------------------------- | ------------------------------------- |
| Chrome     | 80+                          | 60+                                   |
| Edge       | 80+                          | 79+                                   |
| Firefox    | 74+                          | 60+                                   |
| Safari     | 13.1+                        | 12+                                   |
| iOS Safari | 13.4+                        | 12+                                   |
| IE 11      | ❌ 不支持                    | ❌ 不支持                             |
| Opera Mini | ❌ 不支持                    | ❌ 不支持                             |

- **ESM 产物**按 `build.target: 'esnext'` 输出，不做语法降级，下限由源码使用的 ES2020 语法（可选链 `?.`）决定 —— 换来更小的体积，降级交给使用方的打包器。
- **UMD 产物**需被 `<script src>` 直接引入，构建时会按 [.browserslistrc](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/.browserslistrc) 降级语法。该文件是兼容范围的唯一定义处，改它即可调整 UMD 支持范围。
- UMD **只降语法、不注入 polyfill**。构建收尾会自检产物，若仍残留 `?.` / `??` 等 ES2020+ 语法会直接中断构建，避免旧浏览器拿到语法错误。
- 运行时 API 不在降级范围内：`copyImage()` 依赖 `navigator.clipboard`（Chrome 76+ / Edge 79+ / Firefox 127+），不支持时自动降级为复制图片 URL；全屏等 API 同样做了能力检测。
- 需要覆盖更旧的浏览器时，请在业务侧自行引入 polyfill，或下调 `.browserslistrc`。

## 感谢

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。
