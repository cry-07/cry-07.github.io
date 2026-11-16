import { defineConfig } from 'vitepress';
import numericalConfig from '../../handouts/.vitepress/config.mjs';
import { linearChapters } from '../../linear-chapters.mjs';
import { linearHref, href } from '../../site.config.mjs';

export default defineConfig({
  ...numericalConfig,
  title: '线性代数学习笔记',
  description: '围绕 Strang 线性代数中的问题，连接运算、几何与矩阵分解。',
  base: linearHref(),
  head: [['link', { rel: 'icon', href: href('favicon.svg'), type: 'image/svg+xml' }]],
  themeConfig: {
    ...numericalConfig.themeConfig,
    siteTitle: '线性代数',
    nav: [{ text: '课程目录', link: '/' }, { text: '开始阅读', link: '/notes/vectors-and-matrices' }],
    sidebar: [{ text: '章节笔记', items: linearChapters.map(c => ({ text: c.no+' '+c.title, link: '/notes/'+c.slug })) }],
    footer: { message: '在线性组合与矩阵之间，连接代数与几何。', copyright: 'cryself · 线性代数学习笔记' },
  },
});
