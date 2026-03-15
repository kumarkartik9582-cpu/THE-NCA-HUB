#!/usr/bin/env python3
"""
Sprint A — Critical Fixes
1. Fix index.html truncation: complete cookie banner, add mob-overlay HTML, close body/html
2. Fix mob-overlay JS: add stopPropagation, mobx handler
3. Add mobx close button to all 54 pages with mob-overlay
4. Fix about/index.html: add hamburger button and mob-overlay HTML
5. Add Samsung Internet CSS fallback
6. Fix #prog z-index conflict in index.html
7. Update build.js template
"""
import re, glob, os

# ──────────────────────────────────────────────────────────
# CONSTANTS
# ──────────────────────────────────────────────────────────

# The complete ending to append to index.html (after removing the truncated partial line)
# We need: complete cookie banner + mob-overlay HTML + </body></html>

COOKIE_BANNER = '''<div id="cookie-banner" role="dialog" aria-label="Cookie consent" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9500;background:rgba(5,5,8,.96);border:1px solid rgba(201,168,76,.18);padding:20px 28px;max-width:520px;width:calc(100% - 48px);backdrop-filter:blur(20px);font-family:var(--fb)">
  <p style="font-size:.78rem;color:var(--fog);line-height:1.6;margin-bottom:14px">We use cookies to improve your experience. By continuing, you agree to our <a href="/privacy/" style="color:var(--g1)">Privacy Policy</a>.</p>
  <button onclick="document.getElementById('cookie-banner').style.display='none';localStorage.setItem('ck','1')" style="background:var(--g1);color:var(--void);border:none;padding:9px 24px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Accept</button>
</div>
<script>if(!localStorage.getItem('ck'))document.getElementById('cookie-banner').style.display='block';</script>'''

# mob-overlay HTML for index.html (root page — uses relative /#method etc.)
MOB_OVERLAY_ROOT = '''
<!-- ═══ PREMIUM MOBILE MENU ═══ -->
<div class="mob-overlay" id="mob-overlay" aria-hidden="true" role="dialog" aria-label="Navigation">
  <div class="mob-ink" id="mob-ink"></div>
  <div class="mob-line"></div>
  <div class="mob-glow"></div>
  <canvas id="mob-particles" style="position:absolute;inset:0;pointer-events:none;opacity:.4;"></canvas>
  <div class="mob-deco" aria-hidden="true">NCA</div>
  <div class="mob-content">
    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>
    <nav aria-label="Mobile navigation">
      <div class="mob-item"><span class="mob-counter">01</span><a href="/#method" class="mob-link">Method</a></div>
      <div class="mob-item"><span class="mob-counter">02</span><a href="/#subjects" class="mob-link">Subjects</a></div>
      <div class="mob-item"><span class="mob-counter">03</span><a href="/notes/" class="mob-link" style="color:var(--g1);">Notes</a></div>
      <div class="mob-item"><span class="mob-counter">04</span><a href="/#pricing" class="mob-link">Pricing</a></div>
      <div class="mob-item"><span class="mob-counter">05</span><a href="/blog/" class="mob-link">Articles</a></div>
      <div class="mob-item"><span class="mob-counter">06</span><a href="/#sample" class="mob-link">Free Chapter</a></div>
      <div class="mob-item"><span class="mob-counter">07</span><a href="/nca-cost-calculator/" class="mob-link">Cost Calculator</a></div>
    </nav>
    <a href="https://payhip.com/THENCAHUB" class="mob-cta" target="_blank" rel="noopener noreferrer">Get the Notes &#x2192;</a>
    <div class="mob-utils">
      <a href="/nca-exam-dates-2026/">Exam Dates 2026</a>
      <a href="/nca-for-indian-lawyers/">Indian Lawyers Guide</a>
      <a href="/become-a-lawyer-in-ontario/">Qualify in Ontario</a>
      <a href="/#readiness">Readiness Score</a>
    </div>
  </div>
</div>'''

# mob-overlay HTML for non-root pages — uses absolute URLs
MOB_OVERLAY_NONROOT = '''
<!-- ═══ PREMIUM MOBILE MENU ═══ -->
<div class="mob-overlay" id="mob-overlay" aria-hidden="true" role="dialog" aria-label="Navigation">
  <div class="mob-ink" id="mob-ink"></div>
  <div class="mob-line"></div>
  <div class="mob-glow"></div>
  <canvas id="mob-particles" style="position:absolute;inset:0;pointer-events:none;opacity:.4;"></canvas>
  <div class="mob-deco" aria-hidden="true">NCA</div>
  <div class="mob-content">
    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>
    <nav aria-label="Mobile navigation">
      <div class="mob-item"><span class="mob-counter">01</span><a href="https://www.thencahub.com/#method" class="mob-link">Method</a></div>
      <div class="mob-item"><span class="mob-counter">02</span><a href="https://www.thencahub.com/#subjects" class="mob-link">Subjects</a></div>
      <div class="mob-item"><span class="mob-counter">03</span><a href="https://www.thencahub.com/notes/" class="mob-link" style="color:var(--g1);">Notes</a></div>
      <div class="mob-item"><span class="mob-counter">04</span><a href="https://www.thencahub.com/#pricing" class="mob-link">Pricing</a></div>
      <div class="mob-item"><span class="mob-counter">05</span><a href="https://www.thencahub.com/blog/" class="mob-link">Articles</a></div>
      <div class="mob-item"><span class="mob-counter">06</span><a href="https://www.thencahub.com/#sample" class="mob-link">Free Chapter</a></div>
      <div class="mob-item"><span class="mob-counter">07</span><a href="https://www.thencahub.com/nca-cost-calculator/" class="mob-link">Cost Calculator</a></div>
    </nav>
    <a href="https://payhip.com/THENCAHUB" class="mob-cta" target="_blank" rel="noopener noreferrer">Get the Notes &#x2192;</a>
    <div class="mob-utils">
      <a href="https://www.thencahub.com/nca-exam-dates-2026/">Exam Dates 2026</a>
      <a href="https://www.thencahub.com/nca-for-indian-lawyers/">Indian Lawyers Guide</a>
      <a href="https://www.thencahub.com/become-a-lawyer-in-ontario/">Qualify in Ontario</a>
      <a href="https://www.thencahub.com/#readiness">Readiness Score</a>
    </div>
  </div>
</div>'''

# The mob-x CSS to add (if not already present)
MOB_X_CSS = '''.mob-x{position:absolute;top:20px;right:20px;width:44px;height:44px;background:none;border:none;color:var(--fog);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .3s;z-index:10;}.mob-x:hover{color:var(--g1);}'''

# Samsung Internet CSS fallback to add after .mob-overlay CSS
SAMSUNG_CSS = '''@supports not (clip-path: circle(0%)){
  .mob-ink{clip-path:none!important;opacity:0;transition:opacity .5s ease;}
  .mob-overlay.open .mob-ink{opacity:1;}
}
@supports not (backdrop-filter: blur(1px)){
  .mob-overlay .mob-ink{background:rgba(2,2,4,0.99);}
}'''

# The correct mobile menu IIFE for index.html
MOBILE_MENU_IIFE_INDEX = '''/* MOBILE MENU */
(function(){
  var BTN=document.getElementById('nh');
  var OV=document.getElementById('mob-overlay');
  var MOBX=document.getElementById('mobx');
  if(!BTN||!OV)return;
  var isOpen=false;
  function openMenu(){isOpen=true;OV.classList.add('open');OV.setAttribute('aria-hidden','false');BTN.classList.add('active');BTN.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';if(navigator.vibrate)navigator.vibrate(10);}
  function closeMenu(){isOpen=false;OV.classList.remove('open');OV.setAttribute('aria-hidden','true');BTN.classList.remove('active');BTN.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  BTN.addEventListener('click',function(e){e.stopPropagation();isOpen?closeMenu():openMenu();});
  if(MOBX)MOBX.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
  OV.querySelectorAll('.mob-link').forEach(function(a){
    a.addEventListener('click',function(){var href=a.getAttribute('href')||'';if(!href.startsWith('http'))closeMenu();else setTimeout(closeMenu,100);});
  });
  OV.querySelectorAll('.mob-link').forEach(function(link){
    link.addEventListener('mousemove',function(e){var r=link.getBoundingClientRect();var x=((e.clientX-r.left)/r.width-.5)*8;var y=((e.clientY-r.top)/r.height-.5)*4;link.style.transform='translate('+x+'px,'+y+'px)';});
    link.addEventListener('mouseleave',function(){link.style.transform='';});
  });
})();'''

