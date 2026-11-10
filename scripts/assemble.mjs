import { cp, mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist/numerical-methods', { recursive: true });
await cp('handouts/.vitepress/dist', 'dist/numerical-methods', { recursive: true });
await mkdir('dist/crypto-handouts', { recursive: true });
await cp('crypto-handouts/.vitepress/dist', 'dist/crypto-handouts', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('博客、计算方法讲义与密码学讲义已合并至 dist/。');
