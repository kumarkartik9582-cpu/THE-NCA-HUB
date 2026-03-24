#!/usr/bin/env python3
"""Sprint B - Conversion Quick Wins for The NCA Hub"""
import os, re, glob

BASE = '/home/user/THE-NCA-HUB'

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  UPDATED: {path.replace(BASE+'/', '')}")

# ─── SHARED BLOCKS ────────────────────────────────────────────────────────────

ANUM_TESTIMONIAL = '''<div style="background:rgba(201,168,76,.04);border-left:3px solid var(--g1);padding:24px 28px;margin-bottom:24px;max-width:520px;margin-left:auto;margin-right:auto;">
<p style="font-family:var(--fd);font-size:1.15rem;font-weight:300;color:var(--cream);line-height:1.7;font-style:italic;margin-bottom:14px;">"I passed on my 4th and final attempt. This is the only method that worked for me."</p>
<p style="font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;">Anum · Constitutional Law · 4th attempt</p>
</div>'''

SOCIAL_PROOF = '''<p style="font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;color:var(--g1);font-family:var(--fb);font-weight:600;margin-bottom:20px;text-align:center;">✓ Used by candidates in 12+ countries across all 5 NCA subjects</p>'''

LOSS_AVERSION_NOTES = '''<div style="background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.12);padding:20px 24px;margin:20px 0;max-width:480px;margin-left:auto;margin-right:auto;">
<p style="font-size:var(--sm);color:var(--fog);font-family:var(--fb);line-height:1.8;text-align:center;">One NCA resit costs <strong style="color:var(--cream);">$500 CAD + taxes</strong> and a <strong style="color:var(--cream);">3-month wait</strong> for the next session. These notes cost <strong style="color:var(--cream);">$175 CAD</strong>. The maths are straightforward.</p>
</div>'''

RISK_REVERSAL = '''<p style="font-size:var(--sm);color:var(--fog);text-align:center;font-family:var(--fb);line-height:1.8;margin-bottom:24px;">If you sit your exam using these notes and don&#x2019;t pass, email <a href="mailto:thencahub@gmail.com" style="color:var(--g1);text-decoration:none;">thencahub@gmail.com</a> and we will send you the updated notes for your resit &#x2014; <strong style="color:var(--cream);">free.</strong></p>'''

BNPL = '''<p style="font-size:.72rem;color:var(--dim);margin-top:12px;text-align:center;font-family:var(--fb);">Instant PDF delivery · <span style="color:var(--fog);">Pay in 2 instalments available at checkout</span> · Questions? <a href="mailto:thencahub@gmail.com" style="color:var(--g1);text-decoration:none;">thencahub@gmail.com</a></p>'''

WA_CSS = '''
.wa-float{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:7900;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:transform .3s var(--expo),box-shadow .3s;text-decoration:none;}
.wa-float:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(37,211,102,.5);}
.wa-float svg{width:28px;height:28px;fill:#fff;}
@media(min-width:960px){.wa-float{display:none;}}
@media(max-width:768px){.has-sticky-cta .wa-float{bottom:72px;}}'''

WA_HTML = '''<a href="https://wa.me/message/PLACEHOLDER" class="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" onclick="gtag(\'event\',\'whatsapp_click\',{\'page\':window.location.pathname});"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>'''

STICKY_CSS = '''
.sticky-mob-cta{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--g1);color:var(--void);text-align:center;padding:16px 24px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;z-index:8000;box-shadow:0 -4px 20px rgba(201,168,76,.25);transition:transform .3s ease;}
@media(max-width:768px){.sticky-mob-cta{display:block;}body{padding-bottom:56px;}}'''

# ─── TASK 1: FIRST-PERSON CTA REPLACEMENTS ────────────────────────────────────
print("\n=== TASK 1: First-person CTA replacements ===")

