<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  customButtons: [
    ['分享', function() { alert('分享: ' + this.images[this.currentIndex].title) }],
    ['收藏', function() { console.log('收藏:', this.currentIndex) }],
  ],
})`
</script>

# 示例 4：自定义按钮

<DemoPreview :code="demoCode" />

通过 `customButtons` 在工具栏添加自己的按钮。每个按钮是 `[label, handler]` 数组。

```js
const viewer = new ImagesViewer({
  images: imageList,
  customButtons: [
    [
      '分享',
      function () {
        alert('分享当前图片: ' + this.images[this.currentIndex].title)
      },
    ],
    [
      '收藏',
      function () {
        console.log('收藏:', this.currentIndex)
      },
    ],
  ],
})
```
