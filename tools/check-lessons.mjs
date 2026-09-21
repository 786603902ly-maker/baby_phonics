/* Deals every lesson in the app and checks the hand.

   Every activity of every stop goes through its real generator with the real
   content, and every round that comes back is checked against what the
   renderer for its kind will do with it: the options are options, exactly one
   of them is right, a picture option names a word that HAS a picture, a
   sound-out word has a breakdown and every sound in it has a clip, the build
   tiles contain the answer, the sort answer is inside the range of the boxes.
   Then every round's play() is called against a stub that fails on a phoneme
   with no audio behind it.

   This exists because all of those are data, and data goes wrong quietly. A
   word added to a word list with no picture drawn for it is a blank square in
   front of a child, at the moment she is being asked to choose; a vowel team
   in a breakdown with no clip is silence where a sound should be. Neither
   shows up in a syntax check and neither throws.

   The generators shuffle and sample, so one pass does not see every path.
   `--runs N` deals N times; CI deals 25.

   Run: node tools/check-lessons.mjs [--runs N] */
import { readFileSync } from 'node:fs';

const win = {};
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');
for (const f of ['icons.js', 'icons-words.js', 'icons-more.js', 'mouths.js', 'content.js', 'letter-clips.js'])
  new Function('window', readFileSync(join(web, f), 'utf8'))(win);
const C = win.CONTENT, ICONS = win.ICONS, CLIPS = win.LETTER_CLIPS;

/* a stand-in for audio.js and the DOM: the generators only call A.say* inside
   closures they hand back, so calling those is how we check them too */
const said = [];
const A = {
  say: (t) => { said.push(String(t)); return P; },
  sayWord: (t) => { said.push(String(t)); return P; },
  sayPhoneme: (k) => { if (!CLIPS[k]) fail('no clip for phoneme ' + k); return P; },
  sayLetterName: () => P, blobURL: () => P, unlock: () => {}, sfx: () => {},
  init: () => P, voices: () => [], have: {},
  gap: () => P, wait: () => P, idle: () => P, epoch: () => 1, stop: () => {}
};
const P = { then: (f) => { try { f(); } catch (e) {} return P; } };

const problems = [];
function fail(m) { problems.push(m); }

/* pull the GEN table out of app.js by running it with a minimal window */
const app = readFileSync(join(web, 'app.js'), 'utf8');
globalThis.window = { CONTENT: C, AUDIO: A, svgIcon: (n) => { if (n && !ICONS[n]) fail('missing icon ' + n); return ''; },
  MOUTHS: win.MOUTHS, mouthSvg: () => '', addEventListener: () => {}, scrollTo: () => {},
  matchMedia: () => ({ matches: false, addEventListener() {} }), BUILD: 'test',
  requestAnimationFrame: () => {}, setTimeout: () => 0, indexedDB: null };
globalThis.requestAnimationFrame = () => {};
globalThis.document = { getElementById: () => null, querySelectorAll: () => [], querySelector: () => null,
  addEventListener: () => {}, documentElement: { style: {} },
  createElement: () => ({ style: {}, classList: { add() {}, remove() {} } }) };
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
globalThis.GEN_OUT = null;
new Function('window', 'document', 'localStorage', 'GEN_TAP',
  app.replace('  A.rate = S.settings.rate;',
    '  GEN_TAP(GEN, [gameLesson()].concat(FREEGAMES.map(function (g) {\n' +
    '    return { id: "free-" + g.id, level: g.level, game: true, free: true,\n' +
    '      name: g.name, shortName: g.name, icon: g.icon, activities: g.make() };\n' +
    '  }))); return;'))
  (globalThis.window, globalThis.document, globalThis.localStorage,
   (g, x) => { globalThis.GEN_OUT = g; globalThis.EXTRA_LESSONS = x; });
const GEN = globalThis.GEN_OUT;
if (!GEN) { console.error('could not reach GEN in app.js'); process.exit(1); }

const RUNS = Math.max(1, +((process.argv.find((a) => a.startsWith('--runs=')) || '').split('=')[1]) || 1);

const KINDS = new Set(['pick', 'memory', 'meet', 'missing', 'soundout', 'build', 'magice',
  'sentence', 'page', 'sort', 'beats', 'join', 'meetend', 'addend', 'meetsoft', 'spell']);

