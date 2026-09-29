# 前端框架集成

ImagesViewer 是纯原生 JavaScript 库，**不依赖任何框架**，因此可以在 React、Vue、Angular、Svelte 等任意前端框架中直接使用。以下是各框架的典型集成方式。

---

## React

### 函数组件 + Hooks

```jsx
import { useRef, useCallback } from 'react'
import ImagesViewer from 'images-viewer-virtual'

function Gallery({ images, currentIndex }) {
  const viewerRef = useRef(null)

  const openViewer = useCallback(() => {
    // 关闭旧的实例
    if (viewerRef.current) {
      viewerRef.current.hide()
    }
    viewerRef.current = new ImagesViewer({
      images,
      initialViewIndex: currentIndex,
      backdrop: false,
      loop: true,
      onClose: () => {
        viewerRef.current = null
      },
    })
  }, [images, currentIndex])

  // 组件卸载时销毁
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.hide()
        viewerRef.current = null
      }
    }
  }, [])

  return <button onClick={openViewer}>查看图片</button>
}
```

### 使用 ref 获取实例方法

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react'
import ImagesViewer from 'images-viewer-virtual'

const ImageViewer = forwardRef(({ images }, ref) => {
  const instanceRef = useRef(null)

  useImperativeHandle(ref, () => ({
    open: (index = 0) => {
      if (instanceRef.current) instanceRef.current.hide()
      instanceRef.current = new ImagesViewer({ images, initialViewIndex: index })
    },
    close: () => {
      if (instanceRef.current) {
        instanceRef.current.hide()
        instanceRef.current = null
      }
    },
    zoom: delta => instanceRef.current?.zoom(delta),
    rotate: deg => instanceRef.current?.rotate(deg),
    reset: () => instanceRef.current?.reset(),
  }))

  useEffect(
    () => () => {
      if (instanceRef.current) {
        instanceRef.current.hide()
        instanceRef.current = null
      }
    },
    []
  )

  return null
})

// 使用
function App() {
  const viewerRef = useRef()
  return (
    <>
      <ImageViewer ref={viewerRef} images={imageList} />
      <button onClick={() => viewerRef.current.open(2)}>打开第3张</button>
    </>
  )
}
```

---

## Vue 2

### 组件封装

```vue
<template>
  <button @click="openViewer">查看图片</button>
</template>

<script>
import ImagesViewer from 'images-viewer-virtual'

export default {
  props: {
    images: { type: Array, default: () => [] },
    initialViewIndex: { type: Number, default: 0 },
  },
  data() {
    return { viewer: null }
  },
  beforeDestroy() {
    if (this.viewer) {
      this.viewer.hide()
      this.viewer = null
    }
  },
  methods: {
    openViewer() {
      if (this.viewer) this.viewer.hide()
      this.viewer = new ImagesViewer({
        images: this.images,
        initialViewIndex: this.initialViewIndex,
        onClose: () => {
          this.viewer = null
        },
      })
    },
  },
}
</script>
```

### 在 Vuex / Vue Router 中使用

```js
// store.js 或组件中
import ImagesViewer from 'images-viewer-virtual'

let viewer = null

export function openGallery(images, index = 0) {
  if (viewer) viewer.hide()
  viewer = new ImagesViewer({
    images,
    initialViewIndex: index,
    onClose: () => {
      viewer = null
    },
  })
}

export function closeGallery() {
  if (viewer) {
    viewer.hide()
    viewer = null
  }
}
```

---

## Vue 3 (Composition API)

```vue
<template>
  <button @click="openViewer">查看图片</button>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import ImagesViewer from 'images-viewer-virtual'

const props = defineProps({
  images: { type: Array, default: () => [] },
  initialViewIndex: { type: Number, default: 0 },
})

const viewer = ref(null)

const openViewer = () => {
  if (viewer.value) viewer.value.hide()
  viewer.value = new ImagesViewer({
    images: props.images,
    initialViewIndex: props.initialViewIndex,
    onClose: () => {
      viewer.value = null
    },
  })
}

