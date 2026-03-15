const CACHE_NAME = 'nca-hub-v1';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/og-image.jpg',
  '/favicon.svg',
  '/manifest.json',
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

/* Activate: clean old caches */
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

/* Fetch: network-first for HTML, cache-first for static assets */
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  /* Only handle same-origin requests */
  if(url.origin !== self.location.origin) return;

  /* For HTML pages: network first, fall back to cache */
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
          return caches.match(e.request);
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
