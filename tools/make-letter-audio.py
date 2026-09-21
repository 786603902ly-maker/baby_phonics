#!/usr/bin/env python3
"""Generate web/audio/letters/*.mp3 — one clip per letter sound.

Why this exists
---------------
A letter's phonic sound is not its name. `b` is not "bee" and not "buh"; it is
the sound that starts `ball`. Browser speech synthesis cannot say a bare
phoneme at all, and the espeak-ng clips this tool first replaced were worse
than nothing for the stops: /b/ was a 50 ms click, /d/ 80 ms, /k/ mostly
silence.

Where the sounds come from now
------------------------------
Two routes, and the first one is the one that matters.

**Recorded.** The 26 single-letter sounds are recordings of a reading teacher
saying each phoneme on its own — no carrier word, no synthesis, no cutting.
They live in audio-src/letters/ and this tool only trims, levels and shapes
them (see build_recorded). Everything a synthesiser had to be argued into
doing, a person does without being asked: /z/ arrives with a voice bar AND
frication (86% of its power below 1 kHz at periodicity 0.75), which is the
combination this project spent three rounds failing to get out of a model.

**Synthesised.** Only the four digraphs with no recording — sh, ch, th, ng —
are still built the old way, by cutting the phoneme out of a carrier word
spoken by a Piper VITS voice:

  1. synthesise the carrier word (`ball`) with a Piper VITS voice, asking the
     model for its own phoneme/audio alignment — these are the durations the
     decoder actually used, not an estimate made afterwards;
  2. cut the target phoneme out at those boundaries;
  3. shape it for a four-year-old: continuants and vowels are held for about a
     quarter of a second, stops keep a short slice of the following vowel
     because a stop with no release is inaudible;
  4. check it: every clip is measured against the acoustic signature its
     phoneme class must have (see check()), and the build fails if one is off.

ck and wh have no recording of their own and need none: ck is exactly /k/ and
wh, in this accent, is exactly /w/, so both reuse the recording of the letter
they sound like.

Requires: lameenc, numpy, imageio-ffmpeg for the recorded route; piper-tts and
onnx as well if the four synthesised digraphs are being rebuilt.
Run: python3 tools/make-letter-audio.py
"""
import argparse, hashlib, io, itertools, json, math, os, subprocess, sys, tarfile, \
       urllib.request, wave
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
    # A fricative at the end of a word runs several times longer than at the
    # start and is the same sound, so these may be cut from either. /l/ and /r/
    # may not: English coda /l/ is dark, and coda /r/ is not said at all here.
    'f':  dict(word='fish',  ph=['f'],        at='onset',   kind='fric', voiced=False,
               alts=[('safe', 'coda'), ('stuff', 'coda'), ('wolf', 'coda'),
                     ('leaf', 'coda'), ('cliff', 'coda')]),
    'g':  dict(word='goat',  ph=['g'],        at='onset',   kind='stop'),
    # /h/ is the only sound here with no voicing rule: before a vowel it is
    # that vowel's shape breathed rather than voiced, so it comes out somewhere
    # between the two and the periodicity reading is not meaningful.
    'h':  dict(word='hat',   ph=['h'],        at='onset',   kind='breath',
               alts=[('horse', 'onset'), ('house', 'onset')]),
    'i':  dict(word='pig',   ph=['I'],        at='nucleus', kind='vowel'),
    'j':  dict(word='jam',   ph=['d', 'Z'],   at='onset',   kind='stop'),
    'k':  dict(word='kite',  ph=['k'],        at='onset',   kind='stop'),
    'l':  dict(word='lamp',  ph=['l'],        at='onset',   kind='liquid',
               alts=[('lion', 'onset'), ('leaf', 'onset')]),
    'm':  dict(word='mat',   ph=['m'],        at='onset',   kind='nasal', voiced=True,
               alts=[('thumb', 'coda'), ('ham', 'coda')]),
    'n':  dict(word='nut',   ph=['n'],        at='onset',   kind='nasal',
               alts=[('sun', 'coda'), ('van', 'coda')]),
    'o':  dict(word='dog',   ph=['0'],        at='nucleus', kind='vowel'),
    'p':  dict(word='pen',   ph=['p'],        at='onset',   kind='stop'),
    'q':  dict(word='queen', ph=['k', 'w'],   at='onset',   kind='stop'),
    'r':  dict(word='rat',   ph=['r'],        at='onset',   kind='liquid',
               alts=[('rose', 'onset'), ('rabbit', 'onset')]),
    's':  dict(word='sun',   ph=['s'],        at='onset',   kind='sibilant', voiced=False,
               alts=[('bus', 'coda'), ('six', 'coda')]),
    't':  dict(word='tent',  ph=['t'],        at='onset',   kind='stop'),
    'u':  dict(word='cup',   ph=['V'],        at='nucleus', kind='vowel'),
    'v':  dict(word='van',   ph=['v'],        at='onset',   kind='fric', voiced='buzz',
               alts=[('five', 'coda')]),
    'w':  dict(word='web',   ph=['w'],        at='onset',   kind='glide'),
    'x':  dict(word='box',   ph=['k', 's'],   at='coda',    kind='sibilant', voiced=False),
    'y':  dict(word='yak',   ph=['j'],        at='onset',   kind='glide'),
    # /z/ is frication AND a pitch at once. Seeding on the most periodic frame
    # lands in the vowel; on the least, in the devoiced start of the word, which
    # is why this used to come out as a second /s/ — a child cannot learn z from
    # a clip that measures like s.
    'z':  dict(word='zoo',   ph=['z'],        at='onset',   kind='sibilant', voiced='buzz',
               alts=[('zebra', 'onset'), ('roses', 'onset'), ('lazy', 'onset'),
                     ('jazz', 'coda'), ('buzz', 'coda'), ('fizz', 'coda')]),
    # ck only ever ends a word, and a word-final stop is a click with nothing
    # after it to release into. It says exactly /k/, so it is cut from an onset.
    'ck': dict(word='kite',  ph=['k'],        at='onset',   kind='stop'),
    'sh': dict(word='ship',  ph=['S'],        at='onset',   kind='sibilant', voiced=False,
               alts=[('fish', 'coda')]),
    'ch': dict(word='chip',  ph=['t', 'S'],   at='onset',   kind='stop'),
    'th': dict(word='thin',  ph=['T'],        at='onset',   kind='fric', voiced=False,
               alts=[('teeth', 'coda'), ('thumb', 'onset')]),
    # /ŋ/ only ever ends a word, so every carrier is a coda one; the search
    # needs several to find a draw long enough to use as it stands.
    'ng': dict(word='king',  ph=['N'],        at='coda',    kind='nasal',
               alts=[('ring', 'coda'), ('song', 'coda'), ('wing', 'coda'),
                     ('sing', 'coda'), ('long', 'coda')]),
    'wh': dict(word='web',   ph=['w'],        at='onset',   kind='glide'),
}

# ------------------------------------------------- the vowel teams (Level 5)
# Two or three letters that spell one vowel sound. There are no recordings of
# these — audio-src/ is a single-letter set — so every one is cut out of a
# carrier word, the route the four consonant digraphs already take.
#
# They split into two kinds, and the difference is not cosmetic:
#
#   a LONG VOWEL (/i:/, /u:/, /a:/, /o:/, /3:/) is one steady mouth position
#   held. It behaves exactly like the short vowels above, so it is `vowel`:
#   it may be held by tiling its middle, because its middle is all the same.
#
#   a DIPHTHONG (/ei/, /ai/, /oi/, /au/, /@u/, /I@/, /e@/) is a MOVEMENT from
#   one vowel to another. Tiling its middle would repeat the middle of the
#   glide, and cropping the middle out would remove the two ends the ear
#   identifies it by — /ei/ without its start and finish is neither /e/ nor
#   /i/, it is a smear. So a diphthong is never tiled and never centre
#   cropped: the search has to find a take that is already long enough, which
#   is what `diphthong` means below.
#
# `label` is what the clip is filed as and what the card must print. The
# length mark belongs in it (/i:/ is not /i/) but not in `ph`, because espeak
# emits the mark as a span of its own and locate() folds it in.
TEAMS = {
    'ai':  dict(word='rain',  ph=['e', 'ɪ'], at='nucleus', kind='diphthong', label='/eɪ/',
                alts=[('train', 'nucleus'), ('snail', 'nucleus'), ('day', 'coda'),
                      ('cake', 'nucleus'), ('gate', 'nucleus')]),
    'ee':  dict(word='feet',  ph=['i'],      at='nucleus', kind='vowel', label='/iː/',
                alts=[('tree', 'coda'), ('bee', 'coda'), ('sea', 'coda'),
                      ('bean', 'nucleus'), ('green', 'nucleus')]),
    'oa':  dict(word='boat',  ph=['ə', 'ʊ'], at='nucleus', kind='diphthong', label='/əʊ/',
                alts=[('coat', 'nucleus'), ('road', 'nucleus'), ('snow', 'coda'),
                      ('goat', 'nucleus'), ('bone', 'nucleus')]),
    'igh': dict(word='night', ph=['a', 'ɪ'], at='nucleus', kind='diphthong', label='/aɪ/',
                alts=[('light', 'nucleus'), ('pie', 'coda'), ('tie', 'coda'),
                      ('sky', 'coda'), ('bike', 'nucleus')]),
    'oo':  dict(word='moon',  ph=['u'],      at='nucleus', kind='vowel', label='/uː/',
                alts=[('spoon', 'nucleus'), ('pool', 'nucleus'), ('zoo', 'coda'),
                      ('boot', 'nucleus'), ('food', 'nucleus')]),
    'uu':  dict(word='book',  ph=['ʊ'],      at='nucleus', kind='vowel', label='/ʊ/',
                alts=[('cook', 'nucleus'), ('foot', 'nucleus'), ('hook', 'nucleus'),
                      ('wood', 'nucleus'), ('good', 'nucleus')]),
    'ou':  dict(word='cloud', ph=['a', 'ʊ'], at='nucleus', kind='diphthong', label='/aʊ/',
                alts=[('cow', 'coda'), ('owl', 'onset'), ('town', 'nucleus'),
                      ('house', 'nucleus'), ('mouse', 'nucleus')]),
    'oi':  dict(word='coin',  ph=['ɔ', 'ɪ'], at='nucleus', kind='diphthong', label='/ɔɪ/',
                alts=[('boy', 'coda'), ('toy', 'coda'), ('oil', 'onset'),
                      ('soil', 'nucleus'), ('join', 'nucleus')]),
    'ar':  dict(word='car',   ph=['ɑ'],      at='coda',    kind='vowel', label='/ɑː/',
                alts=[('star', 'coda'), ('jar', 'coda'), ('farm', 'nucleus'),
                      ('arm', 'onset'), ('park', 'nucleus')]),
    'or':  dict(word='corn',  ph=['ɔ'],      at='nucleus', kind='vowel', label='/ɔː/',
                alts=[('fork', 'nucleus'), ('saw', 'coda'), ('claw', 'coda'),
                      ('paw', 'coda'), ('horse', 'nucleus')]),
    'er':  dict(word='bird',  ph=['ɜ'],      at='nucleus', kind='vowel', label='/ɜː/',
                alts=[('girl', 'nucleus'), ('shirt', 'nucleus'), ('nurse', 'nucleus'),
                      ('fern', 'nucleus'), ('her', 'nucleus')]),
    'air': dict(word='hair',  ph=['e', 'ə'], at='coda',    kind='diphthong', label='/eə/',
                alts=[('chair', 'coda'), ('pair', 'coda'), ('care', 'coda'),
                      ('bear', 'coda')]),
    'ear': dict(word='deer',  ph=['i', 'ə'], at='coda',    kind='diphthong', label='/ɪə/',
                alts=[('ear', 'onset'), ('near', 'coda'), ('beard', 'nucleus'),
                      ('year', 'coda')]),
}
LETTERS.update(TEAMS)

