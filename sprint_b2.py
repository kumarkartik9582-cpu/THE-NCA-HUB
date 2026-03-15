#!/usr/bin/env python3
"""Sprint B Part 2 - Tasks 3-16"""
import os, glob

BASE = '/home/user/THE-NCA-HUB'

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()
def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  UPDATED: {path.replace(BASE+'/', '')}")

# ─── SHARED BLOCKS ─────────────────────────────────────────────────────
ANUM_TESTIMONIAL = '''<div style="background:rgba(201,168,76,.04);border-left:3px solid var(--g1);padding:24px 28px;margin-bottom:24px;max-width:520px;margin-left:auto;margin-right:auto;"><p style="font-family:var(--fd);font-size:1.15rem;font-weight:300;color:var(--cream);line-height:1.7;font-style:italic;margin-bottom:14px;">"I passed on my 4th and final attempt. This is the only method that worked for me."</p><p style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;">Anum &middot; Constitutional Law &middot; 4th attempt</p></div>'''

SOCIAL_PROOF = '<p style="font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;margin-bottom:20px;text-align:center;">\u2713 Used by candidates in 12+ countries across all 5 NCA subjects</p>'

LOSS_AVERSION = '''<div style="background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.12);padding:20px 24px;margin:20px 0;max-width:480px;margin-left:auto;margin-right:auto;"><p style="font-size:var(--sm);color:var(--fog);font-family:var(--fb);line-height:1.8;text-align:center;">One NCA resit costs <strong style="color:var(--cream);">$500 CAD + taxes</strong> and a <strong style="color:var(--cream);">3-month wait</strong> for the next session. These notes cost <strong style="color:var(--cream);">$175 CAD</strong>. The maths are straightforward.</p></div>'''

RISK_REVERSAL = '<p style="font-size:var(--sm);color:var(--fog);text-align:center;font-family:var(--fb);line-height:1.8;margin-bottom:24px;">If you sit your exam using these notes and don\'t pass, email <a href="mailto:hello@thencahub.com" style="color:var(--g1);text-decoration:none;">hello@thencahub.com</a> and we will send you the updated notes for your resit &#x2014; <strong style="color:var(--cream);">free.</strong></p>'

BNPL = '<p style="font-size:.72rem;color:var(--dim);margin-top:12px;text-align:center;font-family:var(--fb);">Instant PDF delivery &middot; <span style="color:var(--fog);">Pay in 2 instalments available at checkout</span> &middot; Questions? <a href="mailto:hello@thencahub.com" style="color:var(--g1);text-decoration:none;">hello@thencahub.com</a></p>'

WA_CSS = """\n.wa-float{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:7900;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:transform .3s var(--expo),box-shadow .3s;text-decoration:none;}\n.wa-float:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(37,211,102,.5);}\n.wa-float svg{width:28px;height:28px;fill:#fff;}\n@media(min-width:960px){.wa-float{display:none;}}\n@media(max-width:768px){.has-sticky-cta .wa-float{bottom:72px;}}"""

WA_HTML = """<a href="https://wa.me/message/PLACEHOLDER" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" onclick="gtag('event','whatsapp_click',{'page':window.location.pathname});"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>"""

STICKY_CSS = """\n.sticky-mob-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--g1);color:var(--void);text-align:center;padding:16px 24px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;z-index:8000;box-shadow:0 -4px 20px rgba(201,168,76,.25);transition:transform .3s ease;}\n@media(max-width:768px){.sticky-mob-cta{display:block;}body{padding-bottom:56px;}}"""

# ─── TASK 3: STICKY MOBILE CTA ON BLOG ARTICLES ─────────────────────────────
print("\n=== TASK 3: Sticky mobile CTA on blog articles ===")

