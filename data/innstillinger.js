// Innstillinger for LettFagprøve. Endre tallene her.
window.INNSTILLINGER = {
  appNavn: "LettFagprøve",

  // Prøveeksamen (flervalg). OBS: den ekte eksamenen er en 5-timers skriftlig
  // eksamen, ikke flervalg. Prøveeksamen her er for drilling av kunnskap.
  eksamen: {
    antallSporsmal: 30,
    minutter: 45,
    bestattProsent: 80
  },

  // Kategorier. "id" må stemme med "kategori" i sporsmal.js. "ikon" er en kort fagkode som vises i en boks.
  kategorier: [
    { id: "grunnleggende", navn: "Grunnleggende elektroteknikk", ikon: "EL" },
    { id: "vekselstrom",   navn: "Vekselstrøm og 3-fase",          ikon: "AC 3~" },
    { id: "vern",          navn: "Vern og jordfeilbrytere",         ikon: "VERN" },
    { id: "systemer",      navn: "Fordelingssystemer og jording",   ikon: "TN·IT" },
    { id: "installasjon",  navn: "Installasjon og kabler",          ikon: "KABEL" },
    { id: "sikkerhet",     navn: "Sikkerhet og forskrifter",        ikon: "FEL" },
    { id: "maling",        navn: "Måling, kontroll og dokumentasjon", ikon: "MÅL" },
    { id: "motorer",       navn: "Motorer og automasjon",           ikon: "MOTOR" },
    { id: "symboler",      navn: "Installasjonssymboler",           ikon: "SYMB" },
    { id: "dimensjonering", navn: "Dimensjonering av kurs og inntak", ikon: "DIM" },
    { id: "fagprove",      navn: "Fagprøve i praksis",              ikon: "FAGPR" },
    // NEK 400-temaer
    { id: "nek-bolig",     navn: "NEK 400-8-823: Boliger",          ikon: "8-823" },
    { id: "nek-sjokk",     navn: "NEK 400-4-41: Vern mot elektrisk sjokk", ikon: "4-41" },
    { id: "nek-overstrom", navn: "NEK 400-4-43: Overstrømsvern",     ikon: "4-43" },
    { id: "nek-kabler",    navn: "NEK 400-5-52: Kabler og forlegning", ikon: "5-52" },
    { id: "nek-kontroll",  navn: "NEK 400 del 6: Kontroll og måling", ikon: "DEL 6" },
    { id: "nek-bad",       navn: "NEK 400-7-701: Bad og dusj",       ikon: "7-701" },
    { id: "nek-elbil",     navn: "NEK 400-7-722: Elbillading",       ikon: "7-722" },
    { id: "nek-spesielle", navn: "NEK 400 del 7: Andre spesielle rom", ikon: "DEL 7" }
  ]
};
