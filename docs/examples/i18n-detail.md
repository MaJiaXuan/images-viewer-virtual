<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  i18n: {
    buttons: { prev: 'Previous', next: 'Next', close: 'Close', loading: 'Loading...' },
    info: {
      name: 'Name:', dimensions: 'Size:', page: 'Page', scale: 'Scale', rotation: 'Rotation',
      helpTitle: 'Instructions', keyboardShortcuts: 'Keyboard Shortcuts', gesture: 'Gestures',
      prevShortcut: '← Previous', nextShortcut: '→ Next', closeShortcut: 'Esc Close',
      zoomInShortcut: '+ / = Zoom In', zoomOutShortcut: '- / _ Zoom Out', resetShortcut: '0 Reset',
      fullscreenShortcut: 'f Fullscreen', infoShortcut: 'i Info Panel',
      doubleClick: 'Double Click Reset', wheelZoom: 'Wheel Zoom', dragPan: 'Drag Pan (zoom > 1)',
    },
  },
})`
</script>

# 示例 16：国际化详解

<DemoPreview :code="demoCode" />

替换所有按钮文案、信息面板标签和快捷键说明。

## 完整国际化配置

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      prev: 'Previous',
      next: 'Next',
      close: 'Close',
      loading: 'Loading...',
    },
    info: {
      name: 'Name:',
      dimensions: 'Size:',
      page: 'Page',
      scale: 'Scale',
      rotation: 'Rotation',
      helpTitle: 'Instructions',
      keyboardShortcuts: 'Keyboard Shortcuts',
      gesture: 'Gestures',
      prevShortcut: '← Previous',
      nextShortcut: '→ Next',
      closeShortcut: 'Esc Close',
      zoomInShortcut: '+ / = Zoom In',
      zoomOutShortcut: '- / _ Zoom Out',
      resetShortcut: '0 Reset',
      fullscreenShortcut: 'f Fullscreen',
      infoShortcut: 'i Info Panel',
      doubleClick: 'Double Click Reset',
      wheelZoom: 'Wheel Zoom',
      dragPan: 'Drag Pan (zoom > 1)',
    },
  },
})
```

## 中文（默认）

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      prev: '上一张',
      next: '下一张',
      close: '关闭',
      loading: '加载中...',
    },
    info: {
      name: '名称：',
      dimensions: '尺寸：',
      page: '页码',
      scale: '缩放',
      rotation: '旋转',
      helpTitle: '操作指引',
      keyboardShortcuts: '键盘快捷键',
      gesture: '手势',
      prevShortcut: '← 上一张',
      nextShortcut: '→ 下一张',
      closeShortcut: 'Esc 关闭',
      zoomInShortcut: '+ / = 放大',
      zoomOutShortcut: '- / _ 缩小',
      resetShortcut: '0 重置',
      fullscreenShortcut: 'f 全屏',
      infoShortcut: 'i 信息面板',
      doubleClick: '双击 重置变换',
      wheelZoom: '滚轮 缩放',
      dragPan: '拖拽 平移（缩放>1时）',
    },
  },
})
```

## 日文

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      prev: '前へ',
      next: '次へ',
      close: '閉じる',
      loading: '読み込み中...',
    },
    info: {
      name: '名前：',
      dimensions: 'サイズ：',
      page: 'ページ',
      scale: '拡大率',
      rotation: '回転',
      helpTitle: '操作ガイド',
      keyboardShortcuts: 'キーボードショートカット',
      gesture: 'ジェスチャー',
      prevShortcut: '← 前へ',
      nextShortcut: '→ 次へ',
      closeShortcut: 'Esc 閉じる',
      zoomInShortcut: '+ / = 拡大',
      zoomOutShortcut: '- / _ 縮小',
      resetShortcut: '0 リセット',
      fullscreenShortcut: 'f 全画面',
      infoShortcut: 'i 情報パネル',
      doubleClick: 'ダブルクリック リセット',
      wheelZoom: 'ホイール 拡大縮小',
      dragPan: 'ドラッグ パン（拡大時）',
    },
  },
})
```