# Article to Payhip link mapping
article_links = {
    'article-a3-administrative-law-nca': 'https://payhip.com/b/UNbgM',
    'article-b1-constitutional-law-nca': 'https://payhip.com/b/d5AzB',
    'article-b2-criminal-law-nca': 'https://payhip.com/b/6TnbH',
    'article-b3-professional-responsibility-nca': 'https://payhip.com/b/3n4jK',
    'article-b4-foundations-canadian-law-nca': 'https://payhip.com/b/tCd8i',
}

blog_articles = glob.glob(BASE + '/blog/article-*/index.html')
blog_articles += glob.glob(BASE + '/blog/nca-*/index.html')
blog_articles += [BASE + '/blog/article-pass-nca-90-days/index.html']

for fpath in sorted(blog_articles):
    if '.git' in fpath:
        continue
    content = read(fpath)
    if 'sticky-mob-cta' in content:
        continue  # already has it
    
    # Determine Payhip link
    payhip = 'https://payhip.com/THENCAHUB'
    for key, link in article_links.items():
        if key in fpath:
            payhip = link
            break
    
    # Add CSS before </style>
    if '</style>' in content and STICKY_CSS.strip() not in content:
        content = content.replace('</style>', STICKY_CSS + '\n</style>', 1)
    
    # Add WA CSS before </style> if not present
    if 'wa-float' not in content and WA_CSS.strip() not in content:
        content = content.replace('</style>', WA_CSS + '\n</style>', 1)
    
    # Add has-sticky-cta class to body
    if '<body>' in content:
        content = content.replace('<body>', '<body class="has-sticky-cta">', 1)
    elif '<body ' in content and 'has-sticky-cta' not in content:
        content = content.replace('<body ', '<body class="has-sticky-cta" ', 1)
    
    # Add sticky CTA HTML before </body>
    sticky_html = f'\n<a href="{payhip}" class="sticky-mob-cta" target="_blank" rel="noopener noreferrer" onclick="gtag(\'event\',\'sticky_cta_click\'{{\'page\':window.location.pathname}});">Get My Notes &#x2014; From $175 CAD &#x2192;</a>'
    # Fix the onclick for valid JS - use simpler version
    sticky_html = f'\n<a href="{payhip}" class="sticky-mob-cta" target="_blank" rel="noopener noreferrer">Get My Notes &#x2014; From $175 CAD &#x2192;</a>'
    
    # Add WA button before </body>
    wa_html = '\n' + WA_HTML
    
    if '</body>' in content:
        content = content.replace('</body>', sticky_html + wa_html + '\n</body>', 1)
    
    write(fpath, content)

# ─── TASK 7: DECOY PRICING ON INDIVIDUAL NOTES PAGES ────────────────────────
print("\n=== TASK 7+4+5+6+8+10: Decoy pricing + conversion blocks on individual notes pages ===")

notes_config = {
    BASE + '/notes/administrative-law/index.html': {
        'payhip': 'https://payhip.com/b/UNbgM',
        'subject_key': 'Administrative Law',
    },
    BASE + '/notes/constitutional-law/index.html': {
        'payhip': 'https://payhip.com/b/d5AzB',
        'subject_key': 'Constitutional Law',
    },
    BASE + '/notes/criminal-law/index.html': {
        'payhip': 'https://payhip.com/b/6TnbH',
        'subject_key': 'Criminal Law',
    },
    BASE + '/notes/foundations-of-canadian-law/index.html': {
        'payhip': 'https://payhip.com/b/tCd8i',
        'subject_key': 'Foundations of Canadian Law',
    },
    BASE + '/notes/professional-responsibility/index.html': {
        'payhip': 'https://payhip.com/b/3n4jK',
        'subject_key': 'Professional Responsibility',
    },
}

# The hero price section start/end markers (same on all 5 pages)
HERO_PRICE_START = '<div style="font-family:var(--fd);font-size:clamp(2rem,4vw,3.5rem);font-weight:300;color:var(--g1);line-height:1;margin-bottom:8px;">$175'
# End after the flex buttons div closing tag
HERO_CTA_MARKER = 'Get Free Chapter First</a>\n      </div>'

