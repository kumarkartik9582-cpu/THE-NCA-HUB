const fs = require('fs');
const path = require('path');

const BLOG_DIR = '/home/user/THE-NCA-HUB/blog';

// Article metadata for related articles cards
const ARTICLES = {
  'article-a2-nca-exam-format': {
    title: 'NCA Exam Format Explained: What Happens on Exam Day (2026)',
    desc: 'Room setup, question types, time strategy, proctoring rules for the 3-hour open-book NCA exam.',
    subject: null
  },
  'article-a3-administrative-law-nca': {
    title: 'NCA Canadian Administrative Law Guide 2026',
    desc: 'Vavilov standard of review, Baker procedural fairness, Doré Charter distinction — with a complete answer template.',
    subject: 'administrative-law'
  },
  'article-a4-nca-readiness-score': {
    title: 'NCA Readiness Score: Are You Ready to Sit Your Exam?',
    desc: 'Five dimensions of NCA exam readiness scored 0–100, with a specific action plan for every result band.',
    subject: null
  },
  'article-b1-constitutional-law-nca': {
    title: 'NCA Constitutional Law 2026: Charter Analysis & Oakes Test',
    desc: 'Charter analysis, division of powers, the Oakes test, and Aboriginal rights under s.35 — with a full answer template.',
    subject: 'constitutional-law'
  },
  'article-b2-criminal-law-nca': {
    title: 'NCA Criminal Law Exam Guide 2026',
    desc: 'Actus reus, mens rea, self-defence under s.34, inchoate offences — and the answer structure that separates pass from fail.',
    subject: 'criminal-law'
  },
  'article-b3-professional-responsibility-nca': {
    title: 'NCA Professional Responsibility Exam Guide 2026',
    desc: 'Model Code of Professional Conduct, conflicts of interest, confidentiality, withdrawal — with the answer template.',
    subject: 'professional-responsibility'
  },
  'article-b4-foundations-canadian-law-nca': {
    title: 'NCA Foundations of Canadian Law: Complete 2026 Guide',
    desc: 'Sources of law, statutory interpretation, common law vs Civil Code — the subject most candidates underestimate.',
    subject: 'foundations-of-canadian-law'
  },
  'article-c1-failed-nca-exam': {
    title: 'Failed the NCA Exam? Complete Retake Strategy & Recovery Plan',
    desc: 'Failure autopsy framework: what actually went wrong, how to diagnose it, and the retake strategy for next time.',
    subject: null
  },
  'article-c2-nca-proctoring-guide': {
    title: 'NCA Exam Proctoring: Complete Technical Setup Guide 2026',
    desc: 'MonitorEDU, secure browser, Google Meet phone connection, systems test deadline, and the full exam-day checklist.',
    subject: null
  },
  'article-c3-one-month-nca-prep': {
    title: 'Is One Month Enough to Prepare for the NCA? (2026)',
    desc: 'Honest answer and a day-by-day 30-day schedule. For the right subjects, in the right conditions — yes.',
    subject: null
  },
  'article-c4-nca-textbook-necessary': {
    title: 'Do You Need the NCA Textbook? The Honest Answer',
    desc: 'For most candidates, no. Here is why — and what to use instead that actually helps you pass.',
    subject: null
  },
  'article-c5-nca-exam-anxiety': {
    title: 'NCA Exam Anxiety: What It Actually Is and What to Do',
    desc: 'The real causes, rational responses, and specific techniques for the 72 hours before and during the exam.',
    subject: null
  },
  'article-d1-nca-prep-materials-compared': {
    title: 'NCA Prep Materials Compared 2026: What to Look For',
    desc: 'Volume vs precision, live class vs async — the evaluation framework before you spend money on any NCA course.',
    subject: null
  },
  'article-d2-nca-to-bar-exam': {
    title: 'NCA to Bar Exam in Canada: Complete Step-by-Step Guide',
    desc: 'How to transition to the Ontario Bar, BC Bar, or NCA articling — timelines, costs, and what nobody tells you.',
    subject: null
  },
  'article-d3-nca-indian-lawyers': {
    title: 'How Many NCA Exams Do Indian LLB Graduates Need?',
    desc: 'Most candidates need 5–7 NCA challenge exams. Which subjects, typical assessment, and how to prepare efficiently.',
    subject: null
  },
  'article-d4-nca-uk-based-lawyers': {
    title: 'How UK Lawyers Qualify in Canada via NCA (2026)',
    desc: 'Which subjects transfer, which require attention, common pitfalls, and the UK to Canada transition strategy.',
    subject: null
  },
  'article-e1-nca-study-schedule-working': {
    title: 'NCA Study Schedule for Working Professionals: 2-Hour Daily Formula',
    desc: 'Week-by-week breakdown for candidates balancing full-time work — the 2-hour daily study window that works.',
    subject: null
  },
  'article-e2-nca-vs-bar-exam': {
    title: 'NCA vs Bar Exam Canada: Format, Cost & Strategy (2026)',
    desc: 'NCA tests legal knowledge. Bar exams test procedure. Different formats, different preparation — exactly how they differ.',
    subject: null
  },
  'article-e3-nca-study-hours': {
    title: 'How Many Hours to Study for the NCA Exam?',
    desc: 'Subject-by-subject NCA study hour breakdowns. What 80 hours vs 200 hours actually looks like.',
    subject: null
  },
  'article-e4-nca-process-timeline': {
    title: 'NCA Process Timeline 2026: Assessment to Certificate of Qualification',
    desc: 'Assessment, mandatory subjects, Indigenous Law competency, LRW, COQ application, articling, and bar exams.',
    subject: null
  },
  'article-e5-300-page-notes-worth-it': {
    title: '300-Page NCA Notes vs Short Notes: Why Shorter Wins',
    desc: 'Volume is a liability in a 3-hour open-book exam. Why structured templates outperform lengthy notes.',
    subject: null
  },
  'article-e6-nca-live-classes-vs-self-study': {
    title: 'NCA Live Classes vs Self-Study: Which Works Better? (2026)',
    desc: 'Cost, time, discipline requirements, and learning styles compared — when to pay for live instruction.',
    subject: null
  },
  'article-e7-nca-study-checklist': {
    title: 'NCA Study Checklist: Complete Pre-Exam Guide 2026',
    desc: 'Daily study habits, weekly reviews, MonitorEDU technical setup, exam day sequence, and the 48-hour protocol.',
    subject: null
  },
  'article-e8-nca-pass-criteria': {
    title: 'NCA Pass Criteria 2026: Pass Mark, Results & Re-sits',
    desc: 'NCA exams pass at 50%. Results take 10–12 weeks. You get 3 attempts per subject. Everything confirmed from nca.legal.',
    subject: null
  },
  'article-f1-nca-policy-changes-2026': {
    title: 'NCA Policy Changes 2026: Indigenous Law & Language Screening',
    desc: 'Mandatory Indigenous Law competency, language screening before assessment, and updated exam session scheduling.',
    subject: null
  },
  'article-f2-nca-nigerian-lawyers': {
    title: 'NCA for Nigerian-Qualified Lawyers: Complete 2026 Guide',
    desc: 'Your NCA assessment profile, typical subjects assigned, Nigerian vs Canadian law differences, and your full path to practice.',
    subject: null
  },
  'article-f3-nca-philippine-lawyers': {
    title: 'NCA Exams for Philippine Lawyers 2026',
    desc: 'Mixed jurisdiction assessment — typically 7–8 subjects. Full breakdown, timeline, and preparation strategy.',
    subject: null
  },
  'article-pass-nca-90-days': {
    title: 'How to Pass the NCA Exam in 90 Days: Week-by-Week Plan',
    desc: 'The exact framework used to pass 4 NCA subjects in under 3 months — week-by-week calendar and subject sequencing.',
    subject: null
  },
  'nca-exam-complete-guide': {
    title: 'NCA Exams Canada: The Complete Guide (2026)',
    desc: 'Who qualifies, which subjects are required, how to study, and how to get called to the Bar. The definitive guide.',
    subject: null
  }
};

