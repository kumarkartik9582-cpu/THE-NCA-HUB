#!/usr/bin/env python3
"""
NCA Hub — Two fixes:
  Fix 1: Replace Cloudflare email obfuscation with plain mailto
  Fix 2: Premium radial-ink mobile menu on all pages with nav
"""
import re, os, glob

# ─── CSS ───────────────────────────────────────────────────────────────────────
NH_CSS = """\
.nh{position:relative;width:44px;height:44px;display:none;align-items:center;justify-content:center;flex-direction:column;gap:6px;background:none;border:none;cursor:pointer;padding:0;margin-left:20px;z-index:9200;flex-shrink:0;}
@media(max-width:960px){.nh{display:flex;}}
.nh span{display:block;width:24px;height:1.5px;background:var(--cream);transform-origin:center;transition:transform .5s cubic-bezier(.16,1,.3,1),opacity .3s ease,width .4s cubic-bezier(.16,1,.3,1),background .3s ease;}
.nh span:nth-child(2){width:16px;}
.nh.active span:nth-child(1){transform:translateY(7.5px) rotate(45deg);width:24px;background:var(--g1);}
.nh.active span:nth-child(2){opacity:0;transform:scaleX(0);}
.nh.active span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);width:24px;background:var(--g1);}"""

MOB_CSS = """\
/* ═══ MOBILE MENU OVERLAY ═══ */
.mob-overlay{position:fixed;inset:0;z-index:9100;pointer-events:none;overflow:hidden;}
.mob-ink{position:absolute;inset:0;background:rgba(2,2,4,.97);clip-path:circle(0% at calc(100% - 44px) 44px);transition:clip-path .7s cubic-bezier(.16,1,.3,1);will-change:clip-path;}
.mob-overlay.open .mob-ink{clip-path:circle(150% at calc(100% - 44px) 44px);}
.mob-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g1),transparent);transform:scaleX(0);transform-origin:left;transition:transform .6s cubic-bezier(.16,1,.3,1) .3s;}
.mob-overlay.open .mob-line{transform:scaleX(1);}
.mob-glow{position:absolute;top:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(201,168,76,.12) 0%,transparent 60%);border-radius:50%;opacity:0;transition:opacity .8s ease .2s;pointer-events:none;}
.mob-overlay.open .mob-glow{opacity:1;}
.mob-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px 48px 48px;opacity:0;transition:opacity .2s ease;overflow-y:auto;}
.mob-overlay.open .mob-content{opacity:1;transition:opacity .3s ease .35s;pointer-events:all;}
.mob-item{position:relative;overflow:hidden;border-bottom:1px solid rgba(201,168,76,.07);}
.mob-item:last-of-type{border-bottom:none;}
.mob-link{display:flex;align-items:center;justify-content:space-between;padding:18px 0;font-family:var(--fd);font-size:clamp(1.4rem,5vw,2rem);font-weight:300;color:var(--fog);text-decoration:none;letter-spacing:-.01em;transform:translateY(40px);opacity:0;transition:color .3s ease,transform .6s cubic-bezier(.16,1,.3,1),opacity .6s ease;cursor:pointer;background:none;border:none;width:100%;text-align:left;}
.mob-link::after{content:'→';font-family:var(--fb);font-size:.9rem;color:rgba(201,168,76,0);transition:color .3s,transform .3s;transform:translateX(-8px);}
.mob-link:hover{color:var(--cream);}
.mob-link:hover::after{color:var(--g1);transform:translateX(0);}
.mob-overlay.open .mob-link{transform:translateY(0);opacity:1;}
.mob-overlay.open .mob-item:nth-child(1) .mob-link{transition-delay:.38s;}
.mob-overlay.open .mob-item:nth-child(2) .mob-link{transition-delay:.44s;}
.mob-overlay.open .mob-item:nth-child(3) .mob-link{transition-delay:.50s;}
.mob-overlay.open .mob-item:nth-child(4) .mob-link{transition-delay:.56s;}
.mob-overlay.open .mob-item:nth-child(5) .mob-link{transition-delay:.62s;}
.mob-overlay.open .mob-item:nth-child(6) .mob-link{transition-delay:.68s;}
.mob-overlay.open .mob-item:nth-child(7) .mob-link{transition-delay:.74s;}
.mob-overlay.open .mob-item:nth-child(8) .mob-link{transition-delay:.80s;}
.mob-cta{display:inline-flex;align-items:center;gap:10px;margin-top:32px;padding:16px 40px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;transform:translateY(30px);opacity:0;transition:transform .6s cubic-bezier(.16,1,.3,1) .86s,opacity .6s ease .86s,background .3s;align-self:flex-start;}
.mob-cta:hover{background:var(--g0);}
.mob-overlay.open .mob-cta{transform:translateY(0);opacity:1;}
.mob-utils{display:flex;gap:24px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(201,168,76,.07);flex-wrap:wrap;transform:translateY(20px);opacity:0;transition:transform .5s cubic-bezier(.16,1,.3,1) .9s,opacity .5s ease .9s;}
.mob-overlay.open .mob-utils{transform:translateY(0);opacity:1;}
.mob-utils a{font-size:var(--sm);color:var(--dim);text-decoration:none;font-family:var(--fb);transition:color .3s;letter-spacing:.04em;}
.mob-utils a:hover{color:var(--g1);}
.mob-deco{position:absolute;bottom:40px;right:48px;font-family:var(--fd);font-size:clamp(4rem,10vw,7rem);font-weight:300;color:rgba(201,168,76,.04);line-height:1;pointer-events:none;user-select:none;transform:translateY(20px);opacity:0;transition:transform .8s ease .5s,opacity .8s ease .5s;}
.mob-overlay.open .mob-deco{transform:translateY(0);opacity:1;}
.mob-counter{position:absolute;left:0;top:50%;transform:translateY(-50%);font-size:var(--nano);letter-spacing:.2em;color:rgba(201,168,76,.3);font-family:var(--fb);opacity:0;transition:opacity .2s;pointer-events:none;}
.mob-item:hover .mob-counter{opacity:1;}"""

