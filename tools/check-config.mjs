/* Checks vercel.json before it can reach Vercel.

   Why this exists: Vercel validates vercel.json against a strict schema and
   refuses the deployment if it sees a key it does not know — before the build
   runs, so there are no build logs to read. The Production deployment simply
   stays on the last commit that was valid, and the dashboard shows a stale
   commit with no obvious reason.

   That happened here. A `"comment"` key was added inside a headers rule to
   explain a cache-control choice. Vercel rejected the file, three commits in a
   row failed the same way, and Production sat on the commit before them for
   hours looking healthy. Prose about the config belongs in README.md; this
   file may only contain keys Vercel knows.

   The allow-lists below cover the keys this project uses. They are deliberately
   narrower than Vercel's full schema: adding a key here should be a deliberate
   act, done after checking https://vercel.com/docs/project-configuration.

   Run: node tools/check-config.mjs   (tools/build.mjs runs it too) */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const TOP = new Set([
  '$schema', 'buildCommand', 'devCommand', 'installCommand', 'ignoreCommand',
  'outputDirectory', 'framework', 'cleanUrls', 'trailingSlash', 'public',
  'regions', 'headers', 'redirects', 'rewrites', 'crons', 'functions', 'git'
]);
const RULE = new Set(['source', 'headers', 'has', 'missing']);
const HEADER = new Set(['key', 'value']);

export function checkVercelJson(path = join(root, 'vercel.json')) {
  const problems = [];
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    return ['vercel.json is not valid JSON: ' + e.message];
  }

  for (const k of Object.keys(cfg)) {
    if (!TOP.has(k)) problems.push(`unknown top-level key ${JSON.stringify(k)}`);
  }
  (cfg.headers || []).forEach((rule, i) => {
    for (const k of Object.keys(rule)) {
      if (!RULE.has(k)) problems.push(`headers[${i}]: unknown key ${JSON.stringify(k)}`);
    }
    if (typeof rule.source !== 'string') problems.push(`headers[${i}]: needs a "source" string`);
    if (!Array.isArray(rule.headers)) {
      problems.push(`headers[${i}]: needs a "headers" array`);
      return;
    }
    rule.headers.forEach((h, j) => {
      for (const k of Object.keys(h)) {
        if (!HEADER.has(k)) problems.push(`headers[${i}].headers[${j}]: unknown key ${JSON.stringify(k)}`);
      }
      if (typeof h.key !== 'string' || typeof h.value !== 'string') {
        problems.push(`headers[${i}].headers[${j}]: needs string "key" and "value"`);
      }
    });
  });

  if (cfg.buildCommand && !cfg.outputDirectory) {
    problems.push('buildCommand is set but outputDirectory is not — Vercel would not know what to serve');
  }
  return problems;
}

if (process.argv[1] && process.argv[1].endsWith('check-config.mjs')) {
  const problems = checkVercelJson();
  if (problems.length) {
    console.error('vercel.json would be rejected by Vercel:');
    problems.forEach((p) => console.error('  ' + p));
    console.error('\nVercel refuses the deployment before the build runs, so there are');
    console.error('no logs — Production just stays on the last commit that was valid.');
    process.exit(1);
  }
  console.log('vercel.json ok');
}
