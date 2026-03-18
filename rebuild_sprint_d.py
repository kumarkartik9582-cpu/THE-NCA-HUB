#!/usr/bin/env python3
"""
Rebuild Sprint D articles to match the canonical article template.

Category A (missing article-wrap / art-hero shell):
  nca-admin-law-june-2026, nca-pr-may-2026, nca-criminal-law-may-2026,
  nca-con-law-july-2026, nca-vs-canadian-llm, nca-how-to-appeal-assessment

Category B (100% inline styles, wrong wrapper):
  nca-language-requirement-2026, nca-exam-cost-2026, what-to-do-if-you-fail-nca
"""

import os, re

BASE = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────────────────────────────────────
# CORRECT NAV BLOCK (replaces the broken nav in all articles)
# ──────────────────────────────────────────────────────────────────────────────
CORRECT_NAV = '''<nav aria-label="Site navigation">
  <a href="/" class="nl" aria-label="The NCA Hub home">The NCA <span class="hub">Hub</span></a>
  <div class="nav-links">
    <a href="/#method">Method</a>
    <a href="/#subjects">Subjects</a>
    <a href="/#pricing">Pricing</a>
    <a href="/blog/" class="active">Articles</a>
    <a href="/#sample">Free Chapter</a>
  </div>
  <a href="/#readiness" class="nc">Get My Score</a>
  <button class="nh" id="nh" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
</nav>'''


def fix_body_tag(html):
    """Add has-sticky-cta class to body tag."""
    return re.sub(r'<body(\s[^>]*)?>',
                  lambda m: '<body class="has-sticky-cta">',
                  html, count=1)


def fix_nav(html):
    """Replace the nav block (including broken search button variant)."""
    nav_pat = re.compile(r'<nav\b[^>]*>.*?</nav>', re.DOTALL)
    return nav_pat.sub(CORRECT_NAV, html, count=1)


def strip_inline_styles(html):
    """Remove style="..." attributes from HTML elements (keeps CSS classes)."""
    return re.sub(r'\s+style="[^"]*"', '', html)


# ──────────────────────────────────────────────────────────────────────────────
# FIX CATEGORY A ARTICLES
# Shell fix: add article-wrap, art-hero, fix art-cluster/meta, add id to art-body
# ──────────────────────────────────────────────────────────────────────────────

def get_category_a_info(html):
    """Extract header info from Category A broken articles."""
    # Category from art-cat span
    cat_m = re.search(r'<span class="art-cat">(.*?)</span>', html)
    category = cat_m.group(1).strip() if cat_m else 'NCA Exam Guide'

    # Title
    title_m = re.search(r'<h1 class="art-title">(.*?)</h1>', html, re.DOTALL)
    title = title_m.group(1).strip() if title_m else ''

    # Read time
    read_m = re.search(r'<span class="art-read">(.*?)</span>', html)
    read_time = read_m.group(1).strip() if read_m else '10 min read'

    # Date
    date_m = re.search(r'<time datetime="([^"]*)">(.*?)</time>', html)
    date_attr = date_m.group(1) if date_m else '2026-03-15'
    date_text = date_m.group(2).strip() if date_m else 'March 2026'

    # art-desc
    desc_m = re.search(r'<p class="art-desc">(.*?)</p>', html, re.DOTALL)
    desc = desc_m.group(1).strip() if desc_m else ''

    # First paragraph from art-body (for answer-capsule)
    body_start = html.find('<div class="art-body">')
    if body_start > -1:
        body_section = html[body_start:]
        # Get the first <p> in body (usually the short answer)
        p_m = re.search(r'<p>(.*?)</p>', body_section, re.DOTALL)
        short_answer = p_m.group(0).strip() if p_m else ''
    else:
        short_answer = ''

    return {
        'category': category,
        'title': title,
        'read_time': read_time,
        'date_attr': date_attr,
        'date_text': date_text,
        'desc': desc,
        'short_answer': short_answer
    }


