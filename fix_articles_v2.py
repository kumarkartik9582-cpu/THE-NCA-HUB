#!/usr/bin/env python3
"""
Complete article fix using BeautifulSoup:
1. Remove ALL existing newsletter blocks (proper and fragment)
2. Re-insert ONE newsletter block at the correct top-level position
   (between direct children of .art-body, after ~30% of content)
3. Fix any broken HTML structure from previous insertions
"""

import os
import re
import glob
from bs4 import BeautifulSoup, NavigableString, Comment

BLOG_DIR = '/home/user/THE-NCA-HUB/blog'

NEWSLETTER_HTML = '''<div class="nca-inline-newsletter" id="nca-newsletter-inline">
      <div class="nca-nl-inner">
        <div class="nca-nl-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="nca-nl-text">
          <p class="nca-nl-eyelet">Free NCA Prep Tips</p>
          <p class="nca-nl-headline">Get the strategies that cleared 5 subjects in under 3 months.</p>
          <p class="nca-nl-sub">Weekly exam insights, study frameworks, and what no one tells you &#8212; straight to your inbox.</p>
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
    </div>'''

def fix_article(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Step 1: Remove ALL newsletter-related blocks using regex BEFORE BS4 parsing
    # This handles both properly structured and broken/fragment forms

    # Remove full nca-inline-newsletter blocks (with comment)
    full_nl_pattern = re.compile(
        r'[ \t]*<!-- Inline Newsletter Capture -->\s*\n?\s*<div class="nca-inline-newsletter"[^>]*>.*?</div>\s*\n?\s*</div>',
        re.DOTALL
    )
    content = full_nl_pattern.sub('', content)

    # Remove nca-inline-newsletter without comment
    full_nl_nc_pattern = re.compile(
        r'[ \t]*<div class="nca-inline-newsletter"[^>]*>.*?</div>\s*\n?\s*</div>',
        re.DOTALL
    )
    content = full_nl_nc_pattern.sub('', content)

    # Remove fragment newsletter blocks (missing outer container)
    # These have nca-nl-text div + form + nca-nl-success div
    frag_pattern = re.compile(
        r'\s*<div class="nca-nl-text">.*?</div>\s*\n?\s*<form class="nca-nl-form"[^>]*>.*?</form>\s*\n?\s*<div class="nca-nl-success"[^>]*>.*?</div>\s*\n?\s*</div>\s*\n?\s*</div>',
        re.DOTALL
    )
    content = frag_pattern.sub('', content)

    # Clean up triple newlines
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Step 2: Find art-body and insert newsletter at right position
    # We need to find where art-body starts and insert after a top-level block

    # Find the art-body div start
    art_body_match = re.search(r'<div class="art-body"[^>]*>', content)
    if not art_body_match:
        # Try alternate: look for article content
        art_body_match = re.search(r'<div class="article-body"[^>]*>', content)
    if not art_body_match:
        # Try article tag content
        art_body_match = re.search(r'<article[^>]*>', content)

    if not art_body_match:
        # No art-body found, insert before last </article> or </main>
        # Last resort: find a good spot
        last_h2 = list(re.finditer(r'</h2>', content))
        if len(last_h2) >= 2:
            insert_pos = last_h2[1].end()
            # Find end of following paragraph
            next_p_end = content.find('</p>', insert_pos)
            if next_p_end > 0:
                insert_pos = next_p_end + 4
            nl_block = '\n\n    <!-- Inline Newsletter Capture -->\n    ' + NEWSLETTER_HTML + '\n'
            content = content[:insert_pos] + nl_block + content[insert_pos:]
        return content != original, content

    art_start = art_body_match.end()

    # Now find the top-level block elements inside art-body
    # We'll track depth to find top-level elements
    pos = art_start
    depth = 1  # we're inside art-body
    top_level_ends = []  # positions where top-level elements end
    i = pos

    # Simple approach: find all direct children by tracking nesting depth
    block_tags = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'table', 'blockquote', 'hr', 'section', 'aside'}

    # Use regex to find tags and track depth
    tag_pattern = re.compile(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>', re.DOTALL)

    local_depth = 0  # depth relative to art-body's children
    current_block_start = None
    first_block_ended = False
    insert_after_n_blocks = 2  # Insert after 2nd top-level block element
    blocks_seen = 0
    insert_pos = None

    for m in tag_pattern.finditer(content, pos):
        tag_text = m.group(0)
        is_closing = m.group(1) == '/'
        tag_name = m.group(2).lower()

        # Self-closing tags don't affect depth
        if tag_text.endswith('/>') or tag_name in {'br', 'hr', 'img', 'input', 'meta', 'link'}:
            if local_depth == 0 and tag_name == 'hr':
                blocks_seen += 1
                if blocks_seen == insert_after_n_blocks:
                    insert_pos = m.end()
            continue

        if not is_closing:
            if local_depth == 0 and tag_name in block_tags:
                current_block_start = m.start()
            local_depth += 1
        else:
            local_depth -= 1
            if local_depth == 0 and tag_name in block_tags and current_block_start is not None:
                blocks_seen += 1
                block_end = m.end()
                if blocks_seen == insert_after_n_blocks:
                    insert_pos = block_end
                    break
            # Stop if we hit the art-body closing tag
            if local_depth < 0:
                break

    if insert_pos is None:
        # Fallback: insert before first h2 in article
        h2_match = re.search(r'\n\s*<h2', content[pos:])
        if h2_match:
            insert_pos = pos + h2_match.start()
        else:
            # Last resort: insert at art_start + some offset
            insert_pos = pos + 200

    nl_block = '\n\n    <!-- Inline Newsletter Capture -->\n    ' + NEWSLETTER_HTML + '\n'
    content = content[:insert_pos] + nl_block + content[insert_pos:]

    changed = content != original
    return changed, content


fixed = 0
failed = 0
articles = sorted(glob.glob(os.path.join(BLOG_DIR, '*/index.html')))

for fp in articles:
    try:
        changed, new_content = fix_article(fp)
        if changed:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(new_content)
            fixed += 1
            fname = fp.replace(BLOG_DIR+'/', '')
            print(f"Fixed: {fname}")
    except Exception as e:
        failed += 1
        print(f"ERROR {fp.replace(BLOG_DIR+'/', '')}: {e}")

print(f"\nFixed: {fixed}  Errors: {failed}  Total: {len(articles)}")
