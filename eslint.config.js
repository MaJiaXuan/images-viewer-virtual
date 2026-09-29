import js from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import globals from 'globals'

export default [
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
      'max-nested-callbacks': ['warn', 3],
      'max-params': ['warn', 4],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': ['warn', { object: true, array: false }],

      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      'public',
      '*.min.js',
      'scripts',
      'docs/.vitepress/cache',
      'docs/.vitepress/dist',
      'docs/public/dist',
    ],
  },
]
