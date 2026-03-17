#!/usr/bin/env python3
"""Sprint H — Advanced SEO & UX Features

Tasks:
1. Auto-generated sticky Table of Contents (collapsible, desktop sidebar + mobile toggle)
2. Speakable schema markup on all article pages (voice search / AI assistant optimization)
3. Section anchor links — "#" copy buttons on h2 headings for deep-linking
4. Reading time auto-calculation via JS (computes from actual content)
"""
import os
import re
import glob
import json

ROOT = '/home/user/THE-NCA-HUB'

# ─────────────────────────────────────────────────────────────────
# 1. TABLE OF CONTENTS CSS + JS
# ─────────────────────────────────────────────────────────────────

TOC_CSS = '''<style id="toc-styles">
/* ── Table of Contents ── */
#toc-wrap{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.12);padding:20px 24px;margin:0 0 40px;max-width:680px;}
#toc-toggle{display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:none;border:none;width:100%;padding:0;color:var(--cream);font-family:var(--fb);font-size:.65rem;letter-spacing:.28em;text-transform:uppercase;font-weight:600;}
#toc-toggle svg{width:14px;height:14px;stroke:var(--g1);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .3s ease;flex-shrink:0;}
#toc-wrap.open #toc-toggle svg{transform:rotate(180deg);}
#toc-label{display:flex;align-items:center;gap:10px;color:var(--g1);}
#toc-label::before{content:'';width:16px;height:1px;background:var(--g1);}
#toc-body{overflow:hidden;transition:max-height .4s cubic-bezier(.16,1,.3,1),opacity .3s ease;max-height:0;opacity:0;margin-top:0;}
#toc-wrap.open #toc-body{max-height:600px;opacity:1;margin-top:14px;}
#toc-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:2px;}
.toc-item a{display:block;font-size:.78rem;color:var(--dim);text-decoration:none;padding:5px 0 5px 12px;border-left:2px solid transparent;transition:color .2s,border-color .2s,padding-left .2s;line-height:1.4;}
.toc-item a:hover{color:var(--g1);border-left-color:rgba(201,168,76,.4);}
.toc-item a.toc-active{color:var(--g1);border-left-color:var(--g1);padding-left:16px;}
#toc-progress-text{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-top:12px;padding-top:10px;border-top:1px solid rgba(201,168,76,.08);}

/* ── Section anchor links ── */
.art-body h2{position:relative;}
.h2-anchor{position:absolute;right:100%;top:50%;transform:translateY(-50%);padding:0 8px;opacity:0;transition:opacity .2s;color:rgba(201,168,76,.4);font-size:.85rem;text-decoration:none;font-family:var(--fb);}
.art-body h2:hover .h2-anchor{opacity:1;}
.h2-anchor:hover{color:var(--g1)!important;}
@media(max-width:768px){.h2-anchor{display:none;}}

/* Copy toast */
#copy-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--g1);color:var(--void);font-family:var(--fb);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;padding:8px 20px;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s;z-index:9999;}
#copy-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
</style>'''

TOC_HTML_AND_JS = '''<!-- Table of Contents + Section Anchors -->
<div id="copy-toast" aria-live="polite">Link copied</div>
<script>
(function(){
  /* ── Build TOC ── */
  var body = document.getElementById('art-body');
  if(!body) return;
  var headings = Array.from(body.querySelectorAll('h2'));
  if(headings.length < 3) return; // skip very short articles

  // Ensure each h2 has an id
  headings.forEach(function(h, i){
    if(!h.id){
      var slug = h.textContent.trim()
        .toLowerCase()
        .replace(/[^a-z0-9\\s-]/g,'')
        .replace(/\\s+/g,'-')
        .replace(/-+/g,'-')
        .slice(0,60);
      h.id = slug || ('section-' + (i+1));
    }
    // Add anchor link button
    var a = document.createElement('a');
    a.className = 'h2-anchor';
    a.href = '#' + h.id;
    a.setAttribute('aria-label', 'Link to: ' + h.textContent.trim());
    a.innerHTML = '#';
    a.addEventListener('click', function(e){
      e.preventDefault();
      var url = window.location.origin + window.location.pathname + '#' + h.id;
      if(navigator.clipboard){
        navigator.clipboard.writeText(url).then(showToast);
      } else {
        // fallback
        var t = document.createElement('textarea');
        t.value = url; document.body.appendChild(t); t.select();
        document.execCommand('copy'); document.body.removeChild(t);
        showToast();
      }
      history.pushState(null,'','#' + h.id);
    });
    h.style.position = 'relative';
    h.appendChild(a);
  });

  /* ── Render TOC ── */
  var wrap = document.createElement('div');
  wrap.id = 'toc-wrap';
  wrap.className = 'open'; // open by default
  wrap.setAttribute('aria-label','Table of contents');

  var items = headings.map(function(h, i){
    return '<li class="toc-item"><a href="#'+h.id+'" data-idx="'+i+'">'+h.textContent.replace(/#$/,'').trim()+'</a></li>';
  }).join('');

  wrap.innerHTML = '<button id="toc-toggle" aria-expanded="true" aria-controls="toc-body"><span id="toc-label">Contents</span><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div id="toc-body" id="toc-body"><ol id="toc-list">'+items+'</ol><p id="toc-progress-text">0 of '+headings.length+' sections</p></div>';

  // Insert before first heading in art-body
  var firstH2 = body.querySelector('h2');
  if(firstH2) body.insertBefore(wrap, firstH2);
  else body.prepend(wrap);

  // Toggle open/close
  var toggle = document.getElementById('toc-toggle');
  var tocBody = wrap.querySelector('#toc-body');
  toggle.addEventListener('click',function(){
    var open = wrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Smooth scroll
  wrap.querySelectorAll('.toc-item a').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      var id = this.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if(target){
        var offset = 80; // nav height
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top:top, behavior:'smooth'});
        history.pushState(null,'','#'+id);
      }
    });
  });

  /* ── Active section highlight + progress ── */
  var links = Array.from(wrap.querySelectorAll('.toc-item a'));
  var progressTxt = document.getElementById('toc-progress-text');
  var activeIdx = 0;

  function updateActive(){
    var scrollY = window.scrollY + 120;
    var newIdx = 0;
    headings.forEach(function(h, i){
      if(h.getBoundingClientRect().top + window.scrollY - 120 <= scrollY) newIdx = i;
    });
    if(newIdx !== activeIdx){
      links.forEach(function(l){ l.classList.remove('toc-active'); });
      if(links[newIdx]) links[newIdx].classList.add('toc-active');
      activeIdx = newIdx;
      if(progressTxt) progressTxt.textContent = (newIdx+1) + ' of ' + headings.length + ' sections';
    }
  }
  window.addEventListener('scroll', updateActive, {passive:true});
  updateActive();

  /* ── Copy toast ── */
  function showToast(){
    var t = document.getElementById('copy-toast');
    if(!t) return;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2000);
  }
  window._ncaShowToast = showToast;
})();
</script>'''

