import { cp, mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist/numerical-methods', { recursive: true });
await cp('handouts/.vitepress/dist', 'dist/numerical-methods', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('博客与计算方法讲义已合并至 dist/。');
