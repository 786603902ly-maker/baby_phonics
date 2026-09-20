# baby_phonics — Phonics Trail

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
| 3 · Reading Words | from 5 | 14 | Blending. One short vowel at a time, then ck / sh / ch / th / ng, then blends, then magic e. |
| 4 · Reading Books | from 6 | 7 | Decodable sentences to build, and three short stories with comprehension questions. |
| 5 · Same Sound, New Look | from 6 | — | ai / ay / a-e, ee / ea, oa / ow. Scheme only. |
| 6 · Longer Words | from 6 | — | Two syllables, -ing / -ed / -er, soft c and g. Scheme only. |
| 7 · Real Books | from 7 | — | Whole books, and spelling from dictation. Scheme only. |

### Level 3 games

- **Sound It Out** — one tile per sound; tap each, then push them together and
  the word blends and reveals its picture. `ck`, `sh`, `ch`, `th` and `ng` are
  one tile each, because they are one sound.
- **Build the Word** — a picture, empty slots and letter tiles. Tap to place;
  no dragging, which a four-year-old's finger cannot do reliably.
- **Read the Word** — a written word, three pictures. This is real reading.
- **Which Word Says It** — the same in reverse.
- **Magic e** — the quiet e at the end, shown in red.

### Level 4 games

- **Put the Words in Order** — word cards to build a sentence, which is then
  read back.
- **Read and Choose** — a sentence, three pictures.
- **Stories** — five pages each, one sentence and one picture per page, every
  word tappable to hear it, then two comprehension questions.

### Free play

**Games** on the welcome screen opens a hub of ten games, each playable on its
own with whatever content she has met. Nothing in the app is locked or has to
be done in order — the daily letter is a suggestion, not a gate.

### How each letter sounds

Browser speech synthesis cannot say a bare letter sound — ask it for /k/ and
it says "kuh", ask it for the vowel in *cat* and it gives you /ɑː/, the vowel
in *car*. Both teach the wrong thing.

So the letter sounds are **not** spoken by the browser. 28 of the 32 are
**recordings of a reading teacher saying each sound on its own** — no carrier
word, no synthesiser, nothing cut out of anything. They are in
`audio-src/letters/`, and `tools/make-letter-audio.py` only trims, levels and
lengths them. The other four — **sh ch th ng** — have no recording and are
still synthesised, the long way described below.

A recording does in one take what three rounds of work could not argue out of
a model. /z/ is the clearest case: it has to be frication *and* a pitch at the
same time, and the neural voice never produced both together at any speed from
any carrier, so what shipped was gated on voicing alone. The recorded /z/ is
86% below 1 kHz at periodicity 0.75 **and** carries frication above 3 kHz. The
same for /v/, /f/, /l/ and /m/, each of which had to be argued for.

What is done to a recording, and why each step is small:

- **Trim** the silence either side, level it to the same peak as every other
  clip, and fade 8 ms in and 35 ms out so there is no click.
- **Length.** A teacher demonstrating /w/ holds it for 1.19 s, which is right
  in front of a class and wrong on a card that then says four words. Anything
  over 700 ms comes down to 700; the unhurried first reading is 1.35× longer
  again, up to 950 ms.
- **Nothing else.** In particular no splicing. Taking a slice out of the middle
  of a held sound and crossfading the join is free in principle and expensive
  in fact — the two sides meet at whatever phase they are at, and the
  cancellation is measurable: spliced that way /l/ fell from 0.86 periodicity
  to 0.65 and /w/ from 0.86 to 0.78. Length goes through a pitch-preserving
  time stretcher instead, and **the stretch is thrown away if it moves the
  sound**: more than 0.08 of total movement between the two power bands, or
  more than 0.12 of voicing lost, and the recording ships at its own length.
  That guard fires on /æ/ (the stretch pulled it from 63% below 1 kHz to 51%,
  which is a different vowel), on /f/, and on /z/'s slow take.

Two keys have no recording and need none: **ck** is /k/ and never anything
else, and **wh** is /w/ in this accent, so each reuses the letter it sounds
like.

Every recording is still measured, and the build fails if one is wrong:
length, loudness, where its power sits, and voicing. The test that would
actually catch a shuffled file is the **five voiced/voiceless pairs** — f/v,
s/z, t/d, p/b, k/g are the same mouth, and the only thing telling each pair
apart is whether the voice is running. Measured: 0.14/0.85, 0.15/0.67,
0.13/0.81, 0.37/0.67, 0.26/0.80.

**Grown-ups → Voice** says which route each letter took, and the build refuses
to ship a clip whose label disagrees with the IPA printed on its card.

#### The four that are still synthesised

