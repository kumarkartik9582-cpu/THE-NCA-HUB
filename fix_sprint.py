#!/usr/bin/env python3
"""Comprehensive fix sprint for THE NCA HUB."""
import re, os

BASE = '/home/user/THE-NCA-HUB'

# ── Shared content blocks ──────────────────────────────────────────────────────

ROOT_CSS = """:root{--void:#020204;--abyss:#050508;--deep:#080810;--dark:#0D0D18;--surf:#121220;--g0:#F0D878;--g1:#C9A84C;--g2:#9E7B30;--g3:#4E3A14;--glow:rgba(201,168,76,.11);--glow3:rgba(201,168,76,.025);--cream:#EDE5CE;--fog:#998E7C;--dim:#6B6257;--fd:'Cormorant Garamond',Georgia,serif;--fb:'Bricolage Grotesque','Helvetica Neue',sans-serif;--td:clamp(4.5rem,11vw,10.5rem);--h1:clamp(3rem,6.5vw,6.5rem);--lead:1.08rem;--body:.93rem;--sm:.8rem;--nano:.57rem;--expo:cubic-bezier(.16,1,.3,1);}"""

FONTS_SCRIPTS = """\
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>"""

APPLE_ICON = '<link rel="apple-touch-icon" href="/favicon.svg">'

CURSOR_CSS = """\
body{cursor:none}
#cd{position:fixed;width:5px;height:5px;background:var(--g1);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .12s,opacity .2s}
#cr{position:fixed;width:34px;height:34px;border:1px solid rgba(201,168,76,.38);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;transition:width .4s var(--expo),height .4s var(--expo),border-color .3s,background .3s}
#cl{font-size:.38rem;letter-spacing:.18em;text-transform:uppercase;color:var(--g1);opacity:0;white-space:nowrap;transition:opacity .2s;font-family:var(--fb);font-weight:700}
#cr.h{width:78px;height:78px;border-color:var(--g1);background:rgba(201,168,76,.04)}#cr.h #cl{opacity:1}
#cr.c{width:14px;height:14px;background:rgba(201,168,76,.18)}#cd.h{transform:translate(-50%,-50%) scale(0)}"""

GRAIN_DISC_CSS = """\
.grain{position:fixed;inset:0;pointer-events:none;z-index:997;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")}
#discovery-bar{position:fixed;top:0;left:0;right:0;z-index:9050;height:28px;background:var(--g3);display:flex;align-items:center;justify-content:center;font-size:var(--nano);letter-spacing:.22em;text-transform:uppercase;color:var(--g0);font-weight:500}#discovery-bar span{color:var(--g1)}"""

NAV_CSS = """\
nav{position:fixed;top:28px;inset-x:0;z-index:800;padding:32px 72px;display:flex;align-items:center;justify-content:space-between;transition:padding .5s var(--expo),background .5s,border-color .5s,top .4s;border-bottom:1px solid transparent}
nav.sc{background:rgba(2,2,4,.94);backdrop-filter:blur(40px) saturate(180%);padding:14px 72px;border-color:rgba(201,168,76,.1)}
.nl{font-family:var(--fd);font-size:1.1rem;font-weight:400;letter-spacing:.04em;text-transform:uppercase;color:var(--g1);line-height:1}
.nav-links{display:flex;gap:64px;margin-left:48px}
.nav-links a{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--fog);font-weight:500;position:relative;transition:color .3s;overflow:hidden;padding-bottom:2px}
.nav-links a:hover{color:var(--cream)}
.nav-links a svg.nav-underline{position:absolute;bottom:-2px;left:0;width:100%;height:3px;overflow:visible;pointer-events:none}
.nav-links a svg.nav-underline path{stroke:var(--g1);stroke-width:1;fill:none;stroke-dasharray:200;stroke-dashoffset:200;transition:stroke-dashoffset .5s var(--expo)}
.nav-links a:hover svg.nav-underline path{stroke-dashoffset:0}
.nc{font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;font-weight:600;color:var(--void);padding:11px 26px;position:relative;overflow:hidden;display:inline-block;transition:transform .3s var(--expo);margin-left:48px;background:linear-gradient(135deg,var(--g1) 0%,var(--g0) 50%,var(--g1) 100%);background-size:200% 200%;animation:shimmer 8s ease infinite}
.nc::before{content:'';position:absolute;inset:0;background:var(--g0);transform:translateX(-101%);transition:transform .4s var(--expo)}.nc:hover{transform:translateY(-2px)}.nc:hover::before{transform:translateX(0)}.nc span{position:relative;z-index:1}
@keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.nh{display:none;flex-direction:column;gap:5px;width:26px;background:none;border:none;padding:0;cursor:pointer}
.nh span{display:block;height:1px;background:var(--cream);transition:transform .4s var(--expo),opacity .3s}
@media(max-width:960px){.nav-links,.nc{display:none}.nh{display:flex}nav,nav.sc{padding:18px 24px}nav{top:28px}}
.mob{position:fixed;inset:0;background:var(--void);z-index:870;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;clip-path:inset(0 0 100% 0);transition:clip-path .7s var(--expo)}
.mob.op{clip-path:inset(0 0 0% 0)}
.mob a{font-family:var(--fd);font-size:2.8rem;font-weight:400;font-style:italic;color:var(--cream);transition:color .3s}.mob a:hover{color:var(--g1)}
.mob-x{position:absolute;top:22px;right:24px;font-size:1.1rem;color:var(--fog);background:none;border:none;padding:8px;cursor:pointer}"""

