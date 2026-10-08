/**
 * ImagesViewer 类型声明
 */

export interface ImageItem {
  url: string
  thumbnail?: string
  title?: string
  fallback?: string
  /** EXIF 方向（1-8），显式提供时优先于 autoOrientation 自动解析 */
  orientation?: number
  itemClass?: string
  activeItemClass?: string
  errorClass?: string
  [key: string]: unknown
}

export interface ButtonsConfig {
  zoomIn?: boolean
  zoomOut?: boolean
  rotateLeft?: boolean
  rotateRight?: boolean
  reset?: boolean
  download?: boolean
  copy?: boolean
  fullscreen?: boolean
  prev?: boolean
  next?: boolean
  close?: boolean
  topClose?: boolean
  thumbnails?: boolean
  info?: boolean
}

export interface ImageInfoConfig {
  visible?: boolean
  showName?: boolean
  showDimensions?: boolean
}

export interface I18nConfig {
  buttons?: {
    prev?: string
    next?: string
    close?: string
    loading?: string
  }
  info?: {
    name?: string
    dimensions?: string
  }
  /** 信息面板「操作指引」区块标题 */
  helpTitle?: string
  /** 快捷键分组标题 */
  helpKeys?: string
  /** 手势分组标题 */
  helpGestures?: string
  /** 按钮分组标题 */
  helpButtons?: string
}

export interface ThemeConfig {
  viewerBgColor?: string
  textColor?: string
  activeColor?: string
  toolbarBgColor?: string
  toolbarBorderRadius?: string
  toolbarPadding?: string
  toolbarBottom?: string
  buttonBgColor?: string
  buttonHoverBg?: string
  buttonSize?: string
  buttonFontSize?: string
  buttonBorderRadius?: string
  navButtonBgColor?: string
  navButtonHoverBg?: string
  navButtonSize?: string
  navButtonFontSize?: string
  navButtonBorderRadius?: string
  topCloseBtnSize?: string
  topCloseBtnTop?: string
  topCloseBtnRight?: string
  topCloseBtnFontSize?: string
  topCloseBtnBgColor?: string
  topCloseBtnHoverBg?: string
  infoBgColor?: string
  infoBorderRadius?: string
  infoPadding?: string
  infoFontSize?: string
  infoTop?: string
  infoLeft?: string
  zoomIndicatorBg?: string
  zoomIndicatorBorderRadius?: string
  zoomIndicatorPadding?: string
  zoomIndicatorFontSize?: string
  zoomIndicatorTop?: string
  zoomIndicatorLeft?: string
  thumbItemWidth?: number
  thumbItemHeight?: number
  thumbGap?: number
  thumbBarHeight?: number
  transitionSpeed?: string
}

export interface ViewerEventPayload {
  viewer: ImagesViewer
  index: number
  image: ImageItem | null
  total: number
}

export interface ImagesViewerOptions {
  images?: (string | ImageItem)[]
  props?: Record<string, string | ((item: ImageItem, index: number) => unknown)>
  className?: string
  backdrop?: boolean
  minZoomRatio?: number
  maxZoomRatio?: number
  loop?: boolean
  retryOnError?: boolean
  /** 图片未显式提供 orientation 时，自动请求并解析 JPEG EXIF 方向（默认 false） */
  autoOrientation?: boolean
  defaultFallbackImage?: string
  showTitle?: boolean
  showCounter?: boolean
  showNavButtons?: boolean
  showThumbBar?: boolean
  itemClass?: string
  activeItemClass?: string
  errorClass?: string
  buttons?: ButtonsConfig
  customButtons?: [string, (this: ImagesViewer) => void][]
  initialViewIndex?: number
  zIndex?: number
  /** 幻灯片自动播放（play()）的切换间隔，单位 ms，默认 5000 */
  interval?: number
  imageInfo?: ImageInfoConfig
  i18n?: I18nConfig
  theme?: ThemeConfig
  onShow?: (data: ViewerEventPayload) => void
  onClose?: (data: ViewerEventPayload) => void
  onChange?: (data: ViewerEventPayload & { oldIndex: number; direction: 'next' | 'prev' }) => void
  onRotate?: (data: ViewerEventPayload & { rotation: number }) => void
  onDrag?: (data: ViewerEventPayload & { translateX: number; translateY: number }) => void
  onZoom?: (data: ViewerEventPayload & { scale: number }) => void
  onImageError?: (data: ViewerEventPayload & { url: string }) => void
  onInfo?: (data: ViewerEventPayload & { scale: number; rotation: number }) => string
  onCounter?: (data: ViewerEventPayload) => string
}

export declare class ImagesViewer {
  constructor(options: ImagesViewerOptions | string[])

  /** 当前生效的配置。动态增删图片时修改其中的 `images` 后调用 `update()`。 */
  readonly options: ImagesViewerOptions & { images: (string | ImageItem)[] }
  readonly currentIndex: number
  readonly images: ImageItem[]
  readonly visible: boolean
  /** 当前缩放倍率。数值状态，请通过 zoom() / zoomTo() / reset() 修改。 */
  readonly scale: number
  readonly rotation: number
  readonly translateX: number
  readonly translateY: number

  zoom(delta: number): this
  zoomTo(ratio: number): this
  rotate(deg: number): this
  rotateTo(degree: number): this
  move(x: number, y?: number): this
  moveTo(x: number, y?: number): this
  reset(): this
  toggle(): this
  view(index: number, animated?: boolean): this
  prev(): this
  next(): this
  play(): this
  stop(): this
  /**
   * 重新读取 `options.images` 并刷新视图，用于动态增删 / 替换图片。
   * 当前图片未变化时保留缩放与旋转状态；图片被删除导致索引越界时自动收敛到末尾；
   * 索引发生变化时触发 `onChange`。
   */
  update(): this
  tooltip(): this
  toggleImageInfo(): this
  toggleThumbnails(): this
  toggleTitle(): this
  toggleCounter(): this
  toggleNavButtons(): this
  toggleFullscreen(): this
  copyImage(): Promise<boolean>
  downloadImage(): void
  hide(): this
}

export default ImagesViewer
