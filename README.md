# baby_phonics — Pip the Otter Phonics

A phonics tool for a four-year-old in Singapore. The loop is the one that
holds her attention: **hear a sound → look at pictures → touch or drag →
hear how it went.** No written navigation, because she cannot read yet.

- **Plan (all 9 stages, age 4 → 7):** [docs/PLAN.md](docs/PLAN.md)
- **App source:** [`web/`](web/)

## What is built

Year 1 — stages 0, 1 and 2. Stages 3–8 are visible on the trail as locked
cards so the whole three-year arc is legible from day one.

| Stage | Lessons | Content |
|---|---|---|
| 0 · Sound Play | 6 | Rhyme, syllable clapping, first sounds, oral blending. No letters. |
| 1 · First Sounds | 11 | All 26 letter sounds, in Jolly Phonics group order |
| 2 · Blending | 5 | CVC words: tap each sound, push them together; build words from tiles |

Ten activity types, all data-driven: Listen & Pick, Rhyme Pick, Syllable
Clap, Oral Blend, Letter Intro, Letter Pick, Pop the Sound, Sort into
Baskets, Tap to Blend, Build the Word, Sight Word.

## Running it

```sh
cd web && python3 -m http.server 8000   # then open http://localhost:8000
```

A service worker caches everything, so after the first load it works
offline. On an iPad: open it in Safari, Share → **Add to Home Screen**. It
then launches full-screen with no browser chrome, which is what a
four-year-old should see.

## Editing content

`web/content.js` is the whole curriculum: letters, words, lessons.
Adding a lesson is a data edit. `web/icons.js` holds every picture as
inline SVG — no image files, nothing to break offline.

After editing `web/page.html`, regenerate the standalone page:

```sh
node tools/build.mjs      # web/page.html -> web/index.html
```

`web/page.html` is the source (body-only, also publishable as a Claude
Artifact); `web/index.html` is generated — do not edit it by hand.

## The one thing to do before real use

Speech synthesis cannot say a clean /t/ or /p/ — it adds a "uh", which
teaches a sound that will not blend. Open **Grown-ups → Voice** (press and
hold the gear on the home screen for two seconds) and record the 26 letter
sounds in your own voice. About ten minutes. Recordings are stored on the
device in IndexedDB and take priority over synthesis everywhere.

Accent: the fallback voice prefers British English, because Singapore
English instruction is British-based and the `ar / or / er` vowels differ
audibly from American English.
