#!/usr/bin/env python3
"""Generate web/phonemes.js — one clean, phonetically correct clip per letter.

Why this exists: browser speech synthesis cannot say a bare letter sound. Ask it
for /k/ and it says "kuh"; ask for the vowel in `cat` and it says /ɑː/, the
vowel in `car`. Both teach the wrong thing. espeak-ng can be driven from
phoneme symbols directly, so we synthesise the exact phoneme and ship the audio
with the page as data: URIs — no network, no API key, works offline.

Voiced stops (b, d, g, j) make no sound at all in isolation, which is a fact
about speech, not a bug: they are a closure plus a release burst. espeak
renders silence for them, so we synthesise the stop followed by a schwa and cut
the moment the vowel starts. What is left is the burst alone.

Requires: espeak-ng.  Run: python3 tools/make-phonemes.py
"""
import subprocess, wave, audioop, base64, io, os, sys

# espeak-ng internal phoneme per letter — the sound Oxford Phonics World 1 teaches.
# ':' lengthens a continuant so the child hears it held.
PLAIN = {
    'a': 'a:',  'c': 'k',   'e': 'E:',  'f': 'f:',  'h': 'h',   'i': 'I:',
    'k': 'k',   'l': 'l:',  'm': 'm:',  'n': 'n:',  'o': '0:',  'p': 'p',
    'q': 'kw',  'r': 'r:',  's': 's:',  't': 't',   'u': 'V:',  'v': 'v:',
    'w': 'w',   'x': 'ks',  'y': 'j',   'z': 'z:',
}
# stop + schwa, cut at vowel onset
STOPS = {'b': 'b@', 'd': 'd@', 'g': 'g@', 'j': 'dZ@'}

RATE = 16000
VOWEL_ONSET = 15000      # amplitude that means the schwa has started
WIN = 0.01               # 10 ms analysis window


def synth(phon):
    subprocess.run(['espeak-ng', '-v', 'en-gb', '-s', '95', '-p', '55',
                    '-a', '200', '-w', '/tmp/_ph.wav', '[[%s]]' % phon], check=True)
    w = wave.open('/tmp/_ph.wav')
    data, sr, ch, sw = w.readframes(w.getnframes()), w.getframerate(), w.getnchannels(), w.getsampwidth()
    w.close()
    if ch > 1:
        data = audioop.tomono(data, sw, .5, .5)
    data, _ = audioop.ratecv(data, sw, 1, sr, RATE, None)
    return data, sw


def cut_at_vowel(data, sw):
    win = int(RATE * WIN)
    for i in range(2, len(data) // sw // win):
        chunk = data[i * win * sw:(i + 1) * win * sw]
        if audioop.max(chunk, sw) > VOWEL_ONSET:
            return data[:i * win * sw]
    return data


def trim(data, sw):
    """Trim silence using windowed peaks. Measuring single samples looks like
    silence at every zero crossing, which chops continuants to nothing."""
    peak = audioop.max(data, sw)
    if not peak:
        return data
    win = int(RATE * WIN)
    nwin = len(data) // sw // win
    if nwin < 2:
        return data
    energy = [audioop.max(data[i * win * sw:(i + 1) * win * sw], sw) for i in range(nwin)]
    th = max(120, int(peak * .06))
    s = 0
    while s < nwin - 1 and energy[s] < th:
        s += 1
    e = nwin - 1
    while e > s and energy[e] < th:
        e -= 1
    pad = 2   # 20 ms either side
    a = max(0, s - pad) * win * sw
    b = min(nwin, e + 1 + pad) * win * sw
    return data[a:b]


def lengthen(data, sw, target_ms=260, xfade_ms=12):
    """espeak renders nasals and liquids as ~40 ms however you mark them, which
    is too brief for a child to hear and copy. They are steady periodic sounds,
    so tile the clip with a crossfade until it is long enough."""
    n = len(data) // sw
    target = int(RATE * target_ms / 1000)
    if n >= target or n < int(RATE * .02):
        return data
    x = min(int(RATE * xfade_ms / 1000), n // 3)
    out = bytearray(data)
    while len(out) // sw < target:
        tail = len(out) // sw
        for i in range(x):
            k = i / x
            a = int.from_bytes(out[(tail - x + i) * sw:(tail - x + i + 1) * sw], 'little', signed=True)
            b = int.from_bytes(data[i * sw:(i + 1) * sw], 'little', signed=True)
            v = int(a * (1 - k) + b * k)
            out[(tail - x + i) * sw:(tail - x + i + 1) * sw] = v.to_bytes(sw, 'little', signed=True)
        out += data[x * sw:]
    return bytes(out)


def fade_out(data, sw, ms=25):
    n = int(RATE * ms / 1000)
    out = bytearray(data)
    total = len(data) // sw
    for i in range(max(0, total - n), total):
        k = (total - i) / n
        v = int.from_bytes(out[i * sw:(i + 1) * sw], 'little', signed=True)
        out[i * sw:(i + 1) * sw] = int(v * k).to_bytes(sw, 'little', signed=True)
    return bytes(out)


def to_wav(data, sw):
    buf = io.BytesIO()
    o = wave.open(buf, 'wb')
    o.setnchannels(1); o.setsampwidth(sw); o.setframerate(RATE)
    o.writeframes(data); o.close()
    return buf.getvalue()


def build():
    clips = {}
    for letter in sorted(list(PLAIN) + list(STOPS)):
        if letter in STOPS:
            data, sw = synth(STOPS[letter])
            data = cut_at_vowel(data, sw)
            data = trim(data, sw)
        else:
            data, sw = synth(PLAIN[letter])
            data = trim(data, sw)
        if letter in 'mnlr':
            data = lengthen(data, sw)
        peak = audioop.max(data, sw)
        if peak:
            data = audioop.mul(data, sw, min(8.0, 26000.0 / peak))
        data = fade_out(data, sw)
        clips[letter] = to_wav(data, sw)
        print('%s  %5d bytes  %.2fs' % (letter, len(clips[letter]), len(data) / sw / RATE))
    return clips


if __name__ == '__main__':
    clips = build()
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, '..', 'web', 'phonemes.js')
    with open(out, 'w') as f:
        f.write('/* phonemes.js — GENERATED by tools/make-phonemes.py. Do not edit.\n'
                '   One clip per letter, synthesised from phoneme symbols by espeak-ng\n'
                '   so the sound is the real phoneme and not a "kuh" approximation.\n'
                '   Embedded as data: URIs so the page needs no network. */\n')
        f.write('window.PHONEME_AUDIO = {\n')
        for k in sorted(clips):
            f.write("  %s: 'data:audio/wav;base64,%s',\n" % (k, base64.b64encode(clips[k]).decode()))
        f.write('};\n')
    print('wrote', out, os.path.getsize(out), 'bytes')