# Bottom CTA section marker
BOTTOM_CTA_LINK_OLD = '">Get My Notes &rarr;</a>'  # After Task 1 change

def build_decoy_pricing_block(payhip):
    return f'''
{SOCIAL_PROOF}
<div class="pricing-tiers" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px;max-width:700px;margin:0 auto 32px;">
  <div style="background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.1);padding:28px 20px;text-align:center;position:relative;">
    <p style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);font-family:var(--fb);margin-bottom:12px;">Notes Only</p>
    <p style="font-family:var(--fd);font-size:2rem;font-weight:300;color:var(--fog);margin-bottom:8px;">$149</p>
    <p style="font-size:.72rem;color:var(--dim);font-family:var(--fb);margin-bottom:16px;">CAD + taxes</p>
    <p style="font-size:.72rem;color:var(--dim);font-family:var(--fb);line-height:1.6;">PDF notes<br>No templates</p>
  </div>
  <div style="background:rgba(201,168,76,.08);border:2px solid var(--g1);padding:28px 20px;text-align:center;position:relative;transform:translateY(-4px);">
    <p style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--g1);color:var(--void);font-size:.57rem;font-family:var(--fb);font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:4px 14px;white-space:nowrap;">Most Popular</p>
    <p style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);margin-bottom:12px;">Complete System</p>
    <p style="font-family:var(--fd);font-size:2.4rem;font-weight:300;color:var(--cream);margin-bottom:8px;">$175</p>
    <p style="font-size:.72rem;color:var(--fog);font-family:var(--fb);margin-bottom:16px;">CAD + taxes</p>
    <p style="font-size:.72rem;color:var(--fog);font-family:var(--fb);line-height:1.6;">PDF notes<br>Answer templates<br>Practice questions</p>
  </div>
  <div style="background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.1);padding:28px 20px;text-align:center;position:relative;">
    <p style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);font-family:var(--fb);margin-bottom:12px;">All 5 Subjects</p>
    <p style="font-family:var(--fd);font-size:2rem;font-weight:300;color:var(--fog);margin-bottom:8px;">$749</p>
    <p style="font-size:.72rem;color:var(--dim);font-family:var(--fb);margin-bottom:16px;">CAD + taxes</p>
    <p style="font-size:.72rem;color:var(--dim);font-family:var(--fb);line-height:1.6;">All 5 subjects<br>Complete system<br>Best value</p>
  </div>
</div>
{LOSS_AVERSION}
{RISK_REVERSAL}
{ANUM_TESTIMONIAL}
<div style="text-align:center;">
  <a href="{payhip}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:18px 48px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Get My Complete System &#x2192;</a>
  {BNPL}
</div>
<style>@media(max-width:600px){{.pricing-tiers{{grid-template-columns:1fr!important;}} .pricing-tiers>div{{transform:none!important;}}}}</style>'''

