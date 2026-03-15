#!/usr/bin/env python3
"""Task 2b — Add Fuse.js search overlay to all GA4 pages."""
import os, re, glob

ROOT = '/home/user/THE-NCA-HUB'

SEARCH_CSS = '''<style id="search-overlay-css">
#srch-btn{background:none;border:none;cursor:pointer;color:var(--fog);padding:6px;display:flex;align-items:center;transition:color .2s;margin-left:8px;}
#srch-btn:hover{color:var(--cream);}
#srch-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;}
#srch-overlay{display:none;position:fixed;inset:0;z-index:10000;background:rgba(5,5,8,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);padding:80px 24px 24px;overflow-y:auto;}
#srch-overlay.open{display:block;}
#srch-box{max-width:640px;margin:0 auto;}
#srch-wrap{position:relative;margin-bottom:24px;}
#srch-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(201,168,76,.25);color:var(--cream);font-family:var(--fb);font-size:1rem;padding:14px 48px 14px 18px;letter-spacing:.02em;outline:none;}
#srch-input:focus{border-color:rgba(201,168,76,.5);}
#srch-close{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--fog);cursor:pointer;font-size:1.4rem;line-height:1;padding:4px;}
#srch-results{list-style:none;margin:0;padding:0;}
#srch-results li{border-bottom:1px solid rgba(255,255,255,.05);}
#srch-results a{display:block;padding:14px 18px;text-decoration:none;transition:background .15s;}
#srch-results a:hover,#srch-results a:focus{background:rgba(201,168,76,.07);}
#srch-results .sr-title{display:block;font-size:.88rem;color:var(--cream);font-family:var(--fb);font-weight:600;margin-bottom:3px;}
#srch-results .sr-desc{display:block;font-size:.75rem;color:var(--dim);line-height:1.5;}
#srch-empty{text-align:center;color:var(--dim);font-size:.82rem;padding:32px;display:none;}
#srch-hint{font-size:.7rem;color:var(--dim);letter-spacing:.1em;text-align:center;margin-top:20px;}
</style>'''

SEARCH_BUTTON = '<button id="srch-btn" aria-label="Search site" onclick="openSearch()"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg></button>'

SEARCH_HTML = '''<!-- Site Search Overlay -->
<div id="srch-overlay" role="dialog" aria-modal="true" aria-label="Site search">
  <div id="srch-box">
    <div id="srch-wrap">
      <input id="srch-input" type="search" placeholder="Search NCA Hub…" autocomplete="off" aria-label="Search">
      <button id="srch-close" aria-label="Close search" onclick="closeSearch()">&#x2715;</button>
    </div>
    <ul id="srch-results" role="listbox"></ul>
    <p id="srch-empty">No results found. Try different keywords.</p>
    <p id="srch-hint">Press <kbd style="background:rgba(255,255,255,.08);padding:2px 6px;border-radius:3px;font-family:monospace;">/</kbd> to search · <kbd style="background:rgba(255,255,255,.08);padding:2px 6px;border-radius:3px;font-family:monospace;">ESC</kbd> to close</p>
  </div>
</div>
<script>
(function(){
  var overlay = document.getElementById('srch-overlay');
  var input = document.getElementById('srch-input');
  var resultsList = document.getElementById('srch-results');
  var emptyMsg = document.getElementById('srch-empty');
  var fuse, indexLoaded = false;

  window.openSearch = function(){
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.focus();
    loadIndex();
  };
  window.closeSearch = function(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    resultsList.innerHTML = '';
    emptyMsg.style.display = 'none';
    input.value = '';
  };

  document.addEventListener('keydown', function(e){
    if(e.key === '/' && !overlay.classList.contains('open') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault(); window.openSearch();
    }
    if(e.key === 'Escape' && overlay.classList.contains('open')){ window.closeSearch(); }
  });
  overlay.addEventListener('click', function(e){ if(e.target === overlay) window.closeSearch(); });

  function loadIndex(){
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

  function doSearch(q){
    if(!fuse){ return; }
    var results = fuse.search(q, {limit:10});
    resultsList.innerHTML = '';
    emptyMsg.style.display = results.length ? 'none' : 'block';
    results.forEach(function(r){
      var item = r.item;
      var li = document.createElement('li');
      li.innerHTML = '<a href="'+item.url+'"><span class="sr-title">'+item.title+'</span><span class="sr-desc">'+item.desc+'</span></a>';
      resultsList.appendChild(li);
    });
  }

  input.addEventListener('input', function(){ doSearch(this.value.trim()); });
})();
</script>'''

def add_search_to_file(path):
    with open(path) as f:
        content = f.read()
    if 'srch-overlay' in content:
        return False  # already done
    modified = False
    # Add CSS to <head>
    if '</head>' in content and 'search-overlay-css' not in content:
        content = content.replace('</head>', SEARCH_CSS + '\n</head>', 1)
        modified = True
    # Add search button before </nav> (first nav close tag)
    if '</nav>' in content and 'srch-btn' not in content:
        content = content.replace('</nav>', SEARCH_BUTTON + '\n</nav>', 1)
        modified = True
    # Add overlay + JS before </body>
    if '</body>' in content:
        content = content.replace('</body>', SEARCH_HTML + '\n</body>', 1)
        modified = True
    if modified:
        with open(path, 'w') as f:
            f.write(content)
    return modified

all_html = glob.glob(os.path.join(ROOT, '**', 'index.html'), recursive=True)
changed = 0
for path in sorted(all_html):
    if add_search_to_file(path):
        changed += 1

print(f'Task 2: Search overlay added to {changed} files')
