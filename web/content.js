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
    bear: ['b', 'air'], ear: ['ear'],

    /* `qu` says /kw/, which is two sounds written as one key and has had a
       card since Level 2 — but none of its words could be taken apart,
       because the vowel in `queen` is /iː/ and there was no clip for that
       until Level 5. There is now. */
    queen: ['q', 'ee', 'n'], quilt: ['q', 'i', 'l', 't'], quiz: ['q', 'i', 'z']
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
      blurb: 'Twenty-four sentences to build and read, then a shelf of nine little books.',
      opens: 'She reads short words without stopping to think about every letter.',
      ready: 'She reads a five-word sentence and can tell you what it was about.' },
    { id: 5, name: 'Same Sound, New Look', tint: 'leaf', built: true,
      age: '6 to 7', ageFrom: 6, ageTo: 7.5, minutes: 12,
      blurb: 'ai, ay and a-e all say the same thing. Thirteen vowel teams, each with a story straight after it.',
      opens: 'She reads short words easily and has met sh, ch, th and magic e.',
      ready: 'She meets `boat` and `snow` and hears that they share a sound.' },
    { id: 6, name: 'Longer Words', tint: 'river', built: true,
      age: '6½ to 7', ageFrom: 6.5, ageTo: 7.5, minutes: 12,
      blurb: 'Beats, compound words, the endings -s -ing -ed -er, soft c and soft g — and a story for each.',
      opens: 'She reads one-syllable words with vowel teams in them.',
      ready: 'She breaks a long word into beats and reads it instead of guessing.' },
    { id: 7, name: 'Real Books', tint: 'sun', built: true,
      age: '7 and up', ageFrom: 7, ageTo: 9, minutes: 15,
      blurb: 'Six units, each with a book, an article, a chapter and a spelling set. Eight articles and two chapter books.',
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

  /* ------------------------------------------------------------------
     ARTICLES — reading to find something out.

     A decodable book exists so the words in it can be sounded out; what it
     is about is secondary, and by seven that is the wrong way round. These
     are the other thing: short non-fiction about how something actually
     works, written to be read for the answer rather than for the practice.
     The words are ordinary words now, not a controlled list — at this point
     a child meeting an unfamiliar word should reach for it, and every word
     on the page is tappable when she cannot.

     Each one carries more than the text, because reading for meaning is not
     one skill:

       `parts`     the article itself, a picture and two sentences at a time
       `words`     two words worth knowing, with what they mean
       `order`     the stages, to be put back in order. Always the order the
                   article itself puts them in — for `seed` and `rain` that
                   is also the real causal chain, and for the other three it
                   is sequencing the text, which is its own skill. What it
                   must never be is an order the article never gave: an ant's
                   life cycle and a lunar month are both true and neither is
                   in the text, and asking for either was asking for
                   knowledge the article had not handed over.
       `facts`     true or not true, answerable only from the article
       `questions` the ordinary comprehension check
     ------------------------------------------------------------------ */
  var ARTICLES = [
    { id: 'seed', title: 'How a Seed Becomes a Tree', topic: 'Plants', icon: 'seed',
      parts: [
        { text: 'A seed is small and hard. Inside it a tiny plant is asleep.', pic: 'seed' },
        { text: 'Rain soaks into the ground. The seed drinks and begins to swell.', pic: 'rain' },
        { text: 'A root pushes down into the soil. A green shoot pushes up.', pic: 'seed' },
        { text: 'The shoot opens its first leaves. Leaves catch the light.', pic: 'leaf' },
        { text: 'Light is how a plant makes its food. That is why it grows towards it.', pic: 'sun' },
        { text: 'Every year the stem grows thicker. After many years the seed is a tall tree.', pic: 'tree' }
      ],
      words: [
        { word: 'root', means: 'the part that grows down and drinks water', not: ['the part you eat', 'a kind of bird'] },
        { word: 'shoot', means: 'the first green part that pushes up', not: ['a very small seed', 'the top of a tree'] }
      ],
      order: ['seed', 'rain', 'leaf', 'tree'],
      facts: [
        { text: 'A seed needs water before it can grow.', yes: true },
        { text: 'A plant grows best in the dark.', yes: false },
        { text: 'Leaves catch the light.', yes: true },
        { text: 'A tree becomes tall in one week.', yes: false }
      ],
      questions: [
        { q: 'What does a seed need first?', pic: 'rain', not: ['fish', 'coin'] },
        { q: 'What catches the light?', pic: 'leaf', not: ['rock', 'boot'] },
        { q: 'What does a seed become in the end?', pic: 'tree', not: ['bee', 'cloud'] }
      ] },

    { id: 'rain', title: 'Where Rain Comes From', topic: 'Weather', icon: 'cloud',
      parts: [
        { text: 'The sun warms the top of the sea. Some of the water rises into the air.', pic: 'sea' },
        { text: 'You cannot see it go. Water in the air is a gas, and a gas is invisible.', pic: 'sun' },
        { text: 'High up, the air is cold. The water turns back into tiny drops.', pic: 'cloud' },
        { text: 'Millions of drops floating together are what we call a cloud.', pic: 'cloud' },
        { text: 'The drops bump into each other and grow. When they are heavy enough they fall.', pic: 'rain' },
        { text: 'The rain runs down into rivers and back to the sea. Then it all starts again.', pic: 'sea' }
      ],
      words: [
        { word: 'rise', means: 'to move upwards', not: ['to get wet', 'to fall down'] },
        { word: 'invisible', means: 'there, but impossible to see', not: ['very cold', 'made of ice'] }
      ],
      order: ['sea', 'sun', 'cloud', 'rain'],
      facts: [
        { text: 'The sun warms the sea.', yes: true },
        { text: 'A cloud is made of tiny drops of water.', yes: true },
        { text: 'You can see water rising into the air.', yes: false },
        { text: 'Rain never goes back to the sea.', yes: false }
      ],
      questions: [
        { q: 'What warms the sea?', pic: 'sun', not: ['moon', 'owl'] },
        { q: 'What do millions of drops make?', pic: 'cloud', not: ['tree', 'nest'] },
        { q: 'Where does the rain run back to?', pic: 'sea', not: ['jar', 'pool'] }
      ] },

    { id: 'ants', title: 'What Ants Do All Day', topic: 'Animals', icon: 'ant',
      parts: [
        { text: 'An ant is small, but an ant is never alone.', pic: 'ant' },
        { text: 'Thousands of ants live together in one nest under the ground.', pic: 'nest' },
        { text: 'One ant is the queen. She is bigger than the rest, and she lays all the eggs.', pic: 'queen' },
        { text: 'The others go out to find food and carry it home along the same path.', pic: 'ant' },
        { text: 'An ant can lift something many times heavier than itself.', pic: 'leaf' },
        { text: 'Nobody tells an ant what to do. Every ant has a job, and the nest keeps going.', pic: 'nest' }
      ],
      words: [
        { word: 'queen', means: 'the one ant that lays all the eggs', not: ['the biggest nest', 'an ant with wings'] },
        { word: 'lift', means: 'to pick something up', not: ['to run fast', 'to dig a hole'] }
      ],
      order: ['ant', 'nest', 'queen', 'leaf'],
      facts: [
        { text: 'Ants live on their own.', yes: false },
        { text: 'The queen lays the eggs.', yes: true },
        { text: 'An ant can carry more than its own weight.', yes: true },
        { text: 'Ants build their nest in the sky.', yes: false }
      ],
      questions: [
        { q: 'Who lays all the eggs?', pic: 'queen', not: ['king', 'bee'] },
        { q: 'Where do ants live?', pic: 'nest', not: ['jar', 'boat'] },
        { q: 'What can one ant carry?', pic: 'leaf', not: ['bus', 'house'] }
      ] },

    { id: 'moon', title: 'Why the Moon Changes', topic: 'Space', icon: 'moon',
      parts: [
        { text: 'The moon looks a different shape every night.', pic: 'moon' },
        { text: 'But the moon never changes shape. It is always round, like a ball.', pic: 'circle' },
        { text: 'The moon makes no light of its own. The sun shines on it.', pic: 'sun' },
        { text: 'Half of the moon is lit, and half of it is dark. That is always true.', pic: 'moon' },
        { text: 'The moon goes round the earth once a month. As it moves we see the lit half from a new side.', pic: 'night' },
        { text: 'So the moon is not changing. What changes is how much of the lit half we can see.', pic: 'moon' }
      ],
      words: [
        { word: 'lit', means: 'with light falling on it', not: ['very small', 'made of rock'] },
        { word: 'month', means: 'about four weeks', not: ['one night', 'a whole year'] }
      ],
      order: ['moon', 'circle', 'sun', 'night'],
      facts: [
        { text: 'The moon makes its own light.', yes: false },
        { text: 'The moon is really round all the time.', yes: true },
        { text: 'The sun shines on the moon.', yes: true },
        { text: 'The moon goes round the earth once a night.', yes: false }
      ],
      questions: [
        { q: 'What shines on the moon?', pic: 'sun', not: ['lamp', 'light'] },
        { q: 'What shape is the moon really?', pic: 'circle', not: ['star', 'gem'] },
        { q: 'When do we see the moon best?', pic: 'night', not: ['sea', 'road'] }
      ] },

    { id: 'nightlife', title: 'Animals That Come Out at Night', topic: 'Animals', icon: 'owl',
      parts: [
        { text: 'When you go to bed, some animals are only just waking up.', pic: 'night' },
        { text: 'An owl hunts in the dark. Its eyes are huge, and huge eyes catch more light.', pic: 'owl' },
        { text: 'The edge of an owl feather is soft and ragged, so an owl flies without a sound.', pic: 'owl' },
        { text: 'A fox comes out when the streets are quiet and looks for something to eat.', pic: 'fox' },
        { text: 'A cat can see in light so dim that you would see nothing at all.', pic: 'cat' },
        { text: 'When the sun comes up they all go home to sleep, and we get up.', pic: 'sun' }
      ],
      words: [
        { word: 'hunt', means: 'to look for an animal to eat', not: ['to sleep all day', 'to build a nest'] },
        { word: 'dim', means: 'with only a little light', not: ['very loud', 'wet and cold'] }
      ],
      order: ['night', 'owl', 'fox', 'sun'],
      facts: [
        { text: 'An owl can fly almost silently.', yes: true },
        { text: 'A cat can see better in the dark than you can.', yes: true },
        { text: 'A fox hunts when the sun is high.', yes: false },
        { text: 'Big eyes let in more light.', yes: true }
      ],
      questions: [
        { q: 'Which bird hunts at night?', pic: 'owl', not: ['hen', 'duck'] },
        { q: 'Who comes out when the streets are quiet?', pic: 'fox', not: ['cow', 'goat'] },
        { q: 'When do night animals sleep?', pic: 'sun', not: ['moon', 'star'] }
      ] },

    { id: 'frog', title: 'Where Frogs Come From', topic: 'Animals', icon: 'frog',
      parts: [
        { text: 'A frog starts its life as a tiny egg in a pond.', pic: 'egg' },
        { text: 'Hundreds of eggs float together in a clump of jelly.', pic: 'water' },
        { text: 'Out of each egg wriggles a tadpole. It has a long tail and swims like a fish.', pic: 'fish' },
        { text: 'Slowly the tadpole grows back legs, and then front legs.', pic: 'leg' },
        { text: 'Its tail gets shorter and shorter, until it is gone.', pic: 'tail' },
        { text: 'Now it is a frog. It can hop out of the water and breathe the air.', pic: 'frog' }
      ],
      words: [
        { word: 'tadpole', means: 'a baby frog that lives in water', not: ['a small fish', 'a kind of plant'] },
        { word: 'pond', means: 'a small pool of still water', not: ['a tall hill', 'a kind of boat'] }
      ],
      order: ['egg', 'fish', 'leg', 'frog'],
      facts: [
        { text: 'A frog starts life as an egg.', yes: true },
        { text: 'A tadpole has legs from the start.', yes: false },
        { text: 'A tadpole swims like a fish.', yes: true },
        { text: 'A grown frog can never leave the water.', yes: false }
      ],
      questions: [
        { q: 'What does a frog start as?', pic: 'egg', not: ['seed', 'rock'] },
        { q: 'What does a tadpole lose as it grows?', pic: 'tail', not: ['leg', 'foot'] },
        { q: 'What does a tadpole become?', pic: 'frog', not: ['fish', 'duck'] }
      ] },

    { id: 'teeth', title: 'Why We Brush Our Teeth', topic: 'Our Bodies', icon: 'teeth',
      parts: [
        { text: 'Your teeth help you bite and chew your food.', pic: 'teeth' },
        { text: 'Tiny germs live in your mouth. They are far too small to see.', pic: 'face' },
        { text: 'Germs love sugar. They make a sticky layer on your teeth.', pic: 'cupcake' },
        { text: 'If the layer stays there, it can make a hole in a tooth.', pic: 'teeth' },
        { text: 'Brushing in the morning and at night sweeps the germs away.', pic: 'teeth' },
        { text: 'Milk and cheese help keep your teeth hard and strong.', pic: 'milk' }
      ],
      words: [
        { word: 'chew', means: 'to crush food with your teeth', not: ['to drink very fast', 'to wash your hands'] },
        { word: 'germs', means: 'living things too small to see', not: ['a kind of sweet', 'the white part of a tooth'] }
      ],
      order: ['teeth', 'face', 'cupcake', 'milk'],
      facts: [
        { text: 'Germs are too small to see.', yes: true },
        { text: 'Germs love sugar.', yes: true },
        { text: 'You only need to brush once a week.', yes: false },
        { text: 'Milk helps keep teeth strong.', yes: true }
      ],
      questions: [
        { q: 'What do germs love?', pic: 'cupcake', not: ['carrot', 'fish'] },
        { q: 'What helps keep teeth strong?', pic: 'milk', not: ['cupcake', 'popcorn'] },
        { q: 'What do you brush twice a day?', pic: 'teeth', not: ['hair', 'feet'] }
      ] },

    { id: 'volcano', title: 'What Is a Volcano?', topic: 'Our Planet', icon: 'volcano',
      parts: [
        { text: 'A volcano is a mountain with a hole at the top.', pic: 'volcano' },
        { text: 'Deep under the ground it is hot enough to melt rock.', pic: 'rock' },
        { text: 'Melted rock is called lava. It glows orange and red.', pic: 'orange' },
        { text: 'Sometimes the lava pushes up and bursts out of the top.', pic: 'volcano' },
        { text: 'When lava cools down, it turns hard and black. It is rock again.', pic: 'rock' },
        { text: 'Some islands are the tops of old volcanoes, sticking up out of the sea.', pic: 'sea' }
      ],
      words: [
        { word: 'lava', means: 'rock so hot it has melted', not: ['a kind of cloud', 'very hot water'] },
        { word: 'melt', means: 'to turn from hard to runny', not: ['to break in half', 'to grow bigger'] }
      ],
      order: ['volcano', 'rock', 'orange', 'sea'],
      facts: [
        { text: 'Lava is melted rock.', yes: true },
        { text: 'Lava is cold when it comes out.', yes: false },
        { text: 'Lava turns hard when it cools.', yes: true },
        { text: 'Every mountain is a volcano.', yes: false }
      ],
      questions: [
        { q: 'What is lava made of?', pic: 'rock', not: ['water', 'ice'] },
        { q: 'What is at the top of a volcano?', pic: 'volcano', not: ['tree', 'house'] },
        { q: 'Where are some old volcanoes now?', pic: 'sea', not: ['road', 'farm'] }
      ] }
  ];

  /* ------------------------------------------------------------------
     CHAPTERS — one story long enough to have to remember it.

     Every story so far has fitted on one screen's worth of pages, so
     nothing in it had to be held in mind. This one runs over three
     sittings, and its questions at the end can only be answered by
     someone who read the first chapter days ago and kept it.
     ------------------------------------------------------------------ */
  var CHAPTER_BOOKS = [{
    id: 'kite', title: 'The Kite That Would Not Come Down',
    parts: [
      { id: 'k1', n: 1, name: 'The Wind Takes It', icon: 'kite',
        pages: [
          { text: 'Ben had a red kite. He got it for his birthday and he had not flown it yet.', pic: 'kite' },
          { text: 'On Saturday the wind was strong. Ben ran across the grass and let out the string.', pic: 'kite' },
          { text: 'Up it went, higher than the trees, higher than the roofs.', pic: 'tree' },
          { text: 'Then something snapped. The string went soft in his hand.', pic: 'hand' },
          { text: 'The kite turned over once and flew away over the houses.', pic: 'house' },
          { text: 'Ben sat down on the grass. He did not say a word.', pic: 'boy' }
        ],
        questions: [
          { q: 'What did Ben get for his birthday?', pic: 'kite', not: ['bike', 'boat'] },
          { q: 'What broke?', pic: 'hand', not: ['tree', 'gate'] }
        ] },
      { id: 'k2', n: 2, name: 'The Hunt', icon: 'town',
        pages: [
          { text: 'His sister Mei found him there. "Come on," she said. "It went that way."', pic: 'girl' },
          { text: 'They looked in the park, under every tree. No kite.', pic: 'tree' },
          { text: 'They looked by the pool, where the wind always drops. No kite.', pic: 'pool' },
          { text: 'A dog barked at them through a gate and they walked a little faster.', pic: 'dog' },
          { text: 'Then Mei stopped and pointed straight up.', pic: 'girl' },
          { text: 'The red kite was caught at the top of a very tall tree.', pic: 'kite' }
        ],
        questions: [
          { q: 'Who came to help Ben?', pic: 'girl', not: ['boy', 'farmer'] },
          { q: 'Where was the kite in the end?', pic: 'tree', not: ['pool', 'road'] }
        ] },
      { id: 'k3', n: 3, name: 'Getting It Back', icon: 'trophy',
        pages: [
          { text: 'An old man came out of the house. "That is my tree," he said.', pic: 'farmer' },
          { text: 'Ben said he was sorry. The man looked up, and then he smiled.', pic: 'face' },
          { text: 'He went inside and came back with a long pole for picking fruit.', pic: 'tree' },
          { text: 'Up went the pole. Down came the kite, turning over and over.', pic: 'kite' },
          { text: 'One wing was torn. But Mei had tape in her bag, and she was good at mending.', pic: 'girl' },
          { text: 'On Sunday the red kite flew again, with a much stronger string.', pic: 'kite' }
        ],
        questions: [
          { q: 'Who owned the tree?', pic: 'farmer', not: ['boy', 'nurse'] },
          { q: 'What did Mei have in her bag?', pic: 'girl', not: ['basket', 'jar'] }
        ] }
    ],
    /* answerable only by someone who read all three */
    questions: [
      { q: 'What day did the kite first fly?', pic: 'kite', not: ['moon', 'sun'] },
      { q: 'Who found Ben on the grass?', pic: 'girl', not: ['farmer', 'boy'] },
      { q: 'What fixed the torn wing?', pic: 'girl', not: ['hand', 'pencil'] }
    ]
  }, {
    /* The same two children, a second book. Carrying characters over is
       what makes a series, and a series is what turns a reader into someone
       who wants the next one. */
    id: 'max', title: 'Mei and the Missing Dog',
    parts: [
      { id: 'm1', n: 1, name: 'Where Is Max?', icon: 'dog',
        pages: [
          { text: 'Ben and Mei had a dog called Max.', pic: 'dog' },
          { text: 'Max liked digging holes and chasing balls.', pic: 'ball' },
          { text: 'One morning the gate was open, and Max was gone.', pic: 'gate' },
          { text: 'Mei looked under her bed. No Max.', pic: 'bed' },
          { text: 'Ben looked all round the garden. No Max.', pic: 'tree' },
          { text: '"We have to find him," said Ben, "before it gets dark."', pic: 'boy' }
        ],
        questions: [
          { q: 'What had been left open?', pic: 'gate', not: ['box', 'jar'] },
          { q: 'What did Max like to chase?', pic: 'ball', not: ['cat', 'kite'] }
        ] },
      { id: 'm2', n: 2, name: 'Following the Clues', icon: 'paw',
        pages: [
          { text: 'They asked the baker. "A dog ran past," she said. "He took a bun!"', pic: 'baker' },
          { text: 'They asked the farmer. "A dog chased my hens," he said.', pic: 'hen' },
          { text: 'They asked the nurse on the corner. "He went into the park."', pic: 'nurse' },
          { text: 'In the park they found a trail of muddy paw prints.', pic: 'paw' },
          { text: 'The paw prints led all the way down to the pond.', pic: 'water' },
          { text: 'Then they stopped. The paw prints were gone.', pic: 'paw' }
        ],
        questions: [
          { q: 'What did Max take from the baker?', pic: 'bun', not: ['muffin', 'pie'] },
          { q: 'What did they follow in the park?', pic: 'paw', not: ['feet', 'boot'] }
        ] },
      { id: 'm3', n: 3, name: 'Found', icon: 'boat',
        pages: [
          { text: 'Mei heard a bark. It came from a little boat by the pond.', pic: 'boat' },
          { text: 'Max was in the boat, fast asleep on an old coat.', pic: 'coat' },
          { text: 'He still had the bun in his paws, and mud on his nose.', pic: 'nose' },
          { text: 'Ben laughed so hard that he fell over.', pic: 'boy' },
          { text: 'They carried Max home. He was heavy and wet and happy.', pic: 'house' },
          { text: 'That night Mei shut the gate, and Max slept on her feet.', pic: 'feet' }
        ],
        questions: [
          { q: 'Where was Max sleeping?', pic: 'boat', not: ['car', 'bus'] },
          { q: 'What was he lying on?', pic: 'coat', not: ['bed', 'bag'] }
        ] }
    ],
    questions: [
      { q: 'Who did they ask first?', pic: 'baker', not: ['farmer', 'nurse'] },
      { q: 'Where did the paw prints lead?', pic: 'water', not: ['road', 'farm'] },
      { q: 'What did Mei shut at the very end?', pic: 'gate', not: ['box', 'book'] }
    ]
  }];

  /* Dictation. She hears the word and builds it out of letters, with no
     picture in front of her — which is what makes it spelling and not
     matching. Grouped so a round is one kind of word at a time. */
  var SPELLINGS = [
    { id: 'cvc', name: 'Write the Short Words', words: ['cat', 'dog', 'sun', 'bed', 'pig', 'cup'] },
    { id: 'teams', name: 'Write the Teams', words: ['ship', 'fish', 'chip', 'sock', 'ring'] },
    { id: 'vowels', name: 'Write the Long Words', words: ['rain', 'boat', 'night', 'book', 'coin', 'corn'] },
    { id: 'magic', name: 'Write the Magic e Words', words: ['cake', 'bike', 'bone', 'kite', 'gate', 'five'] },
    { id: 'more', name: 'Write the Harder Words', words: ['snail', 'feet', 'cloud', 'shirt', 'spoon', 'light'] }
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
    { text: 'The king has a big ring.', pic: 'king', not: ['queen', 'girl'] },

    /* The second dozen. Same rules as the first: short vowels, the letter
       teams, blends, and the twenty sight words — nothing she would have to
       guess at. */
    { text: 'The dog is on the bed.', pic: 'dog', not: ['cat', 'pig'] },
    { text: 'A fish is in the net.', pic: 'fish', not: ['crab', 'duck'] },
    { text: 'I can see a red van.', pic: 'van', not: ['bus', 'car'] },
    { text: 'The cat has a hat.', pic: 'cat', not: ['dog', 'rat'] },
    { text: 'The bug is on the log.', pic: 'insect', not: ['frog', 'fish'] },
    { text: 'A frog can hop.', pic: 'frog', not: ['fish', 'duck'] },
    { text: 'My mug is hot.', pic: 'mug', not: ['jug', 'pot'] },
    { text: 'The fox ran to his den.', pic: 'fox', not: ['wolf', 'dog'] },
    { text: 'Dad has a big drum.', pic: 'drum', not: ['doll', 'box'] },
    { text: 'The duck is wet.', pic: 'duck', not: ['hen', 'cat'] },
    { text: 'She has a pink sock.', pic: 'sock', not: ['hat', 'bag'] },
    { text: 'The ship is in the dock.', pic: 'ship', not: ['bus', 'van'] }
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
      ] },

    /* Six more, so that Level 4 is a shelf and not three books. Still every
       word decodable with what Level 3 taught, or one of the twenty sight
       words, or tappable — and each is a small story with a turn in it, not
       a list of sentences that happen to share a picture. */
    { id: 'henegg', title: 'The Hen and the Egg',
      pages: [
        { text: 'A hen sat on a nest.', pic: 'nest' },
        { text: 'In the nest was an egg.', pic: 'egg' },
        { text: 'The egg got a crack.', pic: 'egg' },
        { text: 'It was not a chick. It was a duck!', pic: 'duck' },
        { text: '"Quack!" said the duck.', pic: 'duck' },
        { text: 'The hen and the duck sat in the sun.', pic: 'sun' }
      ],
      questions: [
        { q: 'What did the hen sit on?', pic: 'nest', not: ['bed', 'box'] },
        { q: 'What came out of the egg?', pic: 'duck', not: ['hen', 'cat'] }
      ] },
    { id: 'dadnet', title: 'Dad and the Net',
      pages: [
        { text: 'Dad has a big ship.', pic: 'ship' },
        { text: 'He got his net and let it sink.', pic: 'net' },
        { text: 'Then he got the net up.', pic: 'net' },
        { text: 'In it was a fish and a crab!', pic: 'crab' },
        { text: 'The crab bit Dad on the thumb.', pic: 'thumb' },
        { text: 'Dad let the crab hop off. The fish was for lunch.', pic: 'fish' }
      ],
      questions: [
        { q: 'What did Dad have?', pic: 'ship', not: ['bus', 'van'] },
        { q: 'What bit Dad?', pic: 'crab', not: ['fish', 'dog'] }
      ] },
    { id: 'dogsock', title: 'The Dog and the Sock',
      pages: [
        { text: 'My dog has a red sock.', pic: 'sock' },
        { text: 'He ran and ran with it.', pic: 'dog' },
        { text: 'The sock fell in the mud.', pic: 'mud' },
        { text: 'Mum got the sock and said, "Yuck!"', pic: 'sock' },
        { text: 'She dunks it in a big tub.', pic: 'water' },
        { text: 'The sock is not red. It is pink!', pic: 'sock' }
      ],
      questions: [
        { q: 'What did the dog have?', pic: 'sock', not: ['hat', 'cap'] },
        { q: 'Where did the sock fall?', pic: 'mud', not: ['pool', 'bed'] }
      ] },
    { id: 'kingsing', title: 'The King Can Sing',
      pages: [
        { text: 'The king has a big ring.', pic: 'ring' },
        { text: 'The king can sing.', pic: 'king' },
        { text: 'He sings and sings and sings.', pic: 'king' },
        { text: 'The queen gets a drum.', pic: 'drum' },
        { text: 'Bang! Bang! Bang!', pic: 'drum' },
        { text: 'The king sings and the queen bangs. What a din!', pic: 'queen' }
      ],
      questions: [
        { q: 'What does the king have?', pic: 'ring', not: ['hat', 'cup'] },
        { q: 'What did the queen get?', pic: 'drum', not: ['ring', 'doll'] }
      ] },
    { id: 'chiprat', title: 'Chip the Rat',
      pages: [
        { text: 'Chip is a rat.', pic: 'rat' },
        { text: 'Chip has a big chip.', pic: 'chip' },
        { text: 'He ran to the top of the hill.', pic: 'rat' },
        { text: 'A cat sat at the top.', pic: 'cat' },
        { text: 'Chip ran back and hid in a box.', pic: 'box' },
        { text: 'The cat did not get him, and he had his chip!', pic: 'rat' }
      ],
      questions: [
        { q: 'What did Chip have?', pic: 'chip', not: ['cheese', 'jam'] },
        { q: 'Where did Chip hide?', pic: 'box', not: ['bed', 'bag'] }
      ] },
    { id: 'funsun', title: 'Fun in the Sun',
      pages: [
        { text: 'It is hot. The sun is up.', pic: 'sun' },
        { text: 'Mum has a hat. Dad has a cap.', pic: 'hat' },
        { text: 'I sit on a mat and dig in the sand.', pic: 'mat' },
        { text: 'I dig and dig and dig.', pic: 'hand' },
        { text: 'I get a crab in my net!', pic: 'crab' },
        { text: 'It is fun in the sun.', pic: 'sun' }
      ],
      questions: [
        { q: 'What is up in the sky?', pic: 'sun', not: ['moon', 'star'] },
        { q: 'What did I get in my net?', pic: 'crab', not: ['fish', 'frog'] }
      ] },

    /* ---- Level 5: a story for each group of vowel teams. `teaches` is the
       team the story is built around; the map puts it straight after that
       team's own stop, so she reads the team in a story the same day she
       meets it on a card. Every word is still tappable — a few run ahead of
       what she has met, because a story made only of one team's words is a
       list, not a story. ---- */
    { id: 'snailtrain', title: 'The Snail on the Train', teaches: 'ai',
      pages: [
        { text: 'A snail got on a train.', pic: 'train' },
        { text: 'It was a long way, and the snail was slow.', pic: 'snail' },
        { text: 'Rain fell on the train all day.', pic: 'rain' },
        { text: 'The snail kept its tail in, out of the rain.', pic: 'tail' },
        { text: 'The train went up a hill, and then down again.', pic: 'train' },
        { text: 'At the end of the day, the snail got off. It had come a long way.', pic: 'snail' }
      ],
      questions: [
        { q: 'What did the snail get on?', pic: 'train', not: ['bus', 'boat'] },
        { q: 'What fell on the train?', pic: 'rain', not: ['snow', 'leaf'] }
      ] },
    { id: 'threebees', title: 'Three Bees in a Tree', teaches: 'ee',
      pages: [
        { text: 'Three bees sat in a green tree.', pic: 'tree' },
        { text: 'One bee had sore feet from flying.', pic: 'feet' },
        { text: 'One bee was asleep on a leaf.', pic: 'leaf' },
        { text: 'One bee was looking for seeds to eat.', pic: 'seed' },
        { text: 'Then the wind shook the tree. Whee!', pic: 'tree' },
        { text: 'Three bees flew off, and the tree was still again.', pic: 'bee' }
      ],
      questions: [
        { q: 'How many bees were there?', pic: 'three', not: ['five', 'six'] },
        { q: 'What was one bee asleep on?', pic: 'leaf', not: ['rock', 'boat'] }
      ] },
    { id: 'goatcoat', title: 'Goat in a Coat', teaches: 'oa',
      pages: [
        { text: 'A goat had a warm red coat.', pic: 'coat' },
        { text: 'It was cold, and snow fell on the road.', pic: 'snow' },
        { text: 'The goat went slowly down the road in its coat.', pic: 'road' },
        { text: 'At the end of the road was a boat.', pic: 'boat' },
        { text: '"Can I come on board?" said the goat.', pic: 'goat' },
        { text: 'The boat took the goat home, snug in its coat.', pic: 'boat' }
      ],
      questions: [
        { q: 'What did the goat have?', pic: 'coat', not: ['hat', 'sock'] },
        { q: 'What took the goat home?', pic: 'boat', not: ['train', 'bus'] }
      ] },
    { id: 'nightlight', title: 'The Fly and the Light', teaches: 'igh',
      pages: [
        { text: 'It was night. The moon was bright.', pic: 'moon' },
        { text: 'A fly saw a light in a window.', pic: 'fly' },
        { text: 'The fly flew right up to the light.', pic: 'light' },
        { text: 'It went round and round and round.', pic: 'light' },
        { text: 'Then, click! The light went off.', pic: 'night' },
        { text: 'So the fly flew high, up to the moon, to find a light that stays on.', pic: 'moon' }
      ],
      questions: [
        { q: 'What did the fly see in the window?', pic: 'light', not: ['kite', 'star'] },
        { q: 'Where did the fly go at the end?', pic: 'moon', not: ['sun', 'tree'] }
      ] },
    { id: 'cookboot', title: 'Cook and the Boot', teaches: 'oo',
      pages: [
        { text: 'Cook had a big pot and a long spoon.', pic: 'spoon' },
        { text: 'She looked in her book. It said: make moon soup.', pic: 'book' },
        { text: 'In went some food. In went some more.', pic: 'pot' },
        { text: 'Then in went something by mistake. A boot!', pic: 'boot' },
        { text: '"Oh no!" said Cook. "Not a boot!"', pic: 'cook' },
        { text: 'She fished it out with her spoon. The soup was good after all.', pic: 'spoon' }
      ],
      questions: [
        { q: 'What did Cook stir with?', pic: 'spoon', not: ['fork', 'pan'] },
        { q: 'What fell in the soup?', pic: 'boot', not: ['sock', 'hat'] }
      ] },
    { id: 'owlcow', title: 'The Owl and the Cow', teaches: 'ou',
      pages: [
        { text: 'An owl sat on a house in the town.', pic: 'house' },
        { text: 'A brown cow came down the road.', pic: 'cow' },
        { text: '"How are you, cow?" said the owl.', pic: 'owl' },
        { text: 'The cow sat down under a big black cloud.', pic: 'cloud' },
        { text: 'Out came the rain, all at once!', pic: 'rain' },
        { text: 'The cow ran home. The owl just said, "Hoo."', pic: 'owl' }
      ],
      questions: [
        { q: 'Who sat on the house?', pic: 'owl', not: ['duck', 'bird'] },
        { q: 'Who came down the road?', pic: 'cow', not: ['horse', 'goat'] }
      ] },
    { id: 'boycoin', title: 'The Boy and the Coin', teaches: 'oi',
      pages: [
        { text: 'A boy found a coin in the soil.', pic: 'coin' },
        { text: 'He put it in a jar.', pic: 'jar' },
        { text: 'Every week he put in one more coin.', pic: 'coin' },
        { text: 'Soon the jar was too heavy to lift.', pic: 'jar' },
        { text: 'The boy took his coins to the toy shop.', pic: 'toy' },
        { text: 'He got a red toy car, and he was full of joy.', pic: 'car' }
      ],
      questions: [
        { q: 'What did the boy find?', pic: 'coin', not: ['key', 'ring'] },
        { q: 'What did he buy?', pic: 'car', not: ['boat', 'drum'] }
      ] },
    { id: 'farstar', title: 'The Star on the Farm', teaches: 'ar',
      pages: [
        { text: 'It was dark on the farm.', pic: 'farm' },
        { text: 'A horse looked up and saw a star.', pic: 'horse' },
        { text: 'A bird looked up and saw the star too.', pic: 'bird' },
        { text: 'The star was so far away, and so small.', pic: 'star' },
        { text: '"I wish it were near," said the horse.', pic: 'horse' },
        { text: 'The farmer put a lamp on the barn. Now they had a star of their own.', pic: 'lamp' }
      ],
      questions: [
        { q: 'Who saw the star first?', pic: 'horse', not: ['cow', 'pig'] },
        { q: 'What did the farmer put on the barn?', pic: 'lamp', not: ['kite', 'hat'] }
      ] },

    /* ---- Level 6: stories made of the long words. ---- */
    { id: 'snowsunset', title: 'The Snowman at Sunset', teaches: 'compound',
      pages: [
        { text: 'On a cold morning, the children made a snowman.', pic: 'snowman' },
        { text: 'They gave him a carrot for a nose.', pic: 'carrot' },
        { text: 'They played football beside him all day.', pic: 'football' },
        { text: 'At sunset, the whole sky went orange and pink.', pic: 'sunset' },
        { text: 'Then one raindrop fell. Then another, and another.', pic: 'raindrop' },
        { text: 'By morning, the snowman was a puddle and a carrot.', pic: 'carrot' }
      ],
      questions: [
        { q: 'What did the children make?', pic: 'snowman', not: ['robot', 'doll'] },
        { q: 'What did they use for his nose?', pic: 'carrot', not: ['banana', 'lemon'] }
      ] },
    { id: 'busytown', title: 'A Busy Day in Town', teaches: 'ending',
      pages: [
        { text: 'Everyone in the town has a job to do.', pic: 'town' },
        { text: 'The farmer is up first. He is milking the cow.', pic: 'farmer' },
        { text: 'The baker is baking bread and muffins.', pic: 'baker' },
        { text: 'The teacher is reading a story to her class.', pic: 'teacher' },
        { text: 'A painter is painting a picture of the sea.', pic: 'painting' },
        { text: 'A boy is jumping over a puddle, splash!', pic: 'jumping' },
        { text: 'When the sun goes down, everyone goes home.', pic: 'sunset' },
        { text: 'By night, the whole town is sleeping.', pic: 'sleeping' }
      ],
      questions: [
        { q: 'Who is milking the cow?', pic: 'farmer', not: ['baker', 'nurse'] },
        { q: 'Who is reading to the class?', pic: 'teacher', not: ['farmer', 'cook'] },
        { q: 'What is the town doing at night?', pic: 'sleeping', not: ['jumping', 'reading'] }
      ] },
    { id: 'gentlegiant', title: 'The Gentle Giant', teaches: 'soft',
      pages: [
        { text: 'In the middle of the city there lived a gentle giant.', pic: 'giant' },
        { text: 'He was so tall that the giraffes looked up at him.', pic: 'giraffe' },
        { text: 'Every day he gave the children an orange each.', pic: 'orange' },
        { text: 'One day some mice ran into his house.', pic: 'mice' },
        { text: 'The giant was not cross. He gave them a slice of cheese.', pic: 'cheese' },
        { text: 'Now the mice and the giant have tea in a circle every afternoon.', pic: 'circle' }
      ],
      questions: [
        { q: 'Where did the giant live?', pic: 'city', not: ['farm', 'sea'] },
        { q: 'What ran into his house?', pic: 'mice', not: ['cat', 'ant'] },
        { q: 'What did he give the children?', pic: 'orange', not: ['apple', 'lemon'] }
      ] }
  ];

  /* ------------------------------------------------------------------
     LESSONS — built from the data above so the two never drift apart.
     ------------------------------------------------------------------ */
  var LESSONS = [];

  THEMES.forEach(function (t, i) {
    LESSONS.push({
      id: 'v-' + t.id, level: 1, n: i + 1, name: t.name, theme: t.id, icon: WORDS[t.words[0]].icon,
      unit: i < 3 ? 'Animals' : (i < 5 ? 'Things to Eat' : 'My World'),
      activities: [
        { type: 'picturePick', words: t.words, rounds: 6 },
        { type: 'memoryMatch', words: t.words, pairs: 3 }
      ]
    });
  });

  LETTERS.forEach(function (l, i) {
    LESSONS.push({
      id: 'a-' + l, level: 2, n: i + 1, letter: l,
      /* the four groups of six the reviews already marked out */
      unit: i < 6 ? 'Letters a to f' : i < 12 ? 'Letters g to l' : i < 18 ? 'Letters m to r' : 'Letters s to z',
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
      unit: 'Letters ' + span[0] + ' to ' + span[1],
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
      id: 'w-' + set.id, level: 3, n: i + 1, name: set.name, unit: 'Short Vowels',
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
    id: 'w-review1', level: 3, n: 6, name: 'Read Them All', shortName: 'Read Them All', unit: 'Short Vowels',
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
      id: 't-' + t, level: 3, n: 10 + i, team: t, unit: 'Two Letters, One Sound',
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
      unit: 'Two Sounds Together',
      icon: WORDS[set.words[0]].icon, words: set.words,
      activities: [
        { type: 'soundOut', words: set.words, rounds: 3 },
        { type: 'buildWord', words: set.words, rounds: 2 },
        { type: 'readPick', words: set.words, rounds: 3 }
      ]
    });
  });

  LESSONS.push({
    id: 'w-magice', level: 3, n: 30, name: 'Magic e', shortName: 'Magic e', unit: 'Magic e',
    icon: 'cake', words: MAGICE, magice: true,
    activities: [
      { type: 'magicE', words: MAGICE, rounds: 4 },
      { type: 'readPick', words: MAGICE, rounds: 4 },
      { type: 'wordPick', words: MAGICE, rounds: 3 }
    ]
  });

  /* ------------------------------------------------------------------
     Levels 4 to 7 are laid out as UNITS: a named group of stops that
     belong together, shown as a heading on the map. A level of thirty
     stops in one long path is a list; the same stops in five units of
     six is a plan, and a grown-up can see where she is in it at a glance.

     `n` is the order within the level. Units are listed in the order they
     are met, and each stop's `unit` is the heading it sits under.
     ------------------------------------------------------------------ */
  function add(o) { LESSONS.push(o); return o; }
  function storyStop(id, level, n, unit) {
    var st = STORIES.filter(function (x) { return x.id === id; })[0];
    return add({
      id: 'st-' + id, level: level, n: n, unit: unit, story: id,
      name: st.title, shortName: st.title, icon: WORDS[st.pages[0].pic].icon,
      activities: [{ type: 'story', story: id }]
    });
  }

  /* ---- Level 4 ----
     Sentences first, then a shelf of nine small books. */
  var U4A = 'Building Sentences', U4B = 'Little Books';
  add({ id: 's-build1', level: 4, n: 1, unit: U4A, name: 'My First Sentence', shortName: 'First Sentence',
    icon: 'cat', activities: [{ type: 'buildSentence', from: 0, rounds: 4 }] });
  add({ id: 's-pick1', level: 4, n: 2, unit: U4A, name: 'Read and Choose', shortName: 'Read & Choose',
    icon: 'quiz', activities: [{ type: 'sentencePick', from: 0, rounds: 6 }] });
  /* The first twenty sight words have been IN the sentences since the start of
     this level — `the`, `said`, `was` cannot be sounded out and are in almost
     every line — but nothing taught them. They had to wait until Level 7,
     which is two years after she first met them. */
  add({ id: 's-sight1', level: 4, n: 3, unit: U4A, name: 'Words to Just Know', shortName: 'Words to Know',
    icon: 'key', activities: [{ type: 'sightRead', set: 'first', rounds: 8 }] });
  add({ id: 's-build2', level: 4, n: 4, unit: U4A, name: 'More Sentences', shortName: 'More Sentences',
    icon: 'pen', activities: [{ type: 'buildSentence', from: 6, rounds: 4 }] });
  add({ id: 's-pick2', level: 4, n: 5, unit: U4A, name: 'Read and Choose Again', shortName: 'Read & Choose 2',
    icon: 'book', activities: [{ type: 'sentencePick', from: 6, rounds: 6 }] });
  add({ id: 's-build3', level: 4, n: 6, unit: U4A, name: 'Even More Sentences', shortName: 'Sentences 3',
    icon: 'envelope', activities: [{ type: 'buildSentence', from: 12, rounds: 6 }] });
  add({ id: 's-pick3', level: 4, n: 7, unit: U4A, name: 'Read and Choose 3', shortName: 'Read & Choose 3',
    icon: 'trophy', review: true, activities: [{ type: 'sentencePick', from: 12, rounds: 12 }] });
  ['catrat', 'foxbox', 'pigmud', 'henegg', 'dadnet', 'dogsock', 'kingsing', 'chiprat', 'funsun']
    .forEach(function (id, i) { storyStop(id, 4, 10 + i, U4B); });

  /* ---- Level 5 ----
     A card for each team, and straight after it a story built around it, so
     the team is met in a sentence on the same day it is met on a card. */
  var U5A = 'Long Vowels: ai ee oa igh', U5B = 'More Teams: oo ou oi',
      U5C = 'Vowels with r: ar or er air ear', U5D = 'Tricky Words and Review';
  function picsOf(list) {
    return list.filter(function (k) { return WORDS[k] && WORDS[k].icon && !WORDS[k].noPic; });
  }
  function teamStop(t, n, unit) {
    var vt = VOWELTEAMS[t];
    var pics = picsOf(vt.words);
    var blend = pics.filter(function (k) { return WORDS[k].ph; });
    /* A team with one spelling has nothing to sort, so it practises building
       the word instead — the same minutes, spent on what that team needs. */
    var middle = vt.spells.length > 1
      ? { type: 'spellSort', team: t, rounds: 4 }
      : { type: 'buildWord', words: blend, rounds: 3 };
    return add({
      id: 'vt-' + t, level: 5, n: n, unit: unit, team: t, vowel: true,
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
  }
  teamStop('ai', 1, U5A);  storyStop('snailtrain', 5, 2, U5A);
  teamStop('ee', 3, U5A);  storyStop('threebees', 5, 4, U5A);
  teamStop('oa', 5, U5A);  storyStop('goatcoat', 5, 6, U5A);
  teamStop('igh', 7, U5A); storyStop('nightlight', 5, 8, U5A);
  teamStop('oo', 10, U5B); teamStop('uu', 11, U5B); storyStop('cookboot', 5, 12, U5B);
  teamStop('ou', 13, U5B); storyStop('owlcow', 5, 14, U5B);
  teamStop('oi', 15, U5B); storyStop('boycoin', 5, 16, U5B);
  teamStop('ar', 20, U5C); storyStop('farstar', 5, 21, U5C);
  teamStop('or', 22, U5C); teamStop('er', 23, U5C);
  teamStop('air', 24, U5C); teamStop('ear', 25, U5C);
  /* The second list of tricky words arrives here now, not at Level 7: by six
     she is reading the stories above, and `they`, `come`, `where` are all in
     them. */
  add({ id: 'sight-1b', level: 5, n: 30, unit: U5D, name: 'More Words to Just Know', shortName: 'Tricky Words',
    icon: 'question', activities: [{ type: 'sightRead', set: 'second', rounds: 8 }] });
  add({
    id: 'vt-review', level: 5, n: 31, unit: U5D, name: 'Every Team', shortName: 'Every Team',
    icon: 'trophy', review: true,
    activities: [
      { type: 'spellSort', teams: VOWELKEYS.filter(function (t) { return VOWELTEAMS[t].spells.length > 1; }), rounds: 6 },
      { type: 'readPick', words: picsOf(VOWELKEYS.reduce(function (a, t) { return a.concat(VOWELTEAMS[t].words); }, [])), rounds: 6 },
      { type: 'wordPick', words: picsOf(VOWELKEYS.reduce(function (a, t) { return a.concat(VOWELTEAMS[t].words); }, [])), rounds: 4 }
    ]
  });

  /* ---- Level 6 ---- */
  var U6A = 'Beats and Joins', U6B = 'Endings', U6C = 'Soft c and Soft g', U6D = 'Review';
  add({ id: 'y-beats2', level: 6, n: 1, unit: U6A, name: 'Clap the Beats', shortName: 'Two Beats',
    icon: 'rabbit', activities: [{ type: 'beats', max: 2, rounds: 6 }] });
  add({ id: 'y-beats3', level: 6, n: 2, unit: U6A, name: 'Three Beats', shortName: 'Three Beats',
    icon: 'banana', activities: [{ type: 'beats', max: 3, rounds: 6 }] });
  add({ id: 'y-compound', level: 6, n: 3, unit: U6A, name: 'Two Words in One', shortName: 'Two in One',
    icon: 'cupcake',
    activities: [
      { type: 'joinWords', rounds: 6 },
      { type: 'readPick', words: COMPOUNDS.map(function (c) { return c.word; }), rounds: 4 }
    ] });
  storyStop('snowsunset', 6, 4, U6A);
  ENDINGS.forEach(function (e, i) {
    add({
      id: 'y-' + e.id, level: 6, n: 10 + i, unit: U6B, ending: e.id,
      name: e.name + '   -' + e.ending, shortName: '-' + e.ending,
      icon: e.id === 'plural' ? 'three' : (e.id === 'ing' ? 'jumping' : (e.id === 'ed' ? 'painting' : 'farmer')),
      activities: [
        { type: 'meetEnding', ending: e.id },
        { type: 'addEnding', ending: e.id, rounds: 5 },
        { type: 'endingPick', ending: e.id, rounds: 4 }
      ]
    });
  });
  storyStop('busytown', 6, 15, U6B);
  SOFT.forEach(function (sf, i) {
    add({
      id: 'y-' + sf.id, level: 6, n: 20 + i, unit: U6C, soft: sf.id,
      name: sf.name, shortName: 'soft ' + sf.letter,
      icon: sf.softWords[0],
      activities: [
        { type: 'meetSoft', soft: sf.id },
        { type: 'softSort', soft: sf.id, rounds: 6 },
        { type: 'readPick', words: sf.softWords, rounds: 3 }
      ]
    });
  });
  storyStop('gentlegiant', 6, 23, U6C);
  add({
    id: 'y-review', level: 6, n: 90, unit: U6D, name: 'All the Long Words', shortName: 'All Together',
    icon: 'trophy', review: true,
    activities: [
      { type: 'beats', max: 3, rounds: 4 },
      { type: 'addEnding', ending: 'ing', rounds: 3 },
      { type: 'softSort', soft: 'softc', rounds: 3 },
      { type: 'readPick', words: COMPOUNDS.map(function (c) { return c.word; }), rounds: 4 }
    ]
  });

  /* ---- Level 7 ----
     Six units, and every unit holds one of each of the four jobs: a book,
     an article, a chapter, and a spelling set. That is the same alternation
     as before — reading and writing and reading for meaning, never a week of
     one — but now it is visible as a week's worth of work under one heading,
     which is how a grown-up plans. */
  function bookStop(id, n, unit) {
    var bk = BOOKS.filter(function (x) { return x.id === id; })[0];
    return add({ id: 'bk-' + id, level: 7, n: n, unit: unit, book: id,
      name: bk.title, shortName: bk.title, icon: WORDS[bk.pages[0].pic].icon,
      activities: [{ type: 'book', book: id }] });
  }
  function articleStop(id, n, unit) {
    var ar = ARTICLES.filter(function (x) { return x.id === id; })[0];
    return add({ id: 'ar-' + id, level: 7, n: n, unit: unit, article: id,
      name: ar.title, shortName: ar.title, icon: ar.icon,
      activities: [
        { type: 'article', article: id },
        { type: 'wordMeaning', article: id },
        { type: 'putInOrder', article: id },
        { type: 'trueOrNot', article: id, rounds: 3 },
        { type: 'articleAsk', article: id }
      ] });
  }
  function chapterStop(bookId, partId, n, unit) {
    var bk = CHAPTER_BOOKS.filter(function (x) { return x.id === bookId; })[0];
    var ch = bk.parts.filter(function (x) { return x.id === partId; })[0];
    return add({ id: 'ch-' + partId, level: 7, n: n, unit: unit, chapter: partId,
      name: bk.title + ' · ' + ch.name, shortName: 'Chapter ' + ch.n + ': ' + ch.name,
      icon: ch.icon, activities: [{ type: 'chapter', chapter: partId }] });
  }
  function wholeStop(bookId, n, unit) {
    var bk = CHAPTER_BOOKS.filter(function (x) { return x.id === bookId; })[0];
    return add({ id: 'ch-all-' + bookId, level: 7, n: n, unit: unit, review: true,
      name: bk.title + ': The Whole Story', shortName: 'The Whole Story',
      icon: 'book', activities: [{ type: 'wholeStory', book: bookId }] });
  }
  function spellStop(id, n, unit) {
    var sp = SPELLINGS.filter(function (x) { return x.id === id; })[0];
    return add({ id: 'sp-' + id, level: 7, n: n, unit: unit, name: sp.name,
      shortName: sp.name.replace('Write the ', 'Write: '),
      icon: 'pen', activities: [{ type: 'spellIt', set: id, rounds: 5 }] });
  }
  var U7 = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6'];
  U7 = [U7[0] + ': Seeds and Kites', U7[1] + ': Rain and the Wood', U7[2] + ': Ants and Boats',
        U7[3] + ': The Moon and Max', U7[4] + ': Night and Teeth', U7[5] + ': Frogs and Volcanoes'];
  bookStop('snailrain', 1, U7[0]);  articleStop('seed', 2, U7[0]);   chapterStop('kite', 'k1', 3, U7[0]); spellStop('cvc', 4, U7[0]);
  bookStop('cookwood', 11, U7[1]);  articleStop('rain', 12, U7[1]);  chapterStop('kite', 'k2', 13, U7[1]); spellStop('teams', 14, U7[1]);
  bookStop('boyboat', 21, U7[2]);   articleStop('ants', 22, U7[2]);  chapterStop('kite', 'k3', 23, U7[2]); spellStop('vowels', 24, U7[2]);
  wholeStop('kite', 25, U7[2]);
  bookStop('moonhid', 31, U7[3]);   articleStop('moon', 32, U7[3]);  chapterStop('max', 'm1', 33, U7[3]); spellStop('magic', 34, U7[3]);
  articleStop('nightlife', 41, U7[4]); articleStop('teeth', 42, U7[4]); chapterStop('max', 'm2', 43, U7[4]); spellStop('more', 44, U7[4]);
  articleStop('frog', 51, U7[5]);   articleStop('volcano', 52, U7[5]); chapterStop('max', 'm3', 53, U7[5]);
  wholeStop('max', 54, U7[5]);
  var U7R = 'Review';
  add({ id: 'sight-2', level: 7, n: 80, unit: U7R, name: 'All the Tricky Words', shortName: 'Tricky Words',
    icon: 'question', activities: [{ type: 'sightRead', rounds: 8 }] });
  add({ id: 'bk-review', level: 7, n: 90, unit: U7R, name: 'Read On Your Own', shortName: 'On Your Own',
    icon: 'trophy', review: true,
    activities: [
      { type: 'sightRead', rounds: 4 },
      { type: 'spellIt', set: 'vowels', rounds: 4 },
      { type: 'bookQuestions', rounds: 4 },
      { type: 'trueOrNot', rounds: 4 }
    ] });

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
    ARTICLES: ARTICLES,
    CHAPTER_BOOKS: CHAPTER_BOOKS,
    BEATS: BEATS,
    COMPOUNDS: COMPOUNDS,
    ENDINGS: ENDINGS,
    SOFT: SOFT,
    SPELLINGS: SPELLINGS,
    MAGICE: MAGICE,
    story: function (id) { return STORIES.filter(function (x) { return x.id === id; })[0]; },
    book: function (id) { return BOOKS.filter(function (x) { return x.id === id; })[0]; },
    article: function (id) { return ARTICLES.filter(function (x) { return x.id === id; })[0]; },
    chapterBook: function (id) { return CHAPTER_BOOKS.filter(function (x) { return x.id === id; })[0]; },
    /* a chapter, and the book it belongs to */
    chapter: function (id) {
      for (var i = 0; i < CHAPTER_BOOKS.length; i++) {
        var hit = CHAPTER_BOOKS[i].parts.filter(function (x) { return x.id === id; })[0];
        if (hit) return { book: CHAPTER_BOOKS[i], part: hit };
      }
      return null;
    },
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
