import os, re, json

BLOG_DIR = '/home/user/THE-NCA-HUB/blog'

AUTHOR_BLOCK = {
    "@type": "Person",
    "name": "Kartik Kumar",
    "url": "https://www.thencahub.com/about/",
    "jobTitle": "Founder, The NCA Hub",
    "description": "Indian-qualified lawyer who built his career at UK law firms DWF, Eversheds Sutherland, and Keoghs. Passed all 5 NCA subjects — 4 cleared in under 3 months, starting with Administrative Law with one week to prepare. Certificate of Qualification requested."
}

PUBLISHER_BLOCK = {
    "@type": "Organization",
    "name": "The NCA Hub",
    "url": "https://www.thencahub.com",
    "logo": {"@type": "ImageObject", "url": "https://www.thencahub.com/favicon.svg"}
}

# Articles that are from the a/b/c/d/e/f series or pass-90-days → datePublished 2026-03-07
OLD_SERIES = [
    'article-a2-nca-exam-format', 'article-a3-administrative-law-nca', 'article-a4-nca-readiness-score',
    'article-b1-constitutional-law-nca', 'article-b2-criminal-law-nca',
    'article-b3-professional-responsibility-nca', 'article-b4-foundations-canadian-law-nca',
    'article-c1-failed-nca-exam', 'article-c2-nca-proctoring-guide', 'article-c3-one-month-nca-prep',
    'article-c4-nca-textbook-necessary', 'article-c5-nca-exam-anxiety',
    'article-d1-nca-prep-materials-compared', 'article-d2-nca-to-bar-exam',
    'article-d3-nca-indian-lawyers', 'article-d4-nca-uk-based-lawyers',
    'article-e1-nca-study-schedule-working', 'article-e2-nca-vs-bar-exam',
    'article-e3-nca-study-hours', 'article-e4-nca-process-timeline',
    'article-e5-300-page-notes-worth-it', 'article-e6-nca-live-classes-vs-self-study',
    'article-e7-nca-study-checklist', 'article-e8-nca-pass-criteria',
    'article-f1-nca-policy-changes-2026', 'article-f2-nca-nigerian-lawyers',
    'article-f3-nca-philippine-lawyers', 'article-pass-nca-90-days'
]

# New guides → datePublished 2026-03-15
NEW_GUIDES = [
    'nca-contracts-exam-guide', 'nca-torts-exam-guide', 'nca-property-law-exam-guide',
    'nca-business-organisations-exam-guide', 'nca-civil-procedure-exam-guide',
    'nca-lrw-guide', 'nca-exam-complete-guide'
]

def get_meta(content, attr, val):
    """Extract content= from a meta tag with name= or property="""
    m = re.search(r'<meta\s+(?:name|property)=["\']' + re.escape(val) + r'["\']\s+content=["\'](.*?)["\']', content)
    if m: return m.group(1)
    m = re.search(r'<meta\s+content=["\'](.*?)["\']\s+(?:name|property)=["\']' + re.escape(val) + r'["\']', content)
    if m: return m.group(1)
    return ''

def get_title_tag(content):
    m = re.search(r'<title>(.*?)</title>', content)
    return m.group(1).split('—')[0].strip().replace(' | The NCA Hub', '').strip() if m else ''

def make_article_block(slug, headline, description, url, date_published):
    return {
        "@type": "Article",
        "headline": headline,
        "description": description,
        "url": url,
        "datePublished": date_published,
        "dateModified": "2026-03-15",
        "author": AUTHOR_BLOCK,
        "publisher": PUBLISHER_BLOCK,
        "mainEntityOfPage": url,
        "image": "https://www.thencahub.com/og-image.jpg",
        "inLanguage": "en-CA"
    }

def make_lr_block(name, description, url):
    return {
        "@type": "LearningResource",
        "name": name,
        "description": description,
        "url": url,
        "educationalLevel": "Professional",
        "audience": {
            "@type": "Audience",
            "audienceType": "Internationally trained lawyers preparing for NCA challenge exams in Canada"
        },
        "inLanguage": "en-CA",
        "provider": {
            "@type": "Organization",
            "name": "The NCA Hub",
            "url": "https://www.thencahub.com"
        }
    }

updated = 0
errors = []

for slug in os.listdir(BLOG_DIR):
    fpath = os.path.join(BLOG_DIR, slug, 'index.html')
    if not os.path.isfile(fpath): continue
    if slug == '': continue  # skip blog index

    with open(fpath, 'r', encoding='utf-8') as fp:
        c = fp.read()

    # Find the ld+json block
    start = c.find('<script type="application/ld+json">')
    if start == -1:
        errors.append(f"NO LD+JSON: {slug}")
        continue
    end = c.find('</script>', start) + len('</script>')
    raw_json = c[start + len('<script type="application/ld+json">'):c.find('</script>', start)]

    try:
        data = json.loads(raw_json)
    except:
        errors.append(f"JSON PARSE ERROR: {slug}")
        continue

    graph = data.get('@graph', [])
    url = f"https://www.thencahub.com/blog/{slug}/"
    headline = get_title_tag(c)
    description = get_meta(c, 'description', 'description')
    date_published = "2026-03-07" if slug in OLD_SERIES else "2026-03-15"

    # Check if Article already present
    has_article = any(g.get('@type') == 'Article' for g in graph)
    has_lr = any(g.get('@type') == 'LearningResource' for g in graph)

    modified = False

    if not has_article:
        # Replace WebPage with Article
        new_graph = []
        for g in graph:
            if g.get('@type') == 'WebPage':
                new_graph.append(make_article_block(slug, headline, description, url, date_published))
                modified = True
            else:
                new_graph.append(g)
        graph = new_graph

    if has_article:
        # Update dateModified and datePublished in existing Article block
        new_graph = []
        for g in graph:
            if g.get('@type') == 'Article':
                g = dict(g)
                if g.get('dateModified') != '2026-03-15':
                    g['dateModified'] = '2026-03-15'
                    modified = True
                if g.get('datePublished') != date_published:
                    g['datePublished'] = date_published
                    modified = True
                # Ensure author block is complete
                if not g.get('author', {}).get('description'):
                    g['author'] = AUTHOR_BLOCK
                    modified = True
            new_graph.append(g)
        graph = new_graph

    if not has_lr:
        # Insert LearningResource right after Article block
        new_graph = []
        for g in graph:
            new_graph.append(g)
            if g.get('@type') == 'Article':
                new_graph.append(make_lr_block(headline, description, url))
                modified = True
        graph = new_graph

    if not modified:
        continue

    data['@graph'] = graph
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    new_block = f'<script type="application/ld+json">\n{new_json}\n</script>'
    c = c[:start] + new_block + c[end:]

    with open(fpath, 'w', encoding='utf-8') as fp:
        fp.write(c)
    updated += 1

print(f"Updated: {updated}")
if errors:
    for e in errors: print("ERROR:", e)
