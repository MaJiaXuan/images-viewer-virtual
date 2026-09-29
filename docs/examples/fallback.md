<script setup>
const demoCode = `const mixed = images.slice(0, 5).map((img, i) => ({ ...img, url: i === 2 ? 'https://invalid/2.jpg' : img.url, fallback: i === 2 ? generateImage(999, 1920, 1080) : '' }));
new ImagesViewer({
  images: mixed,
  defaultFallbackImage: generateImage(998, 1920, 1080),
  onImageError: d => console.warn('失败:', d.url),
})`
</script>

# 示例 11：错误图片 Fallback

<DemoPreview :code="demoCode" />

支持全局默认错误图和单图独立错误图。加载失败时先尝试单图 fallback，没有则使用全局 `defaultFallbackImage`。

```js
// 方式 A：全局默认错误图
const viewer = new ImagesViewer({
  images: imageList,
  defaultFallbackImage: 'https://example.com/default-error.jpg',
})

// 方式 B：单图独立错误图（覆盖全局）
const viewer = new ImagesViewer({
  images: [
    { url: 'https://a.jpg', fallback: 'https://a-fallback.jpg' },
    { url: 'https://b.jpg', fallback: 'https://b-fallback.jpg' },
  ],
  defaultFallbackImage: 'https://example.com/default-error.jpg',
})
```
