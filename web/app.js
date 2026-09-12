/* app.js — screens, activities, progress.
   Child-facing UI carries no written navigation: every instruction is
   spoken, every control is a picture. See docs/PLAN.md §0. */
(function () {
  'use strict';

  var C = window.CONTENT, A = window.AUDIO, icon = window.svgIcon;
  var root = document.getElementById('app');
  var KEY = 'pipphonics-v1';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================================================================
     STORE
     ================================================================== */
  var DEFAULTS = {
    v: 1,
    boxes: {},
    done: {},
    stickers: [],
    sessions: [],
    settings: { voice: '', rate: 0.85, cap: 12, sfx: true }
  };

  var S = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      var p = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), p, {
        settings: Object.assign({}, DEFAULTS.settings, p.settings || {})
      });
    } catch (e) { return JSON.parse(JSON.stringify(DEFAULTS)); }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
  }

  /* ==================================================================
     SPACED REPETITION (Leitner) — docs/PLAN.md §5.1
     ================================================================== */
  var INTERVAL_DAYS = [0, 1, 2, 4, 8, 16];
  var DAY = 86400000;

  var SRS = {
    get: function (k) { return S.boxes[k] || { box: 0, seen: 0, correct: 0, last: 0 }; },
    hit: function (k) {
      var b = SRS.get(k);
      b.box = Math.min(5, (b.box || 0) + 1);
      b.seen++; b.correct++; b.last = Date.now();
      S.boxes[k] = b; save();
    },
    miss: function (k) {
      var b = SRS.get(k);
      b.box = 1; b.seen++; b.last = Date.now();
      S.boxes[k] = b; save();
    },
    due: function (k) {
      var b = SRS.get(k);
      if (!b.box) return true;
      return Date.now() - b.last >= INTERVAL_DAYS[b.box] * DAY;
    },
    accuracy: function (k) {
      var b = SRS.get(k);
      return b.seen ? b.correct / b.seen : null;
    }
  };

  /* ==================================================================
     SMALL HELPERS
     ================================================================== */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function initialSound(wd) { return wd.phonemes ? wd.phonemes[0] : wd.text[0]; }
  function wordsBySound(letter) {
    return Object.keys(C.WORDS).filter(function (k) {
      return initialSound(C.WORDS[k]) === letter && C.WORDS[k].phonemes;
    });
  }
  function wordsInFamily(fam) {
    return Object.keys(C.WORDS).filter(function (k) { return C.WORDS[k].rhyme === fam; });
  }
  function wordsWithSyllables(n) {
    return Object.keys(C.WORDS).filter(function (k) { return C.WORDS[k].syl === n; });
  }

  /* ==================================================================
     DRAG — Pointer Events only. HTML5 drag-and-drop is unreliable on
     mobile Safari, which is the target device. docs/PLAN.md §4.1
     ================================================================== */
  function draggable(el, opts) {
    var sx = 0, sy = 0, dragging = false;
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', function (e) {
      if (el.dataset.locked === '1') return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      if (opts.onStart) opts.onStart();
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      el.style.transform = 'translate(' + (e.clientX - sx) + 'px,' + (e.clientY - sy) + 'px) scale(1.08)';
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      var zones = opts.zones() || [];
      var hit = null;
      for (var i = 0; i < zones.length; i++) {
        var r = zones[i].el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { hit = zones[i]; break; }
      }
      el.style.transform = '';
      if (hit) opts.onDrop(hit, el);
      else if (opts.onMiss) opts.onMiss(el);
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  /* ==================================================================
     APP CHROME
     ================================================================== */
  var soundOn = false;
  var session = { start: 0, rounds: 0, correct: 0 };

  function ensureSound() {
    if (soundOn) return Promise.resolve();
    A.unlock();
    soundOn = true;
    var banner = document.querySelector('.soundbar');
    if (banner) banner.remove();
    return Promise.resolve();
  }

  function nav(html) {
    root.innerHTML = html;
    root.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function gearButton() {
    return '<button class="gear" id="gear" aria-label="Grown-ups: press and hold">' + icon('gear') + '</button>';
  }

  function wireGear() {
    var g = document.getElementById('gear');
    if (!g) return;
    var t = null, fired = false;
    function start() {
      fired = false;
      g.classList.add('holding');
      t = setTimeout(function () { fired = true; g.classList.remove('holding'); screenParent(); }, 2000);
    }
    function stop() {
      clearTimeout(t); g.classList.remove('holding');
      if (!fired) toast('Grown-ups: press and hold');
    }
    g.addEventListener('pointerdown', start);
    g.addEventListener('pointerup', stop);
    g.addEventListener('pointerleave', stop);
    g.addEventListener('pointercancel', stop);
  }

  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('go'); }, 10);
    setTimeout(function () { el.remove(); }, 2400);
  }

  /* ==================================================================
     SCREEN · HOME (the journey)
     ================================================================== */
  function stageLessons(id) {
    return C.LESSONS.filter(function (l) { return l.stage === id; });
  }
  function lessonDone(id) { return !!S.done[id]; }

  function nextLesson() {
    for (var i = 0; i < C.LESSONS.length; i++) {
      if (!lessonDone(C.LESSONS[i].id)) return C.LESSONS[i];
    }
    return C.LESSONS[0];
  }

  function screenHome() {
    var nxt = nextLesson();
    var totalDone = Object.keys(S.done).length;

    var stagesHtml = C.STAGES.map(function (st) {
      var ls = stageLessons(st.id);
      var done = ls.filter(function (l) { return lessonDone(l.id); }).length;
      var stops = ls.map(function (l, i) {
        var d = lessonDone(l.id);
        var isNext = l.id === nxt.id;
        return '<button class="stop ' + (d ? 'is-done' : '') + (isNext ? ' is-next' : '') + '" data-lesson="' + l.id + '">' +
          '<span class="stop-dot">' + (d ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : (i + 1)) + '</span>' +
          '<span class="stop-name">' + esc(l.name) + '</span>' +
          (isNext ? '<span class="stop-cue">' + icon('play', 'cue-glyph') + '</span>' : '') +
          '</button>';
      }).join('');

      if (!st.built) {
        return '<section class="stage stage--locked">' +
          '<header class="stage-head">' +
            '<div class="stage-badge tint-' + st.tint + '">' + icon('lockClosed') + '</div>' +
            '<div><h2>' + esc(st.name) + '</h2><p class="stage-sub">' + esc(st.place) + ' · age ' + esc(st.age) + '</p></div>' +
          '</header>' +
          '<p class="stage-blurb">' + esc(st.blurb) + '</p>' +
          '<p class="stage-flag">Year 2</p>' +
          '</section>';
      }

      return '<section class="stage">' +
        '<header class="stage-head">' +
          '<div class="stage-badge tint-' + st.tint + '">' + st.id + '</div>' +
          '<div><h2>' + esc(st.name) + '</h2><p class="stage-sub">' + esc(st.place) + ' · age ' + esc(st.age) + '</p></div>' +
          '<div class="stage-count"><b>' + done + '</b>/' + ls.length + '</div>' +
        '</header>' +
        '<p class="stage-blurb">' + esc(st.blurb) + '</p>' +
        '<div class="stops">' + stops + '</div>' +
        '</section>';
    }).join('');

    nav(
      '<div class="screen screen-home">' +
        '<header class="hero">' +
          gearButton() +
          '<div class="hero-pip">' + icon('otter') + '</div>' +
          '<div class="hero-text">' +
            '<p class="eyebrow">Phonics with</p>' +
            '<h1>Pip the Otter</h1>' +
            '<p class="hero-sub">' + (totalDone ? totalDone + ' stop' + (totalDone === 1 ? '' : 's') + ' along the trail · ' + S.stickers.length + ' stickers' : 'Tap the glowing stop to begin') + '</p>' +
          '</div>' +
          '<button class="treasure-btn" id="toTreasure" aria-label="My stickers">' +
            icon('star') + '<b>' + S.stickers.length + '</b>' +
          '</button>' +
        '</header>' +
        '<button class="bigplay" id="bigplay">' +
          '<span class="bigplay-icon">' + icon('play') + '</span>' +
          '<span class="bigplay-text"><small>Next stop</small><b>' + esc(nxt.name) + '</b></span>' +
        '</button>' +
        '<div class="trail">' + stagesHtml + '</div>' +
        '<footer class="foot">Year 1 builds stages 0–2. Stages 3–8 show the road ahead.</footer>' +
        (soundOn ? '' : '<div class="soundbar">' + icon('ear', 'sb-glyph') + '<span>Tap anywhere to turn on Pip&rsquo;s voice</span></div>') +
      '</div>'
    );

    wireGear();
    document.getElementById('toTreasure').onclick = function () { ensureSound(); screenTreasure(); };
    document.getElementById('bigplay').onclick = function () { ensureSound().then(function () { startLesson(nxt); }); };
    Array.prototype.forEach.call(document.querySelectorAll('.stop'), function (b) {
      b.onclick = function () {
        var l = C.LESSONS.filter(function (x) { return x.id === b.dataset.lesson; })[0];
        ensureSound().then(function () { startLesson(l); });
      };
    });
    if (!soundOn) {
      document.querySelector('.screen-home').addEventListener('pointerdown', function once() {
        ensureSound();
        var sb = document.querySelector('.soundbar');
        if (sb) sb.remove();
        A.say('Hello! I am Pip. Tap a stop and let us play.');
      }, { once: true });
    }
  }

  /* ==================================================================
     ROUND GENERATORS — activity config -> playable rounds
     ================================================================== */
  var GEN = {};

  GEN.rhymePick = function (cfg) {
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var fam = cfg.families[i % cfg.families.length];
      var inFam = wordsInFamily(fam);
      if (inFam.length < 2) continue;
      var two = sample(inFam, 2);
      var others = Object.keys(C.WORDS).filter(function (k) {
        return C.WORDS[k].rhyme !== fam && C.WORDS[k].syl === 1;
      });
      var distract = sample(others, 2);
      out.push(makePick({
        track: 'S:rhyme',
        say: function (a, b) { return function () { return A.sayWord(a).then(function () { return A.say('Which one rhymes with ' + a + '?'); }); }; }(C.WORDS[two[0]].text),
        text: 'Which one rhymes with <b>' + esc(C.WORDS[two[0]].text) + '</b>?',
        anchor: two[0],
        options: shuffle([two[1]].concat(distract)).map(function (k) {
          return { kind: 'icon', word: k, correct: k === two[1] };
        })
      }));
    }
    return out;
  };

  GEN.syllableCount = function (cfg) {
    var out = [];
    sample(cfg.words, cfg.rounds).forEach(function (k) {
      var wd = C.WORDS[k];
      if (!wd) return;
      out.push({
        kind: 'syllable', track: 'S:syllable', word: k, answer: wd.syl,
        text: 'How many claps in <b>' + esc(wd.text) + '</b>?',
        play: function () { return A.sayWord(wd.text).then(function () { return A.say('How many claps?'); }); }
      });
    });
    return out;
  };

  GEN.initialSoundPick = function (cfg) {
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var snd = cfg.sounds[i % cfg.sounds.length];
      var yes = wordsBySound(snd);
      if (!yes.length) continue;
      var target = pick(yes);
      var no = Object.keys(C.WORDS).filter(function (k) {
        return C.WORDS[k].phonemes && initialSound(C.WORDS[k]) !== snd;
      });
      out.push(makePick({
        track: 'L:' + snd,
        say: (function (s) { return function () { return A.say('Which one starts with').then(function () { return A.sayPhoneme(s); }); }; })(snd),
        text: 'Which one starts with <b class="gl">' + esc(snd) + '</b>?',
        options: shuffle([target].concat(sample(no, 2))).map(function (k) {
          return { kind: 'icon', word: k, correct: k === target };
        })
      }));
    }
    return out;
  };

  GEN.oralBlend = function (cfg) {
    var out = [];
    sample(cfg.words, cfg.rounds).forEach(function (k) {
      var wd = C.WORDS[k];
      if (!wd || !wd.phonemes) return;
      var no = Object.keys(C.WORDS).filter(function (x) { return x !== k && C.WORDS[x].syl === 1; });
      out.push(makePick({
        track: 'S:oralblend',
        say: function () {
          var seq = A.say('Robot says');
          wd.phonemes.forEach(function (p) { seq = seq.then(function () { return A.sayPhoneme(p); }); });
          return seq.then(function () { return A.say('What is it?'); });
        },
        text: 'Robot says&hellip; what is it?',
        options: shuffle([k].concat(sample(no, 2))).map(function (x) {
          return { kind: 'icon', word: x, correct: x === k };
        })
      }));
    });
    return out;
  };

  GEN.letterIntro = function (cfg) {
    return cfg.letters.map(function (l) {
      return { kind: 'intro', letter: l, track: 'L:' + l,
        text: 'This letter says&hellip; tap the card to hear it' };
    });
  };

  GEN.letterPick = function (cfg) {
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var target = cfg.letters[i % cfg.letters.length];
      var others = cfg.letters.filter(function (x) { return x !== target; });
      if (others.length < 2) others = Object.keys(C.LETTERS).filter(function (x) { return x !== target; });
      out.push(makePick({
        track: 'L:' + target,
        say: (function (t) { return function () { return A.say('Find').then(function () { return A.sayPhoneme(t); }); }; })(target),
        text: 'Find the letter that says this sound',
        options: shuffle([target].concat(sample(others, 2))).map(function (l) {
          return { kind: 'letter', letter: l, correct: l === target };
        })
      }));
    }
    return out;
  };

  GEN.popSound = function (cfg) {
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var target = cfg.letters[i % cfg.letters.length];
      var others = Object.keys(C.LETTERS).filter(function (x) { return x !== target; });
      var bubbles = [];
      for (var j = 0; j < 3; j++) bubbles.push({ letter: target, good: true });
      sample(others, 6).forEach(function (l) { bubbles.push({ letter: l, good: false }); });
      out.push({ kind: 'pop', track: 'L:' + target, target: target, bubbles: shuffle(bubbles),
        text: 'Pop every <b class="gl">' + esc(target) + '</b>',
        play: (function (t) { return function () { return A.say('Pop every').then(function () { return A.sayPhoneme(t); }); }; })(target) });
    }
    return out;
  };

  GEN.soundSort = function (cfg) {
    var out = [];
    for (var i = 0; i < cfg.rounds; i++) {
      var pair = cfg.pairs[i % cfg.pairs.length];
      var a = sample(wordsBySound(pair[0]), 2), b = sample(wordsBySound(pair[1]), 2);
      if (!a.length || !b.length) continue;
      out.push({
        kind: 'sort', track: 'L:' + pair[0], bins: pair,
        tiles: shuffle(a.concat(b)),
        text: 'Put each picture in the right basket',
        play: (function (p) {
          return function () {
            return A.say('Put each picture with its first sound.')
              .then(function () { return A.sayPhoneme(p[0]); })
              .then(function () { return A.sayPhoneme(p[1]); });
          };
        })(pair)
      });
    }
    return out;
  };

  GEN.tapToBlend = function (cfg) {
    return cfg.words.map(function (k) {
      var wd = C.WORDS[k];
      return { kind: 'blend', track: 'S:blend', word: k, letters: wd.phonemes,
        text: 'Tap each sound, then push them together' ,
        play: function () { return A.say('Tap each sound.'); } };
    });
  };

  GEN.buildWord = function (cfg) {
    return cfg.words.map(function (k) {
      var wd = C.WORDS[k];
      var tiles = shuffle(wd.phonemes.concat(sample(cfg.distractors || ['s', 'm'], 2)));
      return { kind: 'build', track: 'S:blend', word: k, tiles: tiles,
        text: 'Build the word',
        play: function () { return A.sayWord(wd.text).then(function () { return A.say('Build it.'); }); } };
    });
  };

  GEN.sightWord = function (cfg) {
    var out = [];
    cfg.words.forEach(function (w) {
      var others = C.SIGHT.filter(function (x) { return x !== w; });
      out.push(makePick({
        track: 'W:' + w,
        say: (function (x) { return function () { return A.say('Find the word').then(function () { return A.sayWord(x); }); }; })(w),
        text: 'Find the word <b>' + esc(w) + '</b>',
        options: shuffle([w].concat(sample(others, 2))).map(function (x) {
          return { kind: 'word', word: x, correct: x === w };
        })
      }));
    });
    return out;
  };

  function makePick(o) {
    return { kind: 'pick', track: o.track, play: o.say, text: o.text, options: o.options, anchor: o.anchor || null };
  }

  /* ==================================================================
     LESSON RUNNER
     ================================================================== */
  var run = null;

  function startLesson(lesson) {
    var rounds = [];
    lesson.activities.forEach(function (a) {
      var g = GEN[a.type];
      if (g) rounds = rounds.concat(g(a, lesson));
    });
    if (!rounds.length) { toast('Nothing to play here yet'); return; }
    run = { lesson: lesson, rounds: rounds, i: 0, correct: 0, wrong: 0, t0: Date.now() };
    if (!session.start) session.start = Date.now();
    renderRound();
  }

  function progressBar() {
    var pct = Math.round((run.i / run.rounds.length) * 100);
    return '<div class="pbar"><i style="width:' + pct + '%"></i></div>';
  }

  function roundShell(inner, opts) {
    opts = opts || {};
    var r = run.rounds[run.i];
    nav(
      '<div class="screen screen-lesson">' +
        '<div class="lbar">' +
          '<button class="iconbtn" id="quit" aria-label="Back to the trail">' + icon('back') + '</button>' +
          progressBar() +
          '<button class="iconbtn" id="replay" aria-label="Say it again">' + icon('ear') + '</button>' +
        '</div>' +
        '<div class="prompt"><span class="prompt-pip">' + icon('otter') + '</span><p>' + (r.text || '') + '</p></div>' +
        '<div class="play" id="play">' + inner + '</div>' +
      '</div>'
    );
    document.getElementById('quit').onclick = endLesson.bind(null, true);
    document.getElementById('replay').onclick = function () { A.stop(); if (r.play) r.play(); };
    if (!opts.silent && r.play) setTimeout(function () { r.play(); }, 220);
  }

  function advance(delay) {
    setTimeout(function () {
      run.i++;
      if (run.i >= run.rounds.length) endLesson(false);
      else renderRound();
    }, delay == null ? 900 : delay);
  }

  function good(track) {
    run.correct++; session.rounds++; session.correct++;
    if (track) SRS.hit(track);
    if (S.settings.sfx) A.sfx('correct');
    A.say(pick(['Yes!', 'You got it!', 'Well done!', 'That is right!', 'Clever!']));
  }

  function bad(track) {
    run.wrong++; session.rounds++;
    if (track) SRS.miss(track);
    if (S.settings.sfx) A.sfx('retry');
    A.say(pick(['Try again.', 'Not that one. Try again.', 'Have another go.']));
  }

  function renderRound() {
    var r = run.rounds[run.i];
    ({
      pick: renderPick,
      syllable: renderSyllable,
      intro: renderIntro,
      pop: renderPop,
      sort: renderSort,
      blend: renderBlend,
      build: renderBuild
    })[r.kind](r);
  }

  /* ---- pick ---- */
  function renderPick(r) {
    var opts = r.options.map(function (o, i) {
      var body;
      if (o.kind === 'icon') {
        var wd = C.WORDS[o.word];
        body = '<span class="pic">' + icon(wd.icon) + '</span>';
      } else if (o.kind === 'letter') {
        body = '<span class="glyph">' + esc(o.letter === 'q' ? 'qu' : o.letter) + '</span>';
      } else {
        body = '<span class="glyph glyph--word">' + esc(o.word) + '</span>';
      }
      return '<button class="opt" data-i="' + i + '">' + body + '</button>';
    }).join('');

    roundShell(
      (r.anchor ? '<div class="anchor">' + icon(C.WORDS[r.anchor].icon) + '<b>' + esc(C.WORDS[r.anchor].text) + '</b></div>' : '') +
      '<div class="opts opts-' + r.options.length + '">' + opts + '</div>'
    );

    Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        if (b.dataset.spent === '1') return;
        var o = r.options[+b.dataset.i];
        if (o.correct) {
          Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (x) { x.dataset.spent = '1'; });
          b.classList.add('is-right');
          good(r.track);
          if (o.kind === 'icon') A.sayWord(C.WORDS[o.word].text);
          advance();
        } else {
          b.dataset.spent = '1';
          b.classList.add('is-wrong');
          setTimeout(function () { b.classList.remove('is-wrong'); b.dataset.spent = '0'; }, 700);
          bad(r.track);
        }
      };
    });
  }

  /* ---- syllable ---- */
  function renderSyllable(r) {
    var wd = C.WORDS[r.word];
    roundShell(
      '<div class="anchor anchor--big">' + icon(wd.icon) + '<b>' + esc(wd.text) + '</b></div>' +
      '<div class="opts opts-3">' +
        [1, 2, 3].map(function (n) {
          return '<button class="opt opt--drum" data-n="' + n + '"><span class="pic">' + icon('drum') + '</span><span class="drumn">' + n + '</span></button>';
        }).join('') +
      '</div>'
    );
    Array.prototype.forEach.call(document.querySelectorAll('.opt--drum'), function (b) {
      b.onclick = function () {
        if (+b.dataset.n === r.answer) { b.classList.add('is-right'); good(r.track); advance(); }
        else { b.classList.add('is-wrong'); setTimeout(function () { b.classList.remove('is-wrong'); }, 700); bad(r.track); }
      };
    });
  }

  /* ---- letter intro ---- */
  function renderIntro(r) {
    var L = C.LETTERS[r.letter];
    var glyph = r.letter === 'q' ? 'qu' : r.letter;
    roundShell(
      '<div class="intro">' +
        '<button class="intro-card" id="icard">' +
          '<span class="glyph glyph--huge">' + esc(glyph) + '</span>' +
          '<span class="intro-pic">' + icon(C.WORDS[L.keyword] ? C.WORDS[L.keyword].icon : L.keyword) + '</span>' +
        '</button>' +
        '<p class="intro-word">' + esc(L.keyword) + '</p>' +
        '<p class="intro-action">' + esc(L.action) + '</p>' +
        '<button class="nextbtn" id="inext">' + icon('play') + '</button>' +
      '</div>',
      { silent: true }
    );
    function sayIt() {
      return A.sayPhoneme(r.letter)
        .then(function () { return A.wait(120); })
        .then(function () { return A.sayPhoneme(r.letter); })
        .then(function () { return A.sayWord(L.keyword); });
    }
    var card = document.getElementById('icard');
    card.onclick = function () { card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse'); sayIt(); };
    setTimeout(sayIt, 250);
    document.getElementById('inext').onclick = function () { SRS.hit(r.track); advance(0); };
  }

  /* ---- pop ---- */
  function renderPop(r) {
    var html = r.bubbles.map(function (b, i) {
      var left = 4 + (i % 3) * 32 + Math.random() * 8;
      var top = 4 + Math.floor(i / 3) * 31 + Math.random() * 6;
      var dur = (2.6 + Math.random() * 1.8).toFixed(2);
      return '<button class="bubble" data-i="' + i + '" style="left:' + left + '%;top:' + top + '%;animation-duration:' + dur + 's">' +
        esc(b.letter === 'q' ? 'qu' : b.letter) + '</button>';
    }).join('');
    roundShell('<div class="pool">' + html + '</div>');
    var left = r.bubbles.filter(function (b) { return b.good; }).length;
    Array.prototype.forEach.call(document.querySelectorAll('.bubble'), function (el) {
      el.onclick = function () {
        var b = r.bubbles[+el.dataset.i];
        if (b.good) {
          el.classList.add('burst');
          if (S.settings.sfx) A.sfx('pop');
          A.sayPhoneme(r.target);
          left--;
          if (!left) { good(r.track); advance(700); }
        } else {
          el.classList.add('nope');
          setTimeout(function () { el.classList.remove('nope'); }, 500);
          if (S.settings.sfx) A.sfx('retry');
        }
      };
    });
  }

  /* ---- sort ---- */
  function renderSort(r) {
    var bins = r.bins.map(function (l) {
      return '<div class="bin" data-letter="' + l + '"><span class="glyph">' + esc(l) + '</span><div class="bin-catch"></div></div>';
    }).join('');
    var tiles = r.tiles.map(function (k, i) {
      return '<button class="tile" data-word="' + k + '" data-i="' + i + '">' + icon(C.WORDS[k].icon) + '</button>';
    }).join('');
    roundShell('<div class="sorter"><div class="bins">' + bins + '</div><div class="tiles">' + tiles + '</div></div>');

    var remaining = r.tiles.length;
    Array.prototype.forEach.call(document.querySelectorAll('.tile'), function (el) {
      draggable(el, {
        zones: function () {
          return Array.prototype.map.call(document.querySelectorAll('.bin'), function (b) {
            return { el: b, letter: b.dataset.letter };
          });
        },
        onStart: function () { A.sayWord(C.WORDS[el.dataset.word].text); },
        onDrop: function (zone) {
          var snd = initialSound(C.WORDS[el.dataset.word]);
          if (snd === zone.letter) {
            el.dataset.locked = '1';
            el.classList.add('placed');
            zone.el.querySelector('.bin-catch').appendChild(el);
            if (S.settings.sfx) A.sfx('pop');
            remaining--;
            if (!remaining) { good(r.track); advance(800); }
          } else {
            el.classList.add('is-wrong');
            setTimeout(function () { el.classList.remove('is-wrong'); }, 600);
            bad(r.track);
          }
        }
      });
      el.addEventListener('click', function () { A.sayWord(C.WORDS[el.dataset.word].text); });
    });
  }

  /* ---- tap to blend ---- */
  function renderBlend(r) {
    var wd = C.WORDS[r.word];
    var tiles = r.letters.map(function (l, i) {
      return '<button class="btile" data-i="' + i + '" data-l="' + l + '">' + esc(l) + '</button>';
    }).join('');
    roundShell(
      '<div class="blend">' +
        '<div class="btiles">' + tiles + '</div>' +
        '<button class="pushbtn" id="push" disabled>' +
          '<span>push them together</span>' +
          '<svg viewBox="0 0 60 24" aria-hidden="true"><path d="M4 12h44M40 5l9 7-9 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<div class="reveal" id="reveal" hidden>' +
          '<div class="anchor anchor--big">' + icon(wd.icon) + '<b>' + esc(wd.text) + '</b></div>' +
        '</div>' +
      '</div>'
    );
    var heard = {};
    var push = document.getElementById('push');
    Array.prototype.forEach.call(document.querySelectorAll('.btile'), function (el) {
      el.onclick = function () {
        el.classList.remove('lit'); void el.offsetWidth; el.classList.add('lit');
        A.sayPhoneme(el.dataset.l);
        SRS.hit('L:' + el.dataset.l);
        heard[el.dataset.i] = true;
        if (Object.keys(heard).length === r.letters.length) push.disabled = false;
      };
    });
    push.onclick = function () {
      push.disabled = true;
      var els = document.querySelectorAll('.btile');
      document.querySelector('.btiles').classList.add('squeeze');
      A.blendWord(wd.text, r.letters, function (i) {
        Array.prototype.forEach.call(els, function (x) { x.classList.remove('lit'); });
        if (i >= 0 && els[i]) els[i].classList.add('lit');
      }).then(function () {
        document.getElementById('reveal').hidden = false;
        good(r.track);
        advance(1400);
      });
    };
  }

  /* ---- build the word ---- */
  function renderBuild(r) {
    var wd = C.WORDS[r.word];
    var slots = wd.phonemes.map(function (_, i) { return '<div class="slot" data-i="' + i + '"></div>'; }).join('');
    var tiles = r.tiles.map(function (l, i) { return '<button class="ltile" data-l="' + l + '" data-i="' + i + '">' + esc(l) + '</button>'; }).join('');
    roundShell(
      '<div class="builder">' +
        '<div class="anchor anchor--big">' + icon(wd.icon) + '</div>' +
        '<div class="slots">' + slots + '</div>' +
        '<div class="ltiles">' + tiles + '</div>' +
      '</div>'
    );
    var filled = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.ltile'), function (el) {
      el.addEventListener('click', function () { A.sayPhoneme(el.dataset.l); });
      draggable(el, {
        zones: function () {
          return Array.prototype.filter.call(document.querySelectorAll('.slot'), function (s) { return !s.dataset.filled; })
            .map(function (s) { return { el: s, i: +s.dataset.i }; });
        },
        onStart: function () { A.sayPhoneme(el.dataset.l); },
        onDrop: function (zone) {
          if (wd.phonemes[zone.i] === el.dataset.l) {
            zone.el.dataset.filled = '1';
            zone.el.appendChild(el);
            el.dataset.locked = '1';
            el.classList.add('placed');
            if (S.settings.sfx) A.sfx('pop');
            filled++;
            if (filled === wd.phonemes.length) {
              A.blendWord(wd.text, wd.phonemes).then(function () { good(r.track); advance(900); });
            }
          } else {
            el.classList.add('is-wrong');
            setTimeout(function () { el.classList.remove('is-wrong'); }, 600);
            bad(r.track);
          }
        }
      });
    });
  }

  /* ---- end of lesson ---- */
  function endLesson(quit) {
    A.stop();
    var l = run.lesson;
    var total = run.correct + run.wrong;
    var acc = total ? run.correct / total : 0;

    if (!quit) {
      var prev = S.done[l.id] || { times: 0 };
      S.done[l.id] = { times: prev.times + 1, last: Date.now(), best: Math.max(prev.best || 0, acc) };
      var newSticker = null;
      if (S.stickers.length < C.STICKERS.length) {
        newSticker = C.STICKERS[S.stickers.length];
        S.stickers.push(newSticker);
      }
      S.sessions.push({ d: Date.now(), lesson: l.id, rounds: total, correct: run.correct,
        mins: Math.round((Date.now() - run.t0) / 6000) / 10 });
      if (S.sessions.length > 60) S.sessions = S.sessions.slice(-60);
      save();

      if (S.settings.sfx) A.sfx('reward');
      A.say('You did it! You earned a sticker.');

      var overCap = session.start && (Date.now() - session.start) / 60000 > S.settings.cap;

      nav(
        '<div class="screen screen-done">' +
          '<div class="done-card">' +
            '<div class="done-sticker">' + icon(newSticker || 'star') + '</div>' +
            '<h1>' + esc(l.name) + '</h1>' +
            '<p class="done-line">' + run.correct + ' right out of ' + total + '</p>' +
            (newSticker ? '<p class="done-sub">New sticker for your board</p>' : '') +
            '<div class="done-btns">' +
              '<button class="btn btn--ghost" id="toStickers">My stickers</button>' +
              '<button class="btn" id="toHome">' + (overCap ? 'All done for today' : 'Back to the trail') + '</button>' +
            '</div>' +
            (overCap ? '<p class="done-cap">That is a good long turn. See you tomorrow!</p>' : '') +
          '</div>' +
        '</div>'
      );
      document.getElementById('toStickers').onclick = screenTreasure;
      document.getElementById('toHome').onclick = function () { if (overCap) session.start = 0; screenHome(); };
    } else {
      screenHome();
    }
    run = null;
  }

  /* ==================================================================
     SCREEN · TREASURE
     ================================================================== */
  function screenTreasure() {
    var grid = C.STICKERS.map(function (s, i) {
      var got = i < S.stickers.length;
      return '<div class="sticker ' + (got ? '' : 'is-locked') + '">' + icon(got ? s : 'lockClosed') + '</div>';
    }).join('');
    nav(
      '<div class="screen screen-treasure">' +
        '<div class="lbar"><button class="iconbtn" id="back" aria-label="Back">' + icon('back') + '</button>' +
          '<h2 class="lbar-title">My Stickers</h2><span class="iconbtn iconbtn--ghost"></span></div>' +
        '<div class="scene">' +
          '<div class="scene-sky"></div>' +
          '<div class="scene-items">' + icon('hdb', 'sc sc-hdb') + icon('tree', 'sc sc-tree') + icon('otter', 'sc sc-otter') + '</div>' +
        '</div>' +
        '<p class="tcount"><b>' + S.stickers.length + '</b> of ' + C.STICKERS.length + ' found</p>' +
        '<div class="stickers">' + grid + '</div>' +
      '</div>'
    );
    document.getElementById('back').onclick = screenHome;
  }

  /* ==================================================================
     SCREEN · GROWN-UPS
     ================================================================== */
  var parentTab = 'progress';

  function screenParent() {
    A.stop();
    nav(
      '<div class="screen screen-parent">' +
        '<div class="pbar-top">' +
          '<button class="iconbtn" id="pback" aria-label="Back">' + icon('back') + '</button>' +
          '<h2>Grown-ups</h2>' +
          '<span class="iconbtn iconbtn--ghost"></span>' +
        '</div>' +
        '<nav class="tabs">' +
          ['progress', 'voice', 'settings'].map(function (t) {
            return '<button class="tab ' + (parentTab === t ? 'is-on' : '') + '" data-tab="' + t + '">' + t + '</button>';
          }).join('') +
        '</nav>' +
        '<div id="ptab"></div>' +
      '</div>'
    );
    document.getElementById('pback').onclick = screenHome;
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.onclick = function () { parentTab = b.dataset.tab; screenParent(); };
    });
    ({ progress: tabProgress, voice: tabVoice, settings: tabSettings })[parentTab]();
  }

  function boxClass(n) { return 'b' + n; }

  function tabProgress() {
    var tr = C.trackables();
    var letters = tr.filter(function (t) { return t.kind === 'letter'; });
    var sight = tr.filter(function (t) { return t.kind === 'sight'; });
    var skills = tr.filter(function (t) { return t.kind === 'skill'; });

    function cellRow(list) {
      return list.map(function (t) {
        var b = SRS.get(t.key);
        var acc = SRS.accuracy(t.key);
        return '<div class="cell ' + boxClass(b.box) + '" title="' + esc(t.label) + ': box ' + b.box + ', ' +
          (acc == null ? 'not seen' : Math.round(acc * 100) + '% of ' + b.seen) + '">' +
          '<span>' + esc(t.label) + '</span></div>';
      }).join('');
    }

    /* struggling = seen at least 3 times, lowest accuracy */
    var struggling = tr.filter(function (t) { return SRS.get(t.key).seen >= 3; })
      .sort(function (a, b) { return SRS.accuracy(a.key) - SRS.accuracy(b.key); })
      .slice(0, 5);

    var recent = S.sessions.slice(-10).reverse();
    var doneCount = Object.keys(S.done).length;
    var stage = C.STAGES.filter(function (s) { return s.built; }).filter(function (s) {
      return stageLessons(s.id).some(function (l) { return !lessonDone(l.id); });
    })[0] || C.STAGES[2];

    document.getElementById('ptab').innerHTML =
      '<div class="panel">' +
        '<div class="kpis">' +
          '<div class="kpi"><small>Lessons finished</small><b>' + doneCount + ' <i>/ ' + C.LESSONS.length + '</i></b></div>' +
          '<div class="kpi"><small>Sounds at box 4+</small><b>' + letters.filter(function (t) { return SRS.get(t.key).box >= 4; }).length + ' <i>/ 26</i></b></div>' +
          '<div class="kpi"><small>Working on</small><b class="kpi--text">' + esc(stage.name) + '</b></div>' +
        '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<h3>Mastery map</h3>' +
        '<p class="hint">Leitner box 0–5. Box 4+ across three separate days is the gate to the next stage.</p>' +
        '<h4>Letter sounds</h4><div class="grid">' + cellRow(letters) + '</div>' +
        '<h4>Sight words</h4><div class="grid grid--wide">' + cellRow(sight) + '</div>' +
        '<h4>Listening skills</h4><div class="grid grid--wide">' + cellRow(skills) + '</div>' +
        '<div class="legend">' + [0, 1, 2, 3, 4, 5].map(function (n) {
          return '<span class="lg"><i class="cell ' + boxClass(n) + '"></i>' + (n === 0 ? 'new' : n) + '</span>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="panel">' +
        '<h3>Practise these away from the screen</h3>' +
        (struggling.length
          ? '<ol class="struggle">' + struggling.map(function (t) {
              var acc = Math.round(SRS.accuracy(t.key) * 100);
              var hint = t.kind === 'letter'
                ? 'Say ' + (C.LETTERS[t.label] ? '&ldquo;' + esc(C.LETTERS[t.label].cue) + '&rdquo; — ' + esc(C.LETTERS[t.label].action) : t.label)
                : 'Point it out on signs and menus';
              return '<li><b>' + esc(t.label) + '</b><span class="acc">' + acc + '%</span><em>' + hint + '</em></li>';
            }).join('') + '</ol>'
          : '<p class="hint">Nothing yet — this fills once an item has been seen three times.</p>') +
      '</div>' +

      '<div class="panel">' +
        '<h3>Recent turns</h3>' +
        (recent.length
          ? '<table class="tbl"><thead><tr><th>When</th><th>Lesson</th><th class="num">Mins</th><th class="num">Score</th></tr></thead><tbody>' +
            recent.map(function (s) {
              var l = C.LESSONS.filter(function (x) { return x.id === s.lesson; })[0];
              return '<tr><td>' + new Date(s.d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</td>' +
                '<td>' + esc(l ? l.name : s.lesson) + '</td>' +
                '<td class="num">' + (s.mins || 0) + '</td>' +
                '<td class="num">' + s.correct + '/' + s.rounds + '</td></tr>';
            }).join('') + '</tbody></table>'
          : '<p class="hint">No turns recorded yet.</p>') +
      '</div>';
  }

  function tabVoice() {
    var can = A.canRecord();
    var letters = Object.keys(C.LETTERS);
    var coreWords = Object.keys(C.WORDS).filter(function (k) { return C.WORDS[k].phonemes; });

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
        '<h3>Pip&rsquo;s voice</h3>' +
        '<p class="hint">Speech synthesis cannot say a clean /t/ or /p/ — it adds a &ldquo;uh&rdquo;, which teaches the child a sound that will not blend. Recording the 26 letter sounds in your own voice removes that problem, and a familiar voice holds attention better. About 10 minutes of work.</p>' +
        '<p class="stat"><b>' + A.recordingCount() + '</b> clips recorded' + (can ? '' : ' · <span class="warn">recording is not available in this browser or view</span>') + '</p>' +
        '<label class="field"><span>Fallback voice</span>' +
          '<select id="voicepick">' +
            '<option value="">Automatic (British English preferred)</option>' +
            A.voices().map(function (v) {
              return '<option value="' + esc(v.name) + '"' + (S.settings.voice === v.name ? ' selected' : '') + '>' + esc(v.name) + ' — ' + esc(v.lang) + '</option>';
            }).join('') +
          '</select>' +
        '</label>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Letter sounds <small>' + letters.filter(function (l) { return A.hasRecording('p:' + l); }).length + '/26</small></h3>' +
        '<div class="vlist">' + letters.map(function (l) {
          return row('p:' + l, l === 'q' ? 'qu' : l, 'as in ' + C.LETTERS[l].keyword);
        }).join('') + '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Words <small>' + coreWords.filter(function (k) { return A.hasRecording('w:' + C.WORDS[k].text); }).length + '/' + coreWords.length + '</small></h3>' +
        '<div class="vlist">' + coreWords.map(function (k) {
          return row('w:' + C.WORDS[k].text, C.WORDS[k].text, C.WORDS[k].sg || '');
        }).join('') + '</div>' +
      '</div>';

    document.getElementById('voicepick').onchange = function () {
      S.settings.voice = this.value; save();
      if (this.value) A.setVoice(this.value);
      A.say('This is how I will sound.');
    };

    var recording = null;
    Array.prototype.forEach.call(document.querySelectorAll('.vrow'), function (rw) {
      var key = rw.dataset.key;
      rw.querySelector('.vplay').onclick = function () {
        A.unlock();
        if (key.indexOf('p:') === 0) A.sayPhoneme(key.slice(2));
        else A.sayWord(key.slice(2));
      };
      rw.querySelector('.vrec').onclick = function () {
        A.unlock();
        if (!can) { toast('This browser will not let the page use the microphone'); return; }
        if (recording === key) {
          A.stopRecording(key).then(function () { toast('Saved'); screenParent(); })
            .catch(function () { toast('Nothing recorded'); recording = null; rw.classList.remove('recording'); });
          recording = null;
          return;
        }
        A.startRecording().then(function () {
          recording = key;
          rw.classList.add('recording');
          toast('Recording — tap the microphone again to stop');
        }).catch(function () { toast('Microphone blocked'); });
      };
      var del = rw.querySelector('.vdel');
      if (del) del.onclick = function () { A.deleteRecording(key).then(screenParent); };
    });
  }

  function tabSettings() {
    document.getElementById('ptab').innerHTML =
      '<div class="panel">' +
        '<h3>Session</h3>' +
        '<label class="field"><span>Soft stop after</span>' +
          '<select id="cap">' + [6, 8, 10, 12, 15, 20].map(function (n) {
            return '<option value="' + n + '"' + (S.settings.cap === n ? ' selected' : '') + '>' + n + ' minutes</option>';
          }).join('') + '</select></label>' +
        '<p class="hint">When the turn runs past this, the end-of-lesson screen says goodbye instead of offering another stop. It never interrupts a lesson in progress.</p>' +
        '<label class="field field--row"><span>Sound effects</span>' +
          '<input type="checkbox" id="sfx"' + (S.settings.sfx ? ' checked' : '') + '></label>' +
        '<label class="field"><span>Speaking speed</span>' +
          '<input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="' + S.settings.rate + '"></label>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Progress backup</h3>' +
        '<p class="hint">Progress lives in this browser. A backup copies it to your Claude account so a lost or wiped device does not cost a year of work. Voice recordings stay on the device — they are too large to copy.</p>' +
        '<div class="btnrow">' +
          '<button class="btn btn--ghost" id="backup">Back up now</button>' +
          '<button class="btn btn--ghost" id="restore">Restore</button>' +
        '</div>' +
        '<p class="hint" id="bstat"></p>' +
      '</div>' +
      '<div class="panel panel--danger">' +
        '<h3>Start over</h3>' +
        '<p class="hint">Clears every box, sticker and finished lesson on this device. Recordings are kept.</p>' +
        '<button class="btn btn--danger" id="reset">Reset all progress</button>' +
      '</div>';

    document.getElementById('cap').onchange = function () { S.settings.cap = +this.value; save(); };
    document.getElementById('sfx').onchange = function () { S.settings.sfx = this.checked; save(); };
    document.getElementById('rate').onchange = function () { S.settings.rate = +this.value; A.rate = +this.value; save(); A.say('Like this.'); };

    document.getElementById('backup').onclick = function () {
      var st = document.getElementById('bstat');
      st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Backup is not available in this view.'; return; }
        return db.doc('progress/main').set({ state: JSON.stringify(S), at: Date.now() })
          .then(function () { st.textContent = 'Backed up ' + new Date().toLocaleString() + '.'; });
      }).catch(function () { st.textContent = 'Backup failed.'; });
    };
    document.getElementById('restore').onclick = function () {
      var st = document.getElementById('bstat');
      st.textContent = 'Working…';
      getDB().then(function (db) {
        if (!db) { st.textContent = 'Backup is not available in this view.'; return; }
        return db.doc('progress/main').get().then(function (d) {
          var raw = d && (d.state || (d.data && d.data.state));
          if (!raw) { st.textContent = 'No backup found.'; return; }
          S = Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(raw));
          save();
          st.textContent = 'Restored.';
          setTimeout(screenParent, 400);
        });
      }).catch(function () { st.textContent = 'Restore failed.'; });
    };
    document.getElementById('reset').onclick = function () {
      if (this.dataset.armed === '1') {
        S = JSON.parse(JSON.stringify(DEFAULTS)); save(); screenHome();
      } else {
        this.dataset.armed = '1';
        this.textContent = 'Tap again to confirm';
      }
    };
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
    screenHome();
  });

  if (REDUCED) document.documentElement.classList.add('reduced');
})();
