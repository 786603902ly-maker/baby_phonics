/* content.js — the curriculum as data.
   Adding a lesson is a data edit, never a code edit. See docs/PLAN.md §3.2. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     LETTERS — Jolly Phonics group order (see docs/PLAN.md §1.2).
     `cue`  : the spelling handed to speech synthesis as a fallback.
              Stop consonants (t, p, b, d, k, g) unavoidably pick up a
              schwa from any TTS engine. Parent recordings replace these:
              Grown-ups -> Record the sounds.
     `action`: the Jolly-style gesture, for the grown-up to copy.
     ------------------------------------------------------------------ */
  var LETTERS = {
    s: { group: 1, keyword: 'sun',      cue: 'sss',  action: 'Wiggle your hand like a snake' },
    a: { group: 1, keyword: 'apple',    cue: 'aah',  action: 'Wiggle your fingers above your elbow — ants!' },
    t: { group: 1, keyword: 'tap',      cue: 'tuh',  action: 'Turn your head side to side, watching tennis' },
    i: { group: 1, keyword: 'igloo',    cue: 'ih',   action: 'Pretend to be a mouse, squeaking' },
    p: { group: 1, keyword: 'pan',      cue: 'puh',  action: 'Puff out short breaths, like a candle' },
    n: { group: 1, keyword: 'net',      cue: 'nnn',  action: 'Hold your arms out like a plane, nnnn' },
    c: { group: 2, keyword: 'cat',      cue: 'kuh',  action: 'Raise your hand and snap, like castanets' },
    k: { group: 2, keyword: 'kite',     cue: 'kuh',  action: 'Raise your hand and snap, like castanets' },
    e: { group: 2, keyword: 'egg',      cue: 'eh',   action: 'Pretend to crack an egg' },
    h: { group: 2, keyword: 'hat',      cue: 'huh',  action: 'Pant with your hand on your chest' },
    r: { group: 2, keyword: 'ring',     cue: 'rrr',  action: 'Pretend to be a puppy, rrrr' },
    m: { group: 2, keyword: 'mug',      cue: 'mmm',  action: 'Rub your tummy — mmm, tasty' },
    d: { group: 2, keyword: 'dog',      cue: 'duh',  action: 'Beat your hands like a drum' },
    g: { group: 3, keyword: 'gift',     cue: 'guh',  action: 'Spiral your hand down, like water in a drain' },
    o: { group: 3, keyword: 'octopus',  cue: 'oh',   action: 'Flick your fingers on and off, like a light' },
    u: { group: 3, keyword: 'umbrella', cue: 'uh',   action: 'Put your hands up, like opening an umbrella' },
    l: { group: 3, keyword: 'leaf',     cue: 'lll',  action: 'Lick your lips, lllll' },
    f: { group: 3, keyword: 'fan',      cue: 'fff',  action: 'Put your hands together like a fish fin' },
    b: { group: 3, keyword: 'bus',      cue: 'buh',  action: 'Bounce your hand like a ball' },
    j: { group: 4, keyword: 'jug',      cue: 'juh',  action: 'Wobble your hands like jelly' },
    z: { group: 5, keyword: 'zip',      cue: 'zzz',  action: 'Buzz like a bee' },
    w: { group: 5, keyword: 'wok',      cue: 'wuh',  action: 'Blow your hands like the wind' },
    v: { group: 5, keyword: 'van',      cue: 'vvv',  action: 'Hold a pretend steering wheel, vvvv' },
    y: { group: 6, keyword: 'yoyo',     cue: 'yuh',  action: 'Pretend to eat a yoghurt' },
    x: { group: 6, keyword: 'box',      cue: 'ks',   action: 'Pretend to take an x-ray photo' },
    q: { group: 7, keyword: 'queen',    cue: 'kwuh', action: 'Make a duck beak with your hand — qu qu' }
  };

  /* ------------------------------------------------------------------
     WORDS — every word the child sees has a picture, a phoneme
     breakdown, a syllable count and a rhyme family.
     `sg` marks the Singapore context notes used in the picture caption
     for grown-ups; the child only hears the word itself.
     ------------------------------------------------------------------ */
  function w(text, icon, phonemes, syl, rhyme, sg) {
    return { text: text, icon: icon, phonemes: phonemes, syl: syl, rhyme: rhyme, sg: sg || null };
  }

  var WORDS = {
    /* -at */
    cat: w('cat', 'cat', ['c', 'a', 't'], 1, 'at'),
    hat: w('hat', 'hat', ['h', 'a', 't'], 1, 'at'),
    mat: w('mat', 'mat', ['m', 'a', 't'], 1, 'at'),
    rat: w('rat', 'rat', ['r', 'a', 't'], 1, 'at'),
    bat: w('bat', 'bat', ['b', 'a', 't'], 1, 'at'),
    /* -an */
    pan: w('pan', 'pan', ['p', 'a', 'n'], 1, 'an'),
    fan: w('fan', 'fan', ['f', 'a', 'n'], 1, 'an'),
    van: w('van', 'van', ['v', 'a', 'n'], 1, 'an'),
    /* -in */
    pin: w('pin', 'pin', ['p', 'i', 'n'], 1, 'in'),
    tin: w('tin', 'tin', ['t', 'i', 'n'], 1, 'in'),
    /* -un */
    sun: w('sun', 'sun', ['s', 'u', 'n'], 1, 'un'),
    bun: w('bun', 'bun', ['b', 'u', 'n'], 1, 'un', 'like a kaya-toast bun'),
    /* -og / -ug */
    dog: w('dog', 'dog', ['d', 'o', 'g'], 1, 'og'),
    log: w('log', 'log', ['l', 'o', 'g'], 1, 'og'),
    mug: w('mug', 'mug', ['m', 'u', 'g'], 1, 'ug'),
    jug: w('jug', 'jug', ['j', 'u', 'g'], 1, 'ug'),
    /* -op / -ot */
    top: w('top', 'top', ['t', 'o', 'p'], 1, 'op'),
    mop: w('mop', 'mop', ['m', 'o', 'p'], 1, 'op'),
    pot: w('pot', 'pot', ['p', 'o', 't'], 1, 'ot'),
    cot: w('cot', 'cot', ['c', 'o', 't'], 1, 'ot'),
    /* -ox */
    box: w('box', 'box', ['b', 'o', 'x'], 1, 'ox'),
    fox: w('fox', 'fox', ['f', 'o', 'x'], 1, 'ox'),
    /* -ed / -en / -et / -eg */
    bed: w('bed', 'bed', ['b', 'e', 'd'], 1, 'ed'),
    hen: w('hen', 'hen', ['h', 'e', 'n'], 1, 'en'),
    net: w('net', 'net', ['n', 'e', 't'], 1, 'et'),
    pen: w('pen', 'pen', ['p', 'e', 'n'], 1, 'en'),
    leg: w('leg', 'leg', ['l', 'e', 'g'], 1, 'eg'),
    /* -ut / -up / -us */
    nut: w('nut', 'nut', ['n', 'u', 't'], 1, 'ut'),
    hut: w('hut', 'hut', ['h', 'u', 't'], 1, 'ut'),
    cup: w('cup', 'cup', ['c', 'u', 'p'], 1, 'up'),
    bus: w('bus', 'bus', ['b', 'u', 's'], 1, 'us', 'the double-decker at the bus stop'),
    /* -ag / -ap / -ig / -ip */
    bag: w('bag', 'bag', ['b', 'a', 'g'], 1, 'ag'),
    tag: w('tag', 'bag', ['t', 'a', 'g'], 1, 'ag'),
    cap: w('cap', 'cap', ['c', 'a', 'p'], 1, 'ap'),
    tap: w('tap', 'tap', ['t', 'a', 'p'], 1, 'ap'),
    pig: w('pig', 'pig', ['p', 'i', 'g'], 1, 'ig'),
    wig: w('wig', 'wig', ['w', 'i', 'g'], 1, 'ig'),
    zip: w('zip', 'zip', ['z', 'i', 'p'], 1, 'ip'),
    /* -ock / -ick */
    wok: w('wok', 'wok', ['w', 'o', 'k'], 1, 'ock', 'the one at the hawker stall'),
    sock: w('sock', 'sock', ['s', 'o', 'ck'], 1, 'ock'),
    rock: w('rock', 'rock', ['r', 'o', 'ck'], 1, 'ock'),
    lock: w('lock', 'lock', ['l', 'o', 'ck'], 1, 'ock'),
    duck: w('duck', 'duck', ['d', 'u', 'ck'], 1, 'uck'),
    /* digraph words — heard now, decoded in Year 2 */
    fish: w('fish', 'fish', ['f', 'i', 'sh'], 1, 'ish'),
    ship: w('ship', 'ship', ['sh', 'i', 'p'], 1, 'ip'),
    chip: w('chip', 'chip', ['ch', 'i', 'p'], 1, 'ip'),
    /* multi-syllable, listening only */
    apple: w('apple', 'apple', null, 2, null),
    igloo: w('igloo', 'igloo', null, 2, null),
    yoyo: w('yo-yo', 'yoyo', null, 2, null),
    rabbit: w('rabbit', 'rabbit', null, 2, null),
    banana: w('banana', 'banana', null, 3, null),
    octopus: w('octopus', 'octopus', null, 3, null),
    umbrella: w('umbrella', 'umbrella', null, 3, null),
    /* one-syllable listening words */
    star: w('star', 'star', null, 1, null),
    tree: w('tree', 'tree', null, 1, null),
    moon: w('moon', 'moon', null, 1, null),
    ball: w('ball', 'ball', null, 1, null),
    car: w('car', 'car', null, 1, null),
    bird: w('bird', 'bird', null, 1, null),
    egg: w('egg', 'egg', null, 1, null),
    ring: w('ring', 'ring', null, 1, null),
    kite: w('kite', 'kite', null, 1, null),
    leaf: w('leaf', 'leaf', null, 1, null),
    gift: w('gift', 'gift', null, 1, null),
    queen: w('queen', 'queen', null, 1, null),
    train: w('train', 'train', null, 1, 'ain', 'the MRT'),
    durian: w('durian', 'durian', null, 3, null, 'king of fruit'),
    toast: w('toast', 'toast', null, 1, null, 'kaya toast'),
    hdb: w('flat', 'hdb', null, 1, null, 'your HDB block')
  };

  /* Sight words — Dolch Pre-Primer, first 12. Taught by recognition. */
  var SIGHT = ['the', 'a', 'I', 'to', 'and', 'is', 'it', 'in', 'go', 'we', 'see', 'up'];

  /* Rewards, unlocked one per finished lesson. */
  var STICKERS = [
    'otter', 'star', 'durian', 'merlion', 'hdb', 'train', 'toast', 'medal',
    'bird', 'tree', 'fish', 'duck', 'banana', 'kite', 'flag', 'moon',
    'rabbit', 'fox', 'ball', 'leaf', 'gift', 'ring', 'sun', 'bus'
  ];

  /* ------------------------------------------------------------------
     STAGES — the full 9-stage arc from docs/PLAN.md §2.
     Year 1 builds stages 0-2; 3-8 are visible but not yet built, so the
     whole journey is legible from day one.
     ------------------------------------------------------------------ */
  var STAGES = [
    { id: 0, name: 'Sound Play',      place: 'The Playground',    tint: 'leaf',  built: true,
      blurb: 'Hearing sounds inside words. No letters yet.', age: '4.0 – 4.5' },
    { id: 1, name: 'First Sounds',    place: 'The Void Deck',     tint: 'river', built: true,
      blurb: 'What each letter says. 26 sounds.', age: '4.4 – 4.9' },
    { id: 2, name: 'Blending',        place: 'The Hawker Centre', tint: 'otter', built: true,
      blurb: 'Pushing sounds together to read a word.', age: '4.8 – 5.3' },
    { id: 3, name: 'Two-Letter Teams', place: 'The Park Connector', tint: 'sun', built: false,
      blurb: 'sh, ch, th, ng, qu — two letters, one sound.', age: '5.2 – 5.8' },
    { id: 4, name: 'Sound Clusters',  place: 'The MRT',           tint: 'river', built: false,
      blurb: 'stop, hand, jump — blends at both ends.', age: '5.6 – 6.1' },
    { id: 5, name: 'Long Vowels',     place: 'The Botanic Gardens', tint: 'leaf', built: false,
      blurb: 'Magic e, then ai, oa, ee.', age: '6.0 – 6.5' },
    { id: 6, name: 'Same Sound, New Look', place: 'The Reservoir', tint: 'otter', built: false,
      blurb: 'ai / ay / a-e all say the same thing.', age: '6.3 – 6.9' },
    { id: 7, name: 'Longer Words',    place: 'The Library',       tint: 'sun',   built: false,
      blurb: 'Two syllables, and -ing, -ed, -er.', age: '6.7 – 7.2' },
    { id: 8, name: 'Real Reading',    place: 'The Bookshop',      tint: 'river', built: false,
      blurb: 'Whole stories, read for the meaning.', age: '7.0 +' }
  ];

  /* ------------------------------------------------------------------
     LESSONS — Year 1. Each `activities` entry is expanded into rounds
     by the generators in app.js.
     ------------------------------------------------------------------ */
  var LESSONS = [
    /* ---------------- Stage 0 · Sound Play ---------------- */
    { id: 's0-l1', stage: 0, name: 'Words That Sound the Same', skill: 'rhyme',
      activities: [
        { type: 'rhymePick', families: ['at', 'un', 'an'], rounds: 6 }
      ] },
    { id: 's0-l2', stage: 0, name: 'Clap the Word', skill: 'syllable',
      activities: [
        { type: 'syllableCount', words: ['cat', 'apple', 'octopus', 'sun', 'igloo', 'umbrella', 'star', 'banana'], rounds: 8 }
      ] },
    { id: 's0-l3', stage: 0, name: 'Rhyme Time Again', skill: 'rhyme',
      activities: [
        { type: 'rhymePick', families: ['og', 'ug', 'in', 'op', 'ox'], rounds: 6 }
      ] },
    { id: 's0-l4', stage: 0, name: 'What Starts With…', skill: 'initial',
      activities: [
        { type: 'initialSoundPick', sounds: ['s', 'm', 'c', 'b'], rounds: 8 }
      ] },
    { id: 's0-l5', stage: 0, name: 'Robot Talk', skill: 'oralblend',
      activities: [
        { type: 'oralBlend', words: ['cat', 'sun', 'pig', 'bus', 'dog', 'net'], rounds: 6 }
      ] },
    { id: 's0-l6', stage: 0, name: 'Playground Mix-Up', skill: 'mixed',
      activities: [
        { type: 'rhymePick', families: ['at', 'in'], rounds: 3 },
        { type: 'syllableCount', words: ['fish', 'rabbit', 'umbrella', 'ball'], rounds: 3 },
        { type: 'oralBlend', words: ['hat', 'mug', 'fox'], rounds: 3 }
      ] },

    /* ---------------- Stage 1 · First Sounds ---------------- */
    { id: 's1-l1', stage: 1, name: 's · a · t', letters: ['s', 'a', 't'],
      activities: [
        { type: 'letterIntro', letters: ['s', 'a', 't'] },
        { type: 'letterPick', letters: ['s', 'a', 't'], rounds: 6 },
        { type: 'popSound', letters: ['s', 'a', 't'], rounds: 2 }
      ] },
    { id: 's1-l2', stage: 1, name: 'i · p · n', letters: ['i', 'p', 'n'],
      activities: [
        { type: 'letterIntro', letters: ['i', 'p', 'n'] },
        { type: 'letterPick', letters: ['i', 'p', 'n', 's', 'a', 't'], rounds: 6 },
        { type: 'popSound', letters: ['i', 'p', 'n'], rounds: 2 }
      ] },
    { id: 's1-l3', stage: 1, name: 'Sorting Sounds', letters: ['s', 'a', 't', 'i', 'p', 'n'],
      activities: [
        { type: 'soundSort', pairs: [['s', 'p'], ['t', 'n']], rounds: 4 },
        { type: 'letterPick', letters: ['s', 'a', 't', 'i', 'p', 'n'], rounds: 6 }
      ] },
    { id: 's1-l4', stage: 1, name: 'c · k · e', letters: ['c', 'k', 'e'],
      activities: [
        { type: 'letterIntro', letters: ['c', 'k', 'e'] },
        { type: 'letterPick', letters: ['c', 'k', 'e', 's', 't'], rounds: 6 },
        { type: 'popSound', letters: ['c', 'k', 'e'], rounds: 2 }
      ] },
    { id: 's1-l5', stage: 1, name: 'h · r · m · d', letters: ['h', 'r', 'm', 'd'],
      activities: [
        { type: 'letterIntro', letters: ['h', 'r', 'm', 'd'] },
        { type: 'letterPick', letters: ['h', 'r', 'm', 'd', 'c', 'e'], rounds: 8 },
        { type: 'popSound', letters: ['h', 'r', 'm', 'd'], rounds: 2 }
      ] },
    { id: 's1-l6', stage: 1, name: 'Void Deck Sort', letters: ['c', 'k', 'e', 'h', 'r', 'm', 'd'],
      activities: [
        { type: 'soundSort', pairs: [['m', 'd'], ['h', 'r']], rounds: 4 },
        { type: 'letterPick', letters: ['c', 'e', 'h', 'r', 'm', 'd'], rounds: 6 }
      ] },
    { id: 's1-l7', stage: 1, name: 'g · o · u', letters: ['g', 'o', 'u'],
      activities: [
        { type: 'letterIntro', letters: ['g', 'o', 'u'] },
        { type: 'letterPick', letters: ['g', 'o', 'u', 'a', 'i', 'e'], rounds: 6 },
        { type: 'popSound', letters: ['g', 'o', 'u'], rounds: 2 }
      ] },
    { id: 's1-l8', stage: 1, name: 'l · f · b', letters: ['l', 'f', 'b'],
      activities: [
        { type: 'letterIntro', letters: ['l', 'f', 'b'] },
        { type: 'letterPick', letters: ['l', 'f', 'b', 'g', 'd', 'p'], rounds: 6 },
        { type: 'popSound', letters: ['l', 'f', 'b'], rounds: 2 }
      ] },
    { id: 's1-l9', stage: 1, name: 'Nineteen Sounds', letters: ['s', 'a', 't', 'i', 'p', 'n', 'c', 'e', 'h', 'r', 'm', 'd', 'g', 'o', 'u', 'l', 'f', 'b'],
      activities: [
        { type: 'letterPick', letters: ['s', 'a', 't', 'i', 'p', 'n', 'c', 'e', 'h', 'r', 'm', 'd', 'g', 'o', 'u', 'l', 'f', 'b'], rounds: 10 },
        { type: 'soundSort', pairs: [['f', 'b'], ['l', 'g']], rounds: 4 }
      ] },
    { id: 's1-l10', stage: 1, name: 'j · v · w', letters: ['j', 'v', 'w'],
      activities: [
        { type: 'letterIntro', letters: ['j', 'v', 'w'] },
        { type: 'letterPick', letters: ['j', 'v', 'w', 'm', 'b'], rounds: 6 },
        { type: 'popSound', letters: ['j', 'v', 'w'], rounds: 2 }
      ] },
    { id: 's1-l11', stage: 1, name: 'y · z · x · qu', letters: ['y', 'z', 'x', 'q'],
      activities: [
        { type: 'letterIntro', letters: ['y', 'z', 'x', 'q'] },
        { type: 'letterPick', letters: ['y', 'z', 'x', 'q', 's', 'c'], rounds: 8 }
      ] },

    /* ---------------- Stage 2 · Blending ---------------- */
    { id: 's2-l1', stage: 2, name: 'First Words', words: ['pin', 'tap', 'tin', 'pan'],
      activities: [
        { type: 'tapToBlend', words: ['pin', 'tap', 'tin', 'pan'] },
        { type: 'buildWord', words: ['pin', 'tap'], distractors: ['s', 'n'] }
      ] },
    { id: 's2-l2', stage: 2, name: 'Build It Yourself', words: ['pan', 'tin', 'pin', 'tap'],
      activities: [
        { type: 'buildWord', words: ['pan', 'tin', 'pin', 'tap'], distractors: ['s', 'm', 'o'] }
      ] },
    { id: 's2-l3', stage: 2, name: 'More Sounds, More Words', words: ['cat', 'hat', 'hen', 'bed', 'mat', 'rat'],
      activities: [
        { type: 'tapToBlend', words: ['cat', 'hen', 'bed'] },
        { type: 'buildWord', words: ['cat', 'mat', 'rat'], distractors: ['d', 'p'] }
      ] },
    { id: 's2-l4', stage: 2, name: 'At the Hawker Centre', words: ['bus', 'mug', 'bun', 'cup', 'pot', 'wok'],
      activities: [
        { type: 'tapToBlend', words: ['bun', 'cup', 'pot', 'wok'] },
        { type: 'buildWord', words: ['mug', 'bus'], distractors: ['t', 'a'] }
      ] },
    { id: 's2-l5', stage: 2, name: 'Read It All', words: ['dog', 'log', 'fox', 'box', 'top', 'net', 'pig', 'bag'],
      activities: [
        { type: 'tapToBlend', words: ['dog', 'fox', 'pig'] },
        { type: 'buildWord', words: ['box', 'top', 'bag'], distractors: ['m', 'e'] },
        { type: 'sightWord', words: ['the', 'a', 'I', 'to'] }
      ] }
  ];

  window.CONTENT = {
    LETTERS: LETTERS,
    WORDS: WORDS,
    SIGHT: SIGHT,
    STICKERS: STICKERS,
    STAGES: STAGES,
    LESSONS: LESSONS,
    /* every trackable item, for the mastery map */
    trackables: function () {
      var t = [];
      Object.keys(LETTERS).forEach(function (k) { t.push({ key: 'L:' + k, label: k, kind: 'letter' }); });
      SIGHT.forEach(function (s) { t.push({ key: 'W:' + s, label: s, kind: 'sight' }); });
      ['rhyme', 'syllable', 'initial', 'oralblend', 'blend'].forEach(function (s) {
        t.push({ key: 'S:' + s, label: s, kind: 'skill' });
      });
      return t;
    }
  };
})();