FOOTER_CSS = """\
footer{background:var(--void);border-top:1px solid rgba(201,168,76,.07);padding:80px 72px 52px;position:relative;z-index:1}
.ftg{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}
@media(max-width:860px){.ftg{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.ftg{grid-template-columns:1fr}}
.flog{font-family:var(--fd);font-size:1.1rem;font-weight:400;color:var(--g1);letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px}
.fct{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:22px}
.fls{list-style:none;display:flex;flex-direction:column;gap:13px}
.fls a{font-size:var(--sm);color:var(--dim);transition:color .3s}.fls a:hover{color:var(--cream)}
.ftag{font-size:var(--sm);color:var(--dim);line-height:1.7;max-width:260px;margin-top:8px}
.fb2{border-top:1px solid rgba(201,168,76,.07);padding-top:24px;display:flex;flex-direction:column;gap:8px}
.fcl{font-family:var(--fd);font-style:italic;font-size:.88rem;color:var(--fog);line-height:1.65}
.fleg{font-size:var(--nano);color:var(--dim);letter-spacing:.08em}
.f-disc{font-size:.62rem;color:rgba(107,98,87,.4);line-height:1.8;margin-top:24px;max-width:800px}"""

NAV_HTML = """\
<nav id="nav" role="navigation" aria-label="Main navigation">
  <a href="https://www.thencahub.com/" class="nl" aria-label="The NCA Hub — home">THE NCA HUB</a>
  <div class="nav-links">
    <a href="https://www.thencahub.com/#method">Method<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="https://www.thencahub.com/#story">Story<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="https://www.thencahub.com/#pods">Pods<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="https://www.thencahub.com/#subjects">Subjects<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="https://www.thencahub.com/#pricing">Pricing<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="https://www.thencahub.com/#sample">Free Chapter<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="/notes/" style="color:var(--g1);font-weight:600">Notes<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
    <a href="/blog/">Articles<svg class="nav-underline" aria-hidden="true"><path d="M0 2 Q50 0.5 100 2"/></svg></a>
  </div>
  <a href="https://www.thencahub.com/#readiness" class="nc"><span>Get My Score</span></a>
  <button class="nh" id="nh" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
</nav>
<div class="mob" id="mob" role="dialog" aria-label="Navigation menu">
  <button class="mob-x" id="mobx" aria-label="Close menu">✕</button>
  <a href="https://www.thencahub.com/#method" class="mob-link">Method</a>
  <a href="https://www.thencahub.com/#story" class="mob-link">Story</a>
  <a href="https://www.thencahub.com/#pods" class="mob-link">Pods</a>
  <a href="https://www.thencahub.com/#subjects" class="mob-link">Subjects</a>
  <a href="https://www.thencahub.com/#pricing" class="mob-link">Pricing</a>
  <a href="https://www.thencahub.com/#sample" class="mob-link">Free Chapter</a>
  <a href="/blog/" class="mob-link">Articles</a>
  <a href="https://payhip.com/THENCAHUB" class="mob-link" style="color:var(--g1);font-weight:600" target="_blank" rel="noopener">Shop Now</a>
  <a href="https://www.thencahub.com/#readiness" class="mob-link" style="margin-top:16px;color:var(--g1);font-weight:600"><span>Get My Readiness Score</span></a>
</div>"""

