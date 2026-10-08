# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.3](https://github.com/MaJiaXuan/images-viewer-virtual/compare/v1.0.2...v1.0.3) (2026-10-08)

### 📝 文档

- README 新增 npm / license / demo 徽章与「在线演示」章节，补充 Demo 地址 <https://majiaxuan.github.io/images-viewer-virtual/>
- README 示例与文档构建章节标注在线地址，文末新增「相关链接」导航
- AGENTS.md 新增「相关链接」小节，记录线上 Demo、npm 包与文档部署方式
- **全量 API 对照校正**：
  - 修正 `i18n` 配置：移除 16 个实际不存在的键（`page` / `scale` / `rotation` / `keyboardShortcuts` / `gesture` / `*Shortcut` / `doubleClick` / `wheelZoom` / `dragPan`），补全真实可用的 `helpTitle` / `helpKeys` / `helpGestures`，并说明无法国际化的部分
  - 修正按钮默认值：`copy` 默认关闭、`download` 默认开启；移除示例中不存在的 `autoplay` / `print` / `annotate` 按钮
  - 修正 `imageInfo` 默认值与信息面板默认内容描述（名称、尺寸、操作指引）
  - 修正双击行为（重置变换，非放大 2 倍）与拖拽行为（任何缩放倍率下均可用，允许越界 60px 后回弹）
  - 补充 `interval` 选项、`zoomTo` / `rotateTo` / `move` / `moveTo` / `toggle` / `play` / `stop` / `tooltip` 方法、旧选项名兼容映射
  - 修正主题默认值（`viewerBgColor` / `textColor` / `toolbarBgColor` / `buttonBgColor` / `buttonHoverBg`）
  - 移除示例中不存在的 `activeThumbColor` 选项；补全 React 示例缺失的 `useEffect` 导入
  - 同步 `demo/index.html` 与 `docs/public/demo.html` 中的对应内容
- `update()` 补充完整文档与行为约定说明（表格与示例），原先仅标注「不可用」
- **修正浏览器兼容性表述**：原文称 UMD 构建「通过 `@vitejs/plugin-legacy` 自动注入 polyfill，兼容旧浏览器」并列出 Chrome 60+ / Safari 12+，与实际产物不符（`conditional-legacy` 在 lib 模式下不生效，产物为 `esnext` 输出且实测含可选链）。现按实际构建方式说明 ESM / UMD 各自的支持范围，见下方「构建」

### 🐛 修复

- **补上 EXIF 方向（orientation）实现**：`loadCurrentImage` 原先调用了从未定义的 `this._applyExifOrientation()`（因数据层不产生 `orientation` 字段，该分支不可达；一旦有人补上该字段会直接抛 `TypeError`）。现完整实现：
  - 新增 `src/utils/exif.js`：JPEG EXIF Orientation（tag 0x0112）解析，支持大 / 小端 TIFF、段遍历与结构校验；`readExifOrientation(url)` 异步读取并按 URL 缓存，fetch 失败 / 非 JPEG / 无标签均静默忽略
  - 新增 `src/components/orientation.js`：方向应用逻辑。数据里显式的 `orientation`（1-8）优先，其次 `autoOrientation: true` 时自动解析（默认关闭，避免额外请求）；方向变换置于 CSS transform 链最外层，`reset()` 等用户变换重置不影响方向
  - `_normalizeImages()` 透传 `orientation` 字段（支持 `props` 映射）；切换图片时自动清除 / 重新应用方向
  - 新增 11 条测试（解析器 + viewer 集成），测试总数 60 → 71
- 修复 `update()`（动态增删图片后刷新）完全不可用的问题：内部调用 `_normalizeImages()` 未传参且未把结果赋回 `this.images`，执行必然抛 `TypeError`。现改为重新读取 `options.images` 并走完整加载流程
  - 图片被删除导致索引越界时自动收敛到最后一张；列表被清空时不报错
  - 新增 `VirtualThumbnailList.invalidate()`：缩略图对象池在索引不变时会跳过重渲染，修复同索引换图后缩略图残留旧图的问题
  - 新增 `loadCurrentImage(index, animated, { resetTransform })` 选项：当前图片未变化时保留缩放与旋转状态
  - 修复 `onChange` 误报：索引未真正变化时不再触发（含单图时调用 `next()` / `prev()` 的场景）
- 修复 `types/index.d.ts` 中 `scale` 标识符重复（TS2300）：移除与数值状态同名的 `scale()` / `scaleX()` / `scaleY()` 方法声明
- 移除 `src/index.js` 中同样无法调用的 `scale()` / `scaleX()` / `scaleY()` 方法实现（构造函数里 `this.scale = 1` 会遮蔽原型同名方法，调用必然抛 `TypeError`），`scale` 统一作为缩放倍率数值状态暴露
- 构建产物补齐 `dist/index.d.ts`：类型声明源文件迁移至 `types/index.d.ts`，`pnpm build` 构建时自动复制，修复 `types` 字段指向不存在文件的问题
- 收窄 `files` 白名单，排除 `*.map` 与 `stats.html`，发布包体积由 137 kB 降至 32 kB

### 🔧 构建/工具