# ─── HTML (root vs non-root) ────────────────────────────────────────────────────
def mob_html(root=False):
    base = 'https://www.thencahub.com' if not root else ''
    return f"""
<!-- ═══ PREMIUM MOBILE MENU ═══ -->
<div class="mob-overlay" id="mob-overlay" aria-hidden="true" role="dialog" aria-label="Navigation">
  <div class="mob-ink" id="mob-ink"></div>
  <div class="mob-line"></div>
  <div class="mob-glow"></div>
  <canvas id="mob-particles" style="position:absolute;inset:0;pointer-events:none;opacity:.4;"></canvas>
  <div class="mob-deco" aria-hidden="true">NCA</div>
  <div class="mob-content">
    <nav aria-label="Mobile navigation">
      <div class="mob-item">
        <span class="mob-counter">01</span>
        <a href="{base}/#method" class="mob-link">Method</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">02</span>
        <a href="{base}/#subjects" class="mob-link">Subjects</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">03</span>
        <a href="{base}/notes/" class="mob-link" style="color:var(--g1);">Notes</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">04</span>
        <a href="{base}/#pricing" class="mob-link">Pricing</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">05</span>
        <a href="{base}/blog/" class="mob-link">Articles</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">06</span>
        <a href="{base}/#sample" class="mob-link">Free Chapter</a>
      </div>
      <div class="mob-item">
        <span class="mob-counter">07</span>
        <a href="{base}/nca-cost-calculator/" class="mob-link">Cost Calculator</a>
      </div>
    </nav>
    <a href="https://payhip.com/THENCAHUB" class="mob-cta" target="_blank" rel="noopener">Get the Notes →</a>
    <div class="mob-utils">
      <a href="{base}/nca-exam-dates-2026/">Exam Dates 2026</a>
      <a href="{base}/nca-for-indian-lawyers/">Indian Lawyers Guide</a>
      <a href="{base}/become-a-lawyer-in-ontario/">Qualify in Ontario</a>
      <a href="{base}/#readiness">Readiness Score</a>
    </div>
  </div>
</div>"""