sh, ch, th and ng are cut out of a carrier word spoken by a Piper VITS voice
(`en_GB-cori-medium`, trained on public-domain LibriVox recordings). The tool
asks the model for its own phoneme/audio alignment, refines the boundary
against the audio, and shapes what it finds: continuants are held for about a
quarter of a second, stops keep the burst and 75 ms of the vowel after it.

The decisive measurement is **where the sound puts its power** — the fraction
below 1 kHz and the fraction above 3 kHz. A spectral centroid is magnitude
weighted, so a whisper of high-frequency noise drags it upwards and a clean
nasal can read as bright; power in bands does not do that.

Two other checks matter here and are worth keeping written down, because both
were found by a four-year-old before they were found by a measurement:

- **Repeats.** A phoneme is only as long as the model makes it, and where a
  word starts this voice gives /f/ forty milliseconds. The first version
  reached the target length by laying that fragment end to end — /θ/ was 7.4
  copies of 40 ms — and a child hears that as a wobble. Length now comes from
  the model, by searching over how slowly to speak the carrier; more than 1.55
  copies fails the build.
- **Drift.** How far the spectrum moves between the start of the clip and its
  end. A held phoneme should stay where it is. The /m/ of *mat* slid into the
  /æ/ after it and finished three times brighter than it started, which is why
  f, l, m, n, r, s, v and z once sounded like the letters' names.

### Why not download the official IPA recordings?

This was argued the wrong way round here once, so both halves are worth
keeping.

**The IPA charts are not it.** The recordings on the IPA charts and on
Wikipedia are demonstrations of a *symbol*, not isolated sounds. Decoded and
measured, Wikipedia's `Bilabial_nasal_m` is two vowel-centred syllables of
~600 and ~730 ms — [ma ma], not /m/; `Voiced_alveolar_plosive_d` is three
chunks, a vowel either side of the stop. Played to a child as "the sound m
makes", they say *ma-ma*.

**A phonics teaching set is.** Recordings made to teach the sounds are a
different object: one sound per file, nothing around it. Measured, each of the
26 used here is a single burst of energy between silences — 140 ms for /p/,
1187 ms for a held /w/ — and every one lands on the right side of its
voiced/voiceless pair. Deciding against the first kind was right; carrying
that decision over to the second kind was not, and it cost three rounds.

64 clips, 284 KB, shipped as `web/audio/letters/<key>.mp3` and
`<key>-slow.mp3` and precached by the service worker, so the app still works
with no network.

Regenerate with:

```sh
pip install lameenc numpy imageio-ffmpeg      # the recorded route
pip install piper-tts onnx                    # only for sh, ch, th, ng
python3 tools/make-letter-audio.py            # add --dry-run to measure only
```

The voice model (67 MB) downloads into `build/` on first run and is not
committed. Synthesis is seeded, so the same command produces the same bytes.

### Everything else it says

The letter sounds were the loud problem; the quieter one was that the app spoke
in whatever voices the device happened to have. "apple" in one voice and "Well
done!" in another, in the same breath, and a different pair on every phone —
and a phone with no British English voice reads *ax* and *durian* accordingly.

So all of it is recorded too, in one British neural voice (the same one the
four synthesised letter clips come from):
**272 clips, 148 seconds, 970 KB** — every keyword and sight word, every letter
name, every sentence and story page, and every line of instruction and praise.
`tools/make-speech-audio.py` generates them; the text comes from
`tools/speech-texts.mjs`, which reads `content.js` and the `A.say()` literals in
`app.js` rather than a list kept by hand, so a new line of encouragement cannot
quietly miss its clip.

A single short word is out of distribution for a voice trained on read
sentences — ask this one for "and" alone and it produces five seconds of
mumbling, ask it for "to" and it produces eighty milliseconds — so each word is
spoken inside a frame (*The word is ____.*) and cut back out at the word
boundary the model reports. The model samples noise, so a bad draw is retried
rather than shipped: up to six takes, keeping the first that measures like real
speech.

Only text the app cannot know in advance — a greeting with the child's name in
it — still goes to the device voice.

```sh
python3 tools/make-speech-audio.py            # --dry-run to measure only
python3 tools/make-speech-audio.py --show-phonemes   # check the odd words
```

`--show-phonemes` prints what espeak makes of each word, which is how the
awkward ones were checked: *ax* /aks/, *yacht* /jɒt/, *durian* /djʊəriən/,
*tomato* /təmɑːtəʊ/, *zebra* /zɛbrə/ — British throughout.

One word needed deciding rather than checking. Asked for `a` on its own, espeak
gives the letter name /eɪ/, which is not wrong but is not the word: in *A cat
sat on a mat* the article is /ə/. In fluent speech that /ə/ is squeezed down to
about seventy milliseconds, too short to cut out and hand to a child as a word,
so it is taken from somewhere the same sound is unhurried — the end of *banana*
— and held to a fifth of a second.

