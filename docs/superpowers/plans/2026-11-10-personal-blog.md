# Personal Blog and Numerical Methods Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a usable personal blog and publishable course website from the nine approved Markdown notes.

**Architecture:** Astro serves the blog; VitePress serves `/numerical-methods/`. A single build assembles both into `dist`. Import reads notes without modifying originals.

**Tech Stack:** Node 24, Astro 7, VitePress 1.6, Vue 3, MathJax, native SVG, Node test runner.

**Spec:** `../../../../个人博客与计算方法讲义-设计草案.md` (approved in chat on 2026-11-10).

## Global Constraints

- Source: `D:\大学文件\计算方法\Notes`; never write to that directory.
- Preserve all nine chapters and 23 image references.
- Fix only website formatting and known recoverable image paths.
- No invented personal biography, external account, or blog articles.
- No remote publication in this task.
- All deliverables remain under `outputs/personal-blog/`.

## Task 1: Integrated website and content pipeline

**Files:** `package.json`, `site.config.mjs`, `chapters.mjs`, `astro.config.mjs`, `src/layouts/BlogLayout.astro`, `src/styles/blog.css`, `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/posts/[slug].astro`, `src/pages/404.astro`, `src/lib/posts.ts`, `public/hero.svg`, `handouts/index.md`, `handouts/.vitepress/config.mjs`, `handouts/.vitepress/theme/{index.ts,custom.css,NewtonDemo.vue,newton.mjs,ImageZoom.vue}`, `scripts/{import-notes,assemble,serve,dev,check-site}.mjs`, `tests/newton.test.mjs`.

**Interfaces:** `chapters` exports `{no,slug,title,group,file,summary}[]`; `href(path)` adds the configured base; `notesHref(path)` targets the course subsite. Import outputs `handouts/notes/<slug>.md`, local assets, metadata and an import report. Newton's `stepNewton({functionId,x,tolerance,iteration,maxIterations})` returns one step with `{x,next,residual,delta,status,message}`. Blog content lives in `src/content/posts/*.md`; `getPosts()` returns validated frontmatter and Markdown components sorted by date.

- [x] Install pinned dependencies with `npm install`; verify supported Node engine.
- [x] Implement import: validate known files; repair 3 recoverable image links; copy assets; normalize multiline inline math; fix the missing dollar; record original SHA256 and per-file fixes. Missing or ambiguous images fail clearly.
- [x] Build custom three-column blog, neutral mathematical landscape SVG hero, responsive navigation, theme persistence, category filtering, search with empty state, Markdown post layout, about and 404 pages.
- [x] Build course home and theme: grouped sidebar, local Chinese search, page outline, formulas, responsive tables, previous/next and return-to-blog links. Add keyboard-accessible image zoom and reusable native details blocks.
- [x] Implement SVG Newton demonstration with example functions, initial value, tolerance, iteration cap, step/run/reset, derivative-zero, non-finite and iteration-limit outcomes. Write numerical tests first and run `npm test`.
- [x] Add build assembly and local server; support clean URLs, path safety, MIME types and configured deployment base. Build: `npm run build`; expect a blog index plus all 9 chapter HTML pages.

## Task 2: Verification and handover

**Files:** `scripts/check-site.mjs`, `.github/workflows/deploy.yml`, `README.md`, `docs/verification.md`.

**Interfaces:** `check-site` checks the assembled `dist` for missing local links/assets and expected chapters; preview serves `dist` at `127.0.0.1:4173` by default. Actions sets Pages URL/base, builds once and deploys one artifact.

- [x] Run `npm test`, `npm run build`, `npm run check:site`; address actual failures.
- [x] Inspect desktop and mobile blog, course landing, root-finding, and SVD pages. Check page width, math, missing images, focus, dialogs, local search, theme and Newton outcomes.
- [x] Recompute source hashes and verify originals unchanged. Test importing twice produces stable output.
- [x] Verify a non-root `SITE_BASE=/sample/` build and prefix-aware serving, then restore the normal root build.
- [x] Write Chinese instructions for configuration, posts, importing, building, previewing and GitHub Pages; add Actions workflow without triggering remote publication.
- [x] Save verification outcomes and show the local website to the user.

## Execution record

The project is a new isolated output directory, not an existing repository. The website and content pipeline share interfaces and are implemented together in this session; no existing main/master branch is modified. Review and validation follow the two tasks above.


Validation complete on 2026-11-10. See `docs/verification.md`. No remote publication was performed.
