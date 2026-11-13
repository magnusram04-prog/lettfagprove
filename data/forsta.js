// FORSTÅ SPØRSMÅLET – LettFagprøve
// Boksen «Forstå spørsmålet» vises under spørsmålet i øvingsmodus (ikke på prøveeksamen).
// SYMBOLER: forklaringer som vises automatisk når symbolet står i spørsmålet eller svaralternativene.
// TOLKNING: egen forklaring av hva et spørsmål spør om (uten å røpe svaret), per spørsmåls-id.
// UTEN_SYMBOLER: spørsmål der symbolforklaringen ville røpe svaret (spørsmålet spør nettopp om symbolet).
window.FORSTA = {
  SYMBOLER: [
    { sym: "IB", re: /\bIB\b/, tekst: "Dimensjonerende strøm (belastningsstrøm): strømmen kursen skal føre i vanlig drift." },
    { sym: "In", re: /\bIn\b/, tekst: "Merkestrømmen til vernet. En B16 eller C16 har In = 16 A." },
    { sym: "Iz", re: /\bI[zZ]\b/, tekst: "Kabelens strømføringsevne: hvor mye strøm kabelen tåler over tid uten å bli for varm, etter korreksjon for forlegning og temperatur." },
    { sym: "I2", re: /\bI2\b/, tekst: "Strømmen som sikrer at vernet løser ut innen en fastsatt tid ved overbelastning. Produsenten oppgir den, ofte som et tall ganger In." },
    { sym: "Ia", re: /\bIa\b/, tekst: "Strømmen som får vernet til å koble ut automatisk innen tiden NEK 400 krever, for eksempel 0,4 s for en sluttkurs i TN 230 V." },
    { sym: "IΔn", re: /IΔn/, tekst: "Merkeutløsestrømmen til jordfeilvernet: lekkasjestrømmen vernet er laget for å løse ut ved, for eksempel 30 mA (0,03 A)." },
    { sym: "Ik", re: /\bIk\b/, tekst: "Kortslutningsstrømmen: strømmen som går ved kortslutning eller jordfeil. Den er minst ytterst på kursen, og det er den verdien som er interessant ved kontroll av vernet." },
    { sym: "Zs", re: /\bZs\b/, tekst: "Impedansen i hele feilsløyfa: fra transformatoren, gjennom faselederen til feilstedet og tilbake gjennom beskyttelseslederen (PE)." },
    { sym: "Z-line", re: /Z-line/, tekst: "Måling av impedansen i sløyfa fase–PE (Zs). Instrumentet regner om til kortslutningsstrøm Ik." },
    { sym: "U0", re: /\bU0\b/, tekst: "Spenningen mellom faseleder og jord. I et 230/400 V TN-nett er U0 = 230 V." },
    { sym: "RA", re: /\bRA\b/, tekst: "Resistansen fra de utsatte delene, gjennom PE-lederen og jordelektroden, til jord i et TT-anlegg." },
    { sym: "ΔU", re: /ΔU/, tekst: "Spenningsfallet: hvor mange volt som går tapt i kabelen mellom tavla og forbrukeren." },
    { sym: "ρ", re: /ρ/, tekst: "Resistiviteten til ledermaterialet: resistansen i 1 m leder med 1 mm² tverrsnitt (enhet Ω·mm²/m)." },
    { sym: "L", re: /· L\b|\bL \//, tekst: "Lengden på lederen i meter." },
    { sym: "A", re: /\/ A\b|· A\b/, tekst: "Tverrsnittet til lederen i mm²." },
    { sym: "k", re: /\bk(²| =)/, tekst: "Materialkonstant som avhenger av ledermaterialet og isolasjonen. Kobber med PVC-isolasjon har k = 115." },
    { sym: "S", re: /\bS²/, tekst: "Tverrsnittet til lederen i mm²." },
    { sym: "t", re: /\bt (≤|=)/, tekst: "Tid i sekunder." },
    { sym: "I²t", re: /I²t/, tekst: "Strømmen i andre ganger tiden: et mål på hvor mye energi vernet slipper gjennom før det bryter. Står i databladet til vernet." },
    { sym: "cos φ", re: /cos ?φ/, tekst: "Effektfaktoren: hvor stor del av strømmen som gir nyttig effekt. Den er 1 for rene varmelaster og lavere for motorer." },
    { sym: "√3", re: /√3/, tekst: "Kvadratroten av 3 (ca. 1,73). Brukes i 3-fase fordi spenningen mellom to faser er √3 ganger spenningen mellom fase og nøytral." },
    { sym: "P", re: /\bP [=\/·]|= P\b|\/ P\b/, tekst: "Effekt i watt (W)." },
    { sym: "U", re: /· U\b|\/ U\b|\bU ·|\bU \//, tekst: "Spenning i volt. I 3-fase er det spenningen mellom to faser, for eksempel 400 V." },
    { sym: "I", re: /\bI [=·\/]|· I\b|= I\b/, tekst: "Strøm i ampere (A)." },
    { sym: "cc", re: /\bcc\b/, tekst: "Senteravstanden: avstanden fra midten av én kabelsløyfe til midten av den neste." },
    { sym: "×", re: / × In/, tekst: "«× In» betyr ganger merkestrømmen. «2 × In» er for eksempel 32 A for et 16 A-vern." },
    { sym: "IMD", re: /\bIMD\b|isolasjonsovervåk/i, tekst: "Isolasjonsovervåker: et apparat som måler isolasjonen mot jord hele tiden og varsler med lys eller lyd når det blir en jordfeil." },
    { sym: "⏚", re: /⏚/, tekst: "Symbolet for jord (beskyttelsesleder, PE)." },
    { sym: "Tilsynelatende effekt", re: /tilsynelatende/i, tekst: "S, målt i VA: spenning ganger strøm, uten å ta hensyn til faseforskyvning. Den aktive effekten (W) er S ganger cos φ." },
    { sym: "RDC-DD", re: /RDC-DD/, tekst: "Et apparat som oppdager likestrøms-lekkasje (DC) og kobler ut. Brukes sammen med jordfeilvern type A eller F ved elbillading." },
    { sym: "PEN", re: /\bPEN\b/, tekst: "En leder som er både beskyttelsesleder (PE) og nøytralleder (N) samtidig. Brukes i TN-C-delen av anlegget." },
    { sym: "Klokkeposisjon", re: /klokkeposisjon|\b\d{1,2}h\b/i, tekst: "Hvor jordpinnen sitter på en industrikontakt, sagt som timene på en klokke. Den hindrer at kontakter for ulik spenning passer sammen." },
    { sym: "Eca", re: /\bEca\b/, tekst: "Brannklasse for kabler. Eca er minstekravet for kabler i fast installasjon." }
  ],

  TOLKNING: {
    "n41-4": "Spørsmålet handler om feilbeskyttelse. Ved jordfeil (fase mot en jordet metalldel) skal vernet koble ut raskt nok. Feilstrømmen bestemmes av spenningen og impedansen i feilsløyfa (Ohms lov: I = U / Z). Tenk over hvor stor feilstrømmen må være sammenlignet med strømmen som får vernet til å løse ut.",
    "n41-12": "I et TT-anlegg går feilstrømmen gjennom jorda via jordelektroden. Berøringsspenningen på en del med feil blir feilstrømmen ganger RA, og den skal ikke bli over 50 V. Bruk RA · IΔn ≤ 50 V, sett inn IΔn i ampere, og regn ut hvor stor RA kan være.",
    "n41-3": "En hovedkurs forsyner et annet skap, ikke stikkontakter eller utstyr folk holder i. Derfor er kravet til utkoblingstid et annet enn for sluttkurser.",
    "n41-16": "Spørsmålet gjelder hovedkurser (fordelingskurser), ikke sluttkurser. I TT-systemer er tidene andre enn i TN.",
    "n43-3": "Vernet skal være minst like stort som belastningen, men ikke større enn det kabelen tåler. Finn standardstørrelsen som passer mellom de to verdiene.",
    "n43-6": "Formelen t = k² · S² / I² gir hvor mange sekunder lederen tåler kortslutningsstrømmen før isolasjonen blir for varm. Sett inn k, tverrsnittet S og strømmen I.",
    "n43-13": "Vernet skal beskytte kabelen mot overbelastning. Tenk over hvordan merkestrømmen til vernet må forholde seg til det kabelen tåler.",
    "n823-2": "I bolig har NEK 400-8-823 et eget, strengere krav for kurser med ledere på 4 mm² Cu eller mindre. Spørsmålet er hvilke to krav som gjelder der i stedet for den vanlige regelen.",
    "n823-3": "I2 = 1,45 · In betyr at vernet kan trenge 1,45 ganger merkestrømmen før det sikkert løser ut. Finn den største In som holder kravet for bolig, og velg standardstørrelsen som ikke går over.",
    "fp19": "Samme tankegang som i bolig: I2 skal ikke være større enn Iz. Her er I2 = 1,3 · In, så regn ut den største In som holder, og velg standardstørrelsen som ikke går over.",
    "fp20": "Boligregelen i NEK 400-8-823 (I2 ≤ Iz) gjelder bare for små ledere, opp til en bestemt tverrsnittsgrense. Tenk over om 6 mm² er over eller under den grensen, og hvilke krav som da gjelder.",
    "fp21": "Ved kortslutning skal automatsikringen løse ut momentant (magnetisk). Det skjer først når strømmen er et visst antall ganger merkestrømmen, og antallet avhenger av karakteristikken (B eller C).",
    "d6": "Momentan (magnetisk) utløsning skjer først når strømmen er et visst antall ganger merkestrømmen. Hver karakteristikk har et spenn, altså et område fra en laveste til en høyeste verdi, for eksempel 5–10 × In for C. Vernet kan løse ut hvor som helst i spennet. Hvilken verdi må du regne med for å være sikker på at det løser ut?",
    "e8": "Instrumentet sammenligner målt kortslutningsstrøm med strømmen som trengs for at C16-vernet skal løse ut momentant.",
    "n6-10": "Regn først ut kortslutningsstrømmen med Ohms lov: Ik = U0 / Zs. Sammenlign så med strømmen som gir momentan utløsning for en B16.",
    "fp22": "Spenningsfallet er strømmen ganger resistansen i lederne. Resistansen regnes ut fra ρ, lengde og tverrsnitt. Tenk over hvor mange ledere strømmen går gjennom på en 1-fase kurs.",
    "d10": "I 3-fase regner du med spenningen mellom fasene (400 V), og effekten fordeles på tre faser. Finn formelen som gir strømmen når P, U og cos φ er kjent.",
    "v4": "Bruk effektformelen for 3-fase: P = √3 · U · I · cos φ. Sett inn U = 400 V, I = 10 A og cos φ = 1.",
    "g6": "Resistansen i en leder er R = ρ · L / A. L er lengden i meter og A er tverrsnittet i mm².",
    "fp9": "Resistansen i en leder er R = ρ · L / A. Ved kontinuitetsmåling måler du én leder, så du bruker lengden på PE-lederen.",
    "n52-6": "Tabellverdien for Iz gjelder for standardforhold. Ligger kabelen varmere eller sammen med andre kabler, tåler den mindre, og da ganger du tabellverdien med korreksjonsfaktorene.",
    "fp11": "Senteravstanden sier hvor tett sløyfene ligger. Jo lengre kabel på samme areal, jo tettere må de ligge. Pass på enhetene: svaret skal være i cm.",
    "e9": "Prøvingen sjekker både ved hvilken strøm og hvor raskt jordfeilvernet løser ut. Sammenlign med vernets IΔn og grensen for utløsetid.",
    "n6-9": "Spørsmålet gjelder prøving med strøm lik IΔn på et vanlig jordfeilvern. Det gjelder ikke type S (selektivt), som er tidsforsinket med vilje så vernene lenger ut i anlegget løser ut først.",
    "fp10": "Du prøver et vanlig jordfeilvern med strøm lik IΔn og ser på tiden. Type S (selektivt) er tidsforsinket med vilje og har andre tider, så det gjelder ikke her.",
    "n52-14": "Under drift er lederen varmere enn 20 °C, og varm kobber har høyere resistans. Spørsmålet er hvilken resistivitet (ρ) NEK 400 regner med for kobber når lederen er varm."
  },

  UTEN_SYMBOLER: ["n43-1", "n43-2", "n43-5", "d1", "bf1", "i3", "d7", "v5", "v6", "s7", "e16", "n722-15", "j18"]
};
