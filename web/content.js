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
  /* A word with no picture: read, spelled and sorted, but never offered as
     one of three pictures to choose between. `day`, `out` and `her` are
     among the commonest words in English and none of them can be drawn. */
  function t(text, ph) { return { text: text, icon: null, sub: false, ph: ph, noPic: true }; }

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
    chip: r('chip', 'chip', ['ch', 'i', 'p']), ring: r('ring', 'ring', ['r', 'i', 'ng']),
    shell: r('shell', 'shell', ['sh', 'e', 'l']), teeth: r('teeth', 'teeth', null),
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
    otter: w('otter', 'otter'), durian: w('durian', 'durian'), toast: w('toast', 'toast'),

    /* ---- Level 5: the vowel teams. The sound a team makes is ONE sound, so
       it is one entry in `ph` — `rain` is r-ai-n, three sounds, not four.
       Words with no picture are `t()`: they are read and sorted, never shown
       as a choice of pictures. ---- */
    rain: r('rain', 'rain', ['r', 'ai', 'n']), snail: r('snail', 'snail', ['s', 'n', 'ai', 'l']),
    tail: r('tail', 'tail', ['t', 'ai', 'l']),
    feet: r('feet', 'feet', ['f', 'ee', 't']), bee: r('bee', 'bee', ['b', 'ee']),
    seed: r('seed', 'seed', ['s', 'ee', 'd']), sea: r('sea', 'sea', ['s', 'ee']),
    boat: r('boat', 'boat', ['b', 'oa', 't']), coat: r('coat', 'coat', ['c', 'oa', 't']),
    road: r('road', 'road', ['r', 'oa', 'd']), snow: r('snow', 'snow', ['s', 'n', 'oa']),
    night: r('night', 'night', ['n', 'igh', 't']), light: r('light', 'light', ['l', 'igh', 't']),
    pie: r('pie', 'pie', ['p', 'igh']), fly: r('fly', 'fly', ['f', 'l', 'igh']),
    spoon: r('spoon', 'spoon', ['s', 'p', 'oo', 'n']), pool: r('pool', 'pool', ['p', 'oo', 'l']),
    boot: r('boot', 'boot', ['b', 'oo', 't']),
    cook: r('cook', 'cook', ['c', 'uu', 'k']), foot: r('foot', 'foot', ['f', 'uu', 't']),
    hook: r('hook', 'hook', ['h', 'uu', 'k']), wood: r('wood', 'wood', ['w', 'uu', 'd']),
    cloud: r('cloud', 'cloud', ['c', 'l', 'ou', 'd']), cow: r('cow', 'cow', ['c', 'ou']),
    owl: r('owl', 'owl', ['ou', 'l']), town: r('town', 'town', ['t', 'ou', 'n']),
    coin: r('coin', 'coin', ['c', 'oi', 'n']), oil: r('oil', 'oil', ['oi', 'l']),
    boy: r('boy', 'boy', ['b', 'oi']), toy: r('toy', 'toy', ['t', 'oi']),
    jar: r('jar', 'jar', ['j', 'ar']), arm: r('arm', 'arm', ['ar', 'm']),
    corn: r('corn', 'corn', ['c', 'or', 'n']), saw: r('saw', 'saw', ['s', 'or']),
    paw: r('paw', 'paw', ['p', 'or']),
    shirt: r('shirt', 'shirt', ['sh', 'er', 't']), nurse: r('nurse', 'nurse', ['n', 'er', 's']),
    fern: r('fern', 'fern', ['f', 'er', 'n']),
    hair: r('hair', 'hair', ['h', 'air']), pair: r('pair', 'pair', ['p', 'air']),
    deer: r('deer', 'deer', ['d', 'ear']),

    /* ---- Level 6: longer words. ---- */
    book: w('book', 'book'), basket: w('basket', 'basket'), muffin: w('muffin', 'muffin'),
    pencil: w('pencil', 'pencil'), carrot: w('carrot', 'carrot'),
    sunset: w('sunset', 'sunset'), cupcake: w('cupcake', 'cupcake'),
    raindrop: w('raindrop', 'raindrop'), football: w('football', 'football'),
    popcorn: w('popcorn', 'popcorn'), snowman: w('snowman', 'snowman'),
    jumping: w('jumping', 'jumping'), sleeping: w('sleeping', 'sleeping'),
    reading: w('reading', 'reading'), painting: w('painting', 'painting'),
    farmer: w('farmer', 'farmer'), baker: w('baker', 'baker'), teacher: w('teacher', 'teacher'),
    city: w('city', 'city'), ice: w('ice', 'ice'), mice: w('mice', 'mice'),
    circle: w('circle', 'circle'), face: w('face', 'face'),
    giant: w('giant', 'giant'), cage: w('cage', 'cage'), giraffe: w('giraffe', 'giraffe'),
    orange: w('orange', 'orange'), gem: w('gem', 'gem'),

    /* ---- read and sorted, never shown as a picture. Some of English's
       commonest words are things you cannot draw. ---- */
    day: t('day', ['d', 'ai']), play: t('play', ['p', 'l', 'ai']),
    say: t('say', ['s', 'ai']), way: t('way', ['w', 'ai']),
    paint: t('paint', ['p', 'ai', 'n', 't']), name: t('name', ['n', 'ai', 'm']),
    bean: t('bean', ['b', 'ee', 'n']),
    each: t('each', ['ee', 'ch']), read: t('read', ['r', 'ee', 'd']),
    low: t('low', ['l', 'oa']), grow: t('grow', ['g', 'r', 'oa']),
    home: t('home', ['h', 'oa', 'm']), toe: t('toe', ['t', 'oa']),
    high: t('high', ['h', 'igh']), tie: t('tie', ['t', 'igh']),
    sky: t('sky', ['s', 'k', 'igh']), my: t('my', ['m', 'igh']),
    food: t('food', ['f', 'oo', 'd']), soon: t('soon', ['s', 'oo', 'n']),
    good: t('good', ['g', 'uu', 'd']), look: t('look', ['l', 'uu', 'k']),
    out: t('out', ['ou', 't']), down: t('down', ['d', 'ou', 'n']),
    now: t('now', ['n', 'ou']), how: t('how', ['h', 'ou']),
    soil: t('soil', ['s', 'oi', 'l']), join: t('join', ['j', 'oi', 'n']),
    enjoy: t('enjoy', null), park: t('park', ['p', 'ar', 'k']),
    hard: t('hard', ['h', 'ar', 'd']), sort: t('sort', ['s', 'or', 't']),
    claw: t('claw', ['c', 'l', 'or']), draw: t('draw', ['d', 'r', 'or']),
    her: t('her', ['h', 'er']), turn: t('turn', ['t', 'er', 'n']),
    burn: t('burn', ['b', 'er', 'n']), stir: t('stir', ['s', 't', 'er']),
    care: t('care', ['c', 'air']), near: t('near', ['n', 'ear']),
    year: t('year', ['j', 'ear']), beard: t('beard', ['b', 'ear', 'd']),
    green: t('green', ['g', 'r', 'ee', 'n']),
    ear: r('ear', 'ear', ['ear']),

    /* ---- Level 6: the bases and the words they become. Built and read as
       letters, so none of them needs a sound breakdown — and most of them
       could not have one, because `ed` is /t/ in jumped and /ɪd/ in
       painted and the spelling does not say which. ---- */
    jump: t('jump', ['j', 'u', 'm', 'p']), sleep: t('sleep', ['s', 'l', 'ee', 'p']),
    sing: t('sing', ['s', 'i', 'ng']), land: t('land', ['l', 'a', 'n', 'd']),
    want: t('want', null), help: t('help', ['h', 'e', 'l', 'p']),
    bake: t('bake', null), teach: t('teach', ['t', 'ee', 'ch']),
    cats: t('cats', null), dogs: t('dogs', null), cups: t('cups', null),
    hats: t('hats', null), buses: t('buses', null), foxes: t('foxes', null),
    singing: t('singing', null), looking: t('looking', null),
    jumped: t('jumped', null), painted: t('painted', null),
    looked: t('looked', null), played: t('played', null),
    wanted: t('wanted', null), landed: t('landed', null),
    singer: t('singer', null), helper: t('helper', null), painter: t('painter', null),
    drop: t('drop', ['d', 'r', 'o', 'p']), man: t('man', ['m', 'a', 'n']),
    pop: t('pop', ['p', 'o', 'p']), set: t('set', ['s', 'e', 't'])
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
    lamp: ['l', 'a', 'm', 'p'], milk: ['m', 'i', 'l', 'k'], web: ['w', 'e', 'b'],

    /* Pictures that have been in the app since Level 1 and turn out to be
       vowel-team words. Adding the breakdown here is what lets Level 5 sound
       them out — without it `moon` and `zoo` were pictures on the oo card
       that the oo card could not take apart. The magic-e words (cake, bike,
       bone, gate, kite, five, nose, rose) stay without one on purpose: the
       silent e is a pattern read whole, which is what Level 3 teaches. */
    train: ['t', 'r', 'ai', 'n'],
    tree: ['t', 'r', 'ee'], leaf: ['l', 'ee', 'f'], peach: ['p', 'ee', 'ch'],
    goat: ['g', 'oa', 't'],
    moon: ['m', 'oo', 'n'], zoo: ['z', 'oo'], book: ['b', 'uu', 'k'],
    house: ['h', 'ou', 's'], mouse: ['m', 'ou', 's'],
    car: ['c', 'ar'], star: ['s', 't', 'ar'], farm: ['f', 'ar', 'm'],
    fork: ['f', 'or', 'k'], horse: ['h', 'or', 's'],
    bird: ['b', 'er', 'd'], girl: ['g', 'er', 'l'],
    bear: ['b', 'air'], ear: ['ear']
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
     VOWEL TEAMS — Level 5. Two or three letters that spell one vowel
     sound, and the whole point of the level: the SAME sound has more
     than one look. /eɪ/ is `ai` in rain, `ay` in day and `a_e` in cake,
     and a child who knows only one of the three stalls on the other two.

     Same shape as TEAMS above, so the "meet it" card works unchanged.
     Two things are new:

       `mouth2` — a diphthong is a movement between two mouth positions,
                  so the card shows where it starts and where it ends
                  rather than one static shape that is true of neither.
       `spells` — every way English writes this sound, with the words
                  that use each. This is what the sorting game deals
                  from, and what the grown-up page prints.
     ------------------------------------------------------------------ */
  function V(o) { o.team = true; o.vowel = true; return o; }

  var VOWELTEAMS = {
    ai: V({ ipa: '/eɪ/', mouth: 'mid', mouth2: 'narrow',
      tip: 'Start half open, then slide up into a smile. One sound, moving.',
      also: 'Three looks: ai in the middle, ay at the end, a_e with magic e.',
      words: ['rain', 'train', 'snail', 'tail'],
      spells: [
        { as: 'ai', where: 'in the middle', words: ['rain', 'train', 'snail', 'tail', 'paint'] },
        { as: 'ay', where: 'at the end', words: ['day', 'play', 'say', 'way'] },
        { as: 'a_e', where: 'magic e', words: ['cake', 'gate', 'name'] }
      ] }),
    ee: V({ ipa: '/iː/', mouth: 'narrow',
      tip: 'A long smile, tongue high at the front. Hold it.',
      also: 'ee in the middle or at the end; ea is the same sound in most words.',
      words: ['feet', 'tree', 'bee', 'seed', 'leaf', 'sea'],
      spells: [
        { as: 'ee', where: 'the usual one', words: ['feet', 'tree', 'bee', 'seed', 'green'] },
        { as: 'ea', where: 'just as common', words: ['leaf', 'peach', 'sea', 'bean', 'each', 'read'] }
      ] }),
    oa: V({ ipa: '/əʊ/', mouth: 'relax', mouth2: 'roundTight',
      tip: 'Start relaxed, then round the lips forward. One sound, moving.',
      also: 'oa in the middle, ow at the end, o_e with magic e.',
      words: ['boat', 'coat', 'goat', 'road', 'snow'],
      spells: [
        { as: 'oa', where: 'in the middle', words: ['boat', 'coat', 'goat', 'road'] },
        { as: 'ow', where: 'at the end', words: ['snow', 'low', 'grow'] },
        { as: 'o_e', where: 'magic e', words: ['bone', 'nose', 'rose', 'home'] }
      ] }),
    igh: V({ ipa: '/aɪ/', mouth: 'wide', mouth2: 'narrow',
      tip: 'Open wide, then slide up into a smile. One sound, moving.',
      also: 'igh before t, ie or y at the end, i_e with magic e.',
      words: ['night', 'light', 'pie', 'fly', 'bike', 'kite'],
      spells: [
        { as: 'igh', where: 'before t', words: ['night', 'light', 'high'] },
        { as: 'ie', where: 'at the end', words: ['pie', 'tie'] },
        { as: 'y', where: 'at the end', words: ['fly', 'sky', 'my'] },
        { as: 'i_e', where: 'magic e', words: ['bike', 'kite', 'five'] }
      ] }),
    oo: V({ ipa: '/uː/', mouth: 'roundTight',
      tip: 'Lips pushed right forward into a small circle. Hold it.',
      also: 'The long oo. The SAME two letters also say the short one — book.',
      words: ['moon', 'spoon', 'pool', 'boot', 'zoo'],
      spells: [
        { as: 'oo', where: 'almost always', words: ['moon', 'spoon', 'pool', 'boot', 'zoo', 'food', 'soon'] }
      ] }),
    uu: V({ ipa: '/ʊ/', mouth: 'round',
      tip: 'A short push of the lips. Quick — do not hold it.',
      also: 'The same oo as moon, but short. Only the word tells you which.',
      words: ['book', 'cook', 'foot', 'hook', 'wood'],
      spells: [
        { as: 'oo', where: 'the short one', words: ['book', 'cook', 'foot', 'hook', 'wood', 'good', 'look'] }
      ] }),
    ou: V({ ipa: '/aʊ/', mouth: 'wide', mouth2: 'roundTight',
      tip: 'Open wide, then round the lips. Like a small surprise.',
      also: 'ou in the middle, ow at the end — and ow is also the oa sound in snow.',
      words: ['cloud', 'house', 'mouse', 'cow', 'owl', 'town'],
      spells: [
        { as: 'ou', where: 'in the middle', words: ['cloud', 'house', 'mouse', 'out'] },
        { as: 'ow', where: 'at the end, and before n', words: ['cow', 'owl', 'town', 'down', 'now', 'how'] }
      ] }),
    oi: V({ ipa: '/ɔɪ/', mouth: 'round', mouth2: 'narrow',
      tip: 'Round lips, then slide into a smile. One sound, moving.',
      also: 'oi in the middle, oy at the end. This pair has no exceptions.',
      words: ['coin', 'oil', 'boy', 'toy'],
      spells: [
        { as: 'oi', where: 'in the middle', words: ['coin', 'oil', 'soil', 'join'] },
        { as: 'oy', where: 'at the end', words: ['boy', 'toy', 'enjoy'] }
      ] }),
    ar: V({ ipa: '/ɑː/', mouth: 'wide',
      tip: 'Open wide and hold. The doctor sound — aaah.',
      also: 'In British English the r is not said: car is /kɑː/.',
      words: ['car', 'star', 'farm', 'jar', 'arm'],
      spells: [
        { as: 'ar', where: 'the only one', words: ['car', 'star', 'farm', 'jar', 'arm', 'park', 'hard'] }
      ] }),
    or: V({ ipa: '/ɔː/', mouth: 'round',
      tip: 'Round lips, tongue back, and hold.',
      also: 'or in the middle, aw or au elsewhere — and ore at the end.',
      words: ['corn', 'fork', 'horse', 'saw', 'paw'],
      spells: [
        { as: 'or', where: 'in the middle', words: ['corn', 'fork', 'horse', 'sort'] },
        { as: 'aw', where: 'at the end', words: ['saw', 'paw', 'claw', 'draw'] }
      ] }),
    er: V({ ipa: '/ɜː/', mouth: 'relax',
      tip: 'Mouth relaxed, tongue in the middle, and hold. The thinking sound.',
      also: 'Three spellings, one sound: her, bird, turn. Nothing tells you which.',
      words: ['bird', 'girl', 'shirt', 'nurse', 'fern'],
      spells: [
        { as: 'er', where: 'as in her', words: ['her', 'fern'] },
        { as: 'ir', where: 'as in bird', words: ['bird', 'girl', 'shirt', 'stir'] },
        { as: 'ur', where: 'as in turn', words: ['turn', 'nurse', 'burn'] }
      ] }),
    air: V({ ipa: '/eə/', mouth: 'mid', mouth2: 'relax',
      tip: 'Start half open, then relax. It fades away rather than stopping.',
      also: 'air, are and ear all spell it — hair, care, bear.',
      words: ['hair', 'chair', 'pair', 'bear'],
      spells: [
        { as: 'air', where: 'the usual one', words: ['hair', 'chair', 'pair'] },
        { as: 'are', where: 'with magic e', words: ['care'] },
        { as: 'ear', where: 'in a few words', words: ['bear'] }
      ] }),
    ear: V({ ipa: '/ɪə/', mouth: 'narrow', mouth2: 'relax',
      tip: 'Start with a smile, then relax. It fades away.',
      also: 'The same three letters as in bear, saying something else. English.',
      words: ['ear', 'deer'],
      spells: [
        { as: 'ear', where: 'the usual one', words: ['ear', 'near', 'year', 'beard'] },
        { as: 'eer', where: 'at the end', words: ['deer'] }
      ] })
  };
  var VOWELKEYS = Object.keys(VOWELTEAMS);

  /* ------------------------------------------------------------------
     THE 44 SOUNDS — the whole of spoken English, for the grown-up, not
     for the child. Nothing in the app teaches from this list; it is the
     map that says where the 31 cards sit on it and what is still missing.

     Why 44 and not 26: a phonics sound is a phoneme, the smallest unit
     of sound in spoken English, and English has about 44 of them to
     spell with 26 letters. That mismatch is the whole difficulty — in
     Hindi or Spanish a letter almost always makes one sound, where in
     English `a` is four different sounds in cat, cake, car and was.

     `key` is the card in this app that teaches the sound, where there is
     one. Where there is not, the sound is real English the app does not
     cover yet.

     Source: the 24 + 20 split and the six short vowels are as the
     zigzu.co phonics-sounds page lists them. That page names only the
     count of the remaining 14 ("long vowels and diphthongs"), so those
     are spelled out here from the standard British English inventory —
     five long vowels, eight diphthongs and the schwa, which is 14.
     ------------------------------------------------------------------ */
  var PHONEMES = {
    consonant: [
      { ipa: '/b/', as: 'b', word: 'bat',   key: 'b' },
      { ipa: '/d/', as: 'd', word: 'dog',   key: 'd' },
      { ipa: '/f/', as: 'f', word: 'fish',  key: 'f' },
      { ipa: '/ɡ/', as: 'g', word: 'goat',  key: 'g' },
      { ipa: '/h/', as: 'h', word: 'hat',   key: 'h' },
      { ipa: '/dʒ/', as: 'j', word: 'jam',  key: 'j' },
      { ipa: '/k/', as: 'c k ck', word: 'cat', key: 'c' },
      { ipa: '/l/', as: 'l', word: 'lamp',  key: 'l' },
      { ipa: '/m/', as: 'm', word: 'mat',   key: 'm' },
      { ipa: '/n/', as: 'n', word: 'nut',   key: 'n' },
      { ipa: '/p/', as: 'p', word: 'pen',   key: 'p' },
      { ipa: '/r/', as: 'r', word: 'rat',   key: 'r' },
      { ipa: '/s/', as: 's', word: 'sun',   key: 's' },
      { ipa: '/t/', as: 't', word: 'tent',  key: 't' },
      { ipa: '/v/', as: 'v', word: 'van',   key: 'v' },
      { ipa: '/w/', as: 'w', word: 'web',   key: 'w' },
      { ipa: '/j/', as: 'y', word: 'yak',   key: 'y' },
      { ipa: '/z/', as: 'z', word: 'zoo',   key: 'z' },
      { ipa: '/ʃ/', as: 'sh', word: 'ship', key: 'sh' },
      { ipa: '/tʃ/', as: 'ch', word: 'chip', key: 'ch' },
      { ipa: '/θ/', as: 'th', word: 'thin', key: 'th', note: 'the quiet one' },
      { ipa: '/ð/', as: 'th', word: 'this', note: 'the buzzing one — same letters, different sound' },
      { ipa: '/ŋ/', as: 'ng', word: 'ring', key: 'ng' },
      { ipa: '/ʒ/', as: 's', word: 'treasure', note: 'rare; no single letter of its own' }
    ],
    'short vowel': [
      { ipa: '/æ/', as: 'a', word: 'cat', key: 'a' },
      { ipa: '/e/', as: 'e', word: 'bed', key: 'e' },
      { ipa: '/ɪ/', as: 'i', word: 'sit', key: 'i' },
      { ipa: '/ɒ/', as: 'o', word: 'hot', key: 'o' },
      { ipa: '/ʌ/', as: 'u', word: 'cup', key: 'u' },
      { ipa: '/ʊ/', as: 'oo', word: 'book', key: 'uu' }
    ],
    'long vowel': [
      { ipa: '/iː/', as: 'ee ea', word: 'see', key: 'ee' },
      { ipa: '/ɑː/', as: 'ar', word: 'car', key: 'ar' },
      { ipa: '/ɔː/', as: 'or aw', word: 'door', key: 'or' },
      { ipa: '/uː/', as: 'oo', word: 'blue', key: 'oo' },
      { ipa: '/ɜː/', as: 'er ir ur', word: 'her', key: 'er' }
    ],
    diphthong: [
      { ipa: '/eɪ/', as: 'ai ay a_e', word: 'day', key: 'ai' },
      { ipa: '/aɪ/', as: 'igh ie y i_e', word: 'my', key: 'igh' },
      { ipa: '/ɔɪ/', as: 'oi oy', word: 'boy', key: 'oi' },
      { ipa: '/aʊ/', as: 'ou ow', word: 'now', key: 'ou' },
      { ipa: '/əʊ/', as: 'oa ow o_e', word: 'go', key: 'oa' },
      { ipa: '/ɪə/', as: 'ear eer', word: 'near', key: 'ear' },
      { ipa: '/eə/', as: 'air are', word: 'hair', key: 'air' },
      { ipa: '/ʊə/', as: 'our', word: 'tour' },
      { ipa: '/ə/', as: 'a', word: 'about', note: 'the schwa — the most common vowel in English' }
    ]
  };
  var PHONEME_GROUPS = ['consonant', 'short vowel', 'long vowel', 'diphthong'];

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
  /* Every level carries the age it is FOR, and — more useful than the age —
     the two sentences that actually decide it:

       `opens` is what she can already do, so this level will not defeat her.
       `ready` is what she can do by the end, so the next one will not either.

     The ages are what to expect, not what to enforce. A child who is five
     and reading `cat` belongs in Level 3 whatever the table says, and a
     child who is six and still learning letters belongs in Level 2 — the
     order is fixed, the pace is not, and nothing in the app is locked.
     `minutes` is the session, not the day: the app should stop before she
     does. */
  var LEVELS = [
    { id: 1, name: 'Look and Listen', tint: 'leaf', built: true,
      age: '3 to 4', ageFrom: 3, ageTo: 4.5, minutes: 5,
      blurb: 'Hear a word, find the picture. No letters yet.',
      opens: 'She can point at a picture when you name it.',
      ready: 'She knows the words in the pictures and will sit through a short round.' },
    { id: 2, name: 'The Alphabet', tint: 'river', built: true,
      age: '4 to 5', ageFrom: 4, ageTo: 5.5, minutes: 8,
      blurb: 'A to Z. What each letter says, and the words it lives in.',
      opens: 'She can hold attention for one card and copy a sound back to you.',
      ready: 'She says the SOUND of most letters — /m/, not "em" — without a picture to help.' },
    { id: 3, name: 'Reading Words', tint: 'otter', built: true,
      age: '5 to 6', ageFrom: 5, ageTo: 6.5, minutes: 10,
      blurb: 'Push the sounds together: c-a-t says cat.',
      opens: 'She knows most single-letter sounds. She does not need all 26.',
      ready: 'She reads a three-letter word she has never seen by sounding it out.' },
    { id: 4, name: 'Reading Books', tint: 'sun', built: true,
      age: '5½ to 6½', ageFrom: 5.5, ageTo: 7, minutes: 10,
      blurb: 'Whole sentences, then whole stories.',
      opens: 'She reads short words without stopping to think about every letter.',
      ready: 'She reads a five-word sentence and can tell you what it was about.' },
    { id: 5, name: 'Same Sound, New Look', tint: 'leaf', built: true,
      age: '6 to 7', ageFrom: 6, ageTo: 7.5, minutes: 12,
      blurb: 'ai, ay and a-e all say the same thing. So do ee and ea, oa and ow.',
      opens: 'She reads short words easily and has met sh, ch, th and magic e.',
      ready: 'She meets `boat` and `snow` and hears that they share a sound.' },
    { id: 6, name: 'Longer Words', tint: 'river', built: true,
      age: '6½ to 7', ageFrom: 6.5, ageTo: 7.5, minutes: 12,
      blurb: 'Two syllables, and the endings -ing, -ed, -er. Soft c and soft g.',
      opens: 'She reads one-syllable words with vowel teams in them.',
      ready: 'She breaks a long word into beats and reads it instead of guessing.' },
    { id: 7, name: 'Real Books', tint: 'sun', built: true,
      age: '7 and up', ageFrom: 7, ageTo: 9, minutes: 15,
      blurb: 'A whole book for the story, and writing words down from hearing them.',
      opens: 'She reads most words without stopping, and is starting to read for meaning.',
      ready: 'She reads a book to herself and tells you what happened. That is the end of phonics.' }
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
     LEVEL 6 · Longer Words — what comes after every sound is known.

     A child who can decode every sound in English still stalls on
     `jumping`, because nothing so far has said that a long word is
     short words and endings stuck together. This level is that: beats,
     joins, endings, and the two letters that change their mind.
     ------------------------------------------------------------------ */

  /* Syllables. `n` is the number of beats — what she claps. */
  var BEATS = [
    { word: 'cat', n: 1 }, { word: 'dog', n: 1 }, { word: 'fish', n: 1 },
    { word: 'sun', n: 1 }, { word: 'boat', n: 1 }, { word: 'book', n: 1 },
    { word: 'rabbit', n: 2 }, { word: 'basket', n: 2 }, { word: 'muffin', n: 2 },
    { word: 'pencil', n: 2 }, { word: 'carrot', n: 2 }, { word: 'tiger', n: 2 },
    { word: 'lemon', n: 2 }, { word: 'monkey', n: 2 }, { word: 'robot', n: 2 },
    { word: 'panda', n: 2 }, { word: 'sunset', n: 2 },
    { word: 'banana', n: 3 }, { word: 'elephant', n: 3 }, { word: 'umbrella', n: 3 },
    { word: 'computer', n: 3 }, { word: 'pineapple', n: 3 }, { word: 'kangaroo', n: 3 },
    { word: 'giraffe', n: 2 }, { word: 'orange', n: 2 }
  ];

  /* Compound words. Both halves are real words she can already read, which
     is the whole trick: a long word she has never seen turns into two she
     has. */
  var COMPOUNDS = [
    { word: 'sunset', parts: ['sun', 'set'] },
    { word: 'cupcake', parts: ['cup', 'cake'] },
    { word: 'raindrop', parts: ['rain', 'drop'] },
    { word: 'football', parts: ['foot', 'ball'] },
    { word: 'popcorn', parts: ['pop', 'corn'] },
    { word: 'snowman', parts: ['snow', 'man'] }
  ];

  /* Endings. `base` is the word she already reads; `made` is what it
     becomes. Where the spelling changes, `note` says how — the doubling
     rule is real and she will meet it whether or not it is taught. */
  var ENDINGS = [
    { id: 'plural', ending: 's', name: 'More Than One',
      blurb: 'One cat, two cats. Add s.',
      also: 'After s, sh, ch or x you need es, because you cannot say it otherwise: bus, buses.',
      items: [
        { base: 'cat', made: 'cats' }, { base: 'dog', made: 'dogs' },
        { base: 'cup', made: 'cups' }, { base: 'hat', made: 'hats' },
        { base: 'bus', made: 'buses', note: 'es' }, { base: 'fox', made: 'foxes', note: 'es' }
      ] },
    { id: 'ing', ending: 'ing', name: 'Doing It Now',
      blurb: 'Jump becomes jumping. Add ing.',
      also: 'A short word with one vowel doubles its last letter first: run, running.',
      items: [
        { base: 'jump', made: 'jumping' }, { base: 'sleep', made: 'sleeping' },
        { base: 'read', made: 'reading' }, { base: 'paint', made: 'painting' },
        { base: 'sing', made: 'singing' }, { base: 'look', made: 'looking' }
      ] },
    { id: 'ed', ending: 'ed', name: 'It Happened',
      blurb: 'Jump becomes jumped. Add ed.',
      also: 'ed has three sounds — /t/ in jumped, /d/ in played, /ɪd/ in painted. Say them, do not explain them.',
      items: [
        { base: 'jump', made: 'jumped' }, { base: 'paint', made: 'painted' },
        { base: 'look', made: 'looked' }, { base: 'play', made: 'played' },
        { base: 'want', made: 'wanted' }, { base: 'land', made: 'landed' }
      ] },
    { id: 'er', ending: 'er', name: 'The One Who Does It',
      blurb: 'Someone who farms is a farmer. Add er.',
      /* `bake` -> `baker` is a real word and deliberately not in this list: it
         drops the silent e first, so the tile would have to read `r`, and a
         child learning `farm + er` does not need `bake + r` in the same
         minute. It is in the sentence below instead. */
      also: 'A word ending in a silent e drops it first: bake becomes baker. And the same er also means more — big, bigger.',
      items: [
        { base: 'farm', made: 'farmer' }, { base: 'teach', made: 'teacher' },
        { base: 'paint', made: 'painter' }, { base: 'sing', made: 'singer' },
        { base: 'help', made: 'helper' }
      ] }
  ];

  /* The two letters that change their mind. This is the second half of the
     `also` line that has been on the c and g cards since Level 2, now with
     something to do about it. */
  var SOFT = [
    { id: 'softc', letter: 'c', hard: '/k/', soft: '/s/',
      name: 'When c Says /s/',
      rule: 'Before e, i or y, c says /s/. Everywhere else it says /k/.',
      softWords: ['city', 'ice', 'mice', 'circle', 'face'],
      hardWords: ['cat', 'cup', 'car', 'cot', 'coin'] },
    { id: 'softg', letter: 'g', hard: '/ɡ/', soft: '/dʒ/',
      name: 'When g Says /dʒ/',
      rule: 'Before e, i or y, g often says /dʒ/ — the j sound. Everywhere else it says /ɡ/.',
      also: 'Often, not always: get and girl keep the hard sound.',
      softWords: ['giant', 'cage', 'giraffe', 'orange', 'gem'],
      hardWords: ['goat', 'gift', 'gate', 'girl', 'dog'] }
  ];

  /* ------------------------------------------------------------------
     LEVEL 7 · Real Books — eight pages instead of five, every vowel team
     in play, and questions that need the whole book rather than one page.

     And spelling: hearing a word and writing it down is the other half of
     phonics, and the half a reading app usually leaves out. `SPELLINGS`
     is dictation — no picture, just the word said aloud and the letters.
     ------------------------------------------------------------------ */
  var BOOKS = [
    { id: 'snailrain', title: 'The Snail and the Rain', teaches: 'ai',
      pages: [
        { text: 'A snail sat on a leaf.', pic: 'snail' },
        { text: 'The rain came down.', pic: 'rain' },
        { text: '"I like the rain," said the snail.', pic: 'snail' },
        { text: 'A bird came to the tree.', pic: 'bird' },
        { text: 'The snail hid in his shell.', pic: 'shell' },
        { text: 'The bird did not see him.', pic: 'bird' },
        { text: 'Then the rain went away.', pic: 'sun' },
        { text: 'The snail came out to play.', pic: 'snail' }
      ],
      questions: [
        { q: 'What did the snail sit on?', pic: 'leaf', not: ['rock', 'nest'] },
        { q: 'Who came to the tree?', pic: 'bird', not: ['cat', 'fox'] },
        { q: 'Where did the snail hide?', pic: 'shell', not: ['box', 'bed'] }
      ] },
    { id: 'cookwood', title: 'Cook in the Wood', teaches: 'uu',
      pages: [
        { text: 'Cook took a book to the wood.', pic: 'book' },
        { text: 'She sat down on a big log.', pic: 'log' },
        { text: 'A fox came to look at the book.', pic: 'fox' },
        { text: '"Can you read?" said Cook.', pic: 'cook' },
        { text: 'The fox took the book and ran!', pic: 'fox' },
        { text: 'Cook ran after him.', pic: 'cook' },
        { text: 'The fox put the book down.', pic: 'book' },
        { text: 'Now Cook reads to the fox.', pic: 'cook' }
      ],
      questions: [
        { q: 'What did Cook take to the wood?', pic: 'book', not: ['basket', 'cup'] },
        { q: 'Who took the book?', pic: 'fox', not: ['owl', 'deer'] },
        { q: 'Where did Cook sit?', pic: 'log', not: ['bed', 'chair'] }
      ] },
    { id: 'boyboat', title: 'The Boy and the Boat', teaches: 'oi',
      pages: [
        { text: 'A boy had a little boat.', pic: 'boat' },
        { text: 'He put it on the pool.', pic: 'pool' },
        { text: 'The boat went out too far.', pic: 'boat' },
        { text: 'A duck sat down on it.', pic: 'duck' },
        { text: '"Come back!" said the boy.', pic: 'boy' },
        { text: 'The duck did not move.', pic: 'duck' },
        { text: 'Then the wind sent the boat in.', pic: 'boat' },
        { text: 'The boy and the duck went home.', pic: 'boy' }
      ],
      questions: [
        { q: 'What did the boy have?', pic: 'boat', not: ['toy', 'coin'] },
        { q: 'Who sat on the boat?', pic: 'duck', not: ['owl', 'cat'] },
        { q: 'Where did he put the boat?', pic: 'pool', not: ['sea', 'jar'] }
      ] },
    { id: 'moonhid', title: 'The Night the Moon Hid', teaches: 'igh',
      pages: [
        { text: 'It was night. The moon was out.', pic: 'moon' },
        { text: 'A big cloud came over it.', pic: 'cloud' },
        { text: 'The moon hid in the cloud.', pic: 'cloud' },
        { text: '"Where is the light?" said the owl.', pic: 'owl' },
        { text: 'A star gave a little light.', pic: 'star' },
        { text: 'Now the owl could see the tree.', pic: 'tree' },
        { text: 'Then the cloud went away.', pic: 'cloud' },
        { text: 'The moon shone on the owl.', pic: 'moon' }
      ],
      questions: [
        { q: 'What hid the moon?', pic: 'cloud', not: ['tree', 'owl'] },
        { q: 'Who asked for the light?', pic: 'owl', not: ['cow', 'deer'] },
        { q: 'What gave a little light?', pic: 'star', not: ['sun', 'lamp'] }
      ] }
  ];

  /* Dictation. She hears the word and builds it out of letters, with no
     picture in front of her — which is what makes it spelling and not
     matching. Grouped so a round is one kind of word at a time. */
  var SPELLINGS = [
    { id: 'cvc', name: 'Write the Short Words', words: ['cat', 'dog', 'sun', 'bed', 'pig', 'cup'] },
    { id: 'teams', name: 'Write the Teams', words: ['ship', 'fish', 'chip', 'sock', 'ring'] },
    { id: 'vowels', name: 'Write the Long Words', words: ['rain', 'boat', 'night', 'book', 'coin', 'corn'] }
  ];

  /* The second sight-word list. The first twenty are in SIGHT and came in at
     Level 4; these are the rest of what a Primary 1 reader meets, and none of
     them can be sounded out. */
  var SIGHT2 = ['they', 'come', 'came', 'went', 'like', 'have', 'here', 'there',
    'what', 'where', 'who', 'you', 'your', 'are', 'were', 'some', 'one', 'two',
    'want', 'could', 'would', 'little', 'away', 'down', 'been', 'does'];

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

  /* ---- Level 5 ---- */
  function picsOf(list) {
    return list.filter(function (k) { return WORDS[k] && WORDS[k].icon && !WORDS[k].noPic; });
  }

  VOWELKEYS.forEach(function (t, i) {
    var vt = VOWELTEAMS[t];
    var pics = picsOf(vt.words);
    var blend = pics.filter(function (k) { return WORDS[k].ph; });
    /* A team with one spelling has nothing to sort, so it practises building
       the word instead — the same minutes, spent on what that team needs. */
    var middle = vt.spells.length > 1
      ? { type: 'spellSort', team: t, rounds: 4 }
      : { type: 'buildWord', words: blend, rounds: 3 };
    LESSONS.push({
      id: 'vt-' + t, level: 5, n: i + 1, team: t, vowel: true,
      name: vt.spells.map(function (sp) { return sp.as; }).join(' · ') + '   ' + vt.ipa,
      shortName: vt.spells[0].as + ' ' + vt.ipa,
      icon: WORDS[pics[0]].icon,
      activities: [
        { type: 'meetTeam', team: t },
        { type: 'soundOut', words: blend, rounds: 3 },
        middle,
        { type: 'readPick', words: pics, rounds: 3 },
        { type: 'wordPick', words: pics, rounds: 2 }
      ]
    });
  });

  LESSONS.push({
    id: 'vt-review', level: 5, n: 90, name: 'Every Team', shortName: 'Every Team',
    icon: 'trophy', review: true,
    activities: [
      { type: 'spellSort', teams: VOWELKEYS.filter(function (t) { return VOWELTEAMS[t].spells.length > 1; }), rounds: 6 },
      { type: 'readPick', words: picsOf(VOWELKEYS.reduce(function (a, t) { return a.concat(VOWELTEAMS[t].words); }, [])), rounds: 6 },
      { type: 'wordPick', words: picsOf(VOWELKEYS.reduce(function (a, t) { return a.concat(VOWELTEAMS[t].words); }, [])), rounds: 4 }
    ]
  });

  /* ---- Level 6 ---- */
  LESSONS.push({
    id: 'y-beats2', level: 6, n: 1, name: 'Clap the Beats', shortName: 'Two Beats',
    icon: 'rabbit',
    activities: [{ type: 'beats', max: 2, rounds: 6 }]
  });
  LESSONS.push({
    id: 'y-beats3', level: 6, n: 2, name: 'Three Beats', shortName: 'Three Beats',
    icon: 'banana',
    activities: [{ type: 'beats', max: 3, rounds: 6 }]
  });
  LESSONS.push({
    id: 'y-compound', level: 6, n: 3, name: 'Two Words in One', shortName: 'Two in One',
    icon: 'cupcake',
    activities: [
      { type: 'joinWords', rounds: 6 },
      { type: 'readPick', words: COMPOUNDS.map(function (c) { return c.word; }), rounds: 4 }
    ]
  });
  ENDINGS.forEach(function (e, i) {
    LESSONS.push({
      id: 'y-' + e.id, level: 6, n: 4 + i, ending: e.id,
      name: e.name + '   -' + e.ending, shortName: '-' + e.ending,
      icon: e.id === 'plural' ? 'three' : (e.id === 'ing' ? 'jumping' : (e.id === 'ed' ? 'painting' : 'farmer')),
      activities: [
        { type: 'meetEnding', ending: e.id },
        { type: 'addEnding', ending: e.id, rounds: 5 },
        { type: 'endingPick', ending: e.id, rounds: 4 }
      ]
    });
  });
  SOFT.forEach(function (sf, i) {
    LESSONS.push({
      id: 'y-' + sf.id, level: 6, n: 10 + i, soft: sf.id,
      name: sf.name, shortName: 'soft ' + sf.letter,
      icon: sf.softWords[0],
      activities: [
        { type: 'meetSoft', soft: sf.id },
        { type: 'softSort', soft: sf.id, rounds: 6 },
        { type: 'readPick', words: sf.softWords, rounds: 3 }
      ]
    });
  });
  LESSONS.push({
    id: 'y-review', level: 6, n: 90, name: 'All the Long Words', shortName: 'All Together',
    icon: 'trophy', review: true,
    activities: [
      { type: 'beats', max: 3, rounds: 4 },
      { type: 'addEnding', ending: 'ing', rounds: 3 },
      { type: 'softSort', soft: 'softc', rounds: 3 },
      { type: 'readPick', words: COMPOUNDS.map(function (c) { return c.word; }), rounds: 4 }
    ]
  });

  /* ---- Level 7 ----
     Books and spelling alternate. Reading and writing a word are two halves
     of the same skill and a week of one without the other shows. */
  BOOKS.forEach(function (bk, i) {
    LESSONS.push({
      id: 'bk-' + bk.id, level: 7, n: 1 + i * 2, book: bk.id,
      name: bk.title, shortName: bk.title,
      icon: WORDS[bk.pages[0].pic].icon,
      activities: [{ type: 'book', book: bk.id }]
    });
  });
  SPELLINGS.forEach(function (sp, i) {
    LESSONS.push({
      id: 'sp-' + sp.id, level: 7, n: 2 + i * 2, name: sp.name, shortName: sp.name.replace('Write the ', 'Write: '),
      icon: 'pen',
      activities: [{ type: 'spellIt', set: sp.id, rounds: 5 }]
    });
  });
  LESSONS.push({
    id: 'sight-2', level: 7, n: 8, name: 'Words You Cannot Sound Out', shortName: 'Tricky Words',
    icon: 'question',
    activities: [{ type: 'sightRead', rounds: 8 }]
  });
  LESSONS.push({
    id: 'bk-review', level: 7, n: 90, name: 'Read On Your Own', shortName: 'On Your Own',
    icon: 'trophy', review: true,
    activities: [
      { type: 'sightRead', rounds: 4 },
      { type: 'spellIt', set: 'vowels', rounds: 4 },
      { type: 'bookQuestions', rounds: 6 }
    ]
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
    VOWELTEAMS: VOWELTEAMS,
    VOWELKEYS: VOWELKEYS,
    PHONEMES: PHONEMES,
    PHONEME_GROUPS: PHONEME_GROUPS,
    SIGHT: SIGHT,
    SIGHT2: SIGHT2,
    SENTENCES: SENTENCES,
    STORIES: STORIES,
    BOOKS: BOOKS,
    BEATS: BEATS,
    COMPOUNDS: COMPOUNDS,
    ENDINGS: ENDINGS,
    SOFT: SOFT,
    SPELLINGS: SPELLINGS,
    MAGICE: MAGICE,
    story: function (id) { return STORIES.filter(function (x) { return x.id === id; })[0]; },
    book: function (id) { return BOOKS.filter(function (x) { return x.id === id; })[0]; },
    ending: function (id) { return ENDINGS.filter(function (x) { return x.id === id; })[0]; },
    softOf: function (id) { return SOFT.filter(function (x) { return x.id === id; })[0]; },
    spellingSet: function (id) { return SPELLINGS.filter(function (x) { return x.id === id; })[0]; },
    /* letters, consonant teams and vowel teams share a shape, so one lookup
       serves all three cards */
    sound: function (k) { return ALPHABET[k] || TEAMS[k] || VOWELTEAMS[k]; },
    /* Everything she can be shown as a picture and asked to read. Words with
       no picture — `day`, `out`, `her` — are read and sorted but never offered
       as one of three pictures, so they are not in here. */
    readable: function () {
      return Object.keys(WORDS).filter(function (k) {
        return WORDS[k].ph && WORDS[k].icon && !WORDS[k].noPic;
      });
    },
    /* Everything she can sound out or build, picture or no picture. */
    blendable: function () {
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
    /* Pictures that do NOT start with this letter, for wrong answers.

       Skipping letter l's own list is not enough: `ax` is a keyword for BOTH
       a and x, so drawing from every other letter's list handed back `ax`
       itself as a wrong answer to "which one starts with a". The child taps
       the right picture and is told to try again, or taps one of two
       identical pictures and it depends which. Excluding by WORD rather than
       by letter is what fixes it. */
    otherWords: function (l) {
      var mine = {};
      (ALPHABET[l] ? ALPHABET[l].words : []).forEach(function (k) { mine[k] = true; });
      var out = [];
      LETTERS.forEach(function (x) {
        if (x === l) return;
        ALPHABET[x].words.forEach(function (k) { if (!mine[k]) out.push(k); });
      });
      return out;
    },
    /* Everything the grown-up dashboard tracks. The mastery map is keyed the
       same way the rounds are scored — 'L:' for anything that is a sound on a
       card, letter or team, and 'T:' for a picture theme. */
    trackables: function () {
      return LETTERS.map(function (l) {
        return { key: 'L:' + l, label: l, kind: 'letter' };
      }).concat(Object.keys(TEAMS).map(function (t) {
        return { key: 'L:' + t, label: t, kind: 'team' };
      })).concat(VOWELKEYS.map(function (t) {
        /* The IPA, not the spelling: `oo` is both /uː/ and /ʊ/, and two cells
           labelled `oo` on a mastery map say nothing. */
        return { key: 'L:' + t, label: VOWELTEAMS[t].ipa, kind: 'vowel' };
      })).concat(THEMES.map(function (t) {
        return { key: 'T:' + t.id, label: t.name, kind: 'theme' };
      }));
    }
  };
})();