def fix_category_a(html, info):
    """
    Fix a Category A article:
    - body tag
    - nav
    - wrap content in article-wrap / article / art-hero
    - fix art-body id
    - close article-wrap before footer
    """
    html = fix_body_tag(html)
    html = fix_nav(html)

    category = info['category']
    title = info['title']
    read_time = info['read_time']
    date_attr = info['date_attr']
    date_text = info['date_text']
    desc = info['desc']

    # Build correct header (replaces art-cluster...art-header area)
    correct_header = f'''<div id="article-wrap">
  <article id="main-content">
    <header class="art-hero">
      <div class="art-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/blog/">Articles</a>
        <span aria-hidden="true">›</span>
        <span>{category}</span>
      </div>
      <div class="art-cluster" aria-label="Category">{category}</div>
      <h1 class="art-title">{title}</h1>
      <p class="answer-capsule">{desc}</p>
      <div class="art-meta">
        <span class="art-read" style="color:var(--fog);font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;">By <a href="/about/" style="color:var(--g1);text-decoration:none;">Kartik Kumar</a></span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read">{read_time}</span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read" style="color:var(--dim);">Updated: <time datetime="{date_attr}">{date_text}</time></span>
      </div>
    </header>'''

    # Remove old header block (from </nav> to start of art-body)
    nav_end = html.find('</nav>') + len('</nav>')
    art_body_start = html.find('<div class="art-body">')
    html = html[:nav_end] + '\n' + correct_header + '\n\n    ' + html[art_body_start:]

    # Fix art-body to include id
    html = html.replace('<div class="art-body">', '<div class="art-body" id="art-body">', 1)

    # Close article and article-wrap before footer
    html = html.replace('</div><!-- /.art-body -->', '</div><!-- end .art-body -->\n  </article>\n</div><!-- end #article-wrap -->', 1)

    return html


# ──────────────────────────────────────────────────────────────────────────────
# FIX CATEGORY B ARTICLES
# Full rebuild: extract inline-styled content, wrap in proper template
# ──────────────────────────────────────────────────────────────────────────────

def extract_cat_b_info(html):
    """Extract metadata from Category B inline-styled articles."""
    # H1 title
    h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
    title = h1_m.group(1).strip() if h1_m else ''
    # Strip inline styles from title text
    title = re.sub(r'\s+style="[^"]*"', '', title)

    # Category from the category badge span
    cat_m = re.search(r'letter-spacing:\.3em[^>]*>([^<]+)<', html)
    category = cat_m.group(1).strip() if cat_m else 'NCA Process'

    # Date
    date_m = re.search(r'<span[^>]*>([A-Z][a-z]+ \d+, \d{4})<', html)
    date_text_raw = date_m.group(1) if date_m else 'March 2026'

    # Read time
    read_m = re.search(r'(\d+) min read', html)
    read_time = read_m.group(0) if read_m else '8 min read'

    # Description — the p below h1 with border-bottom style
    desc_m = re.search(r'<h1[^>]*>.*?</h1>\s*<p[^>]*>(.*?)</p>', html, re.DOTALL)
    desc = desc_m.group(1).strip() if desc_m else ''
    desc = re.sub(r'\s+style="[^"]*"', '', desc)

    return {
        'category': category,
        'title': title,
        'read_time': read_time,
        'date_attr': '2026-03-15',
        'date_text': 'March 2026',
        'desc': desc,
    }


def extract_cat_b_body(html):
    """
    Extract article body content from Category B articles.
    - Finds the content between <article> and </article>
    - Strips all inline style attributes
    - Removes wrapper divs that only provided layout/padding
    - Preserves: p, h2, h3, ul, ol, li, table, tr, th, td, strong, em, a,
                 div.rule-box, div.nca-inline-newsletter, blockquote
    """
    # Find the article content start (after breadcrumb / metadata / h1 / desc)
    # The short-answer box with border-left style
    short_ans_m = re.search(r'(<div style="background:rgba\(201,168,76,\.04\);border-left:3px.*?>.*?</div>)', html, re.DOTALL)

    # Find where article ends
    art_end = html.rfind('</article>')
    if art_end == -1:
        art_end = html.find('<footer>')

    if short_ans_m:
        body_raw = html[short_ans_m.start():art_end]
    else:
        # Fallback: start after h1+desc
        h1_end = re.search(r'</h1>', html)
        if h1_end:
            # Skip next paragraph (desc)
            after_h1 = html[h1_end.end():]
            p_end = after_h1.find('</p>')
            body_raw = after_h1[p_end+4:art_end - h1_end.end()]
        else:
            body_raw = html[:art_end]

    # Strip all inline style attributes
    body_clean = strip_inline_styles(body_raw)

    # Convert the short-answer box to a rule-box
    body_clean = re.sub(
        r'<div\s+class="[^"]*"?(?!\s*rule-box)[^>]*>\s*(<p>\s*<strong[^>]*>The short answer:</strong>)',
        r'<div class="rule-box">\1',
        body_clean, count=1
    )

    # Remove standalone wrapper divs that only had style attributes (now empty class)
    # Pattern: <div> or <div class=""> with no meaningful content class
    body_clean = re.sub(r'<div\s*>', '', body_clean)  # bare <div>
    body_clean = re.sub(r'<div class="">', '', body_clean)  # empty class divs
    body_clean = re.sub(r'<div class="[^"]*" ?>', lambda m: m.group(0), body_clean)  # keep classed divs

    # Remove the padding/spacer div
    body_clean = re.sub(r'<div style="padding-top:\d+px;"></div>', '', body_clean)

    # Remove stray </div> tags that were closing the layout wrapper divs
    # We do this carefully: count divs inside nca-inline-newsletter and rule-box
    # For now, strip orphaned </div> before h2 or at end
    body_clean = re.sub(r'\n\s*</div>\s*\n(\s*</div>)?\s*\n\s*<!-- Inline Newsletter', '\n<!-- Inline Newsletter', body_clean)
    body_clean = re.sub(r'\n\s*</div>\s*\n\s*$', '\n', body_clean)

    return body_clean.strip()


