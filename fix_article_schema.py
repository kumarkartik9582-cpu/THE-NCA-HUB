#!/usr/bin/env python3
"""
Enhance article schema across all blog articles:
Add wordCount and timeRequired to Article JSON-LD schema.
"""

import os
import re
import json
import glob

BLOG_DIR = '/home/user/THE-NCA-HUB/blog'

def estimate_word_count(html):
    """Estimate body text word count by stripping tags."""
    html = re.sub(r'<head[^>]*>.*?</head>', '', html, flags=re.DOTALL)
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
    html = re.sub(r'<nav[^>]*>.*?</nav>', '', html, flags=re.DOTALL)
    html = re.sub(r'<header[^>]*>.*?</header>', '', html, flags=re.DOTALL)
    html = re.sub(r'<footer[^>]*>.*?</footer>', '', html, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())

def fix_article_schema(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Find the JSON-LD schema block using regex with exact boundaries
    pattern = r'(<script type="application/ld\+json">)(.*?)(</script>)'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return False

    raw_schema_text = match.group(2)
    try:
        schema = json.loads(raw_schema_text)
    except json.JSONDecodeError:
        return False

    graph = schema.get('@graph', [schema]) if '@graph' in schema else [schema]

    word_count_total = estimate_word_count(content)
    body_words = max(800, int(word_count_total * 0.42))
    read_minutes = max(5, round(body_words / 200))
    time_required = f"PT{read_minutes}M"

    changed = False
    for item in graph:
        if item.get('@type') == 'Article':
            if 'wordCount' not in item:
                item['wordCount'] = body_words
                changed = True
            if 'timeRequired' not in item:
                item['timeRequired'] = time_required
                changed = True

    if not changed:
        return False

    # Serialise back — pretty print to keep consistency with existing style
    new_schema_json = json.dumps(schema, ensure_ascii=False, indent=2)
    # Replace the exact matched section
    start, end = match.start(), match.end()
    new_block = f'<script type="application/ld+json">{new_schema_json}\n</script>'
    content = content[:start] + new_block + content[end:]

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

fixed = 0
articles = glob.glob(os.path.join(BLOG_DIR, '*/index.html'))
for fp in sorted(articles):
    try:
        if fix_article_schema(fp):
            fixed += 1
    except Exception as e:
        print(f"ERROR {fp}: {e}")

print(f"\nTotal: {fixed} / {len(articles)} articles updated")
