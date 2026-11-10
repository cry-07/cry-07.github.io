# cryself · 个人博客与计算方法讲义

一个可以继续维护的静态网站：**Astro 个人博客 + VitePress 课程讲义**。已导入 9 篇计算方法笔记、23 处图片，附牛顿法交互演示。原始笔记目录不受修改。

## 本地查看

需要 Node.js 24（建议当前 24 LTS）。在本项目目录打开 PowerShell：

```powershell
npm install
npm run build
npm run preview
```

打开 [博客首页](http://127.0.0.1:4173/) 或 [计算方法讲义](http://127.0.0.1:4173/numerical-methods/)。关闭预览按 Ctrl+C。已经安装过依赖时可以跳过 `npm install`；已经构建且没有更改时只需 `npm run preview`。

修改页面时使用 `npm run dev`，同样从 `http://127.0.0.1:4173/` 访问。它把博客与讲义两个开发服务接到同一个入口。若端口占用，先关闭之前的预览进程。

## 改成你自己的博客

编辑 `site.config.mjs`：

```js
export const site = {
  name: 'cryself',        // 站名
  author: 'cry-07',       // 你的显示名称
  initials: 'C',          // 暂时用作文字头像
  description: '把学过的知识，变成可以再次读懂的笔记。',
  bio: '记录学习的过程，也记录那些终于想明白的瞬间。',
  url: process.env.SITE_URL || 'https://cry-07.github.io',
  base: process.env.SITE_BASE || '/',
  github: 'https://github.com/cry-07',
  email: '',
};
```

正式网址已配置为 `https://cry-07.github.io/`；发布工作流也会自动读取实际 Pages 地址。当前没有编造个人经历或示例文章；“关于这里”介绍的是笔记站本身。

横幅是 `public/hero.svg`，为本项目绘制的分层山景。头像位于 `src/pages/index.astro` 的 `.avatar` 区域，之后可以替换为自己的图片。博客颜色、字号、间距在 `src/styles/blog.css`；讲义样式在 `handouts/.vitepress/theme/custom.css`。

## 更新计算方法笔记

原目录：`D:\大学文件\计算方法\Notes`。在原目录继续用 Markdown 编辑，之后运行：

```powershell
npm run import:notes
npm run build
```

如果源目录变了，把路径作为参数传入：

```powershell
npm run import:notes -- "D:\新的目录\Notes"
```

也可新建不会提交到仓库的 `notes-source.local.json`：

```json
{ "source": "D:/大学文件/计算方法/Notes" }
```

导入只从原目录读取，生成 `handouts/notes/*.md` 与本地图片。**讲义副本会在下次导入时覆盖**，因此长期正文修改请保存在原目录；演示组件、样式、首页和站点配置单独存放，不受覆盖。

导入会记录 `handouts/import-report.json`，其中列出原 Markdown 和图片的 SHA256、图片数及格式修复。已处理：Chebyshev 的 3 处旧图片路径、缺失的公式结束标记、行内公式内侧空格、SVD 的跨行行内矩阵，以及 QR 章节的数学伪代码缩进、紧邻中文的公式粗体标记。未做数学内容校订。

章节名称、顺序、摘要、原文件名与固定 URL 在 `chapters.mjs` 统一维护。移动原文件或增加新章时同步修改此文件。已提交的网站副本可以直接构建，GitHub 不需要读取本机 D 盘。

## 写博客文章

在 `src/content/posts/` 新建 UTF-8 Markdown 文件，例如 `my-first-post.md`：

```markdown
---
title: 一次新的理解
date: 2026-11-10
description: 用一句话说明这篇文章写了什么。
tags:
  - 学习
---

## 从一个问题开始

这里写正文。可以使用 $a^2+b^2=c^2$ 这样的行内公式。
```

构建后会自动出现在首页，“文章随笔”支持分类筛选与标题、摘要、标签搜索。阅读地址为 `/posts/my-first-post/`，页面自动带目录。当前没有文章时，切换到“文章随笔”会显示空状态。

## 讲义中的交互和折叠内容

牛顿法在求根章节末尾，提供示例函数、初值、容差与最大次数。支持单步、自动运行、暂停和重置，显示曲线、切线、残差、迭代差和表格。

- `handouts/.vitepress/theme/newton.mjs`：独立数值逻辑及停止条件。
- `handouts/.vitepress/theme/NewtonDemo.vue`：演示 UI 和 SVG。
- `tests/newton.test.mjs`：数值边界测试。

折叠解答可直接使用 VitePress 的 details 语法，正文默认不折叠：

```markdown
::: details 展开推导

这里写补充推导，也可以使用公式。

:::
```

所有正文图片支持点击或键盘 Enter / 空格放大，Escape 关闭并恢复焦点。深浅色选择在博客与讲义之间共享。

## 发布到 GitHub Pages

仓库已创建为 [cry-07/cry-07.github.io](https://github.com/cry-07/cry-07.github.io)，并已将 Pages 发布来源设为 GitHub Actions。正式首页为 [cryself](https://cry-07.github.io/)，讲义入口为 [计算方法讲义](https://cry-07.github.io/numerical-methods/)。每次推送到 `main` 后会自动构建发布，可在仓库的 Actions 页面查看结果。

日常更新笔记时，在本项目目录运行：

```powershell
npm run import:notes
npm run build
npm run check:site
git add .
git commit -m "Update numerical methods notes"
git push
```

如果只是写博客文章或修改样式，可以跳过导入笔记。下面的步骤供重建站点或迁移仓库时参考：

1. 使用账号 `cry-07` 创建名为 `cry-07.github.io` 的仓库，这样主页地址是 `https://cry-07.github.io/`，讲义地址是 `https://cry-07.github.io/numerical-methods/`。
2. **把本项目目录的内容放在仓库根目录**，包括隐藏目录 `.github`、`package-lock.json`、`handouts` 与源码。不要上传 `node_modules` 或 `dist`。
3. 仓库中进入 **Settings → Pages → Build and deployment → Source → GitHub Actions**。
4. 推送到 `main` 后，`.github/workflows/deploy.yml` 会测试、构建并发布博客与讲义。

也支持普通项目仓库，例如 `blog`。工作流会自动取得 `/blog/` 前缀，讲义路径变成 `/blog/numerical-methods/`。如需本地验证项目前缀：

```powershell
$env:SITE_BASE = '/blog/'
npm run build
npm run check:site
npm run preview
```

此时打开 `http://127.0.0.1:4173/blog/`。完成后关闭预览并恢复：

```powershell
Remove-Item Env:SITE_BASE
npm run build
```

部署依据：[VitePress GitHub Pages 文档](https://vitepress.dev/guide/deploy#github-pages)、[Astro GitHub Pages 文档](https://docs.astro.build/en/guides/deploy/github/)。

## 验证命令与目录

```powershell
npm test             # 数值逻辑
npm run build        # 生产构建并合并两个站点
npm run check:site   # 检查章节、资源、链接和公式错误标记
```

`node scripts/browser-check.mjs` 用于浏览器检查，需要运行中的预览以及本机 Edge；也可用 `BROWSER_PATH` 指定 Chromium 路径。脚本检查桌面与手机页面、搜索、主题、导航、图片放大和演示。截图默认放在工作区的 `work/browser-check/`。

```text
site.config.mjs                个人资料与地址
chapters.mjs                   章节内容索引
src/                          博客页面、文章和样式
public/                       博客横幅与图标
handouts/notes/               可构建的讲义 Markdown 副本与图片
handouts/.vitepress/           讲义配置、主题与演示
scripts/                      导入、构建合并、预览和检查
tests/                        数值测试
dist/                         合并后的最终静态网站
.github/workflows/deploy.yml   发布流程
```

不需要数据库或服务器后台。后续可继续添加其他课程、算法演示或文章。
