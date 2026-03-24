#!/usr/bin/env python3
"""
Fix article uniformity v2: targeted approach for each group.
"""
import re, os, urllib.parse

ALL_ARTICLES = [
    'blog/nca-admin-law-june-2026',
    'blog/nca-criminal-law-may-2026',
    'blog/nca-con-law-july-2026',
    'blog/nca-pr-may-2026',
    'blog/nca-how-to-appeal-assessment',
    'blog/nca-vs-canadian-llm',
    'blog/nca-language-requirement-2026',
    'blog/nca-exam-cost-2026',
    'blog/what-to-do-if-you-fail-nca',
    'blog/nca-civil-procedure-exam-guide',
]

def get_title(html):
    m = re.search(r'<title>([^<]+)</title>', html)
    return m.group(1).replace(' — The NCA Hub', '').replace(' | The NCA Hub', '').strip() if m else 'Article'

def get_share_html(slug, title):
    url_encoded = urllib.parse.quote(f'https://www.thencahub.com/blog/{slug}/', safe='')
    title_encoded = urllib.parse.quote(f'{title} — The NCA Hub', safe='')
    return f'''<div class="art-share" style="max-width:720px;margin:0 auto 0;padding:0 72px 32px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
  <span style="font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--dim);font-family:var(--fb);margin-right:4px">Share</span>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url={url_encoded}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:rgba(0,114,177,.15);border:1px solid rgba(0,114,177,.3);color:#60a8d0;font-family:var(--fb);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:background .3s" onmouseover="this.style.background='rgba(0,114,177,.3)'" onmouseout="this.style.background='rgba(0,114,177,.15)'">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    LinkedIn
  </a>
  <a href="https://api.whatsapp.com/send?text={title_encoded}%20{url_encoded}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.25);color:#4dc76b;font-family:var(--fb);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:background .3s" onmouseover="this.style.background='rgba(37,211,102,.2)'" onmouseout="this.style.background='rgba(37,211,102,.1)'">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    WhatsApp
  </a>
  <a href="https://x.com/intent/post?url=https%3A//www.thencahub.com/blog/{slug}/&text={title_encoded}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(240,230,204,.75);font-family:var(--fb);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;transition:background .3s" onmouseover="this.style.background='rgba(255,255,255,.12)'" onmouseout="this.style.background='rgba(255,255,255,.06)'">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    X / Twitter
  </a>
</div>'''

HELPFUL_WIDGET_HTML = '''    <!-- Was this helpful? -->
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
    </div>'''


def add_share_buttons(html, slug):
    """Add share buttons if missing. Insert before helpful widget or before art-cta."""
    if 'art-share' in html:
        return html

    title = get_title(html)
    share_html = get_share_html(slug, title)

    # Try to insert before helpful widget
    marker = '    <!-- Was this helpful? -->'
    if marker in html:
        html = html.replace(marker, share_html + '\n' + marker)
        return html

    # Try to insert before first art-cta div (exact class match)
    m = re.search(r'\n(\s*<div class="art-cta"[^>]*>)', html)
    if m:
        html = html[:m.start()] + '\n' + share_html + '\n' + html[m.start():]
        return html

    # Try before footer
    m = re.search(r'\n(\s*<footer)', html)
    if m:
        html = html[:m.start()] + '\n' + share_html + '\n' + html[m.start():]
        return html

    return html


def add_helpful_widget(html):
    """Add helpful widget HTML if missing. Insert after share buttons or before art-cta."""
    if 'nca-helpful-widget' in html and '<div class="nca-helpful-widget"' in html:
        return html

    # Insert after the share div's closing </div>
    # Find the end of art-share block
    share_end = html.find('</div>\n    <!-- Was this helpful? -->')
    if share_end != -1:
        # Already has the marker, just needs the widget HTML
        marker = '    <!-- Was this helpful? -->'
        if marker in html and '<div class="nca-helpful-widget"' not in html:
            html = html.replace(marker, HELPFUL_WIDGET_HTML)
        return html

    # No marker - insert before art-cta
    m = re.search(r'\n(\s*<div class="art-cta"[^>]*>)', html)
    if m:
        html = html[:m.start()] + '\n' + HELPFUL_WIDGET_HTML + '\n' + html[m.start():]
        return html

    # Before footer as last resort
    m = re.search(r'\n(\s*<footer)', html)
    if m:
        html = html[:m.start()] + '\n' + HELPFUL_WIDGET_HTML + '\n' + html[m.start():]
        return html

    return html


def fix_schema(html):
    """Wrap single JSON-LD object in @graph format if not already in @graph"""
    if '@graph' in html:
        return html

    # Find the JSON-LD script tag
    m = re.search(r'(<script type="application/ld\+json">)\s*(\{[^<]+\})\s*(</script>)', html, re.DOTALL)
    if not m:
        # Try array format
        m = re.search(r'(<script type="application/ld\+json">)\s*(\[[^<]+\])\s*(</script>)', html, re.DOTALL)
        if not m:
            return html

        # Array format - wrap in @graph
        json_content = m.group(2).strip()
        # Remove individual @context from array items
        json_content = re.sub(r'"@context"\s*:\s*"https://schema\.org"\s*,?\s*', '', json_content)
        new_json = '{\n  "@context": "https://schema.org",\n  "@graph": ' + json_content + '\n}'
        html = html[:m.start(1)] + m.group(1) + '\n' + new_json + '\n' + m.group(3) + html[m.end(3):]
        return html

    # Single object format - wrap in @graph
    json_content = m.group(2).strip()
    # Remove @context if present
    json_content = re.sub(r'"@context"\s*:\s*"https://schema\.org"\s*,?\s*', '', json_content)
    new_json = '{\n  "@context": "https://schema.org",\n  "@graph": [' + json_content + ']\n}'
    html = html[:m.start(1)] + m.group(1) + '\n' + new_json + '\n' + m.group(3) + html[m.end(3):]
    return html


def process_file(dirpath):
    filepath = os.path.join(dirpath, 'index.html')
    if not os.path.exists(filepath):
        print(f"  SKIP: {filepath} not found")
        return

    with open(filepath, 'r') as f:
        original = f.read()

    slug = os.path.basename(dirpath)
    html = original

    # 1. Add share buttons
    html = add_share_buttons(html, slug)

    # 2. Add helpful widget
    html = add_helpful_widget(html)

    # 3. Fix JSON-LD schema
    html = fix_schema(html)

    if html != original:
        with open(filepath, 'w') as f:
            f.write(html)
        changes = []
        if 'art-share' in html and 'art-share' not in original: changes.append('share')
        if '<div class="nca-helpful-widget"' in html and '<div class="nca-helpful-widget"' not in original: changes.append('helpful')
        if '@graph' in html and '@graph' not in original: changes.append('@graph')
        print(f"  FIXED ({', '.join(changes)}): {filepath}")
    else:
        print(f"  OK: {filepath}")


if __name__ == '__main__':
    print(f"Processing {len(ALL_ARTICLES)} articles...\n")
    for d in ALL_ARTICLES:
        print(f"--- {d} ---")
        process_file(d)
    print("\nDone!")
