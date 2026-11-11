// Service worker: gjør at appen virker uten nett etter første besøk.
// Øk versjonsnummeret når du endrer filer, så mobilene henter den nye versjonen.
const VERSJON = "elproven-v24";
const FILER = [
  "./", "index.html", "css/stil.css", "js/app.js",
  "data/innstillinger.js", "data/symboler.js", "data/bilder.js", "data/sporsmal.js", "data/regneoppgaver.js", "data/formler.js", "data/kurs.js", "personvern.html", "data/forsta.js", "fonter/ibm-plex-mono-latin-400-normal.woff2", "fonter/ibm-plex-mono-latin-600-normal.woff2", "fonter/ibm-plex-mono-latin-700-normal.woff2", "fonter/schibsted-grotesk-latin-400-normal.woff2", "fonter/schibsted-grotesk-latin-600-normal.woff2", "fonter/schibsted-grotesk-latin-700-normal.woff2", "fonter/schibsted-grotesk-latin-800-normal.woff2",
  "bilder/jordfeilbryter.jpg", "bilder/tangamperemeter.jpg", "bilder/stikkontakt-jordet.jpg", "bilder/cee-16a-bla.jpg",
  "bilder/egen-bryter-merking.jpg", "bilder/egen-cee-rod-merkeskilt.jpg", "bilder/egen-cee-rod-tilkobling.jpg", "bilder/egen-gammel-tavle-isolasjonsduk.jpg", "bilder/egen-koblingsboks-blank-pe.jpg", "bilder/egen-koblingsboks-tvunnet.jpg", "bilder/egen-lampeklemme.jpg", "bilder/egen-maling-isolasjon.jpg", "bilder/egen-maling-rcd.jpg", "bilder/egen-maling-zline.jpg", "bilder/egen-stikkontakt-flexror.jpg", "bilder/egen-tavle-c60h.jpg", "bilder/egen-tavle-jfb-og-f.jpg", "bilder/egen-tavle-jordfeilautomater.jpg", "bilder/egen-varmekabel-ute.jpg", "bilder/egen-kabel-i-jord.jpg", "bilder/egen-stikkontakt-merket.jpg", "bilder/egen-kabelbro-adskilt.jpg", "bilder/egen-styreskap-tns.jpg", "bilder/egen-tavle-avbruddsfri.jpg", "bilder/egen-overspenningsvern.jpg", "bilder/egen-rekkeklemmer.jpg", "bilder/multimeter.jpg", "bilder/isolasjonsmaler.jpg", "bilder/kontaktor.jpg", "bilder/type2-og-ccs.jpg", "bilder/automatsikringer-rad.jpg", "bilder/kabelbro-brann.jpg",
  "manifest.webmanifest", "ikoner/ikon.svg", "ikoner/ikon-192.png", "ikoner/ikon-512.png", "ikoner/ikon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSJON).then((c) => c.addAll(FILER)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== VERSJON).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});
// Nett først (så du ser endringer med en gang), lagret kopi hvis du er offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((svar) => {
      const kopi = svar.clone();
      caches.open(VERSJON).then((c) => c.put(e.request, kopi));
      return svar;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html")))
  );
});
