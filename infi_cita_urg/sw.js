const CACHE_VERSION = 'julandrex-infi-cita-urg-v1';
const ASSETS = ['./','./index.html','./sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(resp => {
        if(!resp||resp.status!==200||resp.type!=='basic') return resp;
        const clone = resp.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        return resp;
      });
    })
  );
});