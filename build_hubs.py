import os

SHARED_CSS = """
:root{--void:#020204;--surf:#08080F;--abyss:#040408;--glow:rgba(201,168,76,.04);--g0:#E8C96A;--g1:#C9A84C;--g2:#A88835;--g3:#7A6020;--fog:#998E7C;--dim:#5C5347;--cream:#EDE5CE;--expo:cubic-bezier(.16,1,.3,1);--fd:'Cormorant Garamond',Georgia,serif;--fb:'Bricolage Grotesque','Inter',sans-serif;--nano:.72rem;--body:.92rem;--deep:#080810}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--void);color:var(--fog);font-family:var(--fb);line-height:1.7;overflow-x:hidden}
a{color:var(--g1);text-decoration:none;transition:color .3s}
a:hover{color:var(--cream)}
img{max-width:100%}
/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:800;padding:20px 64px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(rgba(2,2,4,.95),transparent)}
@media(max-width:760px){nav{padding:16px 24px}}
.nlog{font-family:var(--fd);font-size:1.15rem;color:var(--cream);letter-spacing:.06em}
.nlinks{display:flex;gap:32px;list-style:none}
@media(max-width:760px){.nlinks{display:none}}
.nlinks a{font-size:var(--nano);letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
.nlinks a:hover{color:var(--cream)}
/* HERO */
.hub-hero{min-height:60vh;display:flex;align-items:center;padding:120px 64px 80px;background:linear-gradient(160deg,var(--abyss) 0%,var(--void) 60%)}
@media(max-width:760px){.hub-hero{padding:100px 24px 60px}}
.hub-eyelet{font-size:var(--nano);letter-spacing:.35em;text-transform:uppercase;color:var(--g2);margin-bottom:20px;font-weight:600}
.hub-h1{font-family:var(--fd);font-size:clamp(2rem,5vw,3.8rem);font-weight:300;color:var(--cream);line-height:1.15;max-width:820px;margin-bottom:24px}
.hub-sub{font-size:1rem;color:var(--fog);line-height:1.8;max-width:620px;margin-bottom:40px}
.hub-btn{display:inline-block;padding:16px 44px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:var(--nano);font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo)}
.hub-btn:hover{transform:translateY(-2px);color:var(--void)}
/* SECTIONS */
.hub-sec{max-width:860px;margin:0 auto;padding:80px 64px}
@media(max-width:760px){.hub-sec{padding:60px 24px}}
.hub-sec-title{font-family:var(--fd);font-size:clamp(1.6rem,3.5vw,2.6rem);font-weight:300;color:var(--cream);margin-bottom:28px;line-height:1.2}
.hub-sec p{color:var(--fog);line-height:1.9;margin-bottom:20px}
.hub-sec ul{color:var(--fog);line-height:1.9;padding-left:20px;margin-bottom:20px}
.hub-sec li{margin-bottom:10px}
/* SUBJECTS TABLE */
.subj-table{width:100%;border-collapse:collapse;margin:32px 0;overflow-x:auto;display:block}
.subj-table th{padding:14px 20px;text-align:left;font-size:var(--nano);letter-spacing:.22em;text-transform:uppercase;font-weight:600;font-family:var(--fb);border-bottom:1px solid rgba(201,168,76,.15);color:var(--g1)}
.subj-table td{padding:14px 20px;border-bottom:1px solid rgba(201,168,76,.06);font-size:var(--body);vertical-align:top}
.subj-table td:first-child{color:var(--cream);font-family:var(--fd);font-size:1rem}
/* FAQ */
.faq-item{border-top:1px solid rgba(201,168,76,.1);padding:24px 0}
.faq-q{font-family:var(--fd);font-size:1.1rem;color:var(--cream);margin-bottom:12px;font-weight:400}
.faq-a{color:var(--fog);line-height:1.8}
/* CTA SECTION */
.hub-cta-sec{background:rgba(201,168,76,.04);border-top:1px solid rgba(201,168,76,.12);border-bottom:1px solid rgba(201,168,76,.12);padding:80px 64px;text-align:center}
@media(max-width:760px){.hub-cta-sec{padding:60px 24px}}
.hub-cta-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g2);margin-bottom:16px;font-weight:600}
.hub-cta-title{font-family:var(--fd);font-size:clamp(1.6rem,3.5vw,2.6rem);font-weight:300;color:var(--cream);margin-bottom:16px;line-height:1.2}
.hub-cta-sub{font-size:var(--body);color:var(--fog);line-height:1.7;margin-bottom:32px;max-width:520px;margin-left:auto;margin-right:auto}
/* FOOTER */
footer{background:var(--surf);border-top:1px solid rgba(201,168,76,.07);padding:60px 64px 40px}
@media(max-width:760px){footer{padding:48px 24px 32px}}
.ftg{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;margin-bottom:48px}
@media(max-width:760px){.ftg{grid-template-columns:1fr}}
.flog{font-family:var(--fd);font-size:1.1rem;color:var(--cream);margin-bottom:12px}
.ftag{font-size:var(--nano);color:var(--dim);line-height:1.6;max-width:280px}
.fhead{font-size:var(--nano);letter-spacing:.22em;text-transform:uppercase;color:var(--dim);font-weight:600;margin-bottom:16px}
.fls{list-style:none}
.fls li{margin-bottom:10px}
.fls a{font-size:var(--body);color:var(--dim)}
.fls a:hover{color:var(--cream)}
.fb2{border-top:1px solid rgba(201,168,76,.07);padding-top:24px;font-size:var(--nano);color:var(--dim)}
"""

NAV_HTML = """<nav aria-label="Main navigation">
  <a href="/" class="nlog">The NCA Hub</a>
  <ul class="nlinks">
    <li><a href="/#method">Method</a></li>
    <li><a href="/#subjects">Subjects</a></li>
    <li><a href="/notes/">Notes</a></li>
    <li><a href="/#pricing">Pricing</a></li>
    <li><a href="/blog/">Blog</a></li>
  </ul>
</nav>"""

