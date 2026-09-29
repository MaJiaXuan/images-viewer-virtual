<script setup>
const demoCode = `const mixed = [
  { ...images[0], title: '正常图片' },
  { url: 'https://invalid/1.jpg', thumbnail: 'https://invalid/1t.jpg', title: '错误图片' },
  { ...images[1], title: '正常图片 2' },
];
new ImagesViewer({
  images: mixed,
  errorClass: 'error-default',
  defaultFallbackImage: generateImage(992, 1920, 1080),
  onImageError: d => console.warn('失败:', d.url),
})`
</script>

# 示例 18：错误样式

<DemoPreview :code="demoCode" />

通过 `errorClass` 自定义图片加载失败时的主图样式。支持全局设置和单图独立设置。

## 全局设置

```js
const viewer = new ImagesViewer({
  images: imageList,
  errorClass: 'image-error',
})
```

## 单图覆盖

```js
const viewer = new ImagesViewer({
  images: [
    { url: 'a.jpg' },
    { url: 'broken.jpg', errorClass: 'image-broken' },
    { url: 'placeholder.jpg', errorClass: 'image-placeholder' },
  ],
  errorClass: 'image-error', // 默认错误样式
})
```

## 配合 fallback 使用

```js
const viewer = new ImagesViewer({
  images: [{ url: 'broken.jpg', fallback: '/fallback.jpg', errorClass: 'image-broken' }],
  defaultFallbackImage: '/default-fallback.jpg',
  errorClass: 'image-error',
  onImageError: ({ url, index }) => console.warn('加载失败:', url),
})
```

> `errorClass` 在图片加载失败时添加到主图 `classList`，加载成功时自动移除。
