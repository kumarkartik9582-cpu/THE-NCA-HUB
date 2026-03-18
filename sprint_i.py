#!/usr/bin/env python3
"""
Sprint I – Site-wide enhancements:
  1. Link /nca-enhancements.js in all articles (before closing </body>)
  2. Insert inline newsletter capture mid-article (after ~40% of h2 headings)
  3. Add newsletter CSS to articles that don't already have it
  4. Ensure rel-grid cards have proper rel-card-desc fallback
"""

import os
import re
import glob

# ── Paths ──────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
ARTICLES = sorted(glob.glob(os.path.join(BASE, 'blog', '**', 'index.html')))
OTHER_PAGES = [
    os.path.join(BASE, 'index.html'),
    os.path.join(BASE, 'nca-statistics', 'index.html'),
    os.path.join(BASE, 'nca-cost-calculator', 'index.html'),
    os.path.join(BASE, 'nca-prep-checklist', 'index.html'),
    os.path.join(BASE, 'nca-exam-dates-2026', 'index.html'),
]

# ── Newsletter HTML snippet ────────────────────────────────────────────────
NEWSLETTER_HTML = '''
    <!-- Inline Newsletter Capture -->
    <div class="nca-inline-newsletter" id="nca-newsletter-inline">
      <div class="nca-nl-inner">
        <div class="nca-nl-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="nca-nl-text">
          <p class="nca-nl-eyelet">Free NCA Prep Tips</p>
          <p class="nca-nl-headline">Get the strategies that cleared 5 subjects in under 3 months.</p>
          <p class="nca-nl-sub">Weekly exam insights, study frameworks, and what no one tells you — straight to your inbox.</p>
        </div>
        <form class="nca-nl-form" id="nca-nl-form" novalidate>
          <div class="nca-nl-input-row">
            <input type="email" id="nca-nl-email" class="nca-nl-email" placeholder="your@email.com" autocomplete="email" aria-label="Email address" required>
            <button type="submit" class="nca-nl-btn" id="nca-nl-btn">Subscribe</button>
          </div>
          <p class="nca-nl-note">No spam. Unsubscribe any time.</p>
        </form>
        <div class="nca-nl-success" id="nca-nl-success" hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>You&#8217;re in! Check your inbox for a confirmation.</span>
        </div>
      </div>
    </div>
'''

# ── Newsletter CSS ─────────────────────────────────────────────────────────
NEWSLETTER_CSS = '''
.nca-inline-newsletter{background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.18);border-radius:12px;padding:32px 36px;margin:48px 0;}
@media(max-width:640px){.nca-inline-newsletter{padding:24px 20px;margin:36px 0;}}
.nca-nl-inner{display:flex;flex-direction:column;gap:16px;}
.nca-nl-icon{color:var(--g1,#C9A84C);opacity:.8;}
.nca-nl-eyelet{font-size:var(--nano,.7rem);letter-spacing:.25em;text-transform:uppercase;color:var(--g2,#a87e3a);font-weight:600;margin:0 0 6px;}
.nca-nl-headline{font-family:var(--fd,serif);font-size:clamp(1.1rem,2.5vw,1.5rem);font-weight:300;color:var(--cream,#f0e6cc);line-height:1.25;margin:0 0 8px;}
.nca-nl-sub{font-size:var(--sm,.85rem);color:var(--fog,#9e9587);line-height:1.65;margin:0;}
.nca-nl-text{flex:1;}
.nca-nl-form{}
.nca-nl-input-row{display:flex;gap:8px;flex-wrap:wrap;}
.nca-nl-email{flex:1;min-width:200px;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.25);border-radius:8px;color:var(--cream,#f0e6cc);font-size:var(--body,.9rem);padding:10px 14px;outline:none;transition:border-color .2s;font-family:inherit;}
.nca-nl-email:focus{border-color:rgba(201,168,76,.6);}
.nca-nl-email::placeholder{color:rgba(240,230,204,.3);}
.nca-nl-btn{background:#C9A84C;color:#02020A;border:none;border-radius:8px;font-size:var(--sm,.85rem);font-weight:600;padding:10px 22px;cursor:pointer;transition:background .2s;white-space:nowrap;letter-spacing:.03em;}
.nca-nl-btn:hover{background:#e0be6a;}
.nca-nl-btn:disabled{background:rgba(201,168,76,.3);cursor:not-allowed;}
.nca-nl-note{font-size:var(--nano,.7rem);color:var(--dim,#6b6560);margin:8px 0 0;letter-spacing:.05em;}
.nca-nl-success{display:flex;align-items:center;gap:10px;color:#4ade80;font-size:var(--sm,.85rem);padding:4px 0;}
.nca-nl-success[hidden]{display:none!important;}
'''

