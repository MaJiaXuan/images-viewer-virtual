<script setup>
const demoCode = `new ImagesViewer({
  images: images,
  loop: true,
  buttons: {
    zoomIn: true, zoomOut: true, rotateLeft: true, rotateRight: true,
    reset: true, download: true, fullscreen: true,
    prev: true, next: true, close: true, topClose: true,
    thumbnails: true, info: true,
  },
  onChange: data => console.log('切换:', data.index),
})`
</script>

# 示例 20：5000 张图片

<DemoPreview :code="demoCode" images="5000" height="500" />

加载 5000 张图片，虚拟列表确保缩略图栏只渲染当前视口可见的 DOM 节点。通过对象池复用，DOM 节点数量始终维持在个位数，滚动和切换依然流畅。

```js
const TOTAL = 5000
const images = Array.from({ length: TOTAL }, (_, i) => ({
  url: `https://example.com/${i}.jpg`,
  thumbnail: `https://example.com/${i}-thumb.jpg`,
  title: `图片 ${i + 1}`,
}))

const viewer = new ImagesViewer({
  images,
  loop: true,
})
```

> 5000 张图片下，主图与缩略图均由浏览器原生懒加载调度，未加载的图片不占用带宽与内存；缩略图栏 DOM 节点数量与图片总量无关，只与视口宽度有关。