The build is reproducible: the same command produces the same 272 files. That
comes from seeding the model before its session is created; each take is then
reseeded from its own text and attempt number, which is what makes a retry draw
something different rather than repeating itself. Reseeding does not isolate a
clip from the ones before it — the session's state advances with every
inference — so changing one word does change the bytes of the words after it,
without changing whether they pass their checks.

### What the letter card says

Opening a letter card plays the sound **once**, slowly, and then the four
words, each as its sound and then the word: /f/ — *fish*, /f/ — *fan*.

**With a beat between every one.** The five sounds used to run back to back
with no silence at all, which a four-year-old hears as one hurried stream —
she has not finished the first before the second arrives, and there is nowhere
to try it herself. Each is now followed by a pause of 40% of its own length:
proportional, because /m/ is a quarter of a second and *alligator* is nearly a
whole one, and a fixed gap that suits one crowds the other. The card takes
about 5.4 s instead of 4.1 s. **Grown-ups → Settings** moves it — the same
control as the pause between questions, at 28% / 40% / 60%. It used
to open with the letter's name and then the sound twice, which is three things
before the first word; and for f, l, m, n, r, s, v and z the name contains the
sound (*ef*, *el*, *em*, *en*, *ar*, *es*, *vee*, *zed*), so leading with the
name taught the name. The name is still there — it is what tapping the big
letter plays — it is just not what the card opens with.

### How the app paces itself

A question never appears while the last one is still speaking. Answering used
to start a fixed 950 ms timer, which was shorter than the praise and the word
that follow a correct tap — so the next question went up on screen while the
previous answer was still being said, and it sounded as though the app had
asked one thing and then said another. Now the runner waits for the audio
queue to drain, then holds a deliberate pause on top (0.5 / 0.8 / 1.3 s,
**Grown-ups → Settings**). Changing screen cuts whatever is playing, including
the rest of a sequence that had not started yet — a child who has tapped Back
has stopped listening.

**Back goes back one question**, not out of the lesson: she is usually trying
to hear a word again, and landing on the welcome screen instead is no use.
Only from the first screen of a lesson does Back leave. A question answered
before is not scored twice on the way through again.

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


## Deploying to Vercel

The repo is ready: `vercel.json` sets the build, `tools/dist.mjs` assembles
`dist/`, and the PNG icons and service worker are generated and committed.
There are **no npm dependencies** — the build is one Node script.

### Once, from the Vercel dashboard

1. **vercel.com → Add New → Project → Import** this GitHub repo.
2. Change nothing. `vercel.json` already sets Build Command
   `node tools/dist.mjs`, Output Directory `dist`, and Install Command to a
   no-op. Leave Framework Preset on *Other*.
3. **Deploy.** Roughly ten seconds — there is nothing to install or compile.

Every push to the branch redeploys automatically.

### Or from the terminal

```sh
npm i -g vercel
vercel login
vercel --prod
```

### Then, on the iPad

Open the Vercel URL in Safari → Share → **Add to Home Screen**. On a real
HTTPS origin the service worker registers (it cannot inside the Claude
preview), so from then on it launches full-screen and **works with no
internet at all** — every sound, picture and lesson ships with the page.

### What the config does

| File | Why |
|---|---|
| `vercel.json` | Build and output; `no-cache` on the page, scripts and service worker so a deploy is picked up on the next load; a week of caching on the PNGs; `noindex` and a tight `Permissions-Policy` (microphone allowed for voice recording, everything else off) |
| `tools/build.mjs` | Generates `web/index.html` from `web/page.html`, and generates `web/sw.js` with the real asset list and a cache name hashed from every shipped file — so a new deploy is a new cache and never serves yesterday's build |
| `tools/dist.mjs` | Copies exactly the servable files into `dist/`. `web/page.html` stays behind: it is the artifact body fragment, not a page |
| `tools/make-icons.mjs` | Renders the PNG app icons. Dev-only, needs playwright; the PNGs are committed so a deploy never runs it |
| `tools/make-letter-audio.py` | Builds the 32 letter sounds — 28 from the recordings in `audio-src/letters/`, four by cutting them out of a synthesised word — and checks each one acoustically. Dev-only; the mp3s are committed so a deploy never runs it |
| `tools/make-speech-audio.py` | Records every word, sentence and line of praise in the same voice. Dev-only, same model; the mp3s are committed |
| `tools/speech-texts.mjs` | Lists what there is to record, read out of `content.js` and the `A.say()` literals in `app.js` |
| `audio-src/letters/` | The 26 recorded letter sounds as supplied, before anything is done to them. Not shipped; see the README in that folder for where they came from |
| `tools/check-config.mjs` | Refuses a `vercel.json` Vercel would reject, which is a failure mode with no logs |
| `tools/serve.mjs` | Serves `dist/` with `vercel.json`'s real headers, which is the only way to test whether a deploy actually reaches an installed app |
| `robots.txt` | Keeps the page out of search results |

