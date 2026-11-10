import { defineConfig } from 'vitepress';
import numericalConfig from '../../handouts/.vitepress/config.mjs';
import { cryptoChapters } from '../../crypto-chapters.mjs';
import { cryptoHref, href } from '../../site.config.mjs';

export default defineConfig({
  ...numericalConfig,
  title: '密码学原理讲义',
  description: '从完美保密到 CPA 安全，结合结构图、证明方法与历年试卷理解密码学。',
  base: cryptoHref(),
  head: [['link', { rel: 'icon', href: href('favicon.svg'), type: 'image/svg+xml' }]],
  themeConfig: {
    ...numericalConfig.themeConfig,
    siteTitle: '密码学原理',
    nav: [{ text: '课程目录', link: '/' }, { text: '开始阅读', link: '/notes/perfect-secrecy' }],
    sidebar: [...new Set(cryptoChapters.map(c => c.group))].map(group => ({ text: group, collapsed: false, items: cryptoChapters.filter(c => c.group === group).map(c => ({ text: c.title.startsWith(c.no) ? c.title : `${c.no} ${c.title}`, link: `/notes/${c.slug}` })) })),
    footer: { message: '从安全定义出发，用证明与反例建立理解。', copyright: 'cryself · 密码学原理学习笔记' },
  },
});
