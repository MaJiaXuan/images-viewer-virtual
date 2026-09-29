<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  loop: false,
  minZoomRatio: 0.5,
  maxZoomRatio: 3,
})`
</script>

# 示例 7：不循环 + 缩放限制

<DemoPreview :code="demoCode" />

关闭循环切换，设置最小/最大缩放倍率。

```js
const viewer = new ImagesViewer({
  images: imageList,
  loop: false,
  minZoomRatio: 0.5,
  maxZoomRatio: 3,
})
```
