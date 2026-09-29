# ImagesViewer

> 原生 JavaScript 图片查看器，支持虚拟列表、LRU 缓存、手势拖拽与键盘快捷键，可在任何前端项目中直接使用。

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。

## 特性

- **虚拟列表** — 缩略图栏只渲染视口内 DOM 节点，通过对象池复用，可承载上千张图片不卡顿
- **LRU 缓存** — 超出容量自动释放最早未使用的图片内存，预加载相邻图片，确保流畅浏览
- **高度可定制** — 完整主题配置、自定义按钮、自定义信息面板、国际化支持，轻松适配任何设计
- **手势与键盘** — 支持滚轮缩放、拖拽平移、双击重置、全键盘快捷键，操作体验媲美原生应用
- **错误图片恢复** — 支持全局默认错误图和单图独立错误图，加载失败时自动 fallback，提升容错能力
- **微前端友好** — 完整的生命周期管理，`hide()` 自动清理所有事件、Timer、DOM 和内存，避免泄漏
- **缩略图样式定制** — 支持全局和单图独立设置 `itemClass` / `activeItemClass`，轻松实现选中高亮效果
- **性能优化** — 首次打开和循环切换首尾时自动跳过动画，避免卡顿，提升浏览流畅度

## 安装

```bash
# npm
npm install images-viewer-virtual

# pnpm
pnpm add images-viewer-virtual

# yarn
yarn add images-viewer-virtual
```

## 快速开始

### 基础用法

```js
import ImagesViewer from 'images-viewer-virtual'

const viewer = new ImagesViewer({
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

### 字符串数组

如果图片只有 URL，可以直接传入字符串数组：

```js
const viewer = new ImagesViewer(['https://example.com/a.jpg', 'https://example.com/b.jpg'])
```

### CDN 使用

```html
<script src="https://unpkg.com/images-viewer-virtual/dist/images-viewer.umd.js"></script>
<script>
  const viewer = new ImagesViewer({ images: [...] })
</script>
```

## 浏览器支持

基于 `.browserslistrc` 和 Vite Legacy 插件构建，覆盖全球 95% 以上用户浏览器。

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

## 框架集成

ImagesViewer 是纯原生 JavaScript 库，不依赖任何框架，因此可以在 React、Vue、Angular、Svelte 等任意前端框架中直接使用。

### React

```jsx
import { useRef, useEffect, useCallback } from 'react'
import ImagesViewer from 'images-viewer-virtual'

function Gallery({ images, currentIndex }) {
  const viewerRef = useRef(null)

  const open = useCallback(() => {
    if (viewerRef.current) viewerRef.current.hide()
    viewerRef.current = new ImagesViewer({
      images,
      initialViewIndex: currentIndex,
      onClose: () => {
        viewerRef.current = null
      },
    })
  }, [images, currentIndex])

  useEffect(
    () => () => {
      if (viewerRef.current) {
        viewerRef.current.hide()
        viewerRef.current = null
      }
    },
    []
  )

  return <button onClick={open}>查看图片</button>
}
```

### Vue 2 / Vue 3

```js
methods: {
  openViewer() {
    new ImagesViewer({ images: this.imageList, initialViewIndex: this.currentIndex })
  }
}
```

### Angular

```ts
import { Injectable } from '@angular/core'
import ImagesViewer from 'images-viewer-virtual'

@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  private viewer = null

  open(images, index = 0) {
    if (this.viewer) this.viewer.hide()
    this.viewer = new ImagesViewer({
      images,
      initialViewIndex: index,
      onClose: () => {
        this.viewer = null
      },
    })
  }

  close() {
    if (this.viewer) {
      this.viewer.hide()
      this.viewer = null
    }
  }
}
```

### 微前端

```js
let viewer = null

export function mount() {
  viewer = new ImagesViewer({ images, loop: true })
}

