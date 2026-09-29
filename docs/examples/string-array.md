<script setup>
const demoCode = `new ImagesViewer(images.slice(0, 5).map(i => i.url))`
</script>

# 示例 2：字符串数组

<DemoPreview :code="demoCode" />

如果图片只有 URL，可以直接传入字符串数组。会自动使用 URL 作为缩略图，并生成默认标题。

```js
const viewer = new ImagesViewer([
  'https://example.com/a.jpg',
  'https://example.com/b.jpg',
  'https://example.com/c.jpg',
])
```
