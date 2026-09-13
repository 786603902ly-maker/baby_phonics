/* content.js — the whole curriculum as data.
   Adding or changing a lesson is a data edit, never a code edit.

   The alphabet keyword sets follow Oxford Phonics World Level 1, the book
   the child already uses. Four sets are confirmed against her own printed
   cards: a, b, g, h. The rest come from published OPW 1 unit word lists; where a
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
     Friend where a printed card confirms it, and four keywords.
     ------------------------------------------------------------------ */
  /* sound  : espeak-style fallback spelling, used only if the bundled clip
               and any parent recording are both missing
     ipa    : the phoneme Oxford Phonics World 1 teaches, British English
              (Oxford Learner's Dictionaries convention)
     also   : the other job this letter does, for the grown-up
     mouth  : which mouth picture in mouths.js
     tip    : how to make the sound
     friend : the OPW Phonics Friend, where a printed card confirms it */
  function L(o) { return o; }

  var ALPHABET = {
    a: L({ sound: 'aah', ipa: '/æ/', mouth: 'wide', friend: 'angry apple',
      tip: 'Open wide, tongue flat and low.',
      also: 'Its name sound is /eɪ/ — cake, rain.',
      words: ['apple', 'ax', 'ant', 'alligator'] }),
    b: L({ sound: 'buh', ipa: '/b/', mouth: 'closed', friend: 'big bear',
      tip: 'Lips together, then pop them open.',
      words: ['bear', 'bird', 'bed', 'banana'] }),
    c: L({ sound: 'kuh', ipa: '/k/', mouth: 'back',
      tip: 'Back of the tongue lifts to the roof of the mouth.',
      also: 'Before e, i or y it says /s/ — city, cent, cycle.',
      words: ['cat', 'cup', 'car', 'computer'] }),
    d: L({ sound: 'duh', ipa: '/d/', mouth: 'tongueTip',
      tip: 'Tongue tip behind the top teeth, then let go — with voice.',
      words: ['dog', 'desk', 'doll', 'duck'] }),
    e: L({ sound: 'eh', ipa: '/e/', mouth: 'mid',
      tip: 'Mouth half open, tongue in the middle.',
      also: 'Its name sound is /iː/ — he, tree.',
      words: ['egg', 'elephant', 'elbow', 'envelope'] }),
    f: L({ sound: 'fff', ipa: '/f/', mouth: 'teethLip',
      tip: 'Top teeth on the bottom lip, blow gently. No voice.',
      words: ['fish', 'fan', 'fork', 'farm'] }),
    g: L({ sound: 'guh', ipa: '/ɡ/', mouth: 'back', friend: 'good gorilla',
      tip: 'Back of the tongue lifts to the roof — with voice.',
      also: 'Before e, i or y it often says /dʒ/ — giant, gem.',
      words: ['gorilla', 'goat', 'gift', 'girl'] }),
    h: L({ sound: 'huh', ipa: '/h/', mouth: 'openBreath', friend: 'happy horse',
      tip: 'Mouth open, just breathe out. No voice.',
      words: ['horse', 'hat', 'house', 'hotdog'] }),
    i: L({ sound: 'ih', ipa: '/ɪ/', mouth: 'narrow',
      tip: 'Small smile, tongue high at the front.',
      also: 'Its name sound is /aɪ/ — bike, five.',
      words: ['insect', 'ink', 'igloo', 'iguana'] }),
    j: L({ sound: 'juh', ipa: '/dʒ/', mouth: 'tongueTip',
      tip: 'Tongue tip up, then push the air out with voice.',
      words: ['jet', 'jam', 'juice', 'jacket'] }),
    k: L({ sound: 'kuh', ipa: '/k/', mouth: 'back',
      tip: 'Back of the tongue lifts to the roof. Same sound as hard c.',
      words: ['kangaroo', 'key', 'king', 'kite'] }),
    l: L({ sound: 'lll', ipa: '/l/', mouth: 'tongueTip',
      tip: 'Tongue tip up behind the top teeth, voice flows round the sides.',
      words: ['lion', 'lamp', 'leaf', 'lemon'] }),
    m: L({ sound: 'mmm', ipa: '/m/', mouth: 'closed',
      tip: 'Lips together and hum — the sound comes out of your nose.',
      words: ['monkey', 'milk', 'money', 'mouse'] }),
    n: L({ sound: 'nnn', ipa: '/n/', mouth: 'tongueTip',
      tip: 'Tongue tip up and hum — out of your nose again.',
      words: ['nut', 'net', 'nest', 'nose'] }),
    o: L({ sound: 'oh', ipa: '/ɒ/', mouth: 'round',
      tip: 'Jaw down, lips a little round.',
      also: 'Its name sound is /əʊ/ — go, boat.',
      words: ['octopus', 'ox', 'olive', 'ostrich'] }),
    p: L({ sound: 'puh', ipa: '/p/', mouth: 'closed',
      tip: 'Lips together, pop with a puff of air. No voice.',
      words: ['peach', 'pen', 'panda', 'pineapple'] }),
    q: L({ sound: 'kwuh', ipa: '/kw/', mouth: 'roundTight',
      tip: 'Back of the tongue up for /k/, then round your lips for /w/.',
      also: 'q almost never appears without u — qu together say /kw/.',
      words: ['queen', 'quilt', 'question', 'quiz'] }),
    r: L({ sound: 'rrr', ipa: '/r/', mouth: 'curl',
      tip: 'Tongue curls back without touching, lips a little round.',
      words: ['rabbit', 'rose', 'rice', 'robot'] }),
    s: L({ sound: 'sss', ipa: '/s/', mouth: 'smileTeeth',
      tip: 'Teeth almost closed, hiss like a snake. No voice.',
      also: 'At the end of many words it says /z/ — dogs, beds.',
      words: ['seal', 'sun', 'soap', 'sock'] }),
    t: L({ sound: 'tuh', ipa: '/t/', mouth: 'tongueTip',
      tip: 'Tongue tip behind the top teeth, tap. No voice.',
      words: ['turtle', 'tent', 'tiger', 'tomato'] }),
    u: L({ sound: 'uh', ipa: '/ʌ/', mouth: 'relax',
      tip: 'Mouth relaxed and half open, tongue in the middle.',
      also: 'Its name sound is /juː/ — music, unicorn.',
      words: ['umbrella', 'up', 'unicorn', 'ukulele'] }),
    v: L({ sound: 'vvv', ipa: '/v/', mouth: 'teethLip',
      tip: 'Top teeth on the bottom lip and buzz — f with the voice on.',
      words: ['van', 'vest', 'violin', 'volcano'] }),
    w: L({ sound: 'wuh', ipa: '/w/', mouth: 'roundTight',
      tip: 'Push your lips forward into a small circle, then open.',
      words: ['wolf', 'web', 'water', 'watch'] }),
    x: L({ sound: 'ks', ipa: '/ks/', mouth: 'back',
      tip: 'Two sounds joined: /k/ then /s/.',
      also: 'x comes at the END of its words — box, fox, six.',
      words: ['box', 'fox', 'six', 'ax'] }),
    y: L({ sound: 'yuh', ipa: '/j/', mouth: 'narrow',
      tip: 'Tongue high at the front, then glide away.',
      also: 'At the end of a word it says /aɪ/ — my — or /i/ — happy.',
      words: ['yoyo', 'yak', 'yogurt', 'yacht'] }),
    z: L({ sound: 'zzz', ipa: '/z/', mouth: 'smileTeeth',
      tip: 'Teeth almost closed and buzz — s with the voice on.',
      words: ['zebra', 'zipper', 'zero', 'zoo'] })
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
      id: 'v-' + t.id, level: 1, n: i + 1, name: t.name, theme: t.id, icon: WORDS[t.words[0]].icon,
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
