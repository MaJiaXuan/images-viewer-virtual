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

# 示例 19：1000 张图片

<DemoPreview :code="demoCode" images="1000" height="500" />

使用虚拟列表加载 1000 张图片，缩略图栏只渲染视口内 DOM 节点，通过对象池复用，DOM 节点数量始终维持在个位数，确保流畅浏览。

```js
const TOTAL = 1000
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

> 即使图片数量达到 1000 张，缩略图栏的 DOM 节点数量也始终保持在 10~20 个左右（视口可见范围），不会因为图片数量增加而线性增长。