def task1_replace(content):
    replacements = [
        # Exact entity variant first
        ('Get the Notes &#x2192;', 'Get My Notes &#x2192;'),
        # With arrow
        ('Get the Notes \u2192', 'Get My Notes \u2192'),
        ('Get the Notes &rarr;', 'Get My Notes &rarr;'),
        # Plain
        ('Get the Notes \xe2\x86\x92', 'Get My Notes \xe2\x86\x92'),
        ('Get the Notes &amp;\u2192;', 'Get My Notes &amp;\u2192;'),
        ('Get the Notes &amp;rarr;', 'Get My Notes &amp;rarr;'),
        # Now the text-only version (must come after arrow versions)
        ('Get the Notes', 'Get My Notes'),
        # Browse
        ('Browse All Notes \u2192', 'Browse My Notes \u2192'),
        ('Browse All Notes &rarr;', 'Browse My Notes &rarr;'),
        ('Browse All Notes', 'Browse My Notes'),
        # Get Instant Access
        ('Get Instant Access \u2192', 'Get My Notes \u2192'),
        ('Get Instant Access &rarr;', 'Get My Notes &rarr;'),
        ('Get Instant Access', 'Get My Notes'),
        # Download Free Chapter (must precede "Download Free")
        ('Download Free Chapter', 'Download My Free Chapter'),
        ('Download Free \u2192', 'Download My Free Chapter \u2192'),
        ('Download Free &rarr;', 'Download My Free Chapter &rarr;'),
        # Get Free Chapter (careful: don't change "Get Free Chapter First")
        ('Get Free Chapter First', 'GET_FREE_CHAPTER_FIRST_PLACEHOLDER'),
        ('Get Free Chapter \u2192', 'Get My Free Chapter \u2192'),
        ('Get Free Chapter &rarr;', 'Get My Free Chapter &rarr;'),
        ('Get Free Chapter', 'Get My Free Chapter'),
        # Restore placeholder
        ('GET_FREE_CHAPTER_FIRST_PLACEHOLDER', 'Get Free Chapter First'),
        # Open calculator
        ('Open calculator \u2192', 'Open My Calculator \u2192'),
        ('Open calculator &rarr;', 'Open My Calculator &rarr;'),
        # See all exam dates
        ('See all exam dates \u2192', 'See My Exam Dates \u2192'),
        ('See all exam dates &rarr;', 'See My Exam Dates &rarr;'),
        # Read the guide
        ('Read the guide \u2192', 'Read My Guide \u2192'),
        ('Read the guide &rarr;', 'Read My Guide &rarr;'),
        # Read guide
        ('Read guide \u2192', 'Read My Guide \u2192'),
        ('Read guide &rarr;', 'Read My Guide &rarr;'),
    ]
    for old, new in replacements:
        content = content.replace(old, new)
    return content

html_files = glob.glob(os.path.join(BASE, '**/*.html'), recursive=True)
html_files += glob.glob(os.path.join(BASE, '*.html'))
html_files = list(set(html_files))

for fpath in sorted(html_files):
    if '.git' in fpath:
        continue
    original = read(fpath)
    updated = task1_replace(original)
    if updated != original:
        write(fpath, updated)

# Also update build.js
bjs = os.path.join(BASE, 'build.js')
if os.path.exists(bjs):
    original = read(bjs)
    updated = task1_replace(original)
    if updated != original:
        write(bjs, updated)


# ─── TASK 2: SIMPLIFY FREE CHAPTER FORM ───────────────────────────────────────
print("\n=== TASK 2: Simplify free chapter form to email-only ===")

idx_path = os.path.join(BASE, 'index.html')
idx = read(idx_path)

OLD_FORM = '''      <div class="sf2" id="SFORM">
        <span class="flbl">Download My Free Chapter</span>
        <form
          action="https://formspree.io/f/mkoqgvqd"
          method="POST"
          id="free-chapter-form"
          onsubmit="ncaFormSubmit(event)"
        >
          <input type="text"  class="ff" name="name"    id="FN" placeholder="Your first name"         autocomplete="given-name" aria-label="Your first name"    required>
          <input type="email" class="ff" name="email"   id="FE" placeholder="Your email address"       autocomplete="email"      aria-label="Your email address" required>
          <input type="hidden" name="_subject" value="NCA Hub \u2014 Free Chapter Request">
          <input type="hidden" name="_next" id="form-next" value="https://www.thencahub.com/free-chapter.html">
          <select class="fs" name="subject" id="FS" aria-label="Which subject are you preparing for?" required>
            <option value="" disabled selected>Which subject are you preparing for?</option>
            <option>Administrative Law</option><option>Constitutional Law</option><option>Criminal Law</option>
            <option>Foundations of Canadian Law</option><option>Professional Responsibility</option>
            <option>Legal Research &amp; Writing (LRW)</option>
            <option>Business Organisations (notify when available)</option>
            <option>Family Law (notify when available)</option>
            <option>Property Law (notify when available)</option>
            <option>Torts (notify when available)</option>
            <option>Contracts (notify when available)</option>
            <option>Civil Procedure (notify when available)</option>
            <option>Remedies (notify when available)</option>
            <option>Multiple subjects</option>
          </select>
          <button class="fsub" type="submit" id="FSB" aria-label="Submit and send free chapter"><span id="FSBT">Send Me the Free Chapter \u2192</span></button>
          <p class="ffine">Your email is never shared or sold. One-click unsubscribe any time.</p>
        </form>
      </div>'''

NEW_FORM = '''      <div class="sf2" id="SFORM">
        <div style="max-width:480px;margin:0 auto;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input type="email" id="SEML" name="email" placeholder="Your email address" required autocomplete="email" style="flex:1;min-width:240px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.25);border-right:none;color:var(--cream);padding:17px 20px;font-family:var(--fb);font-size:.9rem;outline:none;">
            <button type="submit" id="FSB" style="background:var(--g1);color:var(--void);border:none;padding:17px 32px;font-family:var(--fb);font-size:.82rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:background .3s;" onmouseover="this.style.background=\'var(--g0)\'" onmouseout="this.style.background=\'var(--g1)\'"><span id="FSBT">Get My Free Chapter \u2192</span></button>
          </div>
          <p style="font-size:.72rem;color:var(--dim);margin-top:12px;text-align:center;font-family:var(--fb);">Instant delivery \xb7 No payment \xb7 Unsubscribe anytime</p>
        </div>
      </div>'''

