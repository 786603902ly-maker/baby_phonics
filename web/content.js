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
  function r(text, icon, ph) { return { text: text, icon: icon, sub: false, ph: ph }; }

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

    /* ---- Level 3: words she blends and reads for herself.
       `ph` is the sound sequence, so 'sh' and 'ck' count as one sound. ---- */
    pan: r('pan', 'pan', ['p', 'a', 'n']), tap: r('tap', 'tap', ['t', 'a', 'p']),
    pin: r('pin', 'pin', ['p', 'i', 'n']), tin: r('tin', 'tin', ['t', 'i', 'n']),
    wig: r('wig', 'wig', ['w', 'i', 'g']),
    mat: r('mat', 'mat', ['m', 'a', 't']), rat: r('rat', 'rat', ['r', 'a', 't']),
    bat: r('bat', 'bat', ['b', 'a', 't']), cap: r('cap', 'cap', ['c', 'a', 'p']),
    top: r('top', 'top', ['t', 'o', 'p']), mop: r('mop', 'mop', ['m', 'o', 'p']),
    cot: r('cot', 'cot', ['c', 'o', 't']), log: r('log', 'log', ['l', 'o', 'g']),
    leg: r('leg', 'leg', ['l', 'e', 'g']), bun: r('bun', 'bun', ['b', 'u', 'n']),
    nut: r('nut', 'nut', ['n', 'u', 't']), hut: r('hut', 'hut', ['h', 'u', 't']),
    cup: r('cup', 'cup', ['c', 'u', 'p']), jug: r('jug', 'jug', ['j', 'u', 'g']),
    sock: r('sock', 'sock', ['s', 'o', 'ck']), rock: r('rock', 'rock', ['r', 'o', 'ck']),
    lock: r('lock', 'lock', ['l', 'o', 'ck']),
    mud: r('mud', 'mud', ['m', 'u', 'd']),
    thumb: r('thumb', 'thumb', ['th', 'u', 'm']),
    three: r('three', 'three', null),
    chair: r('chair', 'chair', ['ch', 'air']), cheese: r('cheese', 'cheese', null),
    shell: r('shell', 'shell', ['sh', 'e', 'll']), teeth: r('teeth', 'teeth', null),
    cake: r('cake', 'cake', null), bike: r('bike', 'bike', null),
    bone: r('bone', 'bone', null), gate: r('gate', 'gate', null),
    five: r('five', 'five', null),
    frog: r('frog', 'frog', ['f', 'r', 'o', 'g']),
    crab: r('crab', 'crab', ['c', 'r', 'a', 'b']),
    clock: r('clock', 'clock', ['c', 'l', 'o', 'ck']),
    flag: r('flag', 'flag', ['f', 'l', 'a', 'g']),
    drum: r('drum', 'drum', ['d', 'r', 'u', 'm']),
    hand: r('hand', 'hand', ['h', 'a', 'n', 'd']),

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

  /* Words already in the picture set that she can now sound out. Keeping the
     breakdown here rather than deriving it from spelling avoids every English
     exception: 'six' ends in one sound, 'sock' ends in one sound. */
  var SOUNDS_OF = {
    cat: ['c', 'a', 't'], hat: ['h', 'a', 't'], mat: ['m', 'a', 't'], rat: ['r', 'a', 't'],
    bat: ['b', 'a', 't'], pan: ['p', 'a', 'n'], van: ['v', 'a', 'n'], fan: ['f', 'a', 'n'],
    bag: ['b', 'a', 'g'], cap: ['c', 'a', 'p'], tap: ['t', 'a', 'p'], jam: ['j', 'a', 'm'],
    pin: ['p', 'i', 'n'], tin: ['t', 'i', 'n'], pig: ['p', 'i', 'g'], wig: ['w', 'i', 'g'],
    zipper: null, six: ['s', 'i', 'x'],
    dog: ['d', 'o', 'g'], log: ['l', 'o', 'g'], mop: ['m', 'o', 'p'], top: ['t', 'o', 'p'],
    pot: ['p', 'o', 't'], cot: ['c', 'o', 't'], box: ['b', 'o', 'x'], fox: ['f', 'o', 'x'],
    ox: ['o', 'x'],
    bed: ['b', 'e', 'd'], hen: ['h', 'e', 'n'], pen: ['p', 'e', 'n'], net: ['n', 'e', 't'],
    jet: ['j', 'e', 't'], leg: ['l', 'e', 'g'], egg: ['e', 'g'],
    mug: ['m', 'u', 'g'], jug: ['j', 'u', 'g'], sun: ['s', 'u', 'n'], bun: ['b', 'u', 'n'],
    nut: ['n', 'u', 't'], hut: ['h', 'u', 't'], cup: ['c', 'u', 'p'], bus: ['b', 'u', 's'],
    sock: ['s', 'o', 'ck'], rock: ['r', 'o', 'ck'], lock: ['l', 'o', 'ck'], duck: ['d', 'u', 'ck'],
    ship: ['sh', 'i', 'p'], fish: ['f', 'i', 'sh'], chip: ['ch', 'i', 'p'],
    ring: ['r', 'i', 'ng'], king: ['k', 'i', 'ng'],
    nest: ['n', 'e', 's', 't'], tent: ['t', 'e', 'n', 't'], desk: ['d', 'e', 's', 'k'],
    lamp: ['l', 'a', 'm', 'p'], milk: ['m', 'i', 'l', 'k'], web: ['w', 'e', 'b']
  };
  Object.keys(SOUNDS_OF).forEach(function (k) {
    if (WORDS[k] && SOUNDS_OF[k]) WORDS[k].ph = SOUNDS_OF[k];
  });

  var LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

  /* x is heard at the END of its words, never the start. Everything that
     depends on "starts with this sound" has to know that. */
  var END_SOUND = { x: true };

  /* ------------------------------------------------------------------
     TEAMS — two letters that make one sound. Same shape as a letter, so
     the "meet it" card works for both.
     ------------------------------------------------------------------ */
  var TEAMS = {
    ck: { ipa: '/k/', mouth: 'back', team: true,
      tip: 'Back of the tongue lifts. Same sound as c and k.',
      also: 'ck only ever comes at the END of a word, after a short vowel.',
      words: ['sock', 'rock', 'lock', 'duck'] },
    sh: { ipa: '/ʃ/', mouth: 'roundTight', team: true,
      tip: 'Lips pushed forward, teeth close, one long hush.',
      also: 'The quiet sound — sh!',
      words: ['ship', 'fish', 'shop', 'shell'] },
    ch: { ipa: '/tʃ/', mouth: 'roundTight', team: true,
      tip: 'Tongue tip up, then let it burst out — like a little train.',
      words: ['chip', 'chair', 'cheese', 'chin'] },
    th: { ipa: '/θ/', mouth: 'tongueTip', team: true,
      tip: 'Tongue tip peeps out between the teeth, then blow.',
      also: 'In the, this and that it buzzes instead: /ð/.',
      words: ['thumb', 'three', 'thin', 'thick'] },
    ng: { ipa: '/ŋ/', mouth: 'back', team: true,
      tip: 'Back of the tongue up and hum through your nose.',
      also: 'ng comes at the END — ring, king, sing.',
      words: ['ring', 'king', 'wing', 'song'] }
  };
  /* only the first entries have pictures; the rest are said, not shown */
  Object.keys(TEAMS).forEach(function (t) {
    TEAMS[t].words = TEAMS[t].words.filter(function (k) { return !!WORDS[k]; });
  });

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
    { id: 3, name: 'Reading Words', tint: 'otter', built: true, age: 'from 5',
      blurb: 'Push the sounds together: c-a-t says cat.' },
    { id: 4, name: 'Reading Books', tint: 'sun', built: true, age: 'from 6',
      blurb: 'Whole sentences, then whole stories.' },
    { id: 5, name: 'Same Sound, New Look', tint: 'leaf', built: false, age: 'from 6',
      blurb: 'ai, ay and a-e all say the same thing. So do ee and ea, oa and ow.' },
    { id: 6, name: 'Longer Words', tint: 'river', built: false, age: 'from 6',
      blurb: 'Two syllables, and the endings -ing, -ed, -er. Soft c and soft g.' },
    { id: 7, name: 'Real Books', tint: 'otter', built: false, age: 'from 7',
      blurb: 'Reading a whole book for the story, and writing words down from hearing them.' }
  ];

  /* ------------------------------------------------------------------
     LEVEL 3 · Reading Words — one short vowel at a time, then the teams,
     then two sounds together, then magic e.
     ------------------------------------------------------------------ */
  var WORDSETS = [
    { id: 'a', name: 'Sound It Out: a', vowel: 'a', words: ['cat', 'hat', 'mat', 'rat', 'bat', 'pan', 'van', 'fan', 'bag', 'cap', 'tap', 'jam'] },
    { id: 'i', name: 'Sound It Out: i', vowel: 'i', words: ['pin', 'tin', 'pig', 'wig', 'six'] },
    { id: 'o', name: 'Sound It Out: o', vowel: 'o', words: ['dog', 'log', 'mop', 'top', 'pot', 'cot', 'box', 'fox'] },
    { id: 'e', name: 'Sound It Out: e', vowel: 'e', words: ['bed', 'hen', 'pen', 'net', 'jet', 'leg', 'web'] },
    { id: 'u', name: 'Sound It Out: u', vowel: 'u', words: ['mug', 'jug', 'sun', 'bun', 'nut', 'hut', 'cup', 'bus', 'mud'] }
  ];

  var BLENDSETS = [
    { id: 'start', name: 'Two Sounds to Start', words: ['frog', 'crab', 'clock', 'flag', 'drum'] },
    { id: 'end', name: 'Two Sounds to Finish', words: ['nest', 'tent', 'desk', 'lamp', 'milk', 'hand'] }
  ];

  /* Magic e is a pattern, not a blend — she reads these whole. */
  var MAGICE = ['cake', 'bike', 'bone', 'gate', 'kite', 'five', 'nose', 'rose'];

  /* ------------------------------------------------------------------
     LEVEL 4 · Reading Books — decodable sentences, then short stories.
     `pic` is the one picture that answers "which one is this about?".
     ------------------------------------------------------------------ */
  var SIGHT = ['the', 'a', 'is', 'in', 'on', 'it', 'and', 'I', 'can', 'see',
    'my', 'to', 'at', 'has', 'was', 'up', 'no', 'said', 'he', 'she'];

  var SENTENCES = [
    { text: 'The cat sat on the mat.', pic: 'cat', not: ['dog', 'pig'] },
    { text: 'I can see a big bus.', pic: 'bus', not: ['van', 'jet'] },
    { text: 'A fox is in the box.', pic: 'fox', not: ['cat', 'duck'] },
    { text: 'The pig is in the mud.', pic: 'pig', not: ['hen', 'frog'] },
    { text: 'My dog has a bone.', pic: 'dog', not: ['cat', 'rat'] },
    { text: 'The hen is on the nest.', pic: 'hen', not: ['duck', 'bird'] },
    { text: 'A red bus and a big van.', pic: 'van', not: ['car', 'jet'] },
    { text: 'I can see six ducks.', pic: 'duck', not: ['fish', 'hen'] },
    { text: 'The sun is up.', pic: 'sun', not: ['moon', 'star'] },
    { text: 'My cup is on the desk.', pic: 'cup', not: ['mug', 'pot'] },
    { text: 'A frog sat on a log.', pic: 'frog', not: ['fish', 'rat'] },
    { text: 'The king has a big ring.', pic: 'king', not: ['queen', 'girl'] }
  ];

  var STORIES = [
    { id: 'catrat', title: 'The Cat and the Rat',
      pages: [
        { text: 'A cat sat on a mat.', pic: 'cat' },
        { text: 'A rat ran up to the cat.', pic: 'rat' },
        { text: 'The cat had a nap.', pic: 'bed' },
        { text: 'The rat sat on the cat!', pic: 'rat' },
        { text: 'The cat got up. The rat ran.', pic: 'cat' }
      ],
      questions: [
        { q: 'Who sat on the mat?', pic: 'cat', not: ['rat', 'dog'] },
        { q: 'Who sat on the cat?', pic: 'rat', not: ['hen', 'fox'] }
      ] },
    { id: 'foxbox', title: 'The Fox and the Box',
      pages: [
        { text: 'A fox got a big box.', pic: 'fox' },
        { text: 'A hot bun was in it.', pic: 'bun' },
        { text: 'The fox had the bun.', pic: 'fox' },
        { text: 'It was too hot!', pic: 'sun' },
        { text: 'The fox ran to the log.', pic: 'log' }
      ],
      questions: [
        { q: 'What was in the box?', pic: 'bun', not: ['nut', 'egg'] },
        { q: 'Where did the fox run?', pic: 'log', not: ['bed', 'bus'] }
      ] },
    { id: 'pigmud', title: 'Pig in the Mud',
      pages: [
        { text: 'A pig sat in the mud.', pic: 'pig' },
        { text: 'A hen ran up to him.', pic: 'hen' },
        { text: '"Get up!" said the hen.', pic: 'hen' },
        { text: 'The pig did not get up.', pic: 'pig' },
        { text: 'So the hen sat in the mud too!', pic: 'mud' }
      ],
      questions: [
        { q: 'Who sat in the mud first?', pic: 'pig', not: ['hen', 'duck'] },
        { q: 'Who came to the pig?', pic: 'hen', not: ['dog', 'goat'] }
      ] }
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

  /* ---- Level 3 ---- */
  WORDSETS.forEach(function (set, i) {
    LESSONS.push({
      id: 'w-' + set.id, level: 3, n: i + 1, name: set.name,
      shortName: set.name.replace('Sound It Out: ', 'Short '),
      icon: WORDS[set.words[0]].icon, words: set.words,
      activities: [
        { type: 'soundOut', words: set.words, rounds: 4 },
        { type: 'buildWord', words: set.words, rounds: 3 },
        { type: 'wordPick', words: set.words, rounds: 3 }
      ]
    });
  });

  LESSONS.push({
    id: 'w-review1', level: 3, n: 6, name: 'Read Them All', shortName: 'Read Them All',
    icon: 'trophy', review: true,
    words: WORDSETS.reduce(function (a, s2) { return a.concat(s2.words); }, []),
    activities: [
      { type: 'readPick', words: WORDSETS.reduce(function (a, s2) { return a.concat(s2.words); }, []), rounds: 6 },
      { type: 'wordPick', words: WORDSETS.reduce(function (a, s2) { return a.concat(s2.words); }, []), rounds: 5 }
    ]
  });

  ['ck', 'sh', 'ch', 'th', 'ng'].forEach(function (t, i) {
    var ws = TEAMS[t].words.filter(function (k) { return WORDS[k]; });
    LESSONS.push({
      id: 't-' + t, level: 3, n: 10 + i, team: t,
      name: 'Team ' + t, shortName: t,
      icon: WORDS[ws[0]].icon,
      activities: [
        { type: 'meetTeam', team: t },
        { type: 'soundOut', words: ws.filter(function (k) { return WORDS[k].ph; }), rounds: 2 },
        { type: 'wordPick', words: ws, rounds: 3 },
        { type: 'readPick', words: ws, rounds: 2 }
      ].filter(function (a) { return a.type !== 'soundOut' || a.words.length; })
    });
  });

  BLENDSETS.forEach(function (set, i) {
    LESSONS.push({
      id: 'b-' + set.id, level: 3, n: 20 + i, name: set.name, shortName: set.name.replace('Two Sounds ', ''),
      icon: WORDS[set.words[0]].icon, words: set.words,
      activities: [
        { type: 'soundOut', words: set.words, rounds: 3 },
        { type: 'buildWord', words: set.words, rounds: 2 },
        { type: 'readPick', words: set.words, rounds: 3 }
      ]
    });
  });

  LESSONS.push({
    id: 'w-magice', level: 3, n: 30, name: 'Magic e', shortName: 'Magic e',
    icon: 'cake', words: MAGICE, magice: true,
    activities: [
      { type: 'magicE', words: MAGICE, rounds: 4 },
      { type: 'readPick', words: MAGICE, rounds: 4 },
      { type: 'wordPick', words: MAGICE, rounds: 3 }
    ]
  });

  /* ---- Level 4 ---- */
  LESSONS.push({
    id: 's-build1', level: 4, n: 1, name: 'My First Sentence', shortName: 'First Sentence',
    icon: 'cat',
    activities: [{ type: 'buildSentence', from: 0, rounds: 4 }]
  });
  LESSONS.push({
    id: 's-pick1', level: 4, n: 2, name: 'Read and Choose', shortName: 'Read & Choose',
    icon: 'quiz',
    activities: [{ type: 'sentencePick', from: 0, rounds: 6 }]
  });
  LESSONS.push({
    id: 's-build2', level: 4, n: 3, name: 'More Sentences', shortName: 'More Sentences',
    icon: 'pen',
    activities: [{ type: 'buildSentence', from: 6, rounds: 4 }]
  });
  STORIES.forEach(function (st, i) {
    LESSONS.push({
      id: 'st-' + st.id, level: 4, n: 10 + i, name: st.title, shortName: st.title,
      icon: WORDS[st.pages[0].pic].icon, story: st.id,
      activities: [{ type: 'story', story: st.id }]
    });
  });
  LESSONS.push({
    id: 's-pick2', level: 4, n: 20, name: 'Read and Choose Again', shortName: 'Read & Choose 2',
    icon: 'trophy', review: true,
    activities: [{ type: 'sentencePick', from: 6, rounds: 6 }]
  });

  /* review stops sit after the letters they cover */
  LESSONS.sort(function (a, b) {
    if (a.level !== b.level) return a.level - b.level;
    var order = function (x) {
      if (x.level !== 2) return x.n;
      if (x.letters) return LETTERS.indexOf(x.letters[x.letters.length - 1]) + 0.5;
      if (x.letter) return LETTERS.indexOf(x.letter);
      return x.n - 100;
    };
    return order(a) - order(b);
  });

  window.CONTENT = {
    WORDS: WORDS,
    ALPHABET: ALPHABET,
    TEAMS: TEAMS,
    SIGHT: SIGHT,
    SENTENCES: SENTENCES,
    STORIES: STORIES,
    MAGICE: MAGICE,
    story: function (id) { return STORIES.filter(function (x) { return x.id === id; })[0]; },
    /* letters and teams share a shape, so one lookup serves both cards */
    sound: function (k) { return ALPHABET[k] || TEAMS[k]; },
    readable: function () {
      return Object.keys(WORDS).filter(function (k) { return WORDS[k].ph; });
    },
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
