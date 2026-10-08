/**
 * 选项处理：旧选项名兼容映射 + 深合并 + 默认值兜底
 */

import { DEFAULT_OPTIONS, OPTION_ALIASES } from '../defaults.js'

function isMergeableObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 递归合并配置对象。数组与原始值整体覆盖，普通对象逐键合并。
 */
export function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return source
  if (!isMergeableObject(source)) return source

  const result = { ...target }
  for (const key in source) {
    result[key] = isMergeableObject(source[key]) ? deepMerge(result[key], source[key]) : source[key]
  }
  return result
}

/**
 * 把用户传入的选项合并到默认配置上（先做旧名兼容映射）。
 */
export function mergeOptions(opts) {
  const normalized = {}
  for (const key in opts) {
    normalized[OPTION_ALIASES[key] || key] = opts[key]
  }

  const merged = { ...DEFAULT_OPTIONS }
  for (const key in normalized) {
    const value = normalized[key]
    merged[key] = isMergeableObject(value) ? deepMerge(merged[key], value) : value
  }
  return merged
}