# espeak writes IPA; these are the symbols each key above maps to. Written in
# ASCII in the table so the file stays readable, translated here.
# Some symbols differ between voices, because each was trained against its own
# espeak variant: cori's TRAP vowel comes out as 'a', alba's as 'æ'. Where that
# happens both spellings are listed and either will match.
# The first spelling is the one printed on the letter card, because it is also
# what the manifest labels the clip with and the two must agree; the rest are
# the other spellings espeak may hand back for the same sound.
IPA = {'a': ('æ', 'a'), 'E': ('e', 'ɛ'), 'I': ('ɪ',), '0': ('ɒ', 'ɔ'), 'V': ('ʌ', 'ɐ'),
       'g': ('ɡ', 'g'), 'Z': ('ʒ',), 'S': ('ʃ',), 'T': ('θ',), 'N': ('ŋ',), 'r': ('r', 'ɹ')}
def ipa(sym):
    return IPA.get(sym, (sym,))

# How long the finished clip should be, and how it is shaped. These are what
# the search below aims for by slowing the carrier down, not by repeating a
# fragment: /h/ is a puff of breath and cannot be held for a quarter of a
# second however much you want it to.
HOLD = {'vowel': 0.30, 'nasal': 0.26, 'liquid': 0.26, 'fric': 0.24,
        'sibilant': 0.28, 'glide': 0.22, 'breath': 0.16, 'stop': 0.0,
        # A diphthong is not held: it is already a movement, and the only
        # thing tiling can repeat is the middle of that movement. It ships
        # at whatever length the model gave it, capped in carve().
        'diphthong': 0.0}

# Ask the model for the carrier word at these speeds. A phoneme is only as long
# as the model makes it, and at 1.15 the /f/ of `fish` is forty milliseconds —
# tiling that up to a quarter of a second is what a child heard as a wobble.
SCALES = (1.15, 1.6, 2.2, 3.0, 4.0, 5.0)

# A voiced fricative is a short sound — the voice and the friction fight each
# other, and English does not hold /v/ or /z/ the way it holds /s/. The longest
# clean take of either from this voice is about 165 ms, so asking for 280 was
# asking for the difference to be padded with repeats. These are held less.
HOLD_OVERRIDE = {'v': 0.18, 'z': 0.18}

# How much of the finished clip may be the same fragment laid end to end. Above
# about 1.5 the repeat is audible as a flutter, which is worse than a short clip.
MAX_TILES = 1.55
# Stops keep this much of the vowel after the burst — without it there is
# nothing to hear; with more it turns into "buh".
STOP_TAIL = 0.075

# The letter card says the sound once, unhurried, before it starts on the four
# words. That first time is a demonstration, so it is cut from a slower reading
# of the same word and held for longer — a real slow take, not the fast one
# played back at a lower speed, which would drop the pitch with it.
SLOW = 1.35

# What each phoneme class must look like acoustically. Spectral centroid in Hz,
# and whether the vocal folds should be running.
# What each phoneme class must look like acoustically. Spectral centroid in Hz,
# and how strongly the vocal folds must be running.
#
# The voicing floors are deliberately high for the sounds that are nothing
# without voice. /l/, /r/ and /w/ ARE voice shaped by the mouth: a take that
# measures 0.4 is a whisper of one, and letting it through is how the search
# came back with a thin /w/ when a full one was available from `web`. The
# floors are what make the search keep looking.
# What each phoneme class must be, in terms of where its power sits: the
# fraction below 1 kHz, and the fraction above 3 kHz. Every figure here was set
# by measuring the letters that sounded right and checking that it rejects the
# ones that did not:
#
#   /f/ measured 86% below 1 kHz and 11% above 3 kHz, where /θ/ — the same
#   class, and correct — is 0% and 99%. That is not a voiceless fricative, it
#   is a vowel tail with a little hiss on it, and it is why f buzzed.
#   /v/ measured 100% below 1 kHz and 0% above 3: a hum with no friction at all.
#   /z/ measured 0% below 1 kHz: no voice bar, so it was simply /s/ again.
#   /l/ measured 82% below 1 kHz where /r/, correct, is 92%.
#
# `ideal` is what the search aims at. It does not reject anything; it decides
# which of the takes that pass is the one to keep.
CHECK = {
    'vowel':    dict(centroid=(300, 2600),  voiced=True,  voiced_min=0.60,
                     lo=(0.60, 1.00), hi=(0.00, 0.06), ideal=dict(lo=0.90)),
    'nasal':    dict(centroid=(150, 1900),  voiced=True,  voiced_min=0.60,
                     lo=(0.92, 1.00), hi=(0.00, 0.03), ideal=dict(lo=0.99)),
    'liquid':   dict(centroid=(250, 2200),  voiced=True,  voiced_min=0.60,
                     lo=(0.85, 1.00), hi=(0.00, 0.05), ideal=dict(lo=0.94)),
    'glide':    dict(centroid=(250, 2100),  voiced=True,  voiced_min=0.60,
                     lo=(0.88, 1.00), hi=(0.00, 0.05), ideal=dict(lo=0.98)),
    'fric':     dict(centroid=(1200, 8000), voiced=None),
    'sibilant': dict(centroid=(2000, 9000), voiced=None),
    'breath':   dict(centroid=(400, 5000),  voiced=None,
                     hi=(0.12, 0.85), ideal=dict(hi=0.35)),
    # A stop here is a burst released into a schwa, so what ships should look
    # like the schwa: low and voiced. /t/ came back 38% below 1 kHz at
    # periodicity 0.18 — the burst with the release missing — while every stop
    # that sounded right measures around 98% and 0.88. Stops had no quality
    # rule at all until this; they were passing on length alone.
    'stop':     dict(centroid=(400, 6500),  voiced=None, min_voicing=0.55,
                     lo=(0.70, 1.00), ideal=dict(lo=0.96)),
    # Same mouth as a vowel, and the same power distribution, but it is
    # allowed — required, really — to move while it is being said.
    # A diphthong measures like a vowel except in one figure: `drift`, how far
    # the spectrum travels from the start of the clip to the end. For every
    # other sound here drift is a fault — it means the clip leaked into the
    # sound beside it. For this one it is the sound. So drift is in the ideal,
    # not only in the bounds: without it the search cheerfully returns the
    # take that moves least, which is the one that is not a diphthong at all.
    # 0.28 is where the takes that are audibly a glide sit; a take up near
    # 0.75 has run on into the consonant after it.
    'diphthong': dict(centroid=(300, 2600), voiced=True, voiced_min=0.60,
                     lo=(0.60, 1.00), hi=(0.00, 0.06), ideal=dict(lo=0.90, drift=0.28)),
}