// Related articles for each article (3 per article)
const RELATED = {
  'article-a2-nca-exam-format': ['article-c2-nca-proctoring-guide','article-e7-nca-study-checklist','article-e8-nca-pass-criteria'],
  'article-a3-administrative-law-nca': ['article-b1-constitutional-law-nca','article-b4-foundations-canadian-law-nca','article-e3-nca-study-hours'],
  'article-a4-nca-readiness-score': ['article-e3-nca-study-hours','article-c3-one-month-nca-prep','article-e7-nca-study-checklist'],
  'article-b1-constitutional-law-nca': ['article-a3-administrative-law-nca','article-b4-foundations-canadian-law-nca','article-e3-nca-study-hours'],
  'article-b2-criminal-law-nca': ['article-b1-constitutional-law-nca','article-b3-professional-responsibility-nca','article-e3-nca-study-hours'],
  'article-b3-professional-responsibility-nca': ['article-b2-criminal-law-nca','article-b4-foundations-canadian-law-nca','article-e3-nca-study-hours'],
  'article-b4-foundations-canadian-law-nca': ['article-a3-administrative-law-nca','article-b1-constitutional-law-nca','article-e3-nca-study-hours'],
  'article-c1-failed-nca-exam': ['article-e8-nca-pass-criteria','article-a4-nca-readiness-score','article-c3-one-month-nca-prep'],
  'article-c2-nca-proctoring-guide': ['article-a2-nca-exam-format','article-e7-nca-study-checklist','article-c5-nca-exam-anxiety'],
  'article-c3-one-month-nca-prep': ['article-e3-nca-study-hours','article-e1-nca-study-schedule-working','article-article-pass-nca-90-days'],
  'article-c4-nca-textbook-necessary': ['article-d1-nca-prep-materials-compared','article-e5-300-page-notes-worth-it','article-e6-nca-live-classes-vs-self-study'],
  'article-c5-nca-exam-anxiety': ['article-a4-nca-readiness-score','article-e7-nca-study-checklist','article-c2-nca-proctoring-guide'],
  'article-d1-nca-prep-materials-compared': ['article-c4-nca-textbook-necessary','article-e5-300-page-notes-worth-it','article-e6-nca-live-classes-vs-self-study'],
  'article-d2-nca-to-bar-exam': ['article-e4-nca-process-timeline','article-e2-nca-vs-bar-exam','article-article-pass-nca-90-days'],
  'article-d3-nca-indian-lawyers': ['article-e4-nca-process-timeline','article-c3-one-month-nca-prep','nca-exam-complete-guide'],
  'article-d4-nca-uk-based-lawyers': ['article-e4-nca-process-timeline','article-e2-nca-vs-bar-exam','nca-exam-complete-guide'],
  'article-e1-nca-study-schedule-working': ['article-e3-nca-study-hours','article-c3-one-month-nca-prep','article-pass-nca-90-days'],
  'article-e2-nca-vs-bar-exam': ['article-d2-nca-to-bar-exam','article-e4-nca-process-timeline','nca-exam-complete-guide'],
  'article-e3-nca-study-hours': ['article-e1-nca-study-schedule-working','article-a4-nca-readiness-score','article-pass-nca-90-days'],
  'article-e4-nca-process-timeline': ['article-d2-nca-to-bar-exam','article-e2-nca-vs-bar-exam','nca-exam-complete-guide'],
  'article-e5-300-page-notes-worth-it': ['article-c4-nca-textbook-necessary','article-d1-nca-prep-materials-compared','article-e6-nca-live-classes-vs-self-study'],
  'article-e6-nca-live-classes-vs-self-study': ['article-d1-nca-prep-materials-compared','article-e5-300-page-notes-worth-it','article-c4-nca-textbook-necessary'],
  'article-e7-nca-study-checklist': ['article-a2-nca-exam-format','article-c2-nca-proctoring-guide','article-e3-nca-study-hours'],
  'article-e8-nca-pass-criteria': ['article-c1-failed-nca-exam','article-a4-nca-readiness-score','article-a2-nca-exam-format'],
  'article-f1-nca-policy-changes-2026': ['article-e4-nca-process-timeline','nca-exam-complete-guide','article-a2-nca-exam-format'],
  'article-f2-nca-nigerian-lawyers': ['article-e4-nca-process-timeline','nca-exam-complete-guide','article-c3-one-month-nca-prep'],
  'article-f3-nca-philippine-lawyers': ['article-e4-nca-process-timeline','nca-exam-complete-guide','article-c3-one-month-nca-prep'],
  'article-pass-nca-90-days': ['article-e3-nca-study-hours','article-e1-nca-study-schedule-working','article-c3-one-month-nca-prep'],
  'nca-exam-complete-guide': ['article-e4-nca-process-timeline','article-a2-nca-exam-format','article-e8-nca-pass-criteria']
};

