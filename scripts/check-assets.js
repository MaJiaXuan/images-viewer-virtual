import fs from 'node:fs'
import path from 'node:path'

const MAX_SIZE = 500 * 1024
const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']

function walk(dir) {
  let errors = []
  if (!fs.existsSync(dir)) {
    console.log(`目录不存在，跳过检查: ${dir}`)
    return errors
  }
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      errors.push(...walk(full))
    } else {
      const ext = path.extname(file).toLowerCase()
      if (!ALLOWED_EXT.includes(ext)) {
        errors.push(`[禁止] 非法格式: ${full}`)
      }
      if (stat.size > MAX_SIZE) {
        errors.push(`[超限] ${(stat.size / 1024).toFixed(1)}KB > 500KB: ${full}`)
      }
    }
  }
  return errors
}

const errs = walk('src/assets')
if (errs.length) {
  console.error('静态资源检查失败:\n' + errs.join('\n'))
  process.exit(1)
}
console.log('静态资源检查通过')