# Updated mobile menu IIFE for non-root pages (same logic)
MOBILE_MENU_IIFE_OTHER = '''/* MOBILE MENU */
(function(){
  var BTN=document.getElementById('nh');
  var OV=document.getElementById('mob-overlay');
  var MOBX=document.getElementById('mobx');
  if(!BTN||!OV)return;
  var isOpen=false;
  function openMenu(){isOpen=true;OV.classList.add('open');OV.setAttribute('aria-hidden','false');BTN.classList.add('active');BTN.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';if(navigator.vibrate)navigator.vibrate(10);}
  function closeMenu(){isOpen=false;OV.classList.remove('open');OV.setAttribute('aria-hidden','true');BTN.classList.remove('active');BTN.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  BTN.addEventListener('click',function(e){e.stopPropagation();isOpen?closeMenu():openMenu();});
  if(MOBX)MOBX.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
  OV.querySelectorAll('.mob-link').forEach(function(a){
    a.addEventListener('click',function(){var href=a.getAttribute('href')||'';if(!href.startsWith('http'))closeMenu();else setTimeout(closeMenu,100);});
  });
  OV.querySelectorAll('.mob-link').forEach(function(link){
    link.addEventListener('mousemove',function(e){var r=link.getBoundingClientRect();var x=((e.clientX-r.left)/r.width-.5)*8;var y=((e.clientY-r.top)/r.height-.5)*4;link.style.transform='translate('+x+'px,'+y+'px)';});
    link.addEventListener('mouseleave',function(){link.style.transform='';});
  });
})();'''


# ──────────────────────────────────────────────────────────
# FIX INDEX.HTML
# ──────────────────────────────────────────────────────────

def fix_index_html():
    with open('index.html', 'r') as f:
        html = f.read()

    changed = []

    # ── 1. Fix truncation: remove the partial cookie banner line and replace
    # The file ends with: ...cookie consent banner comment\n<div id="cookie-banner" ...>\n  <p style="fon
    # We strip everything from "<!-- ═══════════════════════════════════════════════════" onward
    # and replace with the complete cookie banner + mob-overlay + close tags
    COOKIE_COMMENT = '<!-- ═══════════════════════════════════════════════════'
    if COOKIE_COMMENT in html:
        idx = html.index(COOKIE_COMMENT)
        html = html[:idx].rstrip()
        html += '\n\n'
        html += COOKIE_BANNER
        html += '\n'
        html += MOB_OVERLAY_ROOT
        html += '\n\n</body>\n</html>\n'
        changed.append('index.html: Fixed truncation, added cookie banner, mob-overlay HTML, closed body/html')
    else:
        print('  WARNING: Could not find cookie comment truncation point in index.html')

    # ── 2. Fix #prog z-index: change from 9100 to 9050
    if 'z-index:9100;width:0' in html:
        html = html.replace('z-index:9100;width:0', 'z-index:9050;width:0', 1)
        changed.append('index.html: Fixed #prog z-index from 9100 to 9050')

    # ── 3. Add mob-x CSS after .mob-overlay CSS (if not already there)
    if 'mob-x' not in html and '.mob-overlay.open .mob-deco' in html:
        html = html.replace('.mob-counter{', MOB_X_CSS + '\n.mob-counter{', 1)
        changed.append('index.html: Added .mob-x CSS')

    # ── 4. Add Samsung Internet CSS (after .mob-overlay CSS block ends)
    if '@supports not (clip-path' not in html:
        if '.mob-counter{' in html:
            idx = html.index('.mob-counter{')
            end_idx = html.index('}', idx) + 1
            html = html[:end_idx] + '\n' + SAMSUNG_CSS + html[end_idx:]
            changed.append('index.html: Added Samsung Internet CSS fallbacks')

    # ── 5. Update the mobile menu IIFE (add stopPropagation + mobx handler)
    # Pattern: the existing IIFE starting with "/* MOBILE MENU */"
    old_iife_pat = r'/\* MOBILE MENU \*/\s*\(function\(\)\{.*?\}\)\(\);'
    m = re.search(old_iife_pat, html, re.DOTALL)
    if m:
        html = html[:m.start()] + MOBILE_MENU_IIFE_INDEX + html[m.end():]
        changed.append('index.html: Updated mobile menu IIFE (added stopPropagation + mobx handler)')
    else:
        print('  WARNING: Could not find mobile menu IIFE in index.html to update')

    with open('index.html', 'w') as f:
        f.write(html)

    for c in changed:
        print(f'  ✅ {c}')