for fpath, cfg in notes_config.items():
    content = read(fpath)
    changed = False
    
    # Add pricing-tiers CSS if not present
    if 'pricing-tiers' not in content:
        # Replace hero price section
        if HERO_PRICE_START in content and 'Get Free Chapter First' in content:
            # Find start position
            s = content.find(HERO_PRICE_START)
            # Find end position - after "Get Free Chapter First</a>\n      </div>"
            e_marker = 'Get Free Chapter First</a>'
            e = content.find(e_marker, s)
            if e != -1:
                # Find the closing </div> after that marker
                e_end = content.find('</div>', e + len(e_marker))
                if e_end != -1:
                    e_end = e_end + len('</div>')
                    # Build the replacement block
                    decoy_block = build_decoy_pricing_block(cfg['payhip'])
                    content = content[:s] + decoy_block + '\n      ' + content[e_end:]
                    changed = True
                    print(f"    Hero price section replaced in {fpath.split('/')[-2]}/")
    
    # Add social proof counter to hero (if not already there from above)
    # (already included in decoy block)
    
    # Fix mob-cta link if pointing to wrong payhip
    if 'class="mob-cta"' in content and 'payhip.com/THENCAHUB' in content:
        if cfg['payhip'] != 'https://payhip.com/THENCAHUB':
            content = content.replace(
                '<a href="https://payhip.com/THENCAHUB" class="mob-cta"',
                f'<a href="{cfg["payhip"]}" class="mob-cta"'
            )
    
    # Add Anum testimonial before bottom CTA "Get My Notes →" 
    bottom_cta_old = '">Get My Notes &#x2192;</a>\n  </div>\n</section>'
    bottom_cta_new = f'">{ANUM_TESTIMONIAL}\nGet My Notes &#x2192;</a>\n  </div>\n</section>'
    # Actually insert before the <a> tag
    # Find the bottom section button
    bottom_marker = '">\nGet My Notes &#x2192;</a>'
    if '<em style="font-style:italic;color:var(--g1);">$175 CAD</em>' in content:
        # This is the bottom CTA section
        bottom_btn_old = '<em style="font-style:italic;color:var(--g1);">$175 CAD</em> &middot; Instant access.</h2>\n    <a href='
        if bottom_btn_old not in content:
            # Try without &middot;
            bottom_btn_old2 = '<em style="font-style:italic;color:var(--g1);">$175 CAD</em>'
            if bottom_btn_old2 in content and ANUM_TESTIMONIAL not in content:
                # Find this in bottom section and add testimonial before the <a> link
                pos = content.rfind(bottom_btn_old2)  # Last occurrence = bottom section
                a_pos = content.find('<a href=', pos)
                if a_pos != -1 and a_pos < pos + 500:
                    content = content[:a_pos] + ANUM_TESTIMONIAL + '\n    ' + content[a_pos:]
                    changed = True
                    print(f"    Anum testimonial added to bottom CTA in {fpath.split('/')[-2]}/")
    
    # Add WA CSS and button
    if 'wa-float' not in content:
        content = content.replace('</style>', WA_CSS + '\n</style>', 1)
        if '</body>' in content:
            content = content.replace('</body>', WA_HTML + '\n</body>', 1)
        changed = True
    
    if changed:
        write(fpath, content)

# ─── NOTES/COMPLETE-BUNDLE ───────────────────────────────────────────────────
print("\n=== Tasks 4+5+6+8+10 on complete-bundle ===")
bundle_path = BASE + '/notes/complete-bundle/index.html'
content = read(bundle_path)

# Social proof counter - add before hero CTA
BUNDLE_HERO_CTA = '<a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:16px 44px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Get the Complete Bundle &#x2192;</a>'

if SOCIAL_PROOF not in content:
    # Add social proof before the first CTA in hero
    content = content.replace(
        '<div style="display:flex;gap:16px;flex-wrap:wrap;">\n      <a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:16px 44px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Get the Complete Bundle &#x2192;</a>',
        SOCIAL_PROOF + '\n    <div style="display:flex;gap:16px;flex-wrap:wrap;">\n      <a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:16px 44px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Get the Complete Bundle &#x2192;</a>',
        1
    )

# Add loss aversion, risk reversal, testimonial, BNPL before bundle CTA in bundle-cta section
BUNDLE_CTA_OLD = '<a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:18px 52px;font-family:var(--fb);font-size:.85rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;">Get the Complete Bundle &#x2192;</a>'

if ANUM_TESTIMONIAL not in content:
    content = content.replace(
        BUNDLE_CTA_OLD,
        LOSS_AVERSION + '\n      ' + RISK_REVERSAL + '\n      ' + ANUM_TESTIMONIAL + '\n      ' + BUNDLE_CTA_OLD + '\n      ' + BNPL
    )

