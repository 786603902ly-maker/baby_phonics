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
    name: 'Rourou',
    stars: {},       // lessonId -> 1..3
    best: {},        // lessonId -> {correct, total}
    boxes: {},       // srs
    runs: [],        // one entry per finished lesson
    settings: { voice: '', rate: 0.85, cap: 15, sfx: true }
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

  function nav(html) { root.innerHTML = html; window.scrollTo(0, 0); }

  /* ==================================================================
     PROGRESS QUERIES
     ================================================================== */
  function starsFor(id) { return S.stars[id] || 0; }
  function done(id) { return starsFor(id) > 0; }
  function totalStars() {
    return Object.keys(S.stars).reduce(function (n, k) { return n + S.stars[k]; }, 0);
  }
  function maxStars() { return C.LESSONS.filter(function (l) { return true; }).length * 3; }

  /* A lesson is open if it is the first unfinished one in its level, or
     already finished, or the one right after a finished one. Nothing is
     ever hard-locked — she can replay anything. */
  function nextLesson(level) {
    var ls = C.levelLessons(level);
    for (var i = 0; i < ls.length; i++) if (!done(ls[i].id)) return ls[i];
    return ls[ls.length - 1];
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
    nav(
      '<div class="screen wrap-welcome">' +
        '<div class="welcome">' +
          '<div class="wphoto" id="wphoto">' + icon('otter') + '</div>' +
          '<p class="weyebrow">Phonics with Pip</p>' +
          '<h1 class="wname">Hi, ' + esc(S.name) + '!</h1>' +
          '<div class="wstars">' + icon('starOn', 'wstar') + '<b>' + ts + '</b><small>stars</small></div>' +
          '<button class="bigbtn" id="go">' + icon('play', 'bigbtn-glyph') + '<span>Play</span></button>' +
          '<button class="ghostbtn" id="toBook">My Book</button>' +
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
    document.getElementById('go').onclick = function () {
      ensureSound();
      A.say('Hello ' + S.name + '! Let us play.');
      screenMap();
    };
    document.getElementById('toBook').onclick = function () { ensureSound(); screenBook(); };
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
    if (openLevel == null) {
      var l2 = C.levelLessons(2).filter(function (l) { return done(l.id); }).length;
      openLevel = l2 > 0 ? 2 : (C.levelLessons(1).every(function (l) { return done(l.id); }) ? 2 : 1);
    }

    var levelTabs = C.LEVELS.map(function (lv) {
      var ls = C.levelLessons(lv.id);
      var d = ls.filter(function (l) { return done(l.id); }).length;
      return '<button class="lvtab ' + (openLevel === lv.id ? 'is-on' : '') + (lv.built ? '' : ' is-soon') + '" data-lv="' + lv.id + '">' +
        '<span class="lvtab-n tint-' + lv.tint + '">' + (lv.built ? lv.id : icon('lockClosed')) + '</span>' +
        '<span class="lvtab-t"><b>' + esc(lv.name) + '</b><small>' + (lv.built ? d + ' / ' + ls.length + ' done' : 'later') + '</small></span>' +
        '</button>';
    }).join('');

    var lv = C.LEVELS.filter(function (x) { return x.id === openLevel; })[0];
    var body;

    if (!lv.built) {
      body = '<div class="soon"><div class="soon-badge">' + icon('lockClosed') + '</div>' +
        '<h2>' + esc(lv.name) + '</h2><p>' + esc(lv.blurb) + '</p><p class="soon-age">' + esc(lv.age) + '</p></div>';
    } else {
      var ls = C.levelLessons(openLevel);
      var nxt = nextLesson(openLevel);
      body = '<div class="path">' + ls.map(function (l, i) {
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

    var next = document.querySelector('.stop.is-next');
    if (next) setTimeout(function () { next.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
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

    nav(
      '<div class="screen screen-book">' +
        '<header class="mhead">' +
          '<button class="iconbtn" id="back" aria-label="Back">' + icon('back') + '</button>' +
          '<h2 class="mtitle">' + esc(S.name) + '&rsquo;s Book</h2>' +
          '<span class="iconbtn iconbtn--ghost"></span>' +
        '</header>' +
        '<div class="bigstars"><span class="bigstar">' + icon('starOn') + '</span><b>' + totalStars() + '</b><small>stars so far</small></div>' +
        '<h3 class="bsec">My Letters</h3>' +
        '<div class="bletters">' + letters + '</div>' +
        '<h3 class="bsec">My Words</h3>' +
        '<div class="bthemes">' + themes + '</div>' +
      '</div>'
    );
    document.getElementById('back').onclick = screenMap;
  }

  /* ==================================================================
     ROUND BUILDERS
     ================================================================== */
  var GEN = {};

  /* Level 1: hear a word, tap the picture. */
  GEN.picturePick = function (cfg, lesson) {
    var out = [];
    sample(cfg.words, cfg.rounds).forEach(function (k) {
      var others = sample(cfg.words.filter(function (x) { return x !== k; }), 2);
      out.push({
        kind: 'pick', track: 'T:' + lesson.id.slice(2),
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
      kind: 'memory', track: 'T:' + lesson.id.slice(2),
      text: 'Find the pairs',
      words: sample(cfg.words, cfg.pairs),
      play: function () { return A.say('Find the two that are the same.'); }
    }];
  };

  /* Level 2: the letter card — exactly the shape of Rourou's paper card. */
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

  /* ==================================================================
     LESSON RUNNER
     ================================================================== */
  var run = null;
  var sessionStart = 0;

  function startLesson(lesson) {
    var rounds = [];
    lesson.activities.forEach(function (a) {
      if (GEN[a.type]) rounds = rounds.concat(GEN[a.type](a, lesson));
    });
    if (!rounds.length) { toast('Nothing here yet'); return; }
    run = { lesson: lesson, rounds: rounds, i: 0, correct: 0, tries: 0, t0: Date.now() };
    if (!sessionStart) sessionStart = Date.now();
    renderRound();
  }

  function shell(inner, opts) {
    opts = opts || {};
    var r = run.rounds[run.i];
    var pct = Math.round((run.i / run.rounds.length) * 100);
    nav(
      '<div class="screen screen-play">' +
        '<div class="pbar-row">' +
          '<button class="iconbtn" id="quit" aria-label="Back to the map">' + icon('back') + '</button>' +
          '<div class="pbar"><i style="width:' + pct + '%"></i></div>' +
          '<div class="scorechip">' + icon('starOn', 'sc-glyph') + '<b>' + run.correct + '</b></div>' +
          '<button class="iconbtn" id="again" aria-label="Say it again">' + icon('ear') + '</button>' +
        '</div>' +
        '<div class="says"><span class="says-pip">' + icon('otter') + '</span><p>' + (r.text || '') + '</p></div>' +
        '<div class="stagearea">' + inner + '</div>' +
      '</div>'
    );
    document.getElementById('quit').onclick = function () { A.stop(); run = null; screenMap(); };
    document.getElementById('again').onclick = function () { A.stop(); if (r.play) r.play(); };
    if (!opts.silent && r.play) setTimeout(function () { r.play(); }, 240);
  }

  function advance(ms) {
    setTimeout(function () {
      run.i++;
      if (run.i >= run.rounds.length) finishLesson();
      else renderRound();
    }, ms == null ? 950 : ms);
  }

  function right(track) {
    run.correct++; run.tries++;
    if (track) SRS.hit(track);
    if (S.settings.sfx) A.sfx('correct');
    A.say(pick(['Yes!', 'Well done!', 'You got it!', 'Clever girl!', 'That is right!']));
  }
  function wrong(track) {
    run.tries++;
    if (track) SRS.miss(track);
    if (S.settings.sfx) A.sfx('retry');
    A.say(pick(['Try again.', 'Not that one. Try again.', 'Have another go.']));
  }

  function renderRound() {
    var r = run.rounds[run.i];
    ({ pick: rPick, memory: rMemory, meet: rMeet, missing: rMissing })[r.kind](r);
  }

  /* ---- three-choice picker (pictures OR letters) ---- */
  function rPick(r) {
    var opts = r.options.map(function (o, i) {
      var body = o.kind === 'pic'
        ? '<span class="pic">' + icon(word(o.word).icon) + '</span>'
        : '<span class="glyph">' + esc(glyph(o.letter)) + '</span>';
      return '<button class="opt" data-i="' + i + '">' + body + '</button>';
    }).join('');
    shell('<div class="opts">' + opts + '</div>');

    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        var o = r.options[+b.dataset.i];
        if (o.correct) {
          Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          right(r.track);
          if (o.kind === 'pic') A.sayWord(word(o.word).text);
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

  /* ---- the letter card: big Aa, its friend, four keyword pictures ---- */
  function rMeet(r) {
    var L = C.ALPHABET[r.letter];
    var pics = L.words.map(function (k, i) {
      var t = word(k).text;
      var head = esc(t.charAt(0));
      var tail = esc(t.slice(1));
      return '<button class="kw" data-k="' + k + '" data-i="' + i + '">' +
        '<span class="kw-pic">' + icon(word(k).icon) + '</span>' +
        '<span class="kw-text"><b>' + head + '</b>' + tail + '</span>' +
        '</button>';
    }).join('');

    shell(
      '<div class="card">' +
        '<button class="card-top" id="cardtop">' +
          '<span class="card-letter">' + esc(r.letter.toUpperCase()) + esc(r.letter) + '</span>' +
          (L.friend ? '<span class="card-friend">' + esc(L.friend) + '</span>' : '') +
        '</button>' +
        '<div class="kws">' + pics + '</div>' +
        '<button class="nextbtn" id="cardnext">' + icon('play') + '</button>' +
      '</div>',
      { silent: true }
    );

    function sayLetter() {
      return A.sayLetterName(r.letter)
        .then(function () { return A.sayPhoneme(r.letter); })
        .then(function () { return A.sayPhoneme(r.letter); });
    }
    function sayKeyword(k) {
      return A.sayPhoneme(r.letter).then(function () { return A.sayWord(word(k).text); });
    }

    var top = document.getElementById('cardtop');
    top.onclick = function () { bump(top); sayLetter(); };

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

    /* say it once on arrival, then walk the four words */
    setTimeout(function () {
      sayLetter().then(function () {
        var seq = Promise.resolve();
        L.words.forEach(function (k, i) {
          seq = seq.then(function () {
            var el = document.querySelector('.kw[data-i="' + i + '"]');
            if (el) { bump(el); el.classList.add('seen'); }
            return sayKeyword(k);
          });
        });
        return seq;
      }).then(function () {
        var n = document.getElementById('cardnext');
        if (n) n.classList.add('ready');
      });
    }, 260);

    document.getElementById('cardnext').onclick = function () {
      SRS.hit(r.track);
      run.correct++; run.tries++;
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
        '<div class="missing-pic">' + icon(word(r.word).icon) + '</div>' +
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
          right(r.track);
          A.sayWord(t);
          advance(1200);
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
        '<span class="mface">' + icon(word(k).icon) + '</span>' +
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
    save();

    if (S.settings.sfx) A.sfx('reward');
    A.say(n === 3 ? 'Perfect! Three stars!' : n === 2 ? 'Well done! Two stars!' : 'Good try! One star!');

    var overCap = sessionStart && (Date.now() - sessionStart) / 60000 > S.settings.cap;
    var ls = C.levelLessons(l.level);
    var idx = ls.map(function (x) { return x.id; }).indexOf(l.id);
    var next = ls[idx + 1];

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
          '</div>' +
          (overCap ? '<p class="donecap">That was a good long turn. See you tomorrow!</p>' : '') +
        '</div>' +
      '</div>'
    );
    document.getElementById('dmap').onclick = function () { if (overCap) sessionStart = 0; screenMap(); };
    var dn = document.getElementById('dnext');
    if (dn) dn.onclick = function () { startLesson(next); };
    run = null;
  }

  /* ==================================================================
     SCREEN · GROWN-UPS
     ================================================================== */
  var tab = 'progress';

  function screenParent() {
    A.stop();
    nav(
      '<div class="screen screen-parent">' +
        '<div class="phead">' +
          '<button class="iconbtn" id="pback" aria-label="Back">' + icon('back') + '</button>' +
          '<h2>Grown-ups</h2><span class="iconbtn iconbtn--ghost"></span>' +
        '</div>' +
        '<nav class="tabs">' + ['progress', 'voice', 'settings'].map(function (t) {
          return '<button class="tab ' + (tab === t ? 'is-on' : '') + '" data-t="' + t + '">' + t + '</button>';
        }).join('') + '</nav>' +
        '<div id="ptab"></div>' +
      '</div>'
    );
    document.getElementById('pback').onclick = screenWelcome;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.onclick = function () { tab = b.dataset.t; screenParent(); };
    });
    ({ progress: tabProgress, voice: tabVoice, settings: tabSettings })[tab]();
  }

  function tabProgress() {
    var tr = C.trackables();
    var letters = tr.filter(function (t) { return t.kind === 'letter'; });
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
        '<h4>Word themes</h4><div class="grid grid--wide">' + cells(themes) + '</div>' +
        '<div class="legend">' + [0, 1, 2, 3, 4, 5].map(function (n) {
          return '<span class="lg"><i class="cell b' + n + '"></i>' + (n === 0 ? 'new' : n) + '</span>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="panel"><h3>Practise these away from the screen</h3>' +
        (weak.length
          ? '<ol class="weak">' + weak.map(function (t) {
              var a = Math.round(SRS.acc(t.key) * 100);
              var hint = t.kind === 'letter' && C.ALPHABET[t.label]
                ? 'Point at ' + C.ALPHABET[t.label].words.map(function (k) { return C.WORDS[k].text; }).join(', ') + ' in real life'
                : 'Name these things when you see them';
              return '<li><b>' + esc(t.label) + '</b><span class="acc">' + a + '%</span><em>' + esc(hint) + '</em></li>';
            }).join('') + '</ol>'
          : '<p class="hint">Fills up once an item has been seen three times.</p>') +
      '</div>' +

      '<div class="panel"><h3>Recent turns</h3>' +
        (recent.length
          ? '<table class="tbl"><thead><tr><th>When</th><th>Stop</th><th class="num">Mins</th><th class="num">Score</th><th class="num">Stars</th></tr></thead><tbody>' +
            recent.map(function (r) {
              var l = C.lesson(r.lesson);
              return '<tr><td>' + new Date(r.d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</td>' +
                '<td>' + esc(l ? (l.shortName || l.name) : r.lesson) + '</td>' +
                '<td class="num">' + (r.mins || 0) + '</td>' +
                '<td class="num">' + r.correct + '/' + r.tries + '</td>' +
                '<td class="num">' + r.stars + '</td></tr>';
            }).join('') + '</tbody></table>'
          : '<p class="hint">No turns yet.</p>') +
      '</div>';
  }

  function tabVoice() {
    var can = A.canRecord();
    var letters = C.LETTERS;

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
        '<p class="hint"><b>For the way you are teaching now &mdash; no.</b> The letter card teaches the sound through its four words (a &mdash; apple, ax, ant, alligator), and speech synthesis says whole words perfectly well. Leave this page alone.</p>' +
        '<p class="hint">It starts to matter only at Level 3, when she has to sound out <b>c-a-t</b> one phoneme at a time. No speech engine can say a bare /t/ &mdash; it always adds &ldquo;uh&rdquo;, so &ldquo;cuh-a-tuh&rdquo; never blends into &ldquo;cat&rdquo;. At that point, recording the 26 sounds in your own voice fixes it. Ten minutes, once, months from now.</p>' +
        '<p class="stat"><b>' + A.recordingCount() + '</b> clips recorded' + (can ? '' : ' &middot; <span class="warn">this browser will not give the page a microphone</span>') + '</p>' +
        '<label class="field"><span>Voice</span><select id="voicepick">' +
          '<option value="">Automatic (British English preferred)</option>' +
          A.voices().map(function (v) {
            return '<option value="' + esc(v.name) + '"' + (S.settings.voice === v.name ? ' selected' : '') + '>' + esc(v.name) + ' &mdash; ' + esc(v.lang) + '</option>';
          }).join('') + '</select></label>' +
      '</div>' +
      '<div class="panel"><h3>Letter sounds <small>' +
        letters.filter(function (l) { return A.hasRecording('p:' + l); }).length + '/26 &mdash; optional</small></h3>' +
        '<div class="vlist">' + letters.map(function (l) {
          return row('p:' + l, glyph(l), 'as in ' + C.WORDS[C.ALPHABET[l].words[0]].text);
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

  function tabSettings() {
    document.getElementById('ptab').innerHTML =
      '<div class="panel"><h3>Who is playing</h3>' +
        '<label class="field"><span>Name on the welcome screen</span>' +
          '<input type="text" id="kidname" value="' + esc(S.name) + '" maxlength="16"></label>' +
        '<label class="field"><span>Photo</span></label>' +
        '<div class="photorow"><div class="pphoto" id="pphoto">' + icon('camera') + '</div>' +
          '<div class="btnrow"><label class="btn btn--ghost" for="photofile">Choose a photo</label>' +
          '<input type="file" id="photofile" accept="image/*" hidden>' +
          '<button class="btn btn--ghost" id="photodel">Remove</button></div></div>' +
        '<p class="hint">The photo is stored only on this device, inside this browser. It is never uploaded and never included if you share the page link.</p>' +
      '</div>' +
      '<div class="panel"><h3>Session</h3>' +
        '<label class="field"><span>Soft stop after</span><select id="cap">' +
          [6, 8, 10, 12, 15, 20, 30].map(function (n) {
            return '<option value="' + n + '"' + (S.settings.cap === n ? ' selected' : '') + '>' + n + ' minutes</option>';
          }).join('') + '</select></label>' +
        '<p class="hint">Past this, the end-of-stop screen stops offering &ldquo;Next&rdquo; and says goodbye. It never interrupts a stop in progress.</p>' +
        '<label class="field field--row"><span>Sound effects</span><input type="checkbox" id="sfx"' + (S.settings.sfx ? ' checked' : '') + '></label>' +
        '<label class="field"><span>Speaking speed</span><input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="' + S.settings.rate + '"></label>' +
      '</div>' +
      '<div class="panel"><h3>Backup</h3>' +
        '<p class="hint">Stars and progress live in this browser. A backup copies them to your Claude account. The photo and any recordings stay on the device.</p>' +
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
      S.name = (this.value || 'Rourou').trim().slice(0, 16); save();
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
    document.getElementById('rate').onchange = function () {
      S.settings.rate = +this.value; A.rate = +this.value; save(); A.unlock(); A.say('Like this.');
    };

    document.getElementById('backup').onclick = function () {
      var st = document.getElementById('bstat'); st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Backup is not available in this view.'; return; }
        return db.doc('progress/main').set({ state: JSON.stringify(S), at: Date.now() })
          .then(function () { st.textContent = 'Backed up ' + new Date().toLocaleString() + '.'; });
      }).catch(function () { st.textContent = 'Backup failed.'; });
    };
    document.getElementById('restore').onclick = function () {
      var st = document.getElementById('bstat'); st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Backup is not available in this view.'; return; }
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
  A.init().then(function () {
    if (S.settings.voice) setTimeout(function () { A.setVoice(S.settings.voice); }, 300);
    screenWelcome();
  });
})();
