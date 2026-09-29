<script setup>
const demoCode = `const raw = images.slice(0, 5).map((img, i) => ({ src: img.url, thumb: img.thumbnail, name: img.title }));
new ImagesViewer({
  images: raw,
  props: { url: 'src', thumbnail: 'thumb', title: 'name' },
})`
</script>

# 示例 3：自定义属性映射

<DemoPreview :code="demoCode" />

当后端返回的数据字段名与默认不符时，可通过 `props` 自定义映射。也支持函数映射。

```js
const viewer = new ImagesViewer({
  images: [
    { src: 'https://example.com/1.jpg', thumb: 'https://example.com/1t.jpg', name: '风景 1' },
    { src: 'https://example.com/2.jpg', thumb: 'https://example.com/2t.jpg', name: '风景 2' },
  ],
  props: {
    url: 'src',
    thumbnail: 'thumb',
    title: (item, index) => `${item.name} - 第 ${index + 1} 张`,
  },
})
```
