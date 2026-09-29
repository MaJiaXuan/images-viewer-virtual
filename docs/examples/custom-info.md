<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  onCounter: ({ index, total }) => '第 ' + (index + 1) + ' / ' + total + ' 张',
  onInfo: ({ index, total, scale }) => '<div style="font-size:12px">序号: ' + (index + 1) + ' / ' + total + '<br>缩放: ' + (scale * 100).toFixed(0) + '%</div>',
})`
</script>

# 示例 6：自定义信息面板

<DemoPreview :code="demoCode" />

通过 `onInfo` 和 `onCounter` 完全自定义信息面板和计数器内容。

```js
const viewer = new ImagesViewer({
  images: imageList,
  imageInfo: { visible: true, showName: true, showDimensions: true },
  onCounter: ({ index, total }) => `第 ${index + 1} / ${total} 张`,
  onInfo: ({ index, total, scale, rotation }) => {
    return `<div style="font-size:12px">
      序号: ${index + 1} / ${total}<br>
      缩放: ${(scale * 100).toFixed(0)}%<br>
      旋转: ${rotation}°
    </div>`
  },
})
```
