<script setup>
const demoCode = `const styled = images.slice(0, 5).map((img, i) => ({ ...img, itemClass: i === 2 ? 'item-custom' : '', activeItemClass: i === 2 ? 'active-custom' : '' }));
new ImagesViewer({
  images: styled,
  itemClass: 'item-default',
  activeItemClass: 'active-default',
  theme: { activeColor: '#ff6b6b' },
})`
</script>

# 示例 17：缩略图样式

<DemoPreview :code="demoCode" />

通过 `itemClass` 和 `activeItemClass` 自定义缩略图项的 CSS 样式。支持全局设置和单图独立设置。

## 全局设置

```js
const viewer = new ImagesViewer({
  images: imageList,
  itemClass: 'my-thumb',
  activeItemClass: 'my-thumb-active',
})
```

## 单图覆盖

```js
const viewer = new ImagesViewer({
  images: [
    { url: 'a.jpg', itemClass: 'thumb-red', activeItemClass: 'thumb-red-active' },
    { url: 'b.jpg', itemClass: 'thumb-blue' },
    { url: 'c.jpg' }, // 使用全局默认样式
  ],
  itemClass: 'my-thumb',
  activeItemClass: 'my-thumb-active',
})
```

## 结合 props 函数映射

```js
const viewer = new ImagesViewer({
  images: rawData,
  props: {
    itemClass: (item, index) => (index === 0 ? 'first-item' : ''),
    activeItemClass: (item, index) => (index === 0 ? 'first-active' : ''),
  },
})
```

> 单图字段优先级高于全局选项。如果单图字段为空字符串，则回退到全局选项。
