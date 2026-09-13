#!/usr/bin/env python3
"""Generate web/audio/speech/*.mp3 — every word and line the app says, in one voice.

Why this exists
---------------
The letter sounds come from tools/make-letter-audio.py and are cut out of real
words. Everything else — `apple`, `The cat sat on the mat.`, `Well done!` — was
left to the device's own speech synthesis, which meant the app spoke in two
voices in the same breath ("apple" in one, "Well done!" in another) and in a
different pair of voices on every phone. Some devices have no British English
voice at all, and read `ax` and `durian` accordingly.

So all of it is recorded here, with the same voice the letter clips were cut
from. What the app cannot know in advance — a greeting with the child's name in
it — still falls back to the device voice.

The text comes from tools/speech-texts.mjs, which reads content.js and the
A.say() literals in app.js rather than a list kept by hand.

Requires: piper-tts, onnx, lameenc, numpy.  Run: python3 tools/make-speech-audio.py
"""
import argparse, hashlib, json, os, re, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module
letters = import_module('make-letter-audio')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'web', 'audio', 'speech')
MANIFEST = os.path.join(ROOT, 'web', 'speech-clips.js')
TEXTS = os.path.join(ROOT, 'build', 'speech.json')

# A word on its own is read a little slower than the same word in a sentence.
WORD_SCALE, LINE_SCALE = 1.18, 1.05

# A single short word is out of distribution for a voice trained on read
# sentences: ask this one for "and" on its own and it produces five seconds of
# mumbling, ask it for "to" and it produces eighty milliseconds. So a word is
# spoken inside a frame and cut back out at the word boundary the model itself
# reports. Phrase-final is deliberate — it is the citation form, the way you
# would say the word if a child asked you what it was.
# A word ending in a voiceless stop has nothing to release into at the end of a
# phrase — `up` comes out as 130 ms with the /p/ swallowed — so those are taken
# from the second frame instead, where the word is followed by another.
FRAME_TEXT = 'The word is %s.'
FRAME_MID = 'Say %s once more.'
WORD_MS = (140, 1800)
LINE_MS = (400, 9000)
TRIES = 6              # the model samples noise; a bad draw is retried, not shipped

# Words the app writes one way and says another.
SPOKEN = {'i': 'I'}

# `a` on its own is the letter name, /eɪ/ — espeak gives it that and it is not
# wrong, it is just not the word. In running text the article is /ə/, which is
# how it is read in `A cat sat on a mat.`, so it is taken from a frame where it
# stays unstressed and then held: a schwa cut out of fluent speech is too brief
# on its own to be a word a child can hear.
# In fluent speech the article is compressed to about seventy milliseconds,
# which is too short to cut and hand to a child as a word. So it is taken from
# somewhere the same sound is unhurried: the end of `banana`, which is a word
# she already knows, and held to a fifth of a second.
OVERRIDE = {'a': dict(from_word='banana', phoneme='ə', hold=0.20, floor_ms=150)}


def key(text):
    """The lookup the page uses: what is left of the text once case and
    punctuation are gone. app.js normalises the same way."""
    t = re.sub(r"[^a-z0-9' ]+", ' ', text.lower())
    return re.sub(r'\s+', ' ', t).strip()


def filename(k):
    """Words keep their own name so the directory can be read; lines are
    hashed, because a filename cannot hold a sentence."""
    if k.startswith('letter:'):
        return 'name-' + k[7:]
    if re.fullmatch(r"[a-z0-9'-]+", k):
        return k.replace("'", '')
    return 'l' + hashlib.sha1(k.encode()).hexdigest()[:11]


def seed(k, attempt):
    """The model samples noise, and a shared stream would mean that changing one
    word rerolled every word after it. Seed each take from its own text."""
    import onnxruntime
    h = hashlib.sha1(('%s#%d' % (k, attempt)).encode()).hexdigest()[:8]
    onnxruntime.set_seed(int(h, 16) & 0x7fffffff)


def synth(voice, text, scale):
    from piper.config import SynthesisConfig
    cfg = SynthesisConfig(length_scale=scale, noise_scale=0.4, noise_w_scale=0.4,
                          normalize_audio=True)
    parts = [c.audio_float_array for c in voice.synthesize(text, syn_config=cfg)]
    if not parts:
        return None
    return np.concatenate(parts).astype(np.float32)


def groups_of(spans):
    """Split the frame's alignment into one span range per spoken word."""
    out, start = [], None
    for p, a, b in spans:
        if p == '^':
            start = b
        elif p == ' ':
            out.append((start, a))
            start = b
        elif p == '$':
            out.append((start, a))
            start = None
    if start is not None:
        out.append((start, spans[-1][2]))
    return out


def word_clip(voice, text, frame=None, index=None):
    """Say the word inside a frame and cut it out again.

    Default: the frame ends with the word, and the cut runs to the end of the
    audio so the final release and its decay come with it. With `index`, the
    word sits inside the frame instead and only its own span is taken — needed
    for a word whose sound depends on being unstressed."""
    audio, spans = letters.say(voice, (frame or FRAME_TEXT) % text, LINE_SCALE)
    # how many espeak words the target is: `hot dog` and `yo-yo` are two
    n = 1 + voice.phonemize(text)[0].count(' ')
    words = groups_of(spans)
    if len(words) < n:
        return None
    if index is None:
        return audio[words[-n][0]:]
    if index + n > len(words):
        return None
    return audio[words[index][0]:words[index + n - 1][1]]


