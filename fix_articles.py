#!/usr/bin/env python3
"""
Fix duplicate/fragment newsletter sections in all blog articles.
Strategy:
  1. Remove "fragment" newsletter blocks (the ones without the outer nca-inline-newsletter div)
     These appear as bare <div class="nca-nl-text">...</div><form class="nca-nl-form">...</form>
     followed by stray </div></div> closing tags.
  2. Remove duplicate nca-inline-newsletter blocks (keep only 1 per article).
  3. Ensure the single newsletter block is properly placed (after ~50% of body content).
  4. Fix broken closing div tags left by the fragment removal.
"""

import os
import re
import glob

BLOG_DIR = '/home/user/THE-NCA-HUB/blog'

# The canonical newsletter block HTML (well-formed, single block)
NEWSLETTER_BLOCK = '''
    <!-- Inline Newsletter Capture -->
    <div class="nca-inline-newsletter" id="nca-newsletter-inline">
      <div class="nca-nl-inner">
        <div class="nca-nl-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="nca-nl-text">
          <p class="nca-nl-eyelet">Free NCA Prep Tips</p>
          <p class="nca-nl-headline">Get the strategies that cleared 5 subjects in under 3 months.</p>
          <p class="nca-nl-sub">Weekly exam insights, study frameworks, and what no one tells you \u2014 straight to your inbox.</p>
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

def fix_article(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Step 1: Remove ALL nca-inline-newsletter blocks entirely (we'll re-insert a clean one)
    # Pattern: <!-- Inline Newsletter Capture --> ... </div>\n    </div>\n (the outer container)
    full_nl_pattern = re.compile(
        r'\n?\s*<!-- Inline Newsletter Capture -->\s*\n\s*<div class="nca-inline-newsletter"[^>]*>.*?</div>\s*\n\s*</div>',
        re.DOTALL
    )
    content = full_nl_pattern.sub('', content)

    # Step 2: Remove fragment newsletter blocks (the ones without the outer container)
    # These start with <div class="nca-nl-text"> and end with </div>\n    </div>
    # They're not inside nca-inline-newsletter
    fragment_pattern = re.compile(
        r'\n?\s*<div class="nca-nl-text">.*?<div class="nca-nl-success"[^>]*>.*?</div>\s*\n\s*</div>\s*\n\s*</div>',
        re.DOTALL
    )
    content = fragment_pattern.sub('', content)

    # Step 3: Clean up multiple blank lines left after removal
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Step 4: Find a good insertion point - after the first <h2> section
    # Look for the second <h2> tag and insert the newsletter after the paragraph(s) before it
    h2_positions = [m.start() for m in re.finditer(r'<h2', content)]

    if len(h2_positions) >= 2:
        # Insert after content between h2[0] and h2[1] - roughly at 40% mark
        # Find a </p> or </ul> just before the second h2
        insert_zone = content[:h2_positions[1]]
        # Find last </p> or </ul> or </div> before second h2
        last_block_end = max(
            insert_zone.rfind('</p>'),
            insert_zone.rfind('</ul>'),
            insert_zone.rfind('</ol>'),
        )
        if last_block_end > 0:
            insert_pos = last_block_end + 4  # after </p> or </ul>
            content = content[:insert_pos] + '\n' + NEWSLETTER_BLOCK + content[insert_pos:]
        else:
            # Fallback: insert before second h2
            content = content[:h2_positions[1]] + '\n' + NEWSLETTER_BLOCK + '\n' + content[h2_positions[1]:]
    elif h2_positions:
        # Only one h2, insert after first major paragraph
        first_p_end = content.find('</p>', h2_positions[0])
        if first_p_end > 0:
            insert_pos = first_p_end + 4
            content = content[:insert_pos] + '\n' + NEWSLETTER_BLOCK + content[insert_pos:]

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

fixed = 0
articles = glob.glob(os.path.join(BLOG_DIR, '*/index.html'))
for fp in sorted(articles):
    if fix_article(fp):
        print(f"Fixed: {fp.replace(BLOG_DIR+'/', '')}")
        fixed += 1

print(f"\nTotal fixed: {fixed} / {len(articles)} articles")
