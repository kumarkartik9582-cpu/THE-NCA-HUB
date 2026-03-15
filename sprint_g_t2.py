#!/usr/bin/env python3
"""Task 2 — Build search-index.json"""
import os, re, json, glob

ROOT = '/home/user/THE-NCA-HUB'

def extract_meta(path):
    with open(path) as f:
        content = f.read()
    title_m = re.search(r'<title>(.*?)</title>', content)
    desc_m = re.search(r'<meta name="description" content="([^"]+)"', content)
    h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
    title = title_m.group(1).strip() if title_m else ''
    desc = desc_m.group(1).strip() if desc_m else ''
    h1 = re.sub(r'<[^>]+>', '', h1_m.group(1)).strip() if h1_m else ''
    # derive url from path
    url = path.replace(ROOT, '').replace('/index.html', '/') or '/'
    return title, desc, h1, url

# Curated list of important pages
pages = [
    # Homepage & tools
    ('/', 'The NCA Hub — NCA Exam Preparation Guides', 'Structured notes and guides for internationally trained lawyers writing NCA exams in Canada.', ''),
    ('/notes/', 'NCA Study Notes — All Subjects', 'Complete NCA exam notes for all 5 mandatory subjects plus electives.', ''),
    ('/notes/administrative-law/', 'Administrative Law NCA Notes', 'Comprehensive NCA Administrative Law notes covering Vavilov, MAID, judicial review.', ''),
    ('/notes/constitutional-law/', 'Constitutional Law NCA Notes', 'NCA Constitutional Law notes covering division of powers, Charter, s.33, s.35.', ''),
    ('/notes/criminal-law/', 'Criminal Law NCA Notes', 'NCA Criminal Law notes covering mens rea, actus reus, defences, sentencing.', ''),
    ('/notes/foundations-of-canadian-law/', 'Foundations of Canadian Law NCA Notes', 'NCA Foundations notes covering common law, civil law, Indigenous law, history.', ''),
    ('/notes/professional-responsibility/', 'Professional Responsibility NCA Notes', 'NCA Professional Responsibility notes covering Model Code, conflicts, competence.', ''),
    ('/notes/complete-bundle/', 'Complete NCA Notes Bundle — All 5 Subjects', 'Save with the complete bundle covering all 5 mandatory NCA subjects.', ''),
    ('/nca-exam-dates-2026/', 'NCA Exam Dates 2026', 'Official NCA exam dates and registration deadlines for 2026.', ''),
    ('/nca-cost-calculator/', 'NCA Cost Calculator 2026', 'Calculate your total NCA exam cost including assessment, exams, and preparation.', ''),
    ('/nca-prep-checklist/', 'NCA Prep Checklist', 'Step-by-step NCA preparation checklist for internationally trained lawyers.', ''),
    ('/about/', 'About The NCA Hub — Kartik Kumar', 'How The NCA Hub was built by an internationally trained lawyer who passed all NCA exams.', ''),
    # Country hubs
    ('/nca-for-indian-lawyers/', 'NCA Exams for Indian Lawyers', 'Complete guide to NCA exam requirements for lawyers from India.', ''),
    ('/nca-for-nigerian-lawyers/', 'NCA Exams for Nigerian Lawyers', 'Complete guide to NCA exam requirements for lawyers from Nigeria.', ''),
    ('/nca-for-pakistani-lawyers/', 'NCA Exams for Pakistani Lawyers', 'Complete guide to NCA exam requirements for lawyers from Pakistan.', ''),
    ('/nca-for-uk-lawyers/', 'NCA Exams for UK Lawyers', 'Complete guide to NCA exam requirements for lawyers from the United Kingdom.', ''),
    ('/nca-for-philippine-lawyers/', 'NCA Exams for Philippine Lawyers', 'Complete guide to NCA exam requirements for lawyers from the Philippines.', ''),
    ('/nca-for-jamaican-lawyers/', 'NCA Exams for Jamaican Lawyers', 'Complete guide to NCA exam requirements for lawyers from Jamaica.', ''),
    # Province guides
    ('/become-a-lawyer-in-ontario/', 'How to Become a Lawyer in Ontario as an International Graduate', 'NCA path, LSUC licensing, Articling, LPP — complete Ontario guide.', ''),
    ('/become-a-lawyer-in-bc/', 'How to Become a Lawyer in BC as an International Graduate', 'NCA path, Law Society of BC admission requirements for foreign-trained lawyers.', ''),
    ('/become-a-lawyer-in-alberta/', 'How to Become a Lawyer in Alberta as an International Graduate', 'NCA path, LSA licensing process for internationally educated lawyers.', ''),
]

# Scrape blog articles
blog_dirs = sorted(glob.glob(os.path.join(ROOT, 'blog', '*', 'index.html')))
for path in blog_dirs:
    title, desc, h1, url = extract_meta(path)
    if title and url:
        pages.append((url, title, desc, h1))

# Build index
index = []
for item in pages:
    if len(item) == 4:
        url, title, desc, h1 = item
    else:
        url, title, desc = item; h1 = ''
    # Remove site name suffix from title
    title = re.sub(r'\s*[|—–]\s*The NCA Hub.*$', '', title).strip()
    entry = {'url': url, 'title': title, 'desc': desc}
    if h1 and h1 != title:
        entry['h1'] = h1
    index.append(entry)

with open(os.path.join(ROOT, 'search-index.json'), 'w') as f:
    json.dump(index, f, indent=2, ensure_ascii=False)

print(f'Task 2: search-index.json written with {len(index)} entries')
