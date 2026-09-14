/* audio.js — the voice of the app.
   Priority order for a LETTER SOUND:
     1. a recording made by the grown-up (IndexedDB)
     2. the shipped clip in audio/letters/<key>.mp3 — the sound cut out of a
        real word spoken by a neural voice, so /b/ is the /b/ of `ball` rather
        than a click or a "buh". See tools/make-letter-audio.py.
     3. speech synthesis (last resort; it cannot say a bare phoneme)
   WORDS and whole LINES follow the same order, against audio/speech/*.mp3 —
   every fixed piece of English the app says is recorded in the voice the
   letter clips were cut from, so it never speaks in two voices in one breath
   and never depends on which voices a phone happens to have. Only text the
   app cannot know in advance — a greeting with the child's name in it — falls
   through to the device.
   Sound effects are synthesised with Web Audio, so there are no assets
   to download and nothing to break offline. */
(function () {
  'use strict';

  var DB_NAME = 'pipphonics-audio';
  var STORE = 'clips';

  var A = {
    ctx: null,
    voice: null,
    voiceReady: false,
    db: null,
    have: {},          // key -> true when a recording exists
    urls: {},          // key -> object URL cache
    muted: false,
    rate: 0.85,
    unlocked: false
  };

  /* ---------------- IndexedDB ---------------- */
  function openDB() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) return resolve(null);
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
    });
  }

  function idbGet(key) {
    return new Promise(function (resolve) {
      if (!A.db) return resolve(null);
      try {
        var r = A.db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { resolve(null); };
      } catch (e) { resolve(null); }
    });
  }

  function idbPut(key, blob) {
    return new Promise(function (resolve) {
      if (!A.db) return resolve(false);
      try {
        var tx = A.db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(blob, key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  }

  function idbDel(key) {
    return new Promise(function (resolve) {
      if (!A.db) return resolve(false);
      try {
        var tx = A.db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(key);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  }

  function idbKeys() {
    return new Promise(function (resolve) {
      if (!A.db) return resolve([]);
      try {
        var r = A.db.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys();
        r.onsuccess = function () { resolve(r.result || []); };
        r.onerror = function () { resolve([]); };
      } catch (e) { resolve([]); }
    });
  }

  /* ---------------- voices ---------------- */
  function pickVoice() {
    if (!window.speechSynthesis) return;
    var vs = speechSynthesis.getVoices() || [];
    if (!vs.length) return;
    var pref = ['en-GB', 'en-SG', 'en-AU', 'en-IE', 'en-NZ', 'en'];
    for (var i = 0; i < pref.length; i++) {
      var m = vs.filter(function (v) { return v.lang && v.lang.replace('_', '-').indexOf(pref[i]) === 0; });
      if (m.length) {
        /* prefer a named female/child-friendly voice where one exists */
        var nice = m.filter(function (v) { return /female|samantha|serena|kate|martha|amelie|google uk english female|libby|sonia/i.test(v.name); });
        A.voice = (nice[0] || m[0]);
        A.voiceReady = true;
        return;
      }
    }
    A.voice = vs[0];
    A.voiceReady = true;
  }

  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  A.voices = function () {
    if (!window.speechSynthesis) return [];
    return (speechSynthesis.getVoices() || []).filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf('en') === 0;
    });
  };

  A.setVoice = function (name) {
    var v = A.voices().filter(function (x) { return x.name === name; })[0];
    if (v) { A.voice = v; A.voiceReady = true; }
  };

  /* ---------------- init / unlock ---------------- */
  A.init = function () {
    return openDB().then(function (db) {
      A.db = db;
      return idbKeys();
    }).then(function (keys) {
      keys.forEach(function (k) { A.have[k] = true; });
      return true;
    });
  };

  /* Must be called from a real user gesture — iOS will not make a sound
     before this happens. See docs/PLAN.md §4.2. */
  A.unlock = function () {
    try {
      var C = window.AudioContext || window.webkitAudioContext;
      if (C && !A.ctx) A.ctx = new C();
      if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
      if (A.ctx) {
        var b = A.ctx.createBuffer(1, 1, 22050);
        var s = A.ctx.createBufferSource();
        s.buffer = b; s.connect(A.ctx.destination); s.start(0);
      }
    } catch (e) { /* no Web Audio: sound effects are silent, speech still works */ }
    try {
      if (window.speechSynthesis) {
        var u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        speechSynthesis.speak(u);
      }
    } catch (e) { /* ignore */ }
    /* <audio> is gated separately from Web Audio and from speech synthesis.
       Play one silent frame now, inside the gesture, so the fallback path
       is allowed later. */
    try {
      var sil = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=');
      sil.volume = 0;
      var sp = sil.play();
      if (sp && sp.catch) sp.catch(function () { /* still gated; Web Audio carries us */ });
    } catch (e) { /* ignore */ }
    A.unlocked = true;
  };

  /* ---------------- speech ---------------- */
  var queue = Promise.resolve();

  function speakNow(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (A.muted || !window.speechSynthesis || !text) return resolve();
      var done = false;
      var began = Date.now();
      function finish() { if (!done) { done = true; lastMs = Date.now() - began; resolve(); } }
      try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      var u = new SpeechSynthesisUtterance(text);
      if (A.voice) { u.voice = A.voice; u.lang = A.voice.lang; }
      else { u.lang = 'en-GB'; }
      u.rate = opts.rate || A.rate;
      u.pitch = opts.pitch == null ? 1.1 : opts.pitch;
      u.onend = finish;
      u.onerror = finish;
      speechSynthesis.speak(u);
      /* iOS sometimes never fires onend; never let the app hang on it */
      setTimeout(finish, Math.max(1400, String(text).length * 110) + 400);
    });
  }

  function playBlobKey(key) {
    if (A.muted) return Promise.resolve();
    return idbGet(key).then(function (blob) {
      if (!blob) return;
      if (!A.urls[key]) A.urls[key] = URL.createObjectURL(blob);
      return playCached('rec:' + key, function () {
        return blob.arrayBuffer ? blob.arrayBuffer() : new Response(blob).arrayBuffer();
      }, A.urls[key]);
    });
  }

  /* Everything spoken goes through one queue, so two sounds never overlap.
     `gen` is what makes stop() mean stop: the tail of a sequence that is
     already chained cannot be unchained, so each step checks on its way in
     whether it still belongs to the run that queued it. Without this, tapping
     past a letter card leaves its four keywords playing over the next
     question. */
  var gen = 0;
  function enqueue(fn) {
    var mine = gen;
    function step() { return mine === gen ? fn() : null; }
    queue = queue.then(step, step);
    return queue;
  }

  /* Speak a sentence of instruction. */
  A.say = function (text, opts) {
    return enqueue(function () { return speak(text, opts); });
  };

  /* ---------------- clip playback ----------------
     Everything pre-recorded goes through the AudioContext, which the opening
     tap already unlocked. Playing these through <audio> instead looks fine on
     a desktop and is silently blocked on a phone: <audio> is gated on its own
     user gesture, and a clip started from a timer is not one. */
  var bufCache = {};

  function ensureCtx() {
    try {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor && !A.ctx) A.ctx = new Ctor();
      if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume();
    } catch (e) { /* no Web Audio here */ }
    return A.ctx;
  }

  function decode(arrayBuffer) {
    return new Promise(function (resolve, reject) {
      var ctx = ensureCtx();
      if (!ctx) return reject(new Error('no context'));
      var r = ctx.decodeAudioData(arrayBuffer, resolve, reject);
      if (r && r.then) r.then(resolve, reject);   /* promise form */
    });
  }

  var live = null;      /* the clip playing right now, so stop() can cut it */
  var lastMs = 0;       /* how long the last thing took, for A.gap() */

  function playBuffer(buf) {
    return new Promise(function (resolve) {
      var ctx = ensureCtx();
      if (!ctx) return resolve();
      try {
        var src = ctx.createBufferSource();
        var g = ctx.createGain();
        g.gain.value = 1;
        src.buffer = buf;
        /* The clips are recorded at one speed, so the speaking-speed control
           has to change how fast they are played back. 0.85 is the default and
           means untouched; the range is kept narrow because playing a voice
           slower also drops its pitch. */
        src.playbackRate.value = Math.max(0.85, Math.min(1.15, A.rate / 0.85));
        src.connect(g); g.connect(ctx.destination);
        var done = false;
        var began = Date.now();
        function fin() {
          if (done) return;
          done = true;
          lastMs = Date.now() - began;      /* what A.gap() sizes itself against */
          resolve();
        }
        src.onended = fin;
        live = src;
        src.start(0);
        setTimeout(fin, Math.ceil(buf.duration * 1000 / src.playbackRate.value) + 250);
      } catch (e) { resolve(); }
    });
  }

  /* Last resort when there is no Web Audio at all. */
  function playElement(src) {
    return new Promise(function (resolve) {
      try {
        var el = new Audio(src);
        var done = false;
        function fin() { if (!done) { done = true; resolve(); } }
        el.onended = fin;
        el.onerror = fin;
        var p = el.play();
        if (p && p.catch) p.catch(fin);
        setTimeout(fin, 2000);
      } catch (e) { resolve(); }
    });
  }

  /* Decoded audio is held in memory so a clip plays instantly the second time.
     The 32 letter sounds are small and constantly used, so they stay; the 272
     words and lines are not, and a tablet should not be asked to hold all of
     them decoded at once. */
  var CACHE_CAP = 60;
  var cacheOrder = [];

  function remember(key, buf) {
    bufCache[key] = buf;
    if (key.indexOf('ph:') === 0) return;        // letter clips are pinned
    cacheOrder.push(key);
    while (cacheOrder.length > CACHE_CAP) {
      var old = cacheOrder.shift();
      if (old !== key) delete bufCache[old];
    }
  }

  /* Play a cached clip, decoding it the first time. */
  function playCached(key, getArrayBuffer, fallbackSrc) {
    if (A.muted) return Promise.resolve();
    if (bufCache[key]) return playBuffer(bufCache[key]);
    if (!ensureCtx()) return fallbackSrc ? playElement(fallbackSrc) : Promise.resolve();
    return Promise.resolve()
      .then(getArrayBuffer)
      .then(decode)
      .then(function (buf) { remember(key, buf); return playBuffer(buf); })
      .catch(function () { return fallbackSrc ? playElement(fallbackSrc) : undefined; });
  }

  /* ---------------- letter clips ---------------- */
  A.hasClip = function (letter) {
    return !!(window.LETTER_CLIPS && window.LETTER_CLIPS[letter]);
  };

  /* Every audio URL carries the build's version, for the same reason the
     scripts do: on the first load after a deploy the old service worker is
     still answering, and it answers `a.mp3` from its own cache. A URL it has
     never seen falls through to the network instead, so a new recording is
     heard the first time rather than the third. */
  function v() { return window.ASSET_V ? '?v=' + window.ASSET_V : ''; }

  /* Each letter ships twice: the everyday clip, and a slower reading used the
     first time the card introduces the sound. */
  function clipURL(letter, slow) {
    return 'audio/letters/' + letter + (slow ? '-slow' : '') + '.mp3' + v();
  }

  /* The key a piece of text is filed under: what is left of it once case and
     punctuation are gone. tools/make-speech-audio.py files them the same way,
     so 'Well done!' and 'well done' are one clip. */
  function speechKey(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ').replace(/^ | $/g, '');
  }

  function speechFile(key) {
    var m = window.SPEECH_CLIPS;
    return (m && m[key]) ? 'audio/speech/' + m[key] + '.mp3' + v() : null;
  }

  /* Play a shipped clip if there is one for this text; otherwise say it with
     the device voice. */
  function speak(text, opts) {
    var url = speechFile(speechKey(text));
    if (!url || A.muted) return url ? Promise.resolve() : speakNow(text, opts);
    return playCached('sp:' + url, function () {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('no clip');
        return r.arrayBuffer();
      });
    }, url).catch(function () { return speakNow(text, opts); });
  }

  /* Pull every letter clip in and decode it once, in the background. All 32
     together are smaller than a photograph, and the alternative is a child
     tapping a letter and waiting for a fetch. */
  A.preload = function () {
    var want = [];
    Object.keys(window.LETTER_CLIPS || {}).forEach(function (k) {
      want.push([k, false]);
      want.push([k, true]);
    });
    return want.reduce(function (chain, pair) {
      return chain.then(function () {
        var key = 'ph:' + pair[0] + (pair[1] ? '-slow' : '');
        if (bufCache[key]) return;
        return fetch(clipURL(pair[0], pair[1]))
          .then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
          .then(decode)
          .then(function (buf) { bufCache[key] = buf; })
          .catch(function () { /* the clip will be fetched on demand instead */ });
      });
    }, Promise.resolve());
  };

  /* Speak one letter sound. `slow` asks for the unhurried reading, which the
     letter card uses the first time it introduces the sound. */
  A.sayPhoneme = function (letter, slow) {
    var key = 'p:' + letter;
    return enqueue(function () {
      if (A.have[key]) return playBlobKey(key);      // a grown-up's own recording
      if (A.hasClip(letter)) {
        var url = clipURL(letter, slow);
        return playCached('ph:' + letter + (slow ? '-slow' : ''), function () {
          return fetch(url).then(function (r) {
            if (!r.ok) throw new Error('no clip');
            return r.arrayBuffer();
          });
        }, url);
      }
      var L = window.CONTENT.ALPHABET[letter];
      return speakNow(L ? L.sound : letter, { rate: 0.7, pitch: 1.0 });
    });
  };

  /* Speak a letter's NAME ("ay", "bee"), not its sound. Filed under a key of
     its own: the letter A and the word `a` sound alike, but nothing here
     should rest on that. */
  A.sayLetterName = function (letter) {
    var key = 'n:' + letter;
    return enqueue(function () {
      if (A.have[key]) return playBlobKey(key);
      var url = speechFile('letter:' + letter);
      if (url) {
        return playCached('sp:' + url, function () {
          return fetch(url).then(function (r) {
            if (!r.ok) throw new Error('no clip');
            return r.arrayBuffer();
          });
        }, url);
      }
      return speakNow(letter === 'q' ? 'queue' : letter.toUpperCase(), { rate: 0.7 });
    });
  };

  /* Speak a whole word. */
  A.sayWord = function (word) {
    var key = 'w:' + word;
    return enqueue(function () {
      if (A.have[key]) return playBlobKey(key);
      return speak(word, { rate: 0.75 });
    });
  };

  /* Sound out a word phoneme by phoneme, then say it whole. */
  A.blendWord = function (word, phonemes, onEach) {
    var seq = Promise.resolve();
    phonemes.forEach(function (p, i) {
      seq = seq.then(function () {
        if (onEach) onEach(i);
        return A.sayPhoneme(p);
      }).then(function () { return wait(140); });
    });
    return seq.then(function () {
      if (onEach) onEach(-1);
      return A.sayWord(word);
    });
  };

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  A.wait = wait;

  A.stop = function () {
    gen++;
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    try { if (live) live.stop(0); } catch (e) { /* already finished */ }
    live = null;
    queue = Promise.resolve();
  };

  /* A pause after whatever was just said, as a fraction of how long it took.

     Proportional rather than fixed because the things being spaced are not the
     same size: /m/ is a quarter of a second and `alligator` is nearly a whole
     one, and a gap that suits one crowds the other. The letter card used to
     run its five sounds back to back with no gap at all, which a four-year-old
     hears as one hurried stream — she needs the silence to have a go herself.

     Read at the moment the queue reaches it, so it measures the clip in front
     of it and not whatever was playing when it was scheduled. */
  A.gap = function (fraction) {
    return enqueue(function () {
      var f = fraction == null ? 0.4 : fraction;
      return wait(Math.max(90, Math.min(900, Math.round((lastMs || 350) * f))));
    });
  };

  /* A ticket for the run of audio happening now. A sequence that plays over
     several turns of the event loop — the letter card walking its four
     keywords, the blending of a word — holds one of these and checks it before
     each step: after A.stop() the ticket is stale and the sequence gives up,
     rather than queueing its remaining words on top of the next question. */
  A.epoch = function () { return gen; };

  /* Resolves when everything already asked for has finished playing. The
     lesson runner waits on this before moving on, so a child never hears the
     last question while looking at the next one. */
  A.idle = function () { return enqueue(function () { return null; }); };

  /* ---------------- sound effects ---------------- */
  function tone(freq, start, dur, type, gain) {
    if (!A.ctx || A.muted) return;
    var o = A.ctx.createOscillator();
    var g = A.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, A.ctx.currentTime + start);
    g.gain.setValueAtTime(0.0001, A.ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, A.ctx.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, A.ctx.currentTime + start + dur);
    o.connect(g); g.connect(A.ctx.destination);
    o.start(A.ctx.currentTime + start);
    o.stop(A.ctx.currentTime + start + dur + 0.05);
  }

  A.sfx = function (name) {
    if (!A.ctx || A.muted) return;
    switch (name) {
      case 'correct':                                  // rising major triad
        tone(523.25, 0, 0.18, 'sine', 0.16);
        tone(659.25, 0.09, 0.18, 'sine', 0.16);
        tone(783.99, 0.18, 0.3, 'sine', 0.18);
        break;
      case 'retry':                                    // soft, low, never harsh
        tone(311.13, 0, 0.16, 'sine', 0.12);
        tone(261.63, 0.1, 0.24, 'sine', 0.12);
        break;
      case 'tap':
        tone(880, 0, 0.06, 'triangle', 0.1);
        break;
      case 'pop':
        tone(1046.5, 0, 0.07, 'sine', 0.14);
        tone(1567.98, 0.04, 0.08, 'sine', 0.08);
        break;
      case 'reward':                                   // sticker earned
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
          tone(f, i * 0.085, 0.32, 'sine', 0.15);
        });
        break;
      case 'whoosh':
        tone(330, 0, 0.22, 'triangle', 0.08);
        tone(494, 0.06, 0.2, 'triangle', 0.06);
        break;
    }
  };

  /* ---------------- recording (grown-ups) ---------------- */
  A.canRecord = function () {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  };

  var rec = null, chunks = [], stream = null;

  A.startRecording = function () {
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s;
      chunks = [];
      var mime = '';
      ['audio/webm', 'audio/mp4', 'audio/ogg'].some(function (m) {
        if (window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; return true; }
        return false;
      });
      rec = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s);
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.start();
      return true;
    });
  };

  A.stopRecording = function (key) {
    return new Promise(function (resolve, reject) {
      if (!rec) return reject(new Error('not recording'));
      rec.onstop = function () {
        var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
        rec = null; stream = null;
        if (!blob.size) return reject(new Error('empty'));
        idbPut(key, blob).then(function (ok) {
          if (ok) {
            A.have[key] = true;
            delete bufCache['rec:' + key];
            if (A.urls[key]) { URL.revokeObjectURL(A.urls[key]); delete A.urls[key]; }
            resolve(blob);
          } else reject(new Error('save failed'));
        });
      };
      rec.stop();
    });
  };

  A.deleteRecording = function (key) {
    return idbDel(key).then(function () {
      delete A.have[key];
      delete bufCache['rec:' + key];
      if (A.urls[key]) { URL.revokeObjectURL(A.urls[key]); delete A.urls[key]; }
      return true;
    });
  };

  /* ---------------- generic blob store (the child's photo) ---------------- */
  A.putBlob = function (key, blob) {
    return idbPut(key, blob).then(function (ok) {
      if (ok) { A.have[key] = true; if (A.urls[key]) { URL.revokeObjectURL(A.urls[key]); delete A.urls[key]; } }
      return ok;
    });
  };
  A.blobURL = function (key) {
    if (A.urls[key]) return Promise.resolve(A.urls[key]);
    return idbGet(key).then(function (b) {
      if (!b) return null;
      A.urls[key] = URL.createObjectURL(b);
      return A.urls[key];
    });
  };
  A.delBlob = function (key) { return A.deleteRecording(key); };

  A.hasRecording = function (key) { return !!A.have[key]; };
  A.recordingCount = function () { return Object.keys(A.have).length; };

  window.AUDIO = A;
})();
