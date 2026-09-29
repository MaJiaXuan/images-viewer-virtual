const { build } = require('vite')
const { resolve } = require('path')
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

const OUTPUT_DIR = resolve(__dirname, '../dist')

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

const BANNER = `/*!\n * ${pkg.name} v${pkg.version}\n * ${pkg.homepage || (pkg.repository && pkg.repository.url) || ''}\n *\n * Copyright ${new Date().getFullYear()}-present ${(pkg.author || 'Author').replace(/\s*<.*>/, '')}\n * Released under the ${pkg.license || 'MIT'} license\n *\n * Date: ${new Date().toISOString()}\n */\n`

const D_TS_CONTENT = `/**
	 * ImagesViewer 类型声明
	 */

	export interface ImageItem {
	  url: string
	  thumbnail?: string
	  title?: string
	  fallback?: string
	  itemClass?: string
	  activeItemClass?: string
	  errorClass?: string
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
	  buttons?: Record<string, string>
	  info?: Record<string, string>
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

	export interface ImagesViewerOptions {
	  images?: (string | ImageItem)[]
	  props?: Record<string, string | ((item: any, index: number) => any)>
	  className?: string
	  backdrop?: boolean
	  minZoomRatio?: number
	  maxZoomRatio?: number
	  loop?: boolean
	  retryOnError?: boolean
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

	export interface ViewerEventPayload {
	  viewer: ImagesViewer
	  index: number
	  image: ImageItem | null
	  total: number
	}

	export declare class ImagesViewer {
	  constructor(options: ImagesViewerOptions | string[])

	  readonly currentIndex: number
	  readonly images: ImageItem[]
	  readonly visible: boolean
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
	  scale(scaleX: number, scaleY?: number): this
	  scaleX(scaleX: number): this
	  scaleY(scaleY: number): this
	  reset(): this
	  toggle(): this
	  view(index: number, animated?: boolean): this
	  prev(): this
	  next(): this
	  play(): this
	  stop(): this
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
	`

function gzipFile(filePath) {
  const content = fs.readFileSync(filePath)
  const gz = zlib.gzipSync(content, { level: 9 })
  fs.writeFileSync(filePath + '.gz', gz)
  const ratio = ((gz.length / content.length) * 100).toFixed(1)
  console.log(`  gzip: ${path.basename(filePath)} → ${path.basename(filePath)}.gz (${ratio}%)`)
}

function postBuild() {
  const files = fs.readdirSync(OUTPUT_DIR)
  for (const f of files) {
    if (f.endsWith('.css')) {
      const fp = resolve(OUTPUT_DIR, f)
      const content = fs.readFileSync(fp, 'utf-8')
      if (!content.startsWith('/*!')) {
        fs.writeFileSync(fp, BANNER + content)
      }
    }
  }
  for (const f of files) {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      gzipFile(resolve(OUTPUT_DIR, f))
    }
  }
  fs.writeFileSync(resolve(OUTPUT_DIR, 'index.d.ts'), D_TS_CONTENT)
  console.log('  dist/index.d.ts generated')
  console.log('All files ready!')
}

build({
  configFile: false,
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, '../src/index.js'),
      name: 'ImagesViewer',
      fileName: format => `images-viewer.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        banner: BANNER,
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'images-viewer.css'
          return assetInfo.name
        },
      },
    },
    minify: 'terser',
    assetsInlineLimit: 4096,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    emptyOutDir: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
  },
})
  .then(() => {
    postBuild()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
