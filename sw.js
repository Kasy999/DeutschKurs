// Offline-Unterstützung: alle Dateien werden beim ersten Besuch gespeichert.
const CACHE = 'deutschkurs-v11';
const DICT_CACHE = 'deutschkurs-dict'; // Wörterbuch: verwaltet js/dictionary.js (nur die gewählte Sprache)
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/config.js', 'js/prelude.js', 'js/data.js', 'js/data_more.js', 'js/data_hu.js', 'js/data_lazy.js', 'js/engine.js', 'js/speech.js', 'js/visuals.js', 'js/placement.js', 'js/account.js', 'js/stats.js', 'js/lang_hu.js', 'js/grammarbook_data.js', 'js/grammarbook.js', 'js/dictionary.js', 'js/ui.js',
  'icons/icon-32.png', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== DICT_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Netzwerk zuerst (damit Updates ankommen), sonst aus dem Speicher.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Wörterbuch-Dateien nicht in den App-Cache legen (sonst lägen bald alle Sprachen im Speicher)
  if (new URL(e.request.url).pathname.includes('/dict/')) return;
  e.respondWith(
    // cache: 'no-cache' = beim Server nachfragen, ob es eine neue Version gibt (sonst hält der Browser Dateien bis zu 10 Minuten fest)
    fetch(e.request.mode === 'navigate' ? e.request.url : e.request, { cache: 'no-cache' }).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
