<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  buttons: {
    zoomIn: true, zoomOut: true, reset: true,
    prev: true, next: true, close: true,
  },
})`
</script>

# 示例 15：按钮配置详解

<DemoPreview :code="demoCode" />

`buttons` 选项控制工具栏中各按钮的显示与隐藏。除 `copy` 默认关闭外，其余均默认启用。

## 基础配置

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    zoomIn: true, // 放大
    zoomOut: true, // 缩小
    rotateLeft: true, // 左旋
    rotateRight: true, // 右旋
    reset: true, // 重置
    copy: false, // 复制图片到剪贴板（默认关闭）
    download: true, // 下载图片
    fullscreen: true, // 全屏
    prev: true, // 上一张
    next: true, // 下一张
    close: true, // 关闭（底部）
    topClose: true, // 关闭（顶部角标）
    thumbnails: true, // 缩略图栏显隐切换
    info: true, // 信息面板显隐切换
  },
})
```

## 只保留核心功能

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
})
```

## 完全隐藏工具栏

```js
const viewer = new ImagesViewer({
  images: imageList,
  buttons: {
    zoomIn: false,
    zoomOut: false,
    rotateLeft: false,
    rotateRight: false,
    reset: false,
    copy: false,
    download: false,
    fullscreen: false,
    prev: false,
    next: false,
    close: false,
    topClose: false,
    thumbnails: false,
    info: false,
  },
})
```

## 单图自动隐藏

当 `images.length === 1` 时，`prev` 和 `next` 按钮会自动隐藏，无论 `buttons` 中如何设置。其他按钮不受影响。

```js
const viewer = new ImagesViewer({
  images: [singleImage],
  buttons: { prev: true, next: true }, // 实际上不会显示
})
```
