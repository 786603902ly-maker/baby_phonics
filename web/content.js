/* content.js — the whole curriculum as data.
   Adding or changing a lesson is a data edit, never a code edit.

   The alphabet keyword sets follow Oxford Phonics World Level 1 (the book
   Rourou already uses). Four sets are confirmed against her own cards:
   a, b, g, h. The rest come from published OPW 1 unit word lists; where a
   word could not be drawn clearly as a simple picture it was swapped for
   another word with the same starting sound — those are marked `sub: true`
   so you can see exactly what differs from the book. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     WORDS — every picture the child sees. text = what is spoken and
     written; icon = the drawing; sub = substituted for the book's word.
     ------------------------------------------------------------------ */
  function w(text, icon, sub) { return { text: text, icon: icon, sub: !!sub }; }

  var WORDS = {
    apple: w('apple', 'apple'), ax: w('ax', 'ax'), ant: w('ant', 'ant'), alligator: w('alligator', 'alligator'),
    bear: w('bear', 'bear'), bird: w('bird', 'bird'), bed: w('bed', 'bed'), banana: w('banana', 'banana'),
    cat: w('cat', 'cat'), cup: w('cup', 'cup'), car: w('car', 'car'), computer: w('computer', 'computer'),
    dog: w('dog', 'dog'), desk: w('desk', 'desk'), doll: w('doll', 'doll'), duck: w('duck', 'duck'),
    egg: w('egg', 'egg'), elephant: w('elephant', 'elephant'), elbow: w('elbow', 'elbow'), envelope: w('envelope', 'envelope'),
    fish: w('fish', 'fish'), fan: w('fan', 'fan'), fork: w('fork', 'fork'), farm: w('farm', 'farm'),
    gorilla: w('gorilla', 'gorilla'), goat: w('goat', 'goat'), gift: w('gift', 'gift'), girl: w('girl', 'girl'),
    horse: w('horse', 'horse'), hat: w('hat', 'hat'), house: w('house', 'hdb'), hotdog: w('hot dog', 'hotdog'),
    insect: w('insect', 'insect'), ink: w('ink', 'ink'), igloo: w('igloo', 'igloo'), iguana: w('iguana', 'iguana'),
    jet: w('jet', 'jet'), jam: w('jam', 'jam'), juice: w('juice', 'juice'), jacket: w('jacket', 'jacket'),
    kangaroo: w('kangaroo', 'kangaroo'), key: w('key', 'key'), king: w('king', 'king'), kite: w('kite', 'kite'),
    lion: w('lion', 'lion'), lamp: w('lamp', 'lamp'), leaf: w('leaf', 'leaf'), lemon: w('lemon', 'lemon'),
    monkey: w('monkey', 'monkey'), milk: w('milk', 'milk'), money: w('money', 'money'), mouse: w('mouse', 'mouse'),
    nut: w('nut', 'nut'), net: w('net', 'net'), nest: w('nest', 'nest'), nose: w('nose', 'nose'),
    octopus: w('octopus', 'octopus'), ox: w('ox', 'ox'), olive: w('olive', 'olive'), ostrich: w('ostrich', 'ostrich'),
    peach: w('peach', 'peach'), pen: w('pen', 'pen'), panda: w('panda', 'panda'), pineapple: w('pineapple', 'pineapple'),
    queen: w('queen', 'queen'), quilt: w('quilt', 'quilt'), question: w('question', 'question'), quiz: w('quiz', 'quiz'),
    rabbit: w('rabbit', 'rabbit'), rose: w('rose', 'rose'), rice: w('rice', 'rice'), robot: w('robot', 'robot'),
    seal: w('seal', 'seal'), sun: w('sun', 'sun'), soap: w('soap', 'soap'), sock: w('sock', 'sock'),
    turtle: w('turtle', 'turtle'), tent: w('tent', 'tent'), tiger: w('tiger', 'tiger'), tomato: w('tomato', 'tomato', true),
    umbrella: w('umbrella', 'umbrella'), up: w('up', 'up'), unicorn: w('unicorn', 'unicorn', true), ukulele: w('ukulele', 'ukulele', true),
    van: w('van', 'van'), vest: w('vest', 'vest'), violin: w('violin', 'violin'), volcano: w('volcano', 'volcano', true),
    wolf: w('wolf', 'wolf'), web: w('web', 'web'), water: w('water', 'water'), watch: w('watch', 'watch'),
    box: w('box', 'box'), fox: w('fox', 'fox'), six: w('six', 'six'),
    yoyo: w('yo-yo', 'yoyo'), yak: w('yak', 'yak'), yogurt: w('yogurt', 'yogurt'), yacht: w('yacht', 'yacht'),
    zebra: w('zebra', 'zebra'), zipper: w('zipper', 'zip'), zero: w('zero', 'zero'), zoo: w('zoo', 'zoo'),

    /* extra pictures used by the Look and Listen level */
    bus: w('bus', 'bus'), train: w('train', 'train'), star: w('star', 'star'), tree: w('tree', 'tree'),
    moon: w('moon', 'moon'), ball: w('ball', 'ball'), pig: w('pig', 'pig'), hen: w('hen', 'hen'),
    bag: w('bag', 'bag'), mug: w('mug', 'mug'), pot: w('pot', 'pot'), ship: w('ship', 'ship'),
    otter: w('otter', 'otter'), durian: w('durian', 'durian'), toast: w('toast', 'toast')
  };

  /* ------------------------------------------------------------------
     ALPHABET — letter, its sound cue for speech synthesis, the Phonics
     Friend where we know it from Rourou's own cards, and four keywords.
     ------------------------------------------------------------------ */
  function L(sound, friend, words) { return { sound: sound, friend: friend, words: words }; }

  var ALPHABET = {
    a: L('aah',  'angry apple',  ['apple', 'ax', 'ant', 'alligator']),
    b: L('buh',  'big bear',     ['bear', 'bird', 'bed', 'banana']),
    c: L('kuh',  null,           ['cat', 'cup', 'car', 'computer']),
    d: L('duh',  null,           ['dog', 'desk', 'doll', 'duck']),
    e: L('eh',   null,           ['egg', 'elephant', 'elbow', 'envelope']),
    f: L('fff',  null,           ['fish', 'fan', 'fork', 'farm']),
    g: L('guh',  'good gorilla', ['gorilla', 'goat', 'gift', 'girl']),
    h: L('huh',  'happy horse',  ['horse', 'hat', 'house', 'hotdog']),
    i: L('ih',   null,           ['insect', 'ink', 'igloo', 'iguana']),
    j: L('juh',  null,           ['jet', 'jam', 'juice', 'jacket']),
    k: L('kuh',  null,           ['kangaroo', 'key', 'king', 'kite']),
    l: L('lll',  null,           ['lion', 'lamp', 'leaf', 'lemon']),
    m: L('mmm',  null,           ['monkey', 'milk', 'money', 'mouse']),
    n: L('nnn',  null,           ['nut', 'net', 'nest', 'nose']),
    o: L('oh',   null,           ['octopus', 'ox', 'olive', 'ostrich']),
    p: L('puh',  null,           ['peach', 'pen', 'panda', 'pineapple']),
    q: L('kwuh', null,           ['queen', 'quilt', 'question', 'quiz']),
    r: L('rrr',  null,           ['rabbit', 'rose', 'rice', 'robot']),
    s: L('sss',  null,           ['seal', 'sun', 'soap', 'sock']),
    t: L('tuh',  null,           ['turtle', 'tent', 'tiger', 'tomato']),
    u: L('uh',   null,           ['umbrella', 'up', 'unicorn', 'ukulele']),
    v: L('vvv',  null,           ['van', 'vest', 'violin', 'volcano']),
    w: L('wuh',  null,           ['wolf', 'web', 'water', 'watch']),
    x: L('ks',   null,           ['box', 'fox', 'six', 'ax']),
    y: L('yuh',  null,           ['yoyo', 'yak', 'yogurt', 'yacht']),
    z: L('zzz',  null,           ['zebra', 'zipper', 'zero', 'zoo'])
  };

  var LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

  /* x is heard at the END of its words, never the start. Everything that
     depends on "starts with this sound" has to know that. */
  var END_SOUND = { x: true };

  /* ------------------------------------------------------------------
     LEVEL 1 · Look and Listen — picture vocabulary, no letters at all.
     Eight themes drawn from the same picture set as the alphabet.
     ------------------------------------------------------------------ */
  var THEMES = [
    { id: 't1', name: 'Pets and Farm',  words: ['cat', 'dog', 'duck', 'hen', 'goat', 'horse', 'pig', 'rabbit'] },
    { id: 't2', name: 'Big Animals',    words: ['lion', 'tiger', 'bear', 'elephant', 'zebra', 'monkey', 'gorilla', 'kangaroo'] },
    { id: 't3', name: 'In the Water',   words: ['fish', 'seal', 'octopus', 'turtle', 'yacht', 'ship', 'water', 'duck'] },
    { id: 't4', name: 'Things to Eat',  words: ['apple', 'banana', 'egg', 'rice', 'milk', 'juice', 'peach', 'lemon'] },
    { id: 't5', name: 'More to Eat',    words: ['tomato', 'pineapple', 'jam', 'yogurt', 'hotdog', 'toast', 'olive', 'durian'] },
    { id: 't6', name: 'At Home',        words: ['bed', 'cup', 'lamp', 'desk', 'quilt', 'key', 'mug', 'pot'] },
    { id: 't7', name: 'Going Places',   words: ['bus', 'car', 'van', 'jet', 'train', 'kite', 'ball', 'box'] },
    { id: 't8', name: 'Things I Wear',  words: ['hat', 'jacket', 'vest', 'sock', 'watch', 'bag', 'zipper', 'nose'] }
  ];

  /* ------------------------------------------------------------------
     LEVELS — the whole journey. Levels 1 and 2 are built; 3 and 4 show
     the road ahead.
     ------------------------------------------------------------------ */
  var LEVELS = [
    { id: 1, name: 'Look and Listen', tint: 'leaf', built: true, age: 'from 3',
      blurb: 'Hear a word, find the picture. No letters yet.' },
    { id: 2, name: 'The Alphabet', tint: 'river', built: true, age: 'from 4',
      blurb: 'A to Z. What each letter says, and the words it lives in.' },
    { id: 3, name: 'Reading Words', tint: 'otter', built: false, age: 'from 5',
      blurb: 'Push the sounds together: c-a-t says cat.' },
    { id: 4, name: 'Reading Books', tint: 'sun', built: false, age: 'from 6',
      blurb: 'Whole sentences, then whole stories.' }
  ];

  /* ------------------------------------------------------------------
     LESSONS — built from the data above so the two never drift apart.
     ------------------------------------------------------------------ */
  var LESSONS = [];

  THEMES.forEach(function (t, i) {
    LESSONS.push({
      id: 'v-' + t.id, level: 1, n: i + 1, name: t.name, icon: WORDS[t.words[0]].icon,
      activities: [
        { type: 'picturePick', words: t.words, rounds: 6 },
        { type: 'memoryMatch', words: t.words, pairs: 3 }
      ]
    });
  });

  LETTERS.forEach(function (l, i) {
    LESSONS.push({
      id: 'a-' + l, level: 2, n: i + 1, letter: l,
      name: l.toUpperCase() + l + '   ' + ALPHABET[l].words.map(function (k) { return WORDS[k].text; }).join(' · '),
      shortName: l.toUpperCase() + l,
      icon: WORDS[ALPHABET[l].words[0]].icon,
      activities: [
        { type: 'meetLetter', letter: l },
        { type: 'startsWith', letter: l, rounds: 4 },
        { type: 'findLetter', letter: l, rounds: 3 },
        { type: 'missingLetter', letter: l, rounds: 3 }
      ]
    });
  });

  /* one review stop after every six letters */
  [['a', 'f'], ['g', 'l'], ['m', 'r'], ['s', 'z']].forEach(function (span, i) {
    var from = LETTERS.indexOf(span[0]), to = LETTERS.indexOf(span[1]);
    var set = LETTERS.slice(from, to + 1);
    LESSONS.push({
      id: 'r-' + span[0] + span[1], level: 2, n: 100 + i,
      name: 'Review ' + span[0].toUpperCase() + '–' + span[1].toUpperCase(),
      shortName: span[0].toUpperCase() + '–' + span[1].toUpperCase(),
      icon: 'trophy', review: true, letters: set,
      activities: [
        { type: 'findLetter', letters: set, rounds: 5 },
        { type: 'startsWith', letters: set, rounds: 5 },
        { type: 'missingLetter', letters: set, rounds: 4 }
      ]
    });
  });

  /* review stops sit after the letters they cover */
  LESSONS.sort(function (a, b) {
    if (a.level !== b.level) return a.level - b.level;
    var order = function (x) {
      if (x.review) return LETTERS.indexOf(x.letters[x.letters.length - 1]) + 0.5;
      if (x.letter) return LETTERS.indexOf(x.letter);
      return x.n - 100;
    };
    return order(a) - order(b);
  });

  window.CONTENT = {
    WORDS: WORDS,
    ALPHABET: ALPHABET,
    LETTERS: LETTERS,
    END_SOUND: END_SOUND,
    THEMES: THEMES,
    LEVELS: LEVELS,
    LESSONS: LESSONS,

    lesson: function (id) {
      return LESSONS.filter(function (l) { return l.id === id; })[0];
    },
    levelLessons: function (id) {
      return LESSONS.filter(function (l) { return l.level === id; });
    },
    /* every word that starts with this letter's sound */
    startWords: function (l) { return ALPHABET[l] ? ALPHABET[l].words : []; },
    /* pictures that do NOT start with this letter, for wrong answers */
    otherWords: function (l, n) {
      var out = [];
      LETTERS.forEach(function (x) {
        if (x !== l) out = out.concat(ALPHABET[x].words);
      });
      return out;
    },
    /* everything the grown-up dashboard tracks */
    trackables: function () {
      return LETTERS.map(function (l) {
        return { key: 'L:' + l, label: l, kind: 'letter' };
      }).concat(THEMES.map(function (t) {
        return { key: 'T:' + t.id, label: t.name, kind: 'theme' };
      }));
    }
  };
})();
