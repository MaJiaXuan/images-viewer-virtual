<script setup>
const demoCode = `new ImagesViewer({
  images: images.slice(0, 5),
  i18n: {
    buttons: {
      zoomIn: 'Zoom In', zoomOut: 'Zoom Out',
      rotateLeft: 'Rotate Left', rotateRight: 'Rotate Right',
      reset: 'Reset', download: 'Download', copy: 'Copy',
      fullscreen: 'Fullscreen', info: 'Info',
      thumbnails: 'Thumbnails', close: 'Close',
      loading: 'Loading...',
    },
    info: { name: 'Name:', dimensions: 'Size:' },
    helpTitle: 'Instructions',
    helpKeys: 'Shortcuts',
    helpGestures: 'Gestures',
  },
})`
</script>

# 示例 16：国际化详解

<DemoPreview :code="demoCode" />

`i18n` 用来替换工具栏按钮的 `title` 提示、信息面板标签，以及操作指引的分区标题。

## 键位一览

| 键                                                                                                                                           | 作用位置                               |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `buttons.loading`                                                                                                                            | 主图加载中的提示文字                   |
| `buttons.zoomIn` / `zoomOut` / `rotateLeft` / `rotateRight` / `reset` / `download` / `copy` / `fullscreen` / `info` / `thumbnails` / `close` | 对应工具栏按钮的 `title` 提示          |
| `info.name` / `info.dimensions`                                                                                                              | 信息面板的「名称」「尺寸」标签         |
| `helpTitle`                                                                                                                                  | 操作指引标题（顶层键，不在 `info` 内） |
| `helpKeys` / `helpGestures`                                                                                                                  | 操作指引的「快捷键」「手势」分区标题   |

> 操作指引里的具体条目（`←` / `→`、`+`、`-`、`0`、`f`、`i`、`Esc`、`g`、双击、滚轮、拖拽）目前是内置文案，无法通过 `i18n` 替换；`i18n.buttons.prev` / `i18n.buttons.next` 与 `i18n.helpButtons` 也未生效。

## 英文

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      rotateLeft: 'Rotate Left',
      rotateRight: 'Rotate Right',
      reset: 'Reset',
      download: 'Download',
      copy: 'Copy',
      fullscreen: 'Fullscreen',
      info: 'Info',
      thumbnails: 'Thumbnails',
      close: 'Close',
      loading: 'Loading...',
    },
    info: {
      name: 'Name:',
      dimensions: 'Size:',
    },
    helpTitle: 'Instructions',
    helpKeys: 'Shortcuts',
    helpGestures: 'Gestures',
  },
})
```

## 中文（默认）

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      zoomIn: '放大',
      zoomOut: '缩小',
      rotateLeft: '向左旋转',
      rotateRight: '向右旋转',
      reset: '重置',
      download: '下载',
      copy: '复制',
      fullscreen: '全屏',
      info: '信息',
      thumbnails: '缩略图',
      close: '关闭',
      loading: '加载中...',
    },
    info: {
      name: '名称:',
      dimensions: '尺寸:',
    },
    helpTitle: '操作指引',
    helpKeys: '快捷键',
    helpGestures: '手势',
  },
})
```

## 日文

```js
const viewer = new ImagesViewer({
  images: imageList,
  i18n: {
    buttons: {
      zoomIn: '拡大',
      zoomOut: '縮小',
      rotateLeft: '左回転',
      rotateRight: '右回転',
      reset: 'リセット',
      download: 'ダウンロード',
      copy: 'コピー',
      fullscreen: '全画面',
      info: '情報',
      thumbnails: 'サムネイル',
      close: '閉じる',
      loading: '読み込み中...',
    },
    info: {
      name: '名前：',
      dimensions: 'サイズ：',
    },
    helpTitle: '操作ガイド',
    helpKeys: 'ショートカット',
    helpGestures: 'ジェスチャー',
  },
})
```