// Fix: article-c3 had a typo in related; use correct slug
RELATED['article-c3-one-month-nca-prep'] = ['article-e3-nca-study-hours','article-e1-nca-study-schedule-working','article-pass-nca-90-days'];

// Subject CTA data
const SUBJECT_CTAS = {
  'administrative-law': {
    eyelet: 'Administrative Law Notes',
    title: 'Administrative Law notes — precision-built for NCA.',
    sub: 'Vavilov, Baker, Doré, and every standard of review variation — structured for 3-hour open-book conditions. The same notes used to clear Administrative Law.',
    btnText: 'See Administrative Law Notes →',
    btnHref: '/notes/administrative-law/'
  },
  'constitutional-law': {
    eyelet: 'Constitutional Law Notes',
    title: 'Constitutional Law notes — precision-built for NCA.',
    sub: 'Charter analysis, division of powers, the Oakes test, Aboriginal rights under s.35 — structured for 3-hour open-book conditions.',
    btnText: 'See Constitutional Law Notes →',
    btnHref: '/notes/constitutional-law/'
  },
  'criminal-law': {
    eyelet: 'Criminal Law Notes',
    title: 'Criminal Law notes — precision-built for NCA.',
    sub: 'Actus reus, mens rea, defences, inchoate offences — every answer template you need for the 3-hour open-book NCA exam.',
    btnText: 'See Criminal Law Notes →',
    btnHref: '/notes/criminal-law/'
  },
  'professional-responsibility': {
    eyelet: 'Professional Responsibility Notes',
    title: 'Professional Responsibility notes — precision-built for NCA.',
    sub: 'Federation Model Code, conflicts of interest, confidentiality, withdrawal — the answer template that pre-structures every PR question.',
    btnText: 'See Professional Responsibility Notes →',
    btnHref: '/notes/professional-responsibility/'
  },
  'foundations-of-canadian-law': {
    eyelet: 'Foundations of Canadian Law Notes',
    title: 'Foundations of Canadian Law notes — precision-built for NCA.',
    sub: 'Sources of law, statutory interpretation, common law vs Civil Code — structured notes for the subject most candidates underestimate.',
    btnText: 'See Foundations of Canadian Law Notes →',
    btnHref: '/notes/foundations-of-canadian-law/'
  },
  null: {
    eyelet: 'Study Notes',
    title: 'Notes built to clear every NCA subject.',
    sub: 'Precision study notes for all 5 NCA subjects — Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Built for internationally trained lawyers.',
    btnText: 'Browse All Notes →',
    btnHref: '/notes/'
  }
};

