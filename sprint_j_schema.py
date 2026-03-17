#!/usr/bin/env python3
"""
Sprint J Schema — Add missing schema types:
  1. HowTo schema on study-method articles
  2. NewsArticle schema on time-sensitive pages
  3. Product + Offer schema on notes product pages
"""

import os, re, json, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# ── HowTo articles (slug → steps) ───────────────────────────────────────────
HOWTO_ARTICLES = {
    'article-pass-nca-90-days': {
        'name': 'How to Pass All NCA Exams in 90 Days',
        'description': 'A step-by-step method for passing multiple NCA challenge exams in 90 days used by Kartik Kumar, founder of The NCA Hub.',
        'steps': [
            ('Assess your subjects', 'Request your NCA assessment and identify which subjects you need to challenge. Log into nca.legal to confirm your required subjects.'),
            ('Build your study schedule', 'Allocate study weeks per subject based on difficulty. Allow 4–6 weeks per mandatory subject and 3–4 weeks for electives.'),
            ('Get concise study materials', 'Use notes under 100 pages per subject. Avoid 300-page textbooks — the NCA tests application, not recall.'),
            ('Study using active recall', 'Use the IRAC method (Issue, Rule, Application, Conclusion) for every practice answer. Write full answers, not bullet points.'),
            ('Register for your exams', 'Register through nca.legal at least 6 weeks before the exam sitting. Pay the exam fee (~$500 CAD per subject).'),
            ('Complete exam-day preparation', 'Print all approved materials. Set up MonitorEDU the day before. Do a systems test. Confirm your exam time and proctoring requirements.'),
        ]
    },
    'article-c3-one-month-nca-prep': {
        'name': 'How to Prepare for an NCA Exam in One Month',
        'description': 'A structured 4-week NCA exam preparation plan for internationally trained lawyers.',
        'steps': [
            ('Week 1: Foundation reading', 'Read the full subject notes once through. Highlight key principles, tests, and leading cases. Do not attempt practice questions yet.'),
            ('Week 2: Active summarising', 'Condense your notes to a personal cheat sheet of 10–15 pages. Focus on the top 20 principles most likely to appear as exam questions.'),
            ('Week 3: Practice answers', 'Write at least one full IRAC answer per day under timed conditions. Use past exam topics and adapt them to current law.'),
            ('Week 4: Mock exam and review', 'Attempt a full 3-hour mock exam. Review weak areas. Finalise and print your exam materials. Complete the MonitorEDU systems test.'),
        ]
    },
    'article-e1-nca-study-schedule-working': {
        'name': 'How to Create an NCA Study Schedule While Working Full-Time',
        'description': 'Step-by-step guide to building a realistic NCA exam study schedule around a full-time job.',
        'steps': [
            ('Calculate your available hours', 'Map out your week. Count realistic study hours (morning, lunch, evening). Most working candidates have 10–15 hours per week.'),
            ('Assign subjects to time blocks', 'Allocate subjects based on available weeks before your exam date. Use backward planning from exam date.'),
            ('Use daily micro-sessions', 'Study in 45-minute blocks rather than long sessions. Use commute time for review. Use evenings for active writing practice.'),
            ('Build in review days', 'Schedule one full review day per week to consolidate the week\'s learning. Do not add new material on review days.'),
            ('Protect your exam week', 'Stop adding new material 5 days before the exam. Use the final week only for review, printing materials, and technical setup.'),
        ]
    },
}

# ── NewsArticle articles ─────────────────────────────────────────────────────
NEWSARTICLE_SLUGS = {
    'nca-exam-cost-2026',
    'nca-exam-dates-2026',  # handled separately (not in blog/)
    'article-f1-nca-policy-changes-2026',
    'nca-admin-law-june-2026',
    'nca-con-law-july-2026',
    'nca-criminal-law-may-2026',
    'nca-pr-may-2026',
    'nca-language-requirement-2026',
}

