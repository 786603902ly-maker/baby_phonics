# baby_phonics — Rourou's Phonics Trail

A phonics tool for a four-year-old in Singapore, built around the book she
already uses: **Oxford Phonics World Level 1**.

The loop is the one that holds her attention: **hear a word → look at
pictures → tap → hear how it went.** No written navigation, because she
cannot read yet.

- **Plan:** [docs/PLAN.md](docs/PLAN.md) — read the Revision 2 note at the top first
- **App source:** [`web/`](web/)

## What is built

| Level | Age | Stops | What it is |
|---|---|---|---|
| 1 · Look and Listen | from 3 | 8 | Vocabulary only. Hear a word, find the picture. Memory pairs. No letters. |
| 2 · The Alphabet | from 4 | 26 + 4 reviews | A–Z. Each stop is her OPW card, made interactive. |
| 3 · Reading Words | from 5 | — | Blending. Visible on the map, not built. |
| 4 · Reading Books | from 6 | — | Sentences and stories. Visible, not built. |

### How each letter sounds

Browser speech synthesis cannot say a bare letter sound — ask it for /k/ and
it says "kuh", ask it for the vowel in *cat* and it gives you /ɑː/, the vowel
in *car*. Both teach the wrong thing.

So the 26 sounds are **not** spoken by the browser. `tools/make-phonemes.py`
drives espeak-ng from phoneme symbols (`[[k]]`, `[[a]]`), producing the exact
phoneme, and bakes the clips into `web/phonemes.js` as data: URIs. No network,
no API key, works offline. Regenerate with:

```sh
apt-get install -y espeak-ng && python3 tools/make-phonemes.py
```

Voiced stops (b, d, g, j) make no sound at all in isolation — that is a fact
about speech, not a bug — so those are synthesised with a following schwa and
cut the instant the vowel starts, leaving the release burst alone.

Each letter card also shows:

- its **IPA** in British English, Oxford Learner's Dictionaries convention
  (`a` → /æ/, `e` → /e/, `o` → /ɒ/, `u` → /ʌ/)
- a **mouth picture**, front view, the way a mirror shows it
- one line on **how to make the sound**
- the letter's **other job** where it has one — c says /s/ before e, i, y;
  g often says /dʒ/; s says /z/ at the end of many words; every vowel has its
  name sound

Each alphabet stop runs four games:

1. **Meet the letter** — big `Aa`, the Phonics Friend, four keyword
   pictures. Tap any one to hear *a … apple*. First letter in red, like
   the paper card.
2. **Which one starts with a?** — three pictures, one right.
3. **Find the letter** — hear the sound, pick from three letters.
4. **Which letter is missing?** — a picture and its word with one letter
   blanked out, three letters to choose from.

`x` is handled correctly: its words end with the sound, so its round asks
"which one *ends* with x".

## Game mode

**Mix it up** — on the welcome screen and at the top of the alphabet map.
Every letter she has already finished, jumbled together: find the letter,
which one starts with it, which letter is missing, and a memory round. The
round types interleave so it never feels like a drill.

## Rewards

- Score chip counts up during a stop.
- End of stop: 1–3 stars by accuracy, plus the running total.
- The map shows stars on every stop.
- **My Book** shows all 26 letters and 8 themes with the stars earned.

## Running it

```sh
cd web && python3 -m http.server 8000   # http://localhost:8000
```

Works offline after the first load. On an iPad: open in Safari, Share →
**Add to Home Screen**. It then launches full-screen with no browser
chrome, which is what a four-year-old should see.

## Editing content

`web/content.js` is the whole curriculum — keyword sets, themes, lessons.
`web/icons.js` and `web/icons-words.js` hold all 155 pictures as inline
SVG: no image files, nothing to break offline.

After editing `web/page.html`, regenerate the standalone page:

```sh
node tools/build.mjs      # web/page.html -> web/index.html
```

`web/page.html` is the source (body-only, also publishable as a Claude
Artifact); `web/index.html` is generated — do not edit it by hand.

## Grown-ups

Press and hold the gear on the welcome screen for two seconds.

- **Progress** — mastery map per letter, the five weakest items with what
  to practise off-screen, and every turn played.
- **Pictures** — replace any drawing with a real photo from the phone. A
  photo of the actual cup in your kitchen beats any drawing. Stored on the
  device, never uploaded.
- **Voice** — the 26 built-in clips are already phonetically correct;
  recording is optional and only worth doing for a sound she keeps
  mishearing.
- **Settings** — her name, her photo (stored on the device only, never
  uploaded), session cap, speaking speed, backup, reset.

## Where the word lists come from

Confirmed against Rourou's own cards: **a, b, g, h**. The rest come from
published OPW 1 unit lists. A few words could not be drawn clearly as a
simple picture and were swapped for another word with the same starting
sound — those carry `sub: true` in `content.js`:

| Letter | Book | Here |
|---|---|---|
| t | teacher | tomato |
| u | up, uncle, umpire | up, unicorn, ukulele |
| v | vet | volcano |

Everything else matches.