def fix_category_b(html, info):
    """Rebuild a Category B article with the correct shell."""
    html = fix_body_tag(html)
    html = fix_nav(html)

    category = info['category']
    title = info['title']
    read_time = info['read_time']
    date_attr = info['date_attr']
    date_text = info['date_text']
    desc = info['desc']

    body_content = extract_cat_b_body(html)

    # Build the correct article header
    correct_header = f'''<div id="article-wrap">
  <article id="main-content">
    <header class="art-hero">
      <div class="art-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/blog/">Articles</a>
        <span aria-hidden="true">›</span>
        <span>{category}</span>
      </div>
      <div class="art-cluster" aria-label="Category">{category}</div>
      <h1 class="art-title">{title}</h1>
      <p class="answer-capsule">{desc}</p>
      <div class="art-meta">
        <span class="art-read" style="color:var(--fog);font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;">By <a href="/about/" style="color:var(--g1);text-decoration:none;">Kartik Kumar</a></span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read">{read_time}</span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read" style="color:var(--dim);">Updated: <time datetime="{date_attr}">{date_text}</time></span>
      </div>
    </header>

    <div class="art-body" id="art-body">

{body_content}

    </div><!-- end .art-body -->
  </article>
</div><!-- end #article-wrap -->'''

    # Replace content between </nav> and <footer>
    nav_end = html.find('</nav>') + len('</nav>')
    footer_start = html.find('<footer>')
    html = html[:nav_end] + '\n\n' + correct_header + '\n\n' + html[footer_start:]

    return html


# ──────────────────────────────────────────────────────────────────────────────
# PROCESS ALL ARTICLES
# ──────────────────────────────────────────────────────────────────────────────

CAT_A = [
    'nca-admin-law-june-2026',
    'nca-pr-may-2026',
    'nca-criminal-law-may-2026',
    'nca-con-law-july-2026',
    'nca-vs-canadian-llm',
    'nca-how-to-appeal-assessment',
]

CAT_B = [
    'nca-language-requirement-2026',
    'nca-exam-cost-2026',
    'what-to-do-if-you-fail-nca',
]


def process(slug, category):
    path = os.path.join(BASE, 'blog', slug, 'index.html')
    with open(path, 'r', encoding='utf-8') as f:
        original = f.read()

    if category == 'A':
        info = get_category_a_info(original)
        fixed = fix_category_a(original, info)
    else:
        info = extract_cat_b_info(original)
        fixed = fix_category_b(original, info)

    if fixed == original:
        print(f'  [skip] {slug} — no changes')
        return False

    with open(path, 'w', encoding='utf-8') as f:
        f.write(fixed)
    print(f'  [fixed-{category}] {slug}')
    return True


changed = 0
print('\nCategory A (shell fix)...')
for s in CAT_A:
    if process(s, 'A'):
        changed += 1

print('\nCategory B (full rebuild)...')
for s in CAT_B:
    if process(s, 'B'):
        changed += 1

print(f'\nDone. {changed} files updated.')
