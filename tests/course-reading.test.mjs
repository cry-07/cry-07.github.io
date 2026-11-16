import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownRenderer } from 'vitepress';
import { courseHeadings } from '../shared/course-headings.mjs';
const md=await createMarkdownRenderer(process.cwd(),{headers:true,math:true,config:md=>courseHeadings(md,[{slug:'sample',no:'02'}])});
test('heading numbering preserves old anchors and leaves paragraphs and code untouched',()=>{
 const env={relativePath:'notes/sample.md'};
 const html=md.render('# 标题：\n\n正文：保留。\n\n## 条件：\n\n### 证明:\n\n#### 反例：\n\n## 后续：\n\n```md\n## 代码：\n```\n',env);
 assert.match(html,/id="条件"[^>]*>2\.1 条件/);
 assert.match(html,/2\.1\.1 证明/);
 assert.match(html,/2\.1\.1\.1 反例/);
 assert.match(html,/2\.2 后续/);
 assert.match(html,/正文：保留。/);
 assert.equal(env.headers[0].title,'2.1 条件');
 assert.equal(env.headers[0].slug,'条件');
 const again=md.render('## 条件：',{relativePath:'notes/sample.md'});
 assert.match(again,/2\.1 条件/);
});
test('non-note pages receive no chapter numbers',()=>{
 const html=md.render('# 专题\n\n## 介绍',{relativePath:'index.md'});
 assert.ok(!html.includes('data-section-number'));
});

test('sidebar titles retain inline mathematical labels',()=>{
 const env={relativePath:'notes/sample.md'};
 md.render('## 矩阵 $K$ 的性质：',env);
 assert.equal(env.headers[0].title,'2.1 矩阵 K 的性质');
});
