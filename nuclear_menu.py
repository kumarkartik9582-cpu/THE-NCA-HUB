#!/usr/bin/env python3
"""Nuclear mobile menu replacement for all pages."""
import re, glob, os

ROOT = '/home/user/THE-NCA-HUB'

# Nuclear CSS replacement
NUCLEAR_CSS = '''.nh{position:relative;width:44px;height:44px;display:none;align-items:center;justify-content:center;flex-direction:column;gap:6px;background:none;border:none;cursor:pointer;padding:0;margin-left:8px;z-index:9200;flex-shrink:0;}
@media(max-width:960px){.nh{display:flex;}}
.nh span{display:block;width:24px;height:1.5px;background:var(--cream);transform-origin:center;transition:transform .4s ease,opacity .3s,background .3s;}
.nh span:nth-child(2){width:16px;}
.nh.open span:nth-child(1){transform:translateY(7.5px) rotate(45deg);background:var(--g1);}
.nh.open span:nth-child(2){opacity:0;}
.nh.open span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);background:var(--g1);}
#mob-overlay{position:fixed;inset:0;background:rgba(2,2,4,.97);z-index:9100;display:none;flex-direction:column;justify-content:center;padding:70px 48px 48px;overflow-y:auto;}
#mob-overlay.open{display:flex;}
#mob-overlay a{display:block;font-family:var(--fd);font-size:clamp(1.4rem,5vw,2rem);font-weight:300;color:var(--fog);text-decoration:none;padding:16px 0;border-bottom:1px solid rgba(201,168,76,.07);transition:color .3s;}
#mob-overlay a.mob-cta-link{color:var(--g1);}
#mob-overlay a:hover{color:var(--cream);}
.mob-shop-btn{display:inline-flex!important;align-items:center;margin-top:28px;background:var(--g1)!important;color:var(--void)!important;padding:14px 36px;font-family:var(--fb)!important;font-size:.82rem!important;font-weight:700;letter-spacing:.1em;text-transform:uppercase;align-self:flex-start;border:none!important;}
#mob-close{position:absolute;top:22px;right:24px;background:none;border:none;color:var(--g1);font-size:1.3rem;cursor:pointer;padding:8px;z-index:1;}'''

# Nuclear HTML
NUCLEAR_HTML = '''<div id="mob-overlay" aria-hidden="true" aria-label="Navigation" role="dialog">
  <button id="mob-close" aria-label="Close navigation menu">&#x2715;</button>
  <a href="https://www.thencahub.com/#method">Method</a>
  <a href="https://www.thencahub.com/#subjects">Subjects</a>
  <a href="https://www.thencahub.com/notes/" class="mob-cta-link">Notes</a>
  <a href="https://www.thencahub.com/#pricing">Pricing</a>
  <a href="https://www.thencahub.com/blog/">Articles</a>
  <a href="https://www.thencahub.com/#sample">Free Chapter</a>
  <a href="https://www.thencahub.com/nca-cost-calculator/">Cost Calculator</a>
  <a href="https://www.thencahub.com/faq/">FAQ</a>
  <a href="https://payhip.com/THENCAHUB" class="mob-shop-btn" target="_blank" rel="noopener noreferrer">Shop Now &rarr;</a>
</div>'''