- **UMD 产物不再含 `?.` 等 ES2020+ 语法**，修复旧浏览器（Chrome < 80 / Safari < 13.1）直接语法报错、无法加载的问题：
  - `vite.config.js` 新增 `downlevel-umd` 插件，仅对 `umd` 格式做语法降级；目标由 `.browserslistrc` 派生（`browserslist-to-esbuild`），使兼容范围只保留一处定义
  - 构建收尾自检：用 `es2019` 再降一次做比对，产物若残留 `?.` / `??` 等 ES2020+ 语法直接中断构建（已用 `chrome >= 120` 的临时配置验证拦截生效）
  - ESM 产物保持 `esnext` 不降级，体积不变（33.17 kB）；UMD 由 33.4 kB 增至 34.14 kB（gzip 10.39 kB），增量来自语法降级
- 移除 `@vitejs/plugin-legacy` 依赖与 `conditional-legacy` 死配置：该插件面向 HTML 应用（注入 `<script nomodule>` + SystemJS chunk，需页面 HTML 配合），对 `<script src>` 引入的 UMD 库不适用，且在 lib 模式下 `config.build.lib` 恒为真、永不生效
- 消除 browserslist 配置冲突：删除 `package.json` 中的 `browserslist` 字段（此前与 `.browserslistrc` 并存，browserslist 会打印 `contains both` 告警），`.browserslistrc` 改为显式版本区间并成为 UMD 降级目标的唯一来源
- 统一 `repository.url` 为 npm 规范写法，消除发布时的自动纠正告警
- 新增 `pnpm test` 脚本；修正测试文件头部错误的运行命令（`test/loader.mjs` 只导出钩子，需通过 `test/register.mjs` 注册）
- 新增 11 条 `update()` 与缩略图池相关测试用例，测试总数 49 → 60
- 补全 `eslint.config.js` 缺失的 `@eslint/js` 与 `globals` 依赖：此前 `pnpm lint` 与 lint-staged 的 pre-commit 钩子会直接报 `ERR_MODULE_NOT_FOUND`，无法运行（`globals` 取 `14.0.0`，与锁文件中 `@eslint/eslintrc` 已解析的版本一致，不额外引入副本）
- ESLint 忽略列表补充 `docs/.vitepress/.temp`：该目录是 VitePress 构建临时产物，此前未忽略，导致 `pnpm lint` 报告 321 个错误（全部来自 VitePress 生成的压缩代码），`eslint --fix` 不再失败。补充后源码侧错误清零，当时余 88 个 warning（已在本版本内全部处理，见下）
- 删除失效的 `test/api.test.js`：CJS 环境下 `require` ESM 源码与 `.css` 必然抛 `ERR_UNKNOWN_FILE_EXTENSION`，且内容为 `test/api.test.mjs` 的旧副本
- README 脚本说明表与发布检查清单补充 `pnpm test`
- **ESLint 告警全量清零（88 warning → 0 error / 0 warning）**，并把告警背后的实现问题一并修掉：
  - 删除 ESLint 9 已废弃的 `.eslintignore`，忽略项合并进 flat config；`eslint.config.js` 重命名为 `eslint.config.mjs`，消除 `MODULE_TYPELESS_PACKAGE_JSON` 重解析告警；配置自身裸写的阈值改为命名常量
  - 测试目录新增 override 关闭 `no-magic-numbers` / `max-lines`：断言天然使用字面量（`clamp(5, 0, 10)`），逐个命名只会降低可读性
  - 清理真实死代码：`VirtualThumbnailList._initPool()` 中未使用的 `itemWidth` / `itemHeight` / `gap` 解构，测试中未使用的 `rafThrottle` 导入
  - 全部魔法数字改为命名常量（`ZOOM_STEP` / `ROTATE_STEP_DEG` / `RETRY_DELAY_MS` / `TOAST_DURATION_MS` / `MS_PER_SECOND` 等）
  - 降低函数复杂度：`buildDOM`（24→拆成 container/stage/overlay/nav/toolbar/thumbBar 等构建函数）、`loadCurrentImage`（19→拆出标题/变换/错误态/缩略图同步）、`_onKey`（18→查表）、`_destroy`（16→拆出定时器/Toast/图片事件清理）、`unbindEvents`（12→查表）、`downloadImage`（12→按降级策略拆成 4 个独立函数）
  - `src/index.js` 由 731 行拆分：新增 `src/defaults.js`（默认配置与旧选项名映射）、`src/utils/options.js`（选项合并）、`src/components/info-panel.js`（信息面板 HTML）、`src/components/thumbnails.js`（虚拟列表初始化）、`src/utils/image-file.js`（复制/下载降级链）
  - 上述重构未改动公开 API，测试保持 60 / 60 通过，UMD 产物仍无 `?.` / `??`

### [1.0.2](https://github.com/MaJiaXuan/images-viewer-virtual/compare/v1.0.1...v1.0.2) (2026-10-02)

### 🐛 修复

- 修正 files 白名单覆盖 .npmignore 导致 .gz 文件被发布 ([f2c7e1a](https://github.com/MaJiaXuan/images-viewer-virtual/commit/f2c7e1a7641a96810d1b7c3b30c5c71cab71f5c4))

## 1.0.1 (2026-09-29)

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
- 接入 @vitejs/plugin-legacy（实际仅非库构建生效，库产物为 esnext 输出、不含 polyfill）
- 使用 Terser 压缩，自动移除 console 和 debugger
- 构建后自动输出 dist/stats.html 体积分析

### 文档

- VitePress 文档站点，包含 API 参考、18 个示例、框架集成指南
- 自定义 DemoPreview 组件，支持在文档中在线运行示例
- 浏览器支持矩阵（Chrome 90+、Edge 90+、Firefox 90+、Safari 14+）
