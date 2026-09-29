<script setup>
const demoCode = `const viewer = new ImagesViewer({
  images: images.slice(0, 5),
  onShow: () => {
    setTimeout(() => { console.log('模拟微前端 unmount'); viewer.hide(); }, 5000);
  },
  onClose: () => console.log('已完全销毁'),
})`
</script>

# 示例 12：微前端生命周期

<DemoPreview :code="demoCode" />

在 qiankun / micro-app / single-spa 等微前端框架中，子应用卸载时必须彻底销毁查看器，避免全局事件泄漏。

```js
// 子应用挂载时初始化
let viewer = null

export function mount() {
  viewer = new ImagesViewer({ images, loop: true })
}

// 子应用卸载时彻底销毁
export function unmount() {
  if (viewer) {
    viewer.hide() // 触发完整销毁流程
    viewer = null
  }
}
```

销毁时会自动清理：

- 所有 document / stage 事件监听
- 所有 setTimeout（zoomTimer、retryTimer）
- 虚拟列表 DOM 与对象池
- body.overflow 原始状态
