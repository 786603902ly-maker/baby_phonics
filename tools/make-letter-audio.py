#!/usr/bin/env python3
"""Generate web/audio/letters/*.mp3 — one clip per letter sound.

Why this exists
---------------
A letter's phonic sound is not its name. `b` is not "bee" and not "buh"; it is
the sound that starts `ball`. Browser speech synthesis cannot say a bare
phoneme at all, and the espeak-ng clips this tool replaces were worse than
nothing for the stops: /b/ was a 50 ms click, /d/ 80 ms, /k/ mostly silence.

So each clip is cut out of a real word, spoken by a neural voice:

  1. synthesise the carrier word (`ball`) with a Piper VITS voice, asking the
     model for its own phoneme/audio alignment — these are the durations the
     decoder actually used, not an estimate made afterwards;
  2. cut the target phoneme out at those boundaries;
  3. shape it for a four-year-old: continuants and vowels are held for about a
     quarter of a second, stops keep a short slice of the following vowel
     because a stop with no release is inaudible;
  4. check it: every clip is measured against the acoustic signature its
     phoneme class must have (see check()), and the build fails if one is off.

Requires: piper-tts, onnx, lameenc, numpy.  Run: python3 tools/make-letter-audio.py
"""
import argparse, io, json, math, os, sys, tarfile, urllib.request, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'web', 'audio', 'letters')
MANIFEST = os.path.join(ROOT, 'web', 'letter-clips.js')
BUILD = os.path.join(ROOT, 'build')

# Piper voices, mirrored by the sherpa-onnx project as GitHub release assets.
VOICE_URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-%s.tar.bz2'
DEFAULT_VOICE = 'en_GB-cori-medium'

# ---------------------------------------------------------------- the sounds
# key      -> carrier word, the espeak phoneme(s) to cut out, and where they sit
#   at   'onset' the word starts with them, 'coda' it ends with them,
#        'nucleus' they are the vowel in the middle
#   kind decides the shaping and the acoustic check
LETTERS = {
    'a':  dict(word='cat',   ph=['a'],        at='nucleus', kind='vowel'),
    'b':  dict(word='ball',  ph=['b'],        at='onset',   kind='stop'),
    'c':  dict(word='cat',   ph=['k'],        at='onset',   kind='stop'),
    'd':  dict(word='dog',   ph=['d'],        at='onset',   kind='stop'),
    'e':  dict(word='egg',   ph=['E'],        at='nucleus', kind='vowel'),
    'f':  dict(word='fish',  ph=['f'],        at='onset',   kind='fric', voiced=False),
    'g':  dict(word='goat',  ph=['g'],        at='onset',   kind='stop'),
    # /h/ is the only sound here with no voicing rule: before a vowel it is
    # that vowel's shape breathed rather than voiced, so it comes out somewhere
    # between the two and the periodicity reading is not meaningful.
    'h':  dict(word='hat',   ph=['h'],        at='onset',   kind='breath'),
    'i':  dict(word='pig',   ph=['I'],        at='nucleus', kind='vowel'),
    'j':  dict(word='jam',   ph=['d', 'Z'],   at='onset',   kind='stop'),
    'k':  dict(word='kite',  ph=['k'],        at='onset',   kind='stop'),
    'l':  dict(word='lamp',  ph=['l'],        at='onset',   kind='liquid'),
    'm':  dict(word='mat',   ph=['m'],        at='onset',   kind='nasal', voiced=True),
    'n':  dict(word='nut',   ph=['n'],        at='onset',   kind='nasal'),
    'o':  dict(word='dog',   ph=['0'],        at='nucleus', kind='vowel'),
    'p':  dict(word='pen',   ph=['p'],        at='onset',   kind='stop'),
    'q':  dict(word='queen', ph=['k', 'w'],   at='onset',   kind='stop'),
    'r':  dict(word='rat',   ph=['r'],        at='onset',   kind='liquid'),
    's':  dict(word='sun',   ph=['s'],        at='onset',   kind='sibilant', voiced=False),
    't':  dict(word='tent',  ph=['t'],        at='onset',   kind='stop'),
    'u':  dict(word='cup',   ph=['V'],        at='nucleus', kind='vowel'),
    'v':  dict(word='van',   ph=['v'],        at='onset',   kind='fric', voiced=True),
    'w':  dict(word='web',   ph=['w'],        at='onset',   kind='glide'),
    'x':  dict(word='box',   ph=['k', 's'],   at='coda',    kind='sibilant', voiced=False),
    'y':  dict(word='yak',   ph=['j'],        at='onset',   kind='glide'),
    'z':  dict(word='zoo',   ph=['z'],        at='onset',   kind='sibilant'),
    # ck only ever ends a word, and a word-final stop is a click with nothing
    # after it to release into. It says exactly /k/, so it is cut from an onset.
    'ck': dict(word='kite',  ph=['k'],        at='onset',   kind='stop'),
    'sh': dict(word='ship',  ph=['S'],        at='onset',   kind='sibilant', voiced=False),
    'ch': dict(word='chip',  ph=['t', 'S'],   at='onset',   kind='stop'),
    'th': dict(word='thin',  ph=['T'],        at='onset',   kind='fric', voiced=False),
    'ng': dict(word='king',  ph=['N'],        at='coda',    kind='nasal'),
    'wh': dict(word='web',   ph=['w'],        at='onset',   kind='glide'),
}

