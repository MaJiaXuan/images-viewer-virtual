<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  showTitle: true,
  showCounter: true,
  showNavButtons: true,
  showThumbBar: true,
  buttons: {
    zoomIn: true, zoomOut: true, rotateLeft: true, rotateRight: true,
    reset: true, download: true, fullscreen: true,
    prev: true, next: true, close: true, topClose: true,
    thumbnails: true, info: true,
  },
  imageInfo: { visible: true, showName: true, showDimensions: true },
  onChange: data => console.log('切换:', data.index),
  onImageError: data => console.warn('加载失败:', data.url),
})`
</script>

# 示例 29：完整工具栏

<DemoPreview :code="demoCode" />

展示所有工具栏按钮和 UI 元素同时启用时的完整效果。适用于需要全部功能的管理后台或专业看图场景。

```js
const viewer = new ImagesViewer({
  images: imageList,

  // 所有 UI 元素显示
  showTitle: true,
  showCounter: true,
  showNavButtons: true,
  showThumbBar: true,

  // 所有工具栏按钮启用
  buttons: {
    zoomIn: true, // 放大 +
    zoomOut: true, // 缩小 -
    rotateLeft: true, // 左旋 ↺
    rotateRight: true, // 右旋 ↻
    reset: true, // 重置 ⌂
    download: true, // 下载 ↓
    fullscreen: true, // 全屏 ⛶
    prev: true, // 上一张 ←
    next: true, // 下一张 →
    close: true, // 关闭 ✕
    topClose: true, // 顶部关闭 ×
    thumbnails: true, // 缩略图 ☰
    info: true, // 信息 ℹ
  },

  // 信息面板
  imageInfo: {
    visible: true,
    showName: true,
    showDimensions: true,
  },

  // 事件回调
  onChange: data => console.log('切换:', data.index),
  onImageError: data => console.warn('加载失败:', data.url),
})
```

## 按钮对照表

| 按钮键        | 图标 | 功能                 | 默认   |
| ------------- | ---- | -------------------- | ------ |
| `zoomIn`      | `+`  | 放大 20%             | `true` |
| `zoomOut`     | `-`  | 缩小 20%             | `true` |
| `rotateLeft`  | `↺`  | 逆时针旋转 90°       | `true` |
| `rotateRight` | `↻`  | 顺时针旋转 90°       | `true` |
| `reset`       | `⌂`  | 重置缩放、旋转、位移 | `true` |
| `download`    | `↓`  | 下载当前图片         | `true` |
| `fullscreen`  | `⛶`  | 切换浏览器全屏       | `true` |
| `prev`        | `←`  | 上一张图片           | `true` |
| `next`        | `→`  | 下一张图片           | `true` |
| `close`       | `✕`  | 关闭查看器（底部）   | `true` |
| `topClose`    | `×`  | 关闭查看器（顶部）   | `true` |
| `thumbnails`  | `☰` | 切换缩略图栏         | `true` |
| `info`        | `ℹ` | 切换信息面板         | `true` |

## 精简模式对比

与完整工具栏相对的是**精简模式**，只保留核心功能：

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    zoomIn: true,
    zoomOut: true,
    reset: true,
    prev: true,
    next: true,
    close: true,
  },
  showTitle: false,
  showCounter: false,
})
```

> 完整工具栏按钮较多，在小屏设备上可能换行。建议根据实际使用场景选择启用哪些按钮。
