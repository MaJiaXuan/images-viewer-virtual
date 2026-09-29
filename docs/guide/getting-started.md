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

基于 [.browserslistrc](https://github.com/MaJiaXuan/images-viewer-virtual/blob/main/.browserslistrc) 和 Vite Legacy 插件构建，覆盖全球 95% 以上用户浏览器。

| 浏览器     | 最低版本（ESM） | 最低版本（UMD Legacy） | 支持情况    |
| ---------- | --------------- | ---------------------- | ----------- |
| Chrome     | 90+             | 60+                    | ✅ 完全支持 |
| Edge       | 90+             | 79+                    | ✅ 完全支持 |
| Firefox    | 90+             | 60+                    | ✅ 完全支持 |
| Safari     | 14+             | 12+                    | ✅ 完全支持 |
| IE 11      | —               | —                      | ❌ 不支持   |
| Opera Mini | —               | —                      | ❌ 不支持   |
