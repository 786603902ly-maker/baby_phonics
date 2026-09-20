/* Generates the two files that must never be hand-edited:

     web/index.html — the standalone, installable page, wrapped around
                      web/page.html (which is the artifact-ready body).
     web/sw.js      — the offline cache, with the real asset list and a cache
                      name derived from a hash of every shipped file, so a
                      deploy always installs fresh instead of serving stale
                      files from the old cache.

   Run: node tools/build.mjs */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedKeys } from './speech-texts.mjs';
import { checkVercelJson } from './check-config.mjs';

const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');

/* ------------------------------------------------- the deploy must be valid
   An unknown key in vercel.json makes Vercel refuse the deployment before the
   build starts, with no logs — Production silently stays on the last commit
   that was valid. Three commits went out that way before anyone noticed. */
{
  const problems = checkVercelJson();
  if (problems.length) {
    console.error('vercel.json would be rejected by Vercel, so this would never deploy:');
    problems.forEach((p) => console.error('  ' + p));
    process.exit(1);
  }
}

/* Which commit this build came from. Vercel sets the variable; locally there is
   nothing to stamp, and stamping HEAD would put a stale sha in every commit. */
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || 'dev';

/* Order matters: the page loads these in sequence. */
export const SCRIPTS = [
  'icons.js', 'icons-words.js', 'mouths.js', 'content.js',
  'letter-clips.js', 'speech-clips.js', 'audio.js', 'app.js'
];

/* The audio: one mp3 per letter sound from tools/make-letter-audio.py, one per
   spoken word and line from tools/make-speech-audio.py. Read from the
   directories rather than listed here, so adding a sound is one command and
   not two edits. */
function mp3s(dir) {
  const here = join(web, 'audio', dir);
  return existsSync(here)
    ? readdirSync(here).filter((f) => f.endsWith('.mp3')).sort().map((f) => 'audio/' + dir + '/' + f)
    : [];
}
export const AUDIO = [...mp3s('letters'), ...mp3s('speech')];
export const STATIC = [
  'manifest.webmanifest', 'icon.svg', 'apple-touch-icon.png',
  'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'robots.txt'
];
export const SERVABLE = ['index.html', ...SCRIPTS, ...STATIC, ...AUDIO, 'sw.js'];