FOOTER_HTML = """<footer>
  <div class="ftg">
    <div>
      <div class="flog">The NCA Hub</div>
      <p class="ftag">Strategic preparation for lawyers who had to start over. And refused to stop.</p>
    </div>
    <div>
      <div class="fhead">Study</div>
      <ul class="fls">
        <li><a href="/notes/">Notes</a></li>
        <li><a href="/#subjects">Subjects</a></li>
        <li><a href="/nca-cost-calculator/">Cost Calculator</a></li>
        <li><a href="/nca-exam-dates-2026/">Exam Dates 2026</a></li>
      </ul>
    </div>
    <div>
      <div class="fhead">Learn</div>
      <ul class="fls">
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="/free-chapter.html">Free Chapter</a></li>
      </ul>
    </div>
  </div>
  <div class="fb2">© 2026 The NCA Hub · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></div>
</footer>"""

def build_page(slug, title, desc, eyelet, h1, sub_text, content_sections, faqs, schema_json):
    canonical = f"https://www.thencahub.com/{slug}/"
    return f"""<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta name="geo.region" content="CA">
<meta name="geo.country" content="Canada">
<meta http-equiv="content-language" content="en-ca">
<link rel="alternate" hreflang="en-ca" href="{canonical}">
<link rel="alternate" hreflang="en" href="{canonical}">
<link rel="alternate" hreflang="x-default" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:site_name" content="The NCA Hub">
<meta property="og:image" content="https://www.thencahub.com/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="{canonical}">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<script type="application/ld+json">
{schema_json}
</script>
<style>
{SHARED_CSS}
</style>
</head>
<body>
{NAV_HTML}

<div class="hub-hero">
  <div>
    <p class="hub-eyelet">{eyelet}</p>
    <h1 class="hub-h1">{h1}</h1>
    <p class="hub-sub">{sub_text}</p>
    <a href="/notes/" class="hub-btn">Browse Study Notes →</a>
  </div>
</div>

{content_sections}

<section class="hub-cta-sec">
  <p class="hub-cta-eyelet">Ready to prepare?</p>
  <h2 class="hub-cta-title">Get the notes used to pass all 5 NCA subjects — 4 cleared in under 3 months.</h2>
  <p class="hub-cta-sub">Precision study notes, answer templates, and the readiness score tool — built for internationally trained lawyers preparing for NCA exams in Canada.</p>
  <a href="/notes/" class="hub-btn">Browse All Notes →</a>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Frequently Asked Questions</h2>
{faqs}
</section>

{FOOTER_HTML}
</body>
</html>"""

# ─── INDIA ───────────────────────────────────────────────────────────────────
india_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do Indian LLB graduates need to write?</h2>
  <p>The NCA assesses Indian LLB degrees as a common law jurisdiction with significant differences from Canadian law. Most Indian-qualified lawyers are assigned <strong>5 to 7 NCA challenge exams</strong> depending on their specific degree and any postgraduate qualifications.</p>
  <p>The five mandatory NCA subjects for all internationally trained lawyers are:</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>Typical difficulty</th><th>Study time</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>High — Vavilov framework new to most</td><td>100–140 hrs</td></tr>
      <tr><td>Constitutional Law</td><td>High — Charter analysis differs significantly</td><td>100–140 hrs</td></tr>
      <tr><td>Criminal Law</td><td>Moderate — conceptually familiar, details differ</td><td>80–120 hrs</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>High — sources of law, statutory interpretation</td><td>100–140 hrs</td></tr>
      <tr><td>Professional Responsibility</td><td>Moderate — Federation Model Code</td><td>60–100 hrs</td></tr>
    </tbody>
  </table>
  <p>Many Indian LLB graduates are also assigned <strong>Property Law</strong> and/or <strong>Contracts</strong>, bringing the total to 7 subjects. The NCA assessment letter specifies exactly which subjects you must write.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">The NCA process for Indian lawyers — step by step</h2>
  <p>Here is the complete process from NCA application to Certificate of Qualification:</p>
  <ul>
    <li><strong>Step 1 — Apply for NCA assessment</strong> (nca.legal). Submit degree transcripts, syllabi, and work experience. Processing takes 8–16 weeks.</li>
    <li><strong>Step 2 — Receive your assessment letter</strong> listing mandatory challenge exams.</li>
    <li><strong>Step 3 — Complete Indigenous Law and Peoples competency</strong> (mandatory since March 2026). Take an approved course before or alongside your NCA exams.</li>
    <li><strong>Step 4 — Register for and write NCA challenge exams</strong>. Exams are offered in January, April, June, and November (2026 schedule).</li>
    <li><strong>Step 5 — Complete LRW (Legal Research and Writing)</strong> if required. Most internationally trained lawyers are assigned this.</li>
    <li><strong>Step 6 — Apply for Certificate of Qualification (COQ)</strong> once all requirements are met.</li>
    <li><strong>Step 7 — Articling and bar exams</strong> in your chosen province.</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">How long does it take Indian lawyers to qualify in Canada?</h2>
  <p>The realistic timeline for an Indian-qualified lawyer, assuming 5–7 NCA exams:</p>
  <ul>
    <li><strong>NCA assessment:</strong> 8–16 weeks after application</li>
    <li><strong>NCA exams (5–7 subjects):</strong> 1.5–3 years (2–3 subjects per session is aggressive but achievable)</li>
    <li><strong>COQ processing:</strong> 4–8 weeks</li>
    <li><strong>Articling:</strong> 10 months (Ontario), 9 months (BC)</li>
    <li><strong>Bar exams:</strong> Barrister and Solicitor exams; results within weeks</li>
  </ul>
  <p>Total: approximately <strong>3–5 years from application to call</strong>, depending on pace and province. Candidates who write 3 subjects per session and pass first time can complete in under 3 years.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Key differences between Indian law and Canadian law</h2>
  <p>Indian-qualified lawyers find the following differences most significant:</p>
  <ul>
    <li><strong>Standard of review (Administrative Law):</strong> Canada's Vavilov framework (2019) has no direct Indian equivalent. Most Indian lawyers need to learn this from scratch.</li>
    <li><strong>Charter of Rights and Freedoms (Constitutional Law):</strong> India's fundamental rights framework shares structural similarities but differs substantially in application — particularly the Oakes test and s.1 justification.</li>
    <li><strong>Foundations of Canadian Law:</strong> The bijural Canadian legal system (common law + Civil Code of Québec) and the modern principle of statutory interpretation are different from Indian statutory interpretation doctrine.</li>
    <li><strong>Professional Responsibility:</strong> The Federation of Law Societies of Canada Model Code applies. Materially different from Bar Council of India rules.</li>
    <li><strong>Indigenous law (mandatory since March 2026):</strong> No equivalent context in Indian legal training. All NCA candidates must now complete an approved Indigenous Law and Peoples competency.</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">NCA exam format for 2026</h2>
  <p>Each NCA challenge exam is:</p>
  <ul>
    <li><strong>3 hours</strong> — no extensions</li>
    <li><strong>Open-book</strong> — hard copy materials only (no electronic devices, no internet)</li>
    <li><strong>Online-proctored</strong> via MonitorEDU — requires a working webcam, microphone, and secure browser</li>
    <li><strong>Written answers</strong> (not multiple choice) — you are expected to identify issues, apply law, and reach conclusions</li>
    <li><strong>Pass mark: 50%</strong></li>
    <li><strong>Results: 10–12 weeks</strong> after the exam date</li>
    <li><strong>3 attempts</strong> per subject before a formal re-assessment is required</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Why open-book format changes how you need to study</h2>
  <p>Most Indian-qualified lawyers are accustomed to closed-book exams requiring memorisation. The NCA's open-book format rewards <em>speed and structure</em>, not raw memory.</p>
  <p>In a 3-hour open-book exam, you do not have time to read and search 300-page notes. You need pre-built answer templates that let you immediately identify the legal issue, reach for the right framework, and write a structured answer.</p>
  <p>This is the core design principle behind The NCA Hub's notes — under 80 pages per subject, structured around exam answer templates, with every major case and rule you need in a format you can find in under 30 seconds.</p>
  <a href="/notes/" class="hub-btn" style="margin-top:16px;display:inline-block">See the Notes →</a>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-d3-nca-indian-lawyers/">How many NCA exams do Indian LLB graduates need? (complete guide)</a></li>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-a2-nca-exam-format/">NCA exam format explained</a></li>
    <li><a href="/blog/article-f1-nca-policy-changes-2026/">NCA policy changes 2026</a></li>
  </ul>