# How far the spectrum may travel between the start of a clip and its end.
# A held sound that moves has leaked into the sound beside it. A diphthong
# that does NOT move is not a diphthong, so the rule is inverted for it:
# there is a floor as well as a ceiling.
DRIFT_MAX = {'diphthong': 0.75}
DRIFT_MIN = {'diphthong': 0.10}
# A diphthong cannot be lengthened after the fact, so a take that is too
# short is simply not usable — the glide has to be there in the audio.
MIN_MS_KIND = {'diphthong': 190}
DIPHTHONG_MAX = 0.46

# Fricatives split by voicing rather than by class: a voiceless one is
# turbulence and nothing else, a voiced one is turbulence over a voice bar.
FRICATION = {
    ('fric', False):     dict(hi=(0.60, 1.00), ideal=dict(hi=0.95)),
    ('sibilant', False): dict(hi=(0.75, 1.00), ideal=dict(hi=0.98)),
    # /v/ and /z/ get a rule of their own, and it is a compromise this voice
    # forces. Asked for either between two vowels, at six speeds, from ten
    # carriers, it never once produced a take that both buzzed and hissed —
    # the voice and the friction seem to exclude each other in this model. So
    # the gate is on the feature that separates the sound from the one it
    # would otherwise be mistaken for: /z/ that does not buzz is simply /s/,
    # and /v/ that does not buzz is /f/. Friction stays in `ideal`, so the
    # search still takes it where it can get it, but it cannot veto a /z/ that
    # is at least audibly a /z/. A grown-up who wants better can record these
    # two in Grown-ups -> Voice.
    ('fric', 'buzz'):     dict(lo=(0.30, 1.00), min_voicing=0.55, ideal=dict(hi=0.30)),
    ('sibilant', 'buzz'): dict(lo=(0.05, 0.98), min_voicing=0.55, ideal=dict(hi=0.55)),
}

MIN_MS, MAX_MS = 90, 620
TRIES = 5              # the model samples noise; a bad draw is retried, not shipped
GOOD_ENOUGH = 0.05     # a take this close to the class ideal ends the search


# ------------------------------------------------------- the recorded sounds
# audio-src/letters/<key>.mp3, one file per sound, each a person saying that
# phoneme on its own. Two keys have no file and need none:
#   ck  is /k/ — the digraph never says anything else, so it reuses k
#   wh  is /w/ in this accent, so it reuses w
RECORDED_DIR = os.path.join(ROOT, 'audio-src', 'letters')
# The sources are 44.1 kHz stereo; the app ships 22.05 kHz mono, which is what
# every other clip in it already is and is above twice the top of the band any
# of these sounds occupies.
RECORDED_SR = 22050
RECORDED = dict((k, k) for k in 'abcdefghijklmnopqrstuvwxyz')
RECORDED['ck'] = 'k'
RECORDED['wh'] = 'w'

# A recording is left as it was made except for its length. A teacher
# demonstrating /w/ holds it for 1.19 s, which is right in front of a class and
# wrong in a sequence where the sound is followed straight away by four words.
# Anything longer than this is brought down to it, and the unhurried take is
# 1.35x longer again, up to a ceiling of its own.
#
# Both go through the time stretcher rather than through a splice. Cutting a
# slice out of the middle of a held sound and crossfading the join is free in
# principle and expensive in fact: the two sides meet at whatever phase they
# happen to be at, and the cancellation at the seam is measurable — spliced
# this way /l/ fell from 0.86 periodicity to 0.65 and /w/ from 0.86 to 0.78.
# The whole point of these clips is that they are not damaged.
#
# Only single steady sounds are stretched. /kw/, /ks/ and /dʒ/ are two sounds
# in a row, and a stop is a burst with nothing in it to hold.
# 0.70 is not a taste: below it the stretch needed to reach the ceiling is
# large enough that the guard in to_length rejects it for /v/, /y/ and /z/,
# and the set comes out at 500 ms for most sounds and 950 for three.
RECORDED_MAX = 0.70
RECORDED_SLOW_MAX = 0.95
# Below this much change there is nothing to gain, so the clip is reused as it
# is rather than run through the stretcher for a difference nobody can hear.
RECORDED_MIN_FACTOR = 1.05
# How much a stretch may move the sound before the length stops being worth it.
# Total movement of the two power bands, and how much voicing it may cost.
STRETCH_DRIFT = 0.08
STRETCH_DEVOICE = 0.12
STEADY = ('vowel', 'nasal', 'liquid', 'glide', 'fric', 'sibilant')

# What a recording has to look like to be the sound it claims to be. These are
# deliberately loose: the point is to catch a file that is missing, truncated,
# or simply not the sound its name says — not to re-judge a human being.
RECORDED_CHECK = {
    'voiced':    ('voicing', 0.55, None),    # vocal folds running
    'voiceless': ('voicing', None, 0.45),    # and not
    'sibilant':  ('hi', 0.70, None),         # power above 3 kHz
    # Nasals, liquids and glides are almost all below 1 kHz. Vowels are not:
    # the second formant of /ae/ sits near 1.8 kHz, so 63% below 1 kHz is what
    # a correct /ae/ looks like and a "vowels are low" rule fails it.
    'low':       ('lo', 0.85, None),
}
RECORDED_WANT = {
    'a': ('voiced',), 'b': ('voiced',), 'c': ('voiceless',), 'd': ('voiced',),
    'e': ('voiced',), 'f': ('voiceless',), 'g': ('voiced',), 'h': ('voiceless',),
    'i': ('voiced',), 'j': ('voiced',), 'k': ('voiceless',), 'l': ('voiced', 'low'),
    'm': ('voiced', 'low'), 'n': ('voiced', 'low'), 'o': ('voiced',), 'p': ('voiceless',),
    'q': ('voiced',), 'r': ('voiced', 'low'), 's': ('voiceless', 'sibilant'),
    't': ('voiceless',), 'u': ('voiced',), 'v': ('voiced',), 'w': ('voiced', 'low'),
    'x': ('voiceless', 'sibilant'), 'y': ('voiced', 'low'), 'z': ('voiced',),
    'ck': ('voiceless',), 'wh': ('voiced', 'low'),
}
# The five voiced/voiceless pairs, which is the test that actually proves the
# files are not shuffled: /f/ and /v/ are the same mouth, and the only thing
# telling them apart is whether the voice is on.
CONTRAST = (('f', 'v'), ('s', 'z'), ('t', 'd'), ('p', 'b'), ('k', 'g'))
CONTRAST_MIN = 0.25
SR_REF = 22050          # every voice here is 22.05 kHz; used by periodicity()


