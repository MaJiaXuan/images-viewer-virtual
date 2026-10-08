# 版本记录

以下是 ImagesViewer 的版本更新记录。完整变更记录请查看项目根目录的 [CHANGELOG.md](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/CHANGELOG.md)。

## 1.0.3 (2026-10-08)

### 修复

- 修复 `update()` 完全不可用的问题：内部调用 `_normalizeImages()` 未传参，执行必然抛 `TypeError`；现改为重新读取 `options.images` 并走完整加载流程（索引越界自动收敛、列表清空不报错）
- 修复同一索引换图后缩略图残留旧图的问题（新增 `VirtualThumbnailList.invalidate()` 强制重渲染对象池）
- 修复 `onChange` 在索引未变化时的误报（含单图时调用 `next()` / `prev()`）
- 移除 `scale()` / `scaleX()` / `scaleY()` 三个无法调用的方法（构造函数中 `this.scale = 1` 会遮蔽原型同名方法，调用必然抛 `TypeError`），修复类型声明中 `scale` 标识符重复（TS2300）
- 构建产物补齐 `dist/index.d.ts`，修复 `types` 字段指向不存在文件的问题
- 收窄 `files` 白名单，排除 `*.map` 与 `stats.html`，发布包体积由 137 kB 降至 32 kB

### 文档

- 修正 `i18n` 配置文档，移除 16 个实际不存在的键，补全 `helpTitle` / `helpKeys` / `helpGestures`
- 修正按钮默认值（`copy` 默认关闭、`download` 默认开启）、`imageInfo` 默认值、信息面板默认内容
- 修正双击（重置变换，非放大 2 倍）与拖拽（任何缩放倍率下均可用）的行为描述
- 补充 `interval` 选项、`zoomTo` / `rotateTo` / `move` / `moveTo` / `toggle` / `play` / `stop` / `tooltip` 方法、旧选项名兼容映射
- 补充 `update()` 的完整文档与行为约定（原先仅标注「不可用」）
- 移除示例中不存在的 `activeThumbColor` 选项
- 修正浏览器兼容性表述：原文称 UMD 构建自动注入 legacy polyfill、兼容 Chrome 60+ / Safari 12+，与实际产物不符（lib 模式下 legacy 插件不生效）。现按实际构建方式分别说明 ESM / UMD 的支持范围

### 构建

- **UMD 产物不再含 `?.` 等 ES2020+ 语法**，旧浏览器不再因语法报错而无法加载：新增 `downlevel-umd` 插件，按 `.browserslistrc` 降级语法（UMD → Chrome 60+ / Edge 79+ / Firefox 60+ / Safari 12+ / iOS 12+），并带构建自检
- ESM 产物保持 `esnext` 不降级，体积不变；UMD 由 33.4 kB 增至 34.14 kB，增量来自语法降级
- 移除 `@vitejs/plugin-legacy` 依赖（面向 HTML 应用，不适用于 UMD 库）与 `conditional-legacy` 死配置
- 删除 `package.json` 中的 `browserslist` 字段，消除与 `.browserslistrc` 的配置冲突告警

### 工具

- 新增 `pnpm test` 脚本，修正测试文件头部错误的运行命令
- 补全 `eslint.config.js` 缺失的 `@eslint/js` 与 `globals` 依赖，并忽略 VitePress 构建临时目录 `docs/.vitepress/.temp`（此前 `pnpm lint` 与 pre-commit 钩子无法运行）
- 删除失效的 `test/api.test.js`

## 1.0.2 (2026-10-02)

### 修复

- 修正 files 白名单覆盖 .npmignore 导致 .gz 文件被发布

## 1.0.1 (2026-09-29)

### 破坏性变更

- 移除 LRU 图片缓存与手动预加载，改由浏览器原生 lazy loading 调度
- 关闭 API 收敛为 `hide()`，移除 `close()` / `destroy()` 别名；移除 `goTo()`
- 所有回调入参统一为 `{ viewer, index, image, total, ... }`

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
- 接入 @vitejs/plugin-legacy（实际仅非库构建生效，库产物为 esnext 输出、不含 polyfill）
- 使用 Terser 压缩，自动移除 console 和 debugger
- 构建后自动输出 dist/stats.html 体积分析

### 文档

- VitePress 文档站点，包含 API 参考、18 个示例、框架集成指南
- 自定义 DemoPreview 组件，支持在文档中在线运行示例
- 浏览器支持矩阵（Chrome 90+、Edge 90+、Firefox 90+、Safari 14+）
