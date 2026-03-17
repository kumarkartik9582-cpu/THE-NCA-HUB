#!/usr/bin/env python3
"""Remove existing newsletter blocks so sprint_i.py can re-insert them correctly."""
import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))
files = sorted(glob.glob(os.path.join(BASE, 'blog', '**', 'index.html')))
files += [os.path.join(BASE, 'index.html')]

NEWSLETTER_PATTERN = re.compile(
    r'\s*<!-- Inline Newsletter Capture -->.*?</div>\s*\n', re.DOTALL)

changed = 0
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if 'nca-inline-newsletter' not in html:
        continue
    cleaned = NEWSLETTER_PATTERN.sub('\n', html)
    if cleaned != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        changed += 1
        print(f'  cleaned: {os.path.relpath(path, BASE)}')

print(f'\nDone. {changed} files cleaned.')
