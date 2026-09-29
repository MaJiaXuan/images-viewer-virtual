import fs from 'fs'
import path, { resolve } from 'path'
import zlib from 'zlib'

import { defineConfig } from 'vite'

import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

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
      const ratio = ((gz.length / content.length) * 100).toFixed(1)
      console.log(`  gzip: ${f} \u2192 ${f}.gz (${ratio}%)`)
    }
  }
}

const gzipPlugin = () => ({
  name: 'gzip-plugin',
  closeBundle() {
    gzipBuildOutput()
  },
})

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    {
      name: 'conditional-legacy',
      configResolved(config) {
        if (!config.build.lib) {
          config.plugins.push(legacy({ targets: ['defaults', 'not IE 11'] }))
        }
      },
    },
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
