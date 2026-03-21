#!/usr/bin/env python3
"""
System Layout Fix v2: Complete fix for all article layout issues.

Issues found:
1. Stray </div> tags in .art-body content (prematurely close container)
2. Stray </div> tags in .article-body content (same issue, different class)
3. Unclosed <div class="nca-helpful-widget"> (missing closing </div>)

This script fixes ALL of the above across all article files.
"""

import re
import os
import glob


def find_content_region(html, class_name):
    """Find the content region for a given body class."""
    pattern = rf'<div\s[^>]*class="{class_name}"[^>]*>'
    m = re.search(pattern, html)
    if not m:
        return None, None, None

    start = m.end()

    # Try various end markers
    for marker in ['<!-- /.art-body -->', '<!-- end .art-body -->', '<!-- /art-body -->']:
        pos = html.find(marker, start)
        if pos != -1:
            before = html[:pos].rstrip()
            if before.endswith('</div>'):
                end = before.rfind('</div>')
            else:
                end = pos
            return start, end, marker

    # Fallback: </article> tag
    article_end = html.find('</article>', start)
    if article_end != -1:
        before = html[:article_end].rstrip()
        if before.endswith('</div>'):
            end = before.rfind('</div>')
            return start, end, '</article>'

    # Fallback: <footer tag
    footer = html.find('<footer', start)
    if footer != -1:
        # For article-body files wrapped in <section><div class="w">
        # Walk back past </section> and structural </div> tags
        before = html[:footer].rstrip()
        # Count structural wrappers we need to skip
        # Find </section> before footer
        section_end = before.rfind('</section>')
        if section_end != -1:
            before2 = before[:section_end].rstrip()
            # Two closing divs: article-body and .w
            if before2.endswith('</div>'):
                end2 = before2.rfind('</div>')
                before3 = before2[:end2].rstrip()
                if before3.endswith('</div>'):
                    end3 = before3.rfind('</div>')
                    return start, end3, '<footer> (article-body)'

    return start, None, None


def fix_unclosed_helpful_widgets(html):
    """Fix unclosed nca-helpful-widget divs."""
    # Find all helpful widget openings
    pattern = r'<div\s+class="nca-helpful-widget"[^>]*>'
    changes = 0

    for m in re.finditer(pattern, html):
        widget_start = m.end()
        # Count div depth from widget start
        tag_pattern = re.compile(r'(<div[\s>][^>]*>|</div>)')
        depth = 1  # The widget div itself
        pos = widget_start
        found_close = False

        for tag_match in tag_pattern.finditer(html[widget_start:widget_start + 2000]):
            tag = tag_match.group(0)
            if tag.lower().startswith('<div'):
                depth += 1
            else:
                depth -= 1
                if depth == 0:
                    found_close = True
                    break

        if not found_close and depth > 0:
            # Widget div is not properly closed
            # Find the next structural marker after widget content
            # Look for </div><!-- end or </div><!-- / or </article>
            search_area = html[widget_start:widget_start + 2000]
            # Find the <p> with thankyou id - that's the last element in the widget
            thankyou = search_area.find('id="nca-helpful-thankyou"')
            if thankyou != -1:
                # Find the end of this element
                p_end = search_area.find('</p>', thankyou)
                if p_end == -1:
                    # It might be a self-closing or have different end
                    p_end = search_area.find('/>', thankyou)
                if p_end != -1:
                    # Insert </div> after the thankyou paragraph's end
                    abs_pos = widget_start + p_end
                    # Find end of </p> tag
                    next_nl = html.find('\n', abs_pos)
                    if next_nl != -1:
                        # Check if the next line already has a closing div
                        next_line_end = html.find('\n', next_nl + 1)
                        next_line = html[next_nl + 1:next_line_end].strip() if next_line_end != -1 else ''
                        if next_line != '</div>':
                            html = html[:next_nl + 1] + '    </div>\n' + html[next_nl + 1:]
                            changes += 1

    return html, changes


def fix_stray_close_divs(html, start, end):
    """Remove stray </div> tags between start and end positions."""
    body_content = html[start:end]
    tag_pattern = re.compile(r'(<div[\s>][^>]*>|</div>)', re.IGNORECASE)

    depth = 0
    removals = []

    for match in tag_pattern.finditer(body_content):
        tag = match.group(0)
        abs_pos = start + match.start()

        if tag.lower().startswith('<div'):
            depth += 1
        elif tag.lower() == '</div>':
            if depth > 0:
                depth -= 1
            else:
                removals.append((abs_pos, abs_pos + len(tag)))

    if not removals:
        return html, 0

    fixed_html = html
    for s, e in reversed(removals):
        line_start = fixed_html.rfind('\n', 0, s)
        line_end = fixed_html.find('\n', e)
        line_content = fixed_html[line_start + 1:line_end if line_end != -1 else len(fixed_html)]

        if line_content.strip() == '</div>':
            if line_end != -1:
                fixed_html = fixed_html[:line_start + 1] + fixed_html[line_end + 1:]
            else:
                fixed_html = fixed_html[:line_start + 1]
        else:
            fixed_html = fixed_html[:s] + fixed_html[e:]

    return fixed_html, len(removals)


def verify_balance(html, class_name):
    """Verify div balance inside content region."""
    start, end, _ = find_content_region(html, class_name)
    if start is None or end is None:
        return None

    content = html[start:end]
    opens = len(re.findall(r'<div[\s>]', content))
    closes = len(re.findall(r'</div>', content))
    return closes - opens


def fix_article(filepath):
    """Fix all layout issues in a single article file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    total_fixes = 0

    # Determine content class
    for cls in ['art-body', 'article-body']:
        start, end, marker = find_content_region(html, cls)
        if start is not None and end is not None:
            html, removals = fix_stray_close_divs(html, start, end)
            total_fixes += removals
            break

    # Fix unclosed helpful widgets
    html, widget_fixes = fix_unclosed_helpful_widgets(html)
    total_fixes += widget_fixes

    if total_fixes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)

    return total_fixes


def main():
    files = sorted(glob.glob('blog/*/index.html'))
    print(f"Scanning {len(files)} article files...\n")

    fixed_count = 0
    total_fixes = 0

    for filepath in files:
        fixes = fix_article(filepath)
        if fixes > 0:
            # Verify
            with open(filepath) as f:
                html = f.read()
            balance = None
            for cls in ['art-body', 'article-body']:
                balance = verify_balance(html, cls)
                if balance is not None:
                    break

            status = "OK" if balance == 0 else f"balance={balance}"
            print(f"  FIXED: {filepath} — {fixes} fixes [{status}]")
            fixed_count += 1
            total_fixes += fixes

    print(f"\n{'='*60}")
    print(f"Fixed {fixed_count} files with {total_fixes} total fixes")

    # Full verification
    print(f"\nVerification pass:")
    all_clean = True
    for filepath in files:
        with open(filepath) as f:
            html = f.read()

        for cls in ['art-body', 'article-body']:
            balance = verify_balance(html, cls)
            if balance is not None:
                if balance != 0:
                    print(f"  WARNING: {filepath} has {balance} imbalance ({cls})")
                    all_clean = False
                break
        else:
            # No known content class found
            if 'art-body' in html or 'article-body' in html:
                print(f"  SKIPPED (no end marker): {filepath}")

    if all_clean:
        print("  ALL articles have balanced div tags")


if __name__ == '__main__':
    main()