</section>
"""

india_faqs = """
  <div class="faq-item">
    <p class="faq-q">How many NCA exams do Indian LLB graduates typically need?</p>
    <p class="faq-a">Most Indian LLB graduates are assigned 5 to 7 NCA challenge exams. The five mandatory subjects apply to all internationally trained lawyers. Indian degrees are often assessed as requiring additional exams in Property Law and/or Contracts depending on the specific degree and transcripts.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Is an Indian LLB degree recognised by the NCA?</p>
    <p class="faq-a">Yes. The NCA assesses all internationally trained lawyers regardless of jurisdiction. An Indian LLB is assessed as a common law degree. The NCA will specify which subjects you must write after reviewing your transcripts and syllabi.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Can I write multiple NCA exams in one session?</p>
    <p class="faq-a">Yes. There is no formal limit on how many subjects you register for in a single session. However, each exam requires significant preparation. Most candidates write 2–3 subjects per session. Writing more than 3 in one sitting significantly increases the risk of failing.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">What is the Indigenous Law and Peoples requirement?</p>
    <p class="faq-a">Effective March 1, 2026, all NCA candidates must complete a mandatory Indigenous Law and Peoples competency from an NCA-approved provider. This can be completed before or alongside your NCA challenge exams. It is a separate requirement from the five core subjects.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">How much does the NCA process cost for Indian lawyers?</p>
    <p class="faq-a">The NCA assessment fee is $500 CAD. Each challenge exam costs approximately $500 CAD per subject. With 5–7 subjects, exam fees alone total $2,500–$3,500 CAD. Add study materials, articling fees, and bar exam fees and the total cost to qualification exceeds $20,000 CAD for most candidates.</p>
  </div>
"""

india_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for Indian Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-indian-lawyers/",
      "description": "Indian LLB graduates typically need 5–7 NCA exams to qualify as lawyers in Canada. Complete guide: subjects assigned, timeline, key legal differences, and open-book exam strategy.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for Indian Lawyers", "item": "https://www.thencahub.com/nca-for-indian-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How many NCA exams do Indian LLB graduates typically need?", "acceptedAnswer": {"@type": "Answer", "text": "Most Indian LLB graduates are assigned 5 to 7 NCA challenge exams. The five mandatory subjects apply to all internationally trained lawyers. Indian degrees are often assessed as requiring additional exams in Property Law and/or Contracts."}},
        {"@type": "Question", "name": "Is an Indian LLB degree recognised by the NCA?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The NCA assesses all internationally trained lawyers regardless of jurisdiction. An Indian LLB is assessed as a common law degree."}},
        {"@type": "Question", "name": "What is the Indigenous Law and Peoples requirement?", "acceptedAnswer": {"@type": "Answer", "text": "Effective March 1, 2026, all NCA candidates must complete a mandatory Indigenous Law and Peoples competency from an NCA-approved provider."}}
      ]
    }
  ]
}"""

