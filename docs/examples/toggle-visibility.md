<script setup>
const demoCode = `const viewer = new ImagesViewer({
  images: images.slice(0, 5),
})

// 1 秒后隐藏标题
setTimeout(() => viewer.toggleTitle(), 1000)

// 2 秒后隐藏计数器
setTimeout(() => viewer.toggleCounter(), 2000)

// 3 秒后隐藏导航按钮
setTimeout(() => viewer.toggleNavButtons(), 3000)

// 5 秒后全部恢复
setTimeout(() => {
  viewer.toggleTitle().toggleCounter().toggleNavButtons()
}, 5000)`
</script>

# 示例 24：运行时切换显示

<DemoPreview :code="demoCode" />

通过 `toggleTitle()`、`toggleCounter()`、`toggleNavButtons()` 在运行时动态切换各元素的显示状态。支持链式调用。

```js
const viewer = new ImagesViewer({ images: imageList })

// 隐藏标题
viewer.toggleTitle()

// 隐藏计数器
viewer.toggleCounter()

// 隐藏导航按钮
viewer.toggleNavButtons()

// 链式调用：同时切换多个
viewer.toggleTitle().toggleCounter()

// 全部恢复显示
viewer.toggleTitle().toggleCounter().toggleNavButtons()
```

## 实际应用场景

```js
const viewer = new ImagesViewer({ images: imageList })

// 进入纯预览模式（隐藏所有 UI）
function enterCleanMode() {
  viewer.toggleTitle().toggleCounter().toggleNavButtons().toggleThumbnails()
}

// 退出纯预览模式
function exitCleanMode() {
  viewer.toggleTitle().toggleCounter().toggleNavButtons().toggleThumbnails()
}

// 快捷键切换（配合 onShow 或自定义按钮）
viewer.options.customButtons = [
  ['极简', () => enterCleanMode()],
  ['完整', () => exitCleanMode()],
]
```

> 所有 `toggleXxx()` 方法返回 `viewer` 实例本身，支持链式调用。如果对应的 DOM 元素未创建（如构造时 `showTitle: false`），调用该方法不会报错，也不会有任何效果。
