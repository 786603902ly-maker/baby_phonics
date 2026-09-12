/* mouths.js — how the mouth looks when you make each sound.
   Front view, the way a mirror shows it, because that is what a child copies.
   Thirteen shapes cover all 26 letter sounds. */
(function () {
  'use strict';

  var LIP = '#CE6F68', DARK = '#4E1E2A', TEETH = '#FFFCF6', TONGUE = '#EE8E80', RIM = '#B5554F';

  /* An opening rx x ry, ringed by lips. Everything else is drawn inside it. */
  function open(rx, ry, inner) {
    return '<ellipse cx="50" cy="52" rx="' + (rx + 9) + '" ry="' + (ry + 9) + '" fill="' + LIP + '"/>' +
      '<ellipse cx="50" cy="52" rx="' + (rx + 9) + '" ry="' + (ry + 9) + '" fill="none" stroke="' + RIM + '" stroke-width="2"/>' +
      '<ellipse cx="50" cy="52" rx="' + rx + '" ry="' + ry + '" fill="' + DARK + '"/>' +
      (inner || '');
  }

  function topTeeth(rx, y) {
    return '<path d="M' + (50 - rx + 2) + ' ' + y + 'h' + ((rx - 2) * 2) + 'v9H' + (50 - rx + 2) + 'z" fill="' + TEETH + '"/>';
  }
  function botTeeth(rx, y) {
    return '<path d="M' + (50 - rx + 4) + ' ' + y + 'h' + ((rx - 4) * 2) + 'v8H' + (50 - rx + 4) + 'z" fill="' + TEETH + '"/>';
  }
  function tongue(cy, rx, ry) {
    return '<ellipse cx="50" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + TONGUE + '"/>';
  }

  var M = {};

  /* jaw wide open, tongue flat and low — /æ/ */
  M.wide = open(32, 27, topTeeth(30, 27) + tongue(72, 23, 9) + botTeeth(26, 72));

  /* half open, tongue in the middle — /e/ /ʌ/ */
  M.mid = open(31, 19, topTeeth(29, 35) + tongue(64, 22, 8));
  M.relax = open(28, 17, topTeeth(26, 37) + tongue(63, 20, 7));

  /* small smile, tongue high and forward — /ɪ/ /j/ */
  M.narrow = open(32, 11, topTeeth(30, 43) + tongue(58, 24, 6));

  /* lips rounded — /ɒ/ */
  M.round = open(21, 21, tongue(68, 15, 7));

  /* lips pushed forward into a tight circle — /w/ /kw/ */
  M.roundTight = open(13, 13, '');

  /* tongue curled back — /r/ */
  M.curl = open(18, 16, '<path d="M36 62h28c0-8-6-12-12-12s-12 4-16 12z" fill="' + TONGUE + '"/>' +
    '<path d="M58 50c6-2 8-6 6-10" fill="none" stroke="' + TONGUE + '" stroke-width="6" stroke-linecap="round"/>');

  /* teeth almost closed, air hisses through — /s/ /z/ */
  M.smileTeeth = open(33, 12, topTeeth(31, 42) + botTeeth(29, 55) +
    '<g stroke="#7ED7F2" stroke-width="3" stroke-linecap="round" opacity=".9">' +
    '<path d="M50 52h14M50 52h-14"/></g>');

  /* tongue tip up behind the top teeth — /t/ /d/ /n/ /l/ /dʒ/ */
  M.tongueTip = open(30, 21, topTeeth(28, 33) +
    '<path d="M22 70c12-3 30-6 44-12 6-3 8-8 6-12-2 8-10 10-20 12-12 3-22 6-30 12z" fill="' + TONGUE + '"/>' +
    '<circle cx="52" cy="44" r="5" fill="none" stroke="#F5C518" stroke-width="3"/>');

  /* back of the tongue lifts to the roof — /k/ /g/ /ks/ */
  M.back = open(29, 20, topTeeth(27, 34) +
    '<path d="M22 70c10 0 18-4 22-12 4-8 10-12 20-12v-4c-14 0-22 6-27 14-4 7-9 11-15 11z" fill="' + TONGUE + '"/>' +
    '<circle cx="70" cy="40" r="6" fill="none" stroke="#F5C518" stroke-width="3"/>');

  /* open, just breath — /h/ */
  M.openBreath = open(30, 28, topTeeth(28, 26) + tongue(74, 21, 8) +
    '<g stroke="#7ED7F2" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".85">' +
    '<path d="M50 46c8 0 14 3 18 6M50 56c8 0 14 3 18 6"/></g>');

  /* lips pressed together — /b/ /p/ /m/ */
  M.closed =
    '<path d="M6 52c14-19 74-19 88 0-14 19-74 19-88 0z" fill="' + LIP + '"/>' +
    '<path d="M6 52c14-19 74-19 88 0-14 19-74 19-88 0z" fill="none" stroke="' + RIM + '" stroke-width="2"/>' +
    '<path d="M8 52h84" stroke="#8E3A3A" stroke-width="5" stroke-linecap="round"/>';

  /* top teeth resting on the bottom lip — /f/ /v/ */
  M.teethLip =
    '<path d="M8 40c14-14 70-14 84 0-10 8-28 12-42 12S18 48 8 40z" fill="' + LIP + '"/>' +
    '<path d="M8 64c14 14 70 14 84 0-10-8-28-12-42-12S18 56 8 64z" fill="#C25F58"/>' +
    '<path d="M26 46h48v12H26z" fill="' + TEETH + '"/>' +
    '<path d="M26 58h48" stroke="#E7DAC7" stroke-width="2"/>' +
    '<g stroke="#7ED7F2" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".85">' +
    '<path d="M50 62c10 2 16 6 20 10"/></g>';

  window.MOUTHS = M;

  window.mouthSvg = function (name) {
    var body = M[name] || M.mid;
    return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + body + '</svg>';
  };
})();
