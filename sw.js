/* ─────────────────────────────────────────────────────────────
   The NCA Hub — Service Worker
   Cache strategy:
   • HTML    → network-first (always fresh from server)
   • CSS/JS  → network-first (always fresh, no stale serving)
   • Images  → cache-first (long-lived, never changes)
   • Other   → network-first with cache fallback

   Bumping CACHE_NAME forces ALL users to throw away old caches
   on next visit, even on Safari or Opera.
   ───────────────────────────────────────────────────────────── */
const CACHE_NAME = 'nca-static-v3';
const DYNAMIC_CACHE = 'nca-dynamic-v3';
const OFFLINE_URL = '/offline.html';

/* Files pre-cached at install time */
const STATIC_CACHE = [
  OFFLINE_URL,
  '/og-image.jpg',
  '/favicon.svg',
  '/manifest.json'
];

/* ── Install ── */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(STATIC_CACHE);
    }).catch(function(err){
      console.log('[SW] Cache install warning:', err);
    })
  );
  /* Take control immediately — no waiting for old SW to die */
  self.skipWaiting();
});

/* ── Activate: wipe every old cache ── */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME && k !== DYNAMIC_CACHE; })
            .map(function(k){
              console.log('[SW] Deleting old cache:', k);
              return caches.delete(k);
            })
      );
    }).then(function(){
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clients){
      clients.forEach(function(client){
        client.postMessage({ type: 'SW_UPDATED' });
      });
    })
  );
  self.clients.claim();
});

/* ── Fetch ── */
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);

  /* Only intercept same-origin requests */
  if(url.origin !== self.location.origin) return;

  /* Skip API calls — always network */
  if(url.pathname.startsWith('/api/')) return;

  var ext = url.pathname.split('.').pop().toLowerCase();

  /* ── Images: cache-first (safe — filenames rarely change) ── */
  if(ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'svg' || ext === 'webp' || ext === 'gif'){
    e.respondWith(
      caches.match(e.request).then(function(cached){
        return cached || fetch(e.request).then(function(response){
          var clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(function(cache){ cache.put(e.request, clone); });
          return response;
        });
      })
    );
    return;
  }

  /* ── CSS / JS / HTML: ALWAYS network-first ─────────────────
     Reason: these files change on every deploy. Stale-while-
     revalidate or cache-first here causes users to see the old
     broken styles / scripts until they manually clear cache.
     Network-first means every page load gets the current file.
     Cache is only used if the network fails (offline fallback).
  ─────────────────────────────────────────────────────────── */
  e.respondWith(
    fetch(e.request)
      .then(function(response){
        /* Store fresh copy for offline fallback */
        if(response.ok){
          var clone = response.clone();
          caches.open(DYNAMIC_CACHE).then(function(cache){ cache.put(e.request, clone); });
        }
        return response;
      })
      .catch(function(){
        /* Network failed — serve from cache (offline mode) */
        return caches.match(e.request).then(function(cached){
          if(cached) return cached;
          /* For HTML, serve offline page */
          if(e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')){
            return caches.match(OFFLINE_URL);
          }
          return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});
