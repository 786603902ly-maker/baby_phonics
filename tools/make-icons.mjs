/* Renders web/icon.svg to the PNG sizes iOS and Android need.
   Dev-only: needs playwright (npm i -D playwright). The PNGs are committed,
   so a normal build and deploy never runs this.
   Run: node tools/make-icons.mjs */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const svg = readFileSync(join(web, 'icon.svg'), 'utf8');

/* Maskable icons are cropped to a circle by the launcher, so the artwork has
   to sit inside the middle 80%. Same drawing, more breathing room. */
const maskable = svg
  .replace('<rect width="100" height="100" rx="22" fill="#FFF6E9"/>', '<rect width="100" height="100" fill="#FFF6E9"/>')
  .replace('translate(8 10) scale(0.84)', 'translate(17 19) scale(0.66)');

const jobs = [
  { name: 'apple-touch-icon.png', size: 180, src: svg },
  { name: 'icon-192.png', size: 192, src: svg },
  { name: 'icon-512.png', size: 512, src: svg },
  { name: 'icon-512-maskable.png', size: 512, src: maskable }
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.size, height: j.size } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:#FFF6E9}svg{display:block;width:${j.size}px;height:${j.size}px}</style>` +
    j.src.replace(/width="512" height="512"/, `width="${j.size}" height="${j.size}"`)
  );
  await page.screenshot({ path: join(web, j.name), omitBackground: false });
  await page.close();
  console.log('wrote web/' + j.name, j.size + 'px');
}
await browser.close();