# ──────────────────────────────────────────────────────────
# ADD MOBX BUTTON TO ALL PAGES WITH MOB-OVERLAY
# ──────────────────────────────────────────────────────────

def add_mobx_to_page(filepath):
    with open(filepath, 'r') as f:
        html = f.read()

    changed = []

    # Add mobx button as first child of mob-content (if not already there)
    if 'id="mobx"' not in html and 'id=\'mobx\'' not in html:
        # Find mob-content div and insert button as first child
        MOB_CONTENT_OPEN = '<div class="mob-content">'
        if MOB_CONTENT_OPEN in html:
            mobx_btn = '\n    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>'
            html = html.replace(MOB_CONTENT_OPEN, MOB_CONTENT_OPEN + mobx_btn, 1)
            changed.append(f'{filepath}: Added mobx close button')
        else:
            print(f'  WARNING: Could not find mob-content in {filepath}')

    # Add mob-x CSS if not present
    if 'mob-x' not in html and '.mob-counter{' in html:
        html = html.replace('.mob-counter{', MOB_X_CSS + '\n.mob-counter{', 1)
        changed.append(f'{filepath}: Added .mob-x CSS')
    elif 'mob-x' not in html and '.mob-counter {' in html:
        html = html.replace('.mob-counter {', MOB_X_CSS + '\n.mob-counter {', 1)
        changed.append(f'{filepath}: Added .mob-x CSS')

    # Update mobile menu IIFE to add mobx handler (if doesn't already have it)
    if 'MOBX' not in html:
        old_iife_pat = r'/\* MOBILE MENU \*/\s*\(function\(\)\{.*?\}\)\(\);'
        m = re.search(old_iife_pat, html, re.DOTALL)
        if m:
            html = html[:m.start()] + MOBILE_MENU_IIFE_OTHER + html[m.end():]
            changed.append(f'{filepath}: Updated mobile menu IIFE with mobx handler')
        else:
            # Try alternate patterns for blog article pages
            # Pattern: "// Mobile nav" or "// mobile menu" section
            old_nav_pat = r'// Mobile nav\s*var nh=.*?if\(mob\)mob\.querySelectorAll\(\'a\'\)\.forEach\(function\(a\)\{a\.addEventListener\(\'click\',function\(\)\{mob\.classList\.remove\(\'op\'\)\}\)\}\);'
            m2 = re.search(old_nav_pat, html, re.DOTALL)
            if m2:
                html = html[:m2.start()] + MOBILE_MENU_IIFE_OTHER + html[m2.end():]
                changed.append(f'{filepath}: Updated alternate mobile menu handler with mobx')
            else:
                print(f'  WARNING: Could not find mobile menu IIFE to update in {filepath}')

    # Add Samsung Internet CSS
    if '@supports not (clip-path' not in html:
        if '.mob-counter{' in html:
            idx = html.index('.mob-counter{')
            end_idx = html.index('}', idx) + 1
            html = html[:end_idx] + '\n' + SAMSUNG_CSS + html[end_idx:]
            changed.append(f'{filepath}: Added Samsung Internet CSS')

    with open(filepath, 'w') as f:
        f.write(html)

    if changed:
        for c in changed:
            print(f'  ✅ {c}')
    return len(changed)