/* The free games and Mix it up are lessons too — built at run time out of
   whatever she has met, which is exactly where a bad word list hides. They
   are reached through the same GEN table, so they go through the same
   checks; app.js hands them over next to GEN. */
const extra = (globalThis.EXTRA_LESSONS || []);

let rounds = 0;
for (let run = 0; run < RUNS; run++)
for (const lesson of C.LESSONS.concat(extra)) {
  if (!lesson.activities.length) fail(lesson.id + ': no activities');
  for (const act of lesson.activities) {
    if (!GEN[act.type]) { fail(lesson.id + ': no generator for ' + act.type); continue; }
    let out;
    try { out = GEN[act.type](act, lesson); }
    catch (e) { fail(lesson.id + '/' + act.type + ': threw ' + e.message); continue; }
    if (!out.length) fail(lesson.id + '/' + act.type + ': produced no rounds');
    for (const r of out) {
      rounds++;
      if (!KINDS.has(r.kind)) fail(lesson.id + '/' + act.type + ': unknown kind ' + r.kind);
      if (r.options && r.kind === 'pick') {
        /* Three, never two: a two-choice round is a coin flip, and a child
           who guesses right half the time learns that guessing works. */
        if (r.options.length !== 3) fail(lesson.id + '/' + act.type + ': ' + r.options.length + ' options, want 3');
        if (r.options.filter((o) => o.correct).length !== 1)
          fail(lesson.id + '/' + act.type + ': not exactly one correct option');
        for (const o of r.options) {
          if (o.kind === 'pic') {
            const w = C.WORDS[o.word];
            if (!w) fail(lesson.id + ': picture option for unknown word ' + o.word);
            else if (!w.icon || w.noPic) fail(lesson.id + ': picture option for a word with no picture: ' + o.word);
          }
          if (o.kind === 'word' && !C.WORDS[o.word]) fail(lesson.id + ': word option for unknown word ' + o.word);
        }
      }
      if (r.word && !C.WORDS[r.word] && r.kind !== 'sort') fail(lesson.id + ': round word not in WORDS: ' + r.word);
      if (r.kind === 'soundout' || r.kind === 'build') {
        const w = C.WORDS[r.word];
        if (!w || !w.ph) fail(lesson.id + ': ' + r.kind + ' on a word with no sounds: ' + r.word);
        else w.ph.forEach((p) => { if (!CLIPS[p]) fail(lesson.id + ': ' + r.word + ' uses phoneme ' + p + ' with no clip'); });
      }
      if (r.kind === 'build' && r.tiles) {
        C.WORDS[r.word].ph.forEach((p) => {
          if (r.tiles.indexOf(p) < 0) fail(lesson.id + ': build tiles for ' + r.word + ' do not contain ' + p);
        });
      }
      if (r.kind === 'spell' && r.tiles) {
        C.WORDS[r.word].text.split('').forEach((ch) => {
          if (r.tiles.indexOf(ch) < 0) fail(lesson.id + ': spell tiles for ' + r.word + ' do not contain ' + ch);
        });
      }
      if (r.kind === 'sort') {
        if (!(r.correct >= 0 && r.correct < r.boxes.length)) fail(lesson.id + ': sort answer out of range');
        if (!C.WORDS[r.word]) fail(lesson.id + ': sort on unknown word ' + r.word);
      }
      if (r.kind === 'join') {
        r.parts.forEach((p) => { if (r.bank.indexOf(p) < 0) fail(lesson.id + ': join bank missing ' + p); });
      }
      if (r.kind === 'beats' && !(r.n >= 1 && r.n <= 3)) fail(lesson.id + ': beats out of range');
      if (r.kind === 'meet' && !C.sound(r.letter)) fail(lesson.id + ': meet card for unknown sound ' + r.letter);
      if (r.play) { try { r.play(); } catch (e) { fail(lesson.id + '/' + act.type + ': play() threw ' + e.message); } }
    }
  }
}

console.log(C.LESSONS.length + ' stops + ' + extra.length + ' games, dealt ' + RUNS + ' time(s), ' + rounds + ' rounds');
if (problems.length) {
  const uniq = [...new Set(problems)];
  console.error('\n' + uniq.length + ' problem(s):');
  uniq.slice(0, 40).forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('every round is something a renderer can draw');