# ---------------------------------------------------------------- the voice
def seed(key, attempt):
    """VITS samples noise on every run, so an unseeded build is a lottery. Each
    take is seeded from its own letter and attempt number, which is what makes a
    retry draw something different instead of repeating itself.

    It does NOT make a clip independent of the ones before it. Reseeding does
    not reset the session, whose state advances with every inference, so
    changing one letter still changes the bytes of the letters after it. Nor is
    this the call that makes a build reproducible — that is the seed in
    get_voice, set before the session exists. Both were measured, after the
    first version of this comment claimed otherwise."""
    import onnxruntime
    h = hashlib.sha1(('%s#%d' % (key, attempt)).encode()).hexdigest()[:8]
    onnxruntime.set_seed(int(h, 16) & 0x7fffffff)


def get_voice(name, speaker=None):
    import onnxruntime
    from piper import PiperVoice
    # Seed before the session exists. Measured: this is the call that makes a
    # build reproducible — reseeding later moves the draw along but does not
    # reset the session, so without this line two runs of the same command
    # produce different audio.
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


def say_phonemes(voice, phonemes, length_scale):
    """Synthesise straight from IPA symbols, with no word around the sound to
    colour it, and return the same (audio, spans) shape as say().

    This is what the card's symbol actually names. Cutting /b/ out of `ball`
    gives the burst plus a slice of /ɔː/, so it comes out as "bore"; cutting
    /d/ out of `dog` gives "daw". A stop has to release into something —
    silence leaves a click — but that something should be a neutral schwa, not
    whichever vowel the carrier word happened to have."""
    from piper.config import SynthesisConfig
    ids = voice.phonemes_to_ids(list(phonemes))
    cfg = SynthesisConfig(length_scale=length_scale, noise_scale=0.4,
                          noise_w_scale=0.4, normalize_audio=True)
    out = voice.phoneme_ids_to_audio(ids, cfg, include_alignments=True)
    if not isinstance(out, tuple):
        return None, None                       # this model cannot report timing
    audio, per_id = out
    audio = (audio / (np.max(np.abs(audio)) + 1e-9)).astype(np.float32)
    pad = voice.config.phoneme_id_map.get('_', [])
    spans, at, k = [], 0, 0
    for ph in itertools.chain(['^'], phonemes, ['$']):
        mine = voice.config.phoneme_id_map.get(ph, [])
        check = list(mine) + list(pad) if ph != '$' else list(mine)
        start = at
        for _ in check:
            if k >= len(per_id):
                return None, None
            at += int(per_id[k])
            k += 1
        spans.append((ph, start, at))
    return audio, spans


def frame_for(spec):
    """The phoneme sequence to synthesise for a letter. A stop is given a schwa
    to release into; everything else stands on its own."""
    syms = [ipa(p)[0] for p in spec['ph']]
    return syms + ['ə'] if spec['kind'] == 'stop' else syms


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


# How alike two frames must be for the clip to keep growing. At 0.72 a nasal
# slid all the way into the vowel after it — /m/ cut from `mat` ended up three
# times brighter at its end than at its start, and tiling that to length gave
# something closer to "muh" than to a hum. 0.88 stops at the phoneme.
SAME = 0.88


def centroid_of(a, sr, frame_index):
    seg = a[frame_index * HOP:frame_index * HOP + FRAME]
    if len(seg) < 32:
        return 0.0
    mag = np.abs(np.fft.rfft(seg * np.hanning(len(seg))))
    freq = np.fft.rfftfreq(len(seg), 1.0 / sr)
    return float((mag * freq).sum() / (mag.sum() + 1e-9))


def refine(a, sr, start, end, voiced, grow_left, grow_right, thr=SAME):
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
    if voiced == 'buzz':
        # a voiced fricative: the noisiest frame that still has a pitch
        pitched = [i for i in loud if v[i] > 0.40]
        if not pitched:
            return start, end
        mid = max(pitched, key=lambda i: centroid_of(a, sr, i))
        ok = lambda i: v[i] > 0.35
    elif voiced is False:
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


