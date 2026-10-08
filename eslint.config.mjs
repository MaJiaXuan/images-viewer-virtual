import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import globals from 'globals'

// 规则阈值单独命名：no-magic-numbers 允许 `const NAME = 3` 这种形式，直接写字面量则会被报错
const MAX_NESTED_CALLBACKS = 3
const MAX_PARAMS = 4

export default [
  {
    // 全局忽略（仅含 ignores 的配置对象即为全局忽略项，等价于旧版 .eslintignore）
    ignores: [
      'dist',
      'node_modules',
      'public',
      '*.min.js',
      'scripts',
      '**/*.local',
      'docs/.vitepress/cache',
      'docs/.vitepress/dist',
      'docs/.vitepress/.temp',
      'docs/public/dist',
    ],
  },
  js.configs.recommended,
  pluginImport.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: Object.fromEntries(
        Object.entries({ ...globals.browser, ...globals.node }).map(([k, v]) => [k.trim(), v])
      ),
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object'],
          pathGroups: [
            {
              pattern: '{vite,vitest}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '*.{css,scss,less,json}',
              group: 'object',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': 'warn',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-unresolved': 'off',

      complexity: ['warn', { max: 10 }],
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'no-magic-numbers': [
        'warn',
        { ignore: [-1, 0, 1], ignoreArrayIndexes: true, enforceConst: true },
      ],
      'max-nested-callbacks': ['warn', MAX_NESTED_CALLBACKS],
      'max-params': ['warn', MAX_PARAMS],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': ['warn', { object: true, array: false }],

      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // 测试用例天然以字面量做断言（clamp(5, 0, 10) 之类），逐个命名只会降低可读性；
    // 单文件承载全部用例也属预期，因此对测试目录放宽这两条纯风格规则。
    files: ['test/**/*.{js,mjs,cjs}'],
    rules: {
      'no-magic-numbers': 'off',
      'max-lines': 'off',
    },
  },
]
