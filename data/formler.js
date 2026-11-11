// FORMLER – LettFagprøve
// Formelsamling (#/formler) og hint i regneoppgavene (feltet "formler" i regneoppgaver.js viser til id-ene her).
// "formel" er hovedformelen, "varianter" er omskrivinger, "symboler" forklarer bokstavene.
// NEK-henvisninger er kontrollert mot NEK 400:2022 (7. utgave).
window.FORMLER = [
  { gruppe: "Grunnleggende", formler: [
    { id: "ohm", navn: "Ohms lov", formel: "U = R · I", varianter: ["I = U / R", "R = U / I"],
      symboler: "U = spenning (V), R = resistans (Ω), I = strøm (A)" },
    { id: "effekt-dc", navn: "Effekt (resistiv last)", formel: "P = U · I", varianter: ["I = P / U", "P = R · I²", "P = U² / R"],
      symboler: "P = effekt (W). Gjelder likestrøm og rene varmelaster (cos φ = 1)" },
    { id: "energi", navn: "Energi og kostnad", formel: "W = P · t", varianter: ["Kostnad = W · pris per kWh"],
      symboler: "W = energi (kWh), P = effekt (kW), t = tid (h)" },
    { id: "virkningsgrad", navn: "Virkningsgrad", formel: "η = P_ut / P_inn", varianter: ["P_inn = P_ut / η"],
      symboler: "η = virkningsgrad (0–1). Merkeeffekten på en motor er avgitt effekt (P_ut)" }
  ]},
  { gruppe: "Vekselstrøm", formler: [
    { id: "effekt-1f", navn: "Effekt 1-fase", formel: "P = U · I · cos φ", varianter: ["I = P / (U · cos φ)", "S = U · I"],
      symboler: "U = 230 V, cos φ = effektfaktor, S = tilsynelatende effekt (VA)" },
    { id: "effekt-3f", navn: "Effekt 3-fase", formel: "P = √3 · U · I · cos φ", varianter: ["I = P / (√3 · U · cos φ)", "S = √3 · U · I"],
      symboler: "U = linjespenning (400 V eller 230 V IT), I = linjestrøm, √3 ≈ 1,732" },
    { id: "effekttrekant", navn: "Effekttrekanten", formel: "S² = P² + Q²", varianter: ["P = S · cos φ", "Q = S · sin φ", "cos φ = P / S"],
      symboler: "P = aktiv effekt (W), Q = reaktiv effekt (VAr), S = tilsynelatende effekt (VA)" },
    { id: "stjerne-trekant", navn: "Stjerne og trekant", formel: "Stjerne: U_L = √3 · U_f,  I_L = I_f",
      varianter: ["Trekant: U_L = U_f,  I_L = √3 · I_f"], symboler: "L = linje (mellom faser), f = fase (over én vikling)" }
  ]},
  { gruppe: "Resistans", formler: [
    { id: "lederresistans", navn: "Resistans i leder", formel: "R = ρ · L / A",
      symboler: "ρ = resistivitet (kobber 0,0175, aluminium ≈ 0,029 Ω·mm²/m ved 20 °C), L = lengde (m), A = tverrsnitt (mm²)" },
    { id: "serie", navn: "Seriekobling", formel: "R = R1 + R2 + R3 …", symboler: "Samme strøm gjennom alle, spenningen deles" },
    { id: "parallell", navn: "Parallellkobling", formel: "1/R = 1/R1 + 1/R2 + …", varianter: ["To motstander: R = R1 · R2 / (R1 + R2)"],
      symboler: "Samme spenning over alle, strømmene legges sammen" }
  ]},
  { gruppe: "Spenningsfall", formler: [
    { id: "spfall-1f", navn: "Spenningsfall 1-fase", formel: "ΔU = 2 · I · ρ · L · cos φ / A", varianter: ["Med R per leder: ΔU = 2 · I · R"],
      symboler: "Faktor 2 fordi strømmen går fram og tilbake. L = enkel lengde (m). Reaktansen er sett bort fra" },
    { id: "spfall-3f", navn: "Spenningsfall 3-fase", formel: "ΔU = √3 · I · ρ · L · cos φ / A",
      symboler: "Gjelder symmetrisk last. ΔU er linjespenningsfall. Reaktansen er sett bort fra" },
    { id: "spfall-prosent", navn: "Spenningsfall i prosent", formel: "ΔU % = ΔU / U · 100",
      symboler: "Anbefalt grense ved tilknytning til allment nett: 3 % for belysning og 5 % for annen bruk", kilde: "NEK 400-5-52, tabell 52F-1 s. 228" }
  ]},
  { gruppe: "Vern og kabel", formler: [
    { id: "ib-in-iz", navn: "Overbelastningsvern", formel: "IB ≤ In ≤ Iz", varianter: ["I2 ≤ 1,45 · Iz"],
      symboler: "IB = belastningsstrøm, In = vernets merkestrøm, Iz = kabelens strømføringsevne, I2 = sikker utløsestrøm", kilde: "NEK 400-4-43, 431.3 s. 125" },
    { id: "bolig-i2", navn: "Bolig: ledere ≤ 4 mm²", formel: "I2 ≤ Iz", varianter: ["Automatsikring (I2 = 1,45 · In): In ≤ Iz / 1,45"],
      symboler: "Strengere enn hovedregelen. Gjelder vern for kobberledere til og med 4 mm² i bolig", kilde: "NEK 400-8-823, 823.431.3.1 s. 506" },
    { id: "korreksjon", navn: "Korrigert strømføringsevne", formel: "Iz = I_tabell · k1 · k2 …",
      symboler: "k1 = temperaturfaktor, k2 = faktor for samlet forlegning, osv. Hentes fra korreksjonstabellene i NEK 400-5-52" },
    { id: "samtidighet", navn: "Strøm med samtidighetsfaktor", formel: "I = P · SF / (√3 · U)", varianter: ["1-fase: I = P · SF / U"],
      symboler: "SF = samtidighetsfaktor (andelen av installert effekt som brukes samtidig)" }
  ]},
  { gruppe: "Kortslutning og jordfeil", formler: [
    { id: "ik", navn: "Kortslutningsstrøm", formel: "Ik = U / Z", symboler: "Z = impedansen i kortslutningssløyfen (Ω). I TN regnes enpolet feil med U0 = 230 V" },
    { id: "momentan", navn: "Momentan utløsning (automatsikring)", formel: "B: Ik ≥ 5 · In,  C: Ik ≥ 10 · In", varianter: ["D: Ik ≥ 20 · In"],
      symboler: "Øvre grense for momentanutløseren til hver karakteristikk" },
    { id: "zs", navn: "Utkobling i TN-system", formel: "Zs · Ia ≤ U0", varianter: ["Ia ≤ U0 / Zs"],
      symboler: "Zs = feilsløyfeimpedans (Ω), Ia = strøm som gir utkobling innen kravet til tid, U0 = spenning fase–jord", kilde: "NEK 400-5-53, 531.2.2.1 s. 232" },
    { id: "kortslutningstid", navn: "Tid lederen tåler kortslutning", formel: "t = (k · S / I)²", varianter: ["Gjennomsluppet energi: I²t ≤ k² · S²"],
      symboler: "k = materialfaktor (Cu/PVC = 115), S = tverrsnitt (mm²), I = kortslutningsstrøm (A), t = tid (s)", kilde: "NEK 400-5-53, 533.3 s. 241" },
    { id: "pe-tverrsnitt", navn: "Tverrsnitt for beskyttelsesleder", formel: "S = √(I² · t) / k",
      symboler: "I = feilstrøm (A), t = utkoblingstid (s), k = faktor fra tillegg 54A", kilde: "NEK 400-5-54, 543.1.2 s. 291" }
  ]},
  { gruppe: "Motor", formler: [
    { id: "turtall", navn: "Synkront turtall", formel: "n = 60 · f / p", symboler: "f = frekvens (Hz), p = antall polpar (poler / 2), n = o/min" },
    { id: "slipp", navn: "Slipp", formel: "s = (n_s − n) / n_s · 100 %", symboler: "n_s = synkront turtall, n = målt turtall" },
    { id: "motorstrom", navn: "Strøm til 3-fase motor", formel: "I = P_ut / (η · √3 · U · cos φ)", symboler: "P_ut = merkeeffekt på akselen (W), η = virkningsgrad, U = linjespenning (V), cos φ = effektfaktor" }
  ]},
  { gruppe: "Bolig", formler: [
    { id: "uttak", navn: "Stikkontakter i oppholdsrom", formel: "2 uttak per påbegynt 4 m²",
      symboler: "Rund alltid areal / 4 opp til nærmeste hele tall", kilde: "NEK 400-8-823, 823.537.301.2 s. 507" },
    { id: "cc", navn: "Cc-avstand varmekabel", formel: "cc (cm) = A (m²) · 100 / L (m)", varianter: ["Effekt per m²: P / A"],
      symboler: "A = oppvarmet areal (uten varmefrie soner), L = kabellengde" }
  ]}
];
