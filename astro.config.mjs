import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import { site, base, linearHref } from './site.config.mjs';
export default defineConfig({
  redirects: {
    '/posts/linear-algebra-01-vectors-and-matrices/': linearHref('notes/vectors-and-matrices'),
    '/posts/linear-algebra-02-solving-linear-systems/': linearHref('notes/solving-linear-systems'),
  },
  site: site.url, base, output: 'static', trailingSlash: 'always',
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
  server: { host: '127.0.0.1' },
});
