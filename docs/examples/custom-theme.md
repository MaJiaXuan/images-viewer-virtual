<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  theme: {
    viewerBgColor: 'rgba(255,248,240,0.95)',
    textColor: '#333',
    activeColor: '#ff6b6b',
    toolbarBgColor: 'rgba(255,255,255,0.8)',
    buttonBgColor: 'rgba(0,0,0,0.1)',
    buttonHoverBg: 'rgba(0,0,0,0.2)',
    thumbItemWidth: 100,
    thumbItemHeight: 70,
    thumbGap: 12,
    thumbBarHeight: 100,
    transitionSpeed: '0.25s',
  },
})`
</script>

# 示例 5：自定义主题

<DemoPreview :code="demoCode" />

通过 `theme` 覆盖几乎所有颜色、尺寸和间距。

```js
const viewer = new ImagesViewer({
  images: imageList,
  theme: {
    viewerBgColor: 'rgba(255, 248, 240, 0.95)',
    textColor: '#333',
    activeColor: '#ff6b6b',
    toolbarBgColor: 'rgba(255, 255, 255, 0.8)',
    buttonBgColor: 'rgba(0, 0, 0, 0.1)',
    buttonHoverBg: 'rgba(0, 0, 0, 0.2)',
    thumbItemWidth: 100,
    thumbItemHeight: 70,
    thumbGap: 12,
    thumbBarHeight: 100,
    transitionSpeed: '0.25s',
  },
})
```
