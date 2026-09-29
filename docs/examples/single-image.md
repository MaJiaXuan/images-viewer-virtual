<script setup>
const demoCode = `new ImagesViewer({ images: images.slice(0, 1) })`
</script>

# 示例 13：单张图片

<DemoPreview :code="demoCode" />

当图片只有 1 张时，查看器会自动优化界面：

- `prev` / `next` 导航按钮自动隐藏
- 左右切换快捷键无响应
- 缩略图栏只显示一个缩略图
- 计数器显示 `1 / 1`

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

## 单图 + 全功能按钮

即使只有一张图片，其他功能按钮仍然可用：

```js
const viewer = new ImagesViewer({
  images: [{ url: 'photo.jpg', title: '唯一图片' }],
  buttons: {
    zoomIn: true,
    zoomOut: true,
    rotateLeft: true,
    rotateRight: true,
    reset: true,
    download: true,
    fullscreen: true,
    prev: true, // 自动隐藏
    next: true, // 自动隐藏
    close: true,
    topClose: true,
    thumbnails: true,
    info: true,
  },
})
```
