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

export function spokenTexts() {

  /* content.js only touches `window`, so a bare object is enough of a browser */
  const window = {};
  new Function('window', readFileSync(join(web, 'content.js'), 'utf8'))(window);
  const C = window.CONTENT;

  const words = new Set();
  const lines = new Set();

  Object.keys(C.WORDS).forEach((k) => words.add(C.WORDS[k].text));
  C.SIGHT.forEach((w) => words.add(w));
  C.SIGHT2.forEach((w) => words.add(w));
  C.SENTENCES.forEach((s) => lines.add(s.text));
  /* Stories (Level 4) and books (Level 7) are the same shape. */
  [...C.STORIES, ...C.BOOKS].forEach((st) => {
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

  /* Level 5: every word in every spelling list is read aloud when it is
     sorted, and most of them have no picture, so they are not reached by the
     WORDS sweep above on their text alone — they are, but only because they
     are IN WORDS. Listing them here as well costs nothing and means a word
     added to a spelling list but forgotten in WORDS fails the build loudly
     rather than falling through to the device voice. */
  C.VOWELKEYS.forEach((t) => {
    C.VOWELTEAMS[t].spells.forEach((sp) => sp.words.forEach((k) => {
      words.add(C.WORDS[k] ? C.WORDS[k].text : k);
    }));
  });

  /* Level 6: the bases, the words they become, and both halves of every
     compound. Each is spoken on its own as she builds it. */
  C.ENDINGS.forEach((e) => e.items.forEach((it) => {
    words.add(C.WORDS[it.base] ? C.WORDS[it.base].text : it.base);
    words.add(C.WORDS[it.made] ? C.WORDS[it.made].text : it.made);
  }));
  C.COMPOUNDS.forEach((c) => {
    words.add(C.WORDS[c.word] ? C.WORDS[c.word].text : c.word);
    c.parts.forEach((k) => words.add(C.WORDS[k] ? C.WORDS[k].text : k));
  });

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

  return { words: [...words].sort(), lines: [...lines].sort(), names };
}

/* The key a clip is filed under, the same reduction audio.js and
   make-speech-audio.py apply. */
export function speechKey(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* Every key the app will ask for. Letter names are filed apart from words: the
   letter A and the word `a` sound alike, but nothing should rest on that. */
export function expectedKeys() {
  const t = spokenTexts();
  return [
    ...t.words.map(speechKey),
    ...t.lines.map(speechKey),
    ...Object.keys(t.names).map((l) => 'letter:' + l)
  ].filter(Boolean);
}

if (process.argv[1] && process.argv[1].endsWith('speech-texts.mjs')) {
  console.log(JSON.stringify(spokenTexts(), null, 1));
}
