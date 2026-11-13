/* LettFagprøve – appens logikk.
   Sider (adresse etter #):
     #/                 forside
     #/ov/<kategori>    øving i én kategori ("alle" = alle, "feil" = siste feil, "repeter" = smart repetisjon)
     #/kategorier       velg kategori
     #/eksamen          prøveeksamen
     #/symbolprove      kort prøve med bare installasjonssymboler
     #/spill            symbolspill på tid (rekord lagres)
     #/regning          liste over regneoppgaver
     #/regning/<id>     én regneoppgave
     #/statistikk       fremgang
     #/formler          formelsamling (data/formler.js)
*/
(function () {
  "use strict";

  const INN = window.INNSTILLINGER;
  const SP = window.SPORSMAL || [];
  const RO = window.REGNEOPPGAVER || [];
  const SYMBOLSPM = SP.filter((s) => s.kategori === "symboler");
  const app = document.getElementById("app");
  const tittelEl = document.getElementById("tittel");
  const tilbakeEl = document.getElementById("tilbake");

  // Mål for «Klar for eksamen?» (egne mål, endre her).
  const KLAR = { prover: 15, bestattAvSiste10: 5, symbolprover: 3, regning: 10 };
  const SYMBOLPROVE = { antall: 10, minutter: 5 };
  const SPILL_SEKUNDER = 60;

  // ---------- Lagring (lokalt i nettleseren) ----------
  const NOKKEL = "elproven-v1";
  function hent() {
    try { return JSON.parse(localStorage.getItem(NOKKEL)) || {}; } catch (e) { return {}; }
  }
  // Standardverdier brukes både ved oppstart og ved «Nullstill fremgang». Ødelagte felt erstattes.
  const erObj = (x) => x && typeof x === "object" && !Array.isArray(x);
  function normaliser(d) {
    const ut = erObj(d) ? d : {};
    ["svar", "regning", "lest", "skriftlig", "logg"].forEach((k) => { if (!erObj(ut[k])) ut[k] = {}; });
    if (!Array.isArray(ut.eksamener)) ut.eksamener = [];
    if (typeof ut.rekord !== "number") ut.rekord = 0;
    if (ut.pagaende && !(erObj(ut.pagaende) && Array.isArray(ut.pagaende.ider) && Array.isArray(ut.pagaende.valg))) delete ut.pagaende;
    if (ut.eksamensdato && !/^\d{4}-\d{2}-\d{2}$/.test(ut.eksamensdato)) delete ut.eksamensdato;
    return ut;
  }
  let data = normaliser(hent());
  function lagre() {
    try { localStorage.setItem(NOKKEL, JSON.stringify(data)); } catch (e) { /* privat modus o.l. */ }
  }
  // ---------- Smart repetisjon (Leitner-bokser) ----------
  // Hvert spørsmål ligger i en boks 0–5. Riktig svar flytter det én boks opp, feil svar sender det til boks 1.
  // Spørsmålet kommer tilbake etter så mange dager som boksen sier.
  const INTERVALL = [0, 1, 3, 7, 16, 35];
  const SITTER = 4; // fra boks 4 regnes spørsmålet som lært
  const REPETISJON = { maks: 20, nyeHvisFa: 10 };
  // Dato som «ÅÅÅÅ-MM-DD» i lokal tid (ikke UTC, ellers blir det feil dag rundt midnatt).
  const dag = (pluss) => {
    const d = new Date(); d.setDate(d.getDate() + (pluss || 0));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  // Svar fra før repetisjonen fantes har ingen boks: de regnes som klare til repetisjon i dag.
  const boksAv = (s) => (s.boks !== undefined ? s.boks : (s.sistRiktig ? 1 : 0));
  const forfaller = (s) => s.neste || dag();
  // Dagens logg (for dagsplanen på forsiden): nye spørsmål, leste temaer og løste oppgaver i dag.
  function idag() {
    if (data.logg.dato !== dag()) data.logg = { dato: dag(), nye: 0, lest: 0, oppgaver: 0 };
    return data.logg;
  }
  function registrerSvar(id, riktig) {
    if (!erObj(data.svar[id])) idag().nye++;
    const s = erObj(data.svar[id]) ? data.svar[id] : { forsok: 0, riktige: 0, sistRiktig: false, boks: 0 };
    const forrige = boksAv(s); // før sistRiktig endres
    // Riktig svar før spørsmålet har forfalt flytter det ikke opp, ellers kunne «lært» nås på én dag.
    const forTidlig = riktig && s.sistRiktig && s.neste && s.neste > dag();
    s.forsok++; if (riktig) s.riktige++; s.sistRiktig = riktig;
    if (!forTidlig) {
      s.boks = riktig ? Math.min(forrige + 1, INTERVALL.length - 1) : 1;
      s.neste = dag(INTERVALL[s.boks]);
    }
    data.svar[id] = s; lagre();
  }
  // Spørsmål som skal repeteres i dag: de mest forfalte og svakeste først, så nye hvis det er få.
  function repetisjonsListe() {
    const idag = dag();
    const forfalt = SP.filter((s) => data.svar[s.id] && forfaller(data.svar[s.id]) <= idag)
      .sort((a, b) => forfaller(data.svar[a.id]).localeCompare(forfaller(data.svar[b.id])) || boksAv(data.svar[a.id]) - boksAv(data.svar[b.id]));
    const liste = forfalt.slice(0, REPETISJON.maks);
    if (liste.length < REPETISJON.nyeHvisFa) liste.push(...stokk(SP.filter((s) => !data.svar[s.id])).slice(0, REPETISJON.nyeHvisFa - liste.length));
    return { liste, forfalt: forfalt.length };
  }
  const antallLaert = () => SP.filter((s) => data.svar[s.id] && boksAv(data.svar[s.id]) >= SITTER).length;
  const proverAvType = (type) => data.eksamener.filter((e) => (e.type || "eksamen") === type);

  // ---------- Hjelpere ----------
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function stokk(liste) {
    const a = liste.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  // Valgfri figur: SVG-symbol (feltet "figur", data/symboler.js) eller foto (feltet "bilde", data/bilder.js).
  function foto(s, liten) {
    const b = s.bilde && window.BILDER && window.BILDER[s.bilde];
    if (!b) return "";
    return `<figure class="foto${liten ? " liten-foto" : ""}">
      <img src="bilder/${esc(s.bilde)}" alt="${esc(b.alt)}" loading="lazy" decoding="async">
      ${liten ? "" : `<figcaption>${b.kilde
        ? `Foto: ${esc(b.fotograf)}, ${esc(b.lisens)}, <a href="${esc(b.kilde)}" target="_blank" rel="noopener">Wikimedia Commons</a>`
        : `Foto: ${esc(b.fotograf)}`}</figcaption>`}
    </figure>`;
  }
  const figur = (s, liten) => (s.figur && window.SYMBOLER && window.SYMBOLER[s.figur])
    ? `<div class="figur${liten ? " liten-figur" : ""}" aria-hidden="true">${window.SYMBOLER[s.figur]}</div>` : foto(s, liten);
  const kategoriKode = (id) => (INN.kategorier.find((k) => k.id === id) || {}).ikon || "";
  const kategoriNavn = (id) => (INN.kategorier.find((k) => k.id === id) || {}).navn || id;
  function prosent(a, b) { return b ? Math.round((a / b) * 100) : 0; }
  function kategoriStat(id) {
    const liste = SP.filter((s) => s.kategori === id);
    const besvart = liste.filter((s) => data.svar[s.id]);
    const riktig = liste.filter((s) => data.svar[s.id] && data.svar[s.id].sistRiktig);
    return { totalt: liste.length, besvart: besvart.length, riktig: riktig.length };
  }
  // Stokker svaralternativene og husker hvilket som er riktig.
  function lagOppgave(s) {
    const rekkefolge = stokk(s.alternativer.map((_, i) => i));
    return { s, rekkefolge, riktigVisning: rekkefolge.indexOf(s.riktig) };
  }
  const BOKSTAV = "ABCDEF";
  const alternativKnapp = (o, v, ekstraKlasse) =>
    `<button class="alternativ ${ekstraKlasse || ""}" data-v="${v}"><span class="bokstav" aria-hidden="true">${BOKSTAV[v]}</span><span>${esc(o.s.alternativer[o.rekkefolge[v]])}</span></button>`;
  function sett(tittel, visTilbake) {
    if (tittel === INN.appNavn && /^Lett/.test(tittel)) tittelEl.innerHTML = `<span class="lett">Lett</span>${esc(tittel.slice(4))}`;
    else tittelEl.textContent = tittel;
    tilbakeEl.hidden = !visTilbake;
    document.title = tittel === INN.appNavn ? INN.appNavn + " – øv til teorieksamen i elektrikerfaget" : tittel + " – " + INN.appNavn;
  }

  // ---------- Lyd (opplesning med nettleserens norske stemme) ----------
  const kanLyd = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  function stopLyd() { if (kanLyd) try { speechSynthesis.cancel(); } catch (e) {} }
  function lesOpp(o) {
    if (!kanLyd) return;
    stopLyd();
    const tekst = (o.s.figur ? "Se på symbolet. " : "") + o.s.sporsmal + " " +
      o.rekkefolge.map((orig, v) => `${BOKSTAV[v]}: ${o.s.alternativer[orig]}.`).join(" ");
    const ren = tekst.replace(/·/g, " ganger ").replace(/≤/g, " mindre enn eller lik ").replace(/≥/g, " større enn eller lik ")
      .replace(/Ω/g, " ohm").replace(/mm²/g, " kvadratmillimeter").replace(/m²/g, " kvadratmeter").replace(/√3/g, " rot tre ")
      .replace(/I²t/g, "I i andre t").replace(/²/g, " i andre").replace(/×/g, " ganger ").replace(/°C/g, " grader").replace(/°/g, " grader")
      .replace(/IΔn/g, "I delta n").replace(/ΔU/g, "delta U").replace(/Δ/g, "delta ").replace(/φ/g, "fi").replace(/ρ/g, "ro")
      .replace(/≈/g, " omtrent ").replace(/→/g, " til ").replace(/§/g, " paragraf ");
    const u = new SpeechSynthesisUtterance(ren);
    u.lang = "nb-NO"; u.rate = 0.95;
    const stemme = speechSynthesis.getVoices().find((v) => /^(nb|no|nn)/i.test(v.lang));
    if (stemme) u.voice = stemme;
    speechSynthesis.speak(u);
  }
  const lydKnapp = kanLyd ? `<button class="lyd" id="lyd" aria-label="Les opp spørsmålet" title="Les opp (L)"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9"/></svg>Les opp</button>` : "";
  // «Forstå spørsmålet»: hva spørsmålet spør om, og hva symbolene i formlene betyr (data/forsta.js).
  const FORSTA = window.FORSTA || { SYMBOLER: [], TOLKNING: {}, UTEN_SYMBOLER: [] };
  function forstaBoks(s) {
    const tolk = FORSTA.TOLKNING[s.id];
    const tekst = [s.sporsmal, ...s.alternativer, tolk || ""].join(" | ");
    const sym = FORSTA.UTEN_SYMBOLER.includes(s.id) ? [] : FORSTA.SYMBOLER.filter((x) => x.re.test(tekst));
    if (!tolk && !sym.length) return "";
    return `<details class="forsta">
      <summary>Forstå spørsmålet${sym.length ? " og symbolene" : ""}</summary>
      ${tolk ? `<p>${esc(tolk)}</p>` : ""}
      ${sym.length ? `<dl>${sym.map((x) => `<div><dt>${esc(x.sym)}</dt><dd>${esc(x.tekst)}</dd></div>`).join("")}</dl>` : ""}
    </details>`;
  }
  function koblLyd(o) { const b = document.getElementById("lyd"); if (b) b.addEventListener("click", () => lesOpp(o)); }

  // ---------- Hurtigtaster ----------
  let tast = null; // funksjon for siden som er åpen
  document.addEventListener("keydown", (ev) => {
    if (!tast || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (ev.target && /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)) return;
    // Enter/mellomrom på en knapp, lenke eller «Forstå»-boksen skal gjøre det elementet gjør, ikke hoppe videre.
    if ((ev.key === "Enter" || ev.key === " ") && ev.target && /^(BUTTON|A|SUMMARY)$/.test(ev.target.tagName) && ev.target.id !== "neste") return;
    tast(ev);
  });
  // Gir indeks for tastene 1–6 eller A–F, ellers -1.
  function valgFraTast(ev, antall) {
    const k = ev.key.toLowerCase();
    let i = "123456".indexOf(k);
    if (i < 0) i = "abcdef".indexOf(k);
    return i >= 0 && i < antall ? i : -1;
  }
  const tips = `<p class="tips dempet liten">Hurtigtaster: 1–4 eller A–D for å svare · Enter for neste${kanLyd ? " · L for opplesning" : ""}</p>`;

  // ---------- Tema ----------
  const TEMA = "elproven-tema";
  function brukTema(t) {
    if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme");
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "dark" ? "#141515" : "#e6e6e1");
    const k = document.getElementById("tema"); if (k) k.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
  }
  try { brukTema(localStorage.getItem(TEMA)); } catch (e) {}
  document.getElementById("tema").addEventListener("click", () => {
    const naa = document.documentElement.getAttribute("data-theme") || "light";
    const ny = naa === "dark" ? "light" : "dark";
    brukTema(ny); try { localStorage.setItem(TEMA, ny); } catch (e) {}
  });
  tilbakeEl.addEventListener("click", () => { if (history.length > 1) history.back(); else location.hash = "#/"; });

  // ---------- «Klar for eksamen?» ----------
  function klarStatus() {
    const eks = proverAvType("eksamen");
    const sym = proverAvType("symbol");
    return [
      { navn: `Fullfør ${KLAR.prover} prøveeksamener`, naa: Math.min(eks.length, KLAR.prover), maal: KLAR.prover },
      { navn: `Bestå ${KLAR.bestattAvSiste10} av de 10 siste prøveeksamenene`, naa: Math.min(eks.slice(-10).filter((e) => e.bestatt).length, KLAR.bestattAvSiste10), maal: KLAR.bestattAvSiste10 },
      { navn: `Bestå ${KLAR.symbolprover} symbolprøver`, naa: Math.min(sym.filter((e) => e.bestatt).length, KLAR.symbolprover), maal: KLAR.symbolprover },
      { navn: `Løs ${Math.min(KLAR.regning, RO.length)} regneoppgaver riktig`, naa: Math.min(RO.filter((r) => data.regning[r.id] && (data.regning[r.id].lost || data.regning[r.id].sistRiktig)).length, KLAR.regning), maal: Math.min(KLAR.regning, RO.length) }
    ];
  }

  // ---------- Dagsplan ----------
  // Med eksamensdato fordeles spørsmålene som ikke er øvd ennå, jevnt over dagene som er igjen.
  const SKR = window.SKRIFTLIG || [];
  const dagerTil = (dato) => Math.round((new Date(dato + "T12:00") - new Date(dag() + "T12:00")) / 86400000);
  function dagsplan() {
    const logg = idag();
    const rep = repetisjonsListe();
    const ikkeOvd = SP.filter((s) => !data.svar[s.id]).length;
    const igjen = data.eksamensdato ? dagerTil(data.eksamensdato) : null;
    const nyePerDag = ikkeOvd ? Math.min(ikkeOvd, Math.max(5, igjen && igjen > 0 ? Math.ceil(ikkeOvd / Math.max(1, igjen - 3)) : 10)) : 0;
    const nesteKurs = kursIder().find((k) => !data.lest[k]);
    const nesteOppg = SKR.find((o) => !(data.skriftlig[o.id] && data.skriftlig[o.id].ferdig)) || RO.find((r) => !(data.regning[r.id] && (data.regning[r.id].lost || data.regning[r.id].sistRiktig)));
    const oppgHref = nesteOppg ? (nesteOppg.deler ? `#/skriftlig/${nesteOppg.id}` : `#/regning/${nesteOppg.id}`) : "#/skriftlig";
    const punkter = [];
    if (rep.forfalt) punkter.push({ href: "#/ov/repeter", tekst: `Repeter ${Math.min(rep.forfalt, REPETISJON.maks)} spørsmål du er i ferd med å glemme`, ferdig: false });
    if (nyePerDag) punkter.push({ href: "#/ov/nye", tekst: `Øv på ${nyePerDag} nye spørsmål`, ferdig: logg.nye >= nyePerDag, teller: `${Math.min(logg.nye, nyePerDag)}/${nyePerDag}` });
    if (nesteKurs) punkter.push({ href: `#/kurs/${nesteKurs}`, tekst: `Les teori: ${kategoriNavn(nesteKurs)}`, ferdig: logg.lest > 0 });
    punkter.push(logg.oppgaver > 0 ? { href: oppgHref, tekst: "Regn én oppgave", ferdig: true }
      : { href: oppgHref, tekst: nesteOppg ? `Regn én oppgave: ${nesteOppg.tittel}` : "Regn en skriftlig oppgave på nytt", ferdig: false });
    const tidTekst = igjen === null ? "Legg inn eksamensdatoen, så fordeles spørsmålene på dagene du har igjen."
      : igjen > 0 ? `Eksamen om ${igjen} ${igjen === 1 ? "dag" : "dager"}. ${ikkeOvd} spørsmål er ikke øvd ennå.`
      : igjen === 0 ? "Eksamen i dag. Lykke til!" : "Eksamensdatoen har passert. Legg inn en ny dato hvis du skal opp igjen.";
    return `<div class="seksjon-tittel"><h2>Plan for i dag</h2><span class="etikett">${punkter.filter((p) => p.ferdig).length}/${punkter.length} gjort</span></div>
      <section class="kort dagsplan">
        ${punkter.map((p) => `<a class="klar-rad plan-rad ${p.ferdig ? "ok" : ""}" href="${p.href}">
          <span class="boks" aria-hidden="true">${p.ferdig ? "✓" : ""}</span><span>${esc(p.tekst)}</span><span class="teller">${p.teller ? p.teller : p.ferdig ? "gjort" : "›"}</span></a>`).join("")}
        <p class="dempet liten" style="margin:10px 0 6px">${esc(tidTekst)}</p>
        <label class="liten dato-felt">Eksamensdato <input type="date" id="eksamensdato" value="${esc(data.eksamensdato || "")}"></label>
      </section>`;
  }
  function pagaendeBoks() {
    const p = data.pagaende;
    if (!p) return "";
    const besvart = p.valg.filter((v) => v !== null).length;
    return `<a class="kort pagaende" href="#/${p.type === "symbol" ? "symbolprove" : "eksamen"}">
      <span><strong>Fortsett ${esc(p.tittel.toLowerCase())}</strong><br><span class="dempet liten">${besvart} av ${p.ider.length} besvart · ${Math.ceil(p.igjenMs / 60000)} min igjen</span></span><span aria-hidden="true">›</span></a>`;
  }

  // ---------- Sider ----------
  function forside() {
    sett(INN.appNavn, false);
    const besvart = SP.filter((s) => data.svar[s.id]).length;
    const riktig = SP.filter((s) => data.svar[s.id] && data.svar[s.id].sistRiktig).length;
    const feil = SP.filter((s) => data.svar[s.id] && !data.svar[s.id].sistRiktig).length;
    const sisteEks = proverAvType("eksamen").slice(-1)[0];
    const klar = klarStatus();
    const alleKlar = klar.every((k) => k.naa >= k.maal);
    const e = INN.eksamen;
    // Menyen er satt opp som en kursfortegnelse: K1, K2 …
    const rep = repetisjonsListe();
    const repTekst = rep.forfalt ? `${rep.liste.length} spm` : rep.liste.length ? `${rep.liste.length} nye` : "ferdig";
    const kurser = [
      { href: "#/ov/repeter", navn: "Repeter i dag", under: "Smart repetisjon: det du er i ferd med å glemme, kommer igjen akkurat i tide", hoyre: repTekst, av: !rep.liste.length },
      { href: "#/ov/alle", navn: "Øv på alt", under: "Tilfeldig rekkefølge, forklaring etter hvert svar", hoyre: `${SP.length} spm` },
      { href: "#/kurs", navn: "Teorikurs", under: "Kort teori per tema med NEK-henvisninger, så rett til spørsmålene", hoyre: `${kursIder().filter((k) => data.lest[k]).length}/${kursIder().length} lest`, av: !kursIder().length },
      { href: "#/kategorier", navn: "Velg tema", under: "NEK 400, FEL/FSE, dimensjonering, symboler", hoyre: `${INN.kategorier.length} temaer` },
      { href: "#/regning", navn: "Regneoppgaver", under: "Skriv inn svaret, få hint og løsningen steg for steg", hoyre: `${RO.length} stk` },
      ...(SKR.length ? [{ href: "#/skriftlig", navn: "Skriftlige oppgaver", under: "Hele oppgaver som på eksamen: dimensjonering med full utregning og løsningsforslag", hoyre: `${SKR.filter((o) => data.skriftlig[o.id] && data.skriftlig[o.id].ferdig).length}/${SKR.length} gjort` }] : []),
      { href: "#/formler", navn: "Formelsamling", under: "Ohms lov, effekt, spenningsfall, vern, kortslutning, motor", hoyre: `${(window.FORMLER || []).reduce((n, g) => n + g.formler.length, 0)} formler` },
      ...(SYMBOLSPM.length ? [
        { href: "#/symbolprove", navn: "Symbolprøve", under: `${SYMBOLPROVE.antall} installasjonssymboler på ${SYMBOLPROVE.minutter} min`, hoyre: `${proverAvType("symbol").length} tatt` },
        { href: "#/spill", navn: "Symbolspill", under: `${SPILL_SEKUNDER} sekunder, slå rekorden din`, hoyre: `rekord ${data.rekord || 0}` }
      ] : []),
      { href: "#/ov/feil", navn: "Repeter feil", under: "Bare spørsmålene du sist svarte feil på", hoyre: `${feil} spm`, av: !feil },
      { href: "#/statistikk", navn: "Fremgang", under: "Per tema og historikk for prøveeksamener", hoyre: "" }
    ];
    app.innerHTML = `
      <div class="status" role="group" aria-label="Status">
        <div><div class="etikett">Riktig</div><div class="verdi">${prosent(riktig, SP.length)}<small> %</small></div></div>
        <div title="Øvd på ${besvart} av ${SP.length}. Lært = svart riktig flere ganger med økende mellomrom."><div class="etikett">Lært</div><div class="verdi">${antallLaert()}<small>/${SP.length}</small></div></div>
        <div><div class="etikett">Siste prøve</div><div class="verdi">${sisteEks ? `${sisteEks.prosent}<small> %</small>` : "–"}</div></div>
      </div>
      ${pagaendeBoks()}
      <a class="start-eksamen" href="#/eksamen">
        <span class="tekst"><span class="etikett" style="color:inherit;opacity:.8">Prøveeksamen</span><strong>Start en full prøve</strong>
          <span class="liten" style="opacity:.85">${e.antallSporsmal} spørsmål · ${e.minutter} min · bestått ved ${e.bestattProsent} %</span></span>
        <span class="pil" aria-hidden="true">→</span>
      </a>
      ${dagsplan()}
      <div class="seksjon-tittel"><h2>Kursfortegnelse</h2><span class="etikett">Øving</span></div>
      <nav class="kurser" aria-label="Hovedmeny">
        ${kurser.map((k, n) => `<a class="kurs-rad" href="${k.href}" ${k.av ? 'aria-disabled="true"' : ""}>
          <span class="kurs-nr">K${n + 1}</span>
          <span class="navn">${esc(k.navn)}<small>${esc(k.under)}</small></span>
          <span class="hoyre">${esc(k.hoyre)} ›</span></a>`).join("")}
      </nav>
      <div class="seksjon-tittel"><h2>${alleKlar ? "Klar for eksamen" : "Klar for eksamen?"}</h2><span class="etikett">${klar.filter((k) => k.naa >= k.maal).length}/${klar.length} mål</span></div>
      <section class="kort klar">
        <p class="dempet liten" style="margin:0 0 4px">${alleKlar ? "Du har nådd alle målene. Fortsett å repetere feil fram til eksamen." : "Nå disse målene, så vet du at du har øvd nok."}</p>
        ${klar.map((k) => `<div class="klar-rad ${k.naa >= k.maal ? "ok" : ""}">
          <span class="boks" aria-hidden="true">${k.naa >= k.maal ? "✓" : ""}</span>
          <span>${esc(k.navn)}</span><span class="teller">${k.naa}/${k.maal}</span>
          <div class="stolpe"><span style="width:${prosent(k.naa, k.maal)}%"></span></div></div>`).join("")}
      </section>
      <p class="info">Øvingsapp for teorieksamen i elektrikerfaget (Vg3). Ikke en offisiell eksamen. Den ekte eksamenen er skriftlig (5 timer) med utregninger og begrunnelser. Her drilles kunnskapen med flervalg, regneoppgaver og teori, så husk også å regne gamle eksamensoppgaver for hånd. Spørsmålene er kontrollert mot NEK 400:2022, FEL og FSE. Sidetall («s. 240») viser til NEK 400:2022 (7. utgave). Sjekk alltid gjeldende utgave. <a href="#/om">Om innholdet og fagkontrollen</a> · <a href="personvern.html">Personvern</a></p>`;
    const datoFelt = document.getElementById("eksamensdato");
    datoFelt.addEventListener("change", () => {
      if (datoFelt.value) data.eksamensdato = datoFelt.value; else delete data.eksamensdato;
      lagre(); forside();
    });
  }

  function kategorier() {
    sett("Velg tema", true);
    app.innerHTML = `<p class="dempet liten" style="margin:0 0 14px">Vil du lese teorien først? Se <a href="#/kurs">Teorikurs</a>.</p><div class="seksjon-tittel" style="margin-top:0"><h2>Temaer</h2><span class="etikett">Riktig / totalt</span></div><div>` +
      INN.kategorier.map((k) => {
        const st = kategoriStat(k.id);
        return `<a class="kategori" href="#/ov/${k.id}">
          <span class="ikon">${esc(k.ikon)}</span>
          <span class="navn">${esc(k.navn)}
            <div class="stolpe"><span style="width:${prosent(st.riktig, st.totalt)}%"></span></div>
          </span><span class="pil">${st.riktig}/${st.totalt} ›</span></a>`;
      }).join("") + "</div>";
  }

  // Øving: ett spørsmål om gangen med forklaring.
  function ov(kat) {
    let utvalg;
    const rep = kat === "repeter";
    if (kat === "alle") utvalg = SP;
    else if (kat === "feil") utvalg = SP.filter((s) => data.svar[s.id] && !data.svar[s.id].sistRiktig);
    else if (rep) utvalg = repetisjonsListe().liste;
    else if (kat === "nye") utvalg = stokk(SP.filter((s) => !data.svar[s.id])).slice(0, 20);
    else utvalg = SP.filter((s) => s.kategori === kat);
    sett(kat === "alle" ? "Øv på alt" : kat === "feil" ? "Repeter feil" : rep ? "Repeter i dag" : kat === "nye" ? "Nye spørsmål" : kategoriNavn(kat), true);
    if (!utvalg.length) {
      app.innerHTML = `<section class="kort helt"><div class="etikett">Tomt</div><p>${rep ? "Ingenting å repetere i dag. Kom tilbake i morgen!" : "Ingen spørsmål her akkurat nå. Bra jobba!"}</p><a class="knapp" href="#/">Til forsiden</a></section>`;
      return;
    }
    // Repetisjonen holder rekkefølgen (mest forfalt først); ellers tilfeldig.
    const oppgaver = (rep ? utvalg : stokk(utvalg)).map(lagOppgave);
    const tattOpp = new Set(); // i repetisjon kommer feil svar én gang til senere i samme økt
    let i = 0, poeng = 0, besvart = false, klarFra = 0;

    function vis() {
      const o = oppgaver[i];
      besvart = false;
      klarFra = Date.now() + 400; // et dobbeltklikk på «Neste» skal ikke svare på det nye spørsmålet
      app.innerHTML = `
        <div class="fremdrift dempet liten"><span>Spørsmål ${i + 1} av ${oppgaver.length}</span><span>${poeng} riktige</span></div>
        <section class="kort">
          <div class="spm-topp"><span class="kode" title="${esc(kategoriNavn(o.s.kategori))}">${esc(kategoriKode(o.s.kategori))}</span>${tattOpp.has(o.s.id) && i > 0 && oppgaver.findIndex((x) => x.s.id === o.s.id) < i ? '<span class="merke">Ett forsøk til</span>' : ""}${lydKnapp}</div>
          ${figur(o.s)}<p class="sporsmal">${esc(o.s.sporsmal)}</p>
          ${forstaBoks(o.s)}
          <div id="alt">${o.rekkefolge.map((_, v) => alternativKnapp(o, v)).join("")}</div>
          <div id="etter"></div>
          <div class="spm-id">ID ${esc(o.s.id)}</div>
        </section>${tips}`;
      app.querySelectorAll(".alternativ").forEach((b) => b.addEventListener("click", () => { if (Date.now() >= klarFra) svar(+b.dataset.v); }));
      koblLyd(o);
      app.focus();
    }
    function svar(v) {
      if (besvart) return;
      besvart = true;
      const o = oppgaver[i];
      const riktig = v === o.riktigVisning;
      const igjen = tattOpp.has(o.s.id);
      if (riktig && !igjen) poeng++;
      // Andre forsøk i samme økt teller ikke: spørsmålet blir liggende i boks 1 og kommer igjen i morgen.
      if (!igjen) registrerSvar(o.s.id, riktig);
      if (rep && !riktig && !igjen) {
        tattOpp.add(o.s.id);
        oppgaver.splice(Math.min(i + 4, oppgaver.length), 0, lagOppgave(o.s));
      }
      app.querySelectorAll(".alternativ").forEach((b, idx) => {
        b.disabled = true;
        if (idx === o.riktigVisning) b.classList.add("riktig");
        else if (idx === v) b.classList.add("feil");
      });
      const siste = i === oppgaver.length - 1;
      const dager = Math.max(1, Math.round((new Date(data.svar[o.s.id].neste + "T12:00") - new Date(dag() + "T12:00")) / 864e5));
      const nar = igjen ? "Kommer igjen i morgen." : !riktig ? (rep ? "Du får det én gang til om litt, og igjen i morgen." : "Kommer igjen i morgen.")
        : `Kommer igjen ${dager === 1 ? "i morgen" : `om ${dager} dager`}${data.svar[o.s.id].boks >= SITTER ? " (lært)" : ""}.`;
      document.getElementById("etter").innerHTML = `
        <div class="forklaring ${riktig ? "riktig" : "feil"}" role="status"><strong>${riktig ? "Riktig!" : "Feil."}</strong> ${esc(o.s.forklaring)}</div>
        <p class="dempet liten" style="margin:8px 0 0">↻ ${nar}</p>
        <button class="knapp primar" id="neste">${siste ? "Se resultat" : "Neste spørsmål"}</button>`;
      const neste = document.getElementById("neste");
      neste.addEventListener("click", videre);
      neste.focus();
    }
    function videre() { stopLyd(); if (i === oppgaver.length - 1) slutt(); else { i++; vis(); } }
    function slutt() {
      tast = null;
      const unike = oppgaver.length - tattOpp.size;
      const igjenIdag = rep ? repetisjonsListe().forfalt : 0;
      app.innerHTML = `<section class="kort helt">
        <div class="stor">${poeng} / ${unike}</div>
        <p class="dempet">${prosent(poeng, unike)} % riktig på første forsøk</p>
        ${rep ? `<p class="dempet liten">${antallLaert()} av ${SP.length} spørsmål er lært. ${igjenIdag ? `${igjenIdag} til venter i dag.` : "Ferdig for i dag!"}</p>` : ""}
        ${!rep || igjenIdag ? `<button class="knapp primar" id="igjen">${rep ? "Fortsett" : "Øv igjen"}</button>` : ""}
        <a class="knapp" href="#/" style="text-decoration:none">Til forsiden</a></section>`;
      const knapp = document.getElementById("igjen");
      if (knapp) knapp.addEventListener("click", () => ov(kat));
    }
    tast = (ev) => {
      if (ev.key === "Enter" && besvart) { ev.preventDefault(); videre(); return; }
      if (ev.key.toLowerCase() === "l") { lesOpp(oppgaver[i]); return; }
      const v = valgFraTast(ev, oppgaver[i].rekkefolge.length);
      if (v >= 0 && !besvart) svar(v);
    };
    vis();
  }

  // ---------- Prøver med tid: prøveeksamen og symbolprøve ----------
  let proveTimer = null;
  function startSide(cfg) {
    sett(cfg.tittel, true);
    if (!cfg.pool.length) { app.innerHTML = `<section class="kort helt"><p>Ingen spørsmål tilgjengelig.</p></section>`; return; }
    const antall = Math.min(cfg.antall, cfg.pool.length);
    const tidligere = proverAvType(cfg.type);
    const p = data.pagaende && data.pagaende.type === cfg.type ? data.pagaende : null;
    app.innerHTML = `<section class="kort helt">
      <div class="etikett">${esc(cfg.tittel)}</div>
      ${p ? `<p><strong>Du har en prøve på pause</strong></p>
        <p class="dempet">${p.valg.filter((v) => v !== null).length} av ${p.ider.length} besvart · ${Math.ceil(p.igjenMs / 60000)} min igjen. Klokka står stille mens prøven er på pause.</p>
        <button class="knapp primar" id="fortsett">Fortsett prøven</button>
        <button class="knapp" id="start">Forkast og start en ny</button>`
      : `<p><strong>${antall} spørsmål · ${cfg.minutter} minutter</strong></p>
        <p class="dempet">Du ser ikke fasit før du leverer. Bestått: ${cfg.bestattProsent} % riktig. Har du dårlig tid, kan du ta pause underveis og fortsette senere.${tidligere.length ? ` Du har tatt ${tidligere.length} slike prøver.` : ""}</p>
        <button class="knapp primar" id="start">Start ${cfg.tittel.toLowerCase()}</button>`}</section>`;
    document.getElementById("start").addEventListener("click", () => {
      if (p && !confirm("Forkaste prøven på pause og starte en ny?")) return;
      delete data.pagaende; lagre();
      kjorProve(Object.assign({}, cfg, { antall }));
    });
    if (p) document.getElementById("fortsett").addEventListener("click", () => kjorProve(Object.assign({}, cfg, { antall: p.ider.length }), p));
  }
  function eksamen() {
    const e = INN.eksamen;
    startSide({ type: "eksamen", tittel: "Prøveeksamen", ikon: "⏱", pool: SP, antall: e.antallSporsmal, minutter: e.minutter, bestattProsent: e.bestattProsent });
  }
  function symbolprove() {
    startSide({ type: "symbol", tittel: "Symbolprøve", ikon: "⊸", pool: SYMBOLSPM, antall: SYMBOLPROVE.antall, minutter: SYMBOLPROVE.minutter, bestattProsent: INN.eksamen.bestattProsent });
  }

  // Prøveeksamen: minst ett spørsmål fra hvert tema, resten tilfeldig, så ingen temaer faller helt ut.
  function utvalgPerTema(pool, antall) {
    const temaer = stokk([...new Set(pool.map((s) => s.kategori))]);
    const valgt = temaer.map((k) => stokk(pool.filter((s) => s.kategori === k))[0]).slice(0, antall);
    const rest = stokk(pool.filter((s) => !valgt.includes(s)));
    return stokk(valgt.concat(rest.slice(0, antall - valgt.length)));
  }
  let aktivProve = null; // hash for prøven som pågår, så rute() kan spørre før den forlates
  let lagrePagaende = null; // lagrer prøven som pågår (kalles også når siden lukkes eller byttes)
  function kjorProve(cfg, fra) {
    // «fra» er en prøve som var satt på pause: samme spørsmål, rekkefølge, svar og tid igjen.
    const gjen = fra ? fra.ider.map((id, k) => { const s = SP.find((x) => x.id === id); return s && { s, rekkefolge: fra.rekkefolger[k], riktigVisning: fra.rekkefolger[k].indexOf(s.riktig) }; }) : null;
    const oppgaver = gjen && gjen.every(Boolean) ? gjen
      : (cfg.type === "eksamen" ? utvalgPerTema(cfg.pool, cfg.antall) : stokk(cfg.pool).slice(0, cfg.antall)).map(lagOppgave);
    const antall = oppgaver.length;
    aktivProve = location.hash || "#/";
    const valg = gjen && gjen.every(Boolean) ? fra.valg.slice() : new Array(antall).fill(null);
    let i = gjen && gjen.every(Boolean) ? Math.min(fra.i || 0, antall - 1) : 0, ferdig = false;
    const slutt = Date.now() + (gjen && gjen.every(Boolean) ? fra.igjenMs : cfg.minutter * 60000);
    lagrePagaende = () => {
      if (ferdig) return;
      data.pagaende = { type: cfg.type, tittel: cfg.tittel, ider: oppgaver.map((o) => o.s.id), rekkefolger: oppgaver.map((o) => o.rekkefolge), valg: valg.slice(), i, igjenMs: Math.max(0, slutt - Date.now()) };
      lagre();
    };
    function pause() {
      lagrePagaende(); ferdig = true; lagrePagaende = null;
      aktivProve = null; tast = null; stopLyd();
      clearInterval(proveTimer); proveTimer = null;
      location.hash = "#/";
    }

    function tid() {
      const igjen = Math.max(0, slutt - Date.now());
      const el = document.getElementById("timer");
      if (el) {
        const m = Math.floor(igjen / 60000), s = Math.floor((igjen % 60000) / 1000);
        el.textContent = `${m}:${String(s).padStart(2, "0")}`;
        el.classList.toggle("lite", igjen < Math.min(5 * 60000, cfg.minutter * 60000 / 5));
      }
      if (igjen <= 0) lever(true);
    }
    function velg(v) {
      valg[i] = v;
      app.querySelectorAll(".alternativ").forEach((x, idx) => { x.classList.toggle("valgt", idx === v); x.setAttribute("aria-pressed", idx === v ? "true" : "false"); });
      const nr = app.querySelector(`.nr[data-k="${i}"]`); if (nr) nr.classList.add("besvart");
      const teller = document.getElementById("besvart-teller"); if (teller) teller.textContent = valg.filter((x) => x !== null).length;
      lagrePagaende();
    }
    function ga(til) { if (til >= 0 && til < antall) { stopLyd(); i = til; vis(); lagrePagaende(); } }
    function vis() {
      const o = oppgaver[i];
      app.innerHTML = `
        <div class="fremdrift"><span class="dempet liten">Spørsmål ${i + 1} av ${antall} · <span id="besvart-teller">${valg.filter((v) => v !== null).length}</span> besvart</span><span class="timer" id="timer"></span></div>
        <section class="kort">
          <div class="spm-topp"><span></span>${lydKnapp}</div>
          ${figur(o.s)}<p class="sporsmal">${esc(o.s.sporsmal)}</p>
          ${o.rekkefolge.map((_, v) => alternativKnapp(o, v, valg[i] === v ? "valgt" : "").replace("<button ", `<button aria-pressed="${valg[i] === v}" `)).join("")}
          <div class="spm-id">ID ${esc(o.s.id)}</div>
        </section>
        <div class="meny">
          <button class="knapp" id="forrige" ${i === 0 ? "disabled" : ""}>‹ Forrige</button>
          ${i < antall - 1 ? `<button class="knapp primar" id="neste">Neste ›</button>` : `<button class="knapp primar" id="lever">Lever</button>`}
        </div>
        <details class="kort oversikt">
          <summary>Oversikt over alle spørsmål</summary>
          <div class="nav-rutenett">${oppgaver.map((_, k) => `<button class="nr ${valg[k] !== null ? "besvart" : ""} ${k === i ? "aktiv" : ""}" data-k="${k}" aria-label="Gå til spørsmål ${k + 1}">${k + 1}</button>`).join("")}</div>
        </details>
        ${i < antall - 1 ? `<button class="knapp" id="lever">Lever nå</button>` : ""}
        <button class="knapp" id="pause">Ta pause (fortsett senere)</button>
        <p class="tips dempet liten">Hurtigtaster: 1–4 / A–D velger svar · ← → blar${kanLyd ? " · L leser opp" : ""}</p>`;
      document.getElementById("pause").addEventListener("click", pause);
      app.querySelectorAll(".alternativ").forEach((b) => b.addEventListener("click", () => velg(+b.dataset.v)));
      app.querySelectorAll(".nr").forEach((b) => b.addEventListener("click", () => ga(+b.dataset.k)));
      const f = document.getElementById("forrige"); if (f) f.addEventListener("click", () => ga(i - 1));
      const n = document.getElementById("neste"); if (n) n.addEventListener("click", () => ga(i + 1));
      document.getElementById("lever").addEventListener("click", () => lever(false));
      koblLyd(o);
      tid();
    }
    function lever(tidenUte) {
      if (ferdig) return;
      if (!tidenUte) {
        const ubesvart = valg.filter((v) => v === null).length;
        if (ubesvart && !confirm(`Du har ${ubesvart} ubesvarte spørsmål. Vil du levere likevel?`)) return;
      }
      ferdig = true; tast = null; stopLyd(); aktivProve = null; lagrePagaende = null;
      delete data.pagaende;
      clearInterval(proveTimer); proveTimer = null;
      const ubesvartTotalt = valg.filter((v) => v === null).length;
      let poeng = 0;
      const tema = {};
      oppgaver.forEach((o, idx) => {
        const r = valg[idx] === o.riktigVisning;
        if (r) poeng++;
        if (valg[idx] !== null) registrerSvar(o.s.id, r);
        const t = tema[o.s.kategori] || (tema[o.s.kategori] = [0, 0]);
        t[1]++; if (r) t[0]++;
      });
      const pst = prosent(poeng, antall);
      const bestatt = poeng * 100 >= cfg.bestattProsent * antall; // uten avrunding: 79,5 % er ikke bestått
      data.eksamener.push({ dato: new Date().toISOString(), prosent: pst, bestatt, type: cfg.type, tema });
      lagre();
      const temaListe = Object.entries(tema).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
      // Bare temaer med minst 3 spørsmål i prøven vurderes som svake; med 1–2 spørsmål sier resultatet lite.
      const svake = temaListe.filter(([, [r, t]]) => t >= 3 && r / t < cfg.bestattProsent / 100).slice(0, 3);
      app.innerHTML = `
        <section class="kort helt" role="status">
          ${tidenUte ? '<p class="dempet">Tiden er ute.</p>' : ""}
          <div class="stor">${pst} %</div>
          <p><span class="merke ${bestatt ? "riktig" : "feil"}">${bestatt ? "Bestått" : "Ikke bestått"}</span></p>
          <p class="dempet">${poeng} av ${antall} riktige · krav ${cfg.bestattProsent} %${ubesvartTotalt ? ` · ${ubesvartTotalt} ubesvarte (teller som feil)` : ""}</p>
          <a class="knapp primar" href="#/ov/feil" style="text-decoration:none">Repeter alle feil</a>
          <a class="knapp" href="#/" style="text-decoration:none">Til forsiden</a>
        </section>
        ${cfg.type === "eksamen" ? `<section class="kort"><strong>Resultat per tema</strong>
          ${temaListe.map(([k, [r, t]]) => `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(kategoriNavn(k))}</span><span class="dempet">${r}/${t}</span></div>
            <div class="stolpe ${t >= 3 && r / t < cfg.bestattProsent / 100 ? "svak" : ""}"><span style="width:${prosent(r, t)}%"></span></div></div>`).join("")}
          ${svake.length ? `<p style="margin:14px 0 6px"><strong>Anbefalt å øve mer på:</strong></p>
            ${svake.map(([k]) => `<a class="knapp" href="#/ov/${k}" style="text-decoration:none">${esc(kategoriNavn(k))} ›</a>`).join("")}` : `<p class="dempet" style="margin-top:12px">Ingen svake temaer i denne prøven. Bra jobbet!</p>`}
        </section>` : ""}
        <section class="kort resultat-liste"><strong>Gjennomgang</strong>
          ${oppgaver.map((o, idx) => {
            const r = valg[idx] === o.riktigVisning;
            const dittSvar = valg[idx] === null ? "Ikke besvart" : o.s.alternativer[o.rekkefolge[valg[idx]]];
            return `<div class="rad">
              <span class="merke ${r ? "riktig" : "feil"}">${r ? "Riktig" : "Feil"}</span> <span class="spm-id">ID ${esc(o.s.id)}</span>
              ${figur(o.s, true)}<p class="sporsmal" style="font-size:1rem;margin:6px 0">${esc(o.s.sporsmal)}</p>
              ${r ? "" : `<div class="liten">Ditt svar: ${esc(dittSvar)}</div>`}
              <div class="liten"><strong>Riktig:</strong> ${esc(o.s.alternativer[o.s.riktig])}</div>
              <div class="liten dempet">${esc(o.s.forklaring)}</div></div>`;
          }).join("")}
        </section>`;
    }
    tast = (ev) => {
      if (ev.key === "ArrowRight") { ga(i + 1); return; }
      if (ev.key === "ArrowLeft") { ga(i - 1); return; }
      if (ev.key === "Enter" && valg[i] !== null && i < antall - 1) { ev.preventDefault(); ga(i + 1); return; }
      if (ev.key.toLowerCase() === "l") { lesOpp(oppgaver[i]); return; }
      const v = valgFraTast(ev, oppgaver[i].rekkefolge.length);
      if (v >= 0) velg(v);
    };
    clearInterval(proveTimer);
    proveTimer = setInterval(tid, 1000);
    vis();
  }

  // ---------- Symbolspill: så mange riktige som mulig på tid ----------
  let spillTimer = null, spillPause = null;
  function spill() {
    sett("Symbolspill", true);
    app.innerHTML = `<section class="kort helt">
      <div class="etikett">Symbolspill</div>
      <p><strong>${SPILL_SEKUNDER} sekunder</strong></p>
      <p class="dempet">Svar riktig på så mange symboler du klarer. Feil svar koster 3 sekunder.</p>
      <p>Rekord: <strong>${data.rekord || 0}</strong></p>
      <button class="knapp primar" id="start">Start spillet</button></section>`;
    document.getElementById("start").addEventListener("click", kjorSpill);
  }
  function kjorSpill() {
    let poeng = 0, slutt = Date.now() + SPILL_SEKUNDER * 1000, o = null, forrige = null, laast = false;
    function tid() {
      const igjen = Math.max(0, slutt - Date.now());
      const el = document.getElementById("timer");
      if (el) { el.textContent = Math.ceil(igjen / 1000) + " s"; el.classList.toggle("lite", igjen < 10000); }
      if (igjen <= 0) ferdig();
    }
    function nytt() {
      let s; do { s = SYMBOLSPM[Math.floor(Math.random() * SYMBOLSPM.length)]; } while (SYMBOLSPM.length > 1 && s === forrige);
      forrige = s; o = lagOppgave(s); laast = false;
      app.innerHTML = `
        <div class="fremdrift"><span><strong>${poeng}</strong> poeng</span><span class="timer" id="timer"></span></div>
        <section class="kort">${figur(s)}
          ${o.rekkefolge.map((_, v) => alternativKnapp(o, v)).join("")}
        </section><p class="tips dempet liten">Tast 1–4 / A–D for raskere svar</p>`;
      app.querySelectorAll(".alternativ").forEach((b) => b.addEventListener("click", () => svar(+b.dataset.v)));
      tid();
    }
    function svar(v) {
      if (laast) return;
      laast = true;
      const riktig = v === o.riktigVisning;
      if (riktig) poeng++; else slutt -= 3000;
      app.querySelectorAll(".alternativ").forEach((b, idx) => {
        if (idx === o.riktigVisning) b.classList.add("riktig"); else if (idx === v) b.classList.add("feil");
      });
      // Feil svar flytter slutten 3 s fram, men aldri forbi nå (da avsluttes runden ved neste tikk).
      if (!riktig) slutt = Math.max(slutt, Date.now());
      clearTimeout(spillPause);
      spillPause = setTimeout(() => { spillPause = null; if (spillTimer) nytt(); }, riktig ? 250 : 900);
    }
    function ferdig() {
      clearInterval(spillTimer); spillTimer = null; tast = null;
      clearTimeout(spillPause); spillPause = null;
      const ny = poeng > (data.rekord || 0);
      if (ny) { data.rekord = poeng; lagre(); }
      app.innerHTML = `<section class="kort helt">
        <div class="stor">${poeng}</div><p class="dempet">riktige symboler</p>
        <p>${ny ? '<span class="merke riktig">Ny rekord</span>' : `Rekord: <strong>${data.rekord}</strong>`}</p>
        <button class="knapp primar" id="igjen">Spill igjen</button>
        <a class="knapp" href="#/" style="text-decoration:none">Til forsiden</a></section>`;
      document.getElementById("igjen").addEventListener("click", kjorSpill);
    }
    tast = (ev) => { const v = valgFraTast(ev, o ? o.rekkefolge.length : 0); if (v >= 0) svar(v); };
    clearInterval(spillTimer); clearTimeout(spillPause); spillPause = null;
    spillTimer = setInterval(tid, 250);
    nytt();
  }

  function regningListe() {
    sett("Regneoppgaver", true);
    app.innerHTML = RO.map((r) => {
      const st = data.regning[r.id];
      return `<a class="kategori" href="#/regning/${r.id}" style="text-decoration:none">
        <span class="ikon">∑</span>
        <span class="navn">${esc(r.tittel)}<div class="dempet liten">${st ? (st.sistRiktig || st.lost ? "✓ Løst" : "Prøv igjen") : "Ikke prøvd"}</div></span>
        <span aria-hidden="true">›</span></a>`;
    }).join("");
  }
  function regning(id) {
    const r = RO.find((x) => x.id === id);
    if (!r) { location.hash = "#/regning"; return; }
    sett(r.tittel, true);
    app.innerHTML = `
      <section class="kort">
        <p class="sporsmal">${esc(r.oppgave)}</p>
        <form class="felt" id="skjema" autocomplete="off">
          <input id="svar" inputmode="decimal" placeholder="Ditt svar" aria-label="Ditt svar">
          <span class="enhet">${esc(r.enhet)}</span>
        </form>
        <button class="knapp primar" id="sjekk">Sjekk svar</button>
        ${(r.formler || []).length ? `<button class="knapp" id="hint">Hint: vis formel</button>` : ""}
        <div id="hint-boks"></div>
        <div id="etter"></div>
      </section>`;
    const inp = document.getElementById("svar");
    const hintKnapp = document.getElementById("hint");
    if (hintKnapp) hintKnapp.addEventListener("click", () => {
      const liste = r.formler.map(formelAv).filter(Boolean);
      document.getElementById("hint-boks").innerHTML = `<div class="forklaring hint">
        <strong>${liste.length > 1 ? "Formler" : "Formel"} du trenger:</strong>${liste.map((f) => formelKort(f)).join("")}
        <a class="liten" href="#/formler">Se hele formelsamlingen ›</a></div>`;
      hintKnapp.remove();
      inp.focus();
    });
    function sjekk(ev) {
      if (ev) ev.preventDefault();
      // Godta «1 000», «1000», «8,7», «8.7», «0.583» og en enhet til slutt.
      // «1.000» kan bety både tusen og én; svaret godtas hvis en av tolkningene er riktig.
      let raa = inp.value.trim().replace(/\s/g, "");
      if (r.enhet) raa = raa.replace(new RegExp(r.enhet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s/g, "") + "$", "i"), "");
      const tusen = /^-?[1-9]\d{0,2}(\.\d{3})+$/.test(raa) ? parseFloat(raa.replace(/\./g, "")) : null;
      if (/^-?\d{1,3}(\.\d{3}){2,}$/.test(raa)) raa = raa.replace(/\./g, ""); // «1.000.000» er alltid tusenskille
      raa = raa.replace(",", ".");
      if (!/^-?\d+(\.\d+)?$/.test(raa)) {
        document.getElementById("etter").innerHTML = `<p class="forklaring feil" role="alert">${inp.value.trim() ? "Skriv svaret som et tall, for eksempel 8,7." : "Skriv inn et tall først."}</p>`;
        inp.focus(); return;
      }
      const naer = (x) => x !== null && Math.abs(x - r.svar) <= r.toleranse + 1e-9;
      const riktig = naer(parseFloat(raa)) || naer(tusen);
      const st = data.regning[r.id] || { forsok: 0, riktige: 0 };
      st.forsok++; if (riktig) { st.riktige++; st.lost = true; } st.sistRiktig = riktig;
      idag().oppgaver++;
      data.regning[r.id] = st; lagre();
      const idx = RO.indexOf(r);
      const neste = RO[idx + 1];
      document.getElementById("etter").innerHTML = `
        <div class="forklaring losning ${riktig ? "riktig" : "feil"}" role="status">
          <strong>${riktig ? "Riktig!" : "Ikke helt."}</strong> Fasit: <span class="formel">${String(r.svar).replace(".", ",")} ${esc(r.enhet)}</span>
          <ol>${r.losning.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        </div>
        ${neste ? `<a class="knapp" href="#/regning/${neste.id}" style="text-decoration:none">Neste oppgave ›</a>` : `<a class="knapp" href="#/regning" style="text-decoration:none">Til oversikten</a>`}`;
    }
    document.getElementById("skjema").addEventListener("submit", sjekk);
    document.getElementById("sjekk").addEventListener("click", sjekk);
    inp.focus();
  }


  // ---------- Skriftlige oppgaver (data/skriftlig.js) ----------
  // Tallsvar sjekkes som regneoppgavene. Tekstsvar skriver eleven selv, og krysser så av punktene i løsningsforslaget.
  function lesTall(tekst, enhet) {
    let raa = String(tekst).trim().replace(/\s/g, "");
    if (enhet) raa = raa.replace(new RegExp(enhet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s/g, "") + "$", "i"), "");
    const tusen = /^-?[1-9]\d{0,2}(\.\d{3})+$/.test(raa) ? parseFloat(raa.replace(/\./g, "")) : null;
    if (/^-?\d{1,3}(\.\d{3}){2,}$/.test(raa)) raa = raa.replace(/\./g, "");
    raa = raa.replace(",", ".");
    if (!/^-?\d+(\.\d+)?$/.test(raa)) return null;
    return { tall: parseFloat(raa), tusen };
  }
  function skriftligListe() {
    sett("Skriftlige oppgaver", true);
    app.innerHTML = `<p class="dempet" style="margin:0 0 14px">Den ekte eksamenen er skriftlig. Her får du hele oppgaver med flere deler, slik du møter dem på eksamen. Regn på papir først, skriv inn svaret, og sammenlign med løsningsforslaget steg for steg.</p><div>` +
      SKR.map((o) => {
        const st = data.skriftlig[o.id];
        return `<a class="kategori" href="#/skriftlig/${o.id}">
          <span class="ikon">SKR</span>
          <span class="navn">${esc(o.tittel)}<div class="dempet liten" style="font-weight:400">${o.deler.length} deler · ca. ${o.tid} min${st && st.ferdig ? ` · ${st.poeng}/${st.maks} poeng` : ""}</div></span>
          <span class="pil">${st && st.ferdig ? "✓" : "›"}</span></a>`;
      }).join("") + "</div>";
  }
  function skriftligSide(id) {
    const o = SKR.find((x) => x.id === id);
    if (!o) { location.hash = "#/skriftlig"; return; }
    sett(o.tittel, true);
    const poeng = new Array(o.deler.length).fill(null); // null = ikke svart, ellers 0–1
    app.innerHTML = `
      <section class="kort">
        <div class="etikett">Situasjon</div>
        <p>${esc(o.situasjon)}</p>
        <div class="etikett" style="margin-top:12px">Gitt</div>
        <ul class="gitt">${o.gitt.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
      </section>
      ${o.deler.map((d, n) => `<section class="kort skr-del" id="del-${n}">
        <div class="etikett">Del ${String.fromCharCode(97 + n)}</div>
        <p class="sporsmal" style="font-size:1.05rem">${esc(d.sporsmal)}</p>
        ${d.punkter
          ? `<textarea class="skr-tekst" id="tekst-${n}" rows="4" placeholder="Skriv svaret ditt her, som på eksamen" aria-label="Ditt svar på del ${String.fromCharCode(97 + n)}"></textarea>
             <button class="knapp" data-vis="${n}">Vis løsningsforslag</button>`
          : `<form class="felt" data-skjema="${n}" autocomplete="off"><input id="svar-${n}" inputmode="decimal" placeholder="Ditt svar" aria-label="Ditt svar på del ${String.fromCharCode(97 + n)}"><span class="enhet">${esc(d.enhet || "")}</span></form>
             <button class="knapp primar" data-sjekk="${n}">Sjekk svar</button>
             ${(d.formler || []).length ? `<button class="knapp" data-hint="${n}">Hint: vis formel</button>` : ""}`}
        <div id="hint-${n}"></div><div id="etter-${n}"></div>
      </section>`).join("")}
      <div id="sum"></div>`;
    const losning = (d) => `<ol>${d.losning.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
    function oppdaterSum() {
      if (poeng.some((p) => p === null)) return;
      const sum = Math.round(poeng.reduce((a, b) => a + b, 0) * 10) / 10;
      const forrige = data.skriftlig[o.id];
      const forste = !(forrige && forrige.ferdig);
      data.skriftlig[o.id] = { ferdig: true, poeng: sum, maks: o.deler.length, dato: dag() };
      if (forste) idag().oppgaver++;
      lagre();
      const nesteO = SKR[SKR.indexOf(o) + 1];
      document.getElementById("sum").innerHTML = `<section class="kort helt" role="status">
        <div class="stor">${String(sum).replace(".", ",")} / ${o.deler.length}</div><p class="dempet">poeng på oppgaven</p>
        ${nesteO ? `<a class="knapp primar" href="#/skriftlig/${nesteO.id}">Neste oppgave: ${esc(nesteO.tittel)} ›</a>` : `<a class="knapp primar" href="#/skriftlig">Til alle oppgavene</a>`}</section>`;
    }
    o.deler.forEach((d, n) => {
      const etter = document.getElementById("etter-" + n);
      if (d.punkter) {
        app.querySelector(`[data-vis="${n}"]`).addEventListener("click", (ev) => {
          ev.currentTarget.remove();
          document.getElementById("tekst-" + n).readOnly = true;
          etter.innerHTML = `<div class="forklaring losning hint">
            <strong>Løsningsforslag</strong>${losning(d)}
            <p style="margin:8px 0 4px"><strong>Kryss av for det du fikk med:</strong></p>
            ${d.punkter.map((p, k) => `<label class="sjekk-punkt"><input type="checkbox" data-p="${k}"> ${esc(p)}</label>`).join("")}
            <button class="knapp" data-ferdig="${n}" style="margin-top:8px">Ferdig med del ${String.fromCharCode(97 + n)}</button></div>`;
          etter.querySelector("[data-ferdig]").addEventListener("click", (e2) => {
            const kryss = etter.querySelectorAll("input[type=checkbox]:checked").length;
            poeng[n] = kryss / d.punkter.length;
            e2.currentTarget.outerHTML = `<p class="liten"><strong>${kryss} av ${d.punkter.length} punkter.</strong></p>`;
            etter.querySelectorAll("input[type=checkbox]").forEach((c) => { c.disabled = true; });
            oppdaterSum();
          });
        });
        return;
      }
      const inp = document.getElementById("svar-" + n);
      function sjekk(ev) {
        if (ev) ev.preventDefault();
        const t = lesTall(inp.value, d.enhet);
        if (!t) { etter.innerHTML = `<p class="forklaring feil" role="alert">${inp.value.trim() ? "Skriv svaret som et tall, for eksempel 8,7." : "Skriv inn et tall først."}</p>`; inp.focus(); return; }
        const naer = (x) => x !== null && Math.abs(x - d.svar) <= d.toleranse + 1e-9;
        const riktig = naer(t.tall) || naer(t.tusen);
        if (poeng[n] === null) poeng[n] = riktig ? 1 : 0; // første forsøk teller
        etter.innerHTML = `<div class="forklaring losning ${riktig ? "riktig" : "feil"}" role="status">
          <strong>${riktig ? "Riktig!" : "Ikke helt."}</strong> Fasit: <span class="formel">${String(d.svar).replace(".", ",")} ${esc(d.enhet || "")}</span>${losning(d)}</div>`;
        oppdaterSum();
      }
      app.querySelector(`[data-skjema="${n}"]`).addEventListener("submit", sjekk);
      app.querySelector(`[data-sjekk="${n}"]`).addEventListener("click", sjekk);
      const h = app.querySelector(`[data-hint="${n}"]`);
      if (h) h.addEventListener("click", () => {
        const liste = d.formler.map(formelAv).filter(Boolean);
        document.getElementById("hint-" + n).innerHTML = `<div class="forklaring hint"><strong>${liste.length > 1 ? "Formler" : "Formel"} du trenger:</strong>${liste.map(formelKort).join("")}</div>`;
        h.remove(); inp.focus();
      });
    });
  }

  // ---------- Om innholdet ----------
  function omSide() {
    sett("Om innholdet", true);
    const kontroll = SP.filter((s) => /NEK 400|FEL|FSE/.test(s.forklaring)).length;
    app.innerHTML = `
      <section class="kort">
        <div class="etikett">Hvem som står bak</div>
        <p>LettFagprøve er laget av en elektriker, for lærlinger og praksiskandidater som skal opp til teorieksamen i elektrikerfaget.</p>
      </section>
      <section class="kort">
        <div class="etikett">Fagkontroll</div>
        <ul class="gitt">
          <li><strong>11.11.2026:</strong> alle ${SP.length} spørsmål kontrollert punkt for punkt mot NEK 400:2022. Feil og upresise svar ble rettet.</li>
          <li><strong>11.11.2026:</strong> teorikurset for alle ${kursIder().length} temaer kontrollert mot NEK 400:2022.</li>
          <li><strong>13.11.2026:</strong> svaralternativene skrevet om, så riktig svar ikke kan gjettes ut fra lengden. Fem skriftlige oppgaver lagt til, med utregnede fasiter.</li>
        </ul>
        <p>${kontroll} av ${SP.length} forklaringer viser til NEK 400, FEL eller FSE. NEK-henvisningene har sidetall («s. 240»), så du kan slå opp og sjekke selv. Sidetallene gjelder NEK 400:2022 (7. utgave).</p>
        <p class="dempet liten">Teksten er skrevet med egne ord. Ingenting er kopiert fra NEK 400, fordi standarden er opphavsrettsbeskyttet. Verdier som ikke står i NEK 400 (for eksempel B 3–5 × In og C 5–10 × In), er merket med at de kommer fra produktstandarden.</p>
      </section>
      <section class="kort">
        <div class="etikett">Det appen ikke er</div>
        <p>Appen er ikke en offisiell eksamen. Den ekte eksamenen er skriftlig over 5 timer. Bruk appen til å drille kunnskapen, og regn gjerne gamle eksamensoppgaver for hånd i tillegg.</p>
      </section>`;
  }

  // ---------- Teorikurs (data/kurs.js) ----------
  const KURS = window.KURS || {};
  const kursIder = () => INN.kategorier.map((k) => k.id).filter((id) => KURS[id]);
  const lesetid = (k) => Math.max(1, Math.round(JSON.stringify(k).split(/\s+/).length / 180));
  function kursListe() {
    sett("Teorikurs", true);
    const ider = kursIder();
    app.innerHTML = `<p class="dempet" style="margin:0 0 14px">Les et tema på noen minutter, og øv på spørsmålene om det rett etterpå. ${ider.filter((id) => data.lest[id]).length} av ${ider.length} er lest.</p><div>` +
      ider.map((id) => {
        const k = KURS[id], lest = data.lest[id];
        return `<a class="kategori" href="#/kurs/${id}">
          <span class="ikon">${esc(kategoriKode(id))}</span>
          <span class="navn">${esc(kategoriNavn(id))}<div class="dempet liten" style="font-weight:400">${k.deler.length} deler · ca. ${lesetid(k)} min</div></span>
          <span class="pil">${lest ? "✓ lest" : "›"}</span></a>`;
      }).join("") + "</div>";
  }
  function kursSide(id) {
    const k = KURS[id];
    if (!k) { location.hash = "#/kurs"; return; }
    sett(kategoriNavn(id), true);
    const ider = kursIder(), neste = ider[ider.indexOf(id) + 1];
    const antall = SP.filter((s) => s.kategori === id).length;
    const formelBoks = (d) => {
      const fl = (d.formler || []).map(formelAv).filter(Boolean);
      return fl.length ? `<div class="forklaring hint"><div class="etikett">${fl.length > 1 ? "Formler" : "Formel"}</div>${fl.map(formelKort).join("")}</div>` : "";
    };
    app.innerHTML = `
      <section class="kort kurs-intro">
        <div class="etikett">Teorikurs · ${esc(kategoriKode(id))} · ca. ${lesetid(k)} min</div>
        <p class="kurs-ingress">${esc(k.intro)}</p>
        <ol class="kurs-innhold">${k.deler.map((d, n) => `<li><a href="#/kurs/${id}" data-del="${n + 1}">${esc(d.t)}</a></li>`).join("")}</ol>
      </section>
      ${k.deler.map((d, n) => `<section class="kort kurs-del" id="del-${n + 1}">
        <h3><span class="kurs-del-nr">${String(n + 1).padStart(2, "0")}</span>${esc(d.t)}</h3>
        ${d.bilde ? foto({ bilde: d.bilde }) : ""}
        ${(d.p || []).map((p) => `<p>${esc(p)}</p>`).join("")}
        ${(d.husk || []).length ? `<div class="husk"><div class="etikett">Husk</div><ul>${d.husk.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>` : ""}
        ${formelBoks(d)}
        ${d.kilde ? `<p class="kurs-kilde">${esc(d.kilde)}</p>` : ""}
      </section>`).join("")}
      <a class="knapp primar" href="#/ov/${id}" id="kurs-ov">Øv på temaet (${antall} spm) ›</a>
      ${neste ? `<a class="knapp" href="#/kurs/${neste}" id="kurs-neste">Neste tema: ${esc(kategoriNavn(neste))} ›</a>` : `<a class="knapp" href="#/kurs">Til alle kursene</a>`}`;
    const merk = () => { if (!data.lest[id]) idag().lest++; data.lest[id] = true; lagre(); };
    ["kurs-ov", "kurs-neste"].forEach((b) => { const el = document.getElementById(b); if (el) el.addEventListener("click", merk); });
    app.querySelectorAll("[data-del]").forEach((a) => a.addEventListener("click", (ev) => {
      ev.preventDefault(); document.getElementById("del-" + a.dataset.del).scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  // ---------- Formler ----------
  const FORMLER = window.FORMLER || [];
  const formelAv = (id) => FORMLER.flatMap((g) => g.formler).find((f) => f.id === id);
  const formelKort = (f) => `<div class="formel-kort">
      <div class="formel-navn">${esc(f.navn)}</div>
      <div class="formel-hoved">${esc(f.formel)}</div>
      ${(f.varianter || []).map((v) => `<div class="formel-variant">${esc(v)}</div>`).join("")}
      ${f.symboler ? `<div class="dempet liten">${esc(f.symboler)}</div>` : ""}
      ${f.kilde ? `<div class="dempet liten">(${esc(f.kilde)})</div>` : ""}
    </div>`;
  function formler() {
    sett("Formelsamling", true);
    app.innerHTML = `
      <input class="sok" id="sok" type="search" placeholder="Søk, f.eks. «spenningsfall» eller «motor»" aria-label="Søk i formler">
      <div id="formel-liste"></div>`;
    const sok = document.getElementById("sok");
    function vis() {
      const q = sok.value.trim().toLowerCase();
      const treff = (f, g) => !q || [g, f.navn, f.formel, f.symboler, ...(f.varianter || [])].join(" ").toLowerCase().includes(q);
      const html = FORMLER.map((g) => {
        const fl = g.formler.filter((f) => treff(f, g.gruppe));
        return fl.length ? `<div class="seksjon-tittel"><h2>${esc(g.gruppe)}</h2><span class="etikett">${fl.length}</span></div>
          <section class="kort">${fl.map(formelKort).join("")}</section>` : "";
      }).join("");
      document.getElementById("formel-liste").innerHTML = html || '<p class="dempet">Ingen formler passer søket.</p>';
    }
    sok.addEventListener("input", vis);
    vis();
  }

  // Søylediagram over de siste prøveeksamenene (egen SVG, ingen biblioteker).
  function graf(liste, krav) {
    if (!liste.length) return '<p class="dempet">Ingen prøveeksamener ennå.</p>';
    const b = 300, h = 120, n = liste.length, bredde = b / n;
    const y = (p) => h - (p / 100) * h;
    return `<svg class="graf" viewBox="0 0 ${b} ${h + 16}" role="img" aria-label="Resultater for de siste ${n} prøveeksamenene">
      <line x1="0" x2="${b}" y1="${y(krav)}" y2="${y(krav)}" class="krav-linje"/>
      <text x="${b - 2}" y="${y(krav) - 3}" text-anchor="end" class="graf-tekst">${krav} %</text>
      ${liste.map((e, k) => `<rect x="${k * bredde + bredde * 0.15}" y="${y(e.prosent)}" width="${bredde * 0.7}" height="${Math.max(1, (e.prosent / 100) * h)}" rx="2" class="${e.bestatt ? "soyle-ok" : "soyle-feil"}"><title>${new Date(e.dato).toLocaleDateString("no-NO")}: ${e.prosent} %</title></rect>`).join("")}
      <text x="0" y="${h + 13}" class="graf-tekst">Eldst</text><text x="${b}" y="${h + 13}" text-anchor="end" class="graf-tekst">Nyest</text>
    </svg>`;
  }

  function statistikk() {
    sett("Fremgang", true);
    const alleEks = proverAvType("eksamen");
    const eks = alleEks.slice(-10).reverse();
    const sym = proverAvType("symbol");
    const bokser = [
      { navn: "Ikke øvd", n: SP.filter((s) => !data.svar[s.id]).length },
      { navn: "Sist feil", n: SP.filter((s) => data.svar[s.id] && !data.svar[s.id].sistRiktig).length },
      { navn: "På vei", n: SP.filter((s) => data.svar[s.id] && data.svar[s.id].sistRiktig && boksAv(data.svar[s.id]) < SITTER).length },
      { navn: "Lært", n: antallLaert() }
    ];
    const repStat = repetisjonsListe();
    const imorgen = SP.filter((s) => data.svar[s.id] && forfaller(data.svar[s.id]) === dag(1)).length;
    app.innerHTML = `
      <section class="kort"><strong>Smart repetisjon</strong>
        ${bokser.map((b) => `<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;gap:8px"><span>${b.navn}</span><span class="dempet">${b.n}</span></div>
          <div class="stolpe"><span style="width:${prosent(b.n, SP.length)}%"></span></div></div>`).join("")}
        <p class="dempet liten" style="margin:10px 0 0">${repStat.forfalt} venter i dag · ${imorgen} i morgen. Riktig svar gir lengre pause (1, 3, 7, 16, 35 dager), feil svar gir ny runde i morgen.</p>
      </section>
      <section class="kort"><strong>Prøveeksamener (siste ${Math.min(15, alleEks.length)})</strong>
        ${graf(alleEks.slice(-15), INN.eksamen.bestattProsent)}
        <p class="dempet liten" style="margin:6px 0 0">Totalt ${alleEks.length} prøveeksamener, ${alleEks.filter((e) => e.bestatt).length} bestått · ${sym.length} symbolprøver · rekord i symbolspill: ${data.rekord || 0}</p>
      </section>
      <section class="kort"><strong>Per tema</strong>
        ${INN.kategorier.map((k) => {
          const st = kategoriStat(k.id);
          return `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;gap:8px"><a href="#/ov/${k.id}">${esc(k.navn)}</a><span class="dempet">${st.riktig}/${st.totalt}</span></div>
            <div class="stolpe"><span style="width:${prosent(st.riktig, st.totalt)}%"></span></div></div>`;
        }).join("")}
      </section>
      <section class="kort resultat-liste"><strong>Siste prøveeksamener</strong>
        ${eks.length ? eks.map((e) => `<div class="rad" style="display:flex;justify-content:space-between">
          <span>${new Date(e.dato).toLocaleDateString("no-NO")}</span>
          <span><span class="merke ${e.bestatt ? "riktig" : "feil"}">${e.prosent} %</span></span></div>`).join("")
          : '<p class="dempet">Ingen prøveeksamener ennå.</p>'}
      </section>
      <section class="kort" id="flytt"><strong>Flytt fremgangen til en annen enhet</strong>
        <p class="dempet liten" style="margin:6px 0 10px">Fremgangen lagres bare på denne enheten. Vil du fortsette på PC eller en ny mobil, kopierer du koden her og limer den inn på den andre enheten.</p>
        <button class="knapp" id="kopier">Kopier fremgangskode</button>
        <button class="knapp" id="last-ned">Last ned som fil</button>
        <textarea class="skr-tekst" id="kode" rows="3" placeholder="Lim inn fremgangskoden fra den andre enheten" aria-label="Fremgangskode"></textarea>
        <button class="knapp" id="hent-kode">Hent fremgang fra koden</button>
        <label class="knapp" style="text-align:center">Hent fra fil<input type="file" id="fil" accept=".txt,text/plain" hidden></label>
        <div id="flytt-melding" role="status"></div>
      </section>
      <button class="knapp" id="nullstill">Nullstill fremgang</button>`;
    const melding = (t, ok) => { document.getElementById("flytt-melding").innerHTML = `<p class="forklaring ${ok ? "riktig" : "feil"}">${esc(t)}</p>`; };
    const kode = () => "LFP1:" + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    document.getElementById("kopier").addEventListener("click", () => {
      const k = kode();
      const ok = () => melding("Koden er kopiert. Lim den inn under Fremgang på den andre enheten.", true);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(k).then(ok, () => { document.getElementById("kode").value = k; melding("Kunne ikke kopiere automatisk. Koden står i feltet, kopier den selv.", true); });
      else { document.getElementById("kode").value = k; melding("Koden står i feltet. Kopier den selv.", true); }
    });
    document.getElementById("last-ned").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([kode()], { type: "text/plain" }));
      a.download = `lettfagprove-fremgang-${dag()}.txt`;
      document.body.appendChild(a); a.click(); a.remove();
    });
    document.getElementById("fil").addEventListener("change", (ev) => {
      const f = ev.target.files && ev.target.files[0]; if (!f) return;
      f.text().then((t) => { document.getElementById("kode").value = t.trim(); document.getElementById("hent-kode").click(); });
    });
    document.getElementById("hent-kode").addEventListener("click", () => {
      const tekst = document.getElementById("kode").value.trim();
      let ny = null;
      try { if (tekst.startsWith("LFP1:")) ny = JSON.parse(decodeURIComponent(escape(atob(tekst.slice(5))))); } catch (e) { ny = null; }
      if (!erObj(ny) || !erObj(ny.svar)) { melding("Koden er ikke gyldig. Sjekk at du fikk med hele koden, fra LFP1: til slutten.", false); return; }
      if (!confirm("Erstatte fremgangen på denne enheten med fremgangen fra koden?")) return;
      data = normaliser(ny); lagre(); statistikk();
      melding(`Fremgangen er hentet: ${Object.keys(data.svar).length} besvarte spørsmål og ${data.eksamener.length} prøver.`, true);
    });
    document.getElementById("nullstill").addEventListener("click", () => {
      if (confirm("Slette all fremgang på denne enheten?")) { data = normaliser({}); lagre(); statistikk(); }
    });
  }

  // ---------- Ruting ----------
  let ignorerRute = false;
  function rute() {
    if (ignorerRute) { ignorerRute = false; return; }
    // En prøve som pågår, avbrytes bare hvis brukeren bekrefter. Ellers går vi tilbake til prøven uten å tegne den på nytt.
    // Går du fra en prøve som pågår, settes den på pause (lagres med svar og tid igjen).
    if (aktivProve && location.hash !== aktivProve) {
      if (!confirm("Vil du ta pause i prøven? Den lagres, og du kan fortsette fra forsiden.")) { ignorerRute = true; location.hash = aktivProve; return; }
      if (lagrePagaende) lagrePagaende();
      lagrePagaende = null; aktivProve = null;
    }
    tast = null; stopLyd();
    if (proveTimer) { clearInterval(proveTimer); proveTimer = null; }
    if (spillTimer) { clearInterval(spillTimer); spillTimer = null; }
    clearTimeout(spillPause); spillPause = null;
    const deler = (location.hash.replace(/^#\/?/, "") || "").split("/");
    window.scrollTo(0, 0);
    switch (deler[0]) {
      case "ov": return ov(deler[1] || "alle");
      case "kategorier": return kategorier();
      case "eksamen": return eksamen();
      case "symbolprove": return symbolprove();
      case "spill": return spill();
      case "regning": return deler[1] ? regning(deler[1]) : regningListe();
      case "statistikk": return statistikk();
      case "formler": return formler();
      case "kurs": return deler[1] ? kursSide(deler[1]) : kursListe();
      case "skriftlig": return deler[1] ? skriftligSide(deler[1]) : skriftligListe();
      case "om": return omSide();
      default: return forside();
    }
  }
  window.addEventListener("hashchange", rute);
  // Lukkes eller skjules siden midt i en prøve, lagres prøven så den kan fortsettes senere.
  const lagreVedLukking = () => { if (aktivProve && lagrePagaende) lagrePagaende(); };
  window.addEventListener("pagehide", lagreVedLukking);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") lagreVedLukking(); });
  rute();

  // ---------- Installerbar app (offline) ----------
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