def phoneme_clip(voice, carrier, phoneme):
    """Cut one phoneme out of a carrier word — the same trick the letter clips
    use, for a sound no frame will give at a usable length."""
    audio, spans = letters.say(voice, FRAME_TEXT % carrier, LINE_SCALE)
    hits = [i for i, (p, _, _) in enumerate(spans) if p == phoneme]
    if not hits:
        return None
    _, a, b = spans[hits[-1]]
    return audio[a:b]


def shape(a, sr, hold=None):
    a = letters.trim(a, sr, floor=0.008)
    if hold:
        a = letters.hold(a, sr, hold)
    return letters.envelope(a, sr, fade_in=0.006, fade_out=0.03)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default=letters.DEFAULT_VOICE)
    ap.add_argument('--kbps', type=int, default=48)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--show-phonemes', action='store_true',
                    help='print what espeak makes of each word, to check the odd ones')
    args = ap.parse_args()

    os.makedirs(os.path.dirname(TEXTS), exist_ok=True)
    with open(TEXTS, 'w') as f:
        subprocess.run(['node', os.path.join(HERE, 'speech-texts.mjs')], stdout=f, check=True)
    spec = json.load(open(TEXTS))

    voice = letters.get_voice(args.voice)
    sr = voice.config.sample_rate
    if not args.dry_run:
        os.makedirs(OUT, exist_ok=True)

    jobs = []
    for w in spec['words']:
        jobs.append((key(w), SPOKEN.get(key(w), w), True, WORD_SCALE))
    # A letter's NAME gets a key of its own. "A" the letter and "a" the word
    # happen to sound the same, but nothing should depend on that.
    for letter, spoken in sorted(spec['names'].items()):
        jobs.append(('letter:' + letter, spoken, True, WORD_SCALE))
    for l in spec['lines']:
        jobs.append((key(l), l, False, LINE_SCALE))

    seen, manifest, failures, total, seconds = {}, {}, [], 0, 0.0
    for k, text, is_word, scale in jobs:
        if not k or k in seen:
            continue
        seen[k] = True
        # Every clip is drawn from the model with noise, so a poor draw is a
        # poor draw and not a fact about the word: try again, alternating the
        # frame, and keep the first take that measures like real speech.
        over = OVERRIDE.get(k, {})
        lo, hi = WORD_MS if is_word else LINE_MS
        lo = over.get('floor_ms', lo)
        best, bad = None, ['nothing synthesised']
        for attempt in range(TRIES):
            seed(k, attempt)
            if over.get('from_word'):
                raw = phoneme_clip(voice, over['from_word'], over['phoneme'])
            elif is_word:
                raw = word_clip(voice, text,
                                frame=FRAME_MID if attempt % 2 else FRAME_TEXT,
                                index=1 if attempt % 2 else None)
            else:
                raw = synth(voice, text, scale)
            if raw is None or not len(raw):
                continue
            take = shape(raw, sr, over.get('hold'))
            ms = 1000.0 * len(take) / sr
            rms = float(np.sqrt((take ** 2).mean()))
            why = []
            if not (lo <= ms <= hi):
                why.append('length %.0f ms outside %d-%d' % (ms, lo, hi))
            if rms < 0.02:
                why.append('too quiet, rms %.3f' % rms)
            if best is None or (len(why) < len(bad)):
                best, bad = take, why
            if not why:
                break
        if best is None:
            failures.append('%r: nothing synthesised' % text)
            continue
        clip, ms = best, 1000.0 * len(best) / sr
        name = filename(k)
        if name in manifest.values():
            bad.append('filename %s already taken' % name)
        mp3 = letters.to_mp3(clip, sr, args.kbps)
        total += len(mp3)
        seconds += ms / 1000.0
        if not args.dry_run:
            with open(os.path.join(OUT, name + '.mp3'), 'wb') as f:
                f.write(mp3)
        manifest[k] = name
        if args.show_phonemes and is_word:
            print('%-14s %-14s %s' % (text, name, ' '.join(voice.phonemize(text)[0])))
        if bad:
            failures.append('%r: %s' % (text, '; '.join(bad)))

    print('\n%d clips, %.0f s of speech, %.0f KB at %d kbps'
          % (len(manifest), seconds, total / 1024, args.kbps))
    if failures:
        print('\nFAILED %d:' % len(failures))
        for f in failures:
            print('  ' + f)
        return 1
    if not args.dry_run:
        with open(MANIFEST, 'w') as f:
            f.write('/* speech-clips.js — GENERATED by tools/make-speech-audio.py. Do not edit.\n'
                    '   Every word and line the app says, keyed by the text with case and\n'
                    '   punctuation stripped, pointing at audio/speech/<name>.mp3.\n'
                    '   Voice: %s (Piper), the same one the letter clips were cut from. */\n'
                    % args.voice)
            f.write('window.SPEECH_CLIPS = {\n')
            for k in sorted(manifest):
                f.write("  '%s': '%s',\n" % (k.replace("'", "\\'"), manifest[k]))
            f.write('};\n')
        print('wrote', MANIFEST)
    return 0


if __name__ == '__main__':
    sys.exit(main())