pages = {
    "nca-for-indian-lawyers": {
        "title": "NCA for Indian Lawyers: Complete 2026 Guide — The NCA Hub",
        "desc": "Indian LLB graduates typically need 5–7 NCA challenge exams to qualify as lawyers in Canada. Complete guide: which subjects, the full timeline, key differences from Indian law, and open-book exam strategy.",
        "eyelet": "Indian Lawyers · Canada Qualification Guide",
        "h1": "NCA for Indian-Qualified Lawyers: The Complete 2026 Guide",
        "sub": "Most Indian LLB graduates are assigned 5–7 NCA challenge exams. Here is exactly what to expect — which subjects, the full process, and how to prepare for open-book exams that reward templates over memory.",
        "sections": india_sections,
        "faqs": india_faqs,
        "schema": india_schema
    }
}

# ─── UK ───────────────────────────────────────────────────────────────────────
uk_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do UK-qualified lawyers need to write?</h2>
  <p>UK solicitors and barristers are assessed as common law trained. The NCA typically assigns <strong>4 to 6 NCA challenge exams</strong> to UK-qualified lawyers, depending on the specific qualifying law degree and areas of practice.</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>UK Transfer</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>Partial</td><td>Vavilov framework has no UK equivalent</td></tr>
      <tr><td>Constitutional Law</td><td>Partial</td><td>Charter analysis differs substantially from HRA 1998</td></tr>
      <tr><td>Criminal Law</td><td>Partial</td><td>Conceptually familiar; specific rules differ</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>Low</td><td>Bijural system, Quebec Civil Code, indigenous law</td></tr>
      <tr><td>Professional Responsibility</td><td>Low</td><td>Federation Model Code — different from SRA Code</td></tr>
    </tbody>
  </table>
  <p>UK lawyers with broad common law exposure typically perform well in Criminal Law but find Administrative Law and Foundations of Canadian Law require the most preparation.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">UK to Canada — the complete qualification path</h2>
  <ul>
    <li><strong>Apply for NCA assessment</strong> — submit UK degree transcripts, syllabi, and qualifying experience. Processing: 8–16 weeks.</li>
    <li><strong>Complete Indigenous Law competency</strong> (mandatory since March 2026).</li>
    <li><strong>Write NCA challenge exams</strong> in January, April, June, or November sessions.</li>
    <li><strong>Complete LRW</strong> (Legal Research and Writing) if assigned.</li>
    <li><strong>Apply for Certificate of Qualification</strong>.</li>
    <li><strong>Articling and provincial bar exams</strong> in your chosen province.</li>
  </ul>
  <p>UK lawyers who passed the SQE or completed a training contract will find the NCA exams conceptually manageable, but the Canadian-specific frameworks (Vavilov, Charter, Foundations) require dedicated study.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Key differences between UK law and Canadian law</h2>
  <ul>
    <li><strong>Standard of review:</strong> Canada's Vavilov framework (2019) is unique. The UK judicial review framework (Wednesbury unreasonableness, proportionality under HRA) does not transfer directly.</li>
    <li><strong>Constitutional Law:</strong> The Canadian Charter of Rights and Freedoms (1982) is entrenched. The s.1 Oakes test and s.33 notwithstanding clause have no direct UK equivalent.</li>
    <li><strong>Bijural system:</strong> Canada has both common law and Civil law (Quebec). UK lawyers have no exposure to Civil Code analysis.</li>
    <li><strong>Professional Responsibility:</strong> The Federation Model Code differs substantially from the SRA Code of Conduct 2011.</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Timeline for UK lawyers qualifying in Canada</h2>
  <p>With 4–6 NCA subjects:</p>
  <ul>
    <li><strong>NCA assessment:</strong> 8–16 weeks</li>
    <li><strong>NCA exams:</strong> 1–2 years (writing 2–3 per session)</li>
    <li><strong>COQ + articling + bar:</strong> 12–16 months</li>
  </ul>
  <p>Total: <strong>2.5–4 years</strong> from NCA application to call. UK lawyers with strong common law backgrounds who prepare strategically for the Canadian-specific content can qualify at the faster end of this range.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Open-book exam strategy for UK lawyers</h2>
  <p>UK solicitors and barristers are often accustomed to open-book assessments at the LPC or BTC level. However, the NCA's 3-hour format is more compressed. The key constraint is not knowledge — it is speed.</p>
  <p>You need to locate the relevant rule or framework within seconds, not minutes. Short, structured notes with pre-built answer templates outperform comprehensive notes every time in a 3-hour open-book exam.</p>
  <a href="/notes/" class="hub-btn" style="margin-top:16px;display:inline-block">See the Notes →</a>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-d4-nca-uk-based-lawyers/">How UK lawyers qualify in Canada via NCA (complete guide)</a></li>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-a2-nca-exam-format/">NCA exam format explained</a></li>
  </ul>
</section>
"""

uk_faqs = """
  <div class="faq-item">
    <p class="faq-q">How many NCA exams do UK solicitors or barristers typically need?</p>
    <p class="faq-a">UK-qualified lawyers are typically assigned 4 to 6 NCA challenge exams. The exact number depends on your qualifying law degree, any LLM, and your areas of legal practice. The NCA assessment letter will specify which subjects you must write.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Does the SQE count towards NCA exemptions?</p>
    <p class="faq-a">The SQE is a relatively new qualification and the NCA assesses it on a case-by-case basis. In practice, SQE-qualified solicitors are treated similarly to LPC-qualified solicitors for NCA assessment purposes. The underlying law degree and qualifying work experience matter more than the specific route to qualification.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Which province is best for UK lawyers qualifying in Canada?</p>
    <p class="faq-a">Ontario and British Columbia are the most common destinations for UK lawyers. Ontario has the largest legal market. BC has strong ties to the Asia-Pacific region and a growing legal sector. Both require articling and provincial bar exams after the NCA COQ.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Can I practise in Canada while completing my NCA exams?</p>
    <p class="faq-a">You can live and work in Canada while completing NCA exams, but you cannot practise law until you have your Certificate of Qualification, have completed articling, and passed your provincial bar exams. Some candidates work in related roles (paralegal, legal assistant, compliance) during the process.</p>
  </div>
