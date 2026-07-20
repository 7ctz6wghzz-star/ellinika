// Ελληνικά flashcards — service worker (network-first)
const CACHE = 'ellinika-v6';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      const fresh = await fetch(e.request, { cache: 'no-store' });
      const cache = await caches.open(CACHE);
      cache.put(e.request, fresh.clone()).catch(() => {});
      return fresh;
    } catch (err) {
      const cached = await caches.match(e.request);
      return cached || Response.error();
    }
  })());
});
