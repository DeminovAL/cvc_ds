/* Локальный просмотр сайта: node serve.mjs → http://localhost:8080 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8080;

const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        let pathname = decodeURIComponent(url.pathname);
        if (pathname.endsWith('/')) pathname += 'index.html';

        const safePath = normalize(pathname).replace(/^([/\\])+/, '');
        const filePath = join(ROOT, safePath);

        if (!filePath.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
            res.writeHead(403).end('Forbidden');
            return;
        }

        const info = await stat(filePath);
        if (!info.isFile()) throw new Error('not a file');

        const data = await readFile(filePath);
        res.writeHead(200, {
            'Content-Type': types[extname(filePath).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
        });
        res.end(data);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404</h1><p>Страница не найдена. <a href="/">На главную</a></p>');
    }
});

server.listen(PORT, () => {
    console.log(`Сайт открыт: http://localhost:${PORT}`);
});
