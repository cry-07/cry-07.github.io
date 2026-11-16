import { cp, mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist/numerical-methods', { recursive: true });
await cp('handouts/.vitepress/dist', 'dist/numerical-methods', { recursive: true });
await mkdir('dist/crypto-handouts', { recursive: true });
await cp('crypto-handouts/.vitepress/dist', 'dist/crypto-handouts', { recursive: true });
await mkdir('dist/linear-algebra', { recursive: true });
await cp('linear-algebra/.vitepress/dist', 'dist/linear-algebra', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('博客、计算方法讲义、密码学及线性代数讲义已合并至 dist/。');
