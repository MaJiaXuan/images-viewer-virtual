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

# 示例 21：10000 张图片

<DemoPreview :code="demoCode" images="10000" height="500" />

加载 10000 张图片，充分验证虚拟列表的承载能力。缩略图栏通过对象池复用，只维护视口内可见的 DOM 节点，滚动和切换依然保持流畅。

```js
const TOTAL = 10000
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

> 10000 张图片的真实测试证明：虚拟列表的 DOM 节点数量与图片总量完全无关，只取决于视口宽度和单张缩略图尺寸。即使图片数量达到上万张，缩略图栏依然保持极低的 DOM 开销和内存占用。
