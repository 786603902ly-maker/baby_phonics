/* Builds dist/ — exactly the files a web server should serve, nothing else.
   web/page.html stays behind: it is the artifact body fragment, not a page.
   Run: node tools/dist.mjs   (this is Vercel's build command) */
import { mkdirSync, copyFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVABLE } from './build.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const web = join(root, 'web');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

let total = 0, missing = [];
for (const f of SERVABLE) {
  const src = join(web, f);
  if (!existsSync(src)) { missing.push(f); continue; }
  copyFileSync(src, join(dist, f));
  total += statSync(src).size;
}
if (missing.length) {
  console.error('missing files: ' + missing.join(', '));
  process.exit(1);
}
console.log('dist/ ready — ' + SERVABLE.length + ' files, ' + Math.round(total / 1024) + ' KB');
