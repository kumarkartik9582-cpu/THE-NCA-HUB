/* ─────────────────────────────────────────────────────────────
   The NCA Hub — Service Worker v4
   Cache strategy:
   • HTML       → network-first  (always get fresh page with updated asset URLs)
   • CSS / JS   → stale-while-revalidate  (serve from cache for instant paint,
                  fetch fresh in background; HTML versioned URLs bust this
                  automatically when deploying nca-premium-v4.css etc.)
   • Images     → cache-first   (long-lived, content-addressed filenames)
   • Other      → stale-while-revalidate with cache fallback

   Bumping CACHE_NAME forces ALL users to throw away old caches
   on next visit, even on Safari or Opera.
   ───────────────────────────────────────────────────────────── */
const CACHE_NAME = 'nca-static-v4';
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
  self.skipWaiting();
});

/* ── Activate: wipe every old cache ── */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
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

  /* Only intercept same-origin GET requests */
  if(url.origin !== self.location.origin) return;
  if(e.request.method !== 'GET') return;

  /* Skip API calls — always network */
  if(url.pathname.startsWith('/api/')) return;

  var ext = url.pathname.split('.').pop().toLowerCase().split('?')[0];

  /* ── Images: cache-first (safe — content-addressed filenames) ── */
  if(ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'svg' ||
     ext === 'webp' || ext === 'gif' || ext === 'ico' || ext === 'woff2'){
    e.respondWith(
      caches.match(e.request).then(function(cached){
        if(cached) return cached;
        return fetch(e.request).then(function(response){
          if(response.ok){
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  /* ── HTML: network-first so page always loads with fresh asset URLs ── */
  if(e.request.headers.get('accept') && e.request.headers.get('accept').includes('text/html')){
    e.respondWith(
      fetch(e.request)
        .then(function(response){
          if(response.ok){
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
          }
          return response;
        })
        .catch(function(){
          return caches.match(e.request).then(function(cached){
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  /* ── CSS / JS / everything else: stale-while-revalidate ─────────────
     Serve from cache immediately for fast paint. Fetch fresh in background.
     When HTML is updated to point to new versioned URLs (e.g. nca-premium-v4.css),
     the cache won't have that URL, so it falls through to network naturally.
  ─────────────────────────────────────────────────────────────────── */
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.match(e.request).then(function(cached){
        var networkFetch = fetch(e.request).then(function(response){
          if(response.ok){
            cache.put(e.request, response.clone());
          }
          return response;
        }).catch(function(){
          return cached || new Response('Offline', { status: 503 });
        });
        /* Return cached immediately, update in background */
        return cached || networkFetch;
      });
    })
  );
});
