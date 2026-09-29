<script setup>
const demoCode = `const viewer = new ImagesViewer({ images: images.slice(0, 20), loop: true })

// 2 秒后跳转到第 5 张
setTimeout(() => viewer.view(4), 2000)

// 5 秒后跳转到第 3 张
setTimeout(() => viewer.view(2), 5000)

// 8 秒后跳转到第 10 张
setTimeout(() => viewer.view(9), 8000)`
</script>

# 示例 22：跳转到指定图片

<DemoPreview :code="demoCode" />

通过 `view(index)` 方法直接跳转到指定索引的图片，支持链式调用。

```js
const viewer = new ImagesViewer({ images: imageList })

// 跳转到第 5 张（索引从 0 开始）
viewer.view(4)

// 链式调用
viewer.view(4).zoom(0.5)

// 边界处理：负数取 0，越界取最后一张
viewer.view(-1) // 实际跳转到第 0 张
viewer.view(999) // 实际跳转到最后一张

// 结合键盘快捷键
// 按 g 键会弹出输入框，输入图片序号即可跳转
```

> 当 `index` 等于当前索引时，`view` 不会执行任何操作，避免不必要的刷新。
