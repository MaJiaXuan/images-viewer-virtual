# ImagesViewer

> 原生 JavaScript 图片查看器，支持虚拟列表、浏览器懒加载、手势拖拽与键盘快捷键，可在任何前端项目中直接使用。

[![npm version](https://img.shields.io/npm/v/images-viewer-virtual.svg?color=4a9eff)](https://www.npmjs.com/package/images-viewer-virtual)
[![npm downloads](https://img.shields.io/npm/dm/images-viewer-virtual.svg)](https://www.npmjs.com/package/images-viewer-virtual)
[![license](https://img.shields.io/npm/l/images-viewer-virtual.svg)](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/LICENSE)
[![demo](https://img.shields.io/badge/demo-online-4a9eff.svg)](https://majiaxuan.github.io/images-viewer-virtual/)
[![gzip size](https://img.shields.io/badge/gzip-<12%20kB-brightgreen.svg)](https://www.npmjs.com/package/images-viewer-virtual)

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。

## 在线演示

👉 **Demo 地址：<https://majiaxuan.github.io/images-viewer-virtual/>**

文档站点内置了 18 个可直接运行的交互示例，涵盖基础用法、虚拟列表、主题定制、自定义按钮、自定义信息面板、国际化、错误恢复与框架集成，**无需本地安装即可在线体验全部能力**。

| 入口             | 链接                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| 在线 Demo / 文档 | <https://majiaxuan.github.io/images-viewer-virtual/>                      |
| 快速开始         | <https://majiaxuan.github.io/images-viewer-virtual/guide/getting-started> |
| API 参考         | <https://majiaxuan.github.io/images-viewer-virtual/guide/api>             |
| 示例集           | <https://majiaxuan.github.io/images-viewer-virtual/examples/basic>        |
| 版本记录         | <https://majiaxuan.github.io/images-viewer-virtual/changelog>             |
| npm 包           | <https://www.npmjs.com/package/images-viewer-virtual>                     |
| 问题反馈         | <https://github.com/MaJiaXuan/images-viewer-virtual/issues>               |

## 特性

- **虚拟列表** — 缩略图栏只渲染视口内 DOM 节点，通过对象池复用，可承载上千张图片不卡顿
- **浏览器懒加载** — 主图与缩略图统一由浏览器原生 lazy loading 调度加载，无需手动缓存管理，代码更简、内存更省
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
- **UMD 产物**需被 `<script src>` 直接引入，构建时会按 [`.browserslistrc`](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/.browserslistrc) 降级语法。该文件是兼容范围的唯一定义处，改它即可调整 UMD 支持范围。
- UMD **只降语法、不注入 polyfill**。构建收尾会自检产物，若仍残留 `?.` / `??` 等 ES2020+ 语法会直接中断构建，避免旧浏览器拿到语法错误。
- 运行时 API 不在降级范围内：`copyImage()` 依赖 `navigator.clipboard`（Chrome 76+ / Edge 79+ / Firefox 127+），不支持时自动降级为复制图片 URL；全屏等 API 同样做了能力检测。
- 需要覆盖更旧的浏览器时，请在业务侧自行引入 polyfill，或下调 `.browserslistrc`。

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

> 以下全部示例均可在 [在线 Demo](https://majiaxuan.github.io/images-viewer-virtual/) 中直接运行体验，也可运行 `pnpm dev` 后在本地 `demo/index.html` 调试。

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

| 参数                   | 类型                   | 默认值                    | 说明                                                                               |
| ---------------------- | ---------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| `images`               | `string[] \| object[]` | `[]`                      | 图片列表。字符串数组将自动补全为对象。                                             |
| `props`                | `object`               | `{url, title, thumbnail}` | 属性映射。值可为字符串或函数 `(item, index) => value`。                            |
| `className`            | `string`               | `'images-viewer'`         | CSS 类名前缀，控制所有 DOM 节点类名。                                              |
| `backdrop`             | `boolean`              | `false`                   | 点击遮罩或舞台背景关闭查看器。                                                     |
| `minZoomRatio`         | `number`               | `0.1`                     | 最小缩放倍率。                                                                     |
| `maxZoomRatio`         | `number`               | `5`                       | 最大缩放倍率。                                                                     |
| `loop`                 | `boolean`              | `true`                    | 首尾循环切换。                                                                     |
| `retryOnError`         | `boolean`              | `false`                   | 加载失败时自动重试（加时间戳防缓存，最多 3 次）。                                  |
| `autoOrientation`      | `boolean`              | `false`                   | 图片未显式提供 `orientation` 时，自动请求并解析 JPEG EXIF 方向（需 CORS 或同源）。 |
| `defaultFallbackImage` | `string`               | `''`                      | 全局默认错误图片 URL。                                                             |
| `showTitle`            | `boolean`              | `true`                    | 是否显示图片标题。                                                                 |
| `showCounter`          | `boolean`              | `true`                    | 是否显示页码计数器。                                                               |
| `showNavButtons`       | `boolean`              | `true`                    | 是否显示左右导航箭头按钮。                                                         |
| `showThumbBar`         | `boolean`              | `true`                    | 是否显示底部缩略图栏。                                                             |
| `itemClass`            | `string`               | `''`                      | 全局缩略图项 CSS class。                                                           |
| `activeItemClass`      | `string`               | `''`                      | 全局选中缩略图项 CSS class。                                                       |
| `errorClass`           | `string`               | `''`                      | 全局图片加载失败时 CSS class。                                                     |
| `buttons`              | `object`               | 除 `copy` 外全为 `true`   | 控制各按钮显隐。                                                                   |
| `customButtons`        | `[string, fn][]`       | `[]`                      | 自定义工具栏按钮。格式 `[label, handler]`。                                        |
| `initialViewIndex`     | `number`               | `0`                       | 初始打开的图片索引。首次打开时无动画。                                             |
| `zIndex`               | `number`               | `5000`                    | 查看器容器 z-index。                                                               |
| `interval`             | `number`               | `5000`                    | 幻灯片自动播放（`play()`）的切换间隔，单位 ms。                                    |
| `imageInfo`            | `object`               | 见「信息面板配置」        | 信息面板配置。                                                                     |
| `i18n`                 | `object`               | 中文                      | 国际化文案。                                                                       |
| `theme`                | `object`               | 暗色主题                  | 完整主题配置。                                                                     |

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

### 旧选项名兼容

以下旧选项名会自动映射到新选项名，仍可正常使用（新代码建议使用新名）：

| 旧选项名           | 新选项名           |
| ------------------ | ------------------ |
| `minScale`         | `minZoomRatio`     |
| `maxScale`         | `maxZoomRatio`     |
| `namespace`        | `className`        |
| `closeOnMaskClick` | `backdrop`         |
| `initialIndex`     | `initialViewIndex` |

### 按钮配置

```js
buttons: {
  zoomIn: true,      // 放大
  zoomOut: true,     // 缩小
  rotateLeft: true,  // 左旋
  rotateRight: true, // 右旋
  reset: true,       // 重置
  download: true,    // 下载
  copy: false,       // 复制到剪贴板（默认关闭）
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
  // 工具栏按钮的 title 提示（未配置的键回退到内置中文）
  buttons: {
    zoomIn: '放大',
    zoomOut: '缩小',
    rotateLeft: '向左旋转',
    rotateRight: '向右旋转',
    reset: '重置',
    download: '下载',
    copy: '复制',
    fullscreen: '全屏',
    info: '信息',
    thumbnails: '缩略图',
    close: '关闭',
    loading: '加载中...',
  },
  // 信息面板标签
  info: {
    name: '名称:',
    dimensions: '尺寸:',
  },
  // 操作指引的分区标题（顶层键，不在 info 内）
  helpTitle: '操作指引',
  helpKeys: '快捷键',
  helpGestures: '手势',
}
```

> 注意：操作指引中的具体条目（`←` / `→`、`+`、`-`、`0`、`f`、`i`、`Esc`、`g`、双击、滚轮、拖拽）目前是内置文案，暂不支持通过 `i18n` 替换。`i18n.buttons.prev` / `i18n.buttons.next` 与 `i18n.helpButtons` 当前未生效（左右导航按钮的 title 为内置中文）。

### 主题配置

以下为默认（暗色）主题中的常用变量，完整 40+ 个变量见 [API 参考 · 主题配置](https://majiaxuan.github.io/images-viewer-virtual/guide/api#theme)。

```js
theme: {
  viewerBgColor: 'rgba(0,0,0,0.85)',          // 查看器背景色
  textColor: '#fff',                          // 全局文字颜色
  activeColor: '#4a9eff',                     // 激活/高亮颜色
  toolbarBgColor: 'rgba(40,40,40,0.8)',       // 工具栏背景
  buttonBgColor: 'rgba(255,255,255,0.1)',     // 按钮背景
  buttonHoverBg: 'rgba(255,255,255,0.25)',    // 按钮悬停背景
  thumbItemWidth: 80,     // 缩略图宽度 (px)
  thumbItemHeight: 56,    // 缩略图高度 (px)
  thumbGap: 10,           // 缩略图间距 (px)
  thumbBarHeight: 90,     // 缩略图栏高度 (px)
  transitionSpeed: '0.3s', // 过渡动画速度
}
```

### 实例方法

| 方法                    | 参数              | 说明                                                                                 |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `zoom(delta)`           | `number`          | 相对缩放，如 `0.2` 放大 20%，`-0.2` 缩小 20%。                                       |
| `zoomTo(ratio)`         | `number`          | 缩放到绝对倍率，受 `minZoomRatio` / `maxZoomRatio` 约束。                            |
| `rotate(deg)`           | `number`          | 相对旋转，如 `90` 顺时针 90°。                                                       |
| `rotateTo(degree)`      | `number`          | 旋转到绝对角度（deg）。                                                              |
| `move(x, y)`            | `number, number`  | 相对位移。`y` 省略时取 `x`。                                                         |
| `moveTo(x, y)`          | `number, number`  | 移动到绝对位移。`y` 省略时取 `x`。                                                   |
| `reset()`               | —                 | 重置缩放、旋转和位移。                                                               |
| `toggle()`              | —                 | 在 `1`（原始比例）与「适应窗口」倍率之间切换缩放。                                   |
| `view(index, animated)` | `number, boolean` | 跳转到指定索引。`animated` 默认 `true`，`false` 时无动画。负数取 0，越界取最后一张。 |
| `prev()`                | —                 | 切换到上一张。循环切换时首尾无动画。                                                 |
| `next()`                | —                 | 切换到下一张。循环切换时首尾无动画。                                                 |
| `toggleImageInfo()`     | —                 | 切换左上角信息面板显隐。                                                             |
| `toggleThumbnails()`    | —                 | 切换底部缩略图栏显隐（`showThumbBar: false` 时为空操作）。                           |
| `toggleTitle()`         | —                 | 切换图片标题显隐。                                                                   |
| `toggleCounter()`       | —                 | 切换页码计数器显隐。                                                                 |
| `toggleNavButtons()`    | —                 | 切换左右导航箭头显隐。                                                               |
| `toggleFullscreen()`    | —                 | 切换浏览器全屏模式。                                                                 |
| `tooltip()`             | —                 | 显示当前缩放百分比指示器（1.5 秒后自动隐藏）。                                       |
| `play()`                | —                 | 开始幻灯片自动播放，间隔由 `interval` 选项控制（默认 `5000` ms）。                   |
| `stop()`                | —                 | 停止幻灯片自动播放。                                                                 |
| `update()`              | —                 | 重新读取 `options.images` 并刷新视图，用于动态增删 / 替换图片。                      |
| `copyImage()`           | —                 | 复制当前图片到剪贴板。返回 `Promise<boolean>`。                                      |
| `downloadImage()`       | —                 | 触发当前图片下载（内部按 Canvas → fetch 依次降级）。返回 Promise。                   |
| `hide()`                | —                 | 关闭查看器并彻底销毁 DOM、事件和 Timer。                                             |

> 除 `copyImage()` / `downloadImage()` 外，所有方法均返回实例自身，支持链式调用。

动态增删图片后需要调用 `update()` 让查看器重新读取数据：

```js
const viewer = new ImagesViewer({ images: ['a.jpg', 'b.jpg'] })

// 追加图片
viewer.options.images.push('c.jpg')
viewer.update() // 缩略图、计数器、当前图片同步刷新

// 整体替换（例如切换筛选结果）
viewer.options.images = filteredImages.map(url => ({ url }))
viewer.update()
```

`update()` 的行为约定：

- 当前图片未变化时**保留**缩放与旋转状态，仅换图才重置变换；
- 图片被删除导致索引越界时，`currentIndex` 自动收敛到最后一张；
- 缩略图对象池会强制重渲染，同索引换图也能正确刷新（不会残留旧图）；
- 索引发生变化时触发 `onChange`，未变化则不触发（避免与「切换图片」语义混淆）；
- 图片列表被清空时不报错，仅同步计数器。

### 键盘快捷键

| 按键      | 功能                                                            |
| --------- | --------------------------------------------------------------- |
| `←` / `→` | 上一张 / 下一张                                                 |
| `Esc`     | 关闭查看器                                                      |
| `+` / `=` | 放大                                                            |
| `-` / `_` | 缩小                                                            |
| `0`       | 重置缩放与旋转                                                  |
| `f`       | 切换全屏                                                        |
| `g`       | 跳转到指定图片（弹出输入框）                                    |
| `i`       | 切换信息面板                                                    |
| `Home`    | 跳转到第一张（无动画）                                          |
| `End`     | 跳转到最后一张（无动画）                                        |
| 双击      | 重置缩放、旋转与位移                                            |
| 滚轮      | 以鼠标位置为中心缩放                                            |
| 拖拽      | 平移图片（任何缩放倍率下均可，允许越过边界 60px，松手自动回弹） |
| 左右滑动  | 切换图片（移动端，未缩放时）                                    |

### 单图字段（全局 + 单图覆盖）

| 字段           | 全局选项               | 单图字段          | 说明                             |
| -------------- | ---------------------- | ----------------- | -------------------------------- |
| 错误图片       | `defaultFallbackImage` | `fallback`        | 加载失败时显示的替代图片。       |
| 缩略图样式     | `itemClass`            | `itemClass`       | 缩略图项的 CSS class。           |
| 选中缩略图样式 | `activeItemClass`      | `activeItemClass` | 选中缩略图项的 CSS class。       |
| 错误图片样式   | `errorClass`           | `errorClass`      | 图片加载失败时主图的 CSS class。 |
| EXIF 方向      | —（仅单图字段）        | `orientation`     | EXIF 方向值（1-8）。             |

**优先级**：单图字段 > 全局选项。如果单图字段为空字符串，则回退到全局选项。

### EXIF 方向

手机拍摄的 JPEG 常在 EXIF 中记录方向，直接渲染会横竖颠倒。两种处理方式：

```js
// 方式一：已知方向时直接声明（零开销）
new ImagesViewer({
  images: [{ url: 'photo.jpg', orientation: 6 }],
})

// 方式二：开启自动解析（默认关闭，会额外请求图片字节流）
new ImagesViewer({
  images: ['photo.jpg'],
  autoOrientation: true, // 需要图片允许 CORS 或同源
})
```

方向以 CSS transform 应用在整条变换链最外层，`reset()` 只重置用户的缩放/旋转/平移，不影响方向。解析结果按 URL 缓存，切换回同一张图不会重复请求。

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

| 文件                             | 说明                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `dist/images-viewer.es.js`       | ESM 构建（`esnext`，不降级，体积更小）                                                |
| `dist/images-viewer.umd.js`      | UMD 构建（按 `.browserslistrc` 降级语法，不含 `?.` 等 ES2020+ 语法；不注入 polyfill） |
| `dist/images-viewer-virtual.css` | 样式文件                                                                              |
| `dist/index.d.ts`                | TypeScript 类型声明（源文件 `types/index.d.ts`，构建时复制）                          |

### 构建 VitePress 文档

```bash
pnpm docs:build
```

产物输出到 `docs/.vitepress/dist/`，可直接部署到 GitHub Pages。

线上地址：<https://majiaxuan.github.io/images-viewer-virtual/>，由 `.github/workflows/deploy.yml` 在 `main` 分支推送后自动构建部署。

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
- [ ] README 中的 Demo 地址（<https://majiaxuan.github.io/images-viewer-virtual/>）可正常访问
- [ ] `npm publish --dry-run` 无异常
- [ ] `pnpm test` 全部通过
- [ ] 手动测试通过（运行 demo/index.html）

---

## package.json 脚本说明

| 脚本            | 命令                                                     | 说明                                                            | 状态                            |
| --------------- | -------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `dev`           | `vite`                                                   | 启动本地开发服务器（打开 demo/index.html）                      | ✅ 可用                         |
| `build`         | `vite build`                                             | 构建库产物（ESM + UMD + CSS），`vite.config.js` 已适配 lib 模式 | ✅ 可用                         |
| `build:lib`     | `node scripts/build-lib.js`                              | 构建库产物（备用方式，与 `build` 效果相同）                     | ✅ 可用                         |
| `preview`       | `vite preview`                                           | 预览构建产物                                                    | ✅ 可用                         |
| `test`          | `node --import ./test/register.mjs test/api.test.mjs`    | 运行 API 测试（纯 Node 环境，模拟 DOM，无需浏览器）             | ✅ 可用                         |
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
    "test": "node --import ./test/register.mjs test/api.test.mjs",
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

## 相关链接

- 在线 Demo / 文档：<https://majiaxuan.github.io/images-viewer-virtual/>
- npm 包：<https://www.npmjs.com/package/images-viewer-virtual>
- GitHub 仓库：<https://github.com/MaJiaXuan/images-viewer-virtual>
- 问题反馈：<https://github.com/MaJiaXuan/images-viewer-virtual/issues>
- 更新日志：<https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/CHANGELOG.md>

## 感谢

本插件在设计上借鉴了 [images-viewer](https://gitee.com/ybchen292/images-viewer)（作者：ybchen292），感谢原作者提供的优秀设计思路与交互参考。

## License

MIT