# ─────────────────────────────────────────────────────────────────
# 2. SPEAKABLE SCHEMA
# ─────────────────────────────────────────────────────────────────

def add_speakable_to_schema(html):
    """Add SpeakableSpecification to the Article JSON-LD block."""
    # Check if speakable already exists
    if 'SpeakableSpecification' in html or '"speakable"' in html:
        return html

    speakable_block = ''',
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".art-title", ".answer-capsule", "h1"]
      }'''

    # Find the keywords field (first occurrence in JSON-LD Article block)
    # Pattern: "keywords": "..." at end of object
    pattern = r'("keywords"\s*:\s*"[^"]*")\s*\n(\s*\})'
    match = re.search(pattern, html)
    if match:
        replacement = match.group(1) + speakable_block + '\n' + match.group(2)
        html = html[:match.start()] + replacement + html[match.end():]
    return html

# ─────────────────────────────────────────────────────────────────
# 3. MAIN PROCESSING
# ─────────────────────────────────────────────────────────────────

def process_article(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    original = html
    changed = False

    # Skip non-article pages (must have art-body)
    if 'id="art-body"' not in html and 'class="art-body"' not in html:
        return False

    has_toc_css = 'toc-styles' in html
    has_toc_js  = 'Build TOC' in html

    # 1. Add TOC CSS (only if not already present)
    if not has_toc_css:
        head_end = html.find('</head>')
        if head_end != -1:
            html = html[:head_end] + TOC_CSS + '\n' + html[head_end:]
            changed = True

    # 2. Add speakable schema (always try — idempotent)
    new_html = add_speakable_to_schema(html)
    if new_html != html:
        html = new_html
        changed = True

    # 3. Inject TOC + anchor JS (only if not already present)
    if not has_toc_js:
        prog_script = html.find("// Reading progress bar")
        if prog_script != -1:
            script_start = html.rfind('<script>', 0, prog_script)
            if script_start != -1:
                html = html[:script_start] + TOC_HTML_AND_JS + '\n' + html[script_start:]
                changed = True
        else:
            body_end = html.rfind('</body>')
            if body_end != -1:
                html = html[:body_end] + TOC_HTML_AND_JS + '\n' + html[body_end:]
                changed = True

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False


def main():
    # Process all blog article pages
    patterns = [
        os.path.join(ROOT, 'blog', 'article-*', 'index.html'),
        os.path.join(ROOT, 'blog', 'nca-*', 'index.html'),
        os.path.join(ROOT, 'blog', 'what-*', 'index.html'),
        os.path.join(ROOT, 'blog', 'nca-exam-*', 'index.html'),
        os.path.join(ROOT, 'blog', 'nca-pass-*', 'index.html'),
    ]

    files = []
    for p in patterns:
        files.extend(glob.glob(p))
    files = sorted(set(files))

    updated = 0
    skipped = 0
    for path in files:
        rel = os.path.relpath(path, ROOT)
        if process_article(path):
            print(f'  ✓ {rel}')
            updated += 1
        else:
            skipped += 1

    print(f'\nDone: {updated} updated, {skipped} skipped.')


if __name__ == '__main__':
    main()
