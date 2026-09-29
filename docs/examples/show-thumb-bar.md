<script setup>
const demoCode = `new ImagesViewer({ images: images.slice(0, 5), showThumbBar: false })`
</script>

# 示例 14：隐藏缩略图栏

<DemoPreview :code="demoCode" />

通过 `showThumbBar: false` 完全隐藏底部缩略图栏，适用于只需要全屏查看大图的场景。

```js
const viewer = new ImagesViewer({
  images: imageList,
  showThumbBar: false,
})
```

## 配合自定义按钮切换

```js
const viewer = new ImagesViewer({
  images: imageList,
  showThumbBar: false,
  buttons: {
    thumbnails: true, // 保留缩略图切换按钮
  },
})

// 用户可以通过工具栏按钮手动切换缩略图栏显隐
// 或通过 API：viewer.toggleThumbnails()
```

## 与单图模式结合

```js
const viewer = new ImagesViewer({
  images: [singleImage],
  showThumbBar: false, // 单图也不需要缩略图栏
})
```
