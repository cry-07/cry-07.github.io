import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chapters } from '../chapters.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
let local = {};
try { local = JSON.parse(await readFile(path.join(project, 'notes-source.local.json'), 'utf8')); } catch {}
const source = path.resolve(process.argv[2] || process.env.NOTES_SOURCE || local.source || 'D:/大学文件/计算方法/Notes');
const output = path.join(project, 'handouts/notes');
await mkdir(output, { recursive: true });
async function listFiles(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(name));
    else result.push(name);
  }
  return result;
}
const allFiles = await listFiles(source);
const report = [];
for (const chapter of chapters) {
  const original = await readFile(path.join(source, chapter.file));
  let text = original.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const fixes = [];
  const imageRefs = [...text.matchAll(/!\[([^\]]*)\]\(([^\n]+)\)/g)];
  const assetsDir = path.join(output, 'assets', chapter.slug);
  if (imageRefs.length) await mkdir(assetsDir, { recursive: true });
  const assets = [];
  for (const [, alt, raw] of imageRefs) {
    if (/^(https?:|data:)/.test(raw)) continue;
    const decoded = decodeURIComponent(raw.replace(/^<|>$/g, ''));
    let originalAsset = path.resolve(source, decoded);
    if (!originalAsset.startsWith(source + path.sep)) throw new Error(`图片超出笔记目录：${raw}`);
    if (!allFiles.includes(originalAsset)) {
      const candidates = allFiles.filter(name => path.basename(name) === path.basename(decoded));
      if (candidates.length !== 1) throw new Error(`图片缺失或存在同名歧义：${chapter.file}: ${raw}`);
      originalAsset = candidates[0];
      fixes.push(`修复图片路径：${raw} → ${path.relative(source, originalAsset)}`);
    }
    const basename = path.basename(originalAsset);
    await copyFile(originalAsset, path.join(assetsDir, basename));
    const target = `./assets/${chapter.slug}/${basename}`;
    text = text.replace(`![${alt}](${raw})`, `![${alt}](${target})`);
    const bytes = await readFile(originalAsset);
    assets.push({ file: path.relative(source, originalAsset).replaceAll('\\', '/'), sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  if (chapter.slug === 'error-analysis') {
    text = text.replace(/(通常\$\|u\| \\approx 10\^\{-16\})(?!\$)/, '$1$');
    fixes.push('补齐单位舍入误差公式的结尾 $');
  }
  // Typora permits a matrix in multiline inline math; browsers need a single inline token.
  text = text.replace(/(?<!\$)\$(?!\$)([\s\S]*?)(?<!\$)\$(?!\$)/g, (whole, expression) => {
    if (expression.includes('$$')) return whole;
    if (expression.includes('\n')) fixes.push('跨行行内公式合并为单行');
    if (expression !== expression.trim()) fixes.push('移除行内公式分隔符内侧空白');
    return '$' + expression.replace(/\s*\n\s*/g, ' ').trim() + '$';
  });
  if (chapter.slug === 'least-squares') {
    // Typora's tab-indented mathematical pseudocode otherwise becomes literal code.
    text = text.replace(/^(\t+)(.+)$/gm, (_, indent, line) => `${'> '.repeat(indent.length)}${line}`);
    fixes.push('将 tab 缩进的数学伪代码转换为可渲染公式的缩进引用');
  }
  // Inline-math parsing accepts compact notation but not stray zero-width characters.
  text = text.replace(/[\u200B\uFEFF]/g, '');
  text = text.replace(/\*\*([^*\n]*\$[^*\n]*?)\*\*/g, (_, content) => {
    fixes.push('将公式外的粗体标记转换为兼容中文相邻字符的 strong 标签');
    return `<strong>${content}</strong>`;
  });
  text = text.replace(/^# .+$/m, `# ${chapter.title}`);
  const intro = `<div class="chapter-meta"><span>NUMERICAL METHODS · ${chapter.no}</span><span>${Math.max(1, Math.ceil(text.length / 500))} 分钟阅读</span></div>\n\n`;
  text = text.replace(/^(# .+\n)/m, `$1\n${intro}`);
  if (chapter.slug === 'root-finding') text += '\n\n## 动手试一试：牛顿法\n\n改变初值，逐步观察切线怎样把近似值带向根。残差和迭代差会同时显示。\n\n<NewtonDemo />\n';
  const frontmatter = `---\ntitle: ${JSON.stringify(chapter.title)}\ndescription: ${JSON.stringify(chapter.summary)}\n---\n\n`;
  await writeFile(path.join(output, chapter.slug + '.md'), frontmatter + text, 'utf8');
  report.push({ file: chapter.file, slug: chapter.slug, sourceSha256: createHash('sha256').update(original).digest('hex'), characters: original.toString('utf8').length, images: imageRefs.length, assets, fixes });
}
await writeFile(path.join(project, 'handouts/import-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(`已导入 ${report.length} 篇笔记，${report.reduce((n, item) => n + item.images, 0)} 处图片。原文件未修改。`);