GRAIN_DISC_HTML = """\
<div class="grain"></div>
<div id="discovery-bar" aria-hidden="true">Read by NCA candidates across 12+ countries &nbsp;·&nbsp; <span>Internationally qualified lawyers qualifying in Canada</span></div>
<div id="cd" role="presentation"></div>
<div id="cr" role="presentation"><span id="cl"></span></div>"""

FOOTER_HTML = """\
<footer>
  <div class="ftg">
    <div>
      <div class="flog">NCA <span style="color:var(--g1)">Hub</span></div>
      <p class="ftag">Strategic preparation for lawyers who had to start over. And refused to stop.</p>
    </div>
    <div>
      <div class="fct">Navigate</div>
      <ul class="fls">
        <li><a href="https://www.thencahub.com/#method">The Method</a></li>
        <li><a href="https://www.thencahub.com/#story">The Story</a></li>
        <li><a href="https://www.thencahub.com/#pods">Performance Pods</a></li>
        <li><a href="https://www.thencahub.com/#subjects">Subjects</a></li>
        <li><a href="https://www.thencahub.com/#pricing">Pricing</a></li>
        <li><a href="https://www.thencahub.com/#sample">Free Sample</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Candidate Guides</div>
      <ul class="fls">
        <li><a href="/nca-for-indian-lawyers/">Indian Lawyers</a></li>
        <li><a href="/nca-for-uk-lawyers/">UK Lawyers</a></li>
        <li><a href="/nca-for-nigerian-lawyers/">Nigerian Lawyers</a></li>
        <li><a href="/nca-for-philippine-lawyers/">Philippine Lawyers</a></li>
        <li><a href="/nca-for-pakistani-lawyers/">Pakistani Lawyers</a></li>
        <li><a href="/nca-for-jamaican-lawyers/">Jamaican Lawyers</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Contact</div>
      <ul class="fls">
        <li><a href="mailto:hello@thencahub.com">hello@thencahub.com</a></li>
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener">Shop Now</a></li>
        <li><a href="https://www.thencahub.com/#sample">Get Free Chapter</a></li>
        <li><a href="/privacy.html">Privacy Policy</a></li>
        <li><a href="/terms.html">Terms of Use</a></li>
        <li><a href="/refund.html">Refund Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="fb2">
    <p class="fcl">"Built for the lawyers who had to start over. And refused to stop."</p>
    <p class="fleg">© 2026 The NCA Hub. All rights reserved. All content is original work.</p>
  </div>
  <p class="f-disc"><strong>NOT AFFILIATED WITH THE NCA.</strong> The NCA Hub is an independent educational resource and is not affiliated with, endorsed by, or connected to the National Committee on Accreditation (NCA™), the Federation of Law Societies of Canada, or any provincial law society. All trademarks belong to their respective owners.</p>
</footer>"""

