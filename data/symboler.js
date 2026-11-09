// INSTALLASJONSSYMBOLER – LettFagprøve
// Egne strektegninger (SVG) av vanlige symboler for installasjonstegninger.
// Brukes av spørsmål med feltet  figur: "navn".  Fargen følger tekstfargen (lyst/mørkt tema).
(function () {
  const svg = (innhold) =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${innhold}</svg>`;
  const tekst = (x, y, t) => `<text x="${x}" y="${y}" font-size="16" font-family="sans-serif" fill="currentColor" stroke="none">${t}</text>`;

  // Byggeklosser
  const sirkel = (x = 40, y = 68) => `<circle cx="${x}" cy="${y}" r="11"/>`;
  const arm = `<line x1="47" y1="60" x2="62" y2="30"/><line x1="62" y1="30" x2="74" y2="35"/>`;
  const plugg = `<line x1="18" y1="50" x2="47" y2="50"/><path d="M62 35 A15 15 0 0 0 62 65"/>`;
  const jord = `<line x1="41" y1="40" x2="41" y2="60"/>`;

  window.SYMBOLER = {
    "bryter-1p": svg(sirkel() + arm),
    "bryter-2p": svg(sirkel() + arm + `<line x1="58.5" y1="37" x2="70.5" y2="42"/>`),
    "bryter-3stk": svg(sirkel() + arm + `<line x1="51" y1="68" x2="58" y2="68"/>` + tekst(61, 74, "3")),
    "serievender": svg(sirkel(50, 70) +
      `<line x1="43" y1="61" x2="30" y2="38"/><line x1="30" y1="38" x2="18" y2="43"/>` +
      `<line x1="57" y1="61" x2="70" y2="38"/><line x1="70" y1="38" x2="82" y2="43"/>`),
    "vekselvender": svg(sirkel(50, 55) +
      `<line x1="56" y1="46" x2="68" y2="24"/><line x1="68" y1="24" x2="80" y2="29"/>` +
      `<line x1="44" y1="64" x2="32" y2="86"/><line x1="32" y1="86" x2="20" y2="81"/>`),
    "kryssvender": svg(sirkel(50, 50) +
      `<line x1="57" y1="43" x2="70" y2="24"/><line x1="70" y1="24" x2="82" y2="29"/>` +
      `<line x1="43" y1="43" x2="30" y2="24"/><line x1="30" y1="24" x2="18" y2="29"/>` +
      `<line x1="57" y1="57" x2="70" y2="76"/><line x1="70" y1="76" x2="82" y2="71"/>` +
      `<line x1="43" y1="57" x2="30" y2="76"/><line x1="30" y1="76" x2="18" y2="71"/>`),
    "trekkbryter": svg(sirkel() + `<line x1="47" y1="60" x2="62" y2="30"/><line x1="62" y1="30" x2="62" y2="50"/>` +
      `<polygon points="57,46 67,46 62,58" fill="currentColor"/>`),
    "trykknappbryter": svg(sirkel() + `<circle cx="40" cy="68" r="5"/>` + arm),
    "dimmer": svg(sirkel() + arm + `<polyline points="50,47 76,47 56,30"/>`),
    "trappeautomat": svg(sirkel() + arm + tekst(74, 50, "t")),
    "trykknapp": svg(`<circle cx="50" cy="50" r="13"/><circle cx="50" cy="50" r="6"/>`),
    "trykknapp-lampe": svg(`<circle cx="50" cy="50" r="13"/><circle cx="50" cy="50" r="7"/>` +
      `<line x1="45" y1="45" x2="55" y2="55"/><line x1="55" y1="45" x2="45" y2="55"/>`),
    "stikk-uten-jord": svg(plugg),
    "stikk-med-jord": svg(plugg + jord),
    "stikk-3p": svg(plugg + jord + `<line x1="25" y1="58" x2="33" y2="42"/>` + tekst(20, 38, "3")),
    "stikk-flere": svg(plugg + jord + `<line x1="60" y1="38" x2="68" y2="28"/>` + tekst(52, 24, "3"))
  };
})();