function buildCTAHtml(subject) {
  const cta = SUBJECT_CTAS[subject] || SUBJECT_CTAS[null];
  return `\n      <!-- Subject CTA -->
      <div class="art-notes-cta">
        <p class="art-notes-eyelet">${cta.eyelet}</p>
        <h3 class="art-notes-title">${cta.title}</h3>
        <p class="art-notes-sub">${cta.sub}</p>
        <a href="${cta.btnHref}" class="art-notes-btn">${cta.btnText}</a>
      </div>\n`;
}

function buildRelatedHtml(slug) {
  const relatedSlugs = RELATED[slug] || [];
  const cards = relatedSlugs.map(s => {
    const art = ARTICLES[s];
    if (!art) return '';
    return `        <a href="/blog/${s}/" class="rel-card">
          <div class="rel-card-title">${art.title}</div>
          <div class="rel-card-desc">${art.desc}</div>
        </a>`;
  }).join('\n');

  return `\n  <div class="related-articles" style="max-width:720px;margin:0 auto;padding:48px 72px 0;">
    <p class="rel-eyelet">Related Guides</p>
    <div class="rel-grid">
${cards}
    </div>
  </div>\n`;
}

// CSS to inject into <style> block
const CTA_CSS = `
/* Subject-specific notes CTA */
.art-notes-cta{background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.03));border:1px solid rgba(201,168,76,.25);border-radius:4px;padding:44px 48px;margin:56px 0 48px;text-align:center}
@media(max-width:640px){.art-notes-cta{padding:32px 24px;margin:40px 0 36px}}
.art-notes-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:14px}
.art-notes-title{font-family:var(--fd);font-size:clamp(1.3rem,2.8vw,2rem);font-weight:300;color:var(--cream);line-height:1.25;margin-bottom:14px}
.art-notes-sub{font-size:var(--body);color:var(--fog);line-height:1.7;margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto}
.art-notes-btn{display:inline-block;padding:14px 40px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:var(--nano);font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo),background .3s;border-radius:2px}
.art-notes-btn:hover{transform:translateY(-2px);background:var(--g0)}
/* Related articles */
.related-articles{padding:48px 72px 0}
@media(max-width:640px){.related-articles{padding:36px 24px 0}}
.rel-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g2);font-weight:600;margin-bottom:24px}
.rel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.rel-card{display:block;padding:24px;border:1px solid rgba(201,168,76,.12);transition:border-color .3s,transform .3s}
.rel-card:hover{border-color:rgba(201,168,76,.35);transform:translateY(-2px)}
.rel-card-title{font-family:var(--fd);font-size:1.05rem;color:var(--cream);line-height:1.3;margin-bottom:10px;font-weight:400}
.rel-card-desc{font-size:.78rem;color:var(--fog);line-height:1.6}`;

