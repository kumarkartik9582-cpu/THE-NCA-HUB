#!/usr/bin/env python3
"""Fix GA4 consent mode for remaining files."""
import os, re, glob

ROOT = '/home/user/THE-NCA-HUB'

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

# Generic pattern: matches any GA4 block that doesn't already have consent
GA4_GENERIC = re.compile(
    r'(?:<!-- Google Analytics 4 -->\s*)?'
    r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-CFFP8T95DZ"></script>\s*'
    r'<script>\s*'
    r'(?:window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];\s*)?'
    r'(?:function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*)?'
    r"gtag\('js'\s*,\s*new Date\(\)\);\s*"
    r"gtag\('config'\s*,\s*'G-CFFP8T95DZ'\);\s*"
    r'</script>',
    re.DOTALL
)

changed = 0
all_html = glob.glob(os.path.join(ROOT, '**', 'index.html'), recursive=True)
for path in sorted(all_html):
    with open(path) as f:
        content = f.read()
    if 'G-CFFP8T95DZ' not in content:
        continue
    if 'wait_for_update' in content:  # already done
        continue
    m = GA4_GENERIC.search(content)
    if m:
        content = content[:m.start()] + NEW_GA4_BLOCK + content[m.end():]
        with open(path, 'w') as f:
            f.write(content)
        changed += 1
    else:
        print(f'  NO MATCH: {path}')

print(f'Fixed {changed} more files with consent mode')
