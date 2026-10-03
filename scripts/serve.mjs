import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
http.createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.startsWith('/ellie-website/')) pathname = pathname.slice('/ellie-website'.length);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const target = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.')) || !types[path.extname(target)]) { response.writeHead(404); response.end('Not found'); return; }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)], 'Cache-Control': 'no-cache' });
    response.end(content);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4173'));
