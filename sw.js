const CACHE = 'nekokafe-v1';
const ASSETS = [
  '/nekokafebang/',
  '/nekokafebang/index.html',
  '/nekokafebang/pc.html',
  '/nekokafebang/manifest.json',
  '/nekokafebang/icons/icon-192.png',
  '/nekokafebang/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network first para Firebase, cache first para assets locales
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    return; // Deja pasar Firebase sin interceptar
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