# ──────────────────────────────────────────────────────────
# FIX ABOUT/INDEX.HTML
# ──────────────────────────────────────────────────────────

def fix_about_page():
    filepath = 'about/index.html'
    with open(filepath, 'r') as f:
        html = f.read()

    changed = []

    # 1. Add hamburger button to nav if missing
    if 'id="nh"' not in html:
        # Find the nav closing pattern - after the "Get My Score" CTA button or similar
        # The nav typically ends with: </a>\n</nav>
        # Or it might be: </a></nav>
        # Look for the nav close button area
        NAV_CLOSE_PATTERNS = [
            ('class="nc"', '</a>\n</nav>'),
            ('class="nc"', '</a>\n</nav>'),
        ]
        # Find </nav> after class="nc"
        nc_idx = html.find('class="nc"')
        if nc_idx != -1:
            nav_end = html.find('</nav>', nc_idx)
            if nav_end != -1:
                hamburger = '\n  <button class="nh" id="nh" aria-label="Open navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>'
                html = html[:nav_end] + hamburger + '\n' + html[nav_end:]
                changed.append(f'{filepath}: Added hamburger button to nav')

    # 2. Add mob-overlay HTML before </body>
    if 'id="mob-overlay"' not in html and '</body>' in html:
        html = html.replace('</body>', MOB_OVERLAY_NONROOT + '\n\n</body>', 1)
        changed.append(f'{filepath}: Added mob-overlay HTML')

    # 3. Add mobx button inside mob-content (if mob-overlay was just added)
    if 'id="mobx"' not in html and '<div class="mob-content">' in html:
        mobx_btn = '\n    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>'
        html = html.replace('<div class="mob-content">', '<div class="mob-content">' + mobx_btn, 1)
        changed.append(f'{filepath}: Added mobx close button')

    # 4. Add mob-x CSS
    if 'mob-x' not in html and '.mob-counter{' in html:
        html = html.replace('.mob-counter{', MOB_X_CSS + '\n.mob-counter{', 1)
        changed.append(f'{filepath}: Added .mob-x CSS')

    # 5. Add/update mobile menu IIFE
    if 'id="mob-overlay"' in html:
        if 'MOBX' not in html:
            old_iife_pat = r'/\* MOBILE MENU \*/\s*\(function\(\)\{.*?\}\)\(\);'
            m = re.search(old_iife_pat, html, re.DOTALL)
            if m:
                html = html[:m.start()] + MOBILE_MENU_IIFE_OTHER + html[m.end():]
                changed.append(f'{filepath}: Updated mobile menu IIFE with mobx handler')
            elif '</script>' in html:
                # Add before last </script>
                last_script = html.rfind('</script>')
                html = html[:last_script] + '\n' + MOBILE_MENU_IIFE_OTHER + '\n' + html[last_script:]
                changed.append(f'{filepath}: Added mobile menu IIFE before last </script>')

    # 6. Samsung CSS
    if '@supports not (clip-path' not in html:
        if '.mob-counter{' in html:
            idx = html.index('.mob-counter{')
            end_idx = html.index('}', idx) + 1
            html = html[:end_idx] + '\n' + SAMSUNG_CSS + html[end_idx:]
            changed.append(f'{filepath}: Added Samsung Internet CSS')

    with open(filepath, 'w') as f:
        f.write(html)

    if changed:
        for c in changed:
            print(f'  ✅ {c}')
    return len(changed)


