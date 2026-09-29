<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  buttons: {
    zoomIn: true, zoomOut: true, rotateLeft: true, rotateRight: true,
    reset: true, download: true, copy: true, fullscreen: true,
    prev: true, next: true, close: true, topClose: true,
    thumbnails: true, info: true,
  },
})`
</script>

# 示例：复制图片到剪贴板

<DemoPreview :code="demoCode" />

通过 `copy` 按钮将当前图片复制到剪贴板。支持通过 Canvas 直接复制图片像素数据，避免跨域限制。

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    copy: true, // 工具栏显示复制按钮
  },
})

// 程序化调用（也返回 Promise）
viewer.copyImage().then(ok => {
  if (ok) console.log('图片已复制')
  else console.log('已复制图片 URL')
})
```

## 浏览器兼容性

| 方式                   | 浏览器支持                         | 说明                 |
| ---------------------- | ---------------------------------- | -------------------- |
| Canvas + ClipboardItem | Chrome 76+, Edge 79+, Firefox 127+ | 直接复制图片到剪贴板 |
| 降级（URL）            | 所有现代浏览器                     | 复制图片 URL 文本    |

> 注意：Safari 对 `ClipboardItem` 的支持有限，降级时会复制图片 URL。

## 安全限制

- 页面必须通过 HTTPS 或 localhost 运行
- 用户需要主动点击按钮触发，不能自动调用
- 跨域图片（CORS 未允许）可能导致 Canvas 被污染，此时降级为复制 URL

## 隐藏下载按钮、只保留复制

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    zoomIn: true,
    zoomOut: true,
    reset: true,
    copy: true, // 只显示复制按钮
    download: false, // 隐藏下载按钮
    prev: true,
    next: true,
    close: true,
  },
})
```
