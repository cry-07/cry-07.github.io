import { courseHeadings } from '../../shared/course-headings.mjs';
import { defineConfig } from 'vitepress';
import numericalConfig from '../../handouts/.vitepress/config.mjs';
import { cryptoChapters } from '../../crypto-chapters.mjs';
import { cryptoHref, href } from '../../site.config.mjs';

export default defineConfig({
  ...numericalConfig,
  markdown: { math: true, lineNumbers: true, headers: { level: [2,3,4,5,6] }, config: md => courseHeadings(md, cryptoChapters) },
  title: '密码学原理讲义',
  description: '从完美保密到 CPA 安全，结合结构图、证明方法与历年试卷理解密码学。',
  base: cryptoHref(),
  head: [['link', { rel: 'icon', href: href('favicon.svg'), type: 'image/svg+xml' }]],
  themeConfig: {
    ...numericalConfig.themeConfig,
    aside: false,
    course: {"kind":"crypto","title":"密码学原理","description":"从安全定义出发，理解密码方案的构造、证明与攻击。","start":"/notes/perfect-secrecy","features":[{"title":"理论基础","text":"从完美保密与计算安全，读到流密码和分组密码。"},{"title":"证明方法","text":"结合归约、反例与安全游戏理解证明思路。"},{"title":"试卷串联","text":"把历年试卷中的题目连回定义与构造。"}]},
    siteTitle: '密码学原理',
    nav: [{ text: '课程目录', link: '/' }, { text: '开始阅读', link: '/notes/perfect-secrecy' }],
    sidebar: [...new Set(cryptoChapters.map(c => c.group))].map(group => ({ text: group, collapsed: false, items: cryptoChapters.filter(c => c.group === group).map(c => ({ text: c.title.startsWith(c.no) ? c.title : `${c.no} ${c.title}`, link: `/notes/${c.slug}` })) })),
    footer: { message: '从安全定义出发，用证明与反例建立理解。', copyright: 'cryself · 密码学原理学习笔记' },
  },
});
