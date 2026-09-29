# AGENTS.md — 项目 AI 协作规范

## 项目概述

- 技术栈：Vite + 纯 JavaScript（无 TypeScript）
- 构建工具：Vite 5+
- 包管理器：pnpm@9.15.0（Node >= 20）
- 目标环境：覆盖全球 95% 用户浏览器（详见 .browserslistrc）

## 绝对禁止

- 禁止使用 TypeScript（.ts、类型注解、泛型）
- 禁止使用 var，一律用 const / let
- 禁止在 components/ 目录写业务逻辑，只放纯展示组件
- 禁止相对路径 ../../ 超过 2 层，超过必须用 @/ 别名
- 禁止提交未通过 lint-staged 的代码
- 禁止提交 console.log / debugger 到生产环境
- 禁止中文文件名、空格、特殊字符命名
- 禁止单个函数超过 80 行、超过 4 个参数、圈复杂度超过 10

## 编码规范

### Import 顺序（强制）

按以下分组，组间空一行，同组内按字母升序：

1. 内置模块（node:fs, node:path）
2. 第三方库（vite, axios, lodash-es）
3. 内部别名（@/utils, @/components）
4. 相对路径（../, ./）
5. 样式 / JSON（放最后）

### 命名规范

| 类型      | 命名法           | 示例           |
| --------- | ---------------- | -------------- |
| 组件/页面 | PascalCase       | UserCard.js    |
| 工具函数  | camelCase        | formatDate.js  |
| 常量文件  | UPPER_SNAKE_CASE | API_CONFIG.js  |
| 样式文件  | kebab-case       | user-card.scss |
| 目录      | 全小写短横线     | user-center/   |

### 代码风格

- 缩进：2 空格
- 引号：单引号
- 分号：省略
- 换行：LF（Unix）
- 行宽：100 字符
- 箭头函数单参数省略括号
- 对象/数组优先解构

### 魔法数字

禁止裸写（-1, 0, 1 除外），必须用 const 常量命名。

## 目录结构

src/
api/ 接口请求
assets/ 静态资源
components/ 公共组件（纯展示）
composables/ 组合式函数
constants/ 常量
layouts/ 布局
router/ 路由
stores/ 状态管理
utils/ 工具函数
views/ 页面组件

## 环境变量

- 开发：.env.development
- 生产：.env.production
- 本地：.env.local（不提交 Git）
- 所有变量必须以 VITE\_ 开头才能在客户端使用

## 构建约束

- 目标：esnext
- 压缩：terser
- 小于 4KB 资源内联，超过走 URL
- 单 chunk 超过 500KB 必须拆分
- 构建后输出 dist/stats.html 体积分析

## 静态资源

- 仅允许：png, jpg, jpeg, gif, svg, webp, ico
- 单文件不得超过 500KB

## 提交规范（Conventional Commits）

- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- perf: 性能
- chore: 构建/工具

## AI 生成优先级

1. 优先复用现有工具函数和组件
2. 复杂逻辑拆分为小函数，单一职责
3. 错误处理必须显式，不静默吞异常
4. 生成后主动检查是否符合本规范
