#!/usr/bin/env python3
"""Sprint G — Analytics, UX infrastructure & final polish"""
import os, re, json, glob

ROOT = '/home/user/THE-NCA-HUB'

# ─────────────────────────────────────────────
# TASK 1: GDPR granular cookie consent rebuild
# ─────────────────────────────────────────────

NEW_GA4_BLOCK = '''<!-- Google Analytics 4 — consent mode -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {'analytics_storage': 'denied', 'ad_storage': 'denied', 'wait_for_update': 500});
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CFFP8T95DZ"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-CFFP8T95DZ');
</script>'''

NEW_COOKIE_BANNER = '''<div id="cookie-banner" role="dialog" aria-label="Cookie consent" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9500;background:rgba(5,5,8,.97);border:1px solid rgba(201,168,76,.22);padding:22px 28px;max-width:540px;width:calc(100% - 48px);backdrop-filter:blur(20px);font-family:var(--fb)">
  <p style="font-size:.78rem;color:var(--fog);line-height:1.6;margin:0 0 16px">We use cookies to measure traffic and improve your experience. See our <a href="/privacy/" style="color:var(--g1)">Privacy Policy</a>.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <button id="ck-necessary" style="background:transparent;color:var(--fog);border:1px solid rgba(201,168,76,.25);padding:9px 20px;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Necessary only</button>
    <button id="ck-all" style="background:var(--g1);color:var(--void);border:none;padding:9px 24px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Accept all</button>
  </div>
</div>
<script>
(function(){
  var CONSENT_KEY = 'nca_cookie_consent';
  var consent = localStorage.getItem(CONSENT_KEY);
  var banner = document.getElementById('cookie-banner');
  function hideBanner(){ if(banner) banner.style.display='none'; }
  if(consent === 'all'){
    if(typeof gtag === 'function') gtag('consent','update',{'analytics_storage':'granted'});
    hideBanner(); return;
  }
  if(consent === 'necessary'){ hideBanner(); return; }
  if(banner) banner.style.display='block';
  document.getElementById('ck-necessary').addEventListener('click',function(){
    localStorage.setItem(CONSENT_KEY,'necessary'); hideBanner();
  });
  document.getElementById('ck-all').addEventListener('click',function(){
    localStorage.setItem(CONSENT_KEY,'all');
    if(typeof gtag === 'function') gtag('consent','update',{'analytics_storage':'granted'});
    hideBanner();
  });
})();
</script>'''

# Old GA4 patterns to replace
OLD_GA4_PATTERNS = [
    # Full pattern with comment
    re.compile(
        r'<!-- Google Analytics 4 -->\s*'
        r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-CFFP8T95DZ"></script>\s*'
        r'<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*'
        r'function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*'
        r"gtag\('js', new Date\(\)\);\s*"
        r"gtag\('config', 'G-CFFP8T95DZ'\);\s*"
        r'</script>',
        re.DOTALL
    ),
    # Variant without spaces around config
    re.compile(
        r'<!-- Google Analytics 4 -->\s*'
        r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-CFFP8T95DZ"></script>\s*'
        r'<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*'
        r'function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*'
        r"gtag\('js',new Date\(\)\);\s*"
        r"gtag\('config','G-CFFP8T95DZ'\);\s*"
        r'</script>',
        re.DOTALL
    ),
]

# Old cookie banner patterns
OLD_BANNER_PATTERN = re.compile(
    r'<div id="cookie-banner".*?</script>',
    re.DOTALL
)

def fix_ga4(content):
    """Replace GA4 init with consent-mode version."""
    for pat in OLD_GA4_PATTERNS:
        m = pat.search(content)
        if m:
            content = content[:m.start()] + NEW_GA4_BLOCK + content[m.end():]
            return content, True
    return content, False

def fix_cookie_banner(content):
    """Replace old single-button banner; add new banner before </body> if absent."""
    # Replace existing banner
    m = OLD_BANNER_PATTERN.search(content)
    if m:
        content = content[:m.start()] + NEW_COOKIE_BANNER + content[m.end():]
        return content, True
    # Add banner before </body> if GA4 present but no banner
    if 'G-CFFP8T95DZ' in content and '</body>' in content:
        content = content.replace('</body>', NEW_COOKIE_BANNER + '\n</body>', 1)
        return content, True
    return content, False

def task1_gdpr():
    all_html = glob.glob(os.path.join(ROOT, '**', 'index.html'), recursive=True)
    changed_ga4 = 0
    changed_banner = 0
    for path in sorted(all_html):
        with open(path) as f:
            content = f.read()
        if 'G-CFFP8T95DZ' not in content and 'cookie-banner' not in content:
            continue
        orig = content
        content, ga4_changed = fix_ga4(content)
        content, banner_changed = fix_cookie_banner(content)
        if content != orig:
            with open(path, 'w') as f:
                f.write(content)
            if ga4_changed: changed_ga4 += 1
            if banner_changed: changed_banner += 1
    print(f'Task 1: GA4 consent mode applied to {changed_ga4} files, banner updated in {changed_banner} files')

task1_gdpr()
