<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  showTitle: false,
  showCounter: false,
  showNavButtons: false,
})`
</script>

# 示例 23：显示隐藏控制

<DemoPreview :code="demoCode" />

通过 `showTitle`、`showCounter`、`showNavButtons` 在构造时控制各元素的初始显隐状态。

```js
const viewer = new ImagesViewer({
  images: imageList,
  showTitle: false, // 隐藏图片标题
  showCounter: false, // 隐藏页码计数器
  showNavButtons: false, // 隐藏左右导航箭头
})
```

## 单独控制

```js
// 只隐藏标题
const viewer = new ImagesViewer({
  images: imageList,
  showTitle: false,
})

// 只隐藏计数器
const viewer = new ImagesViewer({
  images: imageList,
  showCounter: false,
})

// 只隐藏导航按钮
const viewer = new ImagesViewer({
  images: imageList,
  showNavButtons: false,
})
```

> 当 `showNavButtons: false` 时，左右导航按钮不显示，但用户仍可通过键盘 `←` / `→` 或触摸滑动切换图片。

## 与单图模式结合

```js
const viewer = new ImagesViewer({
  images: [singleImage],
  showCounter: false, // 单图计数器显示 1/1，意义不大
  showNavButtons: false, // 单图无需导航按钮
})
```