# WA button
if 'wa-float' not in content:
    content = content.replace('</style>', WA_CSS + '\n</style>', 1)
    if '</body>' in content:
        content = content.replace('</body>', WA_HTML + '\n</body>', 1)

write(bundle_path, content)

# ─── NOTES/INDEX.HTML: Tasks 4+5+13 ─────────────────────────────────────────
print("\n=== Tasks 4+5+13 on notes/index.html ===")
nidx_path = BASE + '/notes/index.html'
content = read(nidx_path)

# Task 5: Social proof counter in hero (before "Browse My Notes →")
if SOCIAL_PROOF not in content:
    browse_btn = '<a href="/notes/" style="display:inline-flex;align-items:center;gap:8px;background:var(--g1);color:var(--void);padding:16px 44px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">Browse My Notes &#x2192;</a>'
    if browse_btn in content:
        content = content.replace(browse_btn, SOCIAL_PROOF + '\n        ' + browse_btn)
    else:
        # Try with Get My Notes variant
        browse_btn2 = '>Browse My Notes &#x2192;</a>'
        if browse_btn2 in content:
            pos = content.rfind('<a href', 0, content.find(browse_btn2) + len(browse_btn2))
            if pos != -1:
                content = content[:pos] + SOCIAL_PROOF + '\n        ' + content[pos:]

# Task 4: Anum testimonial before bundle CTA button in notes/index  
bundle_cta_notes = '>Get the Complete Bundle &#x2192;</a>'
if bundle_cta_notes in content and ANUM_TESTIMONIAL not in content:
    pos = content.rfind('<a href', 0, content.find(bundle_cta_notes) + len(bundle_cta_notes))
    if pos != -1:
        content = content[:pos] + ANUM_TESTIMONIAL + '\n    ' + content[pos:]

# Task 13: Decision tree before subject grid
SUBJ_GRID_MARKER = '<div class="subj-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;">'
DECISION_TREE = '''<div style="background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.15);border-left:3px solid var(--g1);padding:28px 32px;margin-bottom:48px;">
  <p style="font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;margin-bottom:16px;">Not sure where to start?</p>
  <div class="notes-decision" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;">
    <a href="#subjects" style="display:block;padding:20px;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);text-decoration:none;transition:all .3s;" onmouseover="this.style.background='rgba(201,168,76,.07)'" onmouseout="this.style.background='rgba(201,168,76,.03)'">
      <p style="font-family:var(--fd);font-size:1.1rem;color:var(--cream);margin-bottom:8px;">Sitting one subject</p>
      <p style="font-size:var(--sm);color:var(--fog);font-family:var(--fb);line-height:1.6;">Choose the specific subject notes below &#x2192; $175 CAD</p>
    </a>
    <a href="/notes/complete-bundle/" style="display:block;padding:20px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);text-decoration:none;transition:all .3s;" onmouseover="this.style.background='rgba(201,168,76,.1)'" onmouseout="this.style.background='rgba(201,168,76,.06)'">
      <p style="font-family:var(--fd);font-size:1.1rem;color:var(--cream);margin-bottom:8px;">Sitting multiple subjects &#x2B50;</p>
      <p style="font-size:var(--sm);color:var(--fog);font-family:var(--fb);line-height:1.6;">Complete bundle &#x2014; all 5 subjects &#x2192; best value</p>
    </a>
    <a href="/#readiness" style="display:block;padding:20px;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);text-decoration:none;transition:all .3s;" onmouseover="this.style.background='rgba(201,168,76,.07)'" onmouseout="this.style.background='rgba(201,168,76,.03)'">
      <p style="font-family:var(--fd);font-size:1.1rem;color:var(--cream);margin-bottom:8px;">Not sure what I need</p>
      <p style="font-size:var(--sm);color:var(--fog);font-family:var(--fb);line-height:1.6;">Take the free readiness score &#x2192; get a recommendation</p>
    </a>
  </div>
</div>
<style>@media(max-width:768px){.notes-decision{grid-template-columns:1fr!important;}}</style>
'''

