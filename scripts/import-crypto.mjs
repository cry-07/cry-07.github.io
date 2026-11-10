import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cryptoChapters } from '../crypto-chapters.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
let local = {};
try { local = JSON.parse(await readFile(path.join(project, 'notes-source.local.json'), 'utf8')); } catch {}
const source = path.resolve(process.argv[2] || process.env.CRYPTO_NOTES_SOURCE || local.cryptoSource || 'D:/大学文件/密码学原理/Notes');
const target = path.join(project, 'crypto-handouts/notes');
await mkdir(target, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function filesIn(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await filesIn(file)); else out.push(file);
  }
  return out;
}
const allFiles = await filesIn(source);
const originals = new Map(cryptoChapters.map(c => [c.file, c.slug]));
const report = [];
for (const chapter of cryptoChapters) {
  const original = await readFile(path.join(source, chapter.file));
  let text = original.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/[\u200B\uFEFF]/g, '');
  if (!text.trim()) throw new Error(`章节正文为空：${chapter.file}`);
  const fixes = [], assets = [];
  if (text.includes('\\xleftarrow{$}')) {
    text = text.replaceAll('\\xleftarrow{$}', '\\xleftarrow{\\$}');
    fixes.push('转义均匀抽样箭头中的美元符号，避免截断行内公式');
  }
  // Convert editor-specific image HTML to Markdown so VitePress can bundle the files.
  text = text.replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || '笔记插图';
    if (!src) throw new Error(`图片缺少 src：${chapter.file}`);
    fixes.push('将 HTML 图片转为 Markdown，保留图片内容与说明');
    return `![${alt}](${src})`;
  });
  const refs = [...text.matchAll(/!\[([^\]]*)\]\(([^\n]+)\)/g)];
  for (const [whole, alt, raw] of refs) {
    if (/^(?:https?:|data:)/.test(raw)) continue;
    const decoded = decodeURIComponent(raw.replace(/^<|>$/g, ''));
    let asset = path.resolve(source, decoded);
    const external = !asset.startsWith(source + path.sep);
    if (external && (!path.isAbsolute(decoded) || !/\.(?:png|jpe?g|svg|webp|gif)$/i.test(decoded))) throw new Error(`不支持的外部图片引用：${raw}`);
    if (!external && !allFiles.includes(asset)) {
      const options = allFiles.filter(f => path.basename(f) === path.basename(decoded));
      if (options.length !== 1) throw new Error(`图片缺失或不唯一：${raw}`);
      asset = options[0]; fixes.push(`恢复图片路径：${raw}`);
    }
    const name = path.basename(asset);
    const dir = path.join(target, 'assets', chapter.slug);
    await mkdir(dir, { recursive: true });
    await copyFile(asset, path.join(dir, name));
    text = text.replace(whole, `![${alt}](./assets/${chapter.slug}/${name})`);
    if (external) fixes.push('将原笔记引用的 Typora 本地图片复制为网站资源');
    assets.push({ file: external ? name : path.relative(source, asset).replaceAll('\\', '/'), external, sha256: hash(await readFile(asset)) });
  }
  text = text.replace(/(?<!!)\[([^\]\[\n]+)\]\(([^\n]+?)\)/g, (whole, label, raw) => {
    if (/^(?:https?:|mailto:|#)/.test(raw)) return whole;
    const [relative, anchor] = raw.split('#');
    if (relative.startsWith('./assets/')) return whole;
    if (/\.(?:png|jpe?g|svg|webp|gif)$/i.test(relative)) {
      const match = assets.find(a => path.basename(a.file) === path.basename(decodeURIComponent(relative)));
      if (match) return `[${label}](./assets/${chapter.slug}/${path.basename(match.file)})`;
    }
    const slug = originals.get(decodeURIComponent(relative).replace(/^\.\//, ''));
    if (!slug) throw new Error(`无法映射笔记链接：${raw}`);
    fixes.push(`笔记链接映射：${decodeURIComponent(relative)} → ${slug}`);
    return `[${label}](./${slug}${anchor ? '#'+anchor : ''})`;
  });
  // Do not interpret escaped dollar signs (uniform sampling notation) as delimiters.
  text = text.replace(/(?<![\\$])\$(?!\$)([\s\S]*?)(?<![\\$])\$(?!\$)/g, (whole, expr) => {
    if (expr.includes('$$')) return whole;
    const normalized = expr.replace(/\s*\n\s*/g, ' ').trim();
    if (normalized !== expr) fixes.push('规范行内公式空白与跨行排版');
    return '$'+normalized+'$';
  });
  text = text.replace(/\*\*([^*\n]*\$[^*\n]*?)\*\*/g, (_, content) => `<strong>${content}</strong>`);
  // Keep one page title; retain the second examination heading as a navigable section.
  let seenTitle = false;
  text = text.replace(/^# (.+)$/gm, (_, title) => {
    if (!seenTitle) { seenTitle = true; return '# '+chapter.title; }
    fixes.push(`次级大标题转为章节标题：${title}`); return '## '+title;
  });
  if (!seenTitle) text = '# '+chapter.title+'\n\n'+text;
  const intro = `<div class="chapter-meta"><span>CRYPTOGRAPHY · ${chapter.no}</span><span>${Math.ceil(text.length/500)} 分钟阅读</span></div>`;
  text = text.replace(/^(# .+)$/m, '$1\n\n'+intro);
  await writeFile(path.join(target, chapter.slug+'.md'), `---\ntitle: ${JSON.stringify(chapter.title)}\ndescription: ${JSON.stringify(chapter.summary)}\n---\n\n${text}\n`);
  report.push({ file: chapter.file, slug: chapter.slug, sourceSha256: hash(original), images: refs.length, assets, fixes });
}
const empty = allFiles.filter(f => f.endsWith('.md') && !originals.has(path.basename(f)));
const skipped = [];
for (const file of empty) { const bytes = await readFile(file); if (bytes.toString('utf8').trim()) throw new Error(`存在未编入目录的笔记：${path.basename(file)}`); skipped.push({ file: path.basename(file), reason: '原文件为空', sourceSha256: hash(bytes) }); }
await writeFile(path.join(project, 'crypto-handouts/import-report.json'), JSON.stringify({ chapters: report, skipped }, null, 2)+'\n');
console.log(`已导入 ${report.length} 篇密码学笔记、${report.reduce((n,c)=>n+c.images,0)} 处图片；跳过 ${skipped.length} 个空文件。源文件未修改。`);
