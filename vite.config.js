import fs from 'fs'
import path, { resolve } from 'path'
import zlib from 'zlib'

import { defineConfig, transformWithEsbuild } from 'vite'

import browserslistToEsbuild from 'browserslist-to-esbuild'
import { visualizer } from 'rollup-plugin-visualizer'

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

// UMD 产物的语法降级目标，由 .browserslistrc 派生 —— 兼容范围只在这一个文件里定义。
// ESM 产物不降级，按下方 build.target 的 esnext 输出，交由使用方的打包器处理。
// 注意：esbuild 的 target 只接受数组形式（逗号拼接的字符串会被判定为非法目标）。
const UMD_TARGET = browserslistToEsbuild(undefined, { path: __dirname })
const UMD_TARGET_LABEL = UMD_TARGET.join(', ')

const PERCENT = 100 // 压缩率换算

const BANNER = `/*!\n * ${pkg.name} v${pkg.version}\n * ${pkg.homepage || (pkg.repository && pkg.repository.url) || ''}\n *\n * Copyright ${new Date().getFullYear()}-present ${(pkg.author || 'Author').replace(/\s*<.*>/, '')}\n * Released under the ${pkg.license || 'MIT'} license\n *\n * Date: ${new Date().toISOString()}\n */\n`

function gzipBuildOutput() {
  const distDir = path.resolve('./dist')
  if (!fs.existsSync(distDir)) return

  const files = fs.readdirSync(distDir)

  // 先给 CSS 文件追加 banner（JS 已由 rollup output.banner 注入）
  for (const f of files) {
    if (f.endsWith('.css')) {
      const fp = path.join(distDir, f)
      const content = fs.readFileSync(fp, 'utf-8')
      if (!content.startsWith('/*!')) {
        fs.writeFileSync(fp, BANNER + content)
      }
    }
  }

  // 然后 gzip 所有 JS 和 CSS
  for (const f of files) {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      const fp = path.join(distDir, f)
      const content = fs.readFileSync(fp)
      const gz = zlib.gzipSync(content, { level: 9 })
      fs.writeFileSync(fp + '.gz', gz)
      const ratio = ((gz.length / content.length) * PERCENT).toFixed(1)
      console.log(`  gzip: ${f} \u2192 ${f}.gz (${ratio}%)`)
    }
  }
}

function copyTypeDeclarations() {
  const src = resolve(__dirname, 'types/index.d.ts')
  if (!fs.existsSync(src)) return

  fs.copyFileSync(src, path.resolve('./dist/index.d.ts'))
  console.log('  copy: types/index.d.ts \u2192 dist/index.d.ts')
}

const gzipPlugin = () => ({
  name: 'gzip-plugin',
  closeBundle() {
    gzipBuildOutput()
    copyTypeDeclarations()
  },
})

// UMD 产物要能直接 <script src> 引入，因此按 UMD_TARGET 降级语法（只降级语法，不注入 polyfill）。
// ESM 产物不处理，保留 esnext 输出，与之对应的是更小的体积。
function downlevelUmdPlugin() {
  return {
    name: 'downlevel-umd',
    async renderChunk(code, _chunk, outputOptions) {
      if (outputOptions.format !== 'umd') return null

      const options = {
        loader: 'js',
        target: UMD_TARGET,
        charset: 'utf8',
        legalComments: 'inline',
        sourcemap: true,
      }
      const { code: lowered, map } = await transformWithEsbuild(
        code,
        'images-viewer.umd.js',
        options
      )

      // 自检：再用 es2019 降一次。es2019 不含 ?. / ?? 等 ES2020 语法，所以只要产物里还残留
      // 现代语法（例如 .browserslistrc 被改成了纯现代浏览器，导致上面那一步什么都没降），
      // 这一步就会产生差异 —— 此时中断构建，而不是把 ES2020+ 语法发到 UMD 产物里。
      const { code: verified } = await transformWithEsbuild(lowered, 'images-viewer.umd.js', {
        ...options,
        target: 'es2019',
        sourcemap: false,
      })
      if (verified !== lowered) {
        throw new Error(
          `UMD 产物仍含 ES2020+ 语法，降级未生效，请检查 .browserslistrc（当前 target: ${UMD_TARGET_LABEL}）`
        )
      }

      console.log(`  downlevel: images-viewer.umd.js \u2192 ${UMD_TARGET_LABEL}`)
      return { code: lowered, map }
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    downlevelUmdPlugin(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    gzipPlugin(),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
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
        manualChunks: undefined,
      },
    },
    minify: 'terser',
    cssMinify: true,
    assetsInlineLimit: 4096,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
  },
  server: {
    open: '/demo/index.html',
    port: 3000,
  },
})
