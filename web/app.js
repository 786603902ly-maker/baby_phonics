/* app.js — screens, games, scoring.
   The child's side has no written navigation: every instruction is spoken
   and every control is a picture. The grown-up dashboard sits behind a
   press-and-hold gate and looks deliberately different. */
(function () {
  'use strict';

  var C = window.CONTENT, A = window.AUDIO, icon = window.svgIcon;
  var root = document.getElementById('app');
  var KEY = 'pipphonics-v2';

  /* ==================================================================
     STORE
     ================================================================== */
  var DEFAULTS = {
    v: 2,
    /* No child's name ships in the source. It is typed in once, in
       Grown-ups -> Settings, and lives in this browser's local storage on
       this one device — never in the repository, never on the server. */
    name: '',
    born: '',        // 'YYYY-MM', so her age keeps itself up to date
    stars: {},       // lessonId -> 1..3
    best: {},        // lessonId -> {correct, total}
    boxes: {},       // srs
    runs: [],        // one entry per finished lesson
    played: {},      // 'YYYY-MM-DD' -> stops finished that day
    settings: { voice: '', rate: 0.85, cap: 15, sfx: true, pace: 1 }
  };

  var S = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULTS);
      var p = JSON.parse(raw);
      var s = Object.assign(clone(DEFAULTS), p);
      s.settings = Object.assign({}, DEFAULTS.settings, p.settings || {});
      return s;
    } catch (e) { return clone(DEFAULTS); }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } }

  /* Leitner boxes, for the grown-up mastery map. */
  var SRS = {
    get: function (k) { return S.boxes[k] || { box: 0, seen: 0, correct: 0, last: 0 }; },
    hit: function (k) { var b = SRS.get(k); b.box = Math.min(5, b.box + 1); b.seen++; b.correct++; b.last = Date.now(); S.boxes[k] = b; },
    miss: function (k) { var b = SRS.get(k); b.box = 1; b.seen++; b.last = Date.now(); S.boxes[k] = b; },
    acc: function (k) { var b = SRS.get(k); return b.seen ? b.correct / b.seen : null; }
  };

  /* ==================================================================
     HELPERS
     ================================================================== */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function word(k) { return C.WORDS[k]; }

  /* A picture, with its word underneath. Grown-ups can replace any drawing
     with a real photo (Grown-ups -> Pictures); those live in IndexedDB. */
  var PHOTOS = {};
  function picture(k, noLabel) {
    var wd = word(k);
    var img = PHOTOS[k]
      ? '<span class="pic pic--photo" style="background-image:url(' + PHOTOS[k] + ')"></span>'
      : '<span class="pic">' + icon(wd.icon) + '</span>';
    return img + (noLabel ? '' : '<span class="picword">' + esc(wd.text) + '</span>');
  }
  function loadPhotos() {
    var keys = Object.keys(A.have).filter(function (k) { return k.indexOf('pic:') === 0; });
    return Promise.all(keys.map(function (k) {
      return A.blobURL(k).then(function (u) { if (u) PHOTOS[k.slice(4)] = u; });
    }));
  }
  function glyph(l) { return l === 'q' ? 'qu' : l; }

  function stars(n) {
    var out = '';
    for (var i = 1; i <= 3; i++) out += '<span class="st">' + icon(i <= n ? 'starOn' : 'starOff') + '</span>';
    return out;
  }

  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('go'); }, 10);
    setTimeout(function () { el.remove(); }, 2600);
  }

  /* Changing screen silences whatever is playing. A child who taps Back has
     stopped listening; carrying the last sentence into the next screen is the
     same mix-up as talking over a question. */
  function nav(html) { A.stop(); root.innerHTML = html; window.scrollTo(0, 0); }

  /* ==================================================================
     PROGRESS QUERIES
     ================================================================== */
  function starsFor(id) { return S.stars[id] || 0; }
  function done(id) { return starsFor(id) > 0; }
  function totalStars() {
    return Object.keys(S.stars).reduce(function (n, k) { return n + S.stars[k]; }, 0);
  }
  function maxStars() { return C.LESSONS.filter(function (l) { return true; }).length * 3; }

  /* ==================================================================
     AGE, AND WHICH LEVEL IT POINTS AT

     The question this answers is the one a parent actually asks: which of
     these do I open today, and when do I move her on. Two rules, and they
     are in this order on purpose:

       1. What she can already do decides where she is. The first level she
          has not finished is the level she is on, whatever her birthday says.
       2. Her age decides only where to START, and only on a device with no
          progress on it at all — because otherwise a seven-year-old opening
          this for the first time is handed picture matching for three-
          year-olds, and a four-year-old is handed a chapter book.

     Nothing is locked either way. Every stop on every level is one tap away,
     and a level that is too hard is a tap back, not a wall.
     ================================================================== */

  /* Worked out from the birth month rather than stored as a number: a number
     typed in once is wrong within a year, and wrong silently. */
  function ageYears() {
    var m = /^(\d{4})-(\d{2})$/.exec(S.born || '');
    if (!m) return null;
    var born = new Date(+m[1], +m[2] - 1, 15);
    var years = (Date.now() - born.getTime()) / (365.2425 * 24 * 3600 * 1000);
    return years > 0 && years < 20 ? years : null;
  }

  function ageText() {
    var a = ageYears();
    if (a == null) return null;
    var y = Math.floor(a), m = Math.round((a - y) * 12);
    if (m === 12) { y++; m = 0; }
    return y + (m ? ' years ' + m + ' months' : ' years');
  }

  /* The highest level her age has reached. */
  function levelForAge() {
    var a = ageYears();
    if (a == null) return null;
    var id = C.LEVELS[0].id;
    C.LEVELS.forEach(function (lv) { if (a >= lv.ageFrom) id = lv.id; });
    return id;
  }

  /* Where the app starts on a device with no progress on it at all.

     Not the level her age points at, which is the obvious answer and a bad
     one: a seven-year-old who has never done phonics would be handed an
     eight-page book she cannot read, and the app has no way to find out
     whether she can read it — it does not listen to her. The two failures are
     not symmetric. Starting too high fails hard and she stops; starting too
     low fails gently, she clears the stops in one sitting, and the app moves
     her up by itself.

     So age chooses between the only two honest entry points. Under four there
     are no letters yet, which is Level 1. From four it is the alphabet, which
     is where every phonics programme starts at every age and where a child's
     actual letter knowledge shows in about four minutes. Anything beyond that
     is the grown-up's call, which is what the map and Grown-ups -> Plan are
     for. */
  function startLevel() {
    var a = ageYears();
    return a != null && a < 4 ? 1 : 2;
  }

  /* The level she is on: the first one she has not finished. */
  function levelNow() {
    var first = null;
    C.LEVELS.forEach(function (lv) {
      if (first != null) return;
      var ls = C.levelLessons(lv.id);
      if (!ls.every(function (l) { return done(l.id); })) first = lv.id;
    });
    if (first == null) first = C.LEVELS[C.LEVELS.length - 1].id;
    var started = C.LESSONS.some(function (l) { return done(l.id); });
    return started ? first : startLevel();
  }

  function levelOf(id) {
    return C.LEVELS.filter(function (x) { return x.id === id; })[0];
  }

  /* A lesson is open if it is the first unfinished one in its level, or
     already finished, or the one right after a finished one. Nothing is
     ever hard-locked — she can replay anything. */
  function nextLesson(level) {
    var ls = C.levelLessons(level);
    for (var i = 0; i < ls.length; i++) if (!done(ls[i].id)) return ls[i];
    return ls[ls.length - 1];
  }

  /* ==================================================================
     ONE LETTER A DAY
     A gentle rhythm, not a rule: today's letter is simply the next one she
     has not finished. Nothing is locked, nothing nags, and the week strip
     just shows what happened.
     ================================================================== */
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function playedToday() { return (S.played[dayKey()] || 0) > 0; }

  /* What to do today: the next unfinished stop on the level she is on.

     This used to be the next unfinished LETTER, which worked for exactly as
     long as there were letters left. The day she finished Z the card said
     "All 26 letters done" and then had nothing to offer, on a level that was
     not the end of anything — the app stopped suggesting on the day it
     should have started suggesting harder work. It now walks the whole
     journey, so the day after Z is the first blending stop and the day after
     the last book is nothing, because that really is the end. */
  function todaysStop() {
    var lv = levelNow();
    var ls = C.levelLessons(lv);
    for (var i = 0; i < ls.length; i++) if (!done(ls[i].id)) return ls[i];
    /* that level is finished — take the first thing left anywhere after it */
    var all = C.LESSONS.filter(function (l) { return l.level >= lv && !done(l.id); });
    return all[0] || null;
  }

  /* last seven days, oldest first */
  function weekStrip() {
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      out.push({ key: dayKey(d), on: (S.played[dayKey(d)] || 0) > 0, today: i === 0,
        label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()] });
    }
    return out;
  }

  /* ==================================================================
     SOUND UNLOCK
     ================================================================== */
  var soundOn = false;
  function ensureSound() {
    if (!soundOn) { A.unlock(); soundOn = true; }
  }

  /* ==================================================================
     SCREEN · WELCOME
     ================================================================== */
  function screenWelcome() {
    var ts = totalStars();
    var stop = todaysStop();
    var doneToday = playedToday();
    var lv = stop ? levelOf(stop.level) : null;

    /* A letter stop still shows its letter and its first picture, because
       that is what she recognises on the shelf. Everything else shows the
       stop's own picture and name — the card has to work for `Team ai` and
       `The Snail and the Rain` as well as for `Bb`. */
    var today;
    if (!stop) {
      today = '<div class="today is-done"><span class="today-eyebrow">Every stop is done</span>' +
        '<span class="today-row"><span class="today-letter">A&ndash;Z</span>' +
        '<span class="today-word">and all seven levels</span></span></div>';
    } else {
      var eyebrow = doneToday ? 'Next time &mdash; or carry on now' : 'Today';
      var big = stop.letter ? esc(stop.letter.toUpperCase()) + esc(stop.letter)
        : (stop.team ? esc(stop.team) : String(stop.level));
      var label = stop.letter ? word(C.ALPHABET[stop.letter].words[0]).text
        : (stop.shortName || stop.name);
      today =
        '<button class="today' + (doneToday ? ' is-done' : '') + '" id="today">' +
          '<span class="today-eyebrow">' + eyebrow + ' &middot; ' + esc(lv.name) + '</span>' +
          '<span class="today-row">' +
            '<span class="today-letter">' + big + '</span>' +
            '<span class="today-pic">' + icon(stop.icon) + '</span>' +
            '<span class="today-word">' + esc(label) + '</span>' +
          '</span>' +
        '</button>';
    }

    var week = '<div class="week">' + weekStrip().map(function (d) {
      return '<span class="wk' + (d.on ? ' on' : '') + (d.today ? ' now' : '') + '">' +
        '<i>' + (d.on ? icon('starOn') : '') + '</i><b>' + d.label + '</b></span>';
    }).join('') + '</div>';

    nav(
      '<div class="screen wrap-welcome">' +
        '<div class="welcome">' +
          '<div class="wphoto" id="wphoto">' + icon('otter') + '</div>' +
          '<p class="weyebrow">Phonics with Pip</p>' +
          '<h1 class="wname">Hi' + (S.name ? ', ' + esc(S.name) : '') + '!</h1>' +
          '<div class="wstars">' + icon('starOn', 'wstar') + '<b>' + ts + '</b><small>star' + (ts === 1 ? '' : 's') + '</small></div>' +
          today +
          '<div class="wrow">' +
            '<button class="ghostbtn" id="go">All the stops</button>' +
            '<button class="ghostbtn ghostbtn--game" id="toGame">' + icon('trophy', 'gb-glyph') + 'Games</button>' +
            '<button class="ghostbtn" id="toBook">My Book</button>' +
          '</div>' +
          week +
        '</div>' +
        '<button class="gear" id="gear" aria-label="Grown-ups: press and hold">' + icon('gear') + '</button>' +
      '</div>'
    );
    wireGear();
    A.blobURL('photo:child').then(function (url) {
      if (!url) return;
      var el = document.getElementById('wphoto');
      if (el) { el.innerHTML = ''; el.style.backgroundImage = 'url(' + url + ')'; el.classList.add('has-photo'); }
    });
    var tb = document.getElementById('today');
    if (tb) tb.onclick = function () {
      ensureSound();
      startLesson(stop);
      /* Composed out of recorded pieces, never built as one string.

         This used to be `'Today we learn ' + letter.toUpperCase() + '.'`,
         which is different text for all 26 letters and therefore can never
         have a clip behind it — so the very first thing the app said in a
         session went to the device's own synthesiser, in whatever voice and
         accent the tablet happened to have, and it pronounced the letter's
         NAME as that voice saw fit. The one place the app was still speaking
         in two voices in one breath, and it was the opening line. */
      var open = A.say(doneToday ? 'One more.' : 'Today we learn');
      if (stop.letter) open.then(function () { return A.sayLetterName(stop.letter); });
      else if (stop.team) open.then(function () { return A.sayPhoneme(stop.team); });
    };
    document.getElementById('go').onclick = function () { ensureSound(); screenMap(); };
    document.getElementById('toBook').onclick = function () { ensureSound(); screenBook(); };
    document.getElementById('toGame').onclick = screenGamesEntry;
  }

  function wireGear() {
    var g = document.getElementById('gear');
    if (!g) return;
    var t = null, fired = false;
    function start() { fired = false; g.classList.add('holding'); t = setTimeout(function () { fired = true; g.classList.remove('holding'); screenParent(); }, 1800); }
    function stop() { clearTimeout(t); g.classList.remove('holding'); if (!fired) toast('Grown-ups: press and hold'); }
    g.addEventListener('pointerdown', start);
    g.addEventListener('pointerup', stop);
    g.addEventListener('pointerleave', stop);
    g.addEventListener('pointercancel', stop);
  }

  /* ==================================================================
     SCREEN · MAP  (the stage-by-stage path)
     ================================================================== */
  var openLevel = null;

  function screenMap() {
    var here = levelNow();
    if (openLevel == null) openLevel = here;

    var levelTabs = C.LEVELS.map(function (lv) {
      var ls = C.levelLessons(lv.id);
      var d = ls.filter(function (l) { return done(l.id); }).length;
      var state = d === ls.length ? 'is-full' : (lv.id === here ? 'is-here' : '');
      return '<button class="lvtab ' + (openLevel === lv.id ? 'is-on ' : '') + state + '" data-lv="' + lv.id + '">' +
        '<span class="lvtab-n tint-' + lv.tint + '">' + lv.id + '</span>' +
        '<span class="lvtab-t"><b>' + esc(lv.name) + '</b>' +
          '<small>' + esc(lv.age) + ' &middot; ' + d + ' / ' + ls.length + '</small></span>' +
        (lv.id === here ? '<span class="lvtab-now">here</span>' : '') +
        '</button>';
    }).join('');

    var lv = levelOf(openLevel);
    var ls = C.levelLessons(openLevel);
    var nxt = nextLesson(openLevel);
    var gameCard =
      '<button class="gamecard" id="gamecard">' +
        '<span class="gamecard-icon">' + icon('trophy') + '</span>' +
        '<span class="gamecard-text"><b>Games</b><small>' +
          'Mix it up, or pick one game on its own</small></span>' +
        '<span class="gamecard-stars">' + stars(starsFor('game')) + '</span>' +
      '</button>';
    var body = gameCard + '<div class="path">' + ls.map(function (l, i) {
      var n = starsFor(l.id);
      var isNext = l.id === nxt.id;
      return '<button class="stop ' + (i % 2 ? 'right' : 'left') + (n ? ' is-done' : '') + (isNext ? ' is-next' : '') + '" data-id="' + l.id + '">' +
        '<span class="stop-pic">' + icon(l.icon) + '</span>' +
        '<span class="stop-body">' +
          '<b>' + esc(l.shortName || l.name) + '</b>' +
          '<span class="stop-stars">' + stars(n) + '</span>' +
        '</span>' +
        '</button>';
    }).join('') + '</div>';

    /* The one line a grown-up standing behind her actually needs: is this
       level the right one to be in today, and if not, which is. */
    var ageLv = levelForAge();
    var fresh = !C.LESSONS.some(function (x) { return done(x.id); });
    var note;
    if (fresh && ageLv && ageLv > here && openLevel === here) {
      /* Nothing done yet, and she is older than this level. The app cannot
         tell what she already knows — it does not listen to her — so it
         starts where that shows fastest and says so, rather than guessing
         from her birthday and dropping her into a book. */
      note = '<span class="lvnote-now">Starting here</span> &middot; the app cannot tell what she knows yet. ' +
        'One turn here will. Tap a level above if it is too easy.';
    } else if (openLevel === here) {
      note = '<span class="lvnote-now">Where she is</span> &middot; about ' + lv.minutes + ' minutes a go';
    } else if (openLevel < here) {
      note = '<span class="lvnote-back">Already done</span> &middot; good for an easy day';
    } else {
      note = '<span class="lvnote-next">Later</span> &middot; open it when she can: ' + esc(lv.opens);
    }
    if (ageLv && openLevel > ageLv + 1) {
      note = '<span class="lvnote-next">Later</span> &middot; usually ' + esc(lv.age) + ' years old';
    }

    nav(
      '<div class="screen screen-map">' +
        '<header class="mhead">' +
          '<button class="iconbtn" id="home" aria-label="Home">' + icon('house2') + '</button>' +
          '<div class="mstars">' + icon('starOn', 'ms-glyph') + '<b>' + totalStars() + '</b></div>' +
          '<button class="iconbtn" id="book" aria-label="My book">' + icon('trophy') + '</button>' +
        '</header>' +
        '<nav class="lvtabs">' + levelTabs + '</nav>' +
        '<p class="lvblurb">' + esc(lv.blurb) + '</p>' +
        '<p class="lvnote">' + note + '</p>' +
        body +
      '</div>'
    );

    document.getElementById('home').onclick = screenWelcome;
    document.getElementById('book').onclick = screenBook;
    Array.prototype.forEach.call(document.querySelectorAll('.lvtab'), function (b) {
      b.onclick = function () { openLevel = +b.dataset.lv; screenMap(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll('.stop'), function (b) {
      b.onclick = function () { ensureSound(); startLesson(C.lesson(b.dataset.id)); };
    });
    var gc = document.getElementById('gamecard');
    if (gc) gc.onclick = screenGames;

    /* Back to where she was, if she has been somewhere; otherwise to whatever
       comes next. Coming back is positioned straight away rather than
       animated, so there is no scroll down from the top to watch. */
    var back = lastStop && document.querySelector('.stop[data-id="' + lastStop + '"]');
    if (back) {
      back.scrollIntoView({ block: 'center' });
      /* again once the pictures have laid out, or the first attempt aims at
         the wrong place and she lands near the bottom of the screen */
      requestAnimationFrame(function () { back.scrollIntoView({ block: 'center' }); });
    }
    else {
      var next = document.querySelector('.stop.is-next');
      if (next) setTimeout(function () { next.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
    }
  }

  /* ==================================================================
     SCREEN · MY BOOK  (progress the child can see)
     ================================================================== */
  function screenBook() {
    var letters = C.LETTERS.map(function (l) {
      var n = starsFor('a-' + l);
      return '<div class="bl ' + (n ? 'got' : '') + '"><b>' + esc(glyph(l)) + '</b>' +
        '<span>' + (n ? stars(n) : '') + '</span></div>';
    }).join('');

    var themes = C.THEMES.map(function (t) {
      var n = starsFor('v-' + t.id);
      return '<div class="bt ' + (n ? 'got' : '') + '">' + icon(C.WORDS[t.words[0]].icon) +
        '<span>' + esc(t.name) + '</span>' + stars(n) + '</div>';
    }).join('');

    /* Every team she has met, letters-that-make-one-sound and vowel teams
       together, because to her they are the same kind of thing. */
    var teams = Object.keys(C.TEAMS).map(function (t) {
      return { k: t, id: 't-' + t, label: t, sub: '' };
    }).concat(C.VOWELKEYS.map(function (t) {
      /* `oo` spells two different sounds — moon and book — so two tiles would
         read the same and mean different things. The IPA underneath is what
         tells them apart, and it is what the card itself prints. */
      return { k: t, id: 'vt-' + t, label: C.VOWELTEAMS[t].spells[0].as,
        sub: C.VOWELTEAMS[t].ipa };
    })).map(function (o) {
      var n = starsFor(o.id);
      return '<div class="bl ' + (n ? 'got' : '') + '"><b>' + esc(o.label) + '</b>' +
        (o.sub ? '<i class="bl-ipa">' + esc(o.sub) + '</i>' : '') +
        '<span>' + (n ? stars(n) : '') + '</span></div>';
    }).join('');

    /* And the journey itself, so a seven-year-old can see how far she has
       come rather than only what is next. */
    var road = C.LEVELS.map(function (lv) {
      var ls = C.levelLessons(lv.id);
      var d = ls.filter(function (l) { return done(l.id); }).length;
      return '<div class="broad ' + (d === ls.length ? 'got' : d ? 'part' : '') + '">' +
        '<span class="broad-n tint-' + lv.tint + '">' + lv.id + '</span>' +
        '<span class="broad-t"><b>' + esc(lv.name) + '</b>' +
          '<span class="broad-bar"><i style="width:' + Math.round((d / ls.length) * 100) + '%"></i></span></span>' +
        '<span class="broad-c">' + d + '/' + ls.length + '</span>' +
        '</div>';
    }).join('');

    nav(
      '<div class="screen screen-book">' +
        '<header class="mhead">' +
          '<button class="iconbtn" id="back" aria-label="Back">' + icon('back') + '</button>' +
          '<h2 class="mtitle">' + (S.name ? esc(S.name) + '&rsquo;s Book' : 'My Book') + '</h2>' +
          '<span class="iconbtn iconbtn--ghost"></span>' +
        '</header>' +
        '<div class="bigstars"><span class="bigstar">' + icon('starOn') + '</span><b>' + totalStars() + '</b><small>stars so far</small></div>' +
        '<h3 class="bsec">My Letters</h3>' +
        '<div class="bletters">' + letters + '</div>' +
        '<h3 class="bsec">My Teams</h3>' +
        '<div class="bletters bletters--teams">' + teams + '</div>' +
        '<h3 class="bsec">My Words</h3>' +
        '<div class="bthemes">' + themes + '</div>' +
        '<h3 class="bsec">How Far I Have Come</h3>' +
        '<div class="broads">' + road + '</div>' +
      '</div>'
    );
    document.getElementById('back').onclick = screenMap;
  }

  /* ==================================================================
     ROUND BUILDERS
     ================================================================== */
  var GEN = {};

  /* Level 1: hear a word, tap the picture. */
  function trackOf(lesson) { return lesson.theme ? 'T:' + lesson.theme : 'S:game'; }

  GEN.picturePick = function (cfg, lesson) {
    var out = [];
    sample(cfg.words, cfg.rounds).forEach(function (k) {
      var others = sample(cfg.words.filter(function (x) { return x !== k; }), 2);
      out.push({
        kind: 'pick', track: trackOf(lesson),
        text: 'Which one is it?',
        play: function () { return A.say('Where is the').then(function () { return A.sayWord(word(k).text); }); },
        options: shuffle([k].concat(others)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === k };
        })
      });
    });
    return out;
  };

  /* Level 1: memory pairs. Fun, and every flip names the picture. */
  GEN.memoryMatch = function (cfg, lesson) {
    return [{
      kind: 'memory', track: trackOf(lesson),
      text: 'Find the pairs',
      words: sample(cfg.words, cfg.pairs),
      play: function () { return A.say('Find the two that are the same.'); }
    }];
  };

  /* Level 2: the letter card — exactly the shape of the printed card. */
  GEN.meetLetter = function (cfg) {
    return [{ kind: 'meet', letter: cfg.letter, track: 'L:' + cfg.letter,
      text: 'Tap each picture to hear it' }];
  };

  /* Level 2: which picture starts with this letter's sound. */
  GEN.startsWith = function (cfg) {
    var set = cfg.letters || [cfg.letter];
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var l = set[i % set.length];
      var target = pick(C.startWords(l));
      var others = sample(C.otherWords(l), 2);
      var ends = C.END_SOUND[l];
      out.push({
        kind: 'pick', track: 'L:' + l,
        text: (ends ? 'Which one <em>ends</em> with' : 'Which one starts with') + ' <b class="gl">' + esc(glyph(l)) + '</b>?',
        play: (function (x, e) {
          return function () {
            return A.say(e ? 'Which one ends with' : 'Which one starts with')
              .then(function () { return A.sayPhoneme(x); });
          };
        })(l, ends),
        options: shuffle([target].concat(others)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === target };
        })
      });
    }
    return out;
  };

  /* Level 2: hear the sound, find the letter. */
  GEN.findLetter = function (cfg) {
    var set = cfg.letters || [cfg.letter];
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var l = set[i % set.length];
      var others = sample(C.LETTERS.filter(function (x) { return x !== l; }), 2);
      out.push({
        kind: 'pick', track: 'L:' + l,
        text: 'Which letter says this?',
        play: (function (x) {
          return function () {
            return A.sayPhoneme(x)
              .then(function () { return A.wait(150); })
              .then(function () { return A.sayPhoneme(x); });
          };
        })(l),
        options: shuffle([l].concat(others)).map(function (x) {
          return { kind: 'letter', letter: x, correct: x === l };
        })
      });
    }
    return out;
  };

  /* Level 2: the hidden-letter game — a picture, its word with one letter
     blanked out, and three letters to choose from. */
  GEN.missingLetter = function (cfg) {
    var set = cfg.letters || [cfg.letter];
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var l = set[i % set.length];
      var candidates = C.startWords(l).filter(function (k) {
        return word(k).text.toLowerCase().indexOf(l) >= 0 && word(k).text.length <= 9;
      });
      if (!candidates.length) continue;
      var k = pick(candidates);
      var txt = word(k).text;
      var at = txt.toLowerCase().indexOf(l);
      out.push({
        kind: 'missing', track: 'L:' + l,
        text: 'Which letter is missing?',
        word: k, at: at, letter: l,
        options: shuffle([l].concat(sample(C.LETTERS.filter(function (x) { return x !== l; }), 2))),
        play: (function (t) { return function () { return A.sayWord(t).then(function () { return A.say('Which letter is missing?'); }); }; })(txt)
      });
    }
    return out;
  };

  /* ------------------------------------------------------------------
     LEVEL 3 · Reading Words
     ------------------------------------------------------------------ */
  function readable(list) {
    return list.filter(function (k) { return word(k) && word(k).ph; });
  }

  GEN.soundOut = function (cfg) {
    return sample(readable(cfg.words), cfg.rounds || 3).map(function (k) {
      return { kind: 'soundout', track: 'S:blend', word: k,
        text: 'Tap each sound, then push them together',
        play: function () { return A.say('Tap each sound.'); } };
    });
  };

  GEN.buildWord = function (cfg) {
    return sample(readable(cfg.words), cfg.rounds || 3).map(function (k) {
      var ph = word(k).ph;
      var spare = sample(C.LETTERS.filter(function (x) { return ph.indexOf(x) < 0; }), 2);
      return { kind: 'build', track: 'S:blend', word: k, tiles: shuffle(ph.concat(spare)),
        text: 'Build the word',
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(k).text) };
    });
  };

  /* Two wrong answers, from this stop's own words where there are enough of
     them and from the wider picture set where there are not. A stop with two
     pictures in it — the `ear` team has `ear` and `deer` and English does not
     offer many more — was handing out two-choice rounds, which is a coin
     flip, not reading. */
  function distractors(k, from, n) {
    var out = sample(from.filter(function (x) { return x !== k; }), n);
    if (out.length < n) {
      out = out.concat(sample(C.readable().filter(function (x) {
        return x !== k && from.indexOf(x) < 0 && out.indexOf(x) < 0;
      }), n - out.length));
    }
    return out;
  }

  /* written word -> which picture is it */
  GEN.readPick = function (cfg) {
    return sample(cfg.words, cfg.rounds || 4).map(function (k) {
      var others = distractors(k, cfg.words, 2);
      return { kind: 'pick', track: 'S:read', bigword: word(k).text,
        text: 'Read it. Which one is it?',
        play: function () { return A.say('Read the word. Which one is it?'); },
        options: shuffle([k].concat(others)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === k };
        }) };
    });
  };

  /* picture -> which written word says it */
  GEN.wordPick = function (cfg) {
    return sample(cfg.words, cfg.rounds || 3).map(function (k) {
      var others = distractors(k, cfg.words, 2);
      return { kind: 'pick', track: 'S:read', anchor: k,
        text: 'Which word says it?',
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(k).text),
        options: shuffle([k].concat(others)).map(function (x) {
          return { kind: 'word', word: x, correct: x === k };
        }) };
    });
  };

  GEN.magicE = function (cfg) {
    return sample(cfg.words, cfg.rounds || 4).map(function (k) {
      return { kind: 'magice', track: 'S:read', word: k,
        text: 'The <b class="gl">e</b> at the end is quiet &mdash; it makes the vowel say its name',
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(k).text) };
    });
  };

  GEN.meetTeam = function (cfg) {
    var t = C.sound(cfg.team);
    /* `igh` is three letters, and a vowel team's whole point is that the same
       sound has more than one look, so neither can use the one line the five
       consonant teams share. */
    var line = t.spells && t.spells.length > 1
      ? 'One sound, more than one way to write it'
      : (cfg.team.length > 2 ? 'Letters that make one sound' : 'Two letters, one sound');
    return [{ kind: 'meet', letter: cfg.team, track: 'L:' + cfg.team, text: line }];
  };

  /* ------------------------------------------------------------------
     LEVEL 4 · Reading Books
     ------------------------------------------------------------------ */
  GEN.buildSentence = function (cfg) {
    return C.SENTENCES.slice(cfg.from, cfg.from + (cfg.rounds || 4)).map(function (sn) {
      return { kind: 'sentence', track: 'S:sentence', sn: sn,
        text: 'Put the words in order',
        play: function () { return A.say(sn.text); } };
    });
  };

  GEN.sentencePick = function (cfg) {
    var pool = C.SENTENCES.slice(cfg.from, cfg.from + 6);
    return sample(pool, Math.min(cfg.rounds || 6, pool.length)).map(function (sn) {
      return { kind: 'pick', track: 'S:read', text: esc(sn.text),
        play: function () { return A.say(sn.text); },
        options: shuffle([sn.pic].concat(sn.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === sn.pic };
        }) };
    });
  };

  GEN.story = function (cfg) {
    var st = C.story(cfg.story);
    var out = st.pages.map(function (pg, i) {
      return { kind: 'page', track: 'S:read', page: pg, n: i + 1, of: st.pages.length,
        title: st.title, text: 'Tap any word to hear it',
        play: (function (t) { return function () { return A.say(t); }; })(pg.text) };
    });
    st.questions.forEach(function (q) {
      out.push({ kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) });
    });
    return out;
  };

  /* ------------------------------------------------------------------
     LEVEL 5 · Same Sound, New Look
     ------------------------------------------------------------------ */

  /* Which look? The sound is the constant; the spelling is the question.
     The word is written, never pictured — the whole point is what it looks
     like on the page. */
  GEN.spellSort = function (cfg) {
    var keys = cfg.teams || [cfg.team];
    var out = [];
    for (var i = 0; i < (cfg.rounds || 4); i++) {
      var t = keys[i % keys.length];
      var vt = C.VOWELTEAMS[t];
      var box = Math.floor(Math.random() * vt.spells.length);
      var w2 = pick(vt.spells[box].words);
      out.push({
        kind: 'sort', track: 'L:' + t, team: t, word: w2, correct: box,
        text: 'Which look does it use?',
        boxes: vt.spells.map(function (x) { return { as: x.as, note: x.where }; }),
        /* the word first, then the sound inside it: this is the word, and
           THIS is the sound you are looking for a spelling of */
        play: (function (k, x) {
          return function () {
            return A.sayWord(word(x).text)
              .then(function () { return A.gap(gap()); })
              .then(function () { return A.sayPhoneme(k); });
          };
        })(t, w2)
      });
    }
    return out;
  };

  /* ------------------------------------------------------------------
     LEVEL 6 · Longer Words
     ------------------------------------------------------------------ */

  /* Clap the beats. A long word is not one lump — it is two or three short
     ones, and hearing that is what stops a child guessing at `basket` from
     its first letter. */
  GEN.beats = function (cfg) {
    var pool = C.BEATS.filter(function (b) { return b.n <= (cfg.max || 3); });
    /* every round is a different word, and the counts stay mixed so the
       answer cannot be guessed from the last one */
    return sample(pool, Math.min(cfg.rounds || 6, pool.length)).map(function (b) {
      return { kind: 'beats', track: 'S:beats', word: b.word, n: b.n,
        text: 'How many beats?',
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(b.word).text) };
    });
  };

  /* Two words she can already read, stuck together. */
  GEN.joinWords = function (cfg) {
    return sample(C.COMPOUNDS, Math.min(cfg.rounds || 6, C.COMPOUNDS.length)).map(function (c) {
      var others = [];
      C.COMPOUNDS.forEach(function (x) {
        if (x.word !== c.word) others = others.concat(x.parts);
      });
      return { kind: 'join', track: 'S:long', word: c.word, parts: c.parts,
        bank: shuffle(c.parts.concat(sample(others, 2))),
        text: 'Two words make one',
        play: (function (t) { return function () { return A.sayWord(t); }; })(c.word) };
    });
  };

  GEN.meetEnding = function (cfg) {
    return [{ kind: 'meetend', ending: cfg.ending, track: 'S:long',
      text: 'Tap each one to hear it' }];
  };

  /* The base word and the ending, side by side, pushed together. */
  GEN.addEnding = function (cfg) {
    var e = C.ending(cfg.ending);
    return sample(e.items, Math.min(cfg.rounds || 5, e.items.length)).map(function (it) {
      return { kind: 'addend', track: 'S:long', base: it.base, made: it.made,
        ending: it.note || e.ending,
        text: 'Add the ending',
        play: (function (t) { return function () { return A.sayWord(t); }; })(it.made) };
    });
  };

  /* And the test of it: hear the whole word, pick which of the three it was.
     jump, jumping, jumped differ only in the ending, so this is the ending
     and nothing else. */
  GEN.endingPick = function (cfg) {
    var e = C.ending(cfg.ending);
    var pool = e.items.filter(function (it) { return C.WORDS[it.base] && C.WORDS[it.made]; });
    return sample(pool, Math.min(cfg.rounds || 4, pool.length)).map(function (it) {
      /* The best wrong answers are the SAME word with a different ending —
         jump, jumping, jumped differ in nothing else, so choosing between
         them is the ending and nothing else. Not every base has three forms,
         so the rest are made up from other bases with this same ending, which
         at least keeps the question about endings. */
      var kin = C.ENDINGS.reduce(function (a, x) {
        return a.concat(x.items.filter(function (y) {
          return y.base === it.base && y.made !== it.made && C.WORDS[y.made];
        }).map(function (y) { return y.made; }));
      }, []).concat([it.base]);
      var others = sample(kin, 2);
      if (others.length < 2) {
        others = others.concat(sample(pool.filter(function (y) {
          return y.made !== it.made && others.indexOf(y.made) < 0;
        }).map(function (y) { return y.made; }), 2 - others.length));
      }
      return { kind: 'pick', track: 'S:long',
        text: 'Which word did you hear?',
        play: (function (t) { return function () { return A.sayWord(t); }; })(it.made),
        options: shuffle([it.made].concat(others)).map(function (x) {
          return { kind: 'word', word: x, correct: x === it.made };
        }) };
    });
  };

  GEN.meetSoft = function (cfg) {
    return [{ kind: 'meetsoft', soft: cfg.soft, track: 'S:long',
      text: 'The same letter, two jobs' }];
  };

  /* Hard or soft: the letter is the same, the sound is not, and the vowel
     after it is the whole tell. */
  GEN.softSort = function (cfg) {
    var sf = C.softOf(cfg.soft);
    var out = [];
    var pool = shuffle(sf.softWords.map(function (k) { return { k: k, i: 0 }; })
      .concat(sf.hardWords.map(function (k) { return { k: k, i: 1 }; })));
    pool.slice(0, cfg.rounds || 6).forEach(function (o) {
      out.push({ kind: 'sort', track: 'S:long', word: o.k, correct: o.i,
        text: 'What does <b class="gl">' + esc(sf.letter) + '</b> say here?',
        boxes: [{ as: sf.soft, note: 'the soft one' }, { as: sf.hard, note: 'the hard one' }],
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(o.k).text) });
    });
    return out;
  };

  /* ------------------------------------------------------------------
     LEVEL 7 · Real Books
     ------------------------------------------------------------------ */

  /* A book is a story with eight pages instead of five and three questions
     instead of two, so it runs on the story engine unchanged. */
  GEN.book = function (cfg) {
    var bk = C.book(cfg.book);
    var out = bk.pages.map(function (pg, i) {
      return { kind: 'page', track: 'S:read', page: pg, n: i + 1, of: bk.pages.length,
        title: bk.title, text: 'Tap any word to hear it',
        play: (function (t) { return function () { return A.say(t); }; })(pg.text) };
    });
    bk.questions.forEach(function (q) {
      out.push({ kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) });
    });
    return out;
  };

  GEN.bookQuestions = function (cfg) {
    var all = [];
    C.BOOKS.forEach(function (bk) { all = all.concat(bk.questions); });
    return sample(all, Math.min(cfg.rounds || 6, all.length)).map(function (q) {
      return { kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) };
    });
  };

  /* Dictation. No picture: she hears the word and writes it, which is the
     other half of phonics and the half a reading app usually leaves out.
     The tiles are LETTERS, not sounds — `ship` is four letters and three
     sounds, and spelling is about the letters. */
  GEN.spellIt = function (cfg) {
    var set = C.spellingSet(cfg.set);
    return sample(set.words, Math.min(cfg.rounds || 5, set.words.length)).map(function (k) {
      var letters = word(k).text.split('');
      var spare = sample(C.LETTERS.filter(function (x) { return letters.indexOf(x) < 0; }), 3);
      return { kind: 'spell', track: 'S:spell', word: k,
        tiles: shuffle(letters.concat(spare)),
        text: 'Listen, then write it',
        play: (function (t) { return function () { return A.sayWord(t); }; })(word(k).text) };
    });
  };

  /* The words that cannot be sounded out and have to be known by sight.
     Written options only — a sight word has no picture, that is the point. */
  GEN.sightRead = function (cfg) {
    /* `first` is the twenty that turn up in Level 4's own sentences; without
       a set it is all forty-six, which is what Level 7 asks for. */
    var pool = cfg.set === 'first' ? C.SIGHT : C.SIGHT.concat(C.SIGHT2);
    return sample(pool, cfg.rounds || 8).map(function (t) {
      var others = sample(pool.filter(function (x) { return x !== t; }), 2);
      return { kind: 'pick', track: 'S:sight',
        text: 'Which word did you hear?',
        play: (function (x) { return function () { return A.sayWord(x); }; })(t),
        options: shuffle([t].concat(others)).map(function (x) {
          return { kind: 'text', text: x, correct: x === t };
        }) };
    });
  };

  /* ------------------------------------------------------------------
     LEVEL 7 · reading to find something out

     A book is read for the story; an article is read for the answer, and
     that is a different job. These four activities are the four things a
     seven-year-old actually has to be able to do with a page of text —
     get through it, work out a word from around it, hold the order of what
     it said, and tell what it did say from what it did not.
     ------------------------------------------------------------------ */

  /* The article itself: a picture and two sentences at a time, every word
     tappable. No controlled word list here — by seven an unfamiliar word is
     something to reach for, and tapping it is the reaching. */
  GEN.article = function (cfg) {
    var ar = C.article(cfg.article);
    return ar.parts.map(function (pt, i) {
      return { kind: 'page', track: 'S:read', page: pt, n: i + 1, of: ar.parts.length,
        title: ar.title, article: true, topic: ar.topic,
        text: 'Tap any word to hear it',
        play: (function (t) { return function () { return A.say(t); }; })(pt.text) };
    });
  };

  /* Two words from what she has just read, and what each one means. The
     wrong answers are plausible, so the question is answered from the
     article rather than by elimination. */
  GEN.wordMeaning = function (cfg) {
    var ar = C.article(cfg.article);
    return ar.words.map(function (w2) {
      return { kind: 'pick', track: 'S:meaning',
        bigword: w2.word,
        text: 'What does this word mean?',
        play: (function (x) { return function () { return A.sayWord(x); }; })(w2.word),
        options: shuffle([w2.means].concat(w2.not)).map(function (x) {
          return { kind: 'text', text: x, correct: x === w2.means, small: true };
        }) };
    });
  };

  /* Put the stages back in order. It cannot be done by remembering words —
     only by having understood how the thing works. */
  GEN.putInOrder = function (cfg) {
    var ar = C.article(cfg.article);
    return [{ kind: 'order', track: 'S:meaning', order: ar.order,
      text: 'Put them in order',
      play: function () { return A.say('Put them in order'); } }];
  };

  /* True, or not true. Answerable only from the article — which is what
     makes it reading and not guessing. */
  GEN.trueOrNot = function (cfg) {
    var pool = cfg.article ? C.article(cfg.article).facts
      : C.ARTICLES.reduce(function (a, x) { return a.concat(x.facts); }, []);
    return sample(pool, Math.min(cfg.rounds || 3, pool.length)).map(function (f) {
      return { kind: 'sort', track: 'S:meaning',
        label: f.text, speak: f.text, correct: f.yes ? 0 : 1,
        text: 'Is that true?',
        boxes: [{ as: 'True' }, { as: 'Not true' }],
        play: (function (t) { return function () { return A.say(t); }; })(f.text) };
    });
  };

  GEN.articleAsk = function (cfg) {
    var ar = C.article(cfg.article);
    return ar.questions.map(function (q) {
      return { kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) };
    });
  };

  /* One chapter of the long story, then its two questions. */
  GEN.chapter = function (cfg) {
    var ch = C.chapter(cfg.chapter);
    var out = ch.pages.map(function (pg, i) {
      return { kind: 'page', track: 'S:read', page: pg, n: i + 1, of: ch.pages.length,
        title: C.CHAPTERS.title + ' \u00b7 ' + ch.name, chapter: ch.n,
        text: 'Tap any word to hear it',
        play: (function (t) { return function () { return A.say(t); }; })(pg.text) };
    });
    ch.questions.forEach(function (q) {
      out.push({ kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) });
    });
    return out;
  };

  /* And the questions that need all three chapters at once. The first was
     read days ago, which is the point: everything before this level fitted
     on one screen and so never had to be held. */
  GEN.wholeStory = function () {
    var out = [];
    C.CHAPTERS.parts.forEach(function (ch) {
      out.push({ kind: 'pick', track: 'S:read',
        text: 'Which chapter is this? &mdash; ' + esc(ch.pages[0].text),
        play: (function (t) { return function () { return A.say(t); }; })(ch.pages[0].text),
        options: shuffle(C.CHAPTERS.parts.map(function (x) { return x; })).map(function (x) {
          return { kind: 'text', text: 'Chapter ' + x.n + ': ' + x.name, correct: x.id === ch.id, small: true };
        }) });
    });
    C.CHAPTERS.questions.forEach(function (q) {
      out.push({ kind: 'pick', track: 'S:read', text: esc(q.q),
        play: (function (t) { return function () { return A.say(t); }; })(q.q),
        options: shuffle([q.pic].concat(q.not)).map(function (x) {
          return { kind: 'pic', word: x, correct: x === q.pic };
        }) });
    });
    return out;
  };

  /* ==================================================================
     GAME MODE — every letter she has met, all mixed together
     ================================================================== */
  function learnedLetters() {
    var l = C.LETTERS.filter(function (x) { return done('a-' + x); });
    return l.length >= 3 ? l : C.LETTERS.slice(0, 6);
  }
  function screenGamesEntry() { ensureSound(); screenGames(); }

  /* Mix it up grows with her. At four it is letters; once she is reading it
     is letters AND words AND, later, the vowel teams and the endings — old
     work mixed back in, which is the only thing that stops the early levels
     fading while she is busy with the late ones. It takes the level she is on
     as the ceiling, so it never asks for something she has not met. */
  function gameLesson() {
    var set = learnedLetters();
    var pool = [];
    set.forEach(function (l) { pool = pool.concat(C.ALPHABET[l].words); });
    var reach = levelNow();
    var acts = [
      { type: 'findLetter', letters: set, rounds: reach >= 3 ? 3 : 4 },
      { type: 'startsWith', letters: set, rounds: reach >= 3 ? 3 : 4 },
      { type: 'missingLetter', letters: set, rounds: 3 }
    ];
    if (reach >= 3) {
      acts.push({ type: 'soundOut', words: C.readable(), rounds: 2 });
      acts.push({ type: 'readPick', words: C.readable(), rounds: 3 });
    }
    if (reach >= 5) {
      acts.push({ type: 'spellSort',
        teams: C.VOWELKEYS.filter(function (t) { return C.VOWELTEAMS[t].spells.length > 1; }),
        rounds: 3 });
    }
    if (reach >= 6) {
      acts.push({ type: 'beats', max: 3, rounds: 3 });
      acts.push({ type: 'addEnding', ending: pick(C.ENDINGS).id, rounds: 2 });
    }
    if (reach >= 7) acts.push({ type: 'sightRead', rounds: 3 });
    /* the memory round goes last, because it is the long one and it is the
       one to be in the middle of when the session cap arrives */
    if (reach < 5) acts.push({ type: 'memoryMatch', words: sample(pool, 6), pairs: 3 });
    return {
      id: 'game', level: Math.min(reach, 7), game: true, name: 'Mix it up', shortName: 'Mix it up',
      icon: 'trophy', letters: set,
      activities: acts
    };
  }

  function startGame() {
    ensureSound();
    startLesson(gameLesson(), true);
  }

  /* Every game she has unlocked, playable on its own. Nothing here is
     sequential: pick a game, get eight quick rounds of it. */
  var FREEGAMES = [
    { id: 'picture', name: 'Find the Picture', icon: 'cat', level: 1,
      make: function () {
        var pool = [];
        C.THEMES.forEach(function (t) { pool = pool.concat(t.words); });
        return [{ type: 'picturePick', words: pool, rounds: 8 }];
      } },
    { id: 'memory', name: 'Memory Pairs', icon: 'starOn', level: 1,
      make: function () {
        var pool = [];
        C.THEMES.forEach(function (t) { pool = pool.concat(t.words); });
        return [{ type: 'memoryMatch', words: pool, pairs: 3 },
                { type: 'memoryMatch', words: pool, pairs: 4 }];
      } },
    { id: 'letter', name: 'Find the Letter', icon: 'quiz', level: 2,
      make: function () { return [{ type: 'findLetter', letters: learnedLetters(), rounds: 8 }]; } },
    { id: 'starts', name: 'What Starts With…', icon: 'key', level: 2,
      make: function () { return [{ type: 'startsWith', letters: learnedLetters(), rounds: 8 }]; } },
    { id: 'missing', name: 'Missing Letter', icon: 'pen', level: 2,
      make: function () { return [{ type: 'missingLetter', letters: learnedLetters(), rounds: 8 }]; } },
    { id: 'soundout', name: 'Sound It Out', icon: 'drum', level: 3,
      make: function () { return [{ type: 'soundOut', words: C.readable(), rounds: 6 }]; } },
    { id: 'build', name: 'Build the Word', icon: 'robot', level: 3,
      make: function () { return [{ type: 'buildWord', words: C.readable(), rounds: 6 }]; } },
    { id: 'magice', name: 'Magic e', icon: 'cake', level: 3,
      make: function () { return [{ type: 'magicE', words: C.MAGICE, rounds: 5 },
                                  { type: 'readPick', words: C.MAGICE, rounds: 4 }]; } },
    { id: 'read', name: 'Read the Word', icon: 'quilt', level: 3,
      make: function () { return [{ type: 'readPick', words: C.readable(), rounds: 5 },
                                  { type: 'wordPick', words: C.readable(), rounds: 4 }]; } },
    { id: 'sentence', name: 'Make a Sentence', icon: 'envelope', level: 4,
      make: function () { return [{ type: 'buildSentence', from: 0, rounds: 4 }]; } },
    { id: 'choose', name: 'Read and Choose', icon: 'book', level: 4,
      make: function () { return [{ type: 'sentencePick', from: 0, rounds: 6 }]; } },
    { id: 'sort', name: 'Which Look?', icon: 'pair', level: 5,
      make: function () {
        return [{ type: 'spellSort',
          teams: C.VOWELKEYS.filter(function (t) { return C.VOWELTEAMS[t].spells.length > 1; }),
          rounds: 8 }];
      } },
    { id: 'beats', name: 'Clap the Beats', icon: 'hand', level: 6,
      make: function () { return [{ type: 'beats', max: 3, rounds: 8 }]; } },
    { id: 'join', name: 'Two Words in One', icon: 'cupcake', level: 6,
      make: function () { return [{ type: 'joinWords', rounds: 6 }]; } },
    { id: 'endings', name: 'Add the Ending', icon: 'jumping', level: 6,
      make: function () {
        return C.ENDINGS.map(function (e) { return { type: 'addEnding', ending: e.id, rounds: 2 }; });
      } },
    { id: 'spell', name: 'Write It Down', icon: 'pencil', level: 7,
      make: function () {
        return C.SPELLINGS.map(function (x) { return { type: 'spellIt', set: x.id, rounds: 3 }; });
      } },
    { id: 'sight', name: 'Tricky Words', icon: 'question', level: 7,
      make: function () { return [{ type: 'sightRead', rounds: 8 }]; } },
    { id: 'truefalse', name: 'True or Not True', icon: 'thumb', level: 7,
      make: function () { return [{ type: 'trueOrNot', rounds: 8 }]; } },
    { id: 'meanings', name: 'What Does It Mean?', icon: 'seed', level: 7,
      make: function () {
        return C.ARTICLES.map(function (a) { return { type: 'wordMeaning', article: a.id }; });
      } },
    { id: 'order', name: 'Put Them in Order', icon: 'three', level: 7,
      make: function () {
        return C.ARTICLES.map(function (a) { return { type: 'putInOrder', article: a.id }; });
      } }
  ];

  function startFreeGame(g) {
    ensureSound();
    startLesson({
      id: 'free-' + g.id, level: g.level, game: true, free: true,
      name: g.name, shortName: g.name, icon: g.icon,
      activities: g.make()
    }, true);
  }

  function screenGames() {
    nav(
      '<div class="screen screen-games">' +
        '<header class="mhead">' +
          '<button class="iconbtn" id="gback" aria-label="Back">' + icon('back') + '</button>' +
          '<h2 class="mtitle">Games</h2>' +
          '<span class="iconbtn iconbtn--ghost"></span>' +
        '</header>' +
        '<p class="lvblurb">Pick any game. Nothing has to be done in order.</p>' +
        '<button class="gamecard" id="mixcard">' +
          '<span class="gamecard-icon">' + icon('trophy') + '</span>' +
          '<span class="gamecard-text"><b>Mix it up</b><small>' +
            learnedLetters().length + ' letters, all jumbled together</small></span>' +
          '<span class="gamecard-stars">' + stars(starsFor('game')) + '</span>' +
        '</button>' +
        '<div class="gtiles">' + FREEGAMES.map(function (g) {
          var lv = C.LEVELS.filter(function (x) { return x.id === g.level; })[0];
          return '<button class="gtile" data-g="' + g.id + '">' +
            '<span class="gtile-pic">' + icon(g.icon) + '</span>' +
            '<b>' + esc(g.name) + '</b>' +
            '<small>Level ' + g.level + ' &middot; ' + esc(lv.name) + '</small>' +
            '<span class="gtile-stars">' + stars(starsFor('free-' + g.id)) + '</span>' +
            '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    document.getElementById('gback').onclick = screenWelcome;
    document.getElementById('mixcard').onclick = startGame;
    Array.prototype.forEach.call(document.querySelectorAll('.gtile'), function (b) {
      b.onclick = function () {
        startFreeGame(FREEGAMES.filter(function (g) { return g.id === b.dataset.g; })[0]);
      };
    });
  }

  /* ==================================================================
     LESSON RUNNER
     ================================================================== */
  var run = null;
  var sessionStart = 0;
  /* The stop the child last walked into. Coming out of a letter, the map
     should put her back where she was standing, not at the top of the path
     and not at whatever the app thinks she should do next. */
  var lastStop = null;

  function startLesson(lesson, mix) {
    if (lesson && lesson.id) {
      lastStop = lesson.id;
      if (lesson.level) openLevel = lesson.level;
    }
    var rounds = [];
    lesson.activities.forEach(function (a) {
      if (GEN[a.type]) rounds = rounds.concat(GEN[a.type](a, lesson));
    });
    if (!rounds.length) { toast('Nothing here yet'); return; }
    if (mix) {
      /* in game mode the round types interleave, so it never feels like a drill */
      var mem = rounds.filter(function (x) { return x.kind === 'memory'; });
      rounds = shuffle(rounds.filter(function (x) { return x.kind !== 'memory'; })).concat(mem);
    }
    run = { lesson: lesson, rounds: rounds, i: 0, correct: 0, tries: 0, t0: Date.now() };
    if (!sessionStart) sessionStart = Date.now();
    renderRound();
  }

  function shell(inner, opts) {
    if (!run) return;
    opts = opts || {};
    var r = run.rounds[run.i];
    var pct = Math.round((run.i / run.rounds.length) * 100);
    nav(
      '<div class="screen screen-play">' +
        '<div class="pbar-row">' +
          '<button class="iconbtn" id="quit" aria-label="' +
            (run.i > 0 ? 'Back to the last one' : 'Back to the map') + '">' + icon('back') + '</button>' +
          '<div class="pbar"><i style="width:' + pct + '%"></i></div>' +
          '<div class="scorechip">' + icon('starOn', 'sc-glyph') + '<b>' + run.correct + '</b></div>' +
          '<button class="iconbtn" id="again" aria-label="Say it again">' + icon('ear') + '</button>' +
        '</div>' +
        '<div class="says"><span class="says-pip">' + icon('otter') + '</span><p>' + (r.text || '') + '</p></div>' +
        '<div class="stagearea">' + inner + '</div>' +
      '</div>'
    );
    document.getElementById('quit').onclick = function () {
      A.stop();
      /* Back means the question before this one, not out of the lesson
         altogether — she is usually trying to hear a word again. Only from the
         first question does it leave. */
      if (run && run.i > 0) { run.i--; renderRound(); return; }
      run = null; screenMap();
    };
    document.getElementById('again').onclick = function () { A.stop(); if (r.play) r.play(); };
    /* Nothing from the last question may still be queued when this one asks
       its own: whatever is left is the previous answer, and hearing it here is
       exactly the mix-up this pause is meant to prevent. */
    if (!opts.silent && r.play) {
      var mine = run;
      A.stop();
      setTimeout(function () { if (run === mine) r.play(); }, 260);
    }
  }

  /* How long to sit still between one question and the next. A four-year-old
     needs the gap; the grown-up can widen or narrow it. */
  var PAUSE = [500, 800, 1300];        // brisk, steady, slow
  function pause() { return PAUSE[S.settings.pace] || PAUSE[1]; }

  /* And how much silence to leave between the sounds inside one letter card,
     as a fraction of the sound just played. The same three settings move it. */
  var GAP = [0.28, 0.40, 0.60];
  function gap() { return GAP[S.settings.pace] || GAP[1]; }

  /* Move to the next question — but never before the last one has finished
     speaking. Advancing on a fixed timer is what made the app talk over
     itself: the praise and the word were still queued, so the child saw
     question five while hearing the answer to question four. */
  function advance(ms) {
    if (!run) return;
    var mine = run;
    var wait = ms == null ? pause() : ms;
    A.idle().then(function () {
      if (run !== mine) return;                 // quit, or a restart, meanwhile
      setTimeout(function () {
        if (run !== mine) return;
        run.i++;
        if (run.i >= run.rounds.length) finishLesson();
        else renderRound();
      }, wait);
    });
  }

  /* Score a round once. Now that Back can return to a question already
     answered, answering it again must not hand out a second star. */
  function credit(track) {
    if (!run) return false;
    var r = run.rounds[run.i];
    if (r && r.scored) return false;
    if (r) r.scored = true;
    run.correct++; run.tries++;
    if (track) SRS.hit(track);
    return true;
  }

  function right(track) {
    if (!run) return;
    credit(track);
    if (S.settings.sfx) A.sfx('correct');
    return A.say(pick(['Yes!', 'Well done!', 'You got it!', 'Clever girl!', 'That is right!']));
  }
  function wrong(track) {
    if (!run) return;
    run.tries++;
    if (track) SRS.miss(track);
    if (S.settings.sfx) A.sfx('retry');
    A.say(pick(['Try again.', 'Not that one. Try again.', 'Have another go.']));
  }

  function renderRound() {
    if (!run) return;
    var r = run.rounds[run.i];
    ({ pick: rPick, memory: rMemory, meet: rMeet, missing: rMissing,
       soundout: rSoundOut, build: rBuild, magice: rMagicE,
       sentence: rSentence, page: rPage, sort: rSort, beats: rBeats,
       join: rJoin, meetend: rMeetEnding, addend: rAddEnding,
       meetsoft: rMeetSoft, spell: rSpell, order: rOrder })[r.kind](r);
  }

  /* ---- tap each sound, then push them together ---- */
  function rSoundOut(r) {
    var wd = word(r.word);
    shell(
      '<div class="blend">' +
        '<div class="btiles">' + wd.ph.map(function (t, i) {
          return '<button class="btile" data-i="' + i + '" data-p="' + t + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
        '<button class="pushbtn" id="push" disabled>push them together' +
          '<svg viewBox="0 0 60 24" aria-hidden="true"><path d="M4 12h44M40 5l9 7-9 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<div class="reveal" id="reveal" hidden>' + picture(r.word) + '</div>' +
      '</div>'
    );
    var heard = {}, push = document.getElementById('push');
    var tiles = document.querySelectorAll('.btile');
    Array.prototype.forEach.call(tiles, function (el) {
      el.onclick = function () {
        el.classList.remove('lit'); void el.offsetWidth; el.classList.add('lit');
        A.sayPhoneme(el.dataset.p);
        SRS.hit('L:' + el.dataset.p);
        heard[el.dataset.i] = true;
        if (Object.keys(heard).length === wd.ph.length) push.disabled = false;
      };
    });
    push.onclick = function () {
      push.disabled = true;
      document.querySelector('.btiles').classList.add('squeeze');
      var tok = A.epoch();
      var seq = Promise.resolve();
      wd.ph.forEach(function (ph, i) {
        seq = seq.then(function () {
          if (A.epoch() !== tok) return;
          Array.prototype.forEach.call(tiles, function (x) { x.classList.remove('lit'); });
          if (tiles[i]) tiles[i].classList.add('lit');
          return A.sayPhoneme(ph);
        }).then(function () { return A.wait(90); });
      });
      seq.then(function () {
        if (A.epoch() !== tok) return;
        Array.prototype.forEach.call(tiles, function (x) { x.classList.add('lit'); });
        return A.sayWord(wd.text);
      }).then(function () {
        if (A.epoch() !== tok) return;
        var rev = document.getElementById('reveal');
        if (!rev) return;
        rev.hidden = false;
        right(r.track);
        advance(1200);
      });
    };
  }

  /* ---- build the word from letter tiles (tap, no dragging) ---- */
  function rBuild(r) {
    var wd = word(r.word);
    shell(
      '<div class="builder">' +
        '<div class="builder-pic">' + picture(r.word, true) + '</div>' +
        '<div class="slots">' + wd.ph.map(function (_, i) {
          return '<div class="slot" data-i="' + i + '"></div>';
        }).join('') + '</div>' +
        '<div class="ltiles">' + r.tiles.map(function (t, i) {
          return '<button class="ltile" data-p="' + t + '" data-i="' + i + '">' + esc(t) + '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    var next = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.ltile'), function (el) {
      el.onclick = function () {
        if (el.dataset.used === '1') return;
        A.sayPhoneme(el.dataset.p);
        if (el.dataset.p === wd.ph[next]) {
          var slot = document.querySelector('.slot[data-i="' + next + '"]');
          slot.textContent = el.dataset.p;
          slot.classList.add('filled');
          el.dataset.used = '1';
          el.classList.add('used');
          if (S.settings.sfx) A.sfx('pop');
          next++;
          if (next === wd.ph.length) {
            A.sayWord(wd.text).then(function () { right(r.track); advance(700); });
          }
        } else {
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 650);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- magic e ---- */
  function rMagicE(r) {
    var t = word(r.word).text;
    shell(
      '<div class="magice">' +
        '<div class="magice-pic">' + picture(r.word, true) + '</div>' +
        '<button class="magice-word" id="mw">' +
          esc(t.slice(0, -1)) + '<b>' + esc(t.slice(-1)) + '</b>' +
        '</button>' +
        '<button class="nextbtn ready" id="menext">' + icon('play') + '</button>' +
      '</div>'
    );
    document.getElementById('mw').onclick = function () { A.sayWord(t); };
    document.getElementById('menext').onclick = function () {
      A.stop();                       // she tapped next; she has heard enough
      credit(r.track); advance(0);
    };
  }

  /* ---- put the words in order ---- */
  function rSentence(r) {
    var words = r.sn.text.replace(/[.!?]$/, '').split(' ');
    var end = r.sn.text.slice(-1);
    shell(
      '<div class="sent">' +
        '<div class="sent-pic">' + picture(r.sn.pic, true) + '</div>' +
        '<div class="sent-line" id="line"></div>' +
        '<div class="sent-bank" id="bank">' + shuffle(words.map(function (w2, i) { return { w: w2, i: i }; }))
          .map(function (o) { return '<button class="wcard" data-w="' + esc(o.w) + '">' + esc(o.w) + '</button>'; })
          .join('') + '</div>' +
      '</div>'
    );
    var next = 0, line = document.getElementById('line');
    Array.prototype.forEach.call(document.querySelectorAll('.wcard'), function (el) {
      el.onclick = function () {
        if (el.dataset.used === '1') return;
        if (el.dataset.w === words[next]) {
          el.dataset.used = '1';
          el.classList.add('used');
          var span = document.createElement('span');
          span.className = 'placed-word';
          span.textContent = words[next] + (next === words.length - 1 ? end : '');
          line.appendChild(span);
          A.sayWord(words[next]);
          if (S.settings.sfx) A.sfx('pop');
          next++;
          if (next === words.length) {
            A.say(r.sn.text).then(function () { right(r.track); advance(900); });
          }
        } else {
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 650);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- one page of a story, a chapter, or an article ----
     The same shape serves all three. An article gets its topic as an
     eyebrow and a button to hear the whole thing read, because it is read
     for what it says and she will want it again; a story page does not,
     because it is read once and turned over. */
  function rPage(r) {
    shell(
      '<div class="story' + (r.article ? ' story--article' : '') + '">' +
        (r.topic ? '<p class="story-topic">' + esc(r.topic) + '</p>' : '') +
        '<p class="story-title">' + esc(r.title) + ' &middot; ' + r.n + ' of ' + r.of + '</p>' +
        '<div class="story-pic">' + picture(r.page.pic, true) + '</div>' +
        '<p class="story-text">' + r.page.text.split(' ').map(function (w2) {
          return '<button class="sword">' + esc(w2) + '</button>';
        }).join(' ') + '</p>' +
        (r.article ? '<button class="readbtn" id="pread">' + icon('ear') + '<span>read it to me</span></button>' : '') +
        '<button class="nextbtn ready" id="pnext">' + icon('play') + '</button>' +
      '</div>'
    );
    Array.prototype.forEach.call(document.querySelectorAll('.sword'), function (el) {
      el.onclick = function () {
        el.classList.remove('lit'); void el.offsetWidth; el.classList.add('lit');
        A.sayWord(el.textContent.replace(/[^A-Za-z']/g, ''));
      };
    });
    var rb = document.getElementById('pread');
    if (rb) rb.onclick = function () { A.stop(); A.say(r.page.text); };
    document.getElementById('pnext').onclick = function () {
      A.stop();
      credit(r.track); advance(0);
    };
  }

  /* ---- sort it into a box: which spelling, or which sound ----
     One renderer for two games that are the same shape. Level 5 asks which
     of ai / ay / a_e this word uses; Level 6 asks whether c is saying /s/ or
     /k/ here. Both are: here is a written word, here are the boxes, which
     box is it. */
  function rSort(r) {
    /* `word` for the spelling and soft-letter games, where the thing being
       sorted is one word; `label` for true-or-not-true, where it is a whole
       sentence. Same game, and the sentence just needs room to wrap. */
    var txt = r.label != null ? r.label : word(r.word).text;
    var say = r.speak != null ? r.speak : txt;
    shell(
      '<div class="sorter">' +
        '<button class="sortword' + (r.label != null ? ' sortword--long' : '') + '" id="sw">' + esc(txt) + '</button>' +
        '<div class="boxes">' + r.boxes.map(function (b, i) {
          return '<button class="sbox" data-i="' + i + '">' +
            '<b>' + esc(b.as) + '</b>' +
            (b.note ? '<small>' + esc(b.note) + '</small>' : '') +
            '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    document.getElementById('sw').onclick = function () {
      if (r.label != null) A.say(say); else A.sayWord(say);
    };
    Array.prototype.forEach.call(document.querySelectorAll('.sbox'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        if (+b.dataset.i === r.correct) {
          Array.prototype.forEach.call(document.querySelectorAll('.sbox'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          if (r.label == null) A.sayWord(say);
          right(r.track);
          advance();
        } else {
          b.dataset.spent = '1';
          b.classList.add('is-wrong');
          setTimeout(function () { b.classList.remove('is-wrong'); b.dataset.spent = '0'; }, 750);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- put them in order ----
     Four pictures, jumbled, to be tapped in the order the article described.
     It cannot be done from the words on the page, only from having followed
     what happens to what. */
  function rOrder(r) {
    shell(
      '<div class="order">' +
        '<div class="oslots">' + r.order.map(function (_, i) {
          return '<div class="oslot" data-i="' + i + '"><b>' + (i + 1) + '</b></div>';
        }).join('') + '</div>' +
        '<div class="obank">' + shuffle(r.order.slice()).map(function (k) {
          return '<button class="ocard" data-k="' + k + '">' + picture(k, true) + '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    var next = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.ocard'), function (el) {
      el.onclick = function () {
        if (el.dataset.used === '1') return;
        if (el.dataset.k === r.order[next]) {
          el.dataset.used = '1';
          el.classList.add('used');
          var slot = document.querySelector('.oslot[data-i="' + next + '"]');
          slot.innerHTML = picture(el.dataset.k, true);
          slot.classList.add('filled');
          A.sayWord(word(el.dataset.k).text);
          if (S.settings.sfx) A.sfx('pop');
          next++;
          if (next === r.order.length) { right(r.track); advance(900); }
        } else {
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 650);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- clap the beats ----
     The answer is tapped as a number, but the point is the clapping, so the
     word splits apart on screen as she gets it right. */
  function rBeats(r) {
    var t = word(r.word).text;
    shell(
      '<div class="beats">' +
        '<button class="beatword" id="bw">' + esc(t) + '</button>' +
        '<div class="claps">' + [1, 2, 3].map(function (n) {
          return '<button class="clap" data-n="' + n + '">' +
            '<span class="clap-dots">' + new Array(n + 1).join('<i></i>') + '</span>' +
            '<b>' + n + '</b></button>';
        }).join('') + '</div>' +
      '</div>'
    );
    document.getElementById('bw').onclick = function () { A.sayWord(t); };
    Array.prototype.forEach.call(document.querySelectorAll('.clap'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        if (+b.dataset.n === r.n) {
          Array.prototype.forEach.call(document.querySelectorAll('.clap'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          if (S.settings.sfx) A.sfx('pop');
          A.sayWord(t);
          right(r.track);
          advance();
        } else {
          b.dataset.spent = '1';
          b.classList.add('is-wrong');
          setTimeout(function () { b.classList.remove('is-wrong'); b.dataset.spent = '0'; }, 750);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- two words make one ---- */
  function rJoin(r) {
    shell(
      '<div class="joiner">' +
        '<div class="joiner-pic">' + picture(r.word, true) + '</div>' +
        '<div class="jslots">' + r.parts.map(function (_, i) {
          return '<div class="jslot" data-i="' + i + '"></div>';
        }).join('<span class="jplus">+</span>') + '</div>' +
        '<div class="jbank">' + r.bank.map(function (w2) {
          return '<button class="wcard" data-w="' + esc(w2) + '">' + esc(w2) + '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    var next = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.jbank .wcard'), function (el) {
      el.onclick = function () {
        if (el.dataset.used === '1') return;
        if (el.dataset.w === r.parts[next]) {
          el.dataset.used = '1';
          el.classList.add('used');
          var slot = document.querySelector('.jslot[data-i="' + next + '"]');
          slot.textContent = r.parts[next];
          slot.classList.add('filled');
          A.sayWord(r.parts[next]);
          if (S.settings.sfx) A.sfx('pop');
          next++;
          if (next === r.parts.length) {
            var line = document.querySelector('.jslots');
            line.classList.add('joined');
            A.idle()
              .then(function () { return A.sayWord(word(r.word).text); })
              .then(function () { right(r.track); advance(900); });
          }
        } else {
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 650);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- meet an ending ---- */
  function rMeetEnding(r) {
    var e = C.ending(r.ending);
    shell(
      '<div class="card card--ending">' +
        '<div class="card-head card-head--one">' +
          '<button class="card-top" id="cardtop">' +
            '<span class="card-letter">-' + esc(e.ending) + '</span>' +
            '<span class="card-friend">' + esc(e.blurb) + '</span>' +
          '</button>' +
        '</div>' +
        (e.also ? '<p class="card-also">' + esc(e.also) + '</p>' : '') +
        '<div class="endrows">' + e.items.map(function (it, i) {
          return '<button class="endrow" data-i="' + i + '">' +
            '<span class="endrow-base">' + esc(it.base) + '</span>' +
            '<span class="endrow-arrow">&rarr;</span>' +
            '<span class="endrow-made">' + esc(it.base) +
              '<b>' + esc(it.made.slice(it.base.length) || '-' + e.ending) + '</b></span>' +
            '</button>';
        }).join('') + '</div>' +
        '<button class="nextbtn ready" id="cardnext">' + icon('play') + '</button>' +
      '</div>',
      { silent: true }
    );
    document.getElementById('cardtop').onclick = function () { A.sayWord(e.items[0].made); };
    Array.prototype.forEach.call(document.querySelectorAll('.endrow'), function (b) {
      b.onclick = function () {
        bump(b); b.classList.add('seen');
        var it = e.items[+b.dataset.i];
        A.sayWord(it.base).then(function () { return A.gap(gap()); })
          .then(function () { return A.sayWord(it.made); });
      };
    });
    document.getElementById('cardnext').onclick = function () {
      A.stop(); credit(r.track); advance(0);
    };
  }

  /* ---- add the ending ---- */
  function rAddEnding(r) {
    var tail = r.made.slice(r.base.length) || r.ending;
    shell(
      '<div class="adder">' +
        '<div class="adder-row">' +
          '<span class="adder-base" id="ab">' + esc(r.base) + '</span>' +
          '<span class="adder-plus">+</span>' +
          '<button class="adder-end" id="ae">' + esc(tail) + '</button>' +
        '</div>' +
        '<button class="pushbtn" id="push">push them together' +
          '<svg viewBox="0 0 60 24" aria-hidden="true"><path d="M4 12h44M40 5l9 7-9 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<div class="adder-made" id="am" hidden>' + esc(r.base) + '<b>' + esc(tail) + '</b></div>' +
      '</div>'
    );
    document.getElementById('ab').onclick = function () { A.sayWord(r.base); };
    document.getElementById('ae').onclick = function () { A.sayWord(r.made); };
    document.getElementById('push').onclick = function () {
      var p2 = document.getElementById('push');
      p2.disabled = true;
      document.querySelector('.adder-row').classList.add('squeeze');
      document.getElementById('am').hidden = false;
      A.sayWord(r.made).then(function () { right(r.track); advance(900); });
    };
  }

  /* ---- meet soft c / soft g ---- */
  function rMeetSoft(r) {
    var sf = C.softOf(r.soft);
    function row(title, words, cls) {
      return '<div class="softcol ' + cls + '"><h4>' + esc(title) + '</h4>' +
        words.map(function (k) {
          return '<button class="softw" data-k="' + k + '">' + esc(word(k).text) + '</button>';
        }).join('') + '</div>';
    }
    shell(
      '<div class="card card--soft">' +
        '<div class="card-head card-head--one">' +
          '<button class="card-top" id="cardtop">' +
            '<span class="card-letter">' + esc(sf.letter) + '</span>' +
            '<span class="card-ipa">' + esc(sf.soft) + ' &nbsp;or&nbsp; ' + esc(sf.hard) + '</span>' +
          '</button>' +
        '</div>' +
        '<p class="card-also">' + esc(sf.rule) + (sf.also ? ' ' + esc(sf.also) : '') + '</p>' +
        '<div class="softcols">' +
          row('says ' + sf.soft, sf.softWords, 'is-soft') +
          row('says ' + sf.hard, sf.hardWords, 'is-hard') +
        '</div>' +
        '<button class="nextbtn ready" id="cardnext">' + icon('play') + '</button>' +
      '</div>',
      { silent: true }
    );
    document.getElementById('cardtop').onclick = function () { A.sayPhoneme(sf.letter); };
    Array.prototype.forEach.call(document.querySelectorAll('.softw'), function (b) {
      b.onclick = function () { bump(b); b.classList.add('seen'); A.sayWord(word(b.dataset.k).text); };
    });
    document.getElementById('cardnext').onclick = function () {
      A.stop(); credit(r.track); advance(0);
    };
  }

  /* ---- dictation: hear it, write it ----
     No picture on screen. That is the whole difference between this and
     Build the Word, and it is the difference between matching and spelling. */
  function rSpell(r) {
    var t = word(r.word).text;
    shell(
      '<div class="speller">' +
        '<button class="spellear" id="se">' + icon('ear') + '<span>say it again</span></button>' +
        '<div class="slots">' + t.split('').map(function (_, i) {
          return '<div class="slot" data-i="' + i + '"></div>';
        }).join('') + '</div>' +
        '<div class="ltiles">' + r.tiles.map(function (c, i) {
          return '<button class="ltile" data-c="' + esc(c) + '" data-i="' + i + '">' + esc(c) + '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
    document.getElementById('se').onclick = function () { A.stop(); A.sayWord(t); };
    var next = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.ltile'), function (el) {
      el.onclick = function () {
        if (el.dataset.used === '1') return;
        if (el.dataset.c === t.charAt(next)) {
          var slot = document.querySelector('.slot[data-i="' + next + '"]');
          slot.textContent = el.dataset.c;
          slot.classList.add('filled');
          el.dataset.used = '1';
          el.classList.add('used');
          /* The NAME, not the sound. These tiles are letters, not phonemes —
             `ship` is four letters and three sounds — and spelling a word
             out loud is done in names. It is also why letter names are not
             taught before this point: during blending they compete. */
          A.sayLetterName(el.dataset.c);
          if (S.settings.sfx) A.sfx('pop');
          next++;
          if (next === t.length) {
            A.sayWord(t).then(function () { right(r.track); advance(800); });
          }
        } else {
          el.classList.add('is-wrong');
          setTimeout(function () { el.classList.remove('is-wrong'); }, 650);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- three-choice picker (pictures OR letters) ---- */
  function rPick(r) {
    var opts = r.options.map(function (o, i) {
      var body = o.kind === 'pic' ? picture(o.word)
        : o.kind === 'word' ? '<span class="glyph glyph--word">' + esc(word(o.word).text) + '</span>'
        /* a sight word has no picture and is not in the word list — that is
           what makes it a sight word */
        : o.kind === 'text' ? '<span class="glyph glyph--word' + (o.small ? ' glyph--phrase' : '') + '">' + esc(o.text) + '</span>'
        : '<span class="glyph">' + esc(glyph(o.letter)) + '</span>';
      return '<button class="opt' + (o.kind === 'pic' ? ' opt--pic' : '') + '" data-i="' + i + '">' + body + '</button>';
    }).join('');
    var anchor = r.anchor
      ? '<div class="anchor">' + (PHOTOS[r.anchor]
          ? '<span class="pic pic--photo" style="background-image:url(' + PHOTOS[r.anchor] + ')"></span>'
          : icon(word(r.anchor).icon)) + '</div>'
      : (r.bigword ? '<div class="bigword">' + esc(r.bigword) + '</div>' : '');
    shell(anchor + '<div class="opts">' + opts + '</div>');

    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        var o = r.options[+b.dataset.i];
        if (o.correct) {
          Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          /* name the thing she just chose, then praise it: "apple" — "well
             done", in that order, because the word is the thing being taught */
          if (o.kind === 'pic' || o.kind === 'word') A.sayWord(word(o.word).text);
          /* a definition or a chapter title is a phrase, not a word: it has
             no clip of its own and is read out as a line */
          else if (o.kind === 'text') { if (o.small) A.say(o.text); else A.sayWord(o.text); }
          right(r.track);
          advance();
        } else {
          b.dataset.spent = '1';
          b.classList.add('is-wrong');
          setTimeout(function () { b.classList.remove('is-wrong'); b.dataset.spent = '0'; }, 750);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- the letter card: big Aa, how to say it, four keyword pictures ---- */
  /* Which part of the keyword to print in red.

     On a letter card it is the first letter, the way the printed card does
     it. On a TEAM card it has to be the team, wherever the team happens to
     sit: the `ai` card showed `rain` with the `r` in red, which points at the
     one part of the word the card is not about. `fish` on the `sh` card had
     the same problem from the other end. So a team card looks for its own
     spelling inside the word — and for a magic-e spelling like `a_e` it marks
     both halves, because both halves are the spelling. */
  function markSound(text, L, key) {
    if (!L.team) return '<b>' + esc(text.charAt(0)) + '</b>' + esc(text.slice(1));
    var ways = L.spells ? L.spells.map(function (sp) { return sp.as; }) : [key];
    for (var i = 0; i < ways.length; i++) {
      var as = ways[i];
      if (as.indexOf('_') >= 0) {
        var v = as.charAt(0), at = text.lastIndexOf(v);
        if (at > 0 && at < text.length - 1 && text.charAt(text.length - 1) === 'e') {
          return esc(text.slice(0, at)) + '<b>' + esc(v) + '</b>' +
            esc(text.slice(at + 1, text.length - 1)) + '<b>e</b>';
        }
      } else {
        var at2 = text.indexOf(as);
        if (at2 >= 0) {
          return esc(text.slice(0, at2)) + '<b>' + esc(as) + '</b>' + esc(text.slice(at2 + as.length));
        }
      }
    }
    return esc(text);
  }

  function rMeet(r) {
    var L = C.sound(r.letter);
    var pics = L.words.map(function (k, i) {
      var t = word(k).text;
      return '<button class="kw" data-k="' + k + '" data-i="' + i + '">' +
        '<span class="kw-pic">' + (PHOTOS[k]
          ? '<span class="pic pic--photo" style="background-image:url(' + PHOTOS[k] + ')"></span>'
          : icon(word(k).icon)) + '</span>' +
        '<span class="kw-text">' + markSound(t, L, r.letter) + '</span>' +
        '</button>';
    }).join('');

    shell(
      '<div class="card">' +
        '<div class="card-head">' +
          '<button class="card-top" id="cardtop">' +
            '<span class="card-letter">' + esc(L.team ? r.letter : r.letter.toUpperCase() + r.letter) + '</span>' +
            '<span class="card-ipa">' + esc(L.ipa) + '</span>' +
            (L.friend ? '<span class="card-friend">' + esc(L.friend) + '</span>' : '') +
          '</button>' +
          '<button class="card-mouth' + (L.mouth2 ? ' card-mouth--glide' : '') +
            '" id="cardmouth" aria-label="How to say it">' +
            /* A diphthong is a movement between two mouth positions, so the
               card shows both and an arrow. One static shape would be a
               picture of neither end of it. */
            window.mouthSvg(L.mouth) +
            (L.mouth2 ? '<span class="mouth-arrow">&rarr;</span>' + window.mouthSvg(L.mouth2) : '') +
            '<span class="card-tip">' + esc(L.tip) + '</span>' +
          '</button>' +
        '</div>' +
        (L.spells && L.spells.length > 1
          ? '<div class="spells">' + L.spells.map(function (sp) {
              return '<span class="spell"><b>' + esc(sp.as) + '</b><small>' + esc(sp.where) + '</small></span>';
            }).join('') + '</div>'
          : '') +
        (L.also ? '<p class="card-also">' + esc(L.also) + '</p>' : '') +
        '<div class="kws">' + pics + '</div>' +
        '<button class="nextbtn" id="cardnext">' + icon('play') + '</button>' +
      '</div>',
      { silent: true }
    );

    /* What the card says when it opens: the SOUND, once, unhurried. It used to
       open with the letter's name and then the sound twice — three things
       before the first word, and for f, l, m, n, r, s, v, z the name contains
       the sound, so leading with it teaches "ef" where the card says /f/. */
    function introduce() { return A.sayPhoneme(r.letter, true); }

    /* Tapping the big letter is the deliberate way to hear its name, which is
       still worth knowing — it is just not what the card opens with. */
    function sayLetter() {
      if (L.team) return A.sayPhoneme(r.letter);
      return A.sayLetterName(r.letter)
        .then(function () { return A.gap(gap()); })
        .then(function () { return A.sayPhoneme(r.letter); });
    }
    /* The sound, a beat, then the word: /m/ … monkey. The beat is what lets a
       four-year-old hear the sound as its own thing rather than as the first
       scrap of the word. */
    function sayKeyword(k) {
      return A.sayPhoneme(r.letter)
        .then(function () { return A.gap(gap()); })
        .then(function () { return A.sayWord(word(k).text); });
    }

    var top = document.getElementById('cardtop');
    top.onclick = function () { bump(top); sayLetter(); };
    var mouthBtn = document.getElementById('cardmouth');
    mouthBtn.onclick = function () { bump(mouthBtn); A.sayPhoneme(r.letter); };

    var heard = {};
    Array.prototype.forEach.call(document.querySelectorAll('.kw'), function (b) {
      b.onclick = function () {
        bump(b);
        b.classList.add('seen');
        heard[b.dataset.i] = true;
        sayKeyword(b.dataset.k);
        if (Object.keys(heard).length === L.words.length) {
          document.getElementById('cardnext').classList.add('ready');
        }
      };
    });

    /* The card introduces itself: the letter, then its four words. That runs
       for the best part of ten seconds, so every step checks the ticket first
       — tap Next half way through and the rest is dropped instead of following
       the child into the next question. */
    var tok = A.epoch();
    setTimeout(function () {
      if (A.epoch() !== tok) return;
      introduce().then(function () {
        var seq = A.gap(gap());
        L.words.forEach(function (k, i) {
          seq = seq.then(function () {
            if (A.epoch() !== tok) return;
            var el = document.querySelector('.kw[data-i="' + i + '"]');
            if (el) { bump(el); el.classList.add('seen'); }
            return sayKeyword(k);
          }).then(function () {
            if (A.epoch() !== tok) return;
            return A.gap(gap());
          });
        });
        return seq;
      }).then(function () {
        if (A.epoch() !== tok) return;
        var n = document.getElementById('cardnext');
        if (n) n.classList.add('ready');
      });
    }, 260);

    document.getElementById('cardnext').onclick = function () {
      A.stop();
      credit(r.track);
      advance(0);
    };
  }

  function bump(el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

  /* ---- hidden letter ---- */
  function rMissing(r) {
    var t = word(r.word).text;
    var letters = t.split('').map(function (ch, i) {
      if (i === r.at) return '<span class="slot" id="slot">?</span>';
      return '<span class="ch">' + esc(ch) + '</span>';
    }).join('');

    shell(
      '<div class="missing">' +
        '<div class="missing-pic">' + (PHOTOS[r.word]
          ? '<span class="pic pic--photo" style="background-image:url(' + PHOTOS[r.word] + ')"></span>'
          : icon(word(r.word).icon)) + '</div>' +
        '<div class="missing-word">' + letters + '</div>' +
        '<div class="opts opts-row">' + r.options.map(function (l, i) {
          return '<button class="opt opt--letter" data-l="' + l + '"><span class="glyph">' + esc(glyph(l)) + '</span></button>';
        }).join('') + '</div>' +
      '</div>'
    );

    Array.prototype.forEach.call(document.querySelectorAll('.opt--letter'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        if (b.dataset.l === r.letter) {
          Array.prototype.forEach.call(document.querySelectorAll('.opt--letter'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          var slot = document.getElementById('slot');
          slot.textContent = r.letter;
          slot.classList.add('filled');
          A.sayPhoneme(r.letter);
          A.sayWord(t);
          right(r.track);
          advance();
        } else {
          b.dataset.spent = '1';
          b.classList.add('is-wrong');
          setTimeout(function () { b.classList.remove('is-wrong'); b.dataset.spent = '0'; }, 750);
          wrong(r.track);
        }
      };
    });
  }

  /* ---- memory pairs ---- */
  function rMemory(r) {
    var deck = shuffle(r.words.concat(r.words));
    shell('<div class="memory">' + deck.map(function (k, i) {
      return '<button class="mcard" data-k="' + k + '" data-i="' + i + '">' +
        '<span class="mback">' + icon('starOn') + '</span>' +
        '<span class="mface">' + picture(k) + '</span>' +
        '</button>';
    }).join('') + '</div>');

    var open = [], found = 0, busy = false;
    Array.prototype.forEach.call(document.querySelectorAll('.mcard'), function (b) {
      b.onclick = function () {
        if (busy || b.classList.contains('up') || b.classList.contains('matched')) return;
        b.classList.add('up');
        A.sayWord(word(b.dataset.k).text);
        open.push(b);
        if (open.length < 2) return;
        busy = true;
        var a = open[0], c = open[1];
        if (a.dataset.k === c.dataset.k) {
          setTimeout(function () {
            a.classList.add('matched'); c.classList.add('matched');
            if (S.settings.sfx) A.sfx('pop');
            found++; open = []; busy = false;
            if (found === r.words.length) { right(r.track); advance(900); }
          }, 450);
        } else {
          setTimeout(function () {
            a.classList.remove('up'); c.classList.remove('up');
            open = []; busy = false;
          }, 900);
        }
      };
    });
  }

  /* ---- end of lesson ---- */
  function finishLesson() {
    if (!run) return;
    A.stop();
    var l = run.lesson;
    var acc = run.tries ? run.correct / run.tries : 0;
    var n = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;

    S.stars[l.id] = Math.max(starsFor(l.id), n);
    var prev = S.best[l.id];
    if (!prev || run.correct / Math.max(1, run.tries) > prev.correct / Math.max(1, prev.total)) {
      S.best[l.id] = { correct: run.correct, total: run.tries };
    }
    S.runs.push({ d: Date.now(), lesson: l.id, correct: run.correct, tries: run.tries, stars: n,
      mins: Math.round((Date.now() - run.t0) / 6000) / 10 });
    if (S.runs.length > 80) S.runs = S.runs.slice(-80);
    S.played[dayKey()] = (S.played[dayKey()] || 0) + 1;
    save();

    if (S.settings.sfx) A.sfx('reward');

    var overCap = sessionStart && (Date.now() - sessionStart) / 60000 > S.settings.cap;
    var ls = C.levelLessons(l.level);
    var idx = ls.map(function (x) { return x.id; }).indexOf(l.id);
    /* The last stop of a level used to offer nothing, which made the end of
       a level feel like the end of the app — she finished Z and the only way
       on was through the map. Next now steps into the level above. */
    var next = l.game ? null
      : (ls[idx + 1] || C.LESSONS.filter(function (x) { return x.level > l.level && !done(x.id); })[0]);

    nav(
      '<div class="screen screen-done">' +
        '<div class="donecard">' +
          '<div class="donestars">' + stars(n) + '</div>' +
          '<h1>' + esc(l.shortName || l.name) + '</h1>' +
          '<p class="donescore"><b>' + run.correct + '</b> right out of <b>' + run.tries + '</b></p>' +
          '<p class="donetotal">' + icon('starOn', 'dt-glyph') + ' ' + totalStars() + ' stars altogether</p>' +
          '<div class="donebtns">' +
            '<button class="ghostbtn" id="dmap">Map</button>' +
            (next && !overCap ? '<button class="bigbtn bigbtn--sm" id="dnext">' + icon('play', 'bigbtn-glyph') + '<span>Next</span></button>' : '') +
            (l.game && !overCap ? '<button class="bigbtn bigbtn--sm" id="dagain">' + icon('play', 'bigbtn-glyph') + '<span>Again</span></button>' : '') +
          '</div>' +
          (overCap ? '<p class="donecap">That was a good long turn. See you tomorrow!</p>' : '') +
        '</div>' +
      '</div>'
    );
    /* After nav, which silences anything still playing. Written out in full
       rather than hoisted into a variable: tools/speech-texts.mjs finds what to
       record by reading the literals handed to A.say(), and a variable here
       means these three lines quietly lose their clips. */
    A.say(n === 3 ? 'Perfect! Three stars!' : n === 2 ? 'Well done! Two stars!' : 'Good try! One star!');
    document.getElementById('dmap').onclick = function () { if (overCap) sessionStart = 0; screenMap(); };
    var dn = document.getElementById('dnext');
    if (dn) dn.onclick = function () { startLesson(next); };
    var da = document.getElementById('dagain');
    if (da) da.onclick = function () {
      if (l.free) startFreeGame(FREEGAMES.filter(function (g) { return 'free-' + g.id === l.id; })[0]);
      else startGame();
    };
    run = null;
  }

  /* ==================================================================
     SCREEN · GROWN-UPS
     ================================================================== */
  var tab = 'plan';

  function screenParent() {
    A.stop();
    nav(
      '<div class="screen screen-parent">' +
        '<div class="phead">' +
          '<button class="iconbtn" id="pback" aria-label="Back">' + icon('back') + '</button>' +
          '<h2>Grown-ups</h2><span class="iconbtn iconbtn--ghost"></span>' +
        '</div>' +
        '<nav class="tabs">' + ['plan', 'progress', 'pictures', 'voice', 'sounds', 'settings'].map(function (t) {
          return '<button class="tab ' + (tab === t ? 'is-on' : '') + '" data-t="' + t + '">' + t + '</button>';
        }).join('') + '</nav>' +
        '<div id="ptab"></div>' +
      '</div>'
    );
    document.getElementById('pback').onclick = screenWelcome;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.onclick = function () { tab = b.dataset.t; screenParent(); };
    });
    ({ plan: tabPlan, progress: tabProgress, pictures: tabPictures, voice: tabVoice,
       sounds: tabSounds, settings: tabSettings })[tab]();
  }

  /* ------------------------------------------------------------------
     PLAN — the answer to "which one do I open, and when do I move her on".

     Everything on this page is already in content.js; this is just where it
     is shown to the person who has to decide. Nothing here changes what the
     app does — the app never locks anything — it changes what the grown-up
     knows while deciding.
     ------------------------------------------------------------------ */
  function tabPlan() {
    var a = ageYears();
    var here = levelNow();
    var ageLv = levelForAge();
    var stop = todaysStop();

    var head = a == null
      ? '<div class="panel"><h3>How old is she?</h3>' +
          '<p class="hint">Put her birth month in <b>Settings</b> and this page says which level to open, and when to move on. Without it the app uses what she has already finished, which works &mdash; it just cannot tell you whether she is ahead or behind.</p>' +
        '</div>'
      : '<div class="panel"><h3>Right now</h3>' +
          '<p class="stat"><b>' + esc(ageText()) + '</b> old</p>' +
          '<p class="hint">Her age points at <b>Level ' + ageLv + ' &middot; ' + esc(levelOf(ageLv).name) + '</b>. ' +
            'What she has finished puts her on <b>Level ' + here + ' &middot; ' + esc(levelOf(here).name) + '</b>.' +
            (here < ageLv
              ? (C.LESSONS.some(function (x) { return done(x.id); })
                ? ' She is behind the usual pace, which is very common and is not a problem: the order matters, the timing does not. Keep going from where she is &mdash; skipping ahead to catch up is what actually causes the trouble.'
                : ' Nothing has been done on this device yet, so the app has started at the alphabet rather than at her age. It cannot hear her read, so it has no way to know what she already knows; one turn on Level 2 will tell you, and it takes four minutes. If she clears it easily, open Level 3 from the map and carry on from there.')
              : here > ageLv
                ? ' She is ahead of the usual pace. Let her carry on; the only thing worth watching is whether she is still reading the words or has started guessing them from the pictures.'
                : ' Those agree, which is the ordinary case.') +
          '</p>' +
          (stop ? '<p class="hint">Today the app will open <b>' + esc(stop.shortName || stop.name) + '</b>, and about <b>' +
            levelOf(stop.level).minutes + ' minutes</b> is a full turn at that level.</p>' : '') +
        '</div>';

    var rows = C.LEVELS.map(function (lv) {
      var ls = C.levelLessons(lv.id);
      var d = ls.filter(function (l) { return done(l.id); }).length;
      var state = d === ls.length ? 'done' : (lv.id === here ? 'now' : (lv.id < here ? 'part' : 'later'));
      return '<div class="plevel is-' + state + '">' +
        '<div class="plevel-head">' +
          '<span class="plevel-n tint-' + lv.tint + '">' + lv.id + '</span>' +
          '<span class="plevel-t"><b>' + esc(lv.name) + '</b>' +
            '<small>' + esc(lv.age) + ' years &middot; ' + ls.length + ' stops &middot; ' + lv.minutes + ' min a go</small></span>' +
          '<span class="plevel-tag">' +
            (state === 'now' ? 'open this' : state === 'done' ? 'finished' :
             state === 'part' ? d + '/' + ls.length : 'later') + '</span>' +
        '</div>' +
        '<p class="plevel-blurb">' + esc(lv.blurb) + '</p>' +
        '<dl class="plevel-when">' +
          '<dt>Open it when</dt><dd>' + esc(lv.opens) + '</dd>' +
          '<dt>Move on when</dt><dd>' + esc(lv.ready) + '</dd>' +
        '</dl>' +
        '</div>';
    }).join('');

    document.getElementById('ptab').innerHTML =
      head +
      '<div class="panel"><h3>The seven levels, in order</h3>' +
        '<p class="hint">The order is fixed because each level needs the one before it. The <b>ages are what to expect, not what to enforce</b> &mdash; a five-year-old who is reading <i>cat</i> belongs in Level 3 whatever the table says, and a six-year-old still learning letters belongs in Level 2. Nothing in the app is locked: any stop on any level is one tap away, always.</p>' +
        '<div class="plevels">' + rows + '</div>' +
      '</div>' +
      '<div class="panel"><h3>How to run a week</h3>' +
        '<ul class="plist">' +
          '<li><b>One turn a day beats three at the weekend.</b> Five to fifteen minutes depending on the level, and stop while she still wants more.</li>' +
          '<li><b>Open the app at Today.</b> It already knows the next stop on the level she is on; the map is for when you want something else.</li>' +
          '<li><b>Two days a week on Games instead.</b> Same skills, no sense of a queue, and it mixes old work back in so it does not fade.</li>' +
          '<li><b>Read to her every day as well.</b> Phonics is how a word is got off the page; it is not what makes a child want to. Those are two different jobs and the app only does one of them.</li>' +
          '<li><b>When she is stuck, go back a level for a day.</b> An easy win the day after a hard session is worth more than another go at the hard one.</li>' +
        '</ul>' +
      '</div>' +
      '<div class="panel"><h3>What Level 7 is, and why it is different</h3>' +
        '<p class="hint">Everything up to Level 7 is reading <b>practice</b>: the words on the page are there so they can be decoded, and what they say is secondary. At seven that is the wrong way round. Level 7 alternates four different jobs, and they are four different skills:</p>' +
        '<ul class="plist">' +
          '<li><b>Four decodable books.</b> The last of the controlled word lists. Every word can still be sounded out.</li>' +
          '<li><b>Five articles</b> &mdash; how a seed becomes a tree, where rain comes from, what ants do all day, why the moon changes, animals that come out at night. Real non-fiction, read for the answer. The words are ordinary English now, not a controlled list: at seven an unfamiliar word is something to reach for, and every word on the page can be tapped. After each one she is asked what two of the words mean, to put the stages back in order, whether four statements are true, and the ordinary questions.</li>' +
          '<li><b>A story in three chapters.</b> The first thing in the app too long to hold on one screen &mdash; chapter one has to be remembered by the time she reaches chapter three, and <i>The Whole Story</i> at the end asks what no single chapter answers.</li>' +
          '<li><b>Dictation.</b> Hearing a word and writing it down is the other half of phonics and the half a reading app usually leaves out. No picture on the screen, which is the whole difference between this and building a word.</li>' +
        '</ul>' +
        '<p class="hint">Do them in the order they appear on the map. They alternate on purpose &mdash; a week of books without spelling, or of spelling without meaning, shows.</p>' +
      '</div>' +
      '<div class="panel"><h3>What this app does not do</h3>' +
        '<p class="hint">It does not listen to her. It cannot hear that she said <i>tink</i> for <i>think</i>, so the sounds she has trouble making are yours to catch &mdash; sit beside her for the letter cards and the books, and the mouth pictures on each card are there for you to copy together.</p>' +
        '<p class="hint">It does not teach handwriting. Level 7 spells with letter tiles, which is the right first step, but a pencil is a different skill and belongs on paper.</p>' +
        '<p class="hint">It stops where phonics stops. After Level 7 what she needs is books, and the amount of them, not another app.</p>' +
      '</div>';
  }

  function tabProgress() {
    var tr = C.trackables();
    var letters = tr.filter(function (t) { return t.kind === 'letter'; });
    var teams = tr.filter(function (t) { return t.kind === 'team' || t.kind === 'vowel'; });
    var themes = tr.filter(function (t) { return t.kind === 'theme'; });

    function cells(list) {
      return list.map(function (t) {
        var b = SRS.get(t.key), a = SRS.acc(t.key);
        return '<div class="cell b' + b.box + '" title="' + esc(t.label) + ': box ' + b.box + ', ' +
          (a == null ? 'not seen' : Math.round(a * 100) + '% of ' + b.seen) + '"><span>' + esc(t.label) + '</span></div>';
      }).join('');
    }

    var weak = tr.filter(function (t) { return SRS.get(t.key).seen >= 3; })
      .sort(function (a, b) { return SRS.acc(a.key) - SRS.acc(b.key); }).slice(0, 5);

    var recent = S.runs.slice(-12).reverse();
    var lettersDone = C.LETTERS.filter(function (l) { return done('a-' + l); }).length;

    document.getElementById('ptab').innerHTML =
      '<div class="panel"><div class="kpis">' +
        '<div class="kpi"><small>Stars</small><b>' + totalStars() + '</b></div>' +
        '<div class="kpi"><small>Letters done</small><b>' + lettersDone + ' <i>/ 26</i></b></div>' +
        '<div class="kpi"><small>Turns played</small><b>' + S.runs.length + '</b></div>' +
      '</div></div>' +

      '<div class="panel"><h3>Mastery map</h3>' +
        '<p class="hint">Leitner box 0&ndash;5: a box goes up on a right answer and back to 1 on a wrong one. Green means it has been right several times across several days.</p>' +
        '<h4>Letter sounds</h4><div class="grid">' + cells(letters) + '</div>' +
        '<h4>Two-letter teams and vowel teams</h4><div class="grid grid--wide">' + cells(teams) + '</div>' +
        '<h4>Word themes</h4><div class="grid grid--wide">' + cells(themes) + '</div>' +
        '<div class="legend">' + [0, 1, 2, 3, 4, 5].map(function (n) {
          return '<span class="lg"><i class="cell b' + n + '"></i>' + (n === 0 ? 'new' : n) + '</span>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="panel"><h3>Practise these away from the screen</h3>' +
        (weak.length
          ? '<ol class="weak">' + weak.map(function (t) {
              var a = Math.round(SRS.acc(t.key) * 100);
              /* What to actually DO about it, off the screen. A letter is
                 found in the world; a team is heard in a handful of words
                 said one after another, which is how you hear that they
                 share a sound; a theme is named. "Name these things when
                 you see them" was being printed for all three, and for a
                 vowel team it means nothing. */
              var snd = t.kind !== 'theme' && C.sound(t.key.slice(2));
              var hint = t.kind === 'letter' && C.ALPHABET[t.label]
                ? 'Point at ' + C.ALPHABET[t.label].words.map(function (k) { return C.WORDS[k].text; }).join(', ') + ' in real life'
                : snd && snd.words && snd.words.length
                  ? 'Say these one after another and listen for the same sound: ' +
                    snd.words.map(function (k) { return C.WORDS[k].text; }).join(', ')
                  : 'Name these things when you see them';
              return '<li><b>' + esc(t.label) + '</b><span class="acc">' + a + '%</span><em>' + esc(hint) + '</em></li>';
            }).join('') + '</ol>'
          : '<p class="hint">Fills up once an item has been seen three times.</p>') +
      '</div>' +

      '<div class="panel"><h3>Recent turns</h3>' +
        (recent.length
          ? '<table class="tbl"><thead><tr><th>When</th><th>Stop</th><th class="num">Mins</th><th class="num">Score</th><th class="num">Stars</th></tr></thead><tbody>' +
            recent.map(function (r) {
              var free = FREEGAMES.filter(function (g) { return 'free-' + g.id === r.lesson; })[0];
              var l = C.lesson(r.lesson) || free ||
                (r.lesson === 'game' ? { shortName: 'Mix it up' } : null);
              return '<tr><td>' + new Date(r.d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</td>' +
                '<td>' + esc(l ? (l.shortName || l.name) : r.lesson) + '</td>' +
                '<td class="num">' + (r.mins || 0) + '</td>' +
                '<td class="num">' + r.correct + '/' + r.tries + '</td>' +
                '<td class="num">' + r.stars + '</td></tr>';
            }).join('') + '</tbody></table>'
          : '<p class="hint">No turns yet.</p>') +
      '</div>';
  }

  function tabPictures() {
    /* Only the words that HAVE a drawing. Since Level 5 the word list also
       holds words with no picture — `day`, `out`, `her`, the commonest words
       in English and none of them drawable — and listing those here put
       fifty empty grey squares on the one page whose entire subject is
       replacing a drawing with a photograph. */
    var keys = Object.keys(C.WORDS).filter(function (k) {
      return C.WORDS[k].icon && !C.WORDS[k].noPic;
    }).sort();
    document.getElementById('ptab').innerHTML =
      '<div class="panel">' +
        '<h3>Replace a drawing with a real photo</h3>' +
        '<p class="hint">Every picture here is a drawing, and some are easier to guess than others. Tap a row to put a real photo in its place &mdash; a photo of the actual cup in your kitchen beats any drawing, and she will recognise it instantly. Photos stay on this device and are never uploaded.</p>' +
        '<p class="stat"><b>' + Object.keys(PHOTOS).length + '</b> of ' + keys.length + ' replaced</p>' +
      '</div>' +
      '<div class="panel"><div class="piclist">' +
        keys.map(function (k) {
          var wd = C.WORDS[k];
          return '<div class="picrow" data-k="' + k + '">' +
            '<span class="picthumb' + (PHOTOS[k] ? ' has' : '') + '"' +
              (PHOTOS[k] ? ' style="background-image:url(' + PHOTOS[k] + ')"' : '') + '>' +
              (PHOTOS[k] ? '' : icon(wd.icon)) + '</span>' +
            '<span class="piclabel">' + esc(wd.text) + (wd.sub ? '<em>not the book&rsquo;s word</em>' : '') + '</span>' +
            '<label class="vbtn" for="pf-' + k + '">' + icon('camera') + '</label>' +
            '<input type="file" id="pf-' + k + '" accept="image/*" hidden>' +
            (PHOTOS[k] ? '<button class="vbtn picdel">&times;</button>' : '') +
            '</div>';
        }).join('') +
      '</div></div>';

    Array.prototype.forEach.call(document.querySelectorAll('.picrow'), function (row) {
      var k = row.dataset.k;
      row.querySelector('input[type=file]').onchange = function () {
        var f = this.files && this.files[0];
        if (!f) return;
        squarePhoto(f)
          .then(function (b) { return A.putBlob('pic:' + k, b); })
          .then(function () { return A.blobURL('pic:' + k); })
          .then(function (u) { if (u) PHOTOS[k] = u; toast('Saved'); screenParent(); })
          .catch(function () { toast('Could not read that image'); });
      };
      var d = row.querySelector('.picdel');
      if (d) d.onclick = function () {
        A.delBlob('pic:' + k).then(function () { delete PHOTOS[k]; screenParent(); });
      };
    });
  }

  function tabVoice() {
    var can = A.canRecord();
    /* the five consonant teams and the thirteen vowel teams have clips of
       their own, so they belong in this list next to the letters */
    var keys = C.LETTERS.concat(Object.keys(C.TEAMS)).concat(C.VOWELKEYS);

    function row(key, label, sub) {
      var has = A.hasRecording(key);
      return '<div class="vrow ' + (has ? 'has' : '') + '" data-key="' + key + '">' +
        '<span class="vlabel">' + esc(label) + '<em>' + esc(sub) + '</em></span>' +
        '<button class="vbtn vplay" aria-label="Play">' + icon('play') + '</button>' +
        '<button class="vbtn vrec" aria-label="Record">' + icon('mic') + '</button>' +
        (has ? '<button class="vbtn vdel" aria-label="Delete">&times;</button>' : '') +
        '</div>';
    }

    document.getElementById('ptab').innerHTML =
      '<div class="panel">' +
        '<h3>Do I need to record anything?</h3>' +
        '<p class="hint"><b>No.</b> Every sound in the app ships as a clip. The 26 single letters are <b>recordings of a reading teacher</b> saying each sound on its own &mdash; not a word with the sound cut out of it, and not a synthesiser. The consonant teams (<b>sh ch th ng</b>) and the thirteen <b>vowel teams</b> have no recording, because the recorded set is single letters; each of those is cut out of a word by a British neural voice and measured before it ships. Each row says which route it took.</p>' +
        '<p class="hint">Tap <b>&#9654;</b> on any row to hear it. Recording over one in your own voice is optional &mdash; worth doing only for a sound she keeps mishearing.</p>' +
        '<p class="hint">The words, the sentences and the stories are the same voice: every one of them ships with the app as a recording, so nothing depends on which voices this device happens to have. Only a line with her name in it is spoken by the device.</p>' +
        '<p class="stat"><b>' + A.recordingCount() + '</b> clips recorded' + (can ? '' : ' &middot; <span class="warn">this browser will not give the page a microphone</span>') + '</p>' +
        '<label class="field"><span>Voice</span><select id="voicepick">' +
          '<option value="">Automatic (British English preferred)</option>' +
          A.voices().map(function (v) {
            return '<option value="' + esc(v.name) + '"' + (S.settings.voice === v.name ? ' selected' : '') + '>' + esc(v.name) + ' &mdash; ' + esc(v.lang) + '</option>';
          }).join('') + '</select></label>' +
      '</div>' +
      '<div class="panel"><h3>Letter sounds <small>' +
        keys.filter(function (l) { return A.hasRecording('p:' + l); }).length + '/' + keys.length +
        ' replaced by your voice &mdash; optional</small></h3>' +
        '<div class="vlist">' + keys.map(function (l) {
          var clip = (window.LETTER_CLIPS || {})[l];
          var src = !clip ? 'device voice'
            : clip.rec ? 'recorded &mdash; the sound on its own'
            : clip.from.charAt(0) === '/' ? 'synthesised from the symbol'
            : 'synthesised from the word ' + clip.from;
          return row('p:' + l, glyph(l) + '  ' + C.sound(l).ipa, src);
        }).join('') + '</div>' +
      '</div>';

    document.getElementById('voicepick').onchange = function () {
      S.settings.voice = this.value; save();
      if (this.value) A.setVoice(this.value);
      A.unlock(); A.say('This is how I will sound.');
    };

    var recording = null;
    Array.prototype.forEach.call(document.querySelectorAll('.vrow'), function (rw) {
      var key = rw.dataset.key;
      rw.querySelector('.vplay').onclick = function () { A.unlock(); A.sayPhoneme(key.slice(2)); };
      rw.querySelector('.vrec').onclick = function () {
        A.unlock();
        if (!can) { toast('This browser will not let the page use the microphone'); return; }
        if (recording === key) {
          A.stopRecording(key).then(function () { toast('Saved'); screenParent(); })
            .catch(function () { toast('Nothing recorded'); recording = null; rw.classList.remove('recording'); });
          recording = null; return;
        }
        A.startRecording().then(function () {
          recording = key; rw.classList.add('recording');
          toast('Recording — tap the microphone again to stop');
        }).catch(function () { toast('Microphone blocked'); });
      };
      var d = rw.querySelector('.vdel');
      if (d) d.onclick = function () { A.deleteRecording(key).then(screenParent); };
    });
  }

  /* The 44 sounds — a reference for the grown-up, not a lesson. It exists
     because the obvious question after a few weeks of letter cards is "is
     that all of them?", and the answer is no: English has about 44 sounds
     and 26 letters to write them with, and 31 cards cover 27 of the 44.
     Being able to see which 17 are missing is the point of the page. */
  function tabSounds() {
    var groups = C.PHONEME_GROUPS;
    var all = groups.reduce(function (n, g) { return n + C.PHONEMES[g].length; }, 0);
    var taught = groups.reduce(function (n, g) {
      return n + C.PHONEMES[g].filter(function (x) { return !!x.key; }).length;
    }, 0);

    function list(group) {
      return '<div class="slist">' + C.PHONEMES[group].map(function (x) {
        var sub = 'as in <b>' + esc(x.word) + '</b>' + (x.note ? ' &middot; ' + esc(x.note) : '');
        return '<div class="srow ' + (x.key ? '' : 'off') + '"' + (x.key ? ' data-k="' + x.key + '"' : '') + '>' +
          '<span class="sipa">' + esc(x.ipa) + '</span>' +
          '<span class="slabel">' + esc(x.as) + '<em>' + sub + '</em></span>' +
          (x.key ? '<button class="vbtn vplay" aria-label="Play ' + esc(x.ipa) + '">' + icon('play') + '</button>'
                 : '<span class="sgap"></span>') +
          '</div>';
      }).join('') + '</div>';
    }

    document.getElementById('ptab').innerHTML =
      '<div class="panel"><h3>Why 44 sounds and only 26 letters</h3>' +
        '<p class="hint">A phonics sound is a <b>phoneme</b> &mdash; the smallest unit of sound in spoken English. English has about <b>44</b> of them and <b>26</b> letters to spell them with.</p>' +
        '<p class="hint">That mismatch is why reading English is harder than reading Hindi or Spanish, where a letter almost always makes one sound. The letter <b>a</b> on its own is four different sounds in <i>cat</i>, <i>cake</i>, <i>car</i> and <i>was</i>. Knowing which sound goes with which letters is the whole of phonics.</p>' +
        '<p class="hint">Children learn single-letter consonants and short vowels first (Level 2), then the two-letter teams <b>sh ch th ng</b> (Level 3), then the vowel teams <b>ai ee oa igh oo ou oi ar or er air ear</b> (Level 5). All three steps are in here.</p>' +
        '<p class="stat"><b>' + taught + '</b> of the ' + all + ' have a sound in this app</p>' +
      '</div>' +
      groups.map(function (g) {
        var n = C.PHONEMES[g].filter(function (x) { return !!x.key; }).length;
        return '<div class="panel"><h3>' + esc(g.charAt(0).toUpperCase() + g.slice(1)) +
          ' sounds <small>' + n + '/' + C.PHONEMES[g].length + ' taught here</small></h3>' +
          list(g) + '</div>';
      }).join('') +
      '<div class="panel"><h3>The four that are greyed out</h3>' +
        '<p class="hint">Real English, deliberately left out. <b>/ð/</b> (<i>this</i>) shares its letters with <b>/θ/</b> (<i>thin</i>) and is learned from the word, not from a rule. <b>/&#690;/</b> (<i>treasure</i>) has no spelling of its own and appears in a handful of words. <b>/&#650;&#601;/</b> (<i>tour</i>) has merged with <b>/&#596;&#720;/</b> for most speakers. <b>/&#601;/</b>, the schwa, is the commonest sound in English and is what every vowel collapses to when it is unstressed &mdash; it is a consequence of rhythm, not a spelling to learn. Tapping one does nothing; there is no clip behind it.</p>' +
      '</div>';

    Array.prototype.forEach.call(document.querySelectorAll('.srow[data-k] .vplay'), function (b) {
      b.onclick = function () { A.unlock(); A.sayPhoneme(b.parentNode.dataset.k); };
    });
  }

  function tabSettings() {
    document.getElementById('ptab').innerHTML =
      '<div class="panel"><h3>Who is playing</h3>' +
        '<label class="field"><span>Name on the welcome screen</span>' +
          '<input type="text" id="kidname" value="' + esc(S.name) + '" maxlength="16"></label>' +
        '<label class="field"><span>Born</span>' +
          '<input type="month" id="kidborn" value="' + esc(S.born || '') + '" max="' + dayKey().slice(0, 7) + '"></label>' +
        '<p class="hint">' + (ageYears() == null
          ? 'Optional. With it, <b>Plan</b> says which level suits her age and the app opens a fresh device at the right one instead of at the beginning. The month, not the day &mdash; and it stays on this device like everything else.'
          : '<b>' + esc(ageText()) + '</b> old. The <b>Plan</b> tab uses this to say which level to open; the app never locks anything either way.') + '</p>' +
        '<label class="field"><span>Photo</span></label>' +
        '<div class="photorow"><div class="pphoto" id="pphoto">' + icon('camera') + '</div>' +
          '<div class="btnrow"><label class="btn btn--ghost" for="photofile">Choose a photo</label>' +
          '<input type="file" id="photofile" accept="image/*" hidden>' +
          '<button class="btn btn--ghost" id="photodel">Remove</button></div></div>' +
        '<p class="hint">The photo is stored only on this device, inside this browser. It is never uploaded and never included if you share the page link.</p>' +
        '<p class="hint">Build <b>' + esc(window.BUILD || 'dev') + '</b> &mdash; the commit this copy was deployed from. If it does not match what you just pushed, the deploy did not land.</p>' +
      '</div>' +
      '<div class="panel"><h3>Session</h3>' +
        '<label class="field"><span>Soft stop after</span><select id="cap">' +
          [6, 8, 10, 12, 15, 20, 30].map(function (n) {
            return '<option value="' + n + '"' + (S.settings.cap === n ? ' selected' : '') + '>' + n + ' minutes</option>';
          }).join('') + '</select></label>' +
        '<p class="hint">Past this, the end-of-stop screen stops offering &ldquo;Next&rdquo; and says goodbye. It never interrupts a stop in progress.</p>' +
        '<label class="field field--row"><span>Sound effects</span><input type="checkbox" id="sfx"' + (S.settings.sfx ? ' checked' : '') + '></label>' +
        '<label class="field"><span>Speaking speed</span><input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="' + S.settings.rate + '"></label>' +
        '<label class="field"><span>Pause between questions</span><select id="pace">' +
          ['Short &mdash; 0.5s', 'Steady &mdash; 0.8s', 'Long &mdash; 1.3s'].map(function (n, i) {
            return '<option value="' + i + '"' + (S.settings.pace === i ? ' selected' : '') + '>' + n + '</option>';
          }).join('') + '</select></label>' +
        '<p class="hint">The next question never starts until the last one has finished speaking &mdash; this is the extra quiet on top of that. It also sets the silence between the sounds on a letter card, so she has room to copy each one before the next arrives.</p>' +
      '</div>' +
      '<div class="panel"><h3>Backup</h3>' +
        '<p class="hint">Stars and progress live in this browser and nowhere else. Two ways to keep a copy &mdash; the photo and any voice recordings stay on the device either way, they are too large to copy.</p>' +
        '<h4>To a file</h4>' +
        '<p class="hint">Saves a small <code>.json</code> you can put in your photos, email to yourself, or load on another device.</p>' +
        '<div class="btnrow">' +
          '<button class="btn btn--ghost" id="exp">Save to a file</button>' +
          '<label class="btn btn--ghost" for="impfile">Load from a file</label>' +
          '<input type="file" id="impfile" accept="application/json,.json" hidden>' +
        '</div>' +
        '<h4>To your Claude account</h4>' +
        '<p class="hint">Only works on the Claude preview link, not on your own website.</p>' +
        '<div class="btnrow"><button class="btn btn--ghost" id="backup">Back up now</button>' +
        '<button class="btn btn--ghost" id="restore">Restore</button></div>' +
        '<p class="hint" id="bstat"></p>' +
      '</div>' +
      '<div class="panel panel--danger"><h3>Start over</h3>' +
        '<p class="hint">Clears every star and every box on this device. The photo and recordings are kept.</p>' +
        '<button class="btn btn--danger" id="reset">Reset all progress</button>' +
      '</div>';

    A.blobURL('photo:child').then(function (url) {
      var el = document.getElementById('pphoto');
      if (url && el) { el.innerHTML = ''; el.style.backgroundImage = 'url(' + url + ')'; el.classList.add('has-photo'); }
    });

    document.getElementById('kidname').onchange = function () {
      S.name = this.value.trim().slice(0, 16); save();
    };
    document.getElementById('kidborn').onchange = function () {
      /* Anything that is not YYYY-MM is stored as nothing, and the app goes
         back to deciding from her progress alone. */
      S.born = /^\d{4}-\d{2}$/.test(this.value) ? this.value : '';
      save();
      screenParent();            // the hint under the field, and Plan, both move
    };
    document.getElementById('photofile').onchange = function () {
      var f = this.files && this.files[0];
      if (!f) return;
      squarePhoto(f).then(function (blob) {
        return A.putBlob('photo:child', blob);
      }).then(function () { toast('Photo saved'); screenParent(); })
        .catch(function () { toast('Could not read that image'); });
    };
    document.getElementById('photodel').onclick = function () {
      A.delBlob('photo:child').then(function () { toast('Photo removed'); screenParent(); });
    };
    document.getElementById('cap').onchange = function () { S.settings.cap = +this.value; save(); };
    document.getElementById('sfx').onchange = function () { S.settings.sfx = this.checked; save(); };
    document.getElementById('pace').onchange = function () { S.settings.pace = +this.value; save(); };
    document.getElementById('rate').onchange = function () {
      S.settings.rate = +this.value; A.rate = +this.value; save(); A.unlock(); A.say('Like this.');
    };

    document.getElementById('exp').onclick = function () {
      var st = document.getElementById('bstat');
      try {
        var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'phonics-' + (S.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'progress') + '-' + dayKey() + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        st.textContent = 'Saved ' + a.download;
      } catch (e) {
        st.textContent = 'This view will not allow downloads. Use the Claude account backup, or open the app on your own website.';
      }
    };
    document.getElementById('impfile').onchange = function () {
      var f = this.files && this.files[0];
      var st = document.getElementById('bstat');
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var p = JSON.parse(fr.result);
          if (!p || typeof p !== 'object' || !p.stars) throw new Error('not a phonics backup');
          S = Object.assign(clone(DEFAULTS), p);
          S.settings = Object.assign({}, DEFAULTS.settings, p.settings || {});
          save();
          st.textContent = 'Loaded ' + Object.keys(S.stars).length + ' stops, ' + totalStars() + ' stars.';
          setTimeout(screenParent, 500);
        } catch (e) { st.textContent = 'That file is not a phonics backup.'; }
      };
      fr.onerror = function () { st.textContent = 'Could not read that file.'; };
      fr.readAsText(f);
    };

    document.getElementById('backup').onclick = function () {
      var st = document.getElementById('bstat'); st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Account backup only works on the Claude preview link. Use "Save to a file" here.'; return; }
        return db.doc('progress/main').set({ state: JSON.stringify(S), at: Date.now() })
          .then(function () { st.textContent = 'Backed up ' + new Date().toLocaleString() + '.'; });
      }).catch(function () { st.textContent = 'Backup failed.'; });
    };
    document.getElementById('restore').onclick = function () {
      var st = document.getElementById('bstat'); st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Account backup only works on the Claude preview link. Use "Load from a file" here.'; return; }
        return db.doc('progress/main').get().then(function (d) {
          var raw = d && (d.state || (d.data && d.data.state));
          if (!raw) { st.textContent = 'No backup found.'; return; }
          S = Object.assign(clone(DEFAULTS), JSON.parse(raw));
          save(); st.textContent = 'Restored.';
          setTimeout(screenParent, 400);
        });
      }).catch(function () { st.textContent = 'Restore failed.'; });
    };
    document.getElementById('reset').onclick = function () {
      if (this.dataset.armed === '1') { var nm = S.name; S = clone(DEFAULTS); S.name = nm; save(); screenWelcome(); }
      else { this.dataset.armed = '1'; this.textContent = 'Tap again to confirm'; }
    };
  }

  /* Downscale and centre-crop to a square so a 4MB phone photo does not
     sit in IndexedDB, and so the round frame always looks right. */
  function squarePhoto(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        try {
          var side = Math.min(img.width, img.height);
          var cv = document.createElement('canvas');
          cv.width = cv.height = 480;
          var g = cv.getContext('2d');
          g.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 480, 480);
          URL.revokeObjectURL(url);
          cv.toBlob(function (b) { b ? resolve(b) : reject(new Error('no blob')); }, 'image/jpeg', 0.85);
        } catch (e) { reject(e); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }

  var dbPromise = null;
  function getDB() {
    if (!dbPromise) {
      dbPromise = (window.claude && window.claude.use)
        ? window.claude.use('db').catch(function () { return null; })
        : Promise.resolve(null);
    }
    return dbPromise;
  }

  /* ==================================================================
     BOOT
     ================================================================== */
  A.rate = S.settings.rate;
  A.init().then(loadPhotos).then(function () {
    if (S.settings.voice) setTimeout(function () { A.setVoice(S.settings.voice); }, 300);
    screenWelcome();
    A.preload();          // every letter and team sound, so the first tap is not a wait
  });
})();