# Nuclear JS
NUCLEAR_JS = '''<script>
(function(){
  var btn=document.getElementById('nh');
  var overlay=document.getElementById('mob-overlay');
  var closeBtn=document.getElementById('mob-close');
  if(!btn||!overlay){console.warn('Menu elements not found');return;}
  function openMenu(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');btn.classList.add('open');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
  function closeMenu(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');btn.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  btn.addEventListener('click',function(e){e.stopPropagation();overlay.classList.contains('open')?closeMenu():openMenu();});
  if(closeBtn)closeBtn.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  overlay.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){if(!a.href.includes('payhip'))closeMenu();});});
  overlay.addEventListener('click',function(e){if(e.target===overlay)closeMenu();});
})();
</script>'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Replace old mobile menu CSS
    # Find and replace the mob-overlay/mob-ink CSS block
    # Pattern: everything from .mob-overlay CSS start to just before the nav css or @media for mob
    # We look for the block that has mob-ink with clip-path
    if '.mob-ink{' in content and 'clip-path:circle' in content:
        # Replace all the old mobile menu CSS lines
        # Find start: .mob-overlay{position:fixed...pointer-events:none
        # Find end: before nav{ or before some other non-mob CSS
        css_pattern = re.compile(
            r'\.mob-overlay\{position:fixed;inset:0;z-index:9100;pointer-events:none.*?(?=nav\{|\.nl\{|footer\{|@media\(min-width)',
            re.DOTALL
        )
        new_content = css_pattern.sub(NUCLEAR_CSS + '\n', content)
        if new_content != content:
            content = new_content
        else:
            # Try a more aggressive approach: find and remove the old CSS block
            # and insert nuclear CSS at the same position
            start_marker = '.mob-overlay{position:fixed;inset:0;z-index:9100;pointer-events:none;overflow:hidden;}'
            if start_marker in content:
                idx = content.find(start_marker)
                # Find end of the mobile CSS block (look for next unrelated CSS)
                # Simple approach: replace known old CSS patterns
                old_css_lines = [
                    '.mob-overlay{position:fixed;inset:0;z-index:9100;pointer-events:none;overflow:hidden;}',
                    '.mob-ink{position:absolute;inset:0;background:rgba(2,2,4,.97);clip-path:circle(0% at calc(100% - 44px) 44px);transition:clip-path .7s cubic-bezier(.16,1,.3,1);will-change:clip-path;}',
                    '.mob-overlay.open .mob-ink{clip-path:circle(150% at calc(100% - 44px) 44px);}',
                ]
                for old_css in old_css_lines:
                    content = content.replace(old_css, '', 1)
                # Insert nuclear CSS before nav{
                idx_nav = content.find('nav{')
                if idx_nav > 0:
                    content = content[:idx_nav] + NUCLEAR_CSS + '\n' + content[idx_nav:]
    
    # Also handle the alternate formatting
    if '.mob-overlay{position:fixed;inset:0;z-index:9100;pointer-events:none;' in content:
        # Try alternative approach - pattern match for the full CSS block
        css_block_pattern = re.compile(
            r'\.mob-overlay\{position:fixed;inset:0;z-index:9100;pointer-events:none;[^\}]+\}[\s\S]*?(?=\bnav\b\{)',
            re.DOTALL
        )
        new_content = css_block_pattern.sub(NUCLEAR_CSS + '\n', content)
        if new_content != content:
            content = new_content
    
    # 2. Replace old mob-overlay HTML
    # Pattern: <div class="mob-overlay" ...> ... </div>\n\n<a href (wa-float) 
    mob_html_pattern = re.compile(
        r'<div class="mob-overlay" id="mob-overlay"[^>]*>[\s\S]*?</div>\s*\n(?=\s*<a[^>]*wa-float|\s*<script>(?:\s*if\(\'serviceWorker|\s*\())',
        re.DOTALL
    )
    new_content = mob_html_pattern.sub(NUCLEAR_HTML + '\n', content)
    if new_content != content:
        content = new_content
    
    # Also handle: <div class="mob-overlay" ...> ... </div> followed by any pattern
    if '<div class="mob-overlay" id="mob-overlay"' in content:
        # Find the div and its entire content
        start = content.find('<div class="mob-overlay" id="mob-overlay"')
        if start >= 0:
            # Find the matching closing </div>
            # Count div depth
            depth = 0
            i = start
            while i < len(content):
                if content[i:i+4] == '<div':
                    depth += 1
                elif content[i:i+6] == '</div>':
                    depth -= 1
                    if depth == 0:
                        end = i + 6
                        # Replace the whole block
                        content = content[:start] + NUCLEAR_HTML + content[end:]
                        break
                i += 1
    
    # 3. Replace old mob-overlay JS (the IIFE with openMenu/closeMenu)
    # Find the script block that has the mobile menu JS
    old_js_pattern = re.compile(
        r'\(function\(\)\{[^}]*var OV=document\.getElementById\(\'mob-overlay\'\);[\s\S]*?(?:\}\)\(\);)',
        re.DOTALL
    )
    
    # Check if nuclear JS already present
    if 'function openMenu()' not in content and 'var btn=document.getElementById(\'nh\')' not in content:
        new_content = old_js_pattern.sub('', content)
        if new_content != content:
            content = new_content
            # Add nuclear JS before the service worker or closing body
            insert_before = '<script>\nif(\'serviceWorker\''
            if insert_before not in content:
                insert_before = '</body>'
            content = content.replace(insert_before, NUCLEAR_JS + '\n' + insert_before, 1)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Process all files
files = glob.glob(ROOT + '/**/*.html', recursive=True)
files = [f for f in files if '.git' not in f]

# Filter to files with old mobile menu
target_files = [f for f in files if 'mob-ink' in open(f, encoding='utf-8').read() 
                and 'sprint' not in f.lower() and 'create_sprint' not in f.lower()]

print(f'Processing {len(target_files)} files...')
updated = 0
failed = []
for f in target_files:
    try:
        if process_file(f):
            updated += 1
            print(f'Updated: {f.replace(ROOT+"/","")}')
        else:
            failed.append(f.replace(ROOT+"/",""))
    except Exception as e:
        failed.append(f'{f.replace(ROOT+"/","")}: {e}')

print(f'\nUpdated: {updated}/{len(target_files)}')
if failed:
    print(f'Failed/no-change: {len(failed)}')
    for f in failed[:10]:
        print(f'  - {f}')