"""

uk_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for UK Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-uk-lawyers/",
      "description": "UK solicitors and barristers typically need 4–6 NCA exams to qualify in Canada. Complete guide: subjects assigned, Vavilov vs UK admin law, Charter vs HRA, and open-book exam strategy.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for UK Lawyers", "item": "https://www.thencahub.com/nca-for-uk-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How many NCA exams do UK solicitors or barristers typically need?", "acceptedAnswer": {"@type": "Answer", "text": "UK-qualified lawyers are typically assigned 4 to 6 NCA challenge exams, depending on qualifying law degree, LLM, and areas of legal practice."}},
        {"@type": "Question", "name": "Does the SQE count towards NCA exemptions?", "acceptedAnswer": {"@type": "Answer", "text": "The SQE is assessed on a case-by-case basis. SQE-qualified solicitors are treated similarly to LPC-qualified solicitors. The underlying law degree matters more than the specific qualification route."}}
      ]
    }
  ]
}"""

pages["nca-for-uk-lawyers"] = {
    "title": "NCA for UK Lawyers: Complete 2026 Guide — The NCA Hub",
    "desc": "UK solicitors and barristers typically need 4–6 NCA challenge exams to qualify in Canada. Guide to subjects assigned, Vavilov vs UK admin law, Charter vs HRA 1998, and open-book exam strategy.",
    "eyelet": "UK Lawyers · Canada Qualification Guide",
    "h1": "NCA for UK-Qualified Lawyers: The Complete 2026 Guide",
    "sub": "UK solicitors and barristers are typically assigned 4–6 NCA challenge exams. Here is what transfers, what does not, and how to prepare for the Canadian-specific frameworks.",
    "sections": uk_sections,
    "faqs": uk_faqs,
    "schema": uk_schema
}

# ─── NIGERIA ─────────────────────────────────────────────────────────────────
nigeria_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do Nigerian lawyers need to write?</h2>
  <p>Nigerian lawyers who qualified under the Nigerian Bar are assessed as common law trained. The NCA typically assigns <strong>5 to 7 NCA challenge exams</strong>. All five mandatory subjects are usually required, plus potentially Property Law and/or Contracts depending on your specific transcripts.</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>Notes for Nigerian Lawyers</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>Vavilov standard of review — no Nigerian equivalent</td></tr>
      <tr><td>Constitutional Law</td><td>Charter analysis differs from CFRN 1999</td></tr>
      <tr><td>Criminal Law</td><td>Conceptually familiar; significant rule differences</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>Common law + Civil Code system; statutory interpretation</td></tr>
      <tr><td>Professional Responsibility</td><td>Federation Model Code — different from NBA Rules</td></tr>
    </tbody>
  </table>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Nigerian law vs Canadian law — key differences</h2>
  <ul>
    <li><strong>Administrative law:</strong> Nigeria's judicial review framework is less codified than Canada's Vavilov standard. Nigerian lawyers need to learn the Vavilov/Dunsmuir correctness/reasonableness framework from scratch.</li>
    <li><strong>Constitutional law:</strong> The Canadian Charter (1982) is entrenched and directly enforceable. Section 1 Oakes test justification analysis differs substantially from fundamental rights enforcement under the CFRN 1999.</li>
    <li><strong>Criminal law:</strong> Canadian Criminal Code structure and defences (s.34 self-defence, Daviault extreme intoxication) differ from Nigerian criminal law framework.</li>
    <li><strong>Indigenous law:</strong> Mandatory Indigenous Law and Peoples competency is required since March 2026. This is unique to the Canadian context.</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Timeline for Nigerian lawyers qualifying in Canada</h2>
  <ul>
    <li><strong>NCA assessment:</strong> 8–16 weeks after application</li>
    <li><strong>NCA exams (5–7 subjects):</strong> 1.5–3 years</li>
    <li><strong>Indigenous Law competency:</strong> Complete alongside exams</li>
    <li><strong>COQ processing:</strong> 4–8 weeks</li>
    <li><strong>Articling + bar exams:</strong> 10–12 months</li>
  </ul>
  <p>Total: approximately <strong>3–5 years</strong> from NCA application to call to the bar.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-f2-nca-nigerian-lawyers/">NCA for Nigerian-qualified lawyers (complete guide)</a></li>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-f1-nca-policy-changes-2026/">NCA policy changes 2026</a></li>
  </ul>
</section>
"""

nigeria_faqs = """
  <div class="faq-item">
    <p class="faq-q">Do Nigerian-qualified lawyers need all 5 mandatory NCA subjects?</p>
    <p class="faq-a">Yes. All five mandatory subjects — Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility — are required for all internationally trained lawyers regardless of jurisdiction. Nigerian lawyers may also be assigned Property Law and/or Contracts.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Is the Nigerian Bar Association certificate recognised by the NCA?</p>
    <p class="faq-a">The NCA assesses your law degree (LLB) and BL qualification as evidence of legal training, not the NBA certificate directly. Transcripts and syllabi from your law school and the Nigerian Law School are the primary documents.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">What is the pass rate for Nigerian NCA candidates?</p>
    <p class="faq-a">The NCA does not publish jurisdiction-specific pass rates. The overall NCA exam pass rate is approximately 60–70% per attempt. NCA exams pass at 50% of total marks, with three attempts allowed before a re-assessment is required.</p>
  </div>
"""

nigeria_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for Nigerian Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-nigerian-lawyers/",
      "description": "Nigerian lawyers typically need 5–7 NCA challenge exams to qualify in Canada. Complete guide: subjects assigned, Nigerian vs Canadian law differences, timeline, and exam strategy.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for Nigerian Lawyers", "item": "https://www.thencahub.com/nca-for-nigerian-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "Do Nigerian-qualified lawyers need all 5 mandatory NCA subjects?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. All five mandatory subjects are required for all internationally trained lawyers. Nigerian lawyers may also be assigned Property Law and/or Contracts."}},
        {"@type": "Question", "name": "Is the Nigerian Bar Association certificate recognised by the NCA?", "acceptedAnswer": {"@type": "Answer", "text": "The NCA assesses your law degree and BL qualification as evidence of legal training. Transcripts and syllabi from your law school and the Nigerian Law School are the primary documents."}}
      ]
    }
  ]
}"""