# ─── JS ────────────────────────────────────────────────────────────────────────
MOB_JS = """\
/* MOBILE MENU */
(function(){
  var BTN=document.getElementById('nh');
  var OVERLAY=document.getElementById('mob-overlay');
  if(!BTN||!OVERLAY)return;
  var isOpen=false;
  function openMenu(){isOpen=true;OVERLAY.classList.add('open');OVERLAY.setAttribute('aria-hidden','false');BTN.classList.add('active');BTN.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';if(navigator.vibrate)navigator.vibrate(10);}
  function closeMenu(){isOpen=false;OVERLAY.classList.remove('open');OVERLAY.setAttribute('aria-hidden','true');BTN.classList.remove('active');BTN.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  BTN.addEventListener('click',function(){isOpen?closeMenu():openMenu();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
  OVERLAY.querySelectorAll('.mob-link').forEach(function(a){
    a.addEventListener('click',function(){var href=a.getAttribute('href')||'';if(!href.startsWith('http'))closeMenu();else setTimeout(closeMenu,100);});
  });
  OVERLAY.addEventListener('click',function(e){if(e.target===OVERLAY||e.target.classList.contains('mob-ink'))closeMenu();});
  OVERLAY.querySelectorAll('.mob-link').forEach(function(link){
    link.addEventListener('mousemove',function(e){var rect=link.getBoundingClientRect();var x=((e.clientX-rect.left)/rect.width-.5)*8;var y=((e.clientY-rect.top)/rect.height-.5)*4;link.style.transform='translate('+x+'px,'+y+'px)';});
    link.addEventListener('mouseleave',function(){link.style.transform='';});
  });
})();"""

PARTICLE_JS = """\
/* MOBILE MENU PARTICLES */
(function(){
  var canvas=document.getElementById('mob-particles');
  var overlay=document.getElementById('mob-overlay');
  if(!canvas||!overlay)return;
  var ctx=canvas.getContext('2d');
  var particles=[];
  var animId;
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize,{passive:true});
  function Particle(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.size=Math.random()*1.5+.3;this.speedX=(Math.random()-.5)*.4;this.speedY=(Math.random()-.5)*.4;this.opacity=Math.random()*.5+.1;this.gold=Math.random()>.7;}
  Particle.prototype.update=function(){this.x+=this.speedX;this.y+=this.speedY;if(this.x<0)this.x=canvas.width;if(this.x>canvas.width)this.x=0;if(this.y<0)this.y=canvas.height;if(this.y>canvas.height)this.y=0;};
  Particle.prototype.draw=function(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle=this.gold?'rgba(201,168,76,'+this.opacity+')':'rgba(237,229,206,'+(this.opacity*.3)+')';ctx.fill();};
  for(var i=0;i<60;i++)particles.push(new Particle());
  function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(function(p){p.update();p.draw();});animId=requestAnimationFrame(animate);}
  var observer=new MutationObserver(function(){if(overlay.classList.contains('open')){animate();}else{cancelAnimationFrame(animId);ctx.clearRect(0,0,canvas.width,canvas.height);}});
  observer.observe(overlay,{attributes:true,attributeFilter:['class']});
})();"""

# ─── HAMBURGER BUTTON HTML ───────────────────────────────────────────────────────
NH_BTN = '<button class="nh" id="nh" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>'

