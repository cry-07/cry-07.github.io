// 个人信息只需在这里修改。站点地址也可通过 SITE_URL 环境变量设置。
export const site = {
  name: 'cryself',
  author: 'cry-07',
  initials: 'C',
  description: '把学过的知识，变成可以再次读懂的笔记。',
  bio: '记录学习的过程，也记录那些终于想明白的瞬间。',
  url: process.env.SITE_URL || 'https://cry-07.github.io',
  // 用户主页仓库保持 /；项目仓库可设置 SITE_BASE=/仓库名/。
  base: process.env.SITE_BASE || '/',
  github: 'https://github.com/cry-07',
  email: '',
};
export const base = '/' + site.base.split('/').filter(Boolean).join('/') + (site.base.split('/').filter(Boolean).length ? '/' : '');
export const href = (path = '') => base + path.replace(/^\/+/, '');
export const notesHref = (path = '') => href('numerical-methods/' + path.replace(/^\/+/, ''));
