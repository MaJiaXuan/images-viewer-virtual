<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  loop: true,
  buttons: {
    zoomIn: true, zoomOut: true, rotateLeft: true, rotateRight: true,
    reset: true, download: true, fullscreen: true,
    prev: true, next: true, close: true, topClose: true,
    thumbnails: true, info: true,
  },
  onChange: data => console.log('切换:', data.index),
  onImageError: data => console.warn('加载失败:', data.url),
})`
</script>

# 示例 1：基础用法

<DemoPreview :code="demoCode" />

传入图片对象数组，配置常用按钮和事件回调。

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
