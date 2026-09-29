const fs = require('fs')
const path = require('path')

const srcDir = path.resolve('dist')
const destDir = path.resolve('docs/public/dist')

if (!fs.existsSync(srcDir)) {
  console.error('❌ dist/ 目录不存在，请先运行构建')
  process.exit(1)
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

const files = fs.readdirSync(srcDir)
for (const file of files) {
  const srcFile = path.join(srcDir, file)
  const destFile = path.join(destDir, file)
  const stat = fs.statSync(srcFile)
  if (stat.isFile()) {
    fs.copyFileSync(srcFile, destFile)
    console.log(`  ✅ copied: ${file}`)
  }
}
console.log('Done!')