pages["nca-for-nigerian-lawyers"] = {
    "title": "NCA for Nigerian Lawyers: Complete 2026 Guide — The NCA Hub",
    "desc": "Nigerian lawyers typically need 5–7 NCA challenge exams to qualify in Canada. Guide to subjects assigned, Nigerian vs Canadian law differences, timeline, and open-book exam strategy.",
    "eyelet": "Nigerian Lawyers · Canada Qualification Guide",
    "h1": "NCA for Nigerian-Qualified Lawyers: The Complete 2026 Guide",
    "sub": "Nigerian-qualified lawyers are typically assigned 5–7 NCA challenge exams. Here is your complete path to practising law in Canada — subjects, timeline, and strategy.",
    "sections": nigeria_sections,
    "faqs": nigeria_faqs,
    "schema": nigeria_schema
}

# ─── PHILIPPINES ──────────────────────────────────────────────────────────────
ph_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do Philippine lawyers need to write?</h2>
  <p>Philippine lawyers are assessed as a <strong>mixed jurisdiction</strong> — Philippines law combines common law (from US influence) and civil law (Spanish influence). The NCA typically assigns <strong>7 to 8 NCA challenge exams</strong> to Philippine-qualified lawyers.</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>Typical Assignment</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>Required — Vavilov framework is new</td></tr>
      <tr><td>Constitutional Law</td><td>Required — Charter differs from 1987 Phil. Constitution</td></tr>
      <tr><td>Criminal Law</td><td>Required — significant differences</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>Required — bijural system</td></tr>
      <tr><td>Professional Responsibility</td><td>Required — Federation Model Code</td></tr>
      <tr><td>Contracts</td><td>Usually required — civil law background</td></tr>
      <tr><td>Torts</td><td>Usually required</td></tr>
      <tr><td>Property Law</td><td>Often required</td></tr>
    </tbody>
  </table>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Why Philippine lawyers are assessed as a mixed jurisdiction</h2>
  <p>The Philippine legal system is neither purely common law nor purely civil law. Philippine private law (contracts, property, family) follows Spanish/civil law tradition codified in the Civil Code of the Philippines. Public law (constitutional, criminal, administrative) follows American common law tradition.</p>
  <p>Because of this mixed heritage, the NCA typically assigns more subjects than it would for a purely common law jurisdiction — hence the 7–8 subject assessment. Philippine lawyers who have passed the Philippine Bar (a rigorous exam) often find they can prepare more efficiently once they understand the Canadian frameworks.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Timeline for Philippine lawyers qualifying in Canada</h2>
  <ul>
    <li><strong>NCA assessment:</strong> 8–16 weeks</li>
    <li><strong>NCA exams (7–8 subjects):</strong> 2–4 years</li>
    <li><strong>Indigenous Law competency:</strong> Alongside exams</li>
    <li><strong>COQ + articling + bar:</strong> 12–16 months</li>
  </ul>
  <p>Total: <strong>3.5–6 years</strong> from NCA application to call. Strategic subject sequencing (starting with strongest subjects) can compress this timeline.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-f3-nca-philippine-lawyers/">NCA exams for Philippine lawyers (complete guide)</a></li>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-c3-one-month-nca-prep/">Is one month enough to prepare for the NCA?</a></li>
  </ul>
</section>
"""

ph_faqs = """
  <div class="faq-item">
    <p class="faq-q">Why do Philippine lawyers need more NCA subjects than other lawyers?</p>
    <p class="faq-a">The NCA assesses Philippine law as a mixed jurisdiction — combining civil law and common law traditions. This means fewer automatic exemptions compared to purely common law jurisdictions like England, India, or Nigeria. Philippine lawyers are typically assigned 7–8 subjects including all 5 mandatory ones plus Contracts, Torts, and Property Law.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Does passing the Philippine Bar help with NCA exams?</p>
    <p class="faq-a">The Philippine Bar is a rigorous exam and Philippine-qualified lawyers typically have strong legal reasoning skills. However, the specific Canadian frameworks (Vavilov, Charter, Oakes test, Foundations) are not covered in Philippine Bar preparation and must be studied from scratch.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Can I write NCA exams from the Philippines?</p>
    <p class="faq-a">Yes. NCA exams are online-proctored via MonitorEDU and can be written from anywhere in the world with a stable internet connection, working webcam, and microphone. You do not need to be in Canada to write the exams.</p>
  </div>
"""

ph_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for Philippine Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-philippine-lawyers/",
      "description": "Philippine lawyers are assessed as a mixed jurisdiction and typically need 7–8 NCA exams. Complete guide to subjects assigned, timeline, and preparation strategy for qualifying as a lawyer in Canada.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for Philippine Lawyers", "item": "https://www.thencahub.com/nca-for-philippine-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "Why do Philippine lawyers need more NCA subjects?", "acceptedAnswer": {"@type": "Answer", "text": "The NCA assesses Philippine law as a mixed jurisdiction. Philippine lawyers are typically assigned 7–8 subjects including all 5 mandatory ones plus Contracts, Torts, and Property Law."}},
        {"@type": "Question", "name": "Can I write NCA exams from the Philippines?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. NCA exams are online-proctored and can be written from anywhere with a stable internet connection, working webcam, and microphone."}}
      ]
    }
  ]
}"""