BOTTOM_JS = """\
<script>
/* LENIS SMOOTH SCROLL */
(function(){
  try{
    if(typeof Lenis!=='undefined'){
      var lenis=new Lenis({lerp:0.075,smoothWheel:true,touchMultiplier:2,infinite:false});
      if(typeof ScrollTrigger!=='undefined'){lenis.on('scroll',ScrollTrigger.update);}
      if(typeof gsap!=='undefined'){gsap.ticker.add(function(t){lenis.raf(t*1000);});gsap.ticker.lagSmoothing(0);}
      document.documentElement.style.scrollBehavior='auto';
    }
  }catch(e){document.documentElement.style.scrollBehavior='smooth';}
})();

/* CUSTOM CURSOR */
(function(){
  var CD=document.getElementById('cd'),CR=document.getElementById('cr'),CL=document.getElementById('cl');
  if(!CD||!CR)return;
  var cmx=-200,cmy=-200,crx=-200,cry=-200;
  document.addEventListener('mousemove',function(e){cmx=e.clientX;cmy=e.clientY;CD.style.left=cmx+'px';CD.style.top=cmy+'px';},{passive:true});
  (function animC(){
    crx+=(cmx-crx)*.1;cry+=(cmy-cry)*.1;
    CR.style.left=crx+'px';CR.style.top=cry+'px';
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('[data-cur]').forEach(function(el){
    el.addEventListener('mouseenter',function(){if(CL)CL.textContent=el.dataset.cur;CR.classList.add('h');CD.classList.add('h');});
    el.addEventListener('mouseleave',function(){CR.classList.remove('h');CD.classList.remove('h');});
  });
})();

/* MOBILE MENU */
(function(){
  var NH=document.getElementById('nh'),MOB=document.getElementById('mob'),MOBX=document.getElementById('mobx');
  if(!NH||!MOB)return;
  function openMenu(){MOB.classList.add('op');NH.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
  function closeMenu(){MOB.classList.remove('op');NH.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  NH.addEventListener('click',openMenu);
  if(MOBX)MOBX.addEventListener('click',closeMenu);
  document.querySelectorAll('.mob-link').forEach(function(a){a.addEventListener('click',closeMenu);});
})();

/* NAV SCROLL */
(function(){
  var nav=document.getElementById('nav');
  if(!nav)return;
  window.addEventListener('scroll',function(){nav.classList.toggle('sc',window.scrollY>60);},{passive:true});
})();
</script>"""

COOKIE_BANNER = """\
<div id="cookie-banner" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9200;background:rgba(5,5,8,.96);border:1px solid rgba(201,168,76,.18);padding:20px 28px;max-width:520px;width:calc(100% - 48px);backdrop-filter:blur(20px);font-family:var(--fb)">
  <p style="font-size:.78rem;color:var(--fog);line-height:1.6;margin-bottom:14px">We use cookies to improve your experience. By continuing, you agree to our <a href="/privacy.html" style="color:var(--g1)">Privacy Policy</a>.</p>
  <button onclick="document.getElementById('cookie-banner').style.display='none';localStorage.setItem('ck','1')" style="background:var(--g1);color:var(--void);border:none;padding:9px 24px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Accept</button>
</div>
<script>if(!localStorage.getItem('ck'))document.getElementById('cookie-banner').style.display='block';</script>"""

CURSOR_JS_ONLY = """\
<script>
/* CUSTOM CURSOR */
(function(){
  var CD=document.getElementById('cd'),CR=document.getElementById('cr'),CL=document.getElementById('cl');
  if(!CD||!CR)return;
  var cmx=-200,cmy=-200,crx=-200,cry=-200;
  document.addEventListener('mousemove',function(e){cmx=e.clientX;cmy=e.clientY;CD.style.left=cmx+'px';CD.style.top=cmy+'px';},{passive:true});
  (function animC(){
    crx+=(cmx-crx)*.1;cry+=(cmy-cry)*.1;
    CR.style.left=crx+'px';CR.style.top=cry+'px';
    requestAnimationFrame(animC);
  })();
  document.querySelectorAll('[data-cur]').forEach(function(el){
    el.addEventListener('mouseenter',function(){if(CL)CL.textContent=el.dataset.cur;CR.classList.add('h');CD.classList.add('h');});
    el.addEventListener('mouseleave',function(){CR.classList.remove('h');CD.classList.remove('h');});
  });
})();
</script>"""


# ── Helpers ────────────────────────────────────────────────────────────────────

def read(path):
    with open(path,'r',encoding='utf-8') as f: return f.read()

def write(path, content):
    with open(path,'w',encoding='utf-8') as f: f.write(content)
    print(f'  ✓ wrote {path}')

