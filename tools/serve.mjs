/* Serves dist/ the way Vercel serves it — same headers, same cleanUrls.

   Why not `npx serve`: a generic static server sends its own cache headers, and
   those decide whether a returning browser ever notices a new deploy. Testing
   an update against the wrong headers tests nothing. In particular sw.js must
   go out as no-store, or the browser keeps the old service worker and the new
   build never arrives — which is indistinguishable, from the sofa, from the
   deploy having failed.

   Run: node tools/serve.mjs [port]   (default 8000) */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.env.SERVE_DIR || join(root, 'dist');
const cfg = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const port = Number(process.argv[2]) || 8000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.mp3': 'audio/mpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8'
};

/* vercel.json sources are path patterns like "/(.*).js" */
function headersFor(pathname) {
  const out = {};
  for (const rule of cfg.headers || []) {
    let re;
    try {
      re = new RegExp('^' + rule.source + '$');
    } catch {
      continue;
    }
    if (re.test(pathname)) for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  let file = join(dist, normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!existsSync(file) || statSync(file).isDirectory()) {
    const withHtml = file.replace(/\/$/, '') + '.html';       // cleanUrls
    file = cfg.cleanUrls && existsSync(withHtml) ? withHtml : join(dist, 'index.html');
    pathname = '/index.html';
  }
  const body = readFileSync(file);
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
    'Content-Length': body.length,
    ...headersFor(pathname)
  });
  res.end(body);
}).listen(port, () => console.log('dist/ on http://127.0.0.1:' + port + ' with vercel.json headers'));
