import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { chapters } from '../chapters.mjs';
import { cryptoChapters } from '../crypto-chapters.mjs';
import { base } from '../site.config.mjs';
const root = path.resolve('dist');
async function walk(dir) { const out = []; for (const item of await readdir(dir,{withFileTypes:true})) { const name=path.join(dir,item.name); if(item.isDirectory()) out.push(...await walk(name)); else out.push(name); } return out; }
async function exists(file) { for(const candidate of [file,path.join(file,'index.html'),file+'.html']){try{if((await stat(candidate)).isFile())return true}catch{}}return false; }
const files = (await walk(root)).filter(f=>f.endsWith('.html'));
const failures = [];
for (const file of files) {
  const text = await readFile(file,'utf8');
  if(/data-mjx-error|class="katex-error"/.test(text)) failures.push(`公式解析错误：${path.relative(root,file)}`);
  for (const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = match[1].replaceAll('&amp;','&');
    if (/^(?:https?:|data:|mailto:|tel:|javascript:|#)/.test(raw)) continue;
    const url = new URL(raw, 'https://local.test' + base + path.relative(root,file).split(path.sep).join('/'));
    if(url.origin !== 'https://local.test') continue;
    const pathname = decodeURIComponent(url.pathname);
    if (!pathname.startsWith(base)) { failures.push(`链接缺少站点前缀：${raw} in ${path.relative(root,file)}`); continue; }
    if(!await exists(path.join(root,pathname.slice(base.length)))) failures.push(`失效资源：${raw} in ${path.relative(root,file)}`);
  }
}
for(const c of chapters) if(!await exists(path.join(root,'numerical-methods/notes',c.slug))) failures.push(`缺少章节：${c.slug}`);
for(const c of cryptoChapters) if(!await exists(path.join(root,'crypto-handouts/notes',c.slug))) failures.push(`缺少密码学章节：${c.slug}`);
const report = JSON.parse(await readFile('handouts/import-report.json','utf8'));
if(report.reduce((n,c)=>n+c.images,0)!==23) failures.push('导入图片数不符');
const cryptoReport = JSON.parse(await readFile('crypto-handouts/import-report.json','utf8'));
if(cryptoReport.chapters.reduce((n,c)=>n+c.images,0)!==27) failures.push('密码学导入图片数不符');
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exit(1);}
console.log(`已检查 ${files.length} 个 HTML 页面：9 篇计算方法及 8 篇密码学讲义齐全，本地链接与资源均有效，未发现公式错误标记。`);