def patch_new_page(path):
    """Full design-system patch for the 14 new pages."""
    html = read(path)

    # 1. Replace :root block (single-line pattern used in sprint)
    html = re.sub(r':root\{[^}]+\}', ROOT_CSS, html, count=1)

    # 2. Add apple-touch-icon before </head> if not present
    if 'apple-touch-icon' not in html:
        html = html.replace('</head>', APPLE_ICON + '\n</head>', 1)

    # 3. Add Google Fonts + GSAP/Lenis before <style> (if fonts not present)
    if 'fonts.googleapis.com' not in html:
        html = re.sub(r'(<style\b)', FONTS_SCRIPTS + '\n\\1', html, count=1)
    elif 'cdnjs.cloudflare.com/ajax/libs/gsap' not in html:
        # Fonts present but not GSAP — replace entire font/script block
        html = re.sub(
            r'<link rel="preconnect".*?</script>\s*(?=<style)',
            FONTS_SCRIPTS + '\n',
            html, count=1, flags=re.DOTALL
        )

    # 4. Inject cursor CSS + grain/discovery CSS + nav CSS + footer CSS
    #    (before the closing </style> of the main block)
    extra_css = '\n' + CURSOR_CSS + '\n' + GRAIN_DISC_CSS + '\n' + NAV_CSS + '\n' + FOOTER_CSS + '\n'
    # Find first </style> and inject before it
    html = html.replace('</style>', extra_css + '</style>', 1)

    # 5. Remove old nav-specific CSS classes that conflict
    #    (the old pages use .nlog, .nlinks, .hub-* nav styles — leave them, they won't conflict)

    # 6. After <body>, insert grain + discovery bar + cursor HTML
    #    Make sure we don't insert twice
    if 'id="discovery-bar"' not in html:
        html = html.replace('<body>\n', '<body>\n' + GRAIN_DISC_HTML + '\n', 1)
        if '<body>\n' + GRAIN_DISC_HTML not in html:
            # Try without newline
            html = html.replace('<body>', '<body>\n' + GRAIN_DISC_HTML, 1)

    # 7. Replace old simple nav with full nav HTML
    #    Pattern: <nav aria-label="Main navigation">...</nav>  (multiline)
    if 'id="nav"' not in html:
        html = re.sub(
            r'<nav\s+aria-label="Main navigation">.*?</nav>',
            NAV_HTML,
            html, count=1, flags=re.DOTALL
        )

    # 8. Replace footer HTML
    html = re.sub(
        r'<footer>.*?</footer>',
        FOOTER_HTML,
        html, count=1, flags=re.DOTALL
    )

    # 9. Insert JS + cookie banner before </body>
    if 'animC' not in html:
        html = html.replace('</body>', BOTTOM_JS + '\n' + COOKIE_BANNER + '\n</body>', 1)
    elif 'cookie-banner' not in html:
        html = html.replace('</body>', COOKIE_BANNER + '\n</body>', 1)

    write(path, html)


# ── Fix 1: Patch all 14 new pages ─────────────────────────────────────────────

NEW_PAGES = [
    # 6 country hub pages
    'nca-for-indian-lawyers/index.html',
    'nca-for-uk-lawyers/index.html',
    'nca-for-nigerian-lawyers/index.html',
    'nca-for-philippine-lawyers/index.html',
    'nca-for-pakistani-lawyers/index.html',
    'nca-for-jamaican-lawyers/index.html',
    # tools
    'nca-cost-calculator/index.html',
    'nca-exam-dates-2026/index.html',
    # notes
    'notes/index.html',
    'notes/administrative-law/index.html',
    'notes/constitutional-law/index.html',
    'notes/criminal-law/index.html',
    'notes/foundations-of-canadian-law/index.html',
    'notes/professional-responsibility/index.html',
]

print('=== Fix 1: Patching 14 new pages ===')
for rel in NEW_PAGES:
    path = os.path.join(BASE, rel)
    print(f'Patching {rel}...')
    patch_new_page(path)

# ── Fix 2: Cursor on blog/index.html ──────────────────────────────────────────

print('\n=== Fix 2: Blog cursor JS ===')
blog_path = os.path.join(BASE, 'blog/index.html')
blog = read(blog_path)
if 'animC' not in blog:
    # Insert cursor JS before </body>
    blog = blog.replace('</body>', CURSOR_JS_ONLY + '\n</body>', 1)
    write(blog_path, blog)
    print('  Added cursor JS to blog/index.html')
else:
    print('  Cursor JS already present in blog/index.html')

# ── Fix 3A+3B: Update index.html footer + add country guide section ────────────

print('\n=== Fix 3: index.html updates ===')
idx_path = os.path.join(BASE, 'index.html')
idx = read(idx_path)

