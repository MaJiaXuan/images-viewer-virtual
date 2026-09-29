# Changelog

## 2.0.0 (未发布)

### 破坏性变更

- 移除 LRU 图片缓存（`maxCacheSize`）与手动预加载（`preloadCount`），主图与缩略图统一由浏览器原生 lazy loading 调度
- 关闭 API 收敛为 `hide()`，移除 `close()` / `destroy()` 别名；移除 `goTo()`（使用 `view(index)`）
- 所有回调入参统一为 `{ viewer, index, image, total, ...事件特有字段 }`；`onCounter` 的 `currentPage/totalPages` 更名为 `index/total`
- 移除从未生效的 `onThumbnailError` / `onZoomIndicator` 选项

### 改进

- 所有实例方法支持链式调用，对齐 viewer.js API 设计

## 1.0.0 (2024-06-22)

### 特性

- 虚拟列表 — 缩略图栏只渲染视口内 DOM 节点，通过对象池复用，可承载上千张图片
- LRU 缓存 — 超出容量自动释放最早未使用的图片内存，预加载相邻图片
- 高度可定制 — 完整主题配置、自定义按钮、自定义信息面板、国际化支持
- 手势与键盘 — 支持滚轮缩放、拖拽平移、双击重置、全键盘快捷键
- 错误图片恢复 — 全局默认错误图和单图独立错误图，加载失败时自动 fallback
- 微前端友好 — 完整的生命周期管理，close() 自动清理所有事件、Timer、DOM 和内存
- 缩略图样式定制 — 支持全局和单图独立设置 itemClass / activeItemClass
- 性能优化 — 首次打开和循环切换首尾时自动跳过动画，避免卡顿
- 单图模式 — 图片只有 1 张时自动隐藏 prev/next 导航按钮
- 隐藏缩略图栏 — 支持 showThumbBar: false 完全隐藏底部缩略图栏
- 错误样式 — 支持 errorClass 全局和单图设置图片加载失败时的 CSS 样式

### 构建

- 基于 Vite 构建，同时输出 ESM 和 UMD 格式
- 通过 @vitejs/plugin-legacy 兼容旧浏览器
- 使用 Terser 压缩，自动移除 console 和 debugger
- 构建后自动输出 dist/stats.html 体积分析

### 文档

- VitePress 文档站点，包含 API 参考、18 个示例、框架集成指南
- 自定义 DemoPreview 组件，支持在文档中在线运行示例
- 浏览器支持矩阵（Chrome 90+、Edge 90+、Firefox 90+、Safari 14+）