# ── Notes product pages (slug → product info) ────────────────────────────────
NOTES_PRODUCTS = {
    'administrative-law': {
        'name': 'NCA Administrative Law Study Notes',
        'description': 'Concise study notes for the NCA Administrative Law challenge exam. Under 80 pages, includes answer templates and key case summaries.',
        'price': '175.00',
        'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/administrative-law/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
    'constitutional-law': {
        'name': 'NCA Constitutional Law Study Notes',
        'description': 'Concise study notes for the NCA Constitutional Law challenge exam. Covers Charter rights, division of powers, and leading cases.',
        'price': '175.00', 'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/constitutional-law/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
    'criminal-law': {
        'name': 'NCA Criminal Law Study Notes',
        'description': 'Concise study notes for the NCA Criminal Law challenge exam. Covers actus reus, mens rea, defences, and procedure.',
        'price': '175.00', 'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/criminal-law/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
    'foundations-of-canadian-law': {
        'name': 'NCA Foundations of Canadian Law Study Notes',
        'description': 'Concise study notes for the NCA Foundations of Canadian Law challenge exam. Covers Indigenous law, bijuralism, and legal methodology.',
        'price': '175.00', 'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/foundations-of-canadian-law/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
    'professional-responsibility': {
        'name': 'NCA Professional Responsibility Study Notes',
        'description': 'Concise study notes for the NCA Professional Responsibility challenge exam. Covers the Model Code, duties, and ethics scenarios.',
        'price': '175.00', 'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/professional-responsibility/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
    'complete-bundle': {
        'name': 'NCA Complete Bundle — All 5 Subjects',
        'description': 'All 5 NCA mandatory subject study notes in one bundle: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility.',
        'price': '695.00', 'currency': 'CAD',
        'url': 'https://www.thencahub.com/notes/complete-bundle/',
        'payhip': 'https://payhip.com/THENCAHUB',
    },
}


def inject_schema(html, new_schema_obj):
    """Add a new schema object to the existing @graph array, or create new ld+json block."""
    graph_match = re.search(
        r'(<script type="application/ld\+json">\s*\{[^<]*"@graph"\s*:\s*\[)(.*?)(\]\s*\}[\s\S]*?</script>)',
        html, re.DOTALL
    )
    if graph_match:
        new_entry = ',\n    ' + json.dumps(new_schema_obj, indent=4).replace('\n', '\n    ')
        html = html[:graph_match.end(2)] + new_entry + html[graph_match.end(2):]
        return html
    # No @graph — append a new <script> block before </head>
    new_block = (
        '\n<script type="application/ld+json">\n' +
        json.dumps(new_schema_obj, indent=2) +
        '\n</script>\n'
    )
    return html.replace('</head>', new_block + '</head>', 1)


def get_canonical(html):
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    return m.group(1) if m else ''


def get_title(html):
    m = re.search(r'"headline"\s*:\s*"([^"]+)"', html)
    if m: return m.group(1)
    m = re.search(r'<title>([^<]+)</title>', html)
    return re.sub(r'\s*—\s*The NCA Hub.*', '', m.group(1)).strip() if m else ''


def get_date_published(html):
    m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html)
    return m.group(1) if m else '2026-01-01'


def get_date_modified(html):
    m = re.search(r'"dateModified"\s*:\s*"([^"]+)"', html)
    return m.group(1) if m else '2026-03-15'


# ── Process HowTo articles ───────────────────────────────────────────────────
changed = 0

for slug, info in HOWTO_ARTICLES.items():
    path = os.path.join(BASE, 'blog', slug, 'index.html')
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if '"HowTo"' in html:
        continue
    url = get_canonical(html)
    schema = {
        '@type': 'HowTo',
        'name': info['name'],
        'description': info['description'],
        'url': url or f'https://www.thencahub.com/blog/{slug}/',
        'author': {
            '@type': 'Person',
            'name': 'Kartik Kumar',
            'url': 'https://www.thencahub.com/about/'
        },
        'step': [
            {'@type': 'HowToStep', 'name': s[0], 'text': s[1]}
            for s in info['steps']
        ]
    }
    html = inject_schema(html, schema)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    changed += 1
    print(f'  HowTo schema: blog/{slug}/')

# ── Process NewsArticle pages ────────────────────────────────────────────────
for slug in NEWSARTICLE_SLUGS:
    # check blog/ first, then root
    candidates = [
        os.path.join(BASE, 'blog', slug, 'index.html'),
        os.path.join(BASE, slug, 'index.html'),
    ]
    for path in candidates:
        if not os.path.exists(path):
            continue
        with open(path, 'r', encoding='utf-8') as f:
            html = f.read()
        if '"NewsArticle"' in html:
            break
        url = get_canonical(html)
        title = get_title(html)
        schema = {
            '@type': 'NewsArticle',
            'headline': title,
            'url': url,
            'datePublished': get_date_published(html),
            'dateModified': get_date_modified(html),
            'author': {'@type': 'Person', 'name': 'Kartik Kumar', 'url': 'https://www.thencahub.com/about/'},
            'publisher': {
                '@type': 'Organization',
                'name': 'The NCA Hub',
                'url': 'https://www.thencahub.com',
                'logo': {'@type': 'ImageObject', 'url': 'https://www.thencahub.com/favicon.svg'}
            },
            'image': 'https://www.thencahub.com/og-image.jpg',
            'description': title + ' — NCA exam preparation, The NCA Hub',
        }
        html = inject_schema(html, schema)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        changed += 1
        print(f'  NewsArticle schema: {os.path.relpath(path, BASE)}')
        break

# ── Process notes product pages ─────────────────────────────────────────────
for slug, info in NOTES_PRODUCTS.items():
    path = os.path.join(BASE, 'notes', slug, 'index.html')
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if '"Product"' in html:
        continue
    schema = {
        '@type': 'Product',
        'name': info['name'],
        'description': info['description'],
        'url': info['url'],
        'brand': {'@type': 'Brand', 'name': 'The NCA Hub'},
        'offers': {
            '@type': 'Offer',
            'url': info['payhip'],
            'price': info['price'],
            'priceCurrency': info['currency'],
            'availability': 'https://schema.org/InStock',
            'seller': {'@type': 'Organization', 'name': 'The NCA Hub'}
        }
    }
    html = inject_schema(html, schema)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    changed += 1
    print(f'  Product schema: notes/{slug}/')

print(f'\nDone. {changed} schema updates applied.')
