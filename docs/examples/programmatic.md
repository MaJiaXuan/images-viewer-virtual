<script setup>
const demoCode = `const viewer = new ImagesViewer({
  images: images.slice(0, 5),
  onShow: () => {
    setTimeout(() => viewer.zoom(0.3), 500);
    setTimeout(() => viewer.rotate(90), 1000);
    setTimeout(() => viewer.reset(), 2000);
  },
})`
</script>

# 示例 10：程序化控制

<DemoPreview :code="demoCode" />

保留实例引用，通过 API 方法在外部控制查看器。

```js
const viewer = new ImagesViewer({ images: imageList, loop: true })

// 2 秒后自动切换
setTimeout(() => viewer.next(), 2000)

// 5 秒后放大并旋转
setTimeout(() => {
  viewer.zoom(0.5)
  viewer.rotate(90)
}, 5000)

// 10 秒后关闭
setTimeout(() => viewer.hide(), 10000)
```
