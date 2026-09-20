# Where these came from

26 mp3s, one per letter, each a recording of a person saying that letter's
phonic sound **on its own** — no carrier word, nothing around it.

| | |
|---|---|
| Source | Sound City Reading, *Individual Alphabet Sounds — ABC Order* |
| | <https://www.soundcityreading.net/individual-alphabet-sounds---abc-order.html> |
| Artist tag in the files | Kathryn Davis |
| Recorded | 2018, Studio One 3.0 |
| As supplied | 44.1 kHz stereo MP3, 192 kb/s, 52–64 dB SNR |
| As shipped | 22.05 kHz mono, 64 kb/s, trimmed and levelled |

Three files were renamed to the key the app uses:

| supplied | here | why |
|---|---|---|
| `alphasounds-o-sh.mp3` | `o.mp3` | short o, /ɒ/ — the sound the card teaches |
| `alphasounds-u-sh.mp3` | `u.mp3` | short u, /ʌ/ |
| `alphasounds-p-2.mp3` | `p.mp3` | the site's second take of /p/ |

Nothing else was changed. The files here are the originals; everything done to
them happens in `tools/make-letter-audio.py` and is described in the README.

`ck` and `wh` have no file and need none — ck is /k/ and wh is /w/, so each
reuses the recording of the letter it sounds like. **sh, ch, th and ng** have
no recording at all and are still synthesised.

## If you are reusing this repository

These recordings are not mine and not covered by whatever licence the rest of
this code carries. Sound City Reading publishes them free for teachers and
parents; check the site's own terms before redistributing them.