export function unmount() {
  if (viewer) {
    viewer.hide()
    viewer = null
  }
}
```

## 示例

### 1. 基础用法

```js
const viewer = new ImagesViewer({
  images: imageList,
  backdrop: false,
  loop: true,
  buttons: {
    zoomIn: true,
    zoomOut: true,
    rotateLeft: true,
    rotateRight: true,
    reset: true,
    download: true,
    fullscreen: true,
    prev: true,
    next: true,
    close: true,
    topClose: true,
    thumbnails: true,
    info: true,
  },
  onChange: data => console.log('切换:', data.index),
  onImageError: data => console.warn('加载失败:', data.url),
})
```

### 2. 自定义属性映射

当后端返回的数据字段名与默认不符时，可通过 `props` 自定义映射：

```js
const viewer = new ImagesViewer({
  images: [
    { src: 'https://example.com/1.jpg', thumb: 'https://example.com/1t.jpg', name: '风景 1' },
  ],
  props: {
    url: 'src',
    thumbnail: 'thumb',
    title: (item, index) => `${item.name} - 第 ${index + 1} 张`,
  },
})
```

### 3. 自定义按钮

```js
const viewer = new ImagesViewer({
  images: imageList,
  customButtons: [
    [
      '分享',
      function () {
        alert('分享当前图片: ' + this.images[this.currentIndex].title)
      },
    ],
    [
      '收藏',
      function () {
        console.log('收藏:', this.currentIndex)
      },
    ],
  ],
})
```

### 4. 自定义主题

```js
const viewer = new ImagesViewer({
  images: imageList,
  theme: {
    viewerBgColor: 'rgba(255, 248, 240, 0.95)',
    textColor: '#333',
    activeColor: '#ff6b6b',
    toolbarBgColor: 'rgba(255, 255, 255, 0.8)',
    buttonBgColor: 'rgba(0, 0, 0, 0.1)',
    buttonHoverBg: 'rgba(0, 0, 0, 0.2)',
    thumbItemWidth: 100,
    thumbItemHeight: 70,
    thumbGap: 12,
    thumbBarHeight: 100,
    transitionSpeed: '0.25s',
  },
})
```

### 5. 自定义信息面板

```js
const viewer = new ImagesViewer({
  images: imageList,
  imageInfo: { visible: true, showName: true, showDimensions: true },
  onCounter: ({ index, total }) => `第 ${index + 1} / ${total} 张`,
  onInfo: ({ index, total, scale, rotation }) => {
    return `<div style="font-size:12px">
      序号: ${index + 1} / ${total}<br>
      缩放: ${(scale * 100).toFixed(0)}%<br>
      旋转: ${rotation}°
    </div>`
  },
})
```

### 6. 不循环 + 缩放限制

```js
const viewer = new ImagesViewer({
  images: imageList,
  loop: false,
  minZoomRatio: 0.5,
  maxZoomRatio: 3,
})
```

### 7. 错误处理与重试

```js
const viewer = new ImagesViewer({
  images: imageList,
  retryOnError: true,
  onImageError: ({ url, index }) => {
    console.error(`图片加载失败 [${index}]: ${url}`)
  },
})
```

### 8. 国际化

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      prev: 'Previous',
      next: 'Next',
      close: 'Close',
      loading: 'Loading...',
    },
    info: {
      name: 'Name:',
      dimensions: 'Size:',
    },
  },
})
```

### 9. 程序化控制

```js
const viewer = new ImagesViewer({ images: imageList, loop: true })

setTimeout(() => viewer.next(), 2000)
setTimeout(() => {
  viewer.zoom(0.5)
  viewer.rotate(90)
}, 5000)
setTimeout(() => viewer.hide(), 10000)
```

### 10. 错误图片 Fallback

```js
// 方式 A：全局默认错误图
const viewer = new ImagesViewer({
  images: imageList,
  defaultFallbackImage: 'https://example.com/default-error.jpg',
})

// 方式 B：单图独立错误图（覆盖全局）
const viewer = new ImagesViewer({
  images: [
    { url: 'https://a.jpg', fallback: 'https://a-fallback.jpg' },
    { url: 'https://b.jpg', fallback: 'https://b-fallback.jpg' },
  ],
  defaultFallbackImage: 'https://example.com/default-error.jpg',
})
```

### 11. 微前端生命周期

```js
let viewer = null

export function mount() {
  viewer = new ImagesViewer({ images, loop: true })
}

export function unmount() {
  if (viewer) {
    viewer.hide()
    viewer = null
  }
}
```

### 12. 单张图片

```js
const viewer = new ImagesViewer({
  images: [
    {
      url: 'https://example.com/photo.jpg',
      thumbnail: 'https://example.com/photo-thumb.jpg',
      title: '唯一图片',
    },
  ],
})
```

当 `images.length === 1` 时，`prev` / `next` 导航按钮自动隐藏。

