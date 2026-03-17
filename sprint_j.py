#!/usr/bin/env python3
"""
Sprint J — Site-wide UX, accessibility & conversion improvements:
  1. Add X/Twitter share button to all articles missing it
  2. Add "Was this helpful?" widget to all articles
  3. Add skip-to-main-content link to ALL pages
  4. Add author bio card to 12 articles missing it
  5. Add 'loading=lazy' to all <img> tags missing it
  6. Add SW message listener (for update banner) to all pages
  7. Add Key Takeaways box support (CSS only — content is per-article)
"""

import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))
ALL_HTML = sorted(glob.glob(os.path.join(BASE, '**', 'index.html'), recursive=True))
ALL_HTML += [os.path.join(BASE, 'index.html')]
ALL_HTML = list(dict.fromkeys(ALL_HTML))  # dedup

# ── Author bio HTML ─────────────────────────────────────────────────────────
AUTHOR_BIO_HTML = '''      <div class="author-bio" itemscope itemtype="https://schema.org/Person">
        <div class="author-bio-label">About the author</div>
        <div class="author-bio-name"><a href="/about/" itemprop="url"><span itemprop="name">Kartik Kumar</span></a></div>
        <p class="author-bio-desc" itemprop="description">Indian-qualified lawyer. Built his legal career at UK law firms DWF, Eversheds Sutherland, and Keoghs. Passed all 5 NCA subjects — 4 cleared in under 3 months — and completed the CPLED Legal Research &amp; Writing requirement. Certificate of Qualification requested. Founder of The NCA Hub.</p>
        <a href="https://www.linkedin.com/in/the-nca-hub-123ab63b5" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:10px;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--g1);border-bottom:1px solid rgba(201,168,76,.3);padding-bottom:1px;">LinkedIn Profile &rarr;</a>
      </div>
'''

# ── "Was this helpful?" widget HTML ─────────────────────────────────────────
HELPFUL_CSS = '''
.nca-helpful-widget{border-top:1px solid rgba(201,168,76,.1);padding-top:32px;margin-top:40px;text-align:center}
.nca-helpful-label{font-size:var(--nano,.7rem);letter-spacing:.25em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}
.nca-helpful-btns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.nca-helpful-btn{background:transparent;border:1px solid rgba(201,168,76,.25);color:var(--fog);font-size:.8rem;padding:9px 22px;border-radius:8px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:7px;font-family:inherit}
.nca-helpful-btn:hover{background:rgba(201,168,76,.08);border-color:rgba(201,168,76,.5);color:var(--cream)}
.nca-helpful-thankyou{font-size:.82rem;color:var(--g1);padding:8px 0}
'''

HELPFUL_HTML = '''    <!-- Was this helpful? -->
    <div class="nca-helpful-widget" id="nca-helpful-widget">
      <p class="nca-helpful-label">Was this article helpful?</p>
      <div class="nca-helpful-btns">
        <button class="nca-helpful-btn" data-vote="yes" aria-label="Yes, this article was helpful">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          Yes, helpful
        </button>
        <button class="nca-helpful-btn" data-vote="no" aria-label="No, this article was not helpful">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
          Needs improvement
        </button>
      </div>
      <p class="nca-helpful-thankyou" id="nca-helpful-thankyou" hidden></p>
    </div>
'''

# ── Skip nav HTML ────────────────────────────────────────────────────────────
SKIP_NAV_HTML = '<a href="#main-content" class="nca-skip-nav">Skip to main content</a>\n'

SKIP_NAV_CSS = '''
.nca-skip-nav{position:absolute;top:-100%;left:16px;background:#C9A84C;color:#02020A;padding:8px 16px;border-radius:0 0 6px 6px;font-size:.8rem;font-weight:600;text-decoration:none;z-index:99999;transition:top .1s}
.nca-skip-nav:focus{top:0}
'''

# ── SW update listener JS ────────────────────────────────────────────────────
SW_LISTENER_JS = '''
<script>
if('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('message', function(e){
    if(e.data && e.data.type === 'SW_UPDATED'){
      var b = document.getElementById('nca-sw-update');
      if(b) b.style.display = 'flex';
    }
  });
}
</script>
'''

# ── X/Twitter share snippet template ────────────────────────────────────────
def make_twitter_share(url, title):
    import urllib.parse
    text = urllib.parse.quote(title + ' — The NCA Hub')
    enc_url = urllib.parse.quote(url)
    return (
        '  <a href="https://x.com/intent/post?url=' + enc_url + '&text=' + text + '" '
        'target="_blank" rel="noopener" '
        'style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;'
        'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);'
        'color:rgba(240,230,204,.75);font-family:var(--fb);font-size:.6rem;letter-spacing:.18em;'
        'text-transform:uppercase;text-decoration:none;transition:background .3s" '
        'onmouseover="this.style.background=\'rgba(255,255,255,.12)\'" '
        'onmouseout="this.style.background=\'rgba(255,255,255,.06)\'">\n'
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>\n'
        '    X / Twitter\n  </a>\n'
    )