# ─── FIX 1: EMAIL ─────────────────────────────────────────────────────────────────
def fix_email(html):
    REPLACEMENT = '<a href="mailto:thencahub@gmail.com" style="color:var(--g1)">thencahub@gmail.com</a>'
    # Pattern A: <a href="cdn-cgi..."><span class="__cf_email__"...>...</span></a>
    html = re.sub(
        r'<a\s+href="/cdn-cgi/l/email-protection[^"]*"[^>]*>\s*<span[^>]*class="__cf_email__"[^>]*>[^<]*</span>\s*</a>',
        REPLACEMENT, html)
    # Pattern B: <a href="cdn-cgi..." class="__cf_email__"...>...</a>
    html = re.sub(
        r'<a[^>]+href="/cdn-cgi/l/email-protection[^"]*"[^>]*class="__cf_email__"[^>]*>[^<]*</a>',
        REPLACEMENT, html)
    # Pattern C: <a href="cdn-cgi...">Any text</a>  (remaining cdn-cgi email links)
    html = re.sub(
        r'<a\s+href="/cdn-cgi/l/email-protection[^"]*"[^>]*>[^<]*</a>',
        REPLACEMENT, html)
    # Pattern D: lingering <span class="__cf_email__"...>...</span>
    html = re.sub(
        r'<span[^>]*class="__cf_email__"[^>]*>[^<]*</span>',
        'thencahub@gmail.com', html)
    # Remove cfasync email-decode script tag
    html = re.sub(
        r'<script\s+data-cfasync="false"\s+src="/cdn-cgi/scripts/[^"]+/cloudflare-static/email-decode\.min\.js"></script>',
        '', html)
    return html

# ─── FIX 2: CSS HELPERS ───────────────────────────────────────────────────────────
def remove_old_mob_css(html):
    """Remove all old .mob* CSS rules and old .nh rules (not media query)."""
    # Remove CSS rules that start with .mob (matches .mob{}, .mob.op{}, .mob-link{}, etc.)
    # These are single-line CSS rules in the minified style blocks
    html = re.sub(r'\.mob[^{@\n]*\{[^}]*\}\s*', '', html)
    # Also remove .nh{ } and .nh span{ } old rules (not inside @media)
    html = re.sub(r'\.nh\{[^}]*\}\s*', '', html)
    html = re.sub(r'\.nh\s+span\{[^}]*\}\s*', '', html)
    return html

def add_mob_css(html):
    """Insert new .nh and .mob overlay CSS before </style>."""
    new_css = '\n' + NH_CSS + '\n' + MOB_CSS + '\n'
    return html.replace('</style>', new_css + '</style>', 1)