/* ------------------------------------------- every spoken line has a clip
   A line the app says with no clip behind it falls back to the device voice,
   which is exactly the two-voices-in-one-breath problem the recordings were
   made to end — and it fails silently, so nothing tells you. It happened once:
   hoisting three praise lines into a variable hid them from the extractor and
   they lost their clips without a word. This is that mistake made loud. */
{
  const clips = readFileSync(join(web, 'speech-clips.js'), 'utf8');
  const missing = expectedKeys().filter((k) => !clips.includes("'" + k.replace(/'/g, "\\'") + "':"));
  if (missing.length) {
    console.error('\n' + missing.length + ' spoken line(s) have no clip:');
    missing.forEach((k) => console.error('  ' + JSON.stringify(k)));
    console.error('\nRun: python3 tools/make-speech-audio.py\n');
    process.exit(1);
  }
}

/* ----------------------------- the clip says what the card says it says
   Grown-ups -> Voice prints each letter's clip next to the IPA on its card,
   and the letter card prints that IPA as the thing to copy. If the two drift
   apart the app is showing one sound and playing another, which is the whole
   failure this project keeps coming back to — silently, because both halves
   look fine on their own. */
{
  const win = {};
  new Function('window', readFileSync(join(web, 'letter-clips.js'), 'utf8'))(win);
  new Function('window', readFileSync(join(web, 'content.js'), 'utf8'))(win);
  const C = win.CONTENT;
  const wrong = [];
  for (const [key, clip] of Object.entries(win.LETTER_CLIPS || {})) {
    const card = C && C.sound(key);
    if (!card) continue;                       // a clip for something not on a card
    if (clip.from.charAt(0) === '/' && clip.from !== card.ipa) {
      wrong.push(key + ': card says ' + card.ipa + ', clip is labelled ' + clip.from);
    }
  }
  if (wrong.length) {
    console.error('\n' + wrong.length + ' letter clip(s) disagree with their card:');
    wrong.forEach((w) => console.error('  ' + w));
    console.error('\nRun: python3 tools/make-letter-audio.py\n');
    process.exit(1);
  }
}

/* --------------------------------------------------------------- version
   A hash of everything shipped. It names the service worker's cache, and it
   is stamped onto every script and audio URL.

   The stamp is what makes a deploy arrive. Without it the page was fetched
   network-first and was therefore new, but it asked for `app.js`, and the old
   service worker — still in charge on that first load — answered from its own
   cache with the old one. Measured: a new build took three reloads to show up.
   For a tablet that gets opened once a day, a fix could sit unseen for days.
   `app.js?v=<hash>` is not in the old cache, so it falls through to the
   network and the very first load is the new build.

   Hashing page.html rather than index.html keeps this from chasing its tail:
   index.html is generated from page.html and contains the version. */
const body = readFileSync(join(web, 'page.html'), 'utf8');

const hash = createHash('sha1');
for (const f of ['page.html', ...SCRIPTS, ...STATIC, ...AUDIO]) {
  const p = join(web, f);
  if (existsSync(p)) hash.update(readFileSync(p));
  else console.warn('  ! missing ' + f);
}
const version = hash.digest('hex').slice(0, 10);
const stamp = (f) => f + '?v=' + version;

const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">
<meta name="theme-color" content="#FFF6E9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#17151F" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Phonics">
<meta name="description" content="Phonics for a four-year-old: one letter a day, with its real sound, its mouth shape, and the four words it lives in.">
<meta name="robots" content="noindex">
<meta name="build" content="${BUILD}">
<script>window.ASSET_V = '${version}'; window.BUILD = '${BUILD}';</script>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<style>
  html, body { min-height: 100%; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
`;

const splitAt = body.indexOf('<div id="app">');
const inHead = body.slice(0, splitAt);
let inBody = body.slice(splitAt);
for (const f of SCRIPTS) {
  if (!inBody.includes('src="' + f + '"')) throw new Error('page.html does not load ' + f);
  inBody = inBody.replace('src="' + f + '"', 'src="' + stamp(f) + '"');
}

const register = `<script>
  var secure = location.protocol === 'https:' || ['localhost', '127.0.0.1'].indexOf(location.hostname) >= 0;
    if ('serviceWorker' in navigator && secure && window.top === window.self) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support unavailable */ });
    });
  }
</script>`;

writeFileSync(join(web, 'index.html'),
  head + inHead + '</head>\n<body>\n' + inBody + '\n' + register + '\n</body>\n</html>\n');
console.log('wrote web/index.html  (build ' + BUILD + ')');


writeFileSync(join(web, 'sw.js'), `/* GENERATED by tools/build.mjs. Do not edit.

   Everything the app needs ships with it — no runtime fetches — so the whole
   thing works in aeroplane mode once installed. The cache name carries a hash
   of every shipped file, so a new deploy is a new cache: install, then drop
   the old one. Without that, a returning child gets yesterday's build for ever.
*/
var CACHE = 'pip-phonics-${version}';
var ASSETS = ${JSON.stringify([
  './', 'index.html',
  ...SCRIPTS.map(stamp), ...STATIC, ...AUDIO.map(stamp)
].map((f) => (f === './' ? f : './' + f)), null, 2)};

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* The page itself goes network-first so a deploy is picked up on the next
   online load; everything else is cache-first because it is versioned with
   the cache name. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  var isPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isPage) {
    e.respondWith(
      fetch(e.request)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (hit) { return hit || caches.match('./'); });
        })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      });
    })
  );
});
`);
console.log('wrote web/sw.js  (cache pip-phonics-' + version + ')');
