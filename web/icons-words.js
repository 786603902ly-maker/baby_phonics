/* icons-words.js — the Oxford Phonics World Level 1 keyword pictures.
   Merged into window.ICONS after icons.js. All share a 100x100 viewBox. */
(function () {
  'use strict';
  var I = window.ICONS;

  function num(n, colour) {
    return '<text x="50" y="74" font-size="70" font-family="Andika, Trebuchet MS, sans-serif"' +
      ' font-weight="700" text-anchor="middle" fill="' + colour + '">' + n + '</text>';
  }

  /* A */
  I.ax = '<rect x="45" y="30" width="11" height="60" rx="5" fill="#A9744F"/><path d="M42 12h12c17 0 31 9 35 22-4 13-18 22-35 22H42z" fill="#CDD5DC"/><path d="M62 12c15 3 25 11 27 22s-12 19-27 22c9-7 13-13 13-22s-4-15-13-22z" fill="#93A0AC"/><rect x="39" y="28" width="22" height="11" rx="4" fill="#7A4E2E"/>';
  I.ant = '<ellipse cx="30" cy="56" rx="12" ry="10" fill="#2E2A3B"/><ellipse cx="50" cy="54" rx="10" ry="9" fill="#2E2A3B"/><ellipse cx="72" cy="56" rx="15" ry="13" fill="#2E2A3B"/><g stroke="#2E2A3B" stroke-width="3" stroke-linecap="round"><path d="M46 60l-8 18M56 60l6 18M48 46l-6-12M56 46l8-10M28 46l-8-10M26 62l-12 8"/></g><circle cx="26" cy="52" r="2.6" fill="#F5C518"/>';
  I.alligator = '<path d="M4 58c14-6 30-8 48-8h32c6 0 10 3 10 7s-4 7-10 7H52c-18 0-34-2-48-6z" fill="#5AA469"/><path d="M58 50h26c6 0 10 3 10 7H58z" fill="#4A8A57"/><g fill="#FFF9F0"><path d="M64 57l3-5 3 5zM72 57l3-5 3 5zM80 57l3-5 3 5z"/></g><circle cx="68" cy="46" r="5" fill="#4A8A57"/><circle cx="68" cy="45" r="2.2" fill="#2E2A3B"/><g stroke="#5AA469" stroke-width="7" stroke-linecap="round"><path d="M34 66v8M60 66v8"/></g>';

  /* C */
  I.computer = '<rect x="18" y="22" width="64" height="44" rx="5" fill="#4A4A55"/><rect x="24" y="28" width="52" height="32" rx="2" fill="#7ED7F2"/><path d="M8 70h84l-5 10H13z" fill="#B9C2CC"/>';

  /* D */
  I.desk = '<rect x="8" y="32" width="84" height="11" rx="4" fill="#C68642"/><rect x="16" y="43" width="11" height="42" fill="#8B5A2B"/><rect x="73" y="43" width="11" height="42" fill="#8B5A2B"/><rect x="34" y="45" width="40" height="24" rx="3" fill="#E8A85C"/>';
  I.doll = '<circle cx="50" cy="30" r="17" fill="#F0D5B0"/><path d="M30 24c-4-14 8-18 20-18s24 4 20 18c-4-9-12-11-20-11s-16 2-20 11z" fill="#C68642"/><circle cx="44" cy="30" r="2.6" fill="#2E2A3B"/><circle cx="56" cy="30" r="2.6" fill="#2E2A3B"/><path d="M44 38a7 4 0 0 0 12 0" fill="none" stroke="#C74A34" stroke-width="2.2"/><path d="M36 50h28l9 36H27z" fill="#E8624A"/><circle cx="28" cy="58" r="6" fill="#F0D5B0"/><circle cx="72" cy="58" r="6" fill="#F0D5B0"/>';

  /* E */
  I.elephant = '<ellipse cx="40" cy="58" rx="30" ry="25" fill="#9AA5B1"/><ellipse cx="60" cy="44" rx="14" ry="17" fill="#7E8894"/><circle cx="74" cy="48" r="16" fill="#B9C2CC"/><path d="M86 58c7 8 5 22-3 28-5 4-12 0-9-7" fill="none" stroke="#B9C2CC" stroke-width="9" stroke-linecap="round"/><circle cx="80" cy="44" r="3" fill="#2E2A3B"/><g fill="#9AA5B1"><rect x="22" y="76" width="13" height="13" rx="5"/><rect x="46" y="76" width="13" height="13" rx="5"/></g>';
  I.elbow = '<path d="M26 14h20v36c0 9 7 15 16 15h20v18H60c-19 0-34-14-34-32z" fill="#F0D5B0"/><circle cx="42" cy="54" r="9" fill="#E8BE95"/>';
  I.envelope = '<rect x="10" y="28" width="80" height="48" rx="5" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="3"/><path d="M12 32l38 27 38-27" fill="none" stroke="#E8624A" stroke-width="4"/>';

  /* F */
  I.fork = '<rect x="45" y="34" width="10" height="54" rx="4" fill="#B9C2CC"/><path d="M32 10v20a18 12 0 0 0 36 0V10z" fill="#B9C2CC"/><g stroke="#FFF6E9" stroke-width="5"><path d="M42 10v18M50 10v18M58 10v18"/></g>';
  I.farm = '<path d="M50 12l42 28H8z" fill="#C74A34"/><rect x="18" y="40" width="64" height="46" fill="#E8624A"/><rect x="40" y="54" width="20" height="32" fill="#C68642"/><path d="M40 54l20 32M60 54L40 86" stroke="#FFF9F0" stroke-width="3"/>';

  /* G */
  I.gorilla = '<ellipse cx="50" cy="68" rx="29" ry="23" fill="#4A4A55"/><circle cx="26" cy="34" r="8" fill="#3A3A44"/><circle cx="74" cy="34" r="8" fill="#3A3A44"/><circle cx="50" cy="38" r="23" fill="#4A4A55"/><ellipse cx="50" cy="46" rx="16" ry="13" fill="#7B7B88"/><circle cx="42" cy="34" r="3.6" fill="#FFF9F0"/><circle cx="58" cy="34" r="3.6" fill="#FFF9F0"/><circle cx="42" cy="34" r="1.9" fill="#2E2A3B"/><circle cx="58" cy="34" r="1.9" fill="#2E2A3B"/><ellipse cx="45" cy="44" rx="2.6" ry="2" fill="#2E2A3B"/><ellipse cx="55" cy="44" rx="2.6" ry="2" fill="#2E2A3B"/><path d="M42 52a10 6 0 0 0 16 0" fill="none" stroke="#2E2A3B" stroke-width="2.4"/>';
  I.goat = '<ellipse cx="42" cy="58" rx="26" ry="18" fill="#C68642"/><path d="M64 44h14c5 0 8 4 7 9l-4 15-17-5z" fill="#C68642"/><path d="M74 44c1-11 6-14 11-17-4 7-4 12-3 17zM68 44c-2-11-7-14-12-17 5 7 5 12 4 17z" fill="#F0D5B0"/><circle cx="77" cy="53" r="2.6" fill="#2E2A3B"/><path d="M72 63l-3 13 7-3z" fill="#FFF9F0"/><g stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"><path d="M26 74v12M38 74v12M52 74v12"/></g>';
  I.girl = '<path d="M32 32c-3-18 8-24 18-24s21 6 18 24z" fill="#6B4420"/><circle cx="50" cy="30" r="15" fill="#F0D5B0"/><path d="M34 30c-2-16 8-21 16-21s18 5 16 21c-3-9-8-12-16-12s-13 3-16 12z" fill="#6B4420"/><path d="M67 27c9 3 11 11 9 19-7-2-9-11-9-19z" fill="#6B4420"/><circle cx="44" cy="29" r="2.6" fill="#2E2A3B"/><circle cx="56" cy="29" r="2.6" fill="#2E2A3B"/><path d="M38 46h24l6 20H32z" fill="#F5C518"/><path d="M32 66h36l6 22H26z" fill="#2D8FA8"/><g stroke="#F0D5B0" stroke-width="7" stroke-linecap="round"><path d="M36 52L24 40M64 52l12-12"/></g>';
  I.hotdog = '<path d="M12 46h76c6 0 10 5 10 11s-4 11-10 11H12C6 68 2 63 2 57s4-11 10-11z" fill="#E8A85C"/><path d="M16 52h68c4 0 7 3 7 6H9c0-3 3-6 7-6z" fill="#F5DEB3"/><path d="M18 54h64c4 0 6 2 6 5s-2 5-6 5H18c-4 0-6-2-6-5s2-5 6-5z" fill="#C74A34"/><path d="M18 58c6-4 10 4 16 0s10 4 16 0 10 4 16 0 10 4 16 0" fill="none" stroke="#F5C518" stroke-width="4" stroke-linecap="round"/>';

  /* I */
  I.insect = '<ellipse cx="50" cy="58" rx="27" ry="25" fill="#E8624A"/><path d="M50 33v50" stroke="#2E2A3B" stroke-width="4"/><circle cx="50" cy="28" r="12" fill="#2E2A3B"/><g fill="#2E2A3B"><circle cx="35" cy="50" r="5"/><circle cx="65" cy="50" r="5"/><circle cx="39" cy="69" r="4.5"/><circle cx="61" cy="69" r="4.5"/></g><g stroke="#2E2A3B" stroke-width="3" stroke-linecap="round"><path d="M44 19l-6-9M56 19l6-9"/></g>';
  I.ink = '<rect x="40" y="10" width="20" height="16" rx="4" fill="#4A4A55"/><path d="M34 26h32v12l8 12v30a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V50l8-12z" fill="#CFE3F7"/><path d="M26 58h48v22a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6z" fill="#2D3A8A"/>';
  I.iguana = '<path d="M6 62c10-8 22-12 34-12h24c9 0 15 4 15 10s-6 10-15 10H42c-14 0-26-2-36-8z" fill="#5AA469"/><circle cx="82" cy="56" r="11" fill="#5AA469"/><circle cx="86" cy="53" r="2.6" fill="#2E2A3B"/><g fill="#4A8A57"><path d="M28 50l5-8 5 8zM40 48l5-8 5 8zM52 48l5-8 5 8zM64 50l5-8 5 8z"/></g><g stroke="#5AA469" stroke-width="6" stroke-linecap="round"><path d="M32 70l-6 10M60 70l6 10"/></g>';

  /* J */
  I.jet = '<path d="M6 52h26l19-26h11l-11 26h28c6 0 9 2 9 4s-3 4-9 4H51l11 26H51L32 60H6z" fill="#B9C2CC"/><circle cx="70" cy="56" r="3" fill="#2D8FA8"/>';
  I.jam = '<rect x="24" y="20" width="52" height="14" rx="5" fill="#C74A34"/><rect x="28" y="32" width="44" height="54" rx="8" fill="#E8624A"/><rect x="34" y="48" width="32" height="20" rx="3" fill="#FFF9F0"/><path d="M40 58h20" stroke="#C74A34" stroke-width="4" stroke-linecap="round"/>';
  I.juice = '<path d="M58 26l14-16" stroke="#E8624A" stroke-width="6" stroke-linecap="round"/><path d="M30 24h40l-5 56a8 8 0 0 1-8 7H43a8 8 0 0 1-8-7z" fill="#FFE9B8"/><path d="M32 40h36l-4 40a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7z" fill="#FF9F45"/>';
  I.jacket = '<path d="M32 20h36l17 13-9 15-6-4v42H30V44l-6 4-9-15z" fill="#2D8FA8"/><path d="M50 20l-9 16 9 8 9-8z" fill="#FFF6E9"/><path d="M50 46v40" stroke="#22758A" stroke-width="3"/><circle cx="57" cy="56" r="2.8" fill="#F5C518"/><circle cx="57" cy="70" r="2.8" fill="#F5C518"/>';

  /* K */
  I.kangaroo = '<path d="M22 72c-13 4-17 13-6 17h18l-5-17z" fill="#C77B3E"/><ellipse cx="46" cy="56" rx="22" ry="25" fill="#C77B3E"/><ellipse cx="46" cy="64" rx="12" ry="13" fill="#E8A85C"/><path d="M44 78h20l5 13H44z" fill="#C77B3E"/><ellipse cx="62" cy="16" rx="4.5" ry="10" fill="#A9744F"/><ellipse cx="75" cy="17" rx="4.5" ry="10" fill="#A9744F"/><circle cx="68" cy="30" r="14" fill="#C77B3E"/><circle cx="73" cy="28" r="2.8" fill="#2E2A3B"/><circle cx="81" cy="34" r="2.8" fill="#2E2A3B"/>';
  I.key = '<circle cx="28" cy="40" r="19" fill="#F5C518"/><circle cx="28" cy="40" r="7.5" fill="#FFF6E9"/><rect x="40" y="34" width="50" height="12" rx="4" fill="#F5C518"/><rect x="62" y="46" width="9" height="15" rx="3" fill="#F5C518"/><rect x="79" y="46" width="9" height="15" rx="3" fill="#F5C518"/>';
  I.king = '<path d="M24 36l5-24 11 12 10-18 10 18 11-12 5 24z" fill="#F5C518"/><circle cx="50" cy="54" r="20" fill="#F0D5B0"/><circle cx="43" cy="51" r="3.2" fill="#2E2A3B"/><circle cx="57" cy="51" r="3.2" fill="#2E2A3B"/><path d="M42 61a10 7 0 0 0 16 0" fill="none" stroke="#C74A34" stroke-width="3" stroke-linecap="round"/><path d="M30 72h40l9 18H21z" fill="#E8624A"/>';

  /* L */
  I.lion = '<circle cx="50" cy="52" r="33" fill="#C77B3E"/><circle cx="50" cy="52" r="22" fill="#E8A85C"/><circle cx="42" cy="47" r="3.6" fill="#2E2A3B"/><circle cx="58" cy="47" r="3.6" fill="#2E2A3B"/><path d="M50 57l-6 5h12z" fill="#2E2A3B"/><path d="M42 67a10 6 0 0 0 16 0" fill="none" stroke="#2E2A3B" stroke-width="2.5"/>';
  I.lamp = '<path d="M24 46l15-26h22l15 26z" fill="#F5C518"/><rect x="46" y="46" width="8" height="34" fill="#8B5A2B"/><path d="M28 88h44l-7-10H35z" fill="#8B5A2B"/>';
  I.lemon = '<ellipse cx="50" cy="56" rx="31" ry="23" fill="#F5C518"/><ellipse cx="50" cy="56" rx="24" ry="16" fill="#FFE066"/><path d="M50 33c0-8 6-13 13-14-2 9-4 13-13 14z" fill="#5AA469"/>';

  /* M */
  I.monkey = '<circle cx="26" cy="38" r="9" fill="#C68642"/><circle cx="74" cy="38" r="9" fill="#C68642"/><ellipse cx="50" cy="66" rx="23" ry="22" fill="#8B5A2B"/><circle cx="50" cy="38" r="20" fill="#8B5A2B"/><ellipse cx="50" cy="44" rx="15" ry="12" fill="#F0D5B0"/><circle cx="43" cy="34" r="3.2" fill="#2E2A3B"/><circle cx="57" cy="34" r="3.2" fill="#2E2A3B"/><circle cx="46" cy="42" r="1.8" fill="#2E2A3B"/><circle cx="54" cy="42" r="1.8" fill="#2E2A3B"/><path d="M43 48a8 5 0 0 0 14 0" fill="none" stroke="#2E2A3B" stroke-width="2.2"/>';
  I.milk = '<path d="M28 34l10-20h24l10 20z" fill="#F2EDE4" stroke="#E7DAC7" stroke-width="2"/><rect x="28" y="34" width="44" height="52" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><rect x="34" y="50" width="32" height="22" rx="3" fill="#2D8FA8"/><path d="M39 58h22M39 66h14" stroke="#FFF9F0" stroke-width="3.4" stroke-linecap="round"/>';
  I.money = '<ellipse cx="34" cy="76" rx="24" ry="9" fill="#E8A800"/><ellipse cx="34" cy="67" rx="24" ry="9" fill="#F5C518"/><ellipse cx="34" cy="58" rx="24" ry="9" fill="#E8A800"/><ellipse cx="34" cy="49" rx="24" ry="9" fill="#F5C518"/><circle cx="70" cy="36" r="19" fill="#F5C518" stroke="#E8A800" stroke-width="3"/><path d="M70 25v22M63 32h14M63 41h14" stroke="#E8A800" stroke-width="3.4" stroke-linecap="round"/>';
  I.mouse = '<ellipse cx="50" cy="60" rx="25" ry="19" fill="#B9C2CC"/><circle cx="32" cy="44" r="13" fill="#D6DDE4"/><circle cx="68" cy="46" r="12" fill="#D6DDE4"/><circle cx="72" cy="43" r="2.8" fill="#2E2A3B"/><circle cx="82" cy="52" r="3" fill="#F0A8BC"/><ellipse cx="74" cy="52" rx="10" ry="8" fill="#B9C2CC"/><path d="M26 68c-14 2-18 12-8 18" fill="none" stroke="#B9C2CC" stroke-width="4" stroke-linecap="round"/>';

  /* N */
  I.nest = '<circle cx="40" cy="50" r="10" fill="#CFE3F7"/><circle cx="60" cy="48" r="10" fill="#CFE3F7"/><path d="M14 56h72c0 18-15 28-36 28S14 74 14 56z" fill="#C68642"/><g stroke="#8B5A2B" stroke-width="3" fill="none"><path d="M17 62h66M22 70h56M31 78h38"/></g>';

  /* O */
  I.ox = '<path d="M22 32c-9-6-16-3-16 7 0 9 7 14 16 11zM78 32c9-6 16-3 16 7 0 9-7 14-16 11z" fill="#F0D5B0"/><ellipse cx="50" cy="54" rx="28" ry="27" fill="#8B5A2B"/><ellipse cx="50" cy="67" rx="16" ry="12" fill="#C68642"/><circle cx="44" cy="67" r="3" fill="#6B4420"/><circle cx="56" cy="67" r="3" fill="#6B4420"/><circle cx="40" cy="46" r="3.6" fill="#2E2A3B"/><circle cx="60" cy="46" r="3.6" fill="#2E2A3B"/>';
  I.olive = '<path d="M40 34c-2-11 4-17 11-19-2 11-3 15-11 19z" fill="#3F7F51"/><ellipse cx="66" cy="64" rx="15" ry="19" fill="#4A8A57"/><ellipse cx="38" cy="58" rx="19" ry="24" fill="#5AA469"/><ellipse cx="38" cy="52" rx="7" ry="9" fill="#E8624A"/>';
  I.ostrich = '<ellipse cx="38" cy="66" rx="27" ry="21" fill="#4A4A55"/><path d="M60 62c0-18 5-30 12-36" stroke="#F0D5B0" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="76" cy="22" r="11" fill="#F0D5B0"/><path d="M87 22l11 3-11 5z" fill="#FF9F45"/><circle cx="79" cy="19" r="2.4" fill="#2E2A3B"/><g stroke="#F0D5B0" stroke-width="5" stroke-linecap="round"><path d="M32 85v9M46 85v9"/></g>';

  /* P */
  I.peach = '<path d="M50 34c-2-11 4-16 11-18-2 11-3 15-11 18z" fill="#5AA469"/><circle cx="38" cy="58" r="24" fill="#FF9F45"/><circle cx="62" cy="58" r="24" fill="#FFB36B"/><path d="M50 38v40" stroke="#E8864A" stroke-width="2.5"/>';
  I.panda = '<circle cx="27" cy="32" r="11" fill="#2E2A3B"/><circle cx="73" cy="32" r="11" fill="#2E2A3B"/><circle cx="50" cy="56" r="29" fill="#FFF9F0"/><ellipse cx="38" cy="52" rx="9" ry="11" fill="#2E2A3B"/><ellipse cx="62" cy="52" rx="9" ry="11" fill="#2E2A3B"/><circle cx="38" cy="52" r="3.4" fill="#FFF9F0"/><circle cx="62" cy="52" r="3.4" fill="#FFF9F0"/><ellipse cx="50" cy="66" rx="6" ry="4.5" fill="#2E2A3B"/><path d="M43 74a9 6 0 0 0 14 0" fill="none" stroke="#2E2A3B" stroke-width="2.4"/>';
  I.pineapple = '<g fill="#5AA469"><path d="M50 36c-5-13-13-17-20-19 5 11 9 17 20 19zM50 36c5-13 13-17 20-19-5 11-9 17-20 19zM50 34c0-14 0-20 1-25 4 9 4 17-1 25z"/></g><ellipse cx="50" cy="64" rx="25" ry="28" fill="#F5C518"/><g stroke="#E8A800" stroke-width="2.5" fill="none"><path d="M29 52l42 25M71 52L29 77M26 64h48"/></g>';

  /* Q */
  I.quilt = '<rect x="12" y="26" width="76" height="58" rx="6" fill="#E8624A"/><g fill="#F5C518"><rect x="12" y="26" width="25" height="19"/><rect x="63" y="26" width="25" height="19"/><rect x="37" y="45" width="26" height="20"/><rect x="12" y="65" width="25" height="19"/><rect x="63" y="65" width="25" height="19"/></g><g stroke="#FFF9F0" stroke-width="2" fill="none"><path d="M37 26v58M63 26v58M12 45h76M12 65h76"/></g>';
  I.question = '<path d="M33 34a17 17 0 0 1 34 0c0 13-17 13-17 25" fill="none" stroke="#B07BC4" stroke-width="13" stroke-linecap="round"/><circle cx="50" cy="80" r="8" fill="#B07BC4"/>';
  I.quiz = '<rect x="20" y="10" width="60" height="78" rx="5" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="3"/><g stroke="#B9C2CC" stroke-width="3.5" stroke-linecap="round"><path d="M31 32h26M31 46h32M31 60h18"/></g><path d="M54 62l9 10 18-21" fill="none" stroke="#5AA469" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';

  /* R */
  I.rose = '<rect x="46" y="48" width="8" height="40" rx="3" fill="#5AA469"/><path d="M46 60c-13-5-20 2-19 9 9 2 16-2 19-9zM54 72c13-5 20 2 19 9-9 2-16-2-19-9z" fill="#5AA469"/><circle cx="50" cy="34" r="21" fill="#E8624A"/><circle cx="50" cy="34" r="13" fill="#C74A34"/><circle cx="50" cy="34" r="6" fill="#E8624A"/>';
  I.rice = '<path d="M58 22l18-9-9 18zM68 20l15-7-7 16z" fill="#C68642"/><path d="M22 48c4-13 15-19 28-19s24 6 28 19z" fill="#F2EDE4"/><path d="M12 48h76c0 21-17 36-38 36S12 69 12 48z" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="3"/>';
  I.robot = '<circle cx="50" cy="12" r="6" fill="#E8624A"/><rect x="46" y="16" width="8" height="14" rx="4" fill="#7B8794"/><rect x="10" y="44" width="13" height="24" rx="6" fill="#7B8794"/><rect x="77" y="44" width="13" height="24" rx="6" fill="#7B8794"/><rect x="24" y="30" width="52" height="46" rx="8" fill="#B9C2CC"/><rect x="33" y="42" width="34" height="18" rx="4" fill="#2D8FA8"/><circle cx="42" cy="51" r="4" fill="#FFF9F0"/><circle cx="58" cy="51" r="4" fill="#FFF9F0"/><rect x="40" y="64" width="20" height="6" rx="3" fill="#7B8794"/><rect x="31" y="76" width="15" height="14" rx="4" fill="#7B8794"/><rect x="54" y="76" width="15" height="14" rx="4" fill="#7B8794"/>';

  /* S */
  I.seal = '<circle cx="38" cy="18" r="10" fill="#E8624A"/><path d="M14 60c-10-4-14 4-8 10zM12 70c-10 2-12 10-4 12z" fill="#7B8794"/><ellipse cx="46" cy="62" rx="30" ry="20" fill="#7B8794"/><circle cx="74" cy="42" r="15" fill="#8D96A1"/><circle cx="80" cy="38" r="2.8" fill="#2E2A3B"/><circle cx="87" cy="45" r="3.4" fill="#2E2A3B"/>';
  I.soap = '<circle cx="32" cy="28" r="11" fill="#CFE3F7"/><circle cx="55" cy="20" r="8" fill="#CFE3F7"/><circle cx="70" cy="32" r="9" fill="#CFE3F7"/><rect x="16" y="48" width="68" height="30" rx="13" fill="#7ED7F2"/><rect x="26" y="55" width="22" height="7" rx="3.5" fill="#FFF9F0" opacity=".7"/>';

  /* T */
  I.turtle = '<circle cx="84" cy="56" r="11" fill="#8FBF5A"/><circle cx="88" cy="53" r="2.4" fill="#2E2A3B"/><g fill="#8FBF5A"><rect x="24" y="70" width="15" height="11" rx="5"/><rect x="58" y="70" width="15" height="11" rx="5"/></g><ellipse cx="48" cy="56" rx="31" ry="23" fill="#5AA469"/><ellipse cx="48" cy="56" rx="23" ry="16" fill="#3F7F51"/><g fill="#5AA469"><circle cx="48" cy="56" r="6"/><circle cx="34" cy="52" r="5"/><circle cx="62" cy="52" r="5"/><circle cx="40" cy="64" r="5"/><circle cx="56" cy="64" r="5"/></g>';
  I.tent = '<path d="M50 14L88 84H12z" fill="#E8624A"/><path d="M50 14v70" stroke="#C74A34" stroke-width="3"/><path d="M50 40l17 44H33z" fill="#2E2A3B"/><path d="M50 40v44" stroke="#4A4A55" stroke-width="2"/>';
  I.tiger = '<path d="M26 36l-5-19 19 10zM74 36l5-19-19 10z" fill="#FF9F45"/><circle cx="50" cy="54" r="28" fill="#FF9F45"/><g fill="#2E2A3B"><path d="M40 28l4 13-9-8zM60 28l-4 13 9-8z"/><rect x="23" y="49" width="11" height="5" rx="2"/><rect x="66" y="49" width="11" height="5" rx="2"/><rect x="25" y="60" width="9" height="5" rx="2"/><rect x="66" y="60" width="9" height="5" rx="2"/></g><circle cx="40" cy="50" r="4" fill="#2E2A3B"/><circle cx="60" cy="50" r="4" fill="#2E2A3B"/><ellipse cx="50" cy="62" rx="7" ry="5" fill="#F0A8BC"/><path d="M42 70a10 6 0 0 0 16 0" fill="none" stroke="#2E2A3B" stroke-width="2.4"/>';
  I.tomato = '<circle cx="50" cy="58" r="28" fill="#E8624A"/><g fill="#5AA469"><path d="M50 34L32 24l7 13zM50 34l18-10-7 13zM50 32l-3-13 9 11z"/></g><circle cx="50" cy="32" r="5" fill="#3F7F51"/>';

  /* U */
  I.up = '<path d="M50 8l32 36H63v46H37V44H18z" fill="#5AA469"/>';
  I.unicorn = '<path d="M74 24l9-20 1 21z" fill="#F5C518"/><ellipse cx="44" cy="62" rx="27" ry="23" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><circle cx="70" cy="40" r="16" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><path d="M60 28c-9-4-15 3-14 11 6-4 10-4 14-2z" fill="#B07BC4"/><circle cx="74" cy="38" r="2.8" fill="#2E2A3B"/><ellipse cx="84" cy="47" rx="4" ry="3" fill="#F0A8BC"/><path d="M20 58c-9 7-9 19 0 25" fill="none" stroke="#B07BC4" stroke-width="6" stroke-linecap="round"/>';
  I.ukulele = '<rect x="61" y="14" width="13" height="16" rx="4" fill="#6B4420" transform="rotate(-20 67 22)"/><rect x="58" y="28" width="10" height="40" rx="4" fill="#8B5A2B" transform="rotate(-20 63 48)"/><ellipse cx="40" cy="68" rx="26" ry="22" fill="#C68642"/><circle cx="40" cy="66" r="9" fill="#8B5A2B"/><g stroke="#FFF9F0" stroke-width="1.6"><path d="M32 86L64 26M40 88L70 30"/></g>';

  /* V */
  I.vest = '<path d="M33 20h34l-6 12-11 6-11-6z" fill="#2D8FA8"/><path d="M33 20l13 20-7 46H22l4-40z" fill="#2D8FA8"/><path d="M67 20L54 40l7 46h17l-4-40z" fill="#2D8FA8"/><circle cx="46" cy="58" r="2.8" fill="#F5C518"/><circle cx="54" cy="58" r="2.8" fill="#F5C518"/>';
  I.violin = '<rect x="54" y="12" width="9" height="36" rx="4" fill="#6B4420" transform="rotate(-20 58 30)"/><ellipse cx="46" cy="46" rx="16" ry="14" fill="#8B5A2B"/><ellipse cx="44" cy="68" rx="22" ry="20" fill="#8B5A2B"/><g stroke="#FFF9F0" stroke-width="1.6"><path d="M36 86L58 20M44 88L64 24"/></g><path d="M18 34l52 48" stroke="#E8A85C" stroke-width="4" stroke-linecap="round"/>';
  I.volcano = '<path d="M38 32c3-13 7-20 12-26 5 6 9 13 12 26z" fill="#E8624A"/><path d="M42 36c2-8 5-13 8-17 3 4 6 9 8 17z" fill="#F5C518"/><path d="M12 84L38 30h24l26 54z" fill="#8B5A2B"/><path d="M38 30h24l7 15H31z" fill="#6B4420"/><path d="M10 84h80l-3 8H13z" fill="#5AA469"/>';

  /* W */
  I.wolf = '<path d="M50 20L33 32 18 22l5 20c-6 6-9 14-9 21 0 16 16 27 36 27s36-11 36-27c0-7-3-15-9-21l5-20-15 10z" fill="#7B8794"/><circle cx="39" cy="54" r="4.2" fill="#F5C518"/><circle cx="61" cy="54" r="4.2" fill="#F5C518"/><ellipse cx="50" cy="70" rx="11" ry="9" fill="#B9C2CC"/><ellipse cx="50" cy="66" rx="4.6" ry="3.6" fill="#2E2A3B"/>';
  I.web = '<g stroke="#9AA5B1" stroke-width="2.6" fill="none"><path d="M50 8v84M8 50h84M20 20l60 60M80 20L20 80"/><path d="M50 22L68 32 78 50 68 68 50 78 32 68 22 50 32 32z"/><path d="M50 38L60 44 65 50 60 56 50 62 40 56 35 50 40 44z"/></g><circle cx="50" cy="50" r="6" fill="#2E2A3B"/>';
  I.water = '<path d="M30 22h40l-5 58a8 8 0 0 1-8 7H43a8 8 0 0 1-8-7z" fill="#CFE3F7" stroke="#7ED7F2" stroke-width="2"/><path d="M33 46h34l-3 34a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7z" fill="#4FB6D0"/>';
  I.watch = '<rect x="39" y="4" width="22" height="26" rx="5" fill="#2D8FA8"/><rect x="39" y="70" width="22" height="26" rx="5" fill="#2D8FA8"/><circle cx="50" cy="50" r="25" fill="#FFF9F0" stroke="#7B8794" stroke-width="5"/><path d="M50 35v15l11 7" stroke="#2E2A3B" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';

  /* X */
  I.six = num(6, '#B07BC4');

  /* Y */
  I.yak = '<path d="M16 60c-5 15 0 24 5 26l8-15zM80 60c5 15 0 24-5 26l-8-15z" fill="#6B4420"/><ellipse cx="46" cy="62" rx="31" ry="22" fill="#6B4420"/><path d="M62 32c-9-5-14 2-12 9 5-5 8-6 12-4zM88 32c9-5 14 2 12 9" fill="#F0D5B0"/><circle cx="74" cy="44" r="15" fill="#8B5A2B"/><circle cx="79" cy="41" r="2.8" fill="#2E2A3B"/><path d="M60 32c-8-6-13 0-11 8 4-5 7-6 11-4z" fill="#F0D5B0"/><path d="M88 32c8-6 13 0 11 8" fill="#F0D5B0"/>';
  I.yogurt = '<path d="M72 18c7 1 9 7 4 12l-11 11" stroke="#B9C2CC" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="26" y="26" width="48" height="12" rx="4" fill="#F0A8BC"/><path d="M30 38h40l-6 44a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7z" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><rect x="36" y="54" width="28" height="16" rx="3" fill="#F0A8BC"/>';
  I.yacht = '<rect x="47" y="12" width="6" height="54" fill="#8B5A2B"/><path d="M53 16h28L53 58z" fill="#2D8FA8"/><path d="M47 24H25l22 32z" fill="#E8624A"/><path d="M12 66h76l-10 18H22z" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><path d="M4 86c11-6 19 4 28 0s17 4 25 0 18 4 27 0v8H4z" fill="#4FB6D0"/>';

  /* Z */
  I.zebra = '<ellipse cx="44" cy="60" rx="29" ry="20" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><circle cx="74" cy="42" r="15" fill="#FFF9F0" stroke="#E7DAC7" stroke-width="2"/><g fill="#2E2A3B"><rect x="28" y="42" width="5" height="35" rx="2"/><rect x="40" y="41" width="5" height="37" rx="2"/><rect x="52" y="42" width="5" height="35" rx="2"/><rect x="66" y="30" width="4" height="17" rx="2"/><rect x="77" y="31" width="4" height="16" rx="2"/></g><circle cx="82" cy="42" r="2.6" fill="#2E2A3B"/><g stroke="#2E2A3B" stroke-width="5" stroke-linecap="round"><path d="M30 78v10M56 78v10"/></g>';
  I.zero = num(0, '#2D8FA8');
  I.zoo = '<path d="M8 36a42 24 0 0 1 84 0z" fill="#5AA469"/><rect x="12" y="34" width="14" height="58" fill="#C68642"/><rect x="74" y="34" width="14" height="58" fill="#C68642"/><rect x="30" y="44" width="40" height="16" rx="4" fill="#F5C518"/><path d="M37 52h26" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/><g stroke="#8B5A2B" stroke-width="4"><path d="M36 68v24M50 68v24M64 68v24"/></g>';


  /* extra keyword pictures */
  I.bear = '<circle cx="26" cy="28" r="10" fill="#8B5A2B"/><circle cx="74" cy="28" r="10" fill="#8B5A2B"/><circle cx="26" cy="28" r="5" fill="#C68642"/><circle cx="74" cy="28" r="5" fill="#C68642"/><ellipse cx="50" cy="60" rx="30" ry="28" fill="#8B5A2B"/><ellipse cx="50" cy="70" rx="16" ry="12" fill="#E8C9A0"/><circle cx="40" cy="53" r="3.8" fill="#2E2A3B"/><circle cx="60" cy="53" r="3.8" fill="#2E2A3B"/><ellipse cx="50" cy="66" rx="6" ry="4.6" fill="#2E2A3B"/><path d="M50 70v4M50 74a5 4 0 0 1-6 0M50 74a5 4 0 0 0 6 0" stroke="#2E2A3B" stroke-width="2.2" fill="none" stroke-linecap="round"/>';

  I.horse = '<path d="M72 26l-7-11 13 5z" fill="#8B5A2B"/><ellipse cx="40" cy="60" rx="29" ry="19" fill="#C68642"/><path d="M62 56c2-13 8-21 16-27l9 8-3 10 7 6-9 11-15 4z" fill="#C68642"/><circle cx="83" cy="37" r="2.6" fill="#2E2A3B"/><path d="M70 30c-8 7-10 17-10 25" stroke="#5A3A1C" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M12 58c-10 4-12 17-6 23" stroke="#5A3A1C" stroke-width="6" fill="none" stroke-linecap="round"/><g stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"><path d="M24 76v13M38 76v13M52 74v15M62 72v17"/></g>';
  I.nose = '<circle cx="50" cy="50" r="34" fill="#F0D5B0"/><circle cx="35" cy="41" r="4" fill="#2E2A3B"/><circle cx="65" cy="41" r="4" fill="#2E2A3B"/><circle cx="50" cy="56" r="16" fill="#F7E2C4"/><path d="M50 44v12c0 4-3 7-7 7" fill="none" stroke="#C68642" stroke-width="5" stroke-linecap="round"/><circle cx="44" cy="64" r="2.6" fill="#C68642"/><circle cx="56" cy="64" r="2.6" fill="#C68642"/><path d="M40 76a12 8 0 0 0 20 0" fill="none" stroke="#C74A34" stroke-width="3.5" stroke-linecap="round"/>';

  /* interface extras */
  I.starOn = '<path d="M50 8l12 26 28 3-21 19 6 28-25-14-25 14 6-28-21-19 28-3z" fill="#F5C518"/>';
  I.starOff = '<path d="M50 8l12 26 28 3-21 19 6 28-25-14-25 14 6-28-21-19 28-3z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>';
  I.camera = '<rect x="8" y="28" width="84" height="58" rx="10" fill="currentColor"/><circle cx="50" cy="57" r="19" fill="#FFF6E9"/><circle cx="50" cy="57" r="11" fill="currentColor"/><path d="M34 28l7-12h18l7 12z" fill="currentColor"/>';
  I.house2 = '<path d="M50 12L92 48H8z" fill="currentColor"/><path d="M20 48h60v40H20z" fill="currentColor"/>';
  I.trophy = '<path d="M30 14h40v26a20 20 0 0 1-40 0z" fill="#F5C518"/><path d="M30 20H16c0 14 6 20 16 22M70 20h14c0 14-6 20-16 22" fill="none" stroke="#E8A800" stroke-width="6"/><rect x="44" y="58" width="12" height="16" fill="#E8A800"/><rect x="28" y="74" width="44" height="12" rx="4" fill="#C68642"/>';
})();