def carve(audio, sr, spec, spans, stretch=1.0, word=None, at=None):
    """Cut the phoneme out and shape it. Returns (clip, tiles, error) where
    tiles is how many times longer the clip is than the audio it was cut
    from — 1.0 means every sample is real, 3.0 means two thirds of what the
    child hears is the same fragment played again."""
    found = locate(spans, [ipa(p) for p in spec['ph']], at or spec['at'])
    if not found:
        return None, 0, 'phoneme %s not found in %s' % (spec['ph'], [p for p, _, _ in spans])
    start, end, nxt = found
    kind = spec['kind']

    if kind == 'stop':
        # A stop is a closure and a release: on its own it is a click, and a
        # click is not something a child can copy. Keep the burst and a short
        # slice of what follows — enough to hear, too little to become "buh".
        tail = int(sr * (0.02 if (at or spec['at']) == 'coda' else STOP_TAIL) * stretch)
        seg = audio[max(0, start - int(sr * 0.005)):min(len(audio), end + tail)]
        seg = trim(seg, sr)
        if not len(seg):
            return None, 0, 'empty segment'
        return envelope(seg, sr), 1.0, None

    voiced = spec.get('voiced', kind in ('vowel', 'diphthong', 'nasal', 'liquid', 'glide'))
    s2, e2 = refine(audio, sr, start, end, voiced,
                    grow_left=int(sr * 0.06), grow_right=int(sr * 0.16))
    seg = audio[s2:e2]
    if len(seg) < int(sr * 0.03):        # refinement found nothing usable
        seg = audio[start:end]
    seg = trim(seg, sr)
    if not len(seg):
        return None, 0, 'empty segment'
    source = len(seg)

    if kind == 'diphthong':
        # Neither of the two shaping steps below is available here. Tiling
        # repeats the middle of a glide, which is a wobble in the one place the
        # sound is supposed to be moving; centre cropping throws away the start
        # and the end, which are the two positions that name it. So a diphthong
        # ships as it was said, trimmed only if it runs long, and from the front
        # so that the movement survives.
        cap = int(sr * DIPHTHONG_MAX * stretch)
        if len(seg) > cap:
            seg = seg[:cap]
        return envelope(seg, sr), 1.0, None

    target = HOLD_OVERRIDE.get(spec.get('key'), HOLD[kind]) * stretch
    cap = int(sr * (target + 0.12))      # never a drawn-out drone
    if len(seg) > cap:
        off = (len(seg) - cap) // 2
        seg = seg[off:off + cap]
    seg = hold(seg, sr, target, mirror=kind in ('fric', 'sibilant', 'breath'))
    return envelope(seg, sr), len(seg) / max(source, 1), None


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
    # how far the sound travels between its start and its end: a held phoneme
    # should stay where it is, and one that slides is one that leaked into the
    # vowel next to it
    third = max(64, n // 3)
    def cen(x):
        if len(x) < 64:
            return 0.0
        m = np.abs(np.fft.rfft(x * np.hanning(len(x))))
        f = np.fft.rfftfreq(len(x), 1.0 / sr)
        return float((m * f).sum() / (m.sum() + 1e-9))
    early, late = cen(a[:third]), cen(a[-third:])
    drift = abs(late - early) / max(early, 1.0)
    # Where the power sits. This says more about what a sound IS than the
    # centroid does: the centroid is magnitude-weighted, so a whisper of
    # high-frequency noise drags it upwards and a clean nasal can read as
    # bright. Power in bands does not do that.
    power = spec ** 2
    total = power.sum() + 1e-12
    band = dict(lo=float(power[freq < 1000].sum() / total),
                mid=float(power[(freq >= 1000) & (freq < 3000)].sum() / total),
                hi=float(power[freq >= 3000].sum() / total))
    return dict(ms=1000.0 * n / sr, centroid=centroid, voicing=voiced, rms=rms,
                drift=drift, **band)


def rules_for(kind, voiced):
    want = dict(CHECK[kind])
    if voiced is not None:
        want['voiced'] = voiced
    extra = FRICATION.get((kind, want.get('voiced')))
    if extra:
        want = dict(want)
        want.update({k: v for k, v in extra.items() if k != 'ideal'})
        want['ideal'] = dict(want.get('ideal', {}), **extra.get('ideal', {}))
    return want


def distance(spec, m):
    """How far a take sits from what its class ideally measures. Lower is
    better; this is what picks between takes that all pass."""
    want = rules_for(spec['kind'], spec.get('voiced'))
    ideal = want.get('ideal') or {}
    d = sum(abs(m[band] - target) for band, target in ideal.items())
    if want.get('voiced') is True or want.get('min_voicing'):
        d += max(0.0, 0.90 - m['voicing'])         # voiced sounds want full voice
    return d


def check(key, kind, m, voiced=None, stretch=1.0, tiles=1.0):
    want = rules_for(kind, voiced)
    bad = []
    lo, hi = MIN_MS_KIND.get(kind, MIN_MS) * stretch, MAX_MS * stretch
    if not (lo <= m['ms'] <= hi):
        bad.append('length %.0f ms outside %.0f-%.0f' % (m['ms'], lo, hi))
    lo, hi = want['centroid']
    if not (lo <= m['centroid'] <= hi):
        bad.append('centroid %.0f Hz outside %d-%d' % (m['centroid'], lo, hi))
    if want.get('min_voicing') and m['voicing'] < want['min_voicing']:
        bad.append('too little voice, periodicity %.2f (needs %.2f)'
                   % (m['voicing'], want['min_voicing']))
    floor = want.get('voiced_min', 0.30)
    if want['voiced'] is True and m['voicing'] < floor:
        bad.append('should be voiced, periodicity %.2f (needs %.2f)' % (m['voicing'], floor))
    if want['voiced'] is False:
        if m['voicing'] > 0.55:
            bad.append('should be voiceless, periodicity %.2f' % m['voicing'])
    if want['voiced'] == 'buzz':
        if m['voicing'] < 0.40:
            bad.append('should buzz, periodicity %.2f' % m['voicing'])
    if kind != 'stop' and m['drift'] > DRIFT_MAX.get(kind, 0.50):
        bad.append('slides into the next sound, spectrum moves %.0f%%' % (100 * m['drift']))
    if m['drift'] < DRIFT_MIN.get(kind, 0.0):
        bad.append('does not move, spectrum shifts only %.0f%% — that is a pure vowel, not a glide'
                   % (100 * m['drift']))
    if m['rms'] < 0.04:
        bad.append('too quiet, rms %.3f' % m['rms'])
    for band, nice in (('lo', 'below 1 kHz'), ('hi', 'above 3 kHz')):
        span = want.get(band)
        if span and not (span[0] <= m[band] <= span[1]):
            bad.append('%.0f%% of its power is %s (needs %.0f-%.0f%%)'
                       % (100 * m[band], nice, 100 * span[0], 100 * span[1]))
    if kind != 'stop' and tiles > MAX_TILES:
        bad.append('%.1fx repeats — a fragment laid end to end flutters' % tiles)
    return bad


# ------------------------------------------------------- the recorded route
def ffmpeg_exe():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def decode(path, sr):
    """Read any audio file as mono float at `sr`, with the DC offset removed."""
    out = subprocess.run(
        [ffmpeg_exe(), '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1',
         '-ar', str(sr), '-'], capture_output=True)
    if out.returncode or not out.stdout:
        raise RuntimeError('cannot decode %s: %s' % (path, out.stderr.decode()[-200:]))
    a = np.frombuffer(out.stdout, '<i2').astype(np.float32) / 32768.0
    return a - a.mean()


def time_stretch(a, sr, factor, transients='smooth'):
    """Change the sound's length by `factor` without moving its pitch.

    Which transient setting matters more than it looks. `crisp` resets the
    phase at every detected attack, which is what keeps a burst a burst: on
    /t/ and /k/ the smooth setting smears the one event the sound consists of.
    On a held vowel there is no attack to protect and those phase resets are
    damage — /æ/ stretched with `crisp` came out with 34% of its power below
    1 kHz where the recording has 63%, i.e. a different vowel."""
    raw = (np.clip(a, -1, 1) * 32767).astype('<i2').tobytes()
    out = subprocess.run(
        [ffmpeg_exe(), '-v', 'error', '-f', 's16le', '-ac', '1', '-ar', str(sr),
         '-i', '-', '-af', 'rubberband=tempo=%.4f:transients=%s:pitchq=quality'
         % (1.0 / factor, transients),
         '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'],
        input=raw, capture_output=True)
    if out.returncode or not out.stdout:
        return a
    return np.frombuffer(out.stdout, '<i2').astype(np.float32) / 32768.0


def check_recorded(key, m):
    """Is this recording the sound it says it is? See RECORDED_CHECK."""
    bad = []
    for want in RECORDED_WANT.get(key, ()):
        field, floor, ceil = RECORDED_CHECK[want]
        got = m[field]
        if floor is not None and got < floor:
            bad.append('not %s enough: %s %.2f (needs %.2f+)' % (want, field, got, floor))
        if ceil is not None and got > ceil:
            bad.append('too voiced for %s: %s %.2f (needs %.2f-)' % (want, field, got, ceil))
    if not (0.10 <= m['ms'] / 1000.0 <= 1.30):
        bad.append('%.0f ms is not a phoneme' % m['ms'])
    if m['rms'] < 0.04:
        bad.append('too quiet, rms %.3f' % m['rms'])
    return bad


def build_recorded(key, spec, sr):
    """Turn one recording into the two clips the app plays.

    Trim the silence either side, take the slack out of a very long hold, level
    it, and fade the edges so there is no click. Then the unhurried take: a
    steady sound is simply held longer, a stop is time-stretched because there
    is nothing in it to hold."""
    a = decode(os.path.join(RECORDED_DIR, RECORDED[key] + '.mp3'), sr)
    a = trim(a, sr, floor=0.008)
    steady = spec['kind'] in STEADY and len(spec['ph']) == 1

    mode = 'smooth' if steady else 'crisp'

    def to_length(x, seconds):
        """Stretch to `seconds` — but only if it leaves the sound alone.

        A time stretcher is not free on every sound. Stretched, /æ/ moved from
        63% of its power below 1 kHz to 51%, which is a different vowel, and
        /z/ lost a third of its voicing, which is what separates it from /s/.
        Where that happens the length is not worth having and the recording is
        kept as it was made."""
        factor = seconds / (len(x) / float(sr))
        if abs(factor - 1.0) < RECORDED_MIN_FACTOR - 1.0:
            return x
        out = time_stretch(x, sr, factor, mode)
        was, now = measure(x, sr), measure(out, sr)
        moved = abs(now['lo'] - was['lo']) + abs(now['hi'] - was['hi'])
        if moved > STRETCH_DRIFT or was['voicing'] - now['voicing'] > STRETCH_DEVOICE:
            return x
        return out

    if steady:
        a = to_length(a, min(RECORDED_MAX, len(a) / float(sr)))
    fast = envelope(a, sr)
    slow = to_length(a, min(RECORDED_SLOW_MAX, SLOW * len(a) / float(sr))) if steady \
        else time_stretch(a, sr, SLOW, mode)
    return fast, envelope(slow, sr)


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


def label_of(spec):
    # The length mark is part of the name of a long vowel but not part of
    # its phoneme sequence, so those carry the label they must print.
    return spec.get('label') or ('/' + ''.join(ipa(p)[0] for p in spec['ph']) + '/')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default=DEFAULT_VOICE)
    ap.add_argument('--speaker', type=int, default=None)
    ap.add_argument('--length-scale', type=float, default=1.15)
    ap.add_argument('--kbps', type=int, default=64)
    ap.add_argument('--dry-run', action='store_true', help='measure only, write nothing')
    args = ap.parse_args()

    # The voice model is a 67 MB download and only the four synthesised
    # digraphs need it, so it is not loaded until one of them comes round.
    voice = sr = None

    if not args.dry_run:
        os.makedirs(OUT, exist_ok=True)

    manifest, failures, total, measured = {}, [], 0, {}
    for key in sorted(LETTERS):
        spec = LETTERS[key]
        spec['key'] = key
        spec['ipa_label'] = label_of(spec)

        if key in RECORDED:
            try:
                fast, slow = build_recorded(key, spec, RECORDED_SR)
            except Exception as exc:                       # a missing or unreadable file
                failures.append('%s: %s' % (key, exc))
                print('%-8s FAIL  %s' % (key, exc))
                continue
            row = {'word': spec['ipa_label'], 'ipa': spec['ipa_label'], 'rec': True}
            for label, clip in (('', fast), ('-slow', slow)):
                m = measure(clip, RECORDED_SR)
                bad = check_recorded(key, m) if not label else []
                if not label:
                    measured[key] = m
                mp3 = to_mp3(clip, RECORDED_SR, args.kbps)
                total += len(mp3)
                if not args.dry_run:
                    with open(os.path.join(OUT, key + label + '.mp3'), 'wb') as f:
                        f.write(mp3)
                row['ms' if not label else 'slowMs'] = round(m['ms'])
                print('%-8s %-7s %-8s rec  %4.0f ms  <1k %3.0f%%  >3k %3.0f%%  voi %.2f  %s'
                      % (key + label, RECORDED[key], spec['kind'], m['ms'],
                         100 * m['lo'], 100 * m['hi'], m['voicing'],
                         '; '.join(bad) if bad else 'ok'))
                if bad:
                    failures.append('%s%s: %s' % (key, label, '; '.join(bad)))
            manifest[key] = row
            continue

        if voice is None:
            voice = get_voice(args.voice)
            sr = voice.config.sample_rate
        # The sound itself first; the words are the fallback for the few that
        # the model will not produce cleanly on their own.
        carriers = [(None, spec['at'])] + [(spec['word'], spec['at'])] + list(spec.get('alts', []))
        row, quick = {}, None
        for label, stretch in (('', 1.0), ('-slow', SLOW)):
            # Search for a take that measures like the phoneme AND is mostly
            # real audio. A phoneme is only as long as the model makes it, so
            # the search is over how slowly the carrier is spoken — and, for
            # the sounds that are simply short where a word starts, over where
            # in the word to take them from.
            best = None                       # (score, clip, tiles, measure, word)
            for word, at in carriers:
                for scale in SCALES:
                    for attempt in range(TRIES):
                        seed('%s%s|%s|%.2f' % (key, label, word or 'ipa', scale), attempt)
                        if word is None:
                            audio, spans = say_phonemes(
                                voice, frame_for(spec), args.length_scale * scale * stretch)
                            if audio is None:
                                break
                        else:
                            audio, spans = say(voice, word, args.length_scale * scale * stretch)
                        clip, tiles, err = carve(audio, sr, spec, spans, stretch, word, at)
                        if clip is None:
                            continue
                        got = measure(clip, sr)
                        why = check(key, spec['kind'], got, spec.get('voiced'), stretch, tiles)
                        score = (len(why), round(distance(spec, got), 3), round(tiles, 2))
                        if best is None or score < best[0]:
                            best = (score, clip, tiles, got, word or spec['ipa_label'], why, scale)
                        # Stop only for a take that is close to the ideal, not
                        # for the first one that scrapes through: several of
                        # these letters were mediocre-but-passing draws that
                        # ended the search before a better one was reached.
                        if not why and best[0][1] <= GOOD_ENOUGH and tiles <= 1.15:
                            break
                    if best and not best[5] and best[0][1] <= GOOD_ENOUGH:
                        break
                if best and not best[5] and best[0][1] <= GOOD_ENOUGH:
                    break

            if best is None:
                failures.append('%s%s: nothing synthesised' % (key, label))
                print('%-8s FAIL  nothing synthesised' % (key + label))
                continue
            _, clip, tiles, m, word, bad, scale = best
            # The unhurried take has to be the longer of the two. The search
            # picks each independently, and it can land on a slow draw that is
            # shorter than the everyday one — /tʃ/ came back 389 ms fast and
            # 299 ms "slow". Where that happens the everyday clip is stretched
            # instead, which is at least honestly slower.
            if label and quick is not None and len(clip) <= len(quick):
                clip = time_stretch(quick, sr, SLOW, 'smooth')
                m = measure(clip, sr)
                bad = check(key, spec['kind'], m, spec.get('voiced'), SLOW, 1.0)
            if not label:
                quick = clip
            mp3 = to_mp3(clip, sr, args.kbps)
            total += len(mp3)
            if not args.dry_run:
                with open(os.path.join(OUT, key + label + '.mp3'), 'wb') as f:
                    f.write(mp3)
            row['word'] = word if not label else row.get('word', word)
            row['ipa'] = spec['ipa_label']
            row['ms' if not label else 'slowMs'] = round(m['ms'])
            print('%-8s %-7s %-8s x%.1f %4.0f ms  <1k %3.0f%%  >3k %3.0f%%  voi %.2f  %s'
                  % (key + label, word, spec['kind'], scale, m['ms'],
                     100 * m['lo'], 100 * m['hi'], m['voicing'],
                     '; '.join(bad) if bad else 'ok'))
            if bad:
                failures.append('%s%s (%s): %s' % (key, label, spec['kind'], '; '.join(bad)))
        manifest[key] = row

    # Five pairs made with the same mouth, told apart only by whether the voice
    # is running. If a recording had been filed under the wrong letter this is
    # what would catch it; nothing else here would.
    print()
    for quiet, loud in CONTRAST:
        if quiet in measured and loud in measured:
            gap = measured[loud]['voicing'] - measured[quiet]['voicing']
            print('%s/%s  voicing %.2f vs %.2f  %s'
                  % (quiet, loud, measured[quiet]['voicing'], measured[loud]['voicing'],
                     'ok' if gap >= CONTRAST_MIN else 'TOO CLOSE'))
            if gap < CONTRAST_MIN:
                failures.append('/%s/ and /%s/ measure alike (voicing gap %.2f)' % (quiet, loud, gap))

    print('\n%d clips, %.0f KB total' % (len(manifest), total / 1024))
    if failures:
        print('\nFAILED %d:' % len(failures))
        for f in failures:
            print('  ' + f)
        return 1
    if not args.dry_run:
        with open(MANIFEST, 'w') as f:
            f.write('/* letter-clips.js — GENERATED by tools/make-letter-audio.py. Do not edit.\n'
                    '   Which letter sounds ship as audio, and where each came from: an IPA\n'
                    '   symbol in slashes means the sound was synthesised from the symbol on\n'
                    '   the card, a word means it was cut out of that word.\n'
                    '   The clips are audio/letters/<key>.mp3, with a slower take of the same\n'
                    '   sound at <key>-slow.mp3 for the first, teaching reading.\n'
                    '   rec: true means a recording of a person saying that sound on its own\n'
                    '   (audio-src/letters/, Sound City Reading, Kathryn Davis). The rest are\n'
                    '   synthesised: %s (Piper), trained on public-domain LibriVox recordings.\n'
                    '   `ipa` is the sound the clip claims to be, and tools/build.mjs refuses\n'
                    '   to build if it disagrees with what the card prints. */\n'
                    % args.voice)
            f.write('window.LETTER_CLIPS = {\n')
            for k in sorted(manifest):
                r = manifest[k]
                f.write("  '%s': { from: '%s', ipa: '%s', ms: %d, slowMs: %d%s },\n"
                        % (k, r['word'], r.get('ipa', ''), r.get('ms', 0), r.get('slowMs', 0),
                           ', rec: true' if r.get('rec') else ''))
            f.write('};\n')
        print('wrote', MANIFEST)
    return 0


if __name__ == '__main__':
    sys.exit(main())