# espeak writes IPA; these are the symbols each key above maps to. Written in
# ASCII in the table so the file stays readable, translated here.
# Some symbols differ between voices, because each was trained against its own
# espeak variant: cori's TRAP vowel comes out as 'a', alba's as 'æ'. Where that
# happens both spellings are listed and either will match.
IPA = {'a': ('a', 'æ'), 'E': ('ɛ', 'e'), 'I': ('ɪ',), '0': ('ɒ', 'ɔ'), 'V': ('ʌ', 'ɐ'),
       'g': ('ɡ', 'g'), 'Z': ('ʒ',), 'S': ('ʃ',), 'T': ('θ',), 'N': ('ŋ',), 'r': ('ɹ', 'r')}
def ipa(sym):
    return IPA.get(sym, (sym,))

# How long the finished clip should be, and how it is shaped.
HOLD = {'vowel': 0.30, 'nasal': 0.28, 'liquid': 0.28, 'fric': 0.28,
        'sibilant': 0.30, 'glide': 0.22, 'breath': 0.22, 'stop': 0.0}
# Stops keep this much of the vowel after the burst — without it there is
# nothing to hear; with more it turns into "buh".
STOP_TAIL = 0.075

# What each phoneme class must look like acoustically. Spectral centroid in Hz,
# and whether the vocal folds should be running.
CHECK = {
    'vowel':    dict(centroid=(300, 2600),  voiced=True),
    'nasal':    dict(centroid=(150, 2000),  voiced=True),
    'liquid':   dict(centroid=(250, 2600),  voiced=True),
    'glide':    dict(centroid=(250, 3000),  voiced=True),
    'fric':     dict(centroid=(1200, 8000), voiced=None),
    'sibilant': dict(centroid=(2000, 9000), voiced=None),
    'breath':   dict(centroid=(400, 5000),  voiced=None),
    'stop':     dict(centroid=(400, 6500),  voiced=None),
}
MIN_MS, MAX_MS = 90, 620
SR_REF = 22050          # every voice here is 22.05 kHz; used by periodicity()