# ──────────────────────────────────────────────────────────
# UPDATE BUILD.JS TEMPLATE
# ──────────────────────────────────────────────────────────

def fix_build_js():
    with open('build.js', 'r') as f:
        content = f.read()

    changed = []

    # 1. Add mobx button to the mob-overlay HTML in the template
    if 'id="mobx"' not in content:
        MOB_CONTENT_OPEN = '<div class="mob-content">'
        if MOB_CONTENT_OPEN in content:
            mobx_btn = '\n    <button class=\\"mob-x\\" id=\\"mobx\\" aria-label=\\"Close navigation menu\\">&#x2715;</button>'
            # In build.js the HTML is in a template literal, so we just replace directly
            content = content.replace(MOB_CONTENT_OPEN, MOB_CONTENT_OPEN + '\n    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>', 1)
            changed.append('build.js: Added mobx close button to template')

    # 2. Update the mobile menu IIFE in build.js template
    if 'MOBX' not in content:
        old_iife_pat = r'// Mobile menu\s*var BTN=document\.getElementById\(\'nh\'\);\s*var OVERLAY=document\.getElementById\(\'mob-overlay\'\);.*?\}\s*\}'
        m = re.search(old_iife_pat, content, re.DOTALL)
        if m:
            new_iife = '''// Mobile menu
  var BTN=document.getElementById('nh');
  var OV=document.getElementById('mob-overlay');
  var MOBX=document.getElementById('mobx');
  if(BTN&&OV){
    var isOpen=false;
    function openMenu(){isOpen=true;OV.classList.add('open');OV.setAttribute('aria-hidden','false');BTN.classList.add('active');BTN.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';if(navigator.vibrate)navigator.vibrate(10);}
    function closeMenu(){isOpen=false;OV.classList.remove('open');OV.setAttribute('aria-hidden','true');BTN.classList.remove('active');BTN.setAttribute('aria-expanded','false');document.body.style.overflow='';}
    BTN.addEventListener('click',function(e){e.stopPropagation();isOpen?closeMenu():openMenu();});
    if(MOBX)MOBX.addEventListener('click',closeMenu);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
    OV.querySelectorAll('.mob-link').forEach(function(a){a.addEventListener('click',function(){var href=a.getAttribute('href')||'';if(!href.startsWith('http'))closeMenu();else setTimeout(closeMenu,100);});});
    OV.querySelectorAll('.mob-link').forEach(function(link){link.addEventListener('mousemove',function(e){var r=link.getBoundingClientRect();var x=((e.clientX-r.left)/r.width-.5)*8;var y=((e.clientY-r.top)/r.height-.5)*4;link.style.transform='translate('+x+'px,'+y+'px)';});link.addEventListener('mouseleave',function(){link.style.transform='';});});
  }'''
            content = content[:m.start()] + new_iife + content[m.end():]
            changed.append('build.js: Updated mobile menu IIFE with mobx handler and stopPropagation')

    # 3. Add mob-x CSS to build.js template
    if '.mob-x{' not in content and '.mob-counter{' in content:
        content = content.replace('.mob-counter{', MOB_X_CSS + '\n.mob-counter{', 1)
        changed.append('build.js: Added .mob-x CSS to template')

    # 4. Add Samsung CSS to build.js template
    if '@supports not (clip-path' not in content and '.mob-counter{' in content:
        idx = content.index('.mob-counter{')
        end_idx = content.index('}', idx) + 1
        content = content[:end_idx] + '\n' + SAMSUNG_CSS + content[end_idx:]
        changed.append('build.js: Added Samsung Internet CSS to template')

    with open('build.js', 'w') as f:
        f.write(content)

    if changed:
        for c in changed:
            print(f'  ✅ {c}')
    return len(changed)


# ──────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────

print('\n══════════════════════════════════')
print(' Sprint A — Critical Fixes')
print('══════════════════════════════════\n')

# Step 1: Fix index.html
print('Step 1: Fixing index.html...')
fix_index_html()

