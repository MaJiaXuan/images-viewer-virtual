# 快速开始

## 安装

```bash
# npm
npm install images-viewer-virtual

# pnpm
pnpm add images-viewer-virtual

# yarn
yarn add images-viewer-virtual
```

## 基础用法

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

## 字符串数组

如果图片只有 URL，可以直接传入字符串数组：

```js
const viewer = new ImagesViewer(['https://example.com/a.jpg', 'https://example.com/b.jpg'])
```

## CDN 使用

```html
<script src="https://unpkg.com/images-viewer-virtual/dist/images-viewer.umd.js"></script>
<script>
  const viewer = new ImagesViewer({ images: [...] })
</script>
```

## 框架集成

ImagesViewer 是纯原生 JavaScript 库，不依赖任何框架。以下是最常用的框架集成方式：

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
  private viewer: any = null

  open(images: any[], index = 0) {
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

更多框架（Svelte、Solid、Vanilla JS）的详细集成方式请参考 [框架集成指南](/guide/framework-integration)。

## 微前端

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