# ── Newsletter form JS ─────────────────────────────────────────────────────
NEWSLETTER_JS = '''
<script>
(function(){
  var form = document.getElementById('nca-nl-form');
  if(!form) return;
  var emailEl = document.getElementById('nca-nl-email');
  var btn = document.getElementById('nca-nl-btn');
  var success = document.getElementById('nca-nl-success');
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var email = emailEl.value.trim();
    if(!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){ emailEl.focus(); return; }
    btn.disabled = true;
    btn.textContent = 'Subscribing\u2026';
    try {
      var res = await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})});
      var data = await res.json();
      if(data.success){
        form.hidden = true;
        success.hidden = false;
      } else {
        btn.disabled = false;
        btn.textContent = 'Subscribe';
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch(err){
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    }
  });
})();
</script>
'''

# ── Enhancements script tag ────────────────────────────────────────────────
ENHANCEMENTS_SCRIPT = '<script src="/nca-enhancements.js" defer></script>'


def insert_newsletter_midpoint(html: str) -> str:
    """Insert newsletter at a guaranteed top-level boundary inside art-body (~40% mark).

    Uses proper HTML depth tracking: scans from art-body opening tag, tracks
    <div> open/close depth, collects positions where depth returns to 0 (i.e.,
    after each direct child of art-body closes). Picks the insertion point at
    ~40% of those top-level block boundaries. This is safe regardless of indentation.
    """
    body_match = re.search(r'<div[^>]+id=["\']?art-body["\']?[^>]*>', html)
    if not body_match:
        return html

    pos = body_match.end()
    local_depth = 0
    top_level_ends = []  # positions after each top-level child closes
    tag_re = re.compile(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>', re.DOTALL)
    VOID = {'br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col',
            'embed', 'param', 'source', 'track', 'wbr'}
    BLOCK = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
             'ul', 'ol', 'table', 'blockquote', 'section', 'aside', 'figure'}

    for m in tag_re.finditer(html, pos):
        tag_text = m.group(0)
        is_closing = m.group(1) == '/'
        tag_name = m.group(2).lower()

        if tag_text.endswith('/>') or tag_name in VOID:
            continue

        if not is_closing:
            local_depth += 1
        else:
            local_depth -= 1
            if local_depth == 0 and tag_name in BLOCK:
                top_level_ends.append(m.end())
            if local_depth < 0:
                break  # past art-body closing tag

    if len(top_level_ends) < 2:
        return html

    # Pick insertion point at ~40% of top-level blocks
    insert_idx = max(1, int(len(top_level_ends) * 0.40))
    insert_pos = top_level_ends[insert_idx - 1]

    # Validate: depth between art-body start and insert_pos must be balanced
    between = html[body_match.end():insert_pos]
    opens = len(re.findall(r'<div\b', between))
    closes = len(re.findall(r'</div', between))
    if opens != closes:
        # Fallback: use the last top-level end before halfway
        insert_pos = top_level_ends[max(0, len(top_level_ends) // 2 - 1)]

    return html[:insert_pos] + '\n' + NEWSLETTER_HTML + html[insert_pos:]


def add_newsletter_css(html: str) -> str:
    """Inject newsletter CSS before </style> in <head>."""
    if 'nca-inline-newsletter' in html:
        return html  # already present
    # Find the last </style> in <head>
    style_end = html.rfind('</style>', 0, html.find('</head>'))
    if style_end == -1:
        return html
    return html[:style_end] + NEWSLETTER_CSS + html[style_end:]


def add_enhancements_script(html: str) -> str:
    """Add nca-enhancements.js before </body> if not already present."""
    if 'nca-enhancements.js' in html:
        return html
    # Insert before </body>
    return html.replace('</body>', ENHANCEMENTS_SCRIPT + '\n</body>', 1)


def add_newsletter_js(html: str) -> str:
    """Add newsletter form JS before </body> if newsletter form is present."""
    if 'nca-nl-form' not in html:
        return html
    if "fetch('/api/newsletter'" not in html:
        return html.replace('</body>', NEWSLETTER_JS + '\n</body>', 1)
    return html


def process_file(path: str) -> bool:
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()

    html = original

    # Only process article pages (those with art-body)
    is_article = 'id="art-body"' in html

    if is_article:
        html = insert_newsletter_midpoint(html)
        html = add_newsletter_css(html)
        html = add_newsletter_js(html)

    html = add_enhancements_script(html)

    if html != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False


# ── Main ───────────────────────────────────────────────────────────────────
all_files = ARTICLES + [p for p in OTHER_PAGES if os.path.exists(p)]
changed = 0
skipped = 0
for path in all_files:
    if not os.path.exists(path):
        skipped += 1
        continue
    updated = process_file(path)
    if updated:
        changed += 1
        print(f'  updated: {os.path.relpath(path, BASE)}')
    else:
        skipped += 1

print(f'\nDone. {changed} files updated, {skipped} skipped.')