def get_page_url(html):
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    return m.group(1) if m else ''

def get_page_title(html):
    m = re.search(r'<title>([^<]+)</title>', html)
    if not m:
        return ''
    title = m.group(1)
    title = re.sub(r'\s*—\s*The NCA Hub.*$', '', title).strip()
    return title


def add_skip_nav(html):
    if 'nca-skip-nav' in html:
        return html
    # Add CSS to first </style> in head
    style_end = html.rfind('</style>', 0, html.find('</head>'))
    if style_end != -1:
        html = html[:style_end] + SKIP_NAV_CSS + html[style_end:]
    # Add skip link right after <body>
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + SKIP_NAV_HTML, html, count=1)
    # Add id="main-content" to first <main>, <article>, or <div class="art-wrap"> if not present
    if 'id="main-content"' not in html:
        html = re.sub(r'(<main\b)', r'\1 id="main-content"', html, count=1)
        if 'id="main-content"' not in html:
            html = re.sub(r'(<article\b)', r'\1 id="main-content"', html, count=1)
        if 'id="main-content"' not in html:
            html = re.sub(r'(<div[^>]+class="art-wrap")', r'\1 id="main-content"', html, count=1)
    return html


def add_helpful_widget(html):
    if 'nca-helpful-widget' in html:
        return html
    if 'id="art-body"' not in html:
        return html
    # Add CSS
    style_end = html.rfind('</style>', 0, html.find('</head>'))
    if style_end != -1:
        html = html[:style_end] + HELPFUL_CSS + html[style_end:]
    # Insert before art-cta or art-back
    insert_before = re.search(r'(\s*<div class="art-cta">|\s*<a[^>]+art-back)', html)
    if insert_before:
        pos = insert_before.start()
        html = html[:pos] + '\n' + HELPFUL_HTML + html[pos:]
    return html


def add_author_bio(html):
    if 'author-bio' in html:
        return html
    if 'id="art-body"' not in html:
        return html
    # Add CSS if missing
    if '.author-bio{' not in html:
        bio_css = (
            '.author-bio{background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.12);'
            'padding:32px 36px;margin-top:56px}\n'
            '@media(max-width:640px){.author-bio{padding:24px}}\n'
            '.author-bio-label{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;'
            'color:var(--g2);font-weight:600;margin-bottom:10px}\n'
            '.author-bio-name{font-family:var(--fd);font-size:1.3rem;font-weight:400;'
            'color:var(--cream);margin-bottom:10px}\n'
            '.author-bio-name a{color:var(--g1)}\n'
            '.author-bio-desc{font-size:var(--sm);color:var(--fog);line-height:1.8;margin:0}\n'
        )
        style_end = html.rfind('</style>', 0, html.find('</head>'))
        if style_end != -1:
            html = html[:style_end] + bio_css + html[style_end:]
    # Insert before </div><!-- /.art-body -->
    art_body_end = html.rfind('</div><!-- /.art-body -->')
    if art_body_end == -1:
        art_body_end = re.search(r'</div>\s*\n\s*</article>', html)
        if art_body_end:
            art_body_end = art_body_end.start()
        else:
            return html
    html = html[:art_body_end] + '\n' + AUTHOR_BIO_HTML + html[art_body_end:]
    return html


def add_twitter_share(html):
    if 'x.com/intent' in html or 'twitter.com/intent' in html:
        return html
    # Find art-share div and insert X button after WhatsApp button
    share_match = re.search(r'(class="art-share"[^>]*>.*?</div>)', html, re.DOTALL)
    if not share_match:
        return html
    url = get_page_url(html)
    title = get_page_title(html)
    if not url or not title:
        return html
    x_btn = make_twitter_share(url, title)
    # Insert before closing </div> of art-share
    share_end = share_match.end()
    # Find the closing tag of art-share
    share_html = share_match.group(0)
    new_share = share_html[:-6] + x_btn + share_html[-6:]  # insert before </div>
    html = html[:share_match.start()] + new_share + html[share_end:]
    return html


def add_lazy_loading(html):
    # Add loading="lazy" to <img> tags that don't already have it
    def replace_img(m):
        tag = m.group(0)
        if 'loading=' in tag:
            return tag
        return tag.replace('<img ', '<img loading="lazy" ', 1)
    return re.sub(r'<img\s', replace_img, html)


def add_sw_listener(html):
    if 'SW_UPDATED' in html:
        return html
    return html.replace('</body>', SW_LISTENER_JS + '</body>', 1)


def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()
    html = original
    is_article = 'id="art-body"' in html

    html = add_skip_nav(html)
    html = add_lazy_loading(html)
    html = add_sw_listener(html)

    if is_article:
        html = add_author_bio(html)
        html = add_helpful_widget(html)
        html = add_twitter_share(html)

    if html != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False


changed = 0
for path in ALL_HTML:
    if not os.path.exists(path):
        continue
    if process_file(path):
        changed += 1
        print(f'  updated: {os.path.relpath(path, BASE)}')

print(f'\nDone. {changed} files updated.')
