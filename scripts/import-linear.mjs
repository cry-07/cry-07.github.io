import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { linearChapters } from '../linear-chapters.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(process.argv[2] || process.env.LINEAR_NOTES_SOURCE || 'D:/大学文件/线性代数/Notes');
const target = path.join(root, 'linear-algebra/notes');
const report = [];
await mkdir(target, { recursive: true });
for (const c of linearChapters) {
  const original = await readFile(path.join(source, c.file));
  let text = original.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\u200B/g, '').replace(/^# [^\n]+\n+/, '');
  const fixes = [];
  const replace = (before, after, reason) => { if(text.includes(before)) { text=text.replaceAll(before,after); fixes.push(reason); } };
  text=text.replace(/^来源：章首页及 1\.1，PDF 第 25～28 页\n+/m,'');
  replace('Column（行）','Column（列）','纠正 Column 的中文标签');
  replace('Row（列）','Row（行）','纠正 Row 的中文标签');
  replace('那么 $R$ 的第 $j$ 列一定是 $e_j$', '那么 $R$ 的第 $k$ 列一定是 $e_j$', '修正主元原列下标');
  replace('$R$ 一定是上三角的', '$R$ 一定具有行阶梯形结构（不要求是方阵）', '明确矩形 R 的阶梯形结构');
  replace('这一步可以用 $ 撤销', "这一步可以用 $r_i=r_i'+\\ell r_j$ 撤销", '补回缺失的逆行变换公式');
  replace('这与 3.2 中构造', '这与前文构造', '移除旧章节编号引用');
  replace('F_{\\mathrm{diff}}=\\frac{K}{h^2}U =\\frac{-u_{i-1}+2u_i-u_{i+1}}{h^2}', '(F_{\\mathrm{diff}})_i=\\left(\\frac{K}{h^2}U\\right)_i=\\frac{-u_{i-1}+2u_i-u_{i+1}}{h^2}', '用分量等式连接向量与标量');
  // Markdown-it 要求粗体结束标记前没有空白。
  text=text.replace(/\*\*([^*\n]+?)\s+\*\*/g, '**$1**');
  // 与已有讲义导入一致：数学表达式旁的中文粗体使用 HTML 边界。
  text=text.replace(/\*\*([^*\n]*\$[^*\n]*?)\*\*/g, '<strong>$1</strong>');
  text=text.replace(/^来源：章首页及 1\.1，PDF 第 25～28 页\n+/m, '');
  const assets = [];
  for(const [whole,alt,raw] of [...text.matchAll(/!\[([^\]]*)\]\(([^\n]+)\)/g)]) {
    if(/^(https?:|data:)/.test(raw)) continue;
    const asset=path.resolve(source,decodeURIComponent(raw.replace(/^<|>$/g,'')));
    if(!asset.startsWith(source+path.sep)) throw new Error('图片必须位于 Notes 中：'+raw);
    const dir=path.join(target,'assets',c.slug);
    await mkdir(dir,{recursive:true}); await copyFile(asset,path.join(dir,path.basename(asset)));
    text=text.replace(whole,`![${alt}](./assets/${c.slug}/${path.basename(asset)})`);
    assets.push(raw);
  }
  await writeFile(path.join(target,c.slug+'.md'),`---\ntitle: ${JSON.stringify(c.title)}\ndescription: ${JSON.stringify(c.summary)}\n---\n\n# ${c.title}\n\n${text.trim()}\n`);
  report.push({file:c.file,slug:c.slug,sourceSha256:createHash('sha256').update(original).digest('hex'),assets,fixes});
}
await writeFile(path.join(root,'linear-algebra/import-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`已导入 ${report.length} 篇线性代数笔记；源文件未修改，未导入其他文档。`);
