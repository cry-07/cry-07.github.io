import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import { notesHref, base } from '../site.config.mjs';
const children = [
  spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', '4321'], { stdio:'inherit' }),
  spawn(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'dev', 'handouts', '--host', '127.0.0.1', '--port', '5173'], { stdio:'inherit' }),
];
const gateway = http.createServer((req, res) => {
  const course = (req.url || '').startsWith(notesHref());
  const proxy = http.request({ host:'127.0.0.1', port:course ? 5173 : 4321, path:req.url, method:req.method, headers:req.headers }, response => { res.writeHead(response.statusCode, response.headers); response.pipe(res); });
  proxy.on('error', () => { res.writeHead(503); res.end('本地开发服务正在启动，请稍后刷新。'); }); req.pipe(proxy);
});
gateway.on('upgrade', (req, socket, head) => {
  const port = (req.url || '').startsWith(notesHref()) ? 5173 : 4321;
  const upstream = net.connect(port, '127.0.0.1', () => {
    upstream.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` + Object.entries(req.headers).map(([key,value]) => `${key}: ${value}`).join('\r\n') + '\r\n\r\n');
    if (head.length) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on('error', () => socket.destroy());
  socket.on('error', () => upstream.destroy());
});
const port = Number(process.env.PORT || 4173);
gateway.listen(port, '127.0.0.1', () => console.log(`开发入口：http://127.0.0.1:${port}${base}`));
function close() { for (const child of children) child.kill(); gateway.close(); }
process.on('SIGINT', close); process.on('SIGTERM', close);