# ---------------------------------------------------------------- the voice
def get_voice(name, speaker=None):
    import onnxruntime
    from piper import PiperVoice
    # VITS samples noise on every run, so without a fixed seed no two builds
    # produce the same clip and the checks below would be a lottery.
    onnxruntime.set_seed(20240613)
    d = os.path.join(BUILD, 'voices', 'vits-piper-' + name)
    model = os.path.join(d, name + '.onnx')
    if not os.path.exists(model):
        os.makedirs(os.path.dirname(d), exist_ok=True)
        url = VOICE_URL % name
        print('downloading %s' % url, file=sys.stderr)
        with urllib.request.urlopen(url) as r:
            blob = r.read()
        with tarfile.open(fileobj=io.BytesIO(blob), mode='r:bz2') as t:
            t.extractall(os.path.join(BUILD, 'voices'))
    return PiperVoice.load(model, model + '.json', include_alignments=True)


def say(voice, text, length_scale):
    """Synthesise one word and return (audio, [(phoneme, start, end), ...])."""
    from piper.config import SynthesisConfig
    cfg = SynthesisConfig(length_scale=length_scale, noise_scale=0.4,
                          noise_w_scale=0.4, normalize_audio=True)
    for chunk in voice.synthesize(text, syn_config=cfg, include_alignments=True):
        if chunk.phoneme_alignments is None:
            raise SystemExit('no alignments — is the onnx package installed?')
        spans, at = [], 0
        for a in chunk.phoneme_alignments:
            spans.append((a.phoneme, at, at + int(a.num_samples)))
            at += int(a.num_samples)
        return chunk.audio_float_array, spans
    raise SystemExit('nothing synthesised for %r' % text)


def locate(spans, want, at):
    """Find the run of spans matching `want`, reading from the right end for a
    coda and the left for an onset. Stress and length marks are not sounds of
    their own; they are skipped, and a length mark is folded into the vowel
    before it."""
    marks = {'ˈ', 'ˌ', 'ː', '^', '$', ' '}
    real = [(i, p) for i, (p, s, e) in enumerate(spans) if p not in marks]
    order = range(len(real) - len(want), -1, -1) if at == 'coda' else range(len(real) - len(want) + 1)
    for k in order:
        if all(p in want[i] for i, (_, p) in enumerate(real[k:k + len(want)])):
            first, last = real[k][0], real[k + len(want) - 1][0]
            # espeak writes the stress mark before the vowel and the model
            # charges part of the vowel to it, so take it with the vowel
            while first - 1 >= 0 and spans[first - 1][0] in ('ˈ', 'ˌ'):
                first -= 1
            # a length mark straight after the last phoneme is part of it
            while last + 1 < len(spans) and spans[last + 1][0] == 'ː':
                last += 1
            nxt = spans[last + 1][2] if last + 1 < len(spans) else spans[last][2]
            return spans[first][1], spans[last][2], nxt
    return None



# ---------------------------------------------------------------- refining
# The model's durations say roughly where a phoneme is, but they are frame
# quantised and they leak: the /f/ of `fish` is given 23 ms when the fricative
# really runs for four times that, and the rest of it is charged to the vowel.
# Cutting on those numbers alone gives a clip that is half /ɪ/ — which is why
# every continuant here is refined against the audio itself. Take the middle of
# the predicted span as the seed, and grow outwards for as long as the sound
# does not change: the frames that match the seed ARE the phoneme.
FRAME, HOP = 512, 128
BANDS = 32


def periodicity(seg):
    """How periodic a frame is: 0 for a hiss, near 1 for a held vowel. This is
    what separates /f/ from the vowel it runs into — they can share a loudness
    and even a spectral tilt, but only one of them has a pitch."""
    w = seg - seg.mean()
    ac = np.correlate(w, w, 'full')[len(w) - 1:]
    lo, hi = int(SR_REF / 400), min(int(SR_REF / 60), len(ac) - 1)
    if hi <= lo or ac[0] <= 0:
        return 0.0
    return float(ac[lo:hi].max() / ac[0])