# Step 2: Fix all pages with mob-overlay but no mobx
print('\nStep 2: Adding mobx close button to all pages...')
all_html = sorted(glob.glob('**/*.html', recursive=True))
fixed_count = 0
skip_count = 0
for filepath in all_html:
    if filepath == 'index.html':
        continue  # Already handled
    with open(filepath, 'r') as f:
        content = f.read()
    if 'id="mob-overlay"' in content or "id='mob-overlay'" in content:
        n = add_mobx_to_page(filepath)
        fixed_count += n
    else:
        skip_count += 1

print(f'\n  Fixed {fixed_count} items across pages, skipped {skip_count} pages without mob-overlay')

# Step 3: Fix about/index.html
print('\nStep 3: Fixing about/index.html...')
fix_about_page()

# Step 4: Update build.js
print('\nStep 4: Updating build.js template...')
fix_build_js()

# ──────────────────────────────────────────────────────────
# VERIFICATION
# ──────────────────────────────────────────────────────────
print('\n══════════════════════════════════')
print(' Verification')
print('══════════════════════════════════\n')

import subprocess

def grep_count(pattern, files='**/*.html'):
    result = subprocess.run(
        ['python3', '-c', f'''
import glob, re
count = 0
matched_files = []
for f in sorted(glob.glob("{files}", recursive=True)):
    with open(f) as fp:
        c = fp.read()
    matches = re.findall(r"""{pattern}""", c)
    if matches:
        count += len(matches)
        matched_files.append(f)
print(count, matched_files[:5])
'''],
        capture_output=True, text=True
    )
    return result.stdout.strip()

# Check index.html specifically
with open('index.html') as f:
    idx = f.read()

nh_key = "getElementById('nh')"
mob_id = 'id="mob-overlay"'
mobx_id = 'id="mobx"'
mob_css = '.mob{'
mob_overlay_css = '.mob-overlay{'
prog_z = 'z-index:9050;width:0'
samsung_css_check = '@supports not (clip-path'
mobx_var = 'var MOBX'
stop_prop = 'e.stopPropagation()'

print(f"index.html getElementById('nh') count: {idx.count(nh_key)}")
print(f"index.html id=\"mob-overlay\" count: {idx.count(mob_id)}")
print(f"index.html id=\"mobx\" count: {idx.count(mobx_id)}")
print(f"index.html .mob{{  count: {idx.count(mob_css)} (should be 0)")
print(f"index.html .mob-overlay{{  count: {idx.count(mob_overlay_css)} (should be 1)")
print(f"index.html ends with </html>: {'</html>' in idx}")
print(f"index.html cdn-cgi count: {idx.count('cdn-cgi')} (should be 0)")
print(f"index.html #prog z-index:9050: {prog_z in idx}")
print(f"index.html 8000 safety fallback: {'8000' in idx}")
print(f"index.html Samsung CSS present: {samsung_css_check in idx}")
print(f"index.html mobx handler (MOBX): {mobx_var in idx}")
print(f"index.html stopPropagation: {stop_prop in idx}")

# Check for any remaining cdn-cgi across all pages
cdn_count = sum(1 for f in glob.glob('**/*.html', recursive=True)
                if 'cdn-cgi' in open(f).read())
print(f"\ncdn-cgi occurrences across all HTML: {cdn_count} (should be 0)")

# Check mobx presence across all pages with mob-overlay
import glob as glb
pages_with_overlay = [f for f in sorted(glb.glob('**/*.html', recursive=True))
                      if 'id="mob-overlay"' in open(f).read()]
pages_without_mobx = [f for f in pages_with_overlay
                      if 'id="mobx"' not in open(f).read()]
print(f"\nPages with mob-overlay: {len(pages_with_overlay)}")
print(f"Pages with mob-overlay but WITHOUT mobx: {len(pages_without_mobx)}")
if pages_without_mobx:
    for f in pages_without_mobx:
        print(f"  MISSING mobx: {f}")

print('\n✅ Script complete.\n')
