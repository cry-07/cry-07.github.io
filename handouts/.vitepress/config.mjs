import { courseHeadings } from '../../shared/course-headings.mjs';
import { defineConfig } from 'vitepress';
import { chapters } from '../../chapters.mjs';
import { base, href, notesHref } from '../../site.config.mjs';

export default defineConfig({
  title: '计算方法讲义',
  description: '从误差分析到奇异值分解，用推导、图像和交互理解计算方法。',
  lang: 'zh-CN', base: notesHref(), cleanUrls: true, lastUpdated: false,
  head: [['link', { rel: 'icon', href: href('favicon.svg'), type: 'image/svg+xml' }]],
  markdown: { math: true, lineNumbers: true, headers: { level: [2,3,4,5,6] }, config: md => courseHeadings(md, chapters) },
  themeConfig: {
    aside: false,
    course: {"kind":"numerical","title":"计算方法","description":"从误差分析到奇异值分解，顺着推导理解原理，用图像与计算建立直觉。","start":"/notes/error-analysis","features":[{"title":"循序阅读","text":"按章节梳理误差、近似与矩阵计算之间的联系。"},{"title":"公式推导","text":"结合定义、条件与推导，理解每一步计算。"},{"title":"动手验证","text":"通过牛顿法交互演示和配图，连接原理与计算。"}]},
    siteTitle: '计算方法', logo: '/favicon.svg',
    nav: [{ text: '课程目录', link: '/' }, { text: '开始阅读', link: '/notes/error-analysis' }],
    sidebar: [...new Set(chapters.map(c => c.group))].map(group => ({ text: group, collapsed: false, items: chapters.filter(c => c.group === group).map(c => ({ text: `${c.no} ${c.title}`, link: `/notes/${c.slug}` })) })),
    outline: false,
    docFooter: { prev: '上一节', next: '下一节' },
    darkModeSwitchLabel: '外观', lightModeSwitchTitle: '切换到浅色', darkModeSwitchTitle: '切换到深色', sidebarMenuLabel: '章节目录', returnToTopLabel: '回到顶部',
    search: { provider: 'local', options: {
      detailedView: true,
      translations: { button: { buttonText: '搜索讲义', buttonAriaLabel: '搜索讲义' }, modal: { displayDetails: '显示详细结果', resetButtonTitle: '清空', backButtonTitle: '返回', noResultsText: '没有找到相关内容，试试其他关键词。', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } } },
    } },
    notFound: { code: '404', title: '这一页还没有写下', quote: '可以回到课程目录，沿着章节继续阅读。', linkLabel: '返回课程目录', linkText: '返回课程目录' },
    footer: { message: '在推导中理解，在计算中验证。', copyright: '个人学习笔记 · 保持好奇' },
  },
  vite: { server: { host: '127.0.0.1' } },
});
