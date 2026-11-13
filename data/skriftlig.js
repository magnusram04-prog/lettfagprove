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
        losning: ["R per leder = 0,0175 · 25 / 2,5 = 0,175 Ω", "ΔU = 2 · IB · R = 2 · 12,17 · 0,175 ≈ 4,26 V", "ΔU % = 4,26 / 230 · 100 ≈ 1,85 %", "Det er godt under anbefalingen på 4 % (NEK 400-6, 6.4.3.10 s. 337)"] },
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
        losning: ["ΔU % = 5,97 / 400 · 100 ≈ 1,49 %", "Under 4 %, så spenningsfallet er greit (NEK 400-6, 6.4.3.10 s. 337)"] },
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
      { sporsmal: "Kabelen er 6 mm², så de generelle kravene gjelder (IB ≤ In ≤ Iz). Hva er den største standard merkestrømmen du kan velge?", svar: 32, toleranse: 0, enhet: "A", formler: ["ib-in-iz"],
        losning: ["In må ligge mellom IB og Iz: 15,88 A ≤ In ≤ 36 A", "Største standardverdi under 36 A er 32 A", "Med I2 = 1,45 · In blir også I2 ≤ 1,45 · Iz oppfylt (NEK 400-4-43, 431.3 s. 125)", "I praksis velger du ofte 20 A, fordi laderen trekker ca. 16 A og produsenten oppgir hva laderen tåler"] },
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
        losning: ["Mål lederresistans og isolasjonsresistans før og etter at kabelen er lagt, så en skade oppdages før gulvet er ferdig (NEK 400-6, 6.4.3.2 og 6.4.3.3 s. 332).", "Plassering av gulvvarme og følere skal være med i dokumentasjonen som overleveres eieren (NEK 400-8-823, 823.514.5.301 s. 506)."] },
      { sporsmal: "Hvor kan stikkontakten ved vasken plasseres, og hvilket vern skal kursen ha?",
        punkter: ["Utenfor sone 1 og 2 (vanlig 230 V stikkontakt)", "I sone 1 eller 2 bare SELV/PELV inntil 25 V AC", "30 mA jordfeilvern på kursen"],
        losning: ["En vanlig 230 V stikkontakt skal stå utenfor sone 1 og 2. Inne i sonene er bare SELV eller PELV inntil 25 V AC / 60 V DC tillatt (NEK 400-7-701, 701.512.2 s. 346).", "Kursene på badet skal ha 30 mA jordfeilvern (NEK 400-7-701, 701.411.3.3 s. 345)."] }
    ] }
];
