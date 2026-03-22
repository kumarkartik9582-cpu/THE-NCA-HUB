/**
 * NCA Hub Search — Semantic AI search with Fuse.js fallback
 * Replaces the inline search script on all pages.
 * Uses /api/search (Workers AI embeddings) when available,
 * falls back to Fuse.js keyword search instantly.
 */
(function(){
  'use strict';

  var overlay = document.getElementById('srch-overlay');
  var input = document.getElementById('srch-input');
  var resultsList = document.getElementById('srch-results');
  var emptyMsg = document.getElementById('srch-empty');
  var modeEl = document.getElementById('srch-mode');
  var fuse, indexLoaded = false;
  var searchTimer = null;
  var aiAvailable = true;

  if (!overlay || !input || !resultsList) return;

  window.openSearch = function(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.focus();
    loadFuseIndex();
  };

  window.closeSearch = function(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    resultsList.innerHTML = '';
    emptyMsg.style.display = 'none';
    if(modeEl) modeEl.textContent = '';
    input.value = '';
  };

  document.addEventListener('keydown', function(e){
    if(e.key === '/' && !overlay.classList.contains('open') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault(); window.openSearch();
    }
    if(e.key === 'Escape' && overlay.classList.contains('open')){ window.closeSearch(); }
  });

  overlay.addEventListener('click', function(e){ if(e.target === overlay) window.closeSearch(); });

  /* Load Fuse.js as instant fallback */
  function loadFuseIndex(){
    if(indexLoaded) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
    s.onload = function(){
      fetch('/search-index.json').then(function(r){ return r.json(); }).then(function(data){
        fuse = new Fuse(data, {keys:['title','desc','h1'],threshold:0.35,minMatchCharLength:2});
        indexLoaded = true;
        if(input.value) doSearch(input.value);
      });
    };
    document.head.appendChild(s);
  }

  /* Render results from either source */
  function renderResults(items, mode){
    resultsList.innerHTML = '';
    emptyMsg.style.display = items.length ? 'none' : 'block';
    if(modeEl) modeEl.textContent = mode || '';
    items.forEach(function(item){
      var li = document.createElement('li');
      var desc = (item.desc || '').replace(/<[^>]*>/g, '').slice(0, 160);
      li.innerHTML = '<a href="'+item.url+'"><span class="sr-title">'+escHtml(item.title)+'</span><span class="sr-desc">'+escHtml(desc)+'</span></a>';
      resultsList.appendChild(li);
    });
  }

  function escHtml(s){
    var d = document.createElement('div'); d.textContent = s; return d.innerHTML;
  }

  /* Fuse.js keyword search (instant) */
  function fuseSearch(q){
    if(!fuse) return [];
    return fuse.search(q, {limit:10}).map(function(r){ return r.item; });
  }

  /* AI semantic search via /api/search */
  function aiSearch(q){
    return fetch('/api/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: q, limit: 10}),
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined
    }).then(function(res){
      if(!res.ok) throw new Error('API ' + res.status);
      return res.json();
    }).then(function(data){
      if(data.results && data.results.length > 0) return data.results;
      throw new Error('no_results');
    });
  }

  /* Combined search: show Fuse instantly, upgrade with AI results */
  function doSearch(q){
    if(!q || q.length < 2){
      resultsList.innerHTML = '';
      emptyMsg.style.display = 'none';
      if(modeEl) modeEl.textContent = '';
      return;
    }

    /* Instant keyword results */
    var fuseResults = fuseSearch(q);
    renderResults(fuseResults, '');

    /* Debounced AI semantic search (waits 400ms after typing stops) */
    if(searchTimer) clearTimeout(searchTimer);
    if(!aiAvailable) return;

    searchTimer = setTimeout(function(){
      aiSearch(q).then(function(aiResults){
        /* Only upgrade if input hasn't changed */
        if(input.value.trim() === q){
          renderResults(aiResults, 'AI-powered results');
        }
      }).catch(function(){
        /* AI failed — keep Fuse results, mark AI as unavailable for this session */
        aiAvailable = false;
      });
    }, 400);
  }

  input.addEventListener('input', function(){ doSearch(this.value.trim()); });
})();
