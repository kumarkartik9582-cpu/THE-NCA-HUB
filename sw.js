const CACHE_NAME = 'nca-hub-v4';
const OFFLINE_URL = '/offline.html';
const STATIC_CACHE = [
  OFFLINE_URL,
  '/',
  '/index.html',
  '/og-image.jpg',
  '/favicon.svg',
  '/manifest.json',
  '/nca-enhancements.js',
  '/nca-chat-widget.js',
  '/notes/',
  '/notes/administrative-law/',
  '/notes/constitutional-law/',
  '/notes/criminal-law/',
  '/notes/foundations-of-canadian-law/',
  '/notes/professional-responsibility/',
  '/notes/complete-bundle/',
  '/nca-exam-dates-2026/',
  '/nca-cost-calculator/',
  '/nca-prep-checklist/',
  '/blog/'
];

/* JS files that must always be fetched fresh (network-first) */
const ALWAYS_FRESH = ['/nca-chat-widget.js', '/nca-enhancements.js'];

/* Install: cache critical assets */
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(STATIC_CACHE);
    }).catch(function(err){
      console.log('Cache install failed:', err);
    })
  );
  self.skipWaiting();
});

/* Activate: clean old caches + notify clients */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      /* Notify all open tabs that a new version is available */
      return self.clients.matchAll({ type: 'window' }).then(function(clients){
        clients.forEach(function(client){
          client.postMessage({ type: 'SW_UPDATED' });
        });
      });
    })
  );
  self.clients.claim();
});

/* Fetch: network-first for HTML + critical JS, cache-first for other static assets */
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  /* Only handle same-origin requests */
  if(url.origin !== self.location.origin) return;

  /* Skip API calls — always network */
  if(url.pathname.startsWith('/api/')) return;

  /* Critical JS files: network-first so updates deploy immediately */
  if(ALWAYS_FRESH.indexOf(url.pathname) !== -1){
    e.respondWith(
      fetch(e.request)
        .then(function(response){
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(e.request, clone);
          });
          return response;
        })
        .catch(function(){
          return caches.match(e.request);
        })
    );
    return;
  }

  /* For HTML pages: network first, fall back to cache, then offline page */
  if(e.request.headers.get('accept') &&
     e.request.headers.get('accept').includes('text/html')){
    e.respondWith(
      fetch(e.request)
        .then(function(response){
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(e.request, clone);
          });
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

  /* For static assets: cache first, fall back to network */
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, clone);
        });
        return response;
      });
    })
  );
});
