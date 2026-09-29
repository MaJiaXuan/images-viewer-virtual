import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ImagesViewer',
  description: '原生 JavaScript 图片查看器，支持虚拟列表、浏览器懒加载、手势拖拽与键盘快捷键',
  lang: 'zh-CN',
  base: '/images-viewer-virtual/',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/guide/api' },
      { text: '框架集成', link: '/guide/framework-integration' },
      { text: '示例', link: '/examples/basic' },
      { text: '版本', link: '/changelog' },
      { text: '关于', link: '/about' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'API 参考', link: '/guide/api' },
            { text: '框架集成', link: '/guide/framework-integration' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础用法', link: '/examples/basic' },
            { text: '字符串数组', link: '/examples/string-array' },
            { text: '自定义属性映射', link: '/examples/custom-props' },
            { text: '自定义按钮', link: '/examples/custom-buttons' },
            { text: '按钮配置详解', link: '/examples/buttons-config' },
            { text: '自定义主题', link: '/examples/custom-theme' },
            { text: '自定义信息面板', link: '/examples/custom-info' },
            { text: '不循环 + 缩放限制', link: '/examples/noloop' },
            { text: '错误处理与重试', link: '/examples/error-handling' },
            { text: '国际化', link: '/examples/i18n' },
            { text: '国际化详解', link: '/examples/i18n-detail' },
            { text: '程序化控制', link: '/examples/programmatic' },
            { text: '错误图片 Fallback', link: '/examples/fallback' },
            { text: '微前端生命周期', link: '/examples/microfrontend' },
            { text: '单张图片', link: '/examples/single-image' },
            { text: '隐藏缩略图栏', link: '/examples/show-thumb-bar' },
            { text: '缩略图样式', link: '/examples/item-class' },
            { text: '错误样式', link: '/examples/error-class' },
            { text: '1000 张图片', link: '/examples/virtual-list-1000' },
            { text: '5000 张图片', link: '/examples/virtual-list-5000' },
            { text: '10000 张图片', link: '/examples/virtual-list-10000' },
            { text: '跳转到指定图片', link: '/examples/goto' },
            { text: '显示隐藏控制', link: '/examples/show-visibility' },
            { text: '运行时切换显示', link: '/examples/toggle-visibility' },
            { text: '复制图片', link: '/examples/copy-image' },
            { text: '完整工具栏', link: '/examples/full-toolbar' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/MaJiaXuan/images-viewer-virtual' }],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
    footer: {
      message:
        'Released under the MIT License. 借鉴 <a href="https://gitee.com/ybchen292/images-viewer" target="_blank">images-viewer</a> 设计思路。',
      copyright: 'Copyright © 2024-present ImagesViewer Contributors',
    },
  },
})
