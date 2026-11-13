// SKRIFTLIGE OPPGAVER – LettFagprøve
// Hele oppgaver som ligner den skriftlige eksamenen: en situasjon, gitte verdier og flere deloppgaver.
// Deloppgave med "svar" er et tallsvar (sjekkes automatisk). Deloppgave med "punkter" er skriftlig:
// eleven skriver svaret selv og krysser av for punktene i løsningsforslaget som var med.
// Verdier for strømføringsevne (Iz) og I2 er gitt i oppgaven, slik eksamen gir tabeller og datablad.
// B 5 × In og C 10 × In for momentan utløsning kommer fra produktstandarden for automatsikringer, ikke fra NEK 400.
// Fasitene er regnet ut og kontrollert mot NEK 400:2022 (13.11.2026). Kontroller nye oppgaver før de publiseres.
window.SKRIFTLIG = [
  { id: "s-1", tittel: "Kurs til panelovner i ny enebolig", tid: 20,
    situasjon: "Du skal prosjektere en ny kurs til stua i en ny enebolig. Anlegget er TN-C-S 230/400 V. Kursen forsyner to panelovner på 1000 W og én på 800 W, alle 230 V mellom fase og N.",
    gitt: ["Kabel: 3G 2,5 mm² kobber, 25 m, forlagt i isolert vegg", "Strømføringsevne etter korreksjon: Iz = 20 A", "Automatsikring C-karakteristikk, I2 = 1,45 · In (datablad)", "Standard merkestrømmer: 10, 13, 16, 20 A", "ρ = 0,0175 Ω·mm²/m, cos φ = 1"],
    deler: [
      { sporsmal: "Regn ut dimensjonerende laststrøm IB.", svar: 12.17, toleranse: 0.05, enhet: "A", formler: ["effekt-dc"],
        losning: ["Samlet effekt: 1000 + 1000 + 800 = 2800 W", "IB = P / U = 2800 / 230", "IB ≈ 12,17 A"] },
      { sporsmal: "Hvilken merkestrøm In velger du? Kabelen er 2,5 mm², så boligkravet I2 ≤ Iz gjelder.", svar: 13, toleranse: 0, enhet: "A", formler: ["ib-in-iz", "bolig-i2"],
        losning: ["Boligkrav for ledere ≤ 4 mm²: IB ≤ In og I2 ≤ Iz (NEK 400-8-823, 823.431.3.1 s. 506)", "I2 ≤ 20 A gir 1,45 · In ≤ 20 A, altså In ≤ 13,8 A", "IB = 12,17 A ≤ In", "Største standardverdi som passer: 13 A. 16 A gir I2 = 23,2 A, som er for mye"] },
      { sporsmal: "Regn ut spenningsfallet i prosent ved IB.", svar: 1.85, toleranse: 0.05, enhet: "%", formler: ["lederresistans", "spfall-1f", "spfall-prosent"],
        losning: ["R per leder = 0,0175 · 25 / 2,5 = 0,175 Ω", "ΔU = 2 · IB · R = 2 · 12,17 · 0,175 ≈ 4,26 V", "ΔU % = 4,26 / 230 · 100 ≈ 1,85 %", "Det er godt under både den veiledende grensen på 5 % for annen bruk enn lys (NEK 400-5-52, 525 s. 185) og anbefalingen på 4 % ved kontroll (NEK 400-6, 6.4.3.10 s. 337)"] },
      { sporsmal: "Hvor stor kan sløyfeimpedansen Zs høyst være for at C13 skal løse ut momentant ved jordfeil?", svar: 1.77, toleranse: 0.02, enhet: "Ω", formler: ["momentan", "zs"],
        losning: ["C-karakteristikk løser ut momentant ved 10 · In (produktstandarden): Ia = 10 · 13 = 130 A", "Krav i TN: Ia ≤ U0 / Zs, altså Zs ≤ U0 / Ia (NEK 400-5-53, 531.2.2.1 s. 232)", "Zs ≤ 230 / 130 ≈ 1,77 Ω"] },
      { sporsmal: "Hvilken tilleggsbeskyttelse skal kursen ha, og hvorfor?",
        punkter: ["Jordfeilvern på høyst 30 mA", "Kravet gjelder hver forbrukerkurs i bolig", "Det beskytter mot elektrisk sjokk hvis grunn- eller feilbeskyttelsen svikter"],
        losning: ["I bolig skal hver forbrukerkurs ha tilleggsbeskyttelse med jordfeilvern på høyst 30 mA (NEK 400-8-823, 823.411.3.3 s. 505 og NEK 400-4-41, 415.1)", "Jordfeilvernet er et ekstra lag i tillegg til grunn- og feilbeskyttelse. Det kobler ut før en lekkasjestrøm gjennom kroppen blir farlig"] }
    ] },

  { id: "s-2", tittel: "Motorkurs i verksted", tid: 20,
    situasjon: "Et verksted skal ha en ny 3-fase asynkronmotor til en kompressor. Anlegget er TN-S 400 V.",
    gitt: ["Motor: 7,5 kW avgitt effekt, η = 0,88, cos φ = 0,84", "Kabel: 5G 2,5 mm² kobber, 40 m", "ρ = 0,0175 Ω·mm²/m"],
    deler: [
      { sporsmal: "Regn ut motorens merkestrøm.", svar: 14.64, toleranse: 0.1, enhet: "A", formler: ["motorstrom"],
        losning: ["I = P_ut / (η · √3 · U · cos φ)", "I = 7500 / (0,88 · 1,732 · 400 · 0,84)", "I = 7500 / 512,1 ≈ 14,64 A"] },
      { sporsmal: "Regn ut spenningsfallet i volt ved merkestrøm.", svar: 5.97, toleranse: 0.05, enhet: "V", formler: ["spfall-3f"],
        losning: ["ΔU = √3 · I · ρ · L · cos φ / A", "ΔU = 1,732 · 14,64 · 0,0175 · 40 · 0,84 / 2,5", "ΔU ≈ 5,97 V"] },
      { sporsmal: "Hvor mange prosent er det av 400 V?", svar: 1.49, toleranse: 0.05, enhet: "%", formler: ["spfall-prosent"],
        losning: ["ΔU % = 5,97 / 400 · 100 ≈ 1,49 %", "Under både 5 % (veiledende grense for annen bruk enn lys, NEK 400-5-52, 525 s. 185) og 4 % (anbefaling ved kontroll, NEK 400-6, 6.4.3.10 s. 337), så spenningsfallet er greit"] },
      { sporsmal: "Hvorfor velger du ofte C-karakteristikk på kursvernet til en motor, og hva beskytter motorvernet mot?",
        punkter: ["Motoren har høy startstrøm (innkoblingsstrøm)", "C tåler høyere startstrøm uten å løse ut", "Motorvernet (termisk) beskytter motoren mot overbelastning", "Motorvernet stilles inn på motorens merkestrøm (ca. 14,6 A)"],
        losning: ["En asynkronmotor trekker flere ganger merkestrømmen når den starter. Et B-vern kan da løse ut uten at noe er galt. C løser ut momentant først ved 5–10 × In (produktstandarden).", "Det termiske motorvernet beskytter mot overbelastning, for eksempel når kompressoren går tungt. Det stilles inn på merkestrømmen fra merkeskiltet."] },
      { sporsmal: "Hva må du kontrollere før motoren settes i drift første gang?",
        punkter: ["Fasefølge/rotasjonsretning", "Isolasjonsresistans", "Kontinuitet i PE til motoren", "Innstilling av motorvernet"],
        losning: ["Kontroller fasefølgen, så motoren går riktig vei.", "Mål isolasjonsresistans og kontinuitet i beskyttelseslederen (NEK 400-6).", "Sjekk at motorvernet er stilt inn på merkestrømmen."] }
    ] },

  { id: "s-3", tittel: "Lader for elbil i bolig", tid: 15,
    situasjon: "En kunde vil ha en fast ladestasjon på 11 kW i garasjen til en enebolig. Anlegget er TN-C-S 230/400 V. Laderen er 3-fase og har ikke innebygd DC-deteksjon.",
    gitt: ["Lader: 11 kW, 400 V 3-fase, cos φ = 1", "Kabel: 5G 6 mm² kobber, Iz = 36 A etter korreksjon", "Standard merkestrømmer: 16, 20, 25, 32 A"],
    deler: [
      { sporsmal: "Regn ut IB for laderen.", svar: 15.88, toleranse: 0.05, enhet: "A", formler: ["effekt-3f"],
        losning: ["I = P / (√3 · U · cos φ)", "I = 11 000 / (1,732 · 400 · 1)", "I ≈ 15,88 A"] },
      { sporsmal: "Hvilken samtidighetsfaktor bruker du for ladepunktet når kursen og inntaket dimensjoneres?", svar: 1, toleranse: 0, enhet: "",
        losning: ["Samtidighetsfaktoren for kursen til et ladepunkt er 1, med mindre det finnes et laststyringssystem (NEK 400-7-722 s. 463)", "Ladingen kan vare i mange timer med full strøm"] },
      { sporsmal: "Kabelen er 6 mm², så de generelle kravene gjelder (IB ≤ In ≤ Iz). Hva er den minste standard merkestrømmen du kan velge?", svar: 16, toleranse: 0, enhet: "A", formler: ["ib-in-iz"],
        losning: ["In må ligge mellom IB og Iz: 15,88 A ≤ In ≤ 36 A", "Minste standardverdi over 15,88 A er 16 A", "16, 20, 25 og 32 A oppfyller alle kravet. Med I2 = 1,45 · In blir også I2 ≤ 1,45 · Iz oppfylt (NEK 400-4-43, 431.3 s. 125)", "Sjekk alltid i manualen hvilket forankoblet vern laderen krever"] },
      { sporsmal: "Hvilket jordfeilvern skal ladepunktet ha, og hvilken kontakt skal laderen ha?",
        punkter: ["Eget jordfeilvern for ladepunktet, høyst 30 mA", "Type B, eller type A/F sammen med RDC-DD (siden laderen ikke har DC-deteksjon)", "Type 2-kontakt eller fast Type 2-kabel", "Type AC er ikke godkjent"],
        losning: ["Hvert ladepunkt skal ha sitt eget jordfeilvern på høyst 30 mA. Fordi laderen ikke har DC-deteksjon, må vernet være type B, eller type A/F kombinert med RDC-DD (NEK 400-7-722, 722.531.2.3 s. 466).", "Tilkoblingspunktet skal være en Type 2-elbilkontakt eller en fast tilkoblet Type 2-plugg (NEK 400-7-722, 722.55.101.2 s. 467)."] }
    ] },

  { id: "s-4", tittel: "Minste kortslutningsstrøm i IT-anlegg", tid: 20,
    situasjon: "En stikkontaktkurs i en eldre bolig med IT-nett 230 V skal kontrolleres. Du skal finne den minste kortslutningsstrømmen ytterst på kursen (kortslutning mellom to faser).",
    gitt: ["Impedans fram til tavla (målt mellom to faser): 0,30 Ω", "Kabel: 2,5 mm² kobber, 30 m", "ρ = 0,0175 Ω·mm²/m ved 20 °C. Gang med 1,2 for varm leder", "Kursvern: C16"],
    deler: [
      { sporsmal: "Regn ut resistansen i én leder når den er varm.", svar: 0.252, toleranse: 0.003, enhet: "Ω", formler: ["lederresistans"],
        losning: ["R20 = 0,0175 · 30 / 2,5 = 0,21 Ω", "Varm leder: 0,21 · 1,2 = 0,252 Ω"] },
      { sporsmal: "Regn ut minste kortslutningsstrøm ytterst på kursen.", svar: 286, toleranse: 2, enhet: "A", formler: ["ik"],
        losning: ["Strømmen går ut i én fase og tilbake i den andre, så kabelen teller to ganger: 2 · 0,252 = 0,504 Ω", "Z = 0,30 + 0,504 = 0,804 Ω", "Ik = 230 / 0,804 ≈ 286 A"] },
      { sporsmal: "Løser C16 ut momentant? Forklar.",
        punkter: ["C16 trenger 10 · 16 = 160 A for sikker momentan utløsning", "286 A er større enn 160 A", "Ja, vernet løser ut momentant"],
        losning: ["C-karakteristikk løser sikkert ut momentant ved 10 · In (produktstandarden): 10 · 16 = 160 A.", "Ik = 286 A ≥ 160 A, så vernet bryter momentant og kabelen er beskyttet (NEK 400-4-43, 431.4 s. 126–127 og NEK 400-5-53, 533.3 s. 241–243)."] },
      { sporsmal: "Hvor lang kan kabelen høyst være før C16 ikke lenger løser ut momentant?", svar: 67.7, toleranse: 1, enhet: "m", formler: ["ik", "momentan"],
        losning: ["Største Z: 230 / 160 ≈ 1,4375 Ω", "Kabelen kan bruke 1,4375 − 0,30 = 1,1375 Ω", "2 · 1,2 · 0,0175 · L / 2,5 ≤ 1,1375", "L ≤ 1,1375 · 2,5 / 0,042 ≈ 67,7 m"] }
    ] },

  { id: "s-5", tittel: "Varmekabel og stikkontakt på bad", tid: 15,
    situasjon: "Et bad i en bolig pusses opp. Det skal legges varmekabel i gulvet, og kunden vil ha en stikkontakt ved vasken.",
    gitt: ["Oppvarmet gulvareal (uten varmefrie områder): 4,5 m²", "Varmekabel: 30 m, 17 W/m, 230 V"],
    deler: [
      { sporsmal: "Regn ut cc-avstanden.", svar: 15, toleranse: 0.1, enhet: "cm", formler: ["cc"],
        losning: ["cc (cm) = areal (m²) · 100 / lengde (m)", "cc = 4,5 · 100 / 30 = 15 cm"] },
      { sporsmal: "Regn ut effekten per m² gulv.", svar: 113.3, toleranse: 0.5, enhet: "W/m²", formler: ["effekt-dc"],
        losning: ["Kabeleffekt: 30 · 17 = 510 W", "510 / 4,5 ≈ 113,3 W/m²"] },
      { sporsmal: "Hva skal du måle og dokumentere for varmekabelen?",
        punkter: ["Lederresistans (sammenlign med produktbladet)", "Isolasjonsresistans", "Mål før legging, etter legging og før gulvet støpes/flislegges", "Tegning eller bilde av hvor kabelen og føleren ligger, i dokumentasjonen til eieren"],
        losning: ["Isolasjonsresistansen for varmesystemet skal dokumenteres (NEK 400-7-753 s. 486–487). Mål lederresistans og isolasjonsresistans både før og etter legging, og før gulvet støpes. Det siste er god praksis og ikke et eget krav, men da oppdager du en skade før gulvet er ferdig.", "Plassering av gulvvarme og følere skal være med i dokumentasjonen som overleveres eieren (NEK 400-8-823, 823.514.5.301 s. 506)."] },
      { sporsmal: "Hvor kan stikkontakten ved vasken plasseres, og hvilket vern skal kursen ha?",
        punkter: ["Utenfor sone 1 og 2 (vanlig 230 V stikkontakt)", "I sone 1 eller 2 bare SELV/PELV inntil 25 V AC", "30 mA jordfeilvern på kursen"],
        losning: ["En vanlig 230 V stikkontakt skal stå utenfor sone 1 og 2. Inne i sonene er bare SELV eller PELV inntil 25 V AC / 60 V DC tillatt (NEK 400-7-701, 701.512.2 s. 346).", "Kursene på badet skal ha 30 mA jordfeilvern (NEK 400-7-701, 701.411.3.3 s. 345)."] }
    ] },

  { id: "s-6", tittel: "Hovedsikring til enebolig", tid: 10,
    situasjon: "En ny enebolig skal tilknyttes nettet. Anlegget er TN-C-S 230/400 V. Du skal finne strømmen til overbelastningsvernet i inntaket (OV).",
    gitt: ["Installert effekt: 30 kW", "Samtidighetsfaktor (ditt valg ut fra boligen): 0,6", "Standard merkestrømmer: 25, 32, 40, 50, 63 A"],
    deler: [
      { sporsmal: "Regn ut strømmen inntaket må dimensjoneres for.", svar: 25.98, toleranse: 0.1, enhet: "A", formler: ["samtidighet"],
        losning: ["I = P · SF / (√3 · U)", "I = 30 000 · 0,6 / (1,732 · 400)", "I = 18 000 / 692,8 ≈ 25,98 A"] },
      { sporsmal: "Hvilken merkestrøm velger du for vernet?", svar: 32, toleranse: 0, enhet: "A", formler: ["ib-in-iz"],
        losning: ["In ≥ IB: 25,98 A", "25 A er for lite. Minste standardverdi som passer er 32 A", "Inntakskabelen må da ha Iz ≥ 32 A"] },
      { sporsmal: "Forklar hva samtidighetsfaktoren betyr, og hvorfor du ikke bare bruker den installerte effekten.",
        punkter: ["Ikke alt utstyr er på samtidig", "Samtidighetsfaktoren er forholdet mellom største samlede last og installert effekt", "Uten den blir inntaket unødvendig stort og dyrt", "Ladepunkt for elbil regnes med faktor 1"],
        losning: ["Samtidighetsfaktoren sier hvor stor del av den installerte effekten som brukes samtidig når belastningen er størst (definisjon i NEK 400 s. 46).", "Med full installert effekt blir inntak, kabel og vern større enn nødvendig.", "For kursen til et ladepunkt er faktoren 1, med mindre det finnes et laststyringssystem (NEK 400-7-722 s. 463)."] }
    ] },

  { id: "s-7", tittel: "Tåler kabelen kortslutningen?", tid: 10,
    situasjon: "En lyskurs har 1,5 mm² kobberkabel med PVC-isolasjon og vern C10. Du har regnet ut at minste kortslutningsstrøm ytterst på kursen er 400 A.",
    gitt: ["k = 115 (kobber med PVC)", "S = 1,5 mm²", "Ik = 400 A", "C løser ut momentant ved 10 · In (produktstandarden)"],
    deler: [
      { sporsmal: "Hvor lang tid tåler lederen denne kortslutningsstrømmen?", svar: 0.186, toleranse: 0.003, enhet: "s", formler: ["kortslutningstid"],
        losning: ["t = (k · S / I)²", "k · S = 115 · 1,5 = 172,5", "172,5 / 400 = 0,431", "t = 0,431² ≈ 0,186 s (NEK 400-5-53, 533.3 s. 241)"] },
      { sporsmal: "Hvor stor strøm trenger C10 for å løse ut momentant?", svar: 100, toleranse: 0, enhet: "A", formler: ["momentan"],
        losning: ["Ia = 10 · In = 10 · 10 A = 100 A (produktstandarden for automatsikringer)"] },
      { sporsmal: "Er kabelen beskyttet? Begrunn svaret.",
        punkter: ["400 A er større enn 100 A, så vernet løser ut momentant", "Momentan utløsning tar typisk under 0,1 s", "Lederen tåler 0,186 s, så vernet bryter før lederen blir for varm", "Kabelen er beskyttet mot kortslutning"],
        losning: ["Ik = 400 A ≥ 100 A, så C10 løser ut momentant. Det tar vanligvis under 0,1 s.", "Lederen tåler 0,186 s. Vernet bryter altså før isolasjonen blir for varm, og kabelen er beskyttet (NEK 400-4-43, 431.4 s. 126–127)."] }
    ] },

  { id: "s-8", tittel: "Jordelektrode i TT-anlegg", tid: 10,
    situasjon: "En hytte forsynes som TT-anlegg med egen jordelektrode. Alle kurser har 30 mA jordfeilvern, og hovedkursen har 300 mA. Du har målt jordelektroden til RA = 120 Ω.",
    gitt: ["Krav: RA · IΔn ≤ 50 V", "IΔn = 30 mA (kurser) og 300 mA (hovedkurs)", "Målt RA = 120 Ω"],
    deler: [
      { sporsmal: "Hvor stor kan RA høyst være når vernet er 30 mA?", svar: 1667, toleranse: 2, enhet: "Ω", formler: ["ohm"],
        losning: ["RA ≤ 50 V / IΔn", "RA ≤ 50 / 0,03 ≈ 1667 Ω (NEK 400-5-53, 531.2.3.6.2 s. 236)"] },
      { sporsmal: "Hvor stor kan RA høyst være når vernet er 300 mA?", svar: 166.7, toleranse: 0.5, enhet: "Ω", formler: ["ohm"],
        losning: ["RA ≤ 50 / 0,3 ≈ 166,7 Ω"] },
      { sporsmal: "Er den målte jordelektroden god nok? Forklar hvorfor TT-anlegg trenger jordfeilvern.",
        punkter: ["120 Ω er under både 1667 Ω og 166,7 Ω, så den er god nok", "I TT går feilstrømmen gjennom jorda, så den blir liten", "En liten feilstrøm løser ikke ut en automatsikring raskt nok", "Derfor brukes jordfeilvern, som løser ut på mA"],
        losning: ["120 Ω er lavere enn begge grensene, så elektroden er god nok.", "I TT går feilstrømmen tilbake gjennom jorda via to jordelektroder. Strømmen blir for liten til at en vanlig automatsikring løser ut raskt. Jordfeilvern løser ut på noen få milliampere, så det kobler ut likevel."] }
    ] },

  { id: "s-9", tittel: "Motor i trekant", tid: 15,
    situasjon: "En 4-polet 3-fase motor skal kobles til et TN-nett på 400 V. Merkeskiltet sier 400/690 V.",
    gitt: ["Avgitt effekt 15 kW, η = 0,90, cos φ = 0,86", "Merketurtall 1460 o/min, 50 Hz", "Merkeskilt: 400 V Δ / 690 V Y"],
    deler: [
      { sporsmal: "Skal motoren kobles i stjerne eller trekant på 400 V? Forklar.",
        punkter: ["Trekant (Δ)", "I trekant får hver vikling linjespenningen 400 V", "Viklingene er laget for 400 V (690 V er for stjerne)"],
        losning: ["Merkeskiltet 400 V Δ / 690 V Y betyr at hver vikling tåler 400 V.", "I trekant ligger hver vikling direkte mellom to faser og får 400 V. Derfor skal motoren kobles i trekant på et 400 V-nett."] },
      { sporsmal: "Regn ut linjestrømmen ved full last.", svar: 27.97, toleranse: 0.1, enhet: "A", formler: ["motorstrom"],
        losning: ["I = P_ut / (η · √3 · U · cos φ)", "I = 15 000 / (0,90 · 1,732 · 400 · 0,86)", "I = 15 000 / 536,3 ≈ 27,97 A"] },
      { sporsmal: "Regn ut slippet i prosent.", svar: 2.67, toleranse: 0.05, enhet: "%", formler: ["turtall", "slipp"],
        losning: ["4 poler = 2 polpar. Synkront turtall: n_s = 60 · 50 / 2 = 1500 o/min", "s = (1500 − 1460) / 1500 · 100 %", "s ≈ 2,67 %"] }
    ] },

  { id: "s-10", tittel: "Stikkontakter i ny bolig", tid: 10,
    situasjon: "Du prosjekterer stikkontakter i en ny leilighet. Stua er 30 m², og soverommet er 11 m².",
    gitt: ["Krav i stue, soverom og andre oppholdsrom: minst to uttak per påbegynt 4 m²"],
    deler: [
      { sporsmal: "Hvor mange uttak skal stua minst ha?", svar: 16, toleranse: 0, enhet: "", formler: ["uttak"],
        losning: ["30 / 4 = 7,5, altså 8 påbegynte arealer", "8 · 2 = 16 uttak (NEK 400-8-823, 823.537.301.2 s. 507)"] },
      { sporsmal: "Hvor mange uttak skal soverommet minst ha?", svar: 6, toleranse: 0, enhet: "", formler: ["uttak"],
        losning: ["11 / 4 = 2,75, altså 3 påbegynte arealer", "3 · 2 = 6 uttak"] },
      { sporsmal: "Hvor skal uttakene plasseres, og hvilke stikkontakter kan du bruke i en bolig?",
        punkter: ["Fordelt der møbleringen gir behov", "Fortrinnsvis langs vegg", "Høyst 2,0 m over gulvet", "Stikkontakter med barnesikring (eller over 1,5 m / utilgjengelig for barn)"],
        losning: ["Uttakene skal fordeles der det ut fra møblering er behov, og fortrinnsvis sitte langs vegg. De skal sitte høyst 2,0 m over gulvet (NEK 400-8-823 s. 507).", "Vanlige stikkontakter i bolig skal ha barnesikring, sitte minst 1,5 m over gulvet eller være utilgjengelige for barn (NEK 400-8-823, 823.511 s. 506)."] }
    ] },

  { id: "s-11", tittel: "Effekttrekant for en motor", tid: 10,
    situasjon: "En 3-fase motor på 400 V tar opp 8 kW aktiv effekt med cos φ = 0,8.",
    gitt: ["P = 8 kW", "cos φ = 0,8", "U = 400 V, 3-fase"],
    deler: [
      { sporsmal: "Regn ut den tilsynelatende effekten S.", svar: 10, toleranse: 0.05, enhet: "kVA", formler: ["effekttrekant"],
        losning: ["S = P / cos φ", "S = 8 / 0,8 = 10 kVA"] },
      { sporsmal: "Regn ut den reaktive effekten Q.", svar: 6, toleranse: 0.05, enhet: "kvar", formler: ["effekttrekant"],
        losning: ["S² = P² + Q²", "Q = √(10² − 8²) = √36 = 6 kvar"] },
      { sporsmal: "Regn ut linjestrømmen.", svar: 14.43, toleranse: 0.05, enhet: "A", formler: ["effekt-3f"],
        losning: ["I = S / (√3 · U)", "I = 10 000 / (1,732 · 400) ≈ 14,43 A"] },
      { sporsmal: "Hva skjer med strømmen hvis cos φ blir bedre (nærmere 1), og hvorfor er det nyttig?",
        punkter: ["Strømmen blir mindre for samme aktive effekt", "Mindre strøm gir mindre tap og spenningsfall", "Kabler og vern kan være mindre"],
        losning: ["Med samme P og bedre cos φ blir S mindre, og da blir strømmen mindre.", "Mindre strøm gir mindre varmetap og spenningsfall i kabelen."] }
    ] },

  { id: "s-12", tittel: "Ladepunkter i borettslag", tid: 15,
    situasjon: "Et borettslag vil ha fire ladepunkter på 11 kW (3-fase, 400 V TN, cos φ = 1) i felles garasje. Det er ikke planlagt laststyring.",
    gitt: ["4 ladepunkter à 11 kW", "U = 400 V, 3-fase", "Ingen laststyring"],
    deler: [
      { sporsmal: "Hvor stor samlet effekt må tilførselen dimensjoneres for?", svar: 44, toleranse: 0, enhet: "kW", formler: ["samtidighet"],
        losning: ["Uten laststyring er samtidighetsfaktoren 1 (NEK 400-7-722 s. 463)", "P = 4 · 11 = 44 kW"] },
      { sporsmal: "Regn ut strømmen i tilførselen.", svar: 63.51, toleranse: 0.1, enhet: "A", formler: ["effekt-3f"],
        losning: ["I = P / (√3 · U)", "I = 44 000 / (1,732 · 400) ≈ 63,51 A"] },
      { sporsmal: "Hva kan borettslaget gjøre for å slippe en så stor tilførsel, og hvilke krav gjelder for hvert ladepunkt?",
        punkter: ["Installere et laststyringssystem", "Da kan man regne med lavere samtidighet", "Hvert ladepunkt har eget jordfeilvern (type B, eller A/F med RDC-DD)", "Type 2-kontakt eller fast Type 2-kabel"],
        losning: ["Med et laststyringssystem fordeles strømmen mellom bilene, og tilførselen kan dimensjoneres lavere (NEK 400-7-722 s. 463).", "Hvert ladepunkt skal ha sitt eget jordfeilvern på høyst 30 mA, type B eller type A/F med RDC-DD (722.531.2.3 s. 466), og Type 2-tilkobling (722.55.101.2 s. 467)."] }
    ] },

  { id: "s-13", tittel: "Tverrsnitt på beskyttelsesleder", tid: 10,
    situasjon: "Du vil kontrollere at en beskyttelsesleder tåler en jordfeil. Feilstrømmen er 1000 A, og vernet kobler ut på 0,1 s.",
    gitt: ["I = 1000 A", "t = 0,1 s", "k = 115 (kobber med PVC)", "Standard tverrsnitt: 1,5 / 2,5 / 4 / 6 mm²"],
    deler: [
      { sporsmal: "Regn ut minste tverrsnitt for PE-lederen.", svar: 2.75, toleranse: 0.03, enhet: "mm²", formler: ["pe-tverrsnitt"],
        losning: ["S = √(I² · t) / k", "I² · t = 1000² · 0,1 = 100 000", "√100 000 ≈ 316,2", "S = 316,2 / 115 ≈ 2,75 mm² (NEK 400-5-54, 543.1.2 s. 291)"] },
      { sporsmal: "Hvilket standard tverrsnitt velger du?", svar: 4, toleranse: 0, enhet: "mm²",
        losning: ["Du må velge et tverrsnitt som er minst 2,75 mm²", "2,5 mm² er for lite, så du velger 4 mm²"] },
      { sporsmal: "Hvorfor blir kravet strengere hvis vernet bruker lengre tid på å koble ut?",
        punkter: ["Lengre tid gir mer varme i lederen (I² · t blir større)", "Lederen må da være tykkere for å tåle varmen"],
        losning: ["Varmen i lederen øker med I² · t. Bruker vernet lengre tid, blir det mer varme, og lederen må være tykkere for ikke å bli skadet."] }
    ] },

  { id: "s-14", tittel: "Lyskurs i lager", tid: 15,
    situasjon: "Et lager skal ha en ny lyskurs, 230 V TN. Kursen har 20 LED-armaturer på 60 W.",
    gitt: ["20 · 60 W, cos φ = 1", "Kabel: 1,5 mm² kobber, 45 m", "ρ = 0,0175 Ω·mm²/m", "Vern: B10, momentan ved 5 · In (produktstandarden)"],
    deler: [
      { sporsmal: "Regn ut IB.", svar: 5.22, toleranse: 0.05, enhet: "A", formler: ["effekt-dc"],
        losning: ["P = 20 · 60 = 1200 W", "IB = 1200 / 230 ≈ 5,22 A"] },
      { sporsmal: "Regn ut spenningsfallet i prosent.", svar: 2.38, toleranse: 0.05, enhet: "%", formler: ["lederresistans", "spfall-1f", "spfall-prosent"],
        losning: ["R = 0,0175 · 45 / 1,5 = 0,525 Ω", "ΔU = 2 · 5,22 · 0,525 ≈ 5,48 V", "ΔU % = 5,48 / 230 · 100 ≈ 2,38 %", "Under 3 %, som er den veiledende grensen for belysning (NEK 400-5-52, 525 s. 185)"] },
      { sporsmal: "Hvor stor kan sløyfeimpedansen Zs høyst være for at B10 skal løse ut momentant?", svar: 4.6, toleranse: 0.05, enhet: "Ω", formler: ["zs", "momentan"],
        losning: ["Ia = 5 · 10 = 50 A", "Zs ≤ U0 / Ia = 230 / 50 = 4,6 Ω (NEK 400-5-53, 531.2.2.1 s. 232)"] },
      { sporsmal: "Mange LED-armaturer på én kurs kan gi problemer med B-vern. Hvorfor, og hva gjør du?",
        punkter: ["LED-drivere har høy innkoblingsstrøm", "B-vernet kan løse ut når lyset slås på", "Velg C-karakteristikk eller fordel armaturene på flere kurser", "Sjekk da at Zs fortsatt er lav nok for C (10 · In)"],
        losning: ["LED-drivere trekker en kort, høy strøm når de slås på. Mange på samme kurs kan få et B-vern til å løse ut.", "Løsningen er C-karakteristikk eller flere kurser. Med C10 trengs 100 A for momentan utløsning, så Zs må da være høyst 2,3 Ω."] }
    ] },

  { id: "s-15", tittel: "Isolasjonsmåling før overlevering", tid: 10,
    situasjon: "Du har installert en ny 230 V kurs i en bolig og skal gjøre førstegangskontroll før anlegget tas i bruk.",
    gitt: ["Kursen er 230 V", "Overspenningsvern er montert i tavla", "Målt isolasjonsresistans: 0,8 MΩ"],
    deler: [
      { sporsmal: "Hvilken prøvespenning bruker du (V DC)?", svar: 500, toleranse: 0, enhet: "V",
        losning: ["For kurser opp til 1000 V (unntatt SELV og PELV) er prøvespenningen 500 V DC (NEK 400-6, tabell 6A s. 332)"] },
      { sporsmal: "Hva er minste godkjente isolasjonsresistans?", svar: 1, toleranse: 0, enhet: "MΩ",
        losning: ["Kravet er ≥ 1 MΩ ved 500 V DC (NEK 400-6, tabell 6A s. 332)"] },
      { sporsmal: "Er 0,8 MΩ godkjent? Hva gjør du, og hva må du passe på før du måler?",
        punkter: ["Nei, 0,8 MΩ er under 1 MΩ", "Finn og rett feilen, og mål på nytt", "Koble fra overspenningsvern og utstyr som kan påvirke målingen", "N skal ikke være forbundet med PE under målingen", "Mål kontinuitet i PE før isolasjonsmålingen"],
        losning: ["0,8 MΩ er under kravet på 1 MΩ, så kursen er ikke godkjent. Feilen må rettes, og målingen gjentas sammen med prøvinger som kan være påvirket.", "Overspenningsvern og annet utstyr som kan påvirke resultatet, skal kobles fra før måling. N skal ikke være forbundet med PE (NEK 400-6 s. 332).", "Kontinuitet i beskyttelseslederne prøves helst først (NEK 400-6 s. 331)."] }
    ] }
];