### 13. 隐藏缩略图栏

```js
const viewer = new ImagesViewer({
  images: imageList,
  showThumbBar: false,
})
```

### 14. 按钮配置

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    zoomIn: true, // 放大
    zoomOut: true, // 缩小
    rotateLeft: true, // 左旋
    rotateRight: true, // 右旋
    reset: true, // 重置
    download: true, // 下载
    fullscreen: true, // 全屏
    prev: true, // 上一张
    next: true, // 下一张
    close: true, // 关闭（底部）
    topClose: true, // 关闭（顶部角标）
    thumbnails: true, // 缩略图栏显隐切换
    info: true, // 信息面板显隐切换
  },
})
```

### 15. 缩略图样式

```js
const viewer = new ImagesViewer({
  images: imageList,
  itemClass: 'my-thumb',
  activeItemClass: 'my-thumb-active',
})
```

单图覆盖：

```js
const viewer = new ImagesViewer({
  images: [
    { url: 'a.jpg', itemClass: 'thumb-red', activeItemClass: 'thumb-red-active' },
    { url: 'b.jpg', itemClass: 'thumb-blue' },
  ],
  itemClass: 'my-thumb',
  activeItemClass: 'my-thumb-active',
})
```

### 16. 错误样式

```js
const viewer = new ImagesViewer({
  images: imageList,
  errorClass: 'image-error',
})
```

单图覆盖：

```js
const viewer = new ImagesViewer({
  images: [{ url: 'a.jpg' }, { url: 'broken.jpg', errorClass: 'image-broken' }],
  errorClass: 'image-error',
})
```

## API 参考

### 构造选项

| 参数                   | 类型                   | 默认值                    | 说明                                                    |
| ---------------------- | ---------------------- | ------------------------- | ------------------------------------------------------- |
| `images`               | `string[] \| object[]` | `[]`                      | 图片列表。字符串数组将自动补全为对象。                  |
| `props`                | `object`               | `{url, title, thumbnail}` | 属性映射。值可为字符串或函数 `(item, index) => value`。 |
| `className`            | `string`               | `'images-viewer'`         | CSS 类名前缀，控制所有 DOM 节点类名。                   |
| `backdrop`             | `boolean`              | `false`                   | 点击遮罩或舞台背景关闭查看器。                          |
| `minZoomRatio`         | `number`               | `0.1`                     | 最小缩放倍率。                                          |
| `maxZoomRatio`         | `number`               | `5`                       | 最大缩放倍率。                                          |
| `loop`                 | `boolean`              | `true`                    | 首尾循环切换。                                          |
| `retryOnError`         | `boolean`              | `false`                   | 加载失败时自动重试（加时间戳防缓存，最多 3 次）。       |
| `defaultFallbackImage` | `string`               | `''`                      | 全局默认错误图片 URL。                                  |
| `showTitle`            | `boolean`              | `true`                    | 是否显示图片标题。                                      |
| `showCounter`          | `boolean`              | `true`                    | 是否显示页码计数器。                                    |
| `showNavButtons`       | `boolean`              | `true`                    | 是否显示左右导航箭头按钮。                              |
| `showThumbBar`         | `boolean`              | `true`                    | 是否显示底部缩略图栏。                                  |
| `itemClass`            | `string`               | `''`                      | 全局缩略图项 CSS class。                                |
| `activeItemClass`      | `string`               | `''`                      | 全局选中缩略图项 CSS class。                            |
| `errorClass`           | `string`               | `''`                      | 全局图片加载失败时 CSS class。                          |
| `buttons`              | `object`               | 全部 `true`               | 控制各按钮显隐。                                        |
| `customButtons`        | `[string, fn][]`       | `[]`                      | 自定义工具栏按钮。格式 `[label, handler]`。             |
| `initialViewIndex`     | `number`               | `0`                       | 初始打开的图片索引。首次打开时无动画。                  |
| `zIndex`               | `number`               | `5000`                    | 查看器容器 z-index。                                    |
| `imageInfo`            | `object`               | `{visible: false}`        | 信息面板配置。                                          |
| `i18n`                 | `object`               | 中文                      | 国际化文案。                                            |
| `theme`                | `object`               | 暗色主题                  | 完整主题配置。                                          |

所有回调入参统一为 `{ viewer, index, image, total, ...事件特有字段 }`，其中 `image` 为当前图片的规范化数据对象（含 `url`、`title`、`thumbnail`、`raw` 等），`total` 为图片总数。

| 回调           | 特有字段                   | 说明                             |
| -------------- | -------------------------- | -------------------------------- |
| `onShow`       | —                          | 查看器打开后触发。               |
| `onClose`      | —                          | 查看器关闭后触发。               |
| `onChange`     | `oldIndex`, `direction`    | 图片切换时触发。                 |
| `onRotate`     | `rotation`                 | 旋转时触发。                     |
| `onDrag`       | `translateX`, `translateY` | 拖拽时触发。                     |
| `onZoom`       | `scale`                    | 缩放时触发。                     |
| `onImageError` | `url`                      | 主图加载失败时触发。             |
| `onInfo`       | `scale`, `rotation`        | 返回 HTML 字符串自定义信息面板。 |
| `onCounter`    | —                          | 返回字符串自定义计数器。         |

### 按钮配置

```js
buttons: {
  zoomIn: true,      // 放大
  zoomOut: true,     // 缩小
  rotateLeft: true,  // 左旋
  rotateRight: true, // 右旋
  reset: true,       // 重置
  download: true,    // 下载
  copy: true,        // 复制到剪贴板
  fullscreen: true,  // 全屏
  prev: true,        // 上一张（单图自动隐藏）
  next: true,        // 下一张（单图自动隐藏）
  close: true,       // 关闭（底部）
  topClose: true,    // 关闭（顶部角标）
  thumbnails: true,  // 缩略图栏显隐切换
  info: true,        // 信息面板显隐切换
}
```

### 信息面板配置

```js
imageInfo: {
  visible: false,      // 初始是否显示
  showName: true,      // 显示图片名称
  showDimensions: true, // 显示图片尺寸
}
```

### 国际化配置

```js
i18n: {
  buttons: {
    prev: '上一张',
    next: '下一张',
    close: '关闭',
    loading: '加载中...',
  },
  info: {
    name: '名称：',
    dimensions: '尺寸：',
    page: '页码',
    scale: '缩放',
    rotation: '旋转',
    helpTitle: '操作指引',
    keyboardShortcuts: '键盘快捷键',
    gesture: '手势',
    prevShortcut: '← 上一张',
    nextShortcut: '→ 下一张',
    closeShortcut: 'Esc 关闭',
    zoomInShortcut: '+ / = 放大',
    zoomOutShortcut: '- / _ 缩小',
    resetShortcut: '0 重置',
    fullscreenShortcut: 'f 全屏',
    infoShortcut: 'i 信息面板',
    doubleClick: '双击 重置变换',
    wheelZoom: '滚轮 缩放',
    dragPan: '拖拽 平移（缩放>1时）',
  },
}
```

### 主题配置

```js
theme: {
  viewerBgColor: 'rgba(5, 5, 10, 0.92)',  // 查看器背景色
  textColor: '#e0e0e0',                   // 全局文字颜色
  activeColor: '#4a9eff',                 // 激活/高亮颜色
  toolbarBgColor: 'rgba(30, 30, 40, 0.85)', // 工具栏背景
  buttonBgColor: 'rgba(255, 255, 255, 0.08)', // 按钮背景
  buttonHoverBg: 'rgba(255, 255, 255, 0.15)', // 按钮悬停背景
  thumbItemWidth: 80,     // 缩略图宽度 (px)
  thumbItemHeight: 56,    // 缩略图高度 (px)
  thumbGap: 10,           // 缩略图间距 (px)
  thumbBarHeight: 90,     // 缩略图栏高度 (px)
  transitionSpeed: '0.3s', // 过渡动画速度
}
```

### 实例方法

| 方法                 | 参数     | 说明                                                     |
| -------------------- | -------- | -------------------------------------------------------- |
| `zoom(delta)`        | `number` | 相对缩放，如 `0.2` 放大 20%。                            |
| `rotate(deg)`        | `number` | 相对旋转，如 `90` 顺时针 90°。                           |
| `reset()`            | —        | 重置缩放、旋转和位移。                                   |
| `view(index)`        | `number` | 跳转到指定索引。负数取 0，越界取最后一张。支持链式调用。 |
| `prev()`             | —        | 切换到上一张。循环切换时首尾无动画。                     |
| `next()`             | —        | 切换到下一张。循环切换时首尾无动画。                     |
| `toggleImageInfo()`  | —        | 切换左上角信息面板显隐。                                 |
| `toggleThumbnails()` | —        | 切换底部缩略图栏显隐。                                   |
| `toggleTitle()`      | —        | 切换图片标题显隐。支持链式调用。                         |
| `toggleCounter()`    | —        | 切换页码计数器显隐。支持链式调用。                       |
| `toggleNavButtons()` | —        | 切换左右导航箭头显隐。支持链式调用。                     |
| `toggleFullscreen()` | —        | 切换浏览器全屏模式。                                     |
| `copyImage()`        | —        | 复制当前图片到剪贴板。返回 Promise。                     |
| `downloadImage()`    | —        | 触发当前图片下载。                                       |
| `hide()`             | —        | 关闭查看器并彻底销毁（所有方法均支持链式调用）。         |

### 键盘快捷键

| 按键      | 功能                                                       |
| --------- | ---------------------------------------------------------- |
| `←` / `→` | 上一张 / 下一张                                            |
| `Esc`     | 关闭查看器                                                 |
| `+` / `=` | 放大                                                       |
| `-` / `_` | 缩小                                                       |
| `0`       | 重置缩放与旋转                                             |
| `f`       | 切换全屏                                                   |
| `g`       | 跳转到指定图片（弹出输入框）                               |
| `i`       | 切换信息面板                                               |
| `Home`    | 跳转到第一张（无动画）                                     |
| `End`     | 跳转到最后一张（无动画）                                   |
| 双击      | 放大到 2 倍（以点击位置为中心）/ 已放大时恢复              |
| 滚轮      | 以鼠标位置为中心缩放                                       |
| 拖拽      | 平移图片（缩放不等于 100% 时可用，允许拖出图片本身的一半） |
| 左右滑动  | 切换图片（移动端，未缩放时）                               |

### 单图字段（全局 + 单图覆盖）

| 字段           | 全局选项               | 单图字段          | 说明                             |
| -------------- | ---------------------- | ----------------- | -------------------------------- |
| 错误图片       | `defaultFallbackImage` | `fallback`        | 加载失败时显示的替代图片。       |
| 缩略图样式     | `itemClass`            | `itemClass`       | 缩略图项的 CSS class。           |
| 选中缩略图样式 | `activeItemClass`      | `activeItemClass` | 选中缩略图项的 CSS class。       |
| 错误图片样式   | `errorClass`           | `errorClass`      | 图片加载失败时主图的 CSS class。 |

**优先级**：单图字段 > 全局选项。如果单图字段为空字符串，则回退到全局选项。

## 开发与构建

### 环境要求

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0（强制使用 pnpm，请勿使用 npm 或 yarn）

### 安装依赖

```bash
pnpm install
```

### 启动本地开发（含 demo/index.html）

```bash
pnpm dev
```

### 构建库产物

```bash
pnpm build
```

产物输出到 `dist/` 目录：

| 文件                             | 说明                                         |
| -------------------------------- | -------------------------------------------- |
| `dist/images-viewer.es.js`       | ESM 构建（ES2022+，体积更小）                |
| `dist/images-viewer.umd.js`      | UMD 构建（含 Legacy polyfill，兼容旧浏览器） |
| `dist/images-viewer-virtual.css` | 样式文件                                     |
| `dist/index.d.ts`                | TypeScript 类型声明（手动维护）              |

### 构建 VitePress 文档

```bash
pnpm docs:build
```

产物输出到 `docs/.vitepress/dist/`，可直接部署到 GitHub Pages。

---

## 发布到 npm

### 准备工作

1. 确保 `package.json` 中的 `author`、`repository`、`homepage`、`bugs` 已填写正确
2. 确保 `dist/` 目录已构建完整
3. 确保版本号已更新（遵循 SemVer）

### 发布步骤

```bash
# 1. 重新构建确保产物最新
pnpm build

