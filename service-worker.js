const CACHE_NAME = 'haggis-golf-v3';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./app-icon.svg'];

/** Stores the application shell so an already-opened app can work without reception. */
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

/** Removes obsolete application-shell caches after an update. */
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

/** Serves cached app files first, with the network used for anything not cached. */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