let processed = 0;
let errors = [];

const allSlugs = Object.keys(ARTICLES);

for (const slug of allSlugs) {
  const filePath = path.join(BLOG_DIR, slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    errors.push(`MISSING: ${filePath}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has art-notes-cta
  if (html.includes('art-notes-cta')) {
    console.log(`SKIP (already has CTA): ${slug}`);
    processed++;
    continue;
  }

  // 1. Inject CSS into the existing <style> block (before closing </style>)
  if (!html.includes('.art-notes-cta')) {
    html = html.replace('</style>', CTA_CSS + '\n</style>');
  }

  // 2. Insert subject CTA before <h2>Frequently Asked Questions</h2>
  const ctaHtml = buildCTAHtml(ARTICLES[slug].subject);
  if (html.includes('<h2>Frequently Asked Questions</h2>')) {
    html = html.replace('<h2>Frequently Asked Questions</h2>', ctaHtml + '      <h2>Frequently Asked Questions</h2>');
  } else {
    // Insert before author bio as fallback
    html = html.replace('<hr>\n\n      <!-- Visible author bio', ctaHtml + '      <hr>\n\n      <!-- Visible author bio');
  }

  // 3. Insert related articles section after <a href="/blog/" class="art-back">
  const relatedHtml = buildRelatedHtml(slug);
  const artBackPattern = `    <a href="/blog/" class="art-back">← Back to all articles</a>
  </div>`;
  if (html.includes(artBackPattern)) {
    html = html.replace(artBackPattern, `    <a href="/blog/" class="art-back">← Back to all articles</a>
  </div>${relatedHtml}`);
  } else {
    // Try alternative pattern
    const altPattern = `<a href="/blog/" class="art-back">← Back to all articles</a>`;
    if (html.includes(altPattern)) {
      html = html.replace(altPattern, `<a href="/blog/" class="art-back">← Back to all articles</a>`);
      // Insert related after closing div that contains art-back
      html = html.replace(
        /(<a href="\/blog\/" class="art-back">← Back to all articles<\/a>\s*<\/div>)/,
        `$1${relatedHtml}`
      );
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`DONE: ${slug}`);
  processed++;
}

console.log(`\nProcessed: ${processed}/${allSlugs.length}`);
if (errors.length) console.log('Errors:', errors);