def frames(a, sr):
    """Per-frame log spectra, mean-removed and unit length, so that comparing
    two frames measures spectral shape and ignores loudness."""
    n = 1 + max(0, (len(a) - FRAME) // HOP)
    if n < 1:
        return np.zeros((0, BANDS), dtype=np.float32), np.zeros(0, dtype=np.float32)
    win = np.hanning(FRAME).astype(np.float32)
    edges = np.linspace(0, FRAME // 2, BANDS + 1).astype(int)
    feats = np.zeros((n, BANDS), dtype=np.float32)
    energy = np.zeros(n, dtype=np.float32)
    voice = np.zeros(n, dtype=np.float32)
    for i in range(n):
        raw = a[i * HOP:i * HOP + FRAME]
        seg = raw * win
        mag = np.abs(np.fft.rfft(seg))
        band = np.array([mag[edges[b]:max(edges[b] + 1, edges[b + 1])].mean() for b in range(BANDS)])
        v = np.log(band + 1e-6)
        v = v - v.mean()
        feats[i] = v / (np.linalg.norm(v) + 1e-9)
        energy[i] = float(np.sqrt((seg ** 2).mean()))
        voice[i] = periodicity(raw)
    return feats, energy, voice


def refine(a, sr, start, end, voiced, grow_left, grow_right, thr=0.72):
    """Return the sample range the phoneme really occupies.

    The seed frame is not simply the middle of the predicted span — for a weak
    fricative the span can be 23 ms and land half inside the vowel, so the
    middle is the wrong frame. Instead the seed is the frame in the search
    window that best fits what this phoneme must be: the most aperiodic one for
    /f/ or /θ/, the most strongly pitched one for /m/ or a vowel. The clip then
    grows out from there while the sound holds still and the voicing agrees."""
    f, e, v = frames(a, sr)
    if not len(f):
        return start, end
    lo = max(0, (start - grow_left) // HOP)
    hi = min(len(f), max(lo + 1, (end + grow_right) // HOP))
    floor = max(2e-3, e.max() * 0.04)
    loud = [i for i in range(lo, hi) if e[i] > floor]
    if not loud:
        return start, end
    if voiced is False:
        mid = min(loud, key=lambda i: v[i])
        ok = lambda i: v[i] < 0.55
    elif voiced is True:
        mid = max(loud, key=lambda i: v[i] * min(1.0, e[i] / (e.max() + 1e-9) + 0.3))
        ok = lambda i: v[i] > 0.45
    else:
        mid = (lo + hi) // 2
        ok = lambda i: True
    seed = f[max(0, mid - 1):mid + 2].mean(axis=0)
    seed = seed / (np.linalg.norm(seed) + 1e-9)
    i = mid
    while i - 1 >= lo and float(f[i - 1] @ seed) > thr and e[i - 1] > floor and ok(i - 1):
        i -= 1
    j = mid
    while j + 1 < hi and float(f[j + 1] @ seed) > thr and e[j + 1] > floor and ok(j + 1):
        j += 1
    return i * HOP, min(len(a), j * HOP + FRAME)


# ---------------------------------------------------------------- shaping
def trim(a, sr, floor=0.02):
    """Drop leading and trailing near-silence, measured in 10 ms windows."""
    win = max(1, int(sr * 0.01))
    n = len(a) // win
    if n < 2:
        return a
    e = np.array([np.abs(a[i * win:(i + 1) * win]).max() for i in range(n)])
    peak = e.max()
    if peak <= 0:
        return a
    keep = np.where(e > max(floor, peak * 0.08))[0]
    if not len(keep):
        return a
    s = max(0, keep[0] - 1) * win
    t = min(n, keep[-1] + 2) * win
    return a[s:t]


def hold(a, sr, target, mirror=False, xfade=0.012):
    """Hold a steady sound for longer by tiling its middle with a crossfade.
    Repeating the whole clip would repeat the onset transition with it, which
    is audible as a stutter; the middle is the part that is actually steady.

    Noise — /f/, /s/, /θ/ — is tiled with every other copy reversed. Splicing
    the same hiss end to end lays a pulse over it at the length of the tile,
    which the ear hears as a flutter; reversing alternate copies leaves the
    spectrum untouched and the seams inaudible."""
    if len(a) >= int(sr * target) or len(a) < int(sr * 0.02):
        return a
    x = min(int(sr * xfade), max(2, len(a) // 4))
    core = a[len(a) // 5: max(len(a) // 5 + 2 * x + 1, 4 * len(a) // 5)]
    out = a.copy()
    guard = 0
    while len(out) < int(sr * target) and guard < 40:
        guard += 1
        tile = core[::-1] if (mirror and guard % 2) else core
        k = min(x, len(tile) // 3, len(out) // 3)
        if k < 2:
            break
        ramp = np.linspace(0, 1, k, dtype=np.float32)
        out[-k:] = out[-k:] * (1 - ramp) + tile[:k] * ramp
        out = np.concatenate([out, tile[k:]])
    return out


def envelope(a, sr, fade_in=0.008, fade_out=0.035):
    n_in, n_out = int(sr * fade_in), int(sr * fade_out)
    a = a.copy()
    if n_in and len(a) > n_in:
        a[:n_in] *= np.linspace(0, 1, n_in, dtype=np.float32)
    if n_out and len(a) > n_out:
        a[-n_out:] *= np.linspace(1, 0, n_out, dtype=np.float32)
    peak = float(np.abs(a).max())
    if peak > 0:
        a = a * (0.89 / peak)
    return a.astype(np.float32)


def carve(audio, sr, spec, spans):
    found = locate(spans, [ipa(p) for p in spec['ph']], spec['at'])
    if not found:
        return None, 'phoneme %s not found in %s' % (spec['ph'], [p for p, _, _ in spans])
    start, end, nxt = found
    kind = spec['kind']

    if kind == 'stop':
        # A stop is a closure and a release: on its own it is a click, and a
        # click is not something a child can copy. Keep the burst and a short
        # slice of what follows — enough to hear, too little to become "buh".
        tail = int(sr * (0.02 if spec['at'] == 'coda' else STOP_TAIL))
        seg = audio[max(0, start - int(sr * 0.005)):min(len(audio), end + tail)]
        seg = trim(seg, sr)
    else:
        voiced = spec.get('voiced', kind in ('vowel', 'nasal', 'liquid', 'glide'))
        s2, e2 = refine(audio, sr, start, end, voiced,
                        grow_left=int(sr * 0.06), grow_right=int(sr * 0.16))
        seg = audio[s2:e2]
        if len(seg) < int(sr * 0.03):        # refinement found nothing usable
            seg = audio[start:end]
        seg = trim(seg, sr)
        cap = int(sr * (HOLD[kind] + 0.12))  # never a drawn-out drone
        if len(seg) > cap:
            off = (len(seg) - cap) // 2
            seg = seg[off:off + cap]
        seg = hold(seg, sr, HOLD[kind], mirror=kind in ('fric', 'sibilant', 'breath'))

    if not len(seg):
        return None, 'empty segment'
    return envelope(seg, sr), None


# ---------------------------------------------------------------- checking
def measure(a, sr):
    n = len(a)
    spec = np.abs(np.fft.rfft(a * np.hanning(n)))
    freq = np.fft.rfftfreq(n, 1.0 / sr)
    centroid = float((spec * freq).sum() / (spec.sum() + 1e-9))
    # voicing: how periodic is the loudest 40 ms, over pitch lags 60-400 Hz
    w = a[max(0, n // 2 - int(sr * 0.02)): n // 2 + int(sr * 0.02)]
    w = w - w.mean()
    ac = np.correlate(w, w, 'full')[len(w) - 1:]
    lo, hi = int(sr / 400), min(int(sr / 60), len(ac) - 1)
    voiced = float(ac[lo:hi].max() / (ac[0] + 1e-9)) if hi > lo else 0.0
    rms = float(np.sqrt((a ** 2).mean()))
    return dict(ms=1000.0 * n / sr, centroid=centroid, voicing=voiced, rms=rms)


def check(key, kind, m, voiced=None):
    want = dict(CHECK[kind])
    if voiced is not None:
        want['voiced'] = voiced
    bad = []
    if not (MIN_MS <= m['ms'] <= MAX_MS):
        bad.append('length %.0f ms outside %d-%d' % (m['ms'], MIN_MS, MAX_MS))
    lo, hi = want['centroid']
    if not (lo <= m['centroid'] <= hi):
        bad.append('centroid %.0f Hz outside %d-%d' % (m['centroid'], lo, hi))
    if want['voiced'] is True and m['voicing'] < 0.30:
        bad.append('should be voiced, periodicity %.2f' % m['voicing'])
    if want['voiced'] is False and m['voicing'] > 0.55:
        bad.append('should be voiceless, periodicity %.2f' % m['voicing'])
    if m['rms'] < 0.04:
        bad.append('too quiet, rms %.3f' % m['rms'])
    return bad


# ---------------------------------------------------------------- output
def to_mp3(a, sr, kbps):
    import lameenc
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps)
    enc.set_in_sample_rate(sr)
    enc.set_channels(1)
    enc.set_quality(2)
    pcm = np.clip(a, -1, 1)
    pcm = (pcm * 32767).astype('<i2').tobytes()
    return bytes(enc.encode(pcm)) + bytes(enc.flush())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default=DEFAULT_VOICE)
    ap.add_argument('--speaker', type=int, default=None)
    ap.add_argument('--length-scale', type=float, default=1.15)
    ap.add_argument('--kbps', type=int, default=64)
    ap.add_argument('--dry-run', action='store_true', help='measure only, write nothing')
    args = ap.parse_args()

    voice = get_voice(args.voice)
    sr = voice.config.sample_rate
    if not args.dry_run:
        os.makedirs(OUT, exist_ok=True)

    manifest, failures, total = {}, [], 0
    for key in sorted(LETTERS):
        spec = LETTERS[key]
        audio, spans = say(voice, spec['word'], args.length_scale)
        clip, err = carve(audio, sr, spec, spans)
        if clip is None:
            failures.append('%s: %s' % (key, err))
            print('%-3s FAIL  %s' % (key, err))
            continue
        m = measure(clip, sr)
        bad = check(key, spec['kind'], m, spec.get('voiced'))
        mp3 = to_mp3(clip, sr, args.kbps)
        total += len(mp3)
        if not args.dry_run:
            with open(os.path.join(OUT, key + '.mp3'), 'wb') as f:
                f.write(mp3)
        manifest[key] = dict(word=spec['word'], ms=round(m['ms']))
        print('%-3s %-6s %-6s %4.0f ms  centroid %5.0f Hz  voicing %.2f  %5d B  %s'
              % (key, spec['word'], spec['kind'], m['ms'], m['centroid'], m['voicing'],
                 len(mp3), '; '.join(bad) if bad else 'ok'))
        if bad:
            failures.append('%s (%s): %s' % (key, spec['kind'], '; '.join(bad)))

    print('\n%d clips, %.0f KB total' % (len(manifest), total / 1024))
    if failures:
        print('\nFAILED %d:' % len(failures))
        for f in failures:
            print('  ' + f)
        return 1
    if not args.dry_run:
        with open(MANIFEST, 'w') as f:
            f.write('/* letter-clips.js — GENERATED by tools/make-letter-audio.py. Do not edit.\n'
                    '   Which letter sounds ship as audio, and the word each one was cut out\n'
                    '   of. The clips themselves are audio/letters/<key>.mp3.\n'
                    '   Voice: %s (Piper), trained on public-domain LibriVox recordings. */\n'
                    % args.voice)
            f.write('window.LETTER_CLIPS = {\n')
            for k in sorted(manifest):
                f.write("  '%s': { word: '%s', ms: %d },\n"
                        % (k, manifest[k]['word'], manifest[k]['ms']))
            f.write('};\n')
        print('wrote', MANIFEST)
    return 0


if __name__ == '__main__':
    sys.exit(main())
