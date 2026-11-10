import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base } from '../site.config.mjs';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.mjs':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (base !== '/' && pathname === base.slice(0,-1)) { res.writeHead(302, { Location: base }); return res.end(); }
    if (!pathname.startsWith(base)) { res.writeHead(404); return res.end('Not found'); }
    const local = pathname.slice(base.length);
    const target = path.resolve(root, local);
    if (!(target === path.resolve(root) || target.startsWith(path.resolve(root) + path.sep))) { res.writeHead(403); return res.end('Forbidden'); }
    let file;
    for (const candidate of [target, path.join(target, 'index.html'), target + '.html']) {
      try { if ((await stat(candidate)).isFile()) { file = candidate; break; } } catch {}
    }
    const code = file ? 200 : 404;
    if (!file) file = path.join(root, '404.html');
    const body = await readFile(file);
    res.writeHead(code, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(400); res.end('Bad request'); }
});
server.listen(port, '127.0.0.1', () => console.log(`预览：http://127.0.0.1:${port}${base}`));
