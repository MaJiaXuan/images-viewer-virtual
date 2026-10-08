# API 参考

## 构造选项

| 参数                   | 类型                   | 默认值                            | 说明                                                                                                                                                                                        |
| ---------------------- | ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `images`               | `string[] \| object[]` | `[]`                              | 图片列表。字符串数组将自动补全为 `{url, title, thumbnail}` 对象。                                                                                                                           |
| `props`                | `object`               | `{url, title, thumbnail}`         | 属性映射。键为内部字段名，值为数据字段名或函数 `(item, index) => value`。支持的字段：`url`、`title`、`thumbnail`、`fallback`、`orientation`、`itemClass`、`activeItemClass`、`errorClass`。 |
| `className`            | `string`               | `'images-viewer'`                 | CSS 类名前缀，控制所有 DOM 节点类名。                                                                                                                                                       |
| `backdrop`             | `boolean`              | `false`                           | 点击遮罩或舞台背景关闭查看器。                                                                                                                                                              |
| `minZoomRatio`         | `number`               | `0.1`                             | 最小缩放倍率。                                                                                                                                                                              |
| `maxZoomRatio`         | `number`               | `5`                               | 最大缩放倍率。                                                                                                                                                                              |
| `loop`                 | `boolean`              | `true`                            | 首尾循环切换。关闭后 `prev`/`next` 在首尾停止。                                                                                                                                             |
| `retryOnError`         | `boolean`              | `false`                           | 加载失败时自动重试（加时间戳防缓存，最多 3 次）。                                                                                                                                           |
| `autoOrientation`      | `boolean`              | `false`                           | 图片未显式提供 `orientation` 时，自动请求并解析 JPEG EXIF 方向（需 CORS 或同源）。详见 [EXIF 方向](#exif-方向)。                                                                            |
| `defaultFallbackImage` | `string`               | `''`                              | 全局默认错误图片 URL。单图可设置 `fallback` 覆盖此值。                                                                                                                                      |
| `showThumbBar`         | `boolean`              | `true`                            | 是否显示底部缩略图栏。设为 `false` 可完全隐藏缩略图栏。                                                                                                                                     |
| `showTitle`            | `boolean`              | `true`                            | 是否显示图片标题。                                                                                                                                                                          |
| `showCounter`          | `boolean`              | `true`                            | 是否显示页码计数器（如 `1 / 10`）。                                                                                                                                                         |
| `showNavButtons`       | `boolean`              | `true`                            | 是否显示左右导航箭头按钮。                                                                                                                                                                  |
| `itemClass`            | `string`               | `''`                              | 全局缩略图项 CSS class。单图可设置 `itemClass` 覆盖此值。                                                                                                                                   |
| `activeItemClass`      | `string`               | `''`                              | 全局选中缩略图项 CSS class。单图可设置 `activeItemClass` 覆盖此值。                                                                                                                         |
| `errorClass`           | `string`               | `''`                              | 全局图片加载失败时 CSS class。单图可设置 `errorClass` 覆盖此值。                                                                                                                            |
| `buttons`              | `object`               | 除 `copy` 外均为 `true`           | 控制各按钮显隐。详见下方 [按钮配置](#buttons)。                                                                                                                                             |
| `customButtons`        | `[string, fn][]`       | `[]`                              | 自定义工具栏按钮。格式 `[label, handler]`，handler 中 `this` 指向 viewer 实例。                                                                                                             |
| `initialViewIndex`     | `number`               | `0`                               | 初始打开的图片索引。首次打开时无动画，避免卡顿。                                                                                                                                            |
| `zIndex`               | `number`               | `5000`                            | 查看器容器 z-index，控制层级。                                                                                                                                                              |
| `interval`             | `number`               | `5000`                            | 幻灯片自动播放（`play()`）的切换间隔，单位 ms。                                                                                                                                             |
| `imageInfo`            | `object`               | 见下方 [信息面板配置](#imageinfo) | 信息面板配置。                                                                                                                                                                              |
| `i18n`                 | `object`               | 中文                              | 国际化文案。详见下方 [国际化配置](#i18n)。                                                                                                                                                  |
| `theme`                | `object`               | 暗色主题                          | 完整主题配置。详见下方 [主题配置](#theme)。                                                                                                                                                 |

所有回调入参统一为 `{ viewer, index, image, total, ...事件特有字段 }`：`image` 为当前图片的规范化数据对象（含 `url`、`title`、`thumbnail`、`raw` 等），`total` 为图片总数。

| 回调           | 特有字段                   | 说明                                                  |
| -------------- | -------------------------- | ----------------------------------------------------- |
| `onShow`       | —                          | 查看器打开后触发。                                    |
| `onClose`      | —                          | 查看器关闭后触发。                                    |
| `onChange`     | `oldIndex`, `direction`    | 图片切换时触发，`direction` 为 `'next'` 或 `'prev'`。 |
| `onRotate`     | `rotation`                 | 旋转时触发。                                          |
| `onDrag`       | `translateX`, `translateY` | 拖拽时触发。                                          |
| `onZoom`       | `scale`                    | 缩放时触发。                                          |
| `onImageError` | `url`                      | 主图加载失败时触发。                                  |
| `onInfo`       | `scale`, `rotation`        | 返回 HTML 字符串自定义信息面板。                      |
| `onCounter`    | —                          | 返回字符串自定义计数器。                              |

### 旧选项名兼容

以下旧选项名会被自动映射到新选项名，仍可正常使用（新代码建议使用新名）：

| 旧选项名           | 新选项名           |
| ------------------ | ------------------ |
| `minScale`         | `minZoomRatio`     |
| `maxScale`         | `maxZoomRatio`     |
| `namespace`        | `className`        |
| `closeOnMaskClick` | `backdrop`         |
| `initialIndex`     | `initialViewIndex` |

---

## 按钮配置 `buttons` {#buttons}

`buttons` 是一个对象，每个键控制对应按钮的显隐。除 `copy` 默认关闭外，其余按钮默认启用。

```js
buttons: {
  zoomIn: true,      // 放大
  zoomOut: true,     // 缩小
  rotateLeft: true,  // 左旋
  rotateRight: true, // 右旋
  reset: true,       // 重置
  download: true,    // 下载图片
  copy: false,       // 复制图片到剪贴板（默认关闭）
  fullscreen: true,  // 全屏
  prev: true,        // 上一张（图片只有 1 张时自动隐藏）
  next: true,        // 下一张（图片只有 1 张时自动隐藏）
  close: true,       // 关闭（底部）
  topClose: true,    // 关闭（顶部角标）
  thumbnails: true,  // 缩略图栏显隐切换
  info: true,        // 信息面板显隐切换
}
```

> 当 `images.length === 1` 时，`prev` 和 `next` 按钮会自动隐藏，无论 `buttons` 中如何设置。

---

## 信息面板配置 `imageInfo` {#imageinfo}

```js
imageInfo: {
  visible: false,      // 初始是否显示
  showName: true,      // 显示图片名称
  showDimensions: true, // 显示图片尺寸
}
```

信息面板默认显示：图片名称、图片尺寸，以及操作指引（快捷键和手势说明）。当 `onInfo` 返回字符串时会整体替换「名称 / 尺寸」部分，操作指引仍会保留。

可通过 `onInfo` 回调完全自定义信息面板内容：

```js
onInfo: ({ index, total, scale, rotation }) => {
  return `<div>自定义信息: ${index + 1} / ${total}</div>`
}
```

---

## 国际化配置 `i18n` {#i18n}

```js
i18n: {
  // 工具栏按钮的 title 提示（未配置的键回退到内置中文）
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
  // 信息面板标签
  info: {
    name: '名称:',
    dimensions: '尺寸:',
  },
  // 操作指引的分区标题（顶层键，不在 info 内）
  helpTitle: '操作指引',
  helpKeys: '快捷键',
  helpGestures: '手势',
}
```

| 键                  | 作用位置                      | 默认值      |
| ------------------- | ----------------------------- | ----------- |
| `buttons.loading`   | 主图加载中的提示文字          | `加载中...` |
| `buttons.zoomIn` 等 | 对应工具栏按钮的 `title` 提示 | 中文见上方  |
| `info.name`         | 信息面板「名称」标签          | `名称:`     |
| `info.dimensions`   | 信息面板「尺寸」标签          | `尺寸:`     |
| `helpTitle`         | 操作指引标题                  | `操作指引`  |
| `helpKeys`          | 操作指引「快捷键」分区标题    | `快捷键`    |
| `helpGestures`      | 操作指引「手势」分区标题      | `手势`      |

**尚未支持国际化的部分**（当前为内置中文，配置无效）：

- 操作指引中的具体条目（`←` / `→`、`+`、`-`、`0`、`f`、`i`、`Esc`、`g`、双击、滚轮、拖拽）
- 左右导航按钮的 `title`（内置为 `上一张` / `下一张`），即 `i18n.buttons.prev` / `i18n.buttons.next` 不生效
- `i18n.helpButtons`（已在默认配置中声明，但未参与渲染）

> 需要完全自定义信息面板内容时，建议改用 `onInfo` 回调直接返回 HTML 字符串。

---

## 主题配置 `theme` {#theme}

以下为默认主题（暗色）的完整变量与取值：

```js
theme: {
  // 查看器背景
  viewerBgColor: 'rgba(0,0,0,0.85)',         // 查看器背景色

  // 工具栏
  toolbarBgColor: 'rgba(40,40,40,0.8)',       // 工具栏背景
  toolbarBorderRadius: '30px',                 // 工具栏圆角
  toolbarPadding: '8px 16px',                // 工具栏内边距
  toolbarBottom: '24px',                      // 工具栏距离底部

  // 工具栏按钮
  buttonBgColor: 'rgba(255,255,255,0.1)',    // 按钮背景
  buttonHoverBg: 'rgba(255,255,255,0.25)',   // 按钮悬停背景
  buttonSize: '40px',                         // 按钮尺寸
  buttonFontSize: '18px',                     // 按钮文字大小
  buttonBorderRadius: '50%',                  // 按钮圆角

  // 左右导航按钮
  navButtonBgColor: 'rgba(255, 255, 255, 0.1)',  // 导航按钮背景
  navButtonHoverBg: 'rgba(255, 255, 255, 0.25)', // 导航按钮悬停背景
  navButtonSize: '48px',                         // 导航按钮尺寸
  navButtonFontSize: '20px',                     // 导航按钮文字大小
  navButtonBorderRadius: '50%',                  // 导航按钮圆角

  // 顶部关闭按钮
  topCloseBtnSize: '44px',                     // 顶部关闭按钮尺寸
  topCloseBtnTop: '16px',                      // 顶部关闭按钮距顶部
  topCloseBtnRight: '16px',                    // 顶部关闭按钮距右侧
  topCloseBtnFontSize: '22px',                 // 顶部关闭按钮文字大小
  topCloseBtnBgColor: 'rgba(255,255,255,0.1)', // 顶部关闭按钮背景
  topCloseBtnHoverBg: 'rgba(255,255,255,0.25)', // 顶部关闭按钮悬停背景
  topCloseBtnBorderRadius: '50%',               // 顶部关闭按钮圆角

  // 信息面板
  infoBgColor: 'rgba(40, 40, 40, 0.8)',       // 信息面板背景
  infoBorderRadius: '8px',                     // 信息面板圆角
  infoPadding: '10px 14px',                    // 信息面板内边距
  infoFontSize: '13px',                        // 信息面板文字大小
  infoTop: '60px',                             // 信息面板距顶部
  infoLeft: '16px',                            // 信息面板距左侧

  // 缩放指示器
  zoomIndicatorBg: 'rgba(40, 40, 40, 0.8)',  // 缩放指示器背景
  zoomIndicatorBorderRadius: '16px',           // 缩放指示器圆角
  zoomIndicatorPadding: '6px 12px',            // 缩放指示器内边距
  zoomIndicatorFontSize: '13px',               // 缩放指示器文字大小
  zoomIndicatorTop: '16px',                    // 缩放指示器距顶部
  zoomIndicatorLeft: '16px',                   // 缩放指示器距左侧

  // 通用
  activeColor: '#4a9eff',                      // 激活/高亮颜色
  textColor: '#fff',                           // 全局文字颜色
  transitionSpeed: '0.3s',                     // 过渡动画速度

  // 缩略图
  thumbItemWidth: 80,      // 缩略图宽度 (px)
  thumbItemHeight: 56,     // 缩略图高度 (px)
  thumbGap: 10,            // 缩略图间距 (px)
  thumbBarHeight: 90,      // 缩略图栏高度 (px)
}
```

---

## 单图模式

当 `images.length === 1` 时：

- `prev` / `next` 导航按钮自动隐藏
- 左右切换快捷键无响应（因为没有其他图片）
- 缩略图栏只显示一个缩略图
- 计数器显示 `1 / 1`

---

## 实例方法

| 方法                    | 参数              | 说明                                                                                    |
| ----------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `zoom(delta)`           | `number`          | 相对缩放，如 `0.2` 放大 20%，`-0.2` 缩小 20%。                                          |
| `zoomTo(ratio)`         | `number`          | 缩放到绝对倍率，受 `minZoomRatio` / `maxZoomRatio` 约束。                               |
| `rotate(deg)`           | `number`          | 相对旋转，如 `90` 顺时针 90°。                                                          |
| `rotateTo(degree)`      | `number`          | 旋转到绝对角度（deg）。                                                                 |
| `move(x, y)`            | `number, number`  | 相对位移。`y` 省略时取 `x`。                                                            |
| `moveTo(x, y)`          | `number, number`  | 移动到绝对位移。`y` 省略时取 `x`。                                                      |
| `reset()`               | —                 | 重置缩放、旋转和位移。                                                                  |
| `toggle()`              | —                 | 在 `1`（原始比例）与「适应窗口」倍率之间切换缩放。                                      |
| `view(index, animated)` | `number, boolean` | 跳转到指定索引。`animated` 默认 `true`，为 `false` 时无动画。负数取 0，越界取最后一张。 |
| `prev()`                | —                 | 切换到上一张。循环切换时首尾无动画。                                                    |
| `next()`                | —                 | 切换到下一张。循环切换时首尾无动画。                                                    |
| `toggleImageInfo()`     | —                 | 切换左上角信息面板显隐。                                                                |
| `toggleThumbnails()`    | —                 | 切换底部缩略图栏显隐（`showThumbBar: false` 时为空操作）。                              |
| `toggleTitle()`         | —                 | 切换图片标题显隐。                                                                      |
| `toggleCounter()`       | —                 | 切换页码计数器显隐。                                                                    |
| `toggleNavButtons()`    | —                 | 切换左右导航箭头显隐。                                                                  |
| `toggleFullscreen()`    | —                 | 切换浏览器全屏模式。                                                                    |
| `tooltip()`             | —                 | 显示当前缩放百分比指示器（1.5 秒后自动隐藏）。                                          |
| `play()`                | —                 | 开始幻灯片自动播放，间隔由 `interval` 选项控制（默认 `5000` ms）。                      |
| `stop()`                | —                 | 停止幻灯片自动播放。                                                                    |
| `copyImage()`           | —                 | 复制当前图片到剪贴板（需浏览器支持）。返回 `Promise<boolean>`。                         |
| `downloadImage()`       | —                 | 触发当前图片下载（内部按 Canvas → fetch 依次降级）。返回 Promise。                      |
| `hide()`                | —                 | 关闭查看器，并在过渡动画结束后彻底销毁 DOM、事件和 Timer。                              |

> 除 `copyImage()` / `downloadImage()` 外，所有方法均返回实例自身，支持链式调用。

> ⚠️ `update()`（动态增删图片后刷新）当前存在缺陷：内部调用 `_normalizeImages()` 时未传参，执行必然抛错，请勿使用。

---

## 键盘快捷键

| 按键      | 功能                                                            |
| --------- | --------------------------------------------------------------- |
| `←` / `→` | 上一张 / 下一张                                                 |
| `Esc`     | 关闭查看器                                                      |
| `+` / `=` | 放大                                                            |
| `-` / `_` | 缩小                                                            |
| `0`       | 重置缩放与旋转                                                  |
| `f`       | 切换全屏                                                        |
| `g`       | 跳转到指定图片（弹出输入框）                                    |
| `i`       | 切换信息面板                                                    |
| `Home`    | 跳转到第一张（无动画）                                          |
| `End`     | 跳转到最后一张（无动画）                                        |
| 双击      | 重置缩放、旋转与位移                                            |
| 滚轮      | 以鼠标位置为中心缩放                                            |
| 拖拽      | 平移图片（任何缩放倍率下均可，允许越过边界 60px，松手自动回弹） |
| 左右滑动  | 切换图片（移动端，未缩放时）                                    |

---

## 单图字段（支持全局 + 单图独立设置）

以下字段支持**全局默认值**和**单图覆盖**两种模式：

| 字段           | 全局选项               | 单图字段          | 说明                             |
| -------------- | ---------------------- | ----------------- | -------------------------------- |
| 错误图片       | `defaultFallbackImage` | `fallback`        | 加载失败时显示的替代图片。       |
| 缩略图样式     | `itemClass`            | `itemClass`       | 缩略图项的 CSS class。           |
| 选中缩略图样式 | `activeItemClass`      | `activeItemClass` | 选中缩略图项的 CSS class。       |
| 错误图片样式   | `errorClass`           | `errorClass`      | 图片加载失败时主图的 CSS class。 |
| EXIF 方向      | —（仅单图字段）        | `orientation`     | EXIF 方向值（1-8）。             |

**优先级规则**：单图字段 > 全局选项。如果单图字段为空字符串，则回退到全局选项。

### EXIF 方向

手机拍摄的 JPEG 常在 EXIF 中记录方向，直接渲染会横竖颠倒。两种处理方式：

```js
// 方式一：已知方向时直接声明（零开销）
new ImagesViewer({
  images: [{ url: 'photo.jpg', orientation: 6 }],
})

// 方式二：开启自动解析（默认关闭，会额外请求图片字节流）
new ImagesViewer({
  images: ['photo.jpg'],
  autoOrientation: true, // 需要图片允许 CORS 或同源
})
```

方向以 CSS transform 应用在整条变换链最外层，`reset()` 只重置用户的缩放/旋转/平移，不影响方向。解析结果按 URL 缓存，切换回同一张图不会重复请求。仅支持 JPEG；fetch 失败、非 JPEG 或无方向标签时静默忽略。

### 全局设置示例

```js
new ImagesViewer({
  images: [...],
  itemClass: 'my-thumb',
  activeItemClass: 'my-thumb-active',
  errorClass: 'image-error',
  defaultFallbackImage: '/fallback.jpg',
})
```

### 单图覆盖示例

```js
new ImagesViewer({
  images: [
    { url: 'a.jpg', itemClass: 'thumb-red', activeItemClass: 'thumb-red-active' },
    { url: 'b.jpg', itemClass: 'thumb-blue' },
    { url: 'c.jpg', errorClass: 'image-broken', fallback: '/c-fallback.jpg' },
  ],
  itemClass: 'my-thumb', // 默认 class
  activeItemClass: 'my-active', // 默认 active class
  errorClass: 'image-error', // 默认 error class
})
```

单图 `itemClass` 和 `activeItemClass` 在缩略图项渲染时动态应用。单图 `errorClass` 在图片加载失败时添加到主图 `classList`，加载成功时移除。