if 'notes-decision' not in content and SUBJ_GRID_MARKER in content:
    content = content.replace(SUBJ_GRID_MARKER, DECISION_TREE + '\n    ' + SUBJ_GRID_MARKER)

# WA button
if 'wa-float' not in content:
    content = content.replace('</style>', WA_CSS + '\n</style>', 1)
    if '</body>' in content:
        content = content.replace('</body>', WA_HTML + '\n</body>', 1)

write(nidx_path, content)

# ─── INDEX.HTML: Tasks 4+5+6+8+10 on pricing section ────────────────────────
print("\n=== Tasks 4+5+6+8+10 on index.html pricing section ===")
idx_path = BASE + '/index.html'
content = read(idx_path)

# Task 5: Social proof near top of pricing section
PRICING_INTRO = '<div class="pintro">'
SOCIAL_PROOF_IDX = '<p style="font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;margin-bottom:20px;text-align:center;">\u2713 Used by candidates in 12+ countries across all 5 NCA subjects</p>\n'

if SOCIAL_PROOF_IDX not in content and PRICING_INTRO in content:
    content = content.replace(PRICING_INTRO, SOCIAL_PROOF_IDX + PRICING_INTRO, 1)
    print("  Task 5: Social proof added to pricing section")

# Task 4: Anum testimonial before PC1 Get Notes button
PC1_BTN = '<a href="https://payhip.com/THENCAHUB" class="pb" aria-label="Get Notes Only plan" target="_blank" rel="noopener"><span>Get My Notes</span></a>'
if PC1_BTN in content and ANUM_TESTIMONIAL not in content:
    content = content.replace(PC1_BTN, ANUM_TESTIMONIAL + '\n        ' + PC1_BTN)
    print("  Task 4: Anum testimonial added before PC1 button")

# Task 6: Loss aversion below comparison table (after .proof-rows)
PROOF_ROWS_END = '<p class="urgency-line">'
LOSS_AVERSION_IDX = '<p style="font-size:var(--sm);color:var(--fog);text-align:center;margin-top:20px;font-family:var(--fb);line-height:1.8;">The cost of failing one subject and resitting: <strong style="color:var(--cream);">$500 CAD + taxes</strong> + <strong style="color:var(--cream);">3 months</strong> waiting for the next session. These notes cost <strong style="color:var(--cream);">$175 CAD</strong>.</p>\n'

if LOSS_AVERSION_IDX not in content and PROOF_ROWS_END in content:
    content = content.replace(PROOF_ROWS_END, LOSS_AVERSION_IDX + PROOF_ROWS_END, 1)
    print("  Task 6: Loss aversion added to pricing section")

# Task 10: Risk reversal below loss aversion
RISK_IDX = '<p style="font-size:var(--sm);color:var(--fog);text-align:center;font-family:var(--fb);line-height:1.8;margin-bottom:0;">If you sit your exam using these notes and don\'t pass, email <a href="mailto:hello@thencahub.com" style="color:var(--g1);text-decoration:none;">hello@thencahub.com</a> and we will send you the updated notes for your resit &#x2014; <strong style="color:var(--cream);">free.</strong></p>\n'

if RISK_IDX not in content and LOSS_AVERSION_IDX in content:
    content = content.replace(LOSS_AVERSION_IDX, LOSS_AVERSION_IDX + RISK_IDX)
    print("  Task 10: Risk reversal added to pricing section")

# Task 8: BNPL below PC1 button
BNPL_IDX = '<p style="font-size:.72rem;color:var(--dim);margin-top:8px;text-align:center;font-family:var(--fb);">Pay in 2 instalments available at checkout</p>\n'
if BNPL_IDX not in content and PC1_BTN in content:
    content = content.replace(PC1_BTN, PC1_BTN + '\n        ' + BNPL_IDX.strip())
    print("  Task 8: BNPL added below PC1 button")

write(idx_path, content)