# ─── FIX 2: HTML HELPERS ─────────────────────────────────────────────────────────
def extract_div_end(html, start):
    """Find closing </div> for div opening at 'start', return end index."""
    # Move past the opening tag
    pos = html.index('>', start) + 1
    depth = 1
    while pos < len(html) and depth > 0:
        next_open = html.find('<div', pos)
        next_close = html.find('</div>', pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                return next_close + 6  # include </div>
            pos = next_close + 6
    return -1

def remove_mob_html(html):
    """Remove mob-backdrop div, mob div, and mob-overlay div from HTML."""
    # Remove mob-backdrop (simple empty div)
    html = re.sub(r'<div[^>]*class="mob-backdrop"[^>]*></div>\s*\n?', '', html)
    html = re.sub(r'<div[^>]*id="mob-backdrop"[^>]*></div>\s*\n?', '', html)

    # Remove mob-overlay div (from previous premium menu if exists)
    for pat in [r'<!-- ═══ PREMIUM MOBILE MENU ═══ -->\s*\n?', r'<!-- ═+\s*PREMIUM MOBILE MENU\s*═+\s*-->\s*\n?']:
        comment_m = re.search(pat, html)
        if comment_m:
            start = comment_m.start()
            # Find the mob-overlay div after the comment
            div_start = html.find('<div class="mob-overlay"', start)
            if div_start == -1:
                div_start = html.find('<div', start)
            if div_start != -1:
                end = extract_div_end(html, div_start)
                if end != -1:
                    html = html[:start] + html[end:].lstrip('\n')
                    continue
            # If no div found, just remove the comment
            html = html[:start] + html[comment_m.end():]

    # Remove any remaining .mob div (with class="mob" but not mob-overlay etc.)
    for m in re.finditer(r'<div[^>]*\bclass="mob"[^>]*>', html):
        start = m.start()
        end = extract_div_end(html, start)
        if end != -1:
            html = html[:start] + html[end:].lstrip('\n')
            break  # one mob div at a time; rerun if needed

    # Remove mob-overlay div if it somehow remains
    for m in re.finditer(r'<div[^>]*\bclass="mob-overlay"[^>]*>', html):
        start = m.start()
        end = extract_div_end(html, start)
        if end != -1:
            html = html[:start] + html[end:].lstrip('\n')
            break

    return html

def add_mob_html(html, is_root=False):
    """Add new mob-overlay HTML before </body>."""
    overlay = mob_html(root=is_root)
    return html.replace('</body>', overlay + '\n</body>', 1)

def update_hamburger(html):
    """Ensure hamburger button has exactly 3 spans with correct structure."""
    # Replace any existing .nh button
    html = re.sub(
        r'<button[^>]*class="nh"[^>]*>.*?</button>',
        NH_BTN,
        html,
        flags=re.DOTALL
    )
    return html

# ─── FIX 2: JS HELPERS ──────────────────────────────────────────────────────────
def replace_mob_js(html):
    """Replace old mobile menu JS with new IIFE + particles."""
    new_js = MOB_JS + '\n' + PARTICLE_JS

    # Pattern A: Sprint 3 IIFE style: /* MOBILE MENU */ (function(){...})();
    m = re.search(r'/\* MOBILE MENU \*/', html)
    if m:
        start = m.start()
        end = html.find('})();', start)
        if end != -1:
            end += 5  # include })();
            html = html[:start] + new_js + html[end:]
            return html

    # Pattern B: blog article inline style: // Mobile nav\n  var nh=...
    m = re.search(r'//\s*Mobile nav\s*\n\s*var nh=document\.getElementById\(\'nh\'\)', html)
    if m:
        start = m.start()
        # Find end: 3 lines (the nh, mobx, mob.querySelectorAll lines)
        end = html.find('\n', start)  # end of // Mobile nav
        # Skip the next 3 statements
        for _ in range(3):
            next_semi = html.find(';', end + 1)
            if next_semi != -1:
                end = next_semi + 1
        # Trim whitespace
        while end < len(html) and html[end] in ' \n\r':
            end += 1
        html = html[:start] + new_js + '\n' + html[end:]
        return html

    # Pattern C: simpler nh click handler
    m = re.search(r'var nh=document\.getElementById\([\'"]nh[\'"]\),mob=document\.getElementById\([\'"]mob[\'"]\)', html)
    if m:
        start = m.start()
        end = html.find(';', start)
        # Find end of the mob JS block (next 3 lines)
        for _ in range(3):
            next_semi = html.find(';', end + 1)
            if next_semi != -1:
                end = next_semi + 1
        html = html[:start] + new_js + '\n' + html[end:]
        return html

    # Pattern D: No existing mob JS — just append before </script>
    # Find the last <script> block and prepend
    if '</script>' in html:
        last_script = html.rfind('</script>')
        html = html[:last_script] + new_js + '\n' + html[last_script:]

    return html

# ─── PROCESS A SINGLE FILE ────────────────────────────────────────────────────────
def process_file(filepath):
    is_root = (filepath == '/home/user/THE-NCA-HUB/index.html')
    has_nav = bool(re.search(r'class="nh"|id="nh"', open(filepath).read()))

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    orig = html

    # Fix 1: email
    html = fix_email(html)

    # Fix 2: only if page has nav/hamburger or about page
    if has_nav or 'about/index.html' in filepath:
        html = remove_old_mob_css(html)
        html = add_mob_css(html)
        html = update_hamburger(html)
        html = remove_mob_html(html)
        html = add_mob_html(html, is_root=is_root)
        html = replace_mob_js(html)

    if html != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False

# ─── MAIN ─────────────────────────────────────────────────────────────────────────
all_html = (
    glob.glob('/home/user/THE-NCA-HUB/*.html') +
    glob.glob('/home/user/THE-NCA-HUB/**/*.html', recursive=True)
)
all_html = list(set(all_html))

changed = []
errors = []
for f in sorted(all_html):
    try:
        if process_file(f):
            changed.append(f)
    except Exception as e:
        errors.append((f, str(e)))

print(f'Changed: {len(changed)} files')
for f in changed:
    print(f'  {os.path.relpath(f, "/home/user/THE-NCA-HUB")}')
if errors:
    print(f'\nErrors: {len(errors)}')
    for f, e in errors:
        print(f'  {os.path.relpath(f, "/home/user/THE-NCA-HUB")}: {e}')
