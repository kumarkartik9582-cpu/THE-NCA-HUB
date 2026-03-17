#!/usr/bin/env python3
"""
Fix newer-style articles (using <article> not id="art-body") — add:
  1. Was this helpful? widget (before </article>)
  2. X/Twitter share button (if art-share exists, add X; if not, add simple share row)
"""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# Find articles WITHOUT art-body but WITH <article> tags
NEW_STYLE = [p for p in glob.glob(os.path.join(BASE, 'blog', '**', 'index.html'))
             if 'id="art-body"' not in open(p).read() and '<article' in open(p).read()]

HELPFUL_HTML = '''
    <!-- Was this helpful? -->
    <div class="nca-helpful-widget" id="nca-helpful-widget" style="border-top:1px solid rgba(201,168,76,.1);padding-top:28px;margin-top:36px;text-align:center">
      <p style="font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:var(--dim);margin-bottom:14px">Was this article helpful?</p>
      <div class="nca-helpful-btns" style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">
        <button class="nca-helpful-btn" data-vote="yes" style="background:transparent;border:1px solid rgba(201,168,76,.25);color:var(--fog);font-size:.8rem;padding:9px 22px;border-radius:8px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px" aria-label="Yes, this article was helpful">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          Yes, helpful
        </button>
        <button class="nca-helpful-btn" data-vote="no" style="background:transparent;border:1px solid rgba(201,168,76,.25);color:var(--fog);font-size:.8rem;padding:9px 22px;border-radius:8px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:7px" aria-label="No, this article was not helpful">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
          Needs improvement
        </button>
      </div>
      <p id="nca-helpful-thankyou" hidden style="font-size:.82rem;color:var(--g1);padding-top:10px"></p>
    </div>
'''

def make_x_share(url, title):
    import urllib.parse
    t = urllib.parse.quote(title[:80])
    u = urllib.parse.quote(url)
    return (
        '<a href="https://x.com/intent/post?url=' + u + '&text=' + t + '" '
        'target="_blank" rel="noopener" '
        'style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;'
        'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);'
        'color:rgba(240,230,204,.75);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;'
        'text-decoration:none;" aria-label="Share on X">\n'
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
        '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
        'X / Twitter</a>'
    )

changed = 0
for path in NEW_STYLE:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    orig = html

    # 1. Add helpful widget before </article>
    if 'nca-helpful-widget' not in html:
        html = html.replace('</article>', HELPFUL_HTML + '\n</article>', 1)

    # 2. Add X share button if share section exists but no X link
    if 'x.com/intent' not in html and 'twitter.com/intent' not in html:
        # check if there's a LinkedIn share link
        linkedin_match = re.search(r'<a href="https://www\.linkedin\.com/sharing[^"]*"[^>]*>.*?LinkedIn.*?</a>', html, re.DOTALL)
        if linkedin_match:
            url_match = re.search(r'<link rel="canonical" href="([^"]+)"', html)
            title_match = re.search(r'<title>([^<]+)</title>', html)
            if url_match and title_match:
                url = url_match.group(1)
                title = re.sub(r'\s*[|\-—].*', '', title_match.group(1)).strip()
                x_link = make_x_share(url, title)
                # Insert after LinkedIn link
                insert_pos = linkedin_match.end()
                html = html[:insert_pos] + '\n  ' + x_link + '\n' + html[insert_pos:]

    if html != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        changed += 1
        print(f'  updated: {os.path.relpath(path, BASE)}')

print(f'\nDone. {changed} new-style articles updated.')
