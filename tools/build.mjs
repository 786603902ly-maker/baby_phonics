/* Generates web/index.html — the standalone, installable version — from
   web/page.html, which is the artifact-ready body-only source.
   Run: node tools/build.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const body = readFileSync(join(web, 'page.html'), 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
<meta name="theme-color" content="#FFF6E9">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Pip Phonics">
<meta name="description" content="A phonics tool for a four-year-old: hear a sound, pick a picture, drag a letter, hear how it went.">
<link rel="manifest" href="manifest.webmanifest">
<style>
  html, body { min-height: 100%; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
${body}
<script>
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && window.top === window.self) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support unavailable */ });
    });
  }
</script>
</head>
<body>
</body>
</html>
`;

/* The body-only source carries <title>, <style>, markup and <script> tags;
   putting it inside <head> is invalid, so split it: everything up to the
   first markup element stays in head, the rest goes in body. */
const splitAt = body.indexOf('<div id="app">');
const head = body.slice(0, splitAt);
const rest = body.slice(splitAt);

const out = html
  .replace(body, head)
  .replace('<body>\n</body>', '<body>\n' + rest + '\n</body>');

writeFileSync(join(web, 'index.html'), out);
console.log('wrote web/index.html');