# 2. 预览将要发布的内容（不真正发布）
npm publish --dry-run

# 3. 登录 npm（如未登录）
npm login

# 4. 正式发布（public 包）
npm publish --access public
```

### 版本升级与发布

```bash
# 自动升级版本号并生成 CHANGELOG（standard-version）
pnpm release       # 自动判断版本（根据 commit 类型）
pnpm release:patch # 升级 patch 版本（如 1.0.0 -> 1.0.1）
pnpm release:minor # 升级 minor 版本（如 1.0.0 -> 1.1.0）

# 升级后重新构建并发布
pnpm build
npm publish --access public
```

### 发布前检查清单

- [ ] `dist/` 包含所有产物（`.js`、`.css`、`.d.ts`）
- [ ] `package.json` `version` 已正确更新
- [ ] `package.json` `repository` / `homepage` / `bugs` 字段正确
- [ ] `CHANGELOG.md` 已更新
- [ ] `npm publish --dry-run` 无异常
- [ ] 手动测试通过（运行 demo/index.html）

---

## package.json 脚本说明

| 脚本            | 命令                                                     | 说明                                                            | 状态                            |
| --------------- | -------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `dev`           | `vite`                                                   | 启动本地开发服务器（打开 demo/index.html）                      | ✅ 可用                         |
| `build`         | `vite build`                                             | 构建库产物（ESM + UMD + CSS），`vite.config.js` 已适配 lib 模式 | ✅ 可用                         |
| `build:lib`     | `node scripts/build-lib.js`                              | 构建库产物（备用方式，与 `build` 效果相同）                     | ✅ 可用                         |
| `preview`       | `vite preview`                                           | 预览构建产物                                                    | ✅ 可用                         |
| `docs:prebuild` | `node scripts/build-lib.js && node scripts/copy-dist.js` | 构建库并复制到 docs/public                                      | ✅ 可用                         |
| `docs:dev`      | `pnpm docs:prebuild && vitepress dev docs`               | 启动 VitePress 文档开发                                         | ✅ 可用                         |
| `docs:build`    | `pnpm docs:prebuild && vitepress build docs`             | 构建 VitePress 文档                                             | ✅ 可用                         |
| `docs:preview`  | `vitepress preview docs`                                 | 预览 VitePress 文档                                             | ✅ 可用                         |
| `prepare`       | `husky`                                                  | 安装 husky Git 钩子（`npm install` 后自动执行）                 | ✅ 可用                         |
| `lint`          | `eslint . --fix`                                         | 运行 ESLint 并自动修复                                          | ✅ 可用                         |
| `lint:check`    | `eslint .`                                               | 仅检查 ESLint，不自动修复                                       | ✅ 可用                         |
| `format`        | `prettier --write .`                                     | 格式化所有代码                                                  | ✅ 可用                         |
| `stylelint`     | `stylelint "**/*.{css,scss}" --fix`                      | 检查并修复 CSS                                                  | ✅ 可用                         |
| `check-assets`  | `node scripts/check-assets.js`                           | 检查 `src/assets` 静态资源大小和格式                            | ✅ 可用（目录不存在时自动跳过） |
| `release`       | `standard-version`                                       | 根据 Conventional Commits 自动升级版本                          | ✅ 可用                         |
| `release:minor` | `standard-version --release-as minor`                    | 升级 minor 版本                                                 | ✅ 可用                         |
| `release:patch` | `standard-version --release-as patch`                    | 升级 patch 版本                                                 | ✅ 可用                         |

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:lib": "node scripts/build-lib.js",
    "preview": "vite preview",
    "docs:prebuild": "node scripts/build-lib.js && node scripts/copy-dist.js",
    "docs:dev": "pnpm docs:prebuild && vitepress dev docs",
    "docs:build": "pnpm docs:prebuild && vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "prepare": "husky",
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "format": "prettier --write .",
    "stylelint": "stylelint \"**/*.{css,scss}\" --fix",
    "check-assets": "node scripts/check-assets.js",
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:patch": "standard-version --release-as patch"
  }
}
```

---

## 提交规范

提交前自动执行 lint-staged（ESLint + Stylelint + Prettier）。
提交信息必须使用 Conventional Commits：

| 前缀        | 说明                                        |
| ----------- | ------------------------------------------- |
| `feat:`     | 新功能                                      |
| `fix:`      | 修复 bug                                    |
| `docs:`     | 文档修改                                    |
| `style:`    | 代码格式（不影响功能的空格、分号等）        |
| `refactor:` | 重构（既不修复 bug 也不添加功能的代码变更） |
| `perf:`     | 性能优化                                    |
| `chore:`    | 构建/工具/依赖升级                          |

---

## 包管理

本项目强制使用 `pnpm >=9.0.0 <11.0.0`，请勿使用 npm 或 yarn。

## 感谢

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。

## License

MIT
