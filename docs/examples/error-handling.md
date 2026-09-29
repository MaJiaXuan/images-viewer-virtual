<script setup>
const demoCode = `const broken = images.slice(0, 3).map((img, i) => ({ ...img, url: i === 1 ? 'https://invalid/1.jpg' : img.url }));
new ImagesViewer({
  images: broken,
  retryOnError: true,
  onImageError: d => console.warn('失败:', d.url),
})`
</script>

# 示例 8：错误处理与重试

<DemoPreview :code="demoCode" />

开启 `retryOnError` 在图片加载失败时自动重试，并通过回调获取错误信息。

```js
const viewer = new ImagesViewer({
  images: imageList,
  retryOnError: true,
  onImageError: ({ url, index }) => {
    console.error(`图片加载失败 [${index}]: ${url}`)
  },
})
```
