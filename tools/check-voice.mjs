/* Every fixed thing the app says has to be sayable in the app's own voice.

   tools/build.mjs already refuses to ship a spoken LINE with no clip behind
   it — but it can only see the lines tools/speech-texts.mjs can find, and
   what that finds is string literals. Hand A.say() a string built by
   concatenation and both of them go quiet: there is no literal to extract,
   no clip to miss, and at run time the text falls through to the device's
   own synthesiser. A second voice, mid-sentence, in whatever accent the
   tablet has.

   That is not hypothetical. `A.say('Today we learn ' + letter + '.')` was
   the first thing the app said in a session, for four months, and because
   the text is different for all 26 letters it could never have had a clip.

   So: an argument to A.say / A.sayWord must be a plain literal, a variable
   (whose value is checked elsewhere — it comes from content.js, which
   speech-texts.mjs reads), or a conditional between literals. A `+` in
   there is refused, and the fix is always the same: say the fixed part with
   A.say and the changing part with A.sayWord / A.sayLetterName / A.sayPhoneme,
   which have clips of their own.

   Run: node tools/check-voice.mjs */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');
const src = readFileSync(join(web, 'app.js'), 'utf8');

/* Walk the argument list of each call, counting brackets, so a nested call
   or a ternary does not end the match early. Strings and regular expressions
   are stepped over whole: `.replace(/[^A-Za-z']/g, '')` has an apostrophe
   inside a character class, and a scanner that reads it as a quote loses
   track of the rest of the file. */
function args(text, from) {
  let depth = 0, out = '', prev = '(';
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') { if (!depth) return out; depth--; }
    else if (c === "'" || c === '"') {
      const q = c; out += c;
      while (++i < text.length && text[i] !== q) { out += text[i]; if (text[i] === '\\') out += text[++i]; }
      out += q; prev = q; continue;
    } else if (c === '/' && '(,=:?&|!+[{'.includes(prev)) {
      out += c;
      let cls = false;
      while (++i < text.length) {
        const d = text[i];
        out += d;
        if (d === '\\') { out += text[++i]; continue; }
        if (d === '[') cls = true;
        else if (d === ']') cls = false;
        else if (d === '/' && !cls) break;
      }
      while (i + 1 < text.length && /[gimsuy]/.test(text[i + 1])) out += text[++i];
      prev = '/';
      continue;
    }
    out += c;
    if (!/\s/.test(c)) prev = c;
  }
  return out;
}

const bad = [];
for (const m of src.matchAll(/A\.(say|sayWord)\(/g)) {
  const a = args(src, m.index + m[0].length);
  /* a `+` outside any string is a concatenation */
  const stripped = a
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/\/(?:\[(?:[^\]\\]|\\.)*\]|[^/\\\n])+\/[gimsuy]*/g, 'RE');
  if (!stripped.includes('+')) continue;
  const line = src.slice(0, m.index).split('\n').length;
  bad.push('web/app.js:' + line + '  A.' + m[1] + '(' + a.trim().replace(/\s+/g, ' ').slice(0, 90) + ')');
}

if (bad.length) {
  console.error('\n' + bad.length + ' spoken string(s) are built by concatenation, so no clip can exist for them');
  console.error('and they will be spoken by the device voice:\n');
  bad.forEach((b) => console.error('  ' + b));
  console.error('\nSay the fixed part with A.say() and the changing part with');
  console.error('A.sayWord(), A.sayLetterName() or A.sayPhoneme().\n');
  process.exit(1);
}
console.log('every spoken string is fixed text with a clip behind it');
