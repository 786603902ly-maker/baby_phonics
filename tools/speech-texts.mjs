/* Lists every fixed piece of English the app says out loud, so
   tools/make-speech-audio.py can record all of it in one voice.

   Three sources, none of them a hand-kept list that could drift:
     · web/content.js — words, sight words, sentences, story pages, questions
     · web/app.js     — the string literals handed to A.say()
     · the alphabet   — each letter's NAME ("ay", "bee"), which the letter card
                        says before the sound

   Anything not listed here (a greeting with the child's name in it) still
   falls back to the device voice at runtime.

   Run: node tools/speech-texts.mjs > build/speech.json */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const web = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');

/* content.js only touches `window`, so a bare object is enough of a browser */
const window = {};
new Function('window', readFileSync(join(web, 'content.js'), 'utf8'))(window);
const C = window.CONTENT;

const words = new Set();
const lines = new Set();

Object.keys(C.WORDS).forEach((k) => words.add(C.WORDS[k].text));
C.SIGHT.forEach((w) => words.add(w));
C.SENTENCES.forEach((s) => lines.add(s.text));
C.STORIES.forEach((st) => {
  lines.add(st.title);
  st.pages.forEach((p) => {
    lines.add(p.text);
    /* every word in a story is tappable, and tapping speaks it on its own */
    p.text.split(/\s+/).forEach((w) => {
      const bare = w.replace(/[^A-Za-z']/g, '');
      if (bare) words.add(bare.toLowerCase());
    });
  });
  st.questions.forEach((q) => lines.add(q.q));
});
C.SENTENCES.forEach((s) => s.text.replace(/[.!?]$/, '').split(' ').forEach((w) => words.add(w)));

/* the letter names, said before the sound on the letter card */
const names = {};
C.LETTERS.forEach((l) => { names[l] = l === 'q' ? 'queue' : l.toUpperCase(); });

/* whatever app.js hands to A.say() — read out of the source rather than
   copied, so a new line of encouragement cannot silently miss its clip */
const app = readFileSync(join(web, 'app.js'), 'utf8');
for (const call of app.matchAll(/A\.say\(([\s\S]{0,400}?)\)\s*[;,.]/g)) {
  for (const lit of call[1].matchAll(/'([^'\\]{2,})'/g)) {
    const t = lit[1];
    /* fragments of a concatenation ("Let us do " + name) are not fixed text */
    if (/[a-z]/i.test(t) && !/[<>{}]/.test(t) && !/ $/.test(t) && !/S\.name/.test(call[1].slice(0, lit.index))) {
      lines.add(t);
    }
  }
}

console.log(JSON.stringify({
  words: [...words].sort(),
  lines: [...lines].sort(),
  names
}, null, 1));