### Why a deploy can silently not happen

Vercel validates `vercel.json` against a strict schema and refuses the
deployment **before the build starts** if it finds a key it does not know.
There are no build logs, because there was no build; the Production card simply
keeps showing the last commit that was valid, looking healthy.

That happened here. A `"comment"` key was added inside a headers rule to explain
a cache-control choice — Vercel rejected the file, the next three commits failed
the same way, and Production sat on the commit before them for hours. **Prose
about the configuration belongs in this README, never in `vercel.json`.**

### Why a new deploy can take three reloads to arrive

The service worker serves everything but the page from its cache. On the first
load after a deploy the page itself is new — it is fetched network-first — but
it asks for `app.js`, and the *old* service worker, still in charge for that
load, answers from its own cache with the old one. The new worker installs
during that load and takes over afterwards. Measured against Vercel's real
headers: **a new build took three reloads to appear**. On a tablet opened once
a day, a fix can sit unseen for days and look exactly like a deploy that never
happened.

Every script and audio URL now carries the build's hash — `app.js?v=502797a129`.
The old cache has never seen that URL, so it falls through to the network, and
the first load after a deploy is the new build. Re-measured: one reload.

`node tools/serve.mjs` serves `dist/` with the headers from `vercel.json`,
which is the only way to test this locally — a generic static server sends its
own cache headers and quietly invalidates the experiment.

Two guards now stand in the way of a repeat:

- `node tools/check-config.mjs` validates `vercel.json` against the keys Vercel
  accepts, and `tools/build.mjs` refuses to run if it fails — so a config that
  cannot deploy cannot be built either.
- `.github/workflows/preflight.yml` runs the same checks on every push, plus
  Vercel's own build command, a check that every clip the page asks for is in
  `dist/`, a check that the service worker precaches everything shipped, and a
  check that every script and clip is precached under its versioned URL.
  A deployment that cannot land now shows as a red cross on the commit.

And to see what is actually live: **Grown-ups → Settings** shows the commit the
running copy was built from (`dev` when served locally). If it does not match
what you pushed, the deploy did not land.

### A note on privacy

**No child's name is in the source.** The welcome screen says just "Hi!"
until a name is typed in **Grown-ups → Settings**, and that lives in the
browser's local storage on that one device — never in the repo, never on the
server. The photo and any voice recordings are the same: stored on the
device, never uploaded.

A Vercel Hobby URL is public to anyone who has it, though `noindex` and
`robots.txt` keep it out of search. If you want it behind a password, that
is Vercel's Deployment Protection, which is a paid feature.

### Backup after deploying

The "back up to your Claude account" button only works on the Claude preview
link. On your own site use **Grown-ups → Settings → Save to a file**, which
writes a small `.json` you can keep anywhere and load on another device.

## Local development

```sh
npm start                 # builds, then serves web/ on http://localhost:8000
node tools/serve.mjs      # serves dist/ with vercel.json's headers — the only
                          # way to test service-worker updates truthfully
node tools/build.mjs      # regenerate index.html + sw.js after editing page.html
node tools/dist.mjs       # assemble dist/ exactly as Vercel will
```

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
- **Voice** — every letter and letter team, and where its clip came from:
  *recorded* for the 28 that are a teacher saying the sound on its own,
  *synthesised* for sh, ch, th and ng. Tap ▶ to hear any of them. Recording
  over one in your own voice is optional and only worth doing for a sound she
  keeps mishearing. The words, sentences and stories are the same voice and
  also ship with the app.
- **Sounds** — all 44 phonemes of English, which is the answer to "is that
  all of them?" after a few weeks of letter cards. It is not: English has
  about 44 sounds and 26 letters to spell them with, which is why reading it
  is harder than reading Hindi or Spanish — `a` alone is four different
  sounds in *cat*, *cake*, *car* and *was*. The page lists all 44 with an
  example word, plays the 27 the app teaches, and greys out the 17 it does
  not (the long vowels, the diphthongs, /ʊ/, /ð/ and /ʒ/). Those come after
  single letters and two-letter teams, which is where the app stops.
- **Settings** — her name, her photo (stored on the device only, never
  uploaded), session cap, speaking speed, the pause between questions,
  backup, reset.

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