onUnmounted(() => {
  if (viewer.value) {
    viewer.value.hide()
    viewer.value = null
  }
})
</script>
```

---

## Angular

### 服务封装

```ts
// image-viewer.service.ts
import { Injectable } from '@angular/core'
import ImagesViewer from 'images-viewer-virtual'

@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  private viewer: any = null

  open(images: any[], index = 0, options: any = {}) {
    if (this.viewer) this.viewer.hide()
    this.viewer = new ImagesViewer({
      images,
      initialViewIndex: index,
      ...options,
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

### 组件中使用

```ts
// gallery.component.ts
import { Component, OnDestroy } from '@angular/core'
import { ImageViewerService } from './image-viewer.service'

@Component({
  selector: 'app-gallery',
  template: `<button (click)="open()">查看图片</button>`,
})
export class GalleryComponent implements OnDestroy {
  images = [
    { url: 'https://example.com/1.jpg', thumbnail: 'https://example.com/1t.jpg', title: '图片 1' },
  ]

  constructor(private viewer: ImageViewerService) {}

  open() {
    this.viewer.open(this.images, 0)
  }

  ngOnDestroy() {
    this.viewer.hide()
  }
}
```

---

## Svelte

```svelte
<script>
  import { onDestroy } from 'svelte'
  import ImagesViewer from 'images-viewer-virtual'

  export let images = []
  export let initialViewIndex = 0

  let viewer = null

  function openViewer() {
    if (viewer) viewer.hide()
    viewer = new ImagesViewer({
      images,
      initialViewIndex,
      onClose: () => { viewer = null },
    })
  }

  onDestroy(() => {
    if (viewer) {
      viewer.hide()
      viewer = null
    }
  })
</script>

<button on:click={openViewer}>查看图片</button>
```

---

## 原生 JavaScript (无框架)

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import ImagesViewer from 'images-viewer-virtual'

      const images = [
        {
          url: 'https://example.com/1.jpg',
          thumbnail: 'https://example.com/1t.jpg',
          title: '图片 1',
        },
      ]

      document.getElementById('open').addEventListener('click', () => {
        new ImagesViewer({ images })
      })
    </script>
  </head>
  <body>
    <button id="open">查看图片</button>
  </body>
</html>
```

---

## 通用注意事项

1. **自动销毁（用户手动关闭时）**：当用户点击关闭按钮、按 Esc、或点击遮罩关闭查看器时，`hide()` 方法会自动执行，清理所有 DOM、事件监听和 Timer。如果注册了 `onClose` 回调，可在此自动将外部引用置为 `null`：

   ```js
   onClose: () => {
     this.viewer = null
   }
   ```

   因此，**用户手动关闭后无需再手动调用 `hide()`**。

2. **组件卸载时兜底**：如果组件在路由切换时被卸载，而查看器此时仍开着，需要在卸载生命周期中调用 `hide()`，避免强制移除 DOM 后残留的事件监听导致报错：

   ```js
   // React
   useEffect(() => () => { if (viewerRef.current) viewerRef.current.hide() }, [])
   // Vue 3
   onUnmounted(() => { if (viewer.value) viewer.value.hide() })
   // Angular
   ngOnDestroy() { if (this.viewer) this.viewer.hide() }
   ```

3. **单例模式**：如果应用全局只有一个查看器，建议将实例存储在顶层状态（如 Vuex store、React Context、Angular Service）中统一管理。

4. **SSR 兼容**：ImagesViewer 只操作 `document` 和 `window`，如果在服务端渲染（SSR）中使用，确保只在客户端执行（如 `typeof window !== 'undefined'` 判断）。

5. **CDN 方式**：框架项目也支持通过 CDN 直接引入：

```html
<script src="https://unpkg.com/images-viewer-virtual/dist/images-viewer.umd.js"></script>
<script>
  const viewer = new ImagesViewer({ images: [...] })
</script>
```