pages["nca-for-philippine-lawyers"] = {
    "title": "NCA for Philippine Lawyers: Complete 2026 Guide — The NCA Hub",
    "desc": "Philippine lawyers are assessed as a mixed jurisdiction and typically need 7–8 NCA challenge exams. Complete guide: subjects assigned, timeline, and preparation strategy for qualifying as a lawyer in Canada.",
    "eyelet": "Philippine Lawyers · Canada Qualification Guide",
    "h1": "NCA for Philippine-Qualified Lawyers: The Complete 2026 Guide",
    "sub": "Philippine lawyers are assessed as a mixed (civil + common) law jurisdiction and typically receive 7–8 NCA exam assignments. Here is the complete path to qualifying in Canada.",
    "sections": ph_sections,
    "faqs": ph_faqs,
    "schema": ph_schema
}

# ─── PAKISTAN ─────────────────────────────────────────────────────────────────
pak_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do Pakistani lawyers need to write?</h2>
  <p>Pakistani lawyers who qualified under the Pakistan Bar Council are assessed as common law trained (Pakistan inherited a common law system from British rule). The NCA typically assigns <strong>5 to 7 NCA challenge exams</strong> — the same general range as Indian lawyers given the shared common law heritage.</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>Notes for Pakistani Lawyers</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>Vavilov — no direct Pakistan equivalent</td></tr>
      <tr><td>Constitutional Law</td><td>Charter differs from Constitution of Pakistan 1973</td></tr>
      <tr><td>Criminal Law</td><td>Pakistan Penal Code vs Criminal Code of Canada</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>Bijural system and statutory interpretation differences</td></tr>
      <tr><td>Professional Responsibility</td><td>Federation Model Code — different from Pakistan Bar rules</td></tr>
    </tbody>
  </table>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Pakistan law vs Canadian law — key differences</h2>
  <ul>
    <li><strong>Administrative law:</strong> Pakistan's administrative law follows a judicial review framework influenced by English law but without the structured Vavilov/Dunsmuir standard of review analysis.</li>
    <li><strong>Constitutional law:</strong> The Constitution of Pakistan 1973 includes fundamental rights provisions, but the Charter of Rights and Freedoms analysis (s.1 Oakes test, s.32 threshold, s.33 notwithstanding clause) differs substantially.</li>
    <li><strong>Criminal law:</strong> The Pakistan Penal Code 1860 shares English common law origins with the Canadian Criminal Code but differs significantly in specific offences, defences, and sentencing.</li>
    <li><strong>Foundations of Canadian Law:</strong> The bijural nature of Canadian law (common law + Quebec Civil Code) and the modern principle of statutory interpretation (Driedger) are unique to Canada.</li>
  </ul>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Timeline for Pakistani lawyers qualifying in Canada</h2>
  <ul>
    <li><strong>NCA assessment:</strong> 8–16 weeks</li>
    <li><strong>NCA exams (5–7 subjects):</strong> 1.5–3 years</li>
    <li><strong>Indigenous Law competency:</strong> Alongside exams</li>
    <li><strong>COQ + articling + bar:</strong> 12–16 months</li>
  </ul>
  <p>Total: <strong>3–5 years</strong> from NCA application to call.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-a2-nca-exam-format/">NCA exam format explained</a></li>
    <li><a href="/blog/nca-exam-complete-guide/">NCA exams — the complete guide</a></li>
  </ul>
</section>
"""

pak_faqs = """
  <div class="faq-item">
    <p class="faq-q">How many NCA exams do Pakistani lawyers typically need?</p>
    <p class="faq-a">Pakistani lawyers are typically assigned 5 to 7 NCA challenge exams. All five mandatory subjects are usually required. Some candidates are also assigned Property Law and/or Contracts depending on their specific transcripts and syllabi.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Is a Pakistan Bar Council licence recognised by the NCA?</p>
    <p class="faq-a">The NCA assesses your law degree (LLB) and legal training, not the Bar Council licence directly. Your law school transcripts and syllabi are the primary evidence of your legal education for the NCA assessment.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Can Pakistani lawyers write NCA exams from Pakistan?</p>
    <p class="faq-a">Yes. NCA exams are online-proctored via MonitorEDU and can be written from anywhere in the world with a stable internet connection, working webcam, and microphone.</p>
  </div>
"""

pak_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for Pakistani Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-pakistani-lawyers/",
      "description": "Pakistani lawyers typically need 5–7 NCA challenge exams to qualify as lawyers in Canada. Guide to subjects assigned, Pakistani vs Canadian law differences, timeline, and exam strategy.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for Pakistani Lawyers", "item": "https://www.thencahub.com/nca-for-pakistani-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How many NCA exams do Pakistani lawyers typically need?", "acceptedAnswer": {"@type": "Answer", "text": "Pakistani lawyers are typically assigned 5 to 7 NCA challenge exams, with all five mandatory subjects usually required plus potentially Property Law and/or Contracts."}},
        {"@type": "Question", "name": "Can Pakistani lawyers write NCA exams from Pakistan?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. NCA exams are online-proctored and can be written from anywhere with a stable internet connection, working webcam, and microphone."}}
      ]
    }
  ]
}"""

pages["nca-for-pakistani-lawyers"] = {
    "title": "NCA for Pakistani Lawyers: Complete 2026 Guide — The NCA Hub",
    "desc": "Pakistani lawyers typically need 5–7 NCA challenge exams to qualify in Canada. Guide to subjects assigned, Pakistani vs Canadian law differences, timeline, and open-book exam strategy.",
    "eyelet": "Pakistani Lawyers · Canada Qualification Guide",
    "h1": "NCA for Pakistani-Qualified Lawyers: The Complete 2026 Guide",
    "sub": "Pakistani-qualified lawyers are assessed as common law trained and typically assigned 5–7 NCA challenge exams. Complete guide to your path to practising law in Canada.",
    "sections": pak_sections,
    "faqs": pak_faqs,
    "schema": pak_schema
}