if OLD_FORM in idx:
    idx = idx.replace(OLD_FORM, NEW_FORM)
    print("  Form HTML replaced")
else:
    print("  WARNING: Old form not found - checking for variant...")
    # Try to find and replace using a looser match
    if 'id="SFORM"' in idx and 'id="FN"' in idx:
        print("  SFORM found but FN field exists - manual check needed")

# Update the JS handler
OLD_JS_HANDLER = """  var FSB=document.getElementById('FSB'),FSBT=document.getElementById('FSBT'),SFORM=document.getElementById('SFORM');
  var FN=document.getElementById('FN'),FE=document.getElementById('FE');
  if(!FSB)return;
  FSB.addEventListener('click',function(e){
    e.preventDefault();
    var name=FN?FN.value.trim():'',email=FE?FE.value.trim():'',emailOk=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    var subj=document.getElementById('FS')?document.getElementById('FS').value:'Not specified';
    if(!name||!emailOk){
      if(!name&&FN){FN.style.borderBottomColor='rgba(220,80,80,.7)';setTimeout(function(){if(FN)FN.style.borderBottomColor='';},1800);}
      if(!emailOk&&FE){FE.style.borderBottomColor='rgba(220,80,80,.7)';setTimeout(function(){if(FE)FE.style.borderBottomColor='';},1800);}
      return;
    }
    if(FSBT)FSBT.textContent='Sending\u2026';FSB.disabled=true;
    fetch('https://formspree.io/f/mkoqgvqd',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name:name,email:email,subject:subj,_subject:'NCA Hub Free Chapter: '+subj,_replyto:email})
    }).then(function(r){
      if(r.ok){
        if(SFORM)SFORM.innerHTML='<div class="form-success"><div class="fsi">\\u2713</div><p class="fss">Your free chapter is on its way to <strong style="color:var(--g1)">'+email+'</strong>.<br>Check your inbox \\u2014 it arrives within a few minutes.</p></div>';
        try{sessionStorage.setItem('ncahub_sample_sent','1');}catch(ex){}
        try{if(typeof gtag==='function'){gtag('event','free_chapter_download',{'subject':subj});}}catch(ex){}
        setTimeout(function(){window.location.href='/thank-you/';},2000);
      }else{
        if(FSBT)FSBT.textContent='Try Again';FSB.disabled=false;
      }
    }).catch(function(){
      if(FSBT)FSBT.textContent='Try Again';FSB.disabled=false;
    });
  });"""

NEW_JS_HANDLER = """  var FSB=document.getElementById('FSB'),FSBT=document.getElementById('FSBT'),SFORM=document.getElementById('SFORM');
  if(!FSB)return;
  FSB.addEventListener('click',function(e){
    e.preventDefault();
    var SEML=document.getElementById('SEML');
    var email=SEML?SEML.value.trim():'';
    var emailOk=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    if(!emailOk){
      if(SEML){SEML.style.borderColor='rgba(220,80,80,.7)';setTimeout(function(){if(SEML)SEML.style.borderColor='rgba(201,168,76,.25)';},1800);}
      return;
    }
    if(FSBT)FSBT.textContent='Sending\u2026';FSB.disabled=true;
    fetch('https://formspree.io/f/mkoqgvqd',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({email:email,subject:'Free chapter request',_subject:'New free chapter request \u2014 The NCA Hub',_replyto:email})
    }).then(function(r){
      if(r.ok){
        if(SFORM)SFORM.innerHTML='<div class="form-success"><div class="fsi">\\u2713</div><p class="fss">Your free chapter is on its way to <strong style="color:var(--g1)">'+email+'</strong>.<br>Check your inbox \\u2014 it arrives within a few minutes.</p></div>';
        try{sessionStorage.setItem('ncahub_sample_sent','1');}catch(ex){}
        try{if(typeof gtag==='function'){gtag('event','free_chapter_download',{});}}catch(ex){}
        setTimeout(function(){window.location.href='/thank-you/';},2000);
      }else{
        if(FSBT)FSBT.textContent='Try Again';FSB.disabled=false;
      }
    }).catch(function(){
      if(FSBT)FSBT.textContent='Try Again';FSB.disabled=false;
    });
  });"""

if OLD_JS_HANDLER in idx:
    idx = idx.replace(OLD_JS_HANDLER, NEW_JS_HANDLER)
    print("  JS handler updated")
else:
    print("  WARNING: JS handler not matched exactly - trying partial match")
    # Try finding and replacing key parts
    if "var FN=document.getElementById('FN')" in idx:
        idx = idx.replace(
            "var FN=document.getElementById('FN'),FE=document.getElementById('FE');",
            ""
        )
        print("  Removed FN/FE variable declarations")

write(idx_path, idx)

