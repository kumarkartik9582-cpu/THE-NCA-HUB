#!/usr/bin/env python3
"""
Fix factual errors across the NCA Hub website.

Facts being corrected (standardizing to province comparison page which is the authoritative source):
1. Ontario articling: minimum 10 months (not 12) — province-comparison/index.html is correct
2. LPP description: 8 months total (4 months training + 4 months work placement), NOT "4-month intensive"
3. Consistency: pages saying "Ontario 12 months" corrected to "10 months"
4. become-a-lawyer-in-bc: "shorter than Ontario's 12 months" → "shorter than Ontario's 10-month minimum"
5. become-a-lawyer-in-alberta: remove claim Alberta articling is "same as Ontario"
"""

import os
import re
import glob

ROOT = '/home/user/THE-NCA-HUB'

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


# ── 1. Fix LPP description in articles that call it "4-month intensive" ──────
LPP_OLD = "a 4-month intensive alternative to the traditional 10-month articling placement"
LPP_NEW = "an 8-month alternative to traditional articling (4 months of skills training followed by a 4-month work placement)"

LPP_OLD2 = "a 4-month intensive alternative to the traditional 12-month articling placement"
LPP_NEW2 = "an 8-month alternative to traditional articling (4 months of skills training followed by a 4-month work placement)"

# ── 2. Fix become-a-lawyer-in-ontario: 12 months → minimum 10 months ─────────
ONTARIO_FILES = [
    '/home/user/THE-NCA-HUB/become-a-lawyer-in-ontario/index.html',
]
ONTARIO_FIXES = [
    (
        'Complete either 12 months of articling with an Ontario principal or the 8-month Law Practice Program (LPP)',
        'Complete either a minimum 10 months of articling (typically 10–12 months) with an Ontario principal or the 8-month Law Practice Program (LPP)'
    ),
    (
        'either articling (12 months) or LPP (8 months)',
        'either articling (minimum 10 months, typically 10–12 months) or LPP (8 months)'
    ),
    (
        '<li><strong style="color:var(--cream)">Articling</strong> — 12 months of supervised practice with a principal who is an LSO member in good standing.',
        '<li><strong style="color:var(--cream)">Articling</strong> — minimum 10 months of supervised practice (most placements are 10–12 months) with a principal who is an LSO member in good standing.'
    ),
    (
        'either articling (12 months) or LPP (8 months) — plus pass the Barrister and Solicitor exams',
        'either articling (minimum 10 months, typically 10–12 months) or LPP (8 months) — plus pass the Barrister and Solicitor exams'
    ),
]

# ── 3. Fix become-a-lawyer-in-bc: "Ontario's 12 months" → "Ontario's 10-month minimum" ──
BC_FILE = '/home/user/THE-NCA-HUB/become-a-lawyer-in-bc/index.html'
BC_FIXES = [
    (
        "shorter than Ontario's 12 months",
        "shorter than Ontario's standard 10–12 month articling term"
    ),
    (
        "Articling in BC is 9 months, shorter than Ontario's 12 months.",
        "Articling in BC is 9 months, shorter than Ontario's typical 10–12 months."
    ),
]

# ── 4. Fix become-a-lawyer-in-alberta: "same as Ontario" is wrong ─────────────
AB_FILE = '/home/user/THE-NCA-HUB/become-a-lawyer-in-alberta/index.html'
AB_FIXES = [
    (
        "Articling in Alberta is 12 months, the same as Ontario and longer than BC's 9 months.",
        "Articling in Alberta is 12 months, longer than Ontario's minimum (10 months) and longer than BC's 9 months."
    ),
]

# ── 5. Fix nca-for-indian-lawyers: "12 months in Ontario" → "10-12 months in Ontario" ──
INDIAN_FILE = '/home/user/THE-NCA-HUB/nca-for-indian-lawyers/index.html'
INDIAN_FIXES = [
    (
        'Complete articling (12 months in Ontario, 9 months in BC)',
        'Complete articling (minimum 10 months in Ontario, 9 months in BC)'
    ),
    (
        'Articling: 10 months (Ontario), 9 months (BC)',
        'Articling: minimum 10 months (Ontario), 9 months (BC)'
    ),
]

# ── 6. Fix nca-statistics: any 12-month Ontario articling claims ──────────────
STATS_FILE = '/home/user/THE-NCA-HUB/nca-statistics/index.html'
STATS_FIXES = [
    (
        'articling is 12 months in Ontario',
        'articling is minimum 10 months in Ontario'
    ),
]

changed_files = []

# Fix LPP description in all blog articles
for fp in glob.glob(os.path.join(ROOT, 'blog', '*', 'index.html')):
    fixed = fix_file(fp, [(LPP_OLD, LPP_NEW), (LPP_OLD2, LPP_NEW2)])
    if fixed:
        changed_files.append(fp.replace(ROOT+'/', ''))

# Fix individual files
for fp, fixes in [
    (ONTARIO_FILES[0], ONTARIO_FIXES),
    (BC_FILE, BC_FIXES),
    (AB_FILE, AB_FIXES),
    (INDIAN_FILE, INDIAN_FIXES),
]:
    fixed = fix_file(fp, fixes)
    if fixed:
        changed_files.append(fp.replace(ROOT+'/', ''))

# Fix stats page if it exists
if os.path.exists(STATS_FILE):
    fixed = fix_file(STATS_FILE, STATS_FIXES)
    if fixed:
        changed_files.append(STATS_FILE.replace(ROOT+'/', ''))

print(f"Files updated: {len(changed_files)}")
for f in changed_files:
    print(f"  {f}")
