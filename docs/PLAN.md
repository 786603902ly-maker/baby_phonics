# Phonics Tool — Product & Curriculum Plan (Age 4 → 7, Singapore)

> ### Revision 4 — Levels 3 and 4 built
>
> **Reading Words** (14 stops) and **Reading Books** (7 stops) are now real,
> which takes the app from "knows her letters" to "reads a short story".
> Five new game types: sound-it-out with one tile per phoneme, build-the-word
> by tapping (never dragging — a four-year-old cannot drag reliably),
> written-word-to-picture, picture-to-written-word, and magic e. Level 4 adds
> sentence building, sentence-to-picture, and three five-page decodable
> stories with comprehension questions.
>
> Digraph clips (sh, ch, th, ng, ck) were added to the generated phoneme
> bundle, so blending `fish` plays three sounds and not four.
>
> Levels 5–7 are on the map as locked cards with their scheme stated, so the
> road to age seven is visible without being built.
>
> **Nothing is sequential.** Every stop on every built level is tappable at any
> time, and a Games hub offers ten of the games on their own. The daily letter
> is a suggestion, not a gate.
>
> ---
>
> ### Revision 3 — after the first week of real use
>
> **The letter sounds are no longer spoken by the browser.** Speech synthesis
> cannot say a bare phoneme: ask it for /k/ and it says "kuh"; ask it for the
> vowel in *cat* and it gives /ɑː/, the vowel in *car*. Both teach a sound that
> is wrong. This supersedes §1.3 and §3.3: the accent decision still stands,
> but the delivery mechanism is bundled audio, not recording.
>
> ### Revision 4 — the letter sounds, again
>
> Revision 3 generated the clips with espeak-ng from phoneme symbols. Correct
> in principle, unusable in practice: the stops came out as bursts with nothing
> after them — /b/ 50 ms, /d/ 80 ms, /k/ 100 ms of which most was silence — and
> on a phone speaker that is a click, not a sound. The first parent report was
> that b, c, d, e and f did not work at all.
>
> `tools/make-letter-audio.py` replaces it. Each sound is cut out of a real word
> spoken by a Piper neural voice (`en_GB-cori-medium`; LibriVox source audio, so
> public domain), using the model's own phoneme/audio alignment, refined against
> the waveform because the duration predictor leaks — it gives the /f/ of *fish*
> 23 ms and charges the rest to the vowel. Stops keep 75 ms of the following
> vowel, because that is what makes them audible without turning them into
> "buh". Every clip is checked against the acoustic signature its phoneme class
> must have (length, level, spectral centroid, periodicity) and the build fails
> if one is off. 32 clips, 83 KB, shipped as mp3 and precached.
>
> ### Revision 5 — one voice for everything
>
> Words were still spoken by the device, which meant two voices in one breath
> ("apple" from the app's recording, "Well done!" from the phone) and a
> different pair on every device — and nothing at all resembling British
> English where the phone has no en-GB voice. Every fixed piece of English is
> now recorded in the same voice: 272 clips, 148 s, 970 KB, covering words,
> sight words, letter names, sentences, story pages, questions, instructions
> and praise. tools/speech-texts.mjs derives the list from content.js and from
> the A.say() literals in app.js, so it cannot drift from what the app says.
>
> One technique worth recording: a single short word is out of distribution for
> a voice trained on read sentences — "and" alone came out as five seconds of
> mumbling, "to" as eighty milliseconds — so each word is spoken inside the
> frame *The word is ____.* and cut out at the word boundary the model reports,
> with up to six takes and the first that measures like speech kept. This
> supersedes §3.3 for word audio as well as phoneme audio.
>
> The article `a` is /ə/, not the letter name /eɪ/ espeak gives it in isolation.
> The reduced form is about 70 ms in fluent speech — too short to cut — so it is
> taken from the end of *banana* and held. Each clip is seeded from its own
> text, so a change to one word does not reroll the rest.
>
> ### Revision 7 — the deploy that never happened
>
> Three commits in a row did not reach production and nothing said so. Vercel
> validates vercel.json before the build starts and refuses an unknown key, so
> there are no build logs and the Production card keeps showing the last valid
> commit. The unknown key was a `"comment"` added inside a headers rule to
> explain a cache-control choice — a comment in a file that does not take them.
>
> Guards: tools/check-config.mjs validates the file against the keys Vercel
> accepts and tools/build.mjs will not run without it; a GitHub Actions
> preflight runs the same checks plus Vercel's own build command on every push;
> and the built page carries the commit it came from, shown in Grown-ups →
> Settings, so "is what I pushed what is live" is a question with an answer.
>
> ### Revision 6 — after the second week
>
> Four things, all from watching a four-year-old use it.
>
> **The sounds for f, l, m, n, r, s, v, z were heard as the letters' names.**
> Two causes. The card opened with the letter's name and then the sound twice —
> and for exactly those letters the name contains the sound (*ef*, *el*, *em*,
> *en*, *ar*, *es*, *vee*, *zed*), so the first thing heard taught the wrong
> thing. And the cut itself was too loose: growing the clip while the sound
> still "resembled itself" at 0.72 similarity let a nasal slide into the vowel
> after it, so /m/ finished three times brighter than it started and tiling it
> gave "muh". At 0.88 the drift falls from 2.44 to 0.04, and drift is now a
> build check in its own right. /z/ had a third problem: word-initial /z/ is
> genuinely devoiced, so the clip measured like /s/; it is now seeded on the
> noisiest frame that still has a pitch, giving 4.8 kHz of frication with
> periodicity 0.73.
>
> **The card now says the sound once, slowly**, then the four words. Each letter
> ships a second, slower take for that first reading — a real slow recording,
> not the fast one played at a lower speed, which would drop the pitch with it.
>
> **Back goes back one question** instead of leaving the lesson, and changing
> screen stops whatever is playing.
>
> **Each take is seeded from its own key** and redrawn until it measures right,
> in the letter tool as well as the speech tool. That makes the build
> makes a retry draw something new. It does not isolate one clip from the next,
> and it is not what makes a build reproducible — that is the seed set before
> the session is created. An earlier note here claimed isolation; measured, two
> runs of the same command match, but changing one item still moves every item
> after it.
>
> **Each letter card now teaches the sound explicitly**: IPA in British English
> (Oxford Learner's convention), a front-view mouth picture, one line on how to
> make it, and the letter's second job where it has one — c before e/i/y, g
> before e/i/y, s as /z/, the vowel name sounds.
>
> **Pictures carry their word**, and any drawing can be replaced with a real
> photo from the phone (Grown-ups → Pictures), stored on the device. Generated
> photographs were considered and rejected: no image model is reachable from
> this build, and the Artifact sandbox blocks loading images from any external
> host, so even a paid API could not deliver them to the page. A parent's own
> photo of the actual object is better anyway.
>
> **Two ways to practise**, per §2's mastery-not-age principle:
> *one letter a day* on the welcome screen (the next unfinished letter, plus a
> seven-day strip that records what happened and does not nag), and
> *Mix it up*, which jumbles every letter she has met and interleaves the round
> types. Neither is locked; the full map is always one tap away.
>
> ---
>

> ## Revision 2 — what changed after the first trial
>
> Rourou tried the first build and it was too hard. Two things were wrong:
>
> 1. **Wrong entry point.** The plan opened with Stage 0 (rhyme, syllable
>    clapping, oral blending). That is the textbook prerequisite sequence,
>    but it is abstract — there is nothing to look at, and a 4-year-old has
>    no way in. Her school and her home teaching both start from the
>    opposite end: **a letter, and four pictures of words it lives in.**
> 2. **Wrong source material.** Her cards are **Oxford Phonics World (OPW)
>    Level 1**. The keyword sets on them (apple/ax/ant/alligator,
>    bear/bird/bed/banana, gorilla/goat/gift/girl, horse/hat/house/hot dog)
>    match the published OPW 1 unit lists exactly. Building against a
>    different word list means the app and the book teach different words.
>
> **The built curriculum is now:**
>
> | Level | Age | What it is | Built |
> |---|---|---|---|
> | 1 · Look and Listen | from 3 | Vocabulary only. Hear a word, find the picture. No letters at all. 8 themed stops. | yes |
> | 2 · The Alphabet | from 4 | A–Z, one stop per letter, mirroring her OPW card: big **Aa**, the Phonics Friend, four keyword pictures; then *which one starts with a*, *find the letter*, *which letter is missing*. Plus 4 review stops. | yes |
> | 3 · Reading Words | from 5 | Blending c-a-t → cat. This is where the original Stages 2–4 live. | not yet |
> | 4 · Reading Books | from 6 | Sentences, then stories. Original Stages 5–8. | not yet |
>
> Phonological awareness (rhyme, syllables) has not been deleted — it moves
> out of the child's path and into the grown-up's. It is better done out
> loud in the car than tapped on a screen, and the dashboard's "practise
> away from the screen" panel is where it belongs.
>
> Everything below is the original plan. Sections §0 (design constraints),
> §3 (interaction design), §4 (technical), §5 (adaptivity), §6 (dashboard),
> §8 (risks) still hold. **§1.2, §1.4 and §2 are superseded** by the table
> above: Jolly Phonics group order and Dolch sight words are not what her
> school uses, so they are not what the app teaches.

---

Target learner: 1 child, age 4.0 at start, English-dominant, schooling in Singapore.
Target horizon: N2 (age 4) → P1/P2 (age 7).
Delivery order: Web (PWA) → Android → iOS/iPad.

---

## 0. Design constraints derived from the observed behaviour

Stated observation: child sustains attention when the loop is **voice prompt → image choices → touch/drag → voice feedback**.

That loop dictates the architecture. Every design decision below is subordinate to it.

| Constraint | Implication | Why |
|---|---|---|
| Pre-reader | Zero text-dependent navigation. All instructions audio. Text exists only as the *learning object*. | A 4-year-old cannot read a menu. If she needs an adult to navigate, she stops using it. |
| Audio is the instruction channel | Audio must be pre-loaded and gapless. Latency > ~300ms between tap and feedback breaks the loop. | Delay reads as "broken" to a child; she taps again, gets confused, disengages. |
| Touch, not mouse | Hit targets ≥ 88 px CSS. Drag must tolerate imprecise, slow, re-gripped fingers. | 4-year-old fine motor control. A 44px iOS-standard target is a miss-generator at this age. |
| Feedback must be immediate and non-punitive | Wrong answer → the wrong option gently returns, correct one is re-cued. Never a red X + buzzer + score deduction. | Punishment loops produce avoidance. At 4, the goal is repeated exposure, not accuracy scoring. |
| Session length ~8–12 min | Content is chunked into 3–5 min "rounds", each ending at a natural stop. | Sustained attention span at 4 for a focused task is roughly this range; the app should end before she does. |
| Immediate reward must be *visible* | A collection/sticker artefact that persists between sessions. | Stated goal: "let her see immediate reward." |

**Non-goal (explicit):** this is not a screen-time maximiser. Design target is a *short, dense, high-quality* session, not daily-active-minutes.

---

## 1. Curriculum grounding — what Singapore actually teaches

### 1.1 The three curriculum anchors

| Age | SG level | Governing framework | What it means for this tool |
|---|---|---|---|
| 4 | N2 | **NEL** (Nurturing Early Learners), MOE preschool framework, refreshed 2022, covers ages 4–6 across six learning areas incl. Language and Literacy | Pre-phonics: phonological awareness, letter recognition, book/print concepts |
| 5–6 | K1 / K2 | NEL continues; most preschools bolt on a commercial synthetic phonics programme | Systematic grapheme-phoneme correspondence (GPC) instruction |
| 7 | P1 | **STELLAR** (Strategies for English Language Learning And Reading), MOE, P1–P6; P1–P2 uses the **Shared Book Approach (SBA)** with MOE-selected Big Books | Decoding must be automatic enough to read *for meaning*; vocabulary and grammar are taught in story context |

**Practical consequence:** the tool should aim to have her decoding CVC words reliably before K1 starts, and reading simple decodable sentences before P1 starts. That is comfortably achievable in 3 years and is the real success criterion — not "knows 42 sounds".

### 1.2 Which phonics sequence to follow

The two programmes dominant in Singapore preschools and enrichment centres are **Jolly Phonics** and **Letterland**. Both are synthetic phonics. They differ in mnemonic style, not in linguistics:

| | Jolly Phonics | Letterland |
|---|---|---|
| Mnemonic device | Action + song per sound | Character with name and personality per letter |
| Scope | 42 sounds in 7 groups | Character-story based, similar coverage |
| Best fit for | Kinaesthetic / musical learners | Children strong on narrative and character identification |

**Recommendation: build on the Jolly Phonics 7-group order** as the scope-and-sequence backbone, because the order is public, unambiguous, and optimised for early blending:

| Group | Sounds |
|---|---|
| 1 | s, a, t, i, p, n |
| 2 | c/k, e, h, r, m, d |
| 3 | g, o, u, l, f, b |
| 4 | ai, j, oa, ie, ee, or |
| 5 | z, w, ng, v, oo (short), oo (long) |
| 6 | y, x, ch, sh, th (voiced), th (unvoiced) |
| 7 | qu, ou, oi, ue, er, ar |

Group 1 is `s a t i p n` because those six letters generate more three-letter words than any other six — she can read `sat`, `pin`, `tap`, `nip` after **one** group. That is the fastest path to the "I can read!" moment.

> **Action item before Stage 2:** find out which programme her preschool actually uses. If it is Letterland, keep this sequence but **rename the mascots to the Letterland characters** so school and app reinforce rather than compete. This is a content-layer change only, no code change — see §3.2.

### 1.3 Accent decision (do this once, do not revisit)

Singapore English instruction is British-based. This affects:

- Non-rhotic `r` — `car`, `star`, `or`, `er`, `ar` (Jolly group 7) sound materially different in RP vs General American.
- `a` in `bath`, `ask`, `grass`.
- The `o` in `dog`, `hot`.

**Decision: all recorded audio uses British/Singapore-standard English.** A US-accented app will contradict her teacher on exactly the vowels that are hardest. This is the single highest-leverage content decision in the project and it is nearly free if made at the start.

### 1.4 Sight words (non-decodable, taught by memory)

Synthetic phonics cannot decode `the`, `said`, `one`, `come`. These are taught as whole-word recognition in parallel. Use the **Dolch Pre-Primer list (40 words)**:

> a, and, away, big, blue, can, come, down, find, for, funny, go, help, here, I, in, is, it, jump, little, look, make, me, my, not, one, play, red, run, said, see, the, three, to, two, up, we, where, yellow, you

Then Dolch Primer, then Dolch Grade 1. Sight words are what turn "can decode words" into "can read a sentence", so they must run as a **parallel track from Stage 2 onward**, not after phonics is "finished".

### 1.5 The Singapore-context layer — and its honest limit

MOE publishes **NEL Big Books** with deliberate local flavour (examples surfaced in search: *Every Day is Fruity Day!*, *We Are Going on A Nature Walk!*, *We've Got Mail!*). Tying the app to local context creates the "I saw this in real life" reward.

**But a real constraint:** most distinctively Singaporean words are *not* phonetically simple. `hawker`, `Merlion`, `kaya`, `durian`, `MRT`, `void deck` are all undecodable at Stage 1–3. If you force local vocabulary into the decodable word lists, you break the phonics.

**Solution — two separate layers:**

| Layer | Controlled by | Singapore content goes here? |
|---|---|---|
| **Decodable core** (the words she sounds out) | Phonics sequence, strictly | Only where it happens to fit: `bus`, `van`, `fan`, `cat`, `hat`, `bag`, `bun`, `cup`, `pot`, `wok`, `fish`, `chop`, `shop`, `ship`, `kit`, `bin`, `mop`, `top`, `sun`, `rain`, `train` |
| **Context skin** (art, setting, story, narrator, reward objects) | Free choice | **Yes — everything.** Playground void deck, MRT platform, hawker centre, Botanic Gardens, HDB corridor, Bird Paradise, school canteen, Sentosa beach |

So: she decodes `a big red bus` while the picture is a Singapore double-decker at a bus stop she recognises. The reward is real and the linguistics stay clean.

**Recognition-only vocabulary** (spoken + pictured, never asked to decode) is where the untamed local words live: `char kway teow`, `laksa`, `Merlion`, `ang pow`. These build listening vocabulary and cultural hooks with zero phonics cost.

---

## 2. Curriculum staging — 9 stages, age 4 → 7

Stages are **mastery-gated, not age-gated**. The ages are expected, not required. A stage is passed at ≥ 90% accuracy across 3 separate sessions on different days (see §5.2).

| Stage | Expected age | SG level | Phonics content | Can read | Parallel sight words | Estimated duration |
|---|---|---|---|---|---|---|
| **0. Sound play** | 4.0–4.5 | N2 | No letters. Rhyme, syllable counting, initial-sound matching, oral blending (`c-a-t` heard → picks cat) | — | — | 3–5 mo |
| **1. First sounds** | 4.4–4.9 | N2 | Jolly groups 1–3 (26 single-letter sounds), letter-sound only, no letter *names* yet | `s a t i p n` words | a, I, the, to | 4–6 mo |
| **2. CVC blending** | 4.8–5.3 | N2/K1 | Blend & segment all CVC with the 26 sounds | `cat`, `pin`, `mud`, `hop` | Dolch Pre-Primer 1–20 | 4–6 mo |
| **3. Digraphs** | 5.2–5.8 | K1 | sh, ch, th, ng, qu, ck; letter *names* introduced here | `fish`, `chip`, `ring`, `that` | Dolch Pre-Primer 21–40 | 4 mo |
| **4. Blends** | 5.6–6.1 | K1 | CCVC / CVCC: `st, sp, sl, tr, br, nd, mp, nt, sk` | `stop`, `hand`, `jump`, `trip` | Dolch Primer 1–25 | 4 mo |
| **5. Long vowels** | 6.0–6.5 | K2 | Magic-e (`a_e i_e o_e u_e`), then Jolly groups 4–5 (ai, oa, ie, ee, or, oo) | `cake`, `rain`, `boat`, `feet` | Dolch Primer 26–52 | 5 mo |
| **6. Alternative spellings** | 6.3–6.9 | K2 | Same sound, different spellings: ai/ay/a-e, ee/ea/y, oa/ow/o-e, igh/ie/y; Jolly group 7 (ou, oi, ue, er, ar) | `play`, `night`, `snow`, `coin` | Dolch Grade 1 (part) | 5 mo |
| **7. Syllables & suffixes** | 6.7–7.2 | K2/P1 | Two-syllable words, `-s -ed -ing -er -ly`, compound words, soft c/g | `rabbit`, `jumping`, `sunset` | Dolch Grade 1 (rest) | 5 mo |
| **8. Fluency & meaning** | 7.0+ | P1 | Decodable sentences → short passages; comprehension questions; spelling from dictation | Full decodable readers | Dolch Grade 2 | ongoing |

**Total: ~3 years, 9 stages.** Stage 8 is where the tool stops being a phonics app and becomes a reading app — that transition mirrors the STELLAR shift from decoding to reading-for-meaning at P1.

### 2.1 Why the stages are ordered this way

- **Stage 0 exists because phonics fails without it.** A child who cannot hear that `cat` and `hat` rhyme cannot be taught that `c` says /k/ — the letter-sound mapping has nothing to map *to*. This stage is entirely oral and costs 3–5 months, and skipping it is the most common cause of stalled phonics.
- **Letter names are deferred to Stage 3** because "the letter B says /b/" and "the letter is called *bee*" compete during blending: a child who knows names first tends to sound out `cat` as "see-ay-tee". Names are introduced once blending is automatic and names become useful (spelling aloud, alphabet order).
- **Magic-e precedes vowel digraphs (Stage 5 order)** because it is a single, mechanical, highly regular rule — one rule unlocks ~4 vowel sounds. Digraphs are many rules with many exceptions.
- **Alternative spellings are Stage 6, not earlier,** because they require the child to already be secure that a sound *has* one spelling before learning it has three. Introducing ai/ay/a-e simultaneously at Stage 5 produces guessing.

---

## 3. Interaction design

### 3.1 The 12 activity primitives

The whole app is a small set of reusable game types, each driven by data. Building 12 engines and 2,000 content items beats building 200 bespoke games.

| # | Primitive | Loop | Used in stages | Skill trained |
|---|---|---|---|---|
| 1 | **Listen & Pick** | Audio prompt → 2–4 image/letter choices → tap | 0–8 | Recognition |
| 2 | **Odd One Out** | "Which one does not start with /s/?" | 0–3 | Discrimination |
| 3 | **Drag to Basket** | Sort items into 2–3 labelled bins | 1–7 | Categorisation |
| 4 | **Build the Word** | Drag letter tiles into slots to spell a pictured word | 2–7 | Segmenting / spelling |
| 5 | **Tap to Blend** | Tap each letter, it sounds; tap arrow, word blends and animates | 2–6 | Blending |
| 6 | **Pop the Sound** | Bubbles float up, pop only those with the target sound | 1–6 | Fluency under time pressure |
| 7 | **Feed the Monster** | Monster requests a sound; drag matching words to it | 1–6 | Reinforcement, high fun/low cognitive load |
| 8 | **Match Pairs** | Memory grid: picture ↔ word | 2–8 | Whole-word recall, sight words |
| 9 | **Say It** (ASR) | Child speaks the word; app checks | 2–8 (optional) | Production — **see risk R3** |
| 10 | **Sentence Builder** | Drag word cards to form a sentence, then it reads aloud | 5–8 | Syntax, sight words in context |
| 11 | **Story Reader** | Decodable story, tap any word to hear it, comprehension Qs at end | 6–8 | Reading for meaning (STELLAR-aligned) |
| 12 | **Treasure Room** | Non-assessed: place earned stickers/creatures in a scene | all | Reward, sense of ownership |

Each primitive is one component. Content is JSON. A new lesson = a new JSON file, no code.

### 3.2 Content schema (the thing that makes 3 years feasible)

```jsonc
// content/stage2/lesson-04.json
{
  "id": "s2-l04",
  "stage": 2,
  "title": "CVC with 'p'",
  "targets": ["p", "a", "t", "i", "n"],          // GPCs practised
  "sightWords": ["the", "a"],
  "theme": "hawker-centre",                       // selects art pack + narrator lines
  "items": [
    { "word": "pan", "img": "pan.webp", "audio": "pan.mp3", "phonemes": ["p","a","n"] },
    { "word": "pin", "img": "pin.webp", "audio": "pin.mp3", "phonemes": ["p","i","n"] }
  ],
  "activities": [
    { "type": "tapToBlend",  "items": ["pan","pin"] },
    { "type": "buildWord",   "items": ["pan"], "distractors": ["s","m"] },
    { "type": "feedMonster", "targetSound": "p", "rounds": 6 }
  ]
}
```

Three properties matter:
- `theme` is decoupled from linguistics → Singapore skinning is a data swap.
- `phonemes` is explicit, not derived → no runtime grapheme parsing, no wrong-sound bugs.
- `activities` is a list → same content, different games, on re-visit. This is what stops it getting boring on day 30.

### 3.3 Audio — the make-or-break asset

| Option | Quality for phonemes | Cost | Verdict |
|---|---|---|---|
| Browser TTS (Web Speech API) | Poor. Cannot reliably say a bare /s/ without adding a schwa ("suh"), which actively teaches wrong blending | Free | **Reject for phonemes.** Acceptable only for UI chrome |
| Commercial TTS with SSML phoneme tags | Good for words, still awkward for isolated phonemes | Low, per-character | Acceptable for word/sentence audio at scale |
| **Recorded human voice (parent)** | Best. Correct phonemes guaranteed, and a familiar voice measurably raises attention | Time only | **Recommended for all phoneme + core word audio** |

**Recommendation: record it yourself.** 26 phonemes + ~300 core words + ~50 feedback lines ≈ 2–3 recording sessions. Use a phone in a quiet room; normalise loudness in Audacity/ffmpeg. Her own parent's voice saying "you found it" is a stronger reinforcer than any stock asset, and it removes the single biggest pedagogical risk (schwa contamination in synthetic phoneme audio).

Format: 48 kHz mono → `.m4a` (AAC) at ~64 kbps + `.ogg` fallback. Preload the whole lesson's audio before the lesson starts; never fetch mid-activity.

### 3.4 Reward design

- **Per correct answer:** sound + 300ms animation. No score number.
- **Per activity:** one earned collectible (sticker, creature, food item for the hawker stall).
- **Per lesson:** the Treasure Room scene visibly grows.
- **No streaks, no daily-login pressure, no leaderboard, no timers on learning activities.** Streak mechanics create anxiety and parent-child conflict, and at age 4 they reward the parent's discipline, not the child's learning.
- **Parent-visible progress is separate** (§6) and never shown to the child as a score.

---

## 4. Technical plan

### 4.1 Stack

| Layer | Choice | Reason |
|---|---|---|
| Build | Vite + TypeScript | Fast, zero-config, trivial static deploy |
| UI | React (or Preact if bundle size matters) | Component-per-primitive maps cleanly to §3.1 |
| Rendering | DOM + CSS transforms for most; `<canvas>` only for particle/bubble effects | DOM drag is simpler and accessible; canvas only where DOM can't keep 60fps |
| Input | **Pointer Events** (`pointerdown/move/up`) with `touch-action: none` | Single code path for touch + mouse + stylus. Do not use HTML5 drag-and-drop API — it is unreliable on mobile Safari |
| Audio | **Web Audio API** with a decoded-buffer pool | `<audio>` elements have unpredictable latency and iOS autoplay issues; Web Audio with pre-decoded buffers gives sub-50ms playback |
| State | Zustand or plain reducer | Small app; avoid heavyweight state libraries |
| Storage | IndexedDB (via `idb`) for progress + cached audio | Survives reload; large enough for audio cache |
| Offline | Service Worker (Workbox), cache-first for assets | Must work on a plane / in a car / with bad wifi |
| Hosting | Cloudflare Pages or Netlify, free tier | Static, global, HTTPS by default |
| Mobile wrapper | **Capacitor** | Same web codebase → Android APK → iOS. Avoids a rewrite |

### 4.2 iOS audio-unlock gotcha (plan for it now)

iOS Safari will not play audio until a user gesture has unlocked the AudioContext. Design the first screen as a big "tap to start" button that (a) resumes the AudioContext, (b) plays a silent buffer, (c) *then* begins preloading. If this is retrofitted later it tends to require restructuring the app shell.

### 4.3 Path to native

| Step | What | Effort |
|---|---|---|
| 1 | PWA with service worker + web app manifest | days |
| 2 | "Add to Home Screen" on her iPad — full-screen, offline, no browser chrome | hours |
| 3 | Capacitor wrap → Android APK, sideload or Play Store internal testing | days |
| 4 | Capacitor → iOS, requires Apple Developer Program (USD 99/yr) | days + account setup |

**Step 2 covers ~90% of the actual need.** An installed PWA on an iPad is, from a 4-year-old's point of view, indistinguishable from an app. Do not pay for a developer account until there is a reason to distribute beyond your own household.

### 4.4 Guardrails a kids' app needs

- **No network calls during play.** Everything local after install → no ads, no tracking, no surprise content.
- **Parent gate** on settings/dashboard: a 2-digit multiplication or "hold 3 seconds" gesture. Trivial to implement, prevents accidental settings changes.
- **No external links, no sharing, no chat, no IAP.**
- **Session timer with a soft end:** after N minutes the app routes to the Treasure Room and says "see you tomorrow" — it *ends* rather than nagging.

---

## 5. Adaptivity and assessment

### 5.1 Mastery model

Per GPC and per sight word, track: `exposures`, `correct`, `lastSeen`, `box` (1–5).

**Leitner spaced repetition:** correct → promote a box; wrong → demote to box 1. Review intervals per box: 1 day, 2 days, 4 days, 8 days, 16 days. Each session draws ~70% due-for-review items and ~30% new material.

This matters because the failure mode of a home phonics app is not "too hard" — it is teaching 40 sounds and quietly losing the first 15.

### 5.2 Stage gate

Advance when: every GPC in the stage is in box ≥ 4, **and** accuracy ≥ 90% across 3 sessions on 3 different days.

The multi-day requirement filters out same-session short-term memory, which is the most common false positive in self-reported progress.

### 5.3 Difficulty adaptation inside a session

- 3 consecutive correct → add a distractor (2 choices → 3 → 4).
- 2 consecutive wrong → drop a distractor, and re-cue the sound before the prompt.
- Never more than 2 failures in a row on the same item; substitute a known-easy item to restore momentum, then re-queue the hard one later.

---

## 6. Parent dashboard (behind parent gate)

| Panel | Content |
|---|---|
| Mastery map | 42 sounds × box level, heat-coloured. At a glance: what is shaky |
| Struggling list | Bottom 5 items by accuracy — these are what to practise **offline**, in the car, at the hawker centre |
| Session history | Date, minutes, activities, accuracy trend |
| School alignment | Which stage she is on vs. the K1/K2/P1 expectation band |
| Content controls | Enable/disable stages, theme pack, session length cap, ASR on/off |

The struggling list is the panel with the highest real-world value: it converts app data into 5 minutes of offline parent-child practice, which outperforms additional screen time.

---

## 7. Build roadmap

| Phase | Weeks | Deliverable | Definition of done |
|---|---|---|---|
| **P0. Spike** | 1 | One activity (Listen & Pick), 6 sounds (`s a t i p n`), hardcoded, runs on her iPad | She plays it unaided for 5 minutes |
| **P1. Engine** | 2–4 | Content JSON schema, activity registry, audio preloader, Pointer-Events drag layer, 4 primitives (#1,3,5,7) | A new lesson can be added with zero code changes |
| **P2. Stage 0+1 content** | 5–8 | Full Stage 0 (oral) + Stage 1 (26 sounds), ~30 lessons, recorded audio, art pack v1 | 3 months of daily material exists |
| **P3. Progress** | 9–10 | IndexedDB persistence, Leitner scheduler, stage gates, Treasure Room | Progress survives reinstall; review queue demonstrably surfaces weak items |
| **P4. PWA** | 11–12 | Service worker, manifest, offline, installed on her iPad home screen | Works in aeroplane mode |
| **P5. Stage 2–3** | 13–20 | CVC blending + digraphs; primitives #2,4,6,8; sight-word track | She reads her first unfamiliar CVC word unaided |
| **P6. Parent dashboard** | 21–22 | §6 panels | You can name her 5 weakest sounds in under 10 seconds |
| **P7. Android** | 23–24 | Capacitor build, internal-test APK | Runs on an Android tablet |
| **P8. Stage 4–6** | 6–12 mo | Blends, long vowels, alt spellings; primitives #10, #11 | She reads a 6-sentence decodable story |
| **P9. Stage 7–8** | 12–24 mo | Syllables, suffixes, fluency, comprehension, dictation | Reads P1-level decodable readers |
| **P10. iOS** | opportunistic | Apple Developer account, TestFlight | Only if distributing outside the household |

**Critical discipline:** P0 ships in week 1 and gets played by the actual child. Every subsequent phase is validated the same way. A phonics app built for 6 months without a 4-year-old touching it will be wrong in ways that are invisible from the code.

---

## 8. Risks

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Schwa contamination — synthetic audio says "suh" not /s/ | Teaches un-blendable phonemes; actively harmful | Record human audio for all phonemes (§3.3) |
| R2 | Accent mismatch with school | Confusion on `ar/or/er` and short `a` | British/SG English throughout (§1.3) |
| R3 | **ASR ("Say It") accuracy on a 4-year-old's voice is unproven** | False "wrong" verdicts → child stops trying | Ship as optional, off by default. Treat as *encouragement*, never as assessment. Validate with recordings of her actual voice before enabling. **Unverified — needs testing** |
| R4 | Novelty decay after ~3 weeks | Abandonment | Multiple activity types per content item (§3.2); new theme pack per stage; Treasure Room as long-arc goal |
| R5 | Sequence conflict with her preschool's programme | Same sound taught two ways in one week | Confirm the school's programme; align mascot/naming layer (§1.2) |
| R6 | Art asset production becomes the bottleneck | Stalls at ~50 words | Fix an art spec early (flat vector, single palette, transparent WebP, 512px). Batch-generate, then curate |
| R7 | Over-assessment turns play into testing | Loss of the observed focus behaviour | No visible scores to the child; all measurement in the parent dashboard |
| R8 | Screen time displaces book reading | Net literacy negative | Hard session cap; dashboard explicitly prompts offline practice on weak items |

---

## 9. Success metrics

| Level | Metric | Target |
|---|---|---|
| Engagement | Unprompted return rate (she asks for it) | ≥ 3×/week |
| Engagement | Median uninterrupted session length | 8–12 min |
| Learning | GPCs at box ≥ 4 | 26 by age 5.0; 42 by age 6.5 |
| Learning | Unfamiliar CVC words decoded correctly, cold | ≥ 8/10 by age 5.5 |
| Learning | Dolch Pre-Primer sight words recognised | 40/40 by age 5.5 |
| Transfer | Reads an unseen decodable book aloud | 1 book by age 6; P1-level fluency by age 7 |
| Transfer | **Reads a real-world sign** (MRT station, hawker stall, book title) unprompted | First occurrence logged — this is the actual goal |

The last row is the one that matters. Everything else is a proxy.

---

## 10. Immediate next steps

1. **Confirm the school's phonics programme** (Jolly / Letterland / other). Determines the mascot layer only, but do it before P2.
2. **Decide the art direction** — a single recurring character she can name is worth more than varied artwork. Fix the spec before generating assets.
3. **Record the Group 1 audio** (`s a t i p n` phonemes + ~20 words + 10 feedback lines). ~40 minutes of work, unblocks P0 and P1.
4. **Build P0 this week.** One activity, six sounds, on her iPad. Then watch her use it and write down every point where she hesitates — those notes are the real specification.

---

## Sources

- [NEL framework overview — MOE Nurturing Early Learners Portal](https://nel.moe.edu.sg/la/overview/)
- [Nurturing Early Learners (NEL) Framework 2022 — MOE](https://www.moe.gov.sg/api/media/4f8c9642-8428-43c2-aa61-a01512aa98af/Nurturing-Early-Learners-NEL-framework-2022.pdf)
- [MOE Kindergarten curriculum and learning environment](https://www.moe.gov.sg/preschool/moe-kindergarten/curriculum-and-learning-environment/curriculum)
- [NEL Big Book Resources — MOE](https://nel.moe.edu.sg/tl/big-book-resources/)
- [STELLAR / Shared Book Approach, lower primary English](https://www.bigideaz.sg/lower-primary-english-stellar/)
- [Yuhua Primary School — STELLAR P1 English briefing (PDF)](https://www.yuhuapri.moe.edu.sg/files/p1eng.pdf)
- [Letterland Singapore](https://letterland.com.sg/)
- [Jolly Phonics — Jolly Learning](https://jollylearning.com/en-gb/our-programmes/jolly-phonics)
- [Jolly Phonics 7 groups, letter sounds and words](https://jollyreading.in/jolly-phonics-7-groups-letter-sound-words/)
- [Dolch pre-primer sight word list (40 words), sightwords.com](https://sightwords.com/pdfs/word_lists/dolch_prek.pdf)
- [Guide to phonics programmes in Singapore — Edufarm (Letterland)](https://www.edufarm.com.sg/guide-letterland-phonics)

### Verification status

| Item | Status |
|---|---|
| NEL covers ages 4–6, six learning areas, L&L is one; refreshed 2022 | Verified (MOE / NEL portal, search 2026-09-12) |
| STELLAR runs P1–P6; SBA with Big Books at P1–P2 | Verified (MOE school sites, search 2026-09-12) |
| Jolly Phonics 42 sounds, 7-group order as listed | Verified (search 2026-09-12) |
| Dolch Pre-Primer = 40 words, list as given | Verified (sightwords.com, search 2026-09-12) |
| Letterland and Jolly Phonics both widely used in SG preschools | Verified directionally (SG enrichment/tuition sources) |
| Exact NEL Language & Literacy learning-goal wording | **Not verified** — MOE PDF and nel.moe.edu.sg were unreachable from this environment. Retrieve the *NEL Educators' Guide for Language and Literacy* before finalising Stage 0–1 content |
| Full NEL Big Book title list | **Not verified** — only three titles surfaced in search |
| Which programme her preschool uses | **Unknown** — must ask the school |
| ASR accuracy on 4-year-old speech | **Unverified** — treat as experimental (R3) |
| Age bands per stage | **Estimates**, based on the stage sequence and typical SG school levels, not on measured data for this child. Mastery gates (§5.2), not ages, govern progression |