# ─── JAMAICA ──────────────────────────────────────────────────────────────────
jam_sections = """
<section class="hub-sec">
  <h2 class="hub-sec-title">What subjects do Jamaican lawyers need to write?</h2>
  <p>Jamaican lawyers who qualified through the Norman Manley Law School and the Council of Legal Education are assessed as common law trained. Jamaica's legal system is based on English common law. The NCA typically assigns <strong>4 to 6 NCA challenge exams</strong>.</p>
  <table class="subj-table">
    <thead><tr><th>Subject</th><th>Notes for Jamaican Lawyers</th></tr></thead>
    <tbody>
      <tr><td>Administrative Law</td><td>Vavilov — significant differences from English/Jamaican review</td></tr>
      <tr><td>Constitutional Law</td><td>Charter analysis differs from Jamaican Constitution</td></tr>
      <tr><td>Criminal Law</td><td>Common law foundations shared; specific rules differ</td></tr>
      <tr><td>Foundations of Canadian Law</td><td>Bijural system; statutory interpretation differences</td></tr>
      <tr><td>Professional Responsibility</td><td>Federation Model Code — different from JBA rules</td></tr>
    </tbody>
  </table>
  <p>Jamaican lawyers with strong common law training often find Criminal Law more familiar than candidates from civil law jurisdictions. Administrative Law and Foundations of Canadian Law require the most dedicated preparation.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Jamaica to Canada — qualification path</h2>
  <ul>
    <li><strong>NCA assessment:</strong> Submit transcripts and syllabi. Processing: 8–16 weeks.</li>
    <li><strong>Complete Indigenous Law competency</strong> (mandatory since March 2026).</li>
    <li><strong>Write NCA challenge exams</strong> — January, April, June, or November 2026.</li>
    <li><strong>Complete LRW if required.</strong></li>
    <li><strong>Apply for COQ, then articling and bar exams.</strong></li>
  </ul>
  <p>Total timeline: <strong>2.5–4 years</strong> from NCA application to call — faster than many internationally trained lawyers given Jamaica's strong common law foundation.</p>
</section>

<section class="hub-sec">
  <h2 class="hub-sec-title">Further reading</h2>
  <ul>
    <li><a href="/blog/article-e4-nca-process-timeline/">NCA process timeline 2026</a></li>
    <li><a href="/blog/article-a2-nca-exam-format/">NCA exam format explained</a></li>
    <li><a href="/blog/nca-exam-complete-guide/">NCA exams — the complete guide</a></li>
  </ul>
</section>
"""

jam_faqs = """
  <div class="faq-item">
    <p class="faq-q">How many NCA exams do Jamaican lawyers typically need?</p>
    <p class="faq-a">Jamaican lawyers are typically assigned 4 to 6 NCA challenge exams. Jamaica's strong common law tradition means some candidates receive partial credit for subjects like Criminal Law, but all five mandatory subjects are usually required in full.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Is a Jamaican LLB (UWI or UCC) recognised by the NCA?</p>
    <p class="faq-a">Yes. LLB degrees from UWI (University of the West Indies) and other Jamaican institutions are assessed by the NCA. The NCA will review your transcripts and syllabi and specify which challenge exams you must write.</p>
  </div>
  <div class="faq-item">
    <p class="faq-q">Which Canadian province is best for Jamaican lawyers?</p>
    <p class="faq-a">Ontario has the largest Caribbean community in Canada and the largest legal market. Many Jamaican lawyers choose to article in Ontario. British Columbia and Alberta are also common destinations.</p>
  </div>
"""

jam_schema = """{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "NCA for Jamaican Lawyers: Complete 2026 Guide — The NCA Hub",
      "url": "https://www.thencahub.com/nca-for-jamaican-lawyers/",
      "description": "Jamaican lawyers typically need 4–6 NCA challenge exams to qualify in Canada. Complete guide to subjects assigned, timeline, and open-book exam strategy.",
      "publisher": {"@type": "Organization", "name": "The NCA Hub", "url": "https://www.thencahub.com"}
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com/"},
        {"@type": "ListItem", "position": 2, "name": "NCA for Jamaican Lawyers", "item": "https://www.thencahub.com/nca-for-jamaican-lawyers/"}
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "How many NCA exams do Jamaican lawyers typically need?", "acceptedAnswer": {"@type": "Answer", "text": "Jamaican lawyers are typically assigned 4 to 6 NCA challenge exams. Jamaica's strong common law tradition means some candidates may receive partial credit, but all five mandatory subjects are usually required."}},
        {"@type": "Question", "name": "Is a Jamaican LLB recognised by the NCA?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. LLB degrees from UWI and other Jamaican institutions are assessed by the NCA. Transcripts and syllabi will determine which challenge exams you must write."}}
      ]
    }
  ]
}"""

pages["nca-for-jamaican-lawyers"] = {
    "title": "NCA for Jamaican Lawyers: Complete 2026 Guide — The NCA Hub",
    "desc": "Jamaican lawyers typically need 4–6 NCA challenge exams to qualify in Canada. Complete guide to subjects assigned, timeline, and open-book exam strategy for internationally trained lawyers.",
    "eyelet": "Jamaican Lawyers · Canada Qualification Guide",
    "h1": "NCA for Jamaican-Qualified Lawyers: The Complete 2026 Guide",
    "sub": "Jamaican lawyers are assessed as common law trained and typically assigned 4–6 NCA challenge exams. Here is your complete path to practising law in Canada.",
    "sections": jam_sections,
    "faqs": jam_faqs,
    "schema": jam_schema
}

# Write all pages
base = "/home/user/THE-NCA-HUB"
for slug, data in pages.items():
    out_dir = os.path.join(base, slug)
    os.makedirs(out_dir, exist_ok=True)
    html = build_page(slug, data["title"], data["desc"], data["eyelet"], data["h1"], data["sub"], data["sections"], data["faqs"], data["schema"])
    out_path = os.path.join(out_dir, "index.html")
    with open(out_path, "w") as f:
        f.write(html)
    print(f"Written: {out_path}")

print("\nAll 6 country hub pages written.")