# 3A: Add Candidate Guides column to footer
# The footer in index.html has 3 columns: brand, Navigate, Contact
# We need to insert Candidate Guides between Navigate and Contact
if 'Candidate Guides' not in idx:
    candidate_col = """\n    <div>
      <div class="fct">Candidate Guides</div>
      <ul class="fls"><li><a href="/nca-for-indian-lawyers/">Indian Lawyers</a></li><li><a href="/nca-for-uk-lawyers/">UK Lawyers</a></li><li><a href="/nca-for-nigerian-lawyers/">Nigerian Lawyers</a></li><li><a href="/nca-for-philippine-lawyers/">Philippine Lawyers</a></li><li><a href="/nca-for-pakistani-lawyers/">Pakistani Lawyers</a></li><li><a href="/nca-for-jamaican-lawyers/">Jamaican Lawyers</a></li></ul>
    </div>"""
    # Insert before the Contact div
    idx = idx.replace(
        '\n    <div>\n      <div class="fct">Contact</div>',
        candidate_col + '\n    <div>\n      <div class="fct">Contact</div>',
        1
    )
    # Update grid to 4 columns
    idx = idx.replace(
        '.ftg{display:grid;grid-template-columns:1fr 1fr 1fr;',
        '.ftg{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;',
        1
    )
    print('  Added Candidate Guides to footer')
else:
    print('  Candidate Guides already in footer')

# 3B: Add "Your Country, Your Guide" section before #blog section
COUNTRY_SECTION = """\
<!-- COUNTRY GUIDES -->
<section id="country-guides" aria-label="Candidate guides by country" style="background:var(--void);border-top:1px solid rgba(201,168,76,.07);padding:140px 0;position:relative;z-index:1;">
  <div class="w">
    <div class="ey">By Country</div>
    <h2 class="sh" style="margin-bottom:16px">Your Country, <em>Your Guide.</em></h2>
    <p class="sl" style="margin-bottom:64px;max-width:560px">Every jurisdiction brings different gaps. Find the dedicated guide written for your specific legal background.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
      <a href="/nca-for-indian-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇮🇳</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">Indian Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 5–7 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
      <a href="/nca-for-uk-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇬🇧</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">UK Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 3–5 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
      <a href="/nca-for-nigerian-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇳🇬</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">Nigerian Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 5–7 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
      <a href="/nca-for-philippine-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇵🇭</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">Philippine Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 5–7 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
      <a href="/nca-for-pakistani-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇵🇰</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">Pakistani Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 5–7 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
      <a href="/nca-for-jamaican-lawyers/" style="display:block;background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.08);padding:32px 28px;text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.08)'">
        <div style="font-size:2rem;margin-bottom:12px;">🇯🇲</div>
        <h3 style="font-family:var(--fd);font-size:1.2rem;font-weight:400;color:var(--cream);margin-bottom:8px;">Jamaican Lawyers</h3>
        <p style="font-size:var(--sm);color:var(--fog);line-height:1.6;margin-bottom:16px">Typically 3–5 NCA subjects</p>
        <span style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1)">Read guide →</span>
      </a>
    </div>
  </div>
</section>

"""

if 'id="country-guides"' not in idx:
    idx = idx.replace('<section id="blog"', COUNTRY_SECTION + '<section id="blog"', 1)
    print('  Added country guides section to index.html')
else:
    print('  Country guides section already in index.html')

write(idx_path, idx)

# ── Fix 3C: Add country guides subsection to blog/index.html ─────────────────

print('\n=== Fix 3C: Country guides in blog ===')
blog = read(blog_path)

