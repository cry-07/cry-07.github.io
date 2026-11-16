import { courseHeadings } from '../../shared/course-headings.mjs';
import { defineConfig } from 'vitepress';
import numericalConfig from '../../handouts/.vitepress/config.mjs';
import { linearChapters } from '../../linear-chapters.mjs';
import { linearHref, href } from '../../site.config.mjs';

export default defineConfig({
  ...numericalConfig,
  markdown: { math: true, lineNumbers: true, headers: { level: [2,3,4,5,6] }, config: md => courseHeadings(md, linearChapters) },
  title: '线性代数学习笔记',
  description: '围绕 Strang 线性代数中的问题，连接运算、几何与矩阵分解。',
  base: linearHref(),
  head: [['link', { rel: 'icon', href: href('favicon.svg'), type: 'image/svg+xml' }]],
  themeConfig: {
    ...numericalConfig.themeConfig,
    aside: false,
    course: {"kind":"linear","title":"线性代数","description":"从线性组合与矩阵出发，连接代数运算、几何直觉与分解。","start":"/notes/vectors-and-matrices","features":[{"title":"当前章节","text":"收录第一、二章已完成的学习笔记。"},{"title":"多种视角","text":"把行、列、线性组合与矩阵运算联系起来。"},{"title":"关键推理","text":"围绕消元、可逆性与矩阵分解梳理条件和理由。"}]},
    siteTitle: '线性代数',
    nav: [{ text: '课程目录', link: '/' }, { text: '开始阅读', link: '/notes/vectors-and-matrices' }],
    sidebar: [{ text: '章节笔记', items: linearChapters.map(c => ({ text: c.no+' '+c.title, link: '/notes/'+c.slug })) }],
    footer: { message: '在线性组合与矩阵之间，连接代数与几何。', copyright: 'cryself · 线性代数学习笔记' },
  },
});
