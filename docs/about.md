# 关于 ImagesViewer

ImagesViewer 是一个原生 JavaScript 图片查看器插件，支持虚拟列表、浏览器懒加载、手势拖拽与键盘快捷键，可在任何前端项目中直接使用。

## 设计灵感

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292）。感谢原作者提供的优秀设计思路与交互参考，为本项目的开发奠定了重要基础。

## 主要特性

- 虚拟列表 — 缩略图栏只渲染视口内 DOM 节点，可承载上千张图片
- 浏览器懒加载 — 主图与缩略图由浏览器原生 lazy loading 调度加载，零手动缓存管理
- 高度可定制 — 主题、按钮、信息面板、国际化
- 手势与键盘 — 滚轮缩放、拖拽平移、双击重置、全键盘快捷键
- 错误图片恢复 — 全局/单图 fallback 机制
- 微前端友好 — 完整的生命周期管理
- 缩略图样式定制 — itemClass / activeItemClass 支持
- 性能优化 — 首次打开和循环切换首尾时自动跳过动画

## 开源协议

MIT License