BLOG_COUNTRY_SECTION = """\

<!-- COUNTRY GUIDES SUBSECTION -->
<section style="padding:80px 0;border-top:1px solid rgba(201,168,76,.07)">
  <div style="max-width:1200px;margin:0 auto;padding:0 72px">
    <div style="font-size:var(--nano);letter-spacing:.38em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:16px;display:flex;align-items:center;gap:14px"><span style="width:28px;height:1px;background:var(--g1);display:inline-block"></span>By Country</div>
    <h2 style="font-family:var(--fd);font-size:clamp(1.8rem,4vw,3rem);font-weight:300;color:var(--cream);margin-bottom:12px">Your Country, <em style="font-style:italic;color:var(--g1)">Your Guide.</em></h2>
    <p style="font-size:var(--sm);color:var(--fog);margin-bottom:48px">Dedicated guides for each jurisdiction — subjects assigned, timeline, and exam strategy.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      <a href="/nca-for-indian-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇮🇳</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">Indian Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
      <a href="/nca-for-uk-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇬🇧</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">UK Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
      <a href="/nca-for-nigerian-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇳🇬</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">Nigerian Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
      <a href="/nca-for-philippine-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇵🇭</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">Philippine Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
      <a href="/nca-for-pakistani-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇵🇰</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">Pakistani Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
      <a href="/nca-for-jamaican-lawyers/" style="display:block;padding:24px;border:1px solid rgba(201,168,76,.1);text-decoration:none;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='rgba(201,168,76,.1)'"><span style="font-size:1.4rem">🇯🇲</span> <span style="font-family:var(--fd);font-size:1rem;color:var(--cream);margin-left:8px">Jamaican Lawyers</span><div style="font-size:var(--nano);color:var(--g1);margin-top:8px;letter-spacing:.15em;text-transform:uppercase">Read guide →</div></a>
    </div>
  </div>
</section>
"""

if 'nca-for-indian-lawyers' not in blog:
    # Insert before </main> or before <footer>
    if '<footer' in blog:
        blog = blog.replace('<footer', BLOG_COUNTRY_SECTION + '<footer', 1)
    else:
        blog = blog.replace('</body>', BLOG_COUNTRY_SECTION + '</body>', 1)
    write(blog_path, blog)
    print('  Added country guides to blog/index.html')
else:
    write(blog_path, blog)
    print('  Country guides already in blog/index.html')

# ── Fix 3D: Internal link banners in 4 blog articles ─────────────────────────

print('\n=== Fix 3D: Internal link banners in blog articles ===')

ARTICLE_BANNERS = {
    'blog/article-d3-nca-indian-lawyers/index.html': (
        '/nca-for-indian-lawyers/',
        'Indian lawyers in Canada'
    ),
    'blog/article-d4-nca-uk-based-lawyers/index.html': (
        '/nca-for-uk-lawyers/',
        'UK lawyers qualifying in Canada'
    ),
    'blog/article-f2-nca-nigerian-lawyers/index.html': (
        '/nca-for-nigerian-lawyers/',
        'Nigerian lawyers qualifying in Canada'
    ),
    'blog/article-f3-nca-philippine-lawyers/index.html': (
        '/nca-for-philippine-lawyers/',
        'Philippine lawyers qualifying in Canada'
    ),
}

for rel, (url, label) in ARTICLE_BANNERS.items():
    path = os.path.join(BASE, rel)
    art = read(path)
    banner = f'<a href="{url}" style="display:block;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-left:3px solid var(--g1);padding:14px 20px;margin-bottom:32px;font-size:.82rem;color:var(--cream);text-decoration:none;font-family:var(--fb)">📖 See the complete dedicated guide for {label} → Read the full hub page</a>'
    if url not in art or 'border-left:3px solid var(--g1)' not in art:
        # Insert after h1 closing tag
        art = re.sub(r'(<h1[^>]*>.*?</h1>)', r'\1\n' + banner, art, count=1, flags=re.DOTALL)
        write(path, art)
        print(f'  Added banner to {rel}')
    else:
        print(f'  Banner already in {rel}')

# ── Fix 4E: Remove target="_blank" from Notes "Get Notes" buttons ─────────────

print('\n=== Fix 4E: Notes pages - same-tab links ===')
notes_files = [
    'notes/index.html',
    'notes/administrative-law/index.html',
    'notes/constitutional-law/index.html',
    'notes/criminal-law/index.html',
    'notes/foundations-of-canadian-law/index.html',
    'notes/professional-responsibility/index.html',
]
for rel in notes_files:
    path = os.path.join(BASE, rel)
    notes = read(path)
    # Remove target="_blank" and rel="noopener" from payhip links in these pages
    updated = re.sub(
        r'(<a href="https://payhip\.com/THENCAHUB"[^>]*)\s+target="_blank"\s+rel="noopener"',
        r'\1',
        notes
    )
    if updated != notes:
        write(path, updated)
        print(f'  Fixed target="_blank" in {rel}')
    else:
        print(f'  No change needed in {rel}')

print('\n=== All fixes complete! ===')
