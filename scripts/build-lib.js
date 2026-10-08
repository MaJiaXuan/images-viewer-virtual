const { build } = require('vite')
const { resolve } = require('path')
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

const OUTPUT_DIR = resolve(__dirname, '../dist')

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

const BANNER = `/*!\n * ${pkg.name} v${pkg.version}\n * ${pkg.homepage || (pkg.repository && pkg.repository.url) || ''}\n *\n * Copyright ${new Date().getFullYear()}-present ${(pkg.author || 'Author').replace(/\s*<.*>/, '')}\n * Released under the ${pkg.license || 'MIT'} license\n *\n * Date: ${new Date().toISOString()}\n */\n`

const D_TS_SRC = resolve(__dirname, '../types/index.d.ts')

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
  fs.copyFileSync(D_TS_SRC, resolve(OUTPUT_DIR, 'index.d.ts'))
  console.log('  dist/index.d.ts copied')
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
