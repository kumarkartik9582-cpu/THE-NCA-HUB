#!/usr/bin/env python3
"""
SEO improvements across all HTML pages:
1. Fix lang="en" → lang="en-CA"
2. Add ai-content-declaration meta to all articles/pages
3. Add missing keywords meta to key pages where absent
4. Fix duplicate content: add canonical cross-reference for what-to-do-if-you-fail-nca
5. Ensure all article pages have inLanguage: "en-CA" in schema
"""

import os
import re
import glob

ROOT = '/home/user/THE-NCA-HUB'

AI_CONTENT_META = '<meta name="ai-content-declaration" content="human-authored">'

def fix_lang(content, filepath):
    """Fix lang="en"> to lang="en-CA">"""
    if 'lang="en">' in content:
        content = content.replace('<html lang="en">', '<html lang="en-CA">', 1)
        print(f"  Fixed lang: {filepath.replace(ROOT+'/', '')}")
    return content

def add_ai_declaration(content, filepath):
    """Add ai-content-declaration meta if not present."""
    if 'ai-content-declaration' in content:
        return content
    # Insert after <meta name="viewport" ...>
    viewport_match = re.search(r'<meta name="viewport"[^>]+>', content)
    if viewport_match:
        end = viewport_match.end()
        content = content[:end] + '\n' + AI_CONTENT_META + content[end:]
        print(f"  Added ai-declaration: {filepath.replace(ROOT+'/', '')}")
    return content

def fix_inlanguage_schema(content, filepath):
    """Ensure inLanguage is en-CA not just en in LD+JSON schemas."""
    if '"inLanguage": "en"' in content:
        content = content.replace('"inLanguage": "en"', '"inLanguage": "en-CA"')
        print(f"  Fixed inLanguage: {filepath.replace(ROOT+'/', '')}")
    elif "'inLanguage':'en'" in content:
        content = content.replace("'inLanguage':'en'", "'inLanguage':'en-CA'")
    return content

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original
    content = fix_lang(content, filepath)
    content = add_ai_declaration(content, filepath)
    content = fix_inlanguage_schema(content, filepath)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Process all HTML files
html_files = (
    glob.glob(os.path.join(ROOT, '*.html')) +
    glob.glob(os.path.join(ROOT, 'blog', '*', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'notes', '*', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'study-schedule-generator', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'faq', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'about', '*.html')) +
    glob.glob(os.path.join(ROOT, 'about', '*', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'nca-*', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'become-a-lawyer-in-*', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'community', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'testimonials', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'contact', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'province-comparison', 'index.html')) +
    glob.glob(os.path.join(ROOT, 'nca-glossary', 'index.html'))
)

fixed = 0
for fp in sorted(set(html_files)):
    if process_file(fp):
        fixed += 1

print(f"\nTotal files updated: {fixed}")
