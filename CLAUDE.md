# THE NCA HUB — MASTER ORCHESTRATION PROMPT v2.0
## Integrates: Obra Superpowers · SuperClaude Framework · Awesome Claude Code
## Mission: Implement all 60 strategic opportunities. Revenue first. Zero hallucination. No errors.

---

# SECTION 0: READ THIS BEFORE ANYTHING ELSE

You have three powerful frameworks available in this repository. You MUST use them
intelligently. Misusing them wastes tokens and creates conflicts. Read Section 1 first,
then Section 2, then begin execution.

**Your role:** You are the Orchestrator for The NCA Hub's complete build-out. You have
a 1M token context window. Use it wisely. Spawn subagents for independent tasks. Use
Superpowers skills for workflow discipline. Use SuperClaude personas for domain expertise.
Use awesome-claude-code tools for specialized capabilities. Never duplicate work. Never
hallucinate facts. Never touch working functionality.

---

# SECTION 1: THE THREE FRAMEWORKS — HOW TO USE THEM

## 1.1 Obra Superpowers (obra/superpowers)

**What it is:** A skills-based workflow framework that enforces discipline: Brainstorm
→ Write Plan → Execute with subagents. Every task gets a 2-stage review (spec compliance,
then code quality). Skills load lazily — ~100 tokens to discover, ~5k when activated.

**How it is installed in this repo:**
Check if installed:
```bash
ls ~/.claude/plugins/ | grep superpowers
ls .claude/ 2>/dev/null
```
If not installed: `/plugin marketplace add obra/superpowers-marketplace` then
`/plugin install superpowers@superpowers-marketplace`

**Key skills to use for this project:**
- `superpowers:brainstorming` — use before building any new tool or feature
- `superpowers:writing-plans` — use to decompose each Phase into 2-5 minute tasks
- `superpowers:subagent-driven-development` — use to execute independent tasks in parallel
- `superpowers:verification-before-completion` — use after every task to confirm it actually works
- `superpowers:systematic-debugging` — use when anything breaks

**Critical Superpowers rules:**
- NEVER skip brainstorming for new features — the skill enforces this with a HARD-GATE
- User instructions in this CLAUDE.md override all Superpowers defaults
- Do NOT enter Claude's native Plan Mode — Superpowers intercepts and routes through
  its own planning workflow
- Skills override default system behavior but THIS FILE overrides skills

**For this project:** Use `superpowers:subagent-driven-development` to run independent
tasks in parallel. Tasks within the same Phase that do NOT touch the same file can run
simultaneously. Tasks that touch the same file must run sequentially.

## 1.2 SuperClaude Framework

**What it is:** A configuration framework providing 30 slash commands and 9 cognitive
personas. Personas determine how Claude approaches a problem. Commands define what to do.

**How it is installed:**
Check: `ls awesome-claude-code/ | grep -i super` and `cat .claude/CLAUDE.md 2>/dev/null | head -20`
If SuperClaude is in the repo's `awesome-claude-code` folder, the configs may need
to be installed to `~/.claude/`. Run `cat awesome-claude-code/README.md | head -50`
to understand the installation state.

**The 9 personas — use these deliberately:**

| Persona flag | Use for |
|---|---|
| `--persona-architect` | Designing the AI study assistant, mock exam system |
| `--persona-frontend` | Building interactive tools, calculators, quiz interfaces |
| `--persona-backend` | API integration (Anthropic API, Mailchimp, Payhip) |
| `--persona-analyzer` | SEO audits, CTR analysis, conversion analysis |
| `--persona-mentor` | Writing email drip sequences, tutorial content |
| `--persona-performance` | Optimizing page load, reducing JS size |
| `--persona-security` | Protecting API keys, watermarking PDFs |
| `--persona-qa` | Testing every feature before commit |
| `--persona-refactorer` | Cleaning up code after multi-agent builds |

**Key slash commands for this project:**
- `/sc:research` — for competitor analysis, NCA modernization research
- `/sc:analyze --code --persona-analyzer` — for SEO and CTR analysis
- `/sc:design --api --persona-architect` — for the AI study assistant architecture
- `/sc:implement --persona-frontend` — for interactive tools
- `/sc:improve --persona-performance` — for Lighthouse score improvements
- `/sc:document --persona-mentor` — for email sequences and content

**Token efficiency:** SuperClaude includes built-in context compression. When working
with large files, use `--uc` (ultra-compressed) flag to reduce token usage by ~70%.

## 1.3 Awesome Claude Code

**What it is:** A curated collection of 400+ tools, skills, agents, and workflows.
Your repo contains the `awesome-claude-code` folder. Check what's inside:
```bash
ls awesome-claude-code/
cat awesome-claude-code/README.md | head -100
```

**Tools to activate from awesome-claude-code for this project:**
- SEO skills (if seo-geo-claude-skills is present): use for the 9 CTR fixes
- Marketing skills: use for email copy and CRO improvements
- Any subagent collections: spawn specialized agents for independent tasks

## 1.4 Priority Hierarchy (read carefully)

```
1. THIS CLAUDE.md FILE — highest authority, overrides everything
2. User instructions typed directly into terminal
3. Superpowers skills (workflow discipline)
4. SuperClaude personas and commands (domain expertise)
5. Awesome Claude Code tools (specialized capabilities)
6. Claude Code native behavior (fallback only)
```

If any framework conflicts with this file, follow THIS FILE.

---

# SECTION 2: PROJECT CONTEXT — DO NOT CONTRADICT THESE FACTS

## 2.1 The NCA Hub

Website: thencahub.com | Repo: kumarkartik9582-cpu/THE-NCA-HUB | GitHub Pages static site
Technology: Pure HTML, CSS, vanilla JavaScript ONLY. No npm. No React. No build tools.
Founder: Kartik Kumar (Indian-qualified lawyer, NCA passed, UK law firm experience)

## 2.2 Verified Business Data (source: Payhip + Google Search Console)

- Monthly revenue: CAD $875 (as of April 2026)
- Monthly Payhip views: 527 | Orders: 5 | Conversion: 1%
- Checkout starts: 75/month | Completions: 5 (6.7% — 93.3% abandonment)
- Direct traffic: 521/527 | Google: 6/527 | Google purchases: 0
- Google impressions/month: ~4,000 | Clicks: ~331 | Average CTR: 1.4%
- India: #2 traffic country (65 clicks, 5.3% CTR) — CORE MARKET
- Jamaica: highest CTR country (24.6%) — highly engaged audience

## 2.3 The 9 Pages That Are Costing You Traffic (fix these — do not change content, only title/meta)

| Page | Impressions | Clicks | CTR | Priority |
|------|-------------|--------|-----|----------|
| /blog/article-d3-nca-indian-lawyers/ | 1,390 | 0 | 0% | CRITICAL |
| /blog/nca-exam-complete-guide/ | 2,167 | 4 | 0.18% | CRITICAL |
| /nca-statistics/ | 2,218 | 12 | 0.54% | HIGH |
| /nca-exam-dates-2026/ | 2,003 | 12 | 0.60% | HIGH |
| /blog/article-d2-nca-to-bar-exam/ | 1,443 | 1 | 0.07% | HIGH |
| /become-a-lawyer-in-ontario/ | 1,288 | 2 | 0.16% | HIGH |
| /blog/article-e4-nca-process-timeline/ | 1,917 | 8 | 0.42% | MEDIUM |
| /nca-cost-calculator/ | 927 | 2 | 0.22% | MEDIUM |
| /faq/ | 793 | 4 | 0.50% | MEDIUM |

## 2.4 Verified Pricing (NEVER CHANGE THESE)

- Notes Only per subject: $149 CAD
- Complete System per subject: $175 CAD
- All 5 Bundle: $749 CAD
- Payhip store: payhip.com/THENCAHUB
- Admin Law direct: payhip.com/b/UNbgM

## 2.5 The 2026 NCA Exam Schedule (authoritative — do not alter)

Reference date for all calculations: April 11, 2026

Next exam by subject:
- Professional Responsibility: May 4, 2026 (23 days) — reg CLOSED Apr 2
- Criminal Law: May 12, 2026 (31 days) — reg CLOSED Apr 2
- Administrative Law: Jun 2, 2026 (52 days) — reg closes May 7 (OPEN)
- Constitutional Law: Jul 7, 2026 (87 days) — reg closes Jun 11 (OPEN)
- Foundations of Canadian Law: Jul 14, 2026 (94 days) — reg closes Jun 11 (OPEN)
- Property Law: Jun 1, 2026 (51 days) — reg closes May 7 (OPEN)

Full schedule details are in the existing CLAUDE.md (the previous master prompt).
Do NOT use `new Date()` for exam countdowns — use hardcoded `new Date(2026,3,11)` as
the reference date.

## 2.6 Competitive Threat Intelligence

- LawSikho (India): Just launched NCA prep targeting Indian lawyers. Millions of
  subscribers via iPleaders blog. Cohort-based (not always available). THREAT LEVEL: HIGH.
- NCA Mentor (Vanessa): 10 years, 200+ Q&A documents, video recordings, live classes.
  No website tools. THREAT LEVEL: MEDIUM (established but not innovating).
- NCA Tutor: Posting exam result announcements (traffic spike strategy). Hybrid format 2026.
- Universities: $6,000-8,000 for NCA courses. NCA Hub is $175. Not a direct competitor.

## 2.7 What Content MUST NOT Be Revealed For Free (protect these for revenue)

- Full notes content (only free chapter available per subject)
- Answer templates (preview only in notes pages, not full text)
- Practice questions and model answers (paid product)
- Full AI study assistant usage (should require email capture or notes purchase)

---

# SECTION 3: TOOL AUDIT BEFORE STARTING

Before executing any task, run these commands and read every output:

```bash
# 1. Check actual repo structure
find . -type d | grep -E "awesome-claude|superpowers|SuperClaude" | head -20

# 2. Check SuperClaude installation
ls awesome-claude-code/ 2>/dev/null | head -30
cat awesome-claude-code/README.md 2>/dev/null | head -50

# 3. Check Superpowers
ls ~/.claude/plugins/ 2>/dev/null
ls .claude/ 2>/dev/null

# 4. Check existing AGENTS.md
cat AGENTS.md 2>/dev/null | head -50

# 5. Check TASK.md and PLANNING.md for prior work
cat TASK.md 2>/dev/null | head -50
cat PLANNING.md 2>/dev/null | head -50

# 6. Confirm existing tools are still working
find . -name "index.html" | xargs grep -l "Anthropic API\|fetch.*anthropic" | head -5

# 7. Check what sprint files have already been done
ls sprint*.py | head -20

# 8. Understand the site's current CSS variable system
grep -r "var(--" index.html | head -10

# 9. Check the Mailchimp/Formspree setup
grep -n "formspree\|mailchimp" index.html | head -10

# 10. Check the free chapter delivery system
cat free-chapter.html | grep -A 5 "subject\|Select" | head -30
```

Store all findings. Report to yourself before Phase 1 begins.

---

# SECTION 4: THE 60 TASKS — PHASED EXECUTION PLAN

## PHASE 0 — EMERGENCY REVENUE (Do these in your first hour, before all else)
**Use:** `--persona-analyzer` for analysis, `--persona-backend` for implementation
**Superpowers:** Skip full brainstorm for these — they are urgent fixes, not new features
**Expected revenue impact: +$1,500-2,500/month**

### Task 0.1: Abandoned Checkout Recovery Email (Payhip)
Payhip has built-in abandoned checkout email functionality.
- Navigate to payhip.com/THENCAHUB admin panel
- Find the "Abandoned Checkout" or "Marketing Automation" settings
- Enable abandoned checkout email
- Write the email copy using this template:
  Subject: "You left [notes name] behind — your exam is in X days"
  Body: Acknowledge they were looking at the notes. Remind them of the upcoming exam
  date for the subject they were viewing. Include the resit economics ($500 resit vs
  $175 notes). Include a direct checkout link. No more than 150 words.
- Create ONE version that works for all subjects (use Payhip's dynamic variables)
- Timeline: 1 hour after abandonment
- Expected recovery: 15% of 70 monthly abandonments = ~10 extra sales = $1,750/month

**CANNOT be done via code** — this requires Payhip admin panel access. Create a
detailed instruction file at `/docs/PAYHIP_ABANDONED_CHECKOUT_SETUP.md` explaining
exactly what buttons to click and what copy to use, so Kartik can do it in 10 minutes.

### Task 0.2: Fix the 9 CTR-Destroying Pages
For each of the 9 pages in Section 2.3, open the HTML file, find the `<title>` tag
and the `<meta name="description">` tag, and replace them with these exact values:

**Page 1: /blog/article-d3-nca-indian-lawyers/index.html**
```html
<title>NCA Exams for Indian LLB Graduates: How Many Subjects? (2026 Guide)</title>
<meta name="description" content="Most Indian LLB graduates are assigned 5–7 NCA exams. This guide covers exactly which subjects, why, and how long it takes. Verified 2026 data.">
```

**Page 2: /blog/nca-exam-complete-guide/index.html**
```html
<title>NCA Exam Complete Guide 2026: Open-Book, 3 Hours, Online-Proctored</title>
<meta name="description" content="Everything internationally trained lawyers need to know about NCA exams — format, question types, time strategy, and what open-book actually means. Updated 2026.">
```

**Page 3: /nca-statistics/index.html**
```html
<title>NCA Exam Pass Rates & Statistics 2026 — Official Data</title>
<meta name="description" content="NCA pass rates by subject, candidate volumes, assessment fees, and exam statistics. Data sourced from official NCA publications and Law Society annual reports.">
```

**Page 4: /nca-exam-dates-2026/index.html**
```html
<title>NCA Exam Dates 2026 — Full Schedule with Registration Deadlines</title>
<meta name="description" content="Complete 2026 NCA exam schedule by subject: Administrative Law (Jun 2), Constitutional Law (Jul 7), Criminal Law (May 12), Foundations (Jul 14). Registration deadlines included.">
```

**Page 5: /blog/article-d2-nca-to-bar-exam/index.html**
```html
<title>NCA to Bar Exam: The Complete Canadian Lawyer Roadmap (2026)</title>
<meta name="description" content="From NCA assessment to call to the bar — every step, every timeline, every cost. Ontario, BC, and Alberta pathways for internationally trained lawyers qualifying in Canada.">
```

**Page 6: /become-a-lawyer-in-ontario/index.html**
```html
<title>How to Become a Lawyer in Ontario as a Foreign Graduate (2026)</title>
<meta name="description" content="NCA process then LSO licensing: articling vs LPP, 3–5 year timeline, $9,000+ costs, Barrister and Solicitor exams. Complete guide for internationally trained lawyers.">
```

**Page 7: /blog/article-e4-nca-process-timeline/index.html**
```html
<title>NCA Process Timeline 2026 — From Assessment to Certificate of Qualification</title>
<meta name="description" content="Real timelines for each NCA stage: assessment 8–16 weeks, exams 10–12 weeks for results, LRW 12 weeks, COQ processing 4–8 weeks. Plan your NCA journey accurately.">
```

**Page 8: /nca-cost-calculator/index.html**
```html
<title>NCA Cost Calculator 2026 — Total Cost to Qualify as a Lawyer in Canada</title>
<meta name="description" content="Calculate your real NCA total: assessment ($400), exams (~$500/subject), LRW ($375), Indigenous Law, COQ. See the full cost before you start — from $4,225 to $10,000+.">
```

**Page 9: /faq/index.html**
```html
<title>NCA Exam FAQ 2026 — Pass Rate, Fees, Schedule & Open-Book Format</title>
<meta name="description" content="Answers to the 15 most common NCA questions: assessment fee ($400), exam fee (~$500), open-book format, 50% pass mark, results timeline (10–12 weeks), and Indigenous Law requirement.">
```

After fixing all 9, also fix this specifically:
Find `/notes/foundations-of-canadian-law/index.html`. This page ranks position 1.5
for "foundations of canadian law nca notes" with zero clicks. The title is wrong.
Update it to:
```html
<title>NCA Foundations of Canadian Law Notes 2026 — Driedger, Indigenous Law & Answer Templates</title>
```

### Task 0.3: Exit-Intent Popup on All 6 Notes Pages
Add this script to all 6 notes pages (`/notes/administrative-law/`, `/notes/constitutional-law/`,
`/notes/criminal-law/`, `/notes/foundations-of-canadian-law/`, `/notes/professional-responsibility/`,
`/notes/property/`):

```javascript
<script>
(function(){
  var shown = false;
  var SUBJECTS = {
    'administrative-law': {name:'Admin Law', date:'Jun 2, 2026', days:52},
    'constitutional-law': {name:'Con Law', date:'Jul 7, 2026', days:87},
    'criminal-law': {name:'Criminal Law', date:'May 12, 2026', days:31},
    'foundations-of-canadian-law': {name:'Foundations', date:'Jul 14, 2026', days:94},
    'professional-responsibility': {name:'Prof Resp', date:'May 4, 2026', days:23},
    'property': {name:'Property Law', date:'Jun 1, 2026', days:51}
  };
  var slug = window.location.pathname.replace(/\//g,'').split('notes').pop().replace(/\//g,'');
  var s = SUBJECTS[slug] || SUBJECTS['administrative-law'];
  
  function showPopup(){
    if(shown) return; shown = true;
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    overlay.innerHTML = '<div style="background:#fff;border-radius:12px;padding:28px 24px;max-width:400px;width:100%;text-align:center">' +
      '<p style="font-size:13px;color:#888;margin-bottom:8px">Before you go —</p>' +
      '<h2 style="font-size:20px;font-weight:500;margin-bottom:10px;color:#111">Your '+s.name+' exam is in '+s.days+' days</h2>' +
      '<p style="font-size:13px;color:#555;margin-bottom:20px">The notes that cleared this exam in 3 months. Under 80 pages. Answer templates included.</p>' +
      '<a href="https://payhip.com/THENCAHUB" style="display:block;background:#185FA5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:10px">Get Complete System — $175 CAD</a>' +
      '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:none;border:none;color:#999;font-size:12px;cursor:pointer;font-family:inherit">No thanks, I\'ll risk the $500 resit</button>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  }
  
  document.addEventListener('mouseleave', function(e){ if(e.clientY < 50) showPopup(); });
  setTimeout(function(){ if(!shown) showPopup(); }, 45000);
})();
</script>
```

Place this script immediately before `</body>` on each notes page.

### Task 0.4: Add Google Business Profile Instructions
Create `/docs/GOOGLE_BUSINESS_PROFILE_SETUP.md` with step-by-step instructions for
Kartik to set up the Google Business Profile (this cannot be done via code). Include:
- Go to business.google.com
- Click "Add your business"
- Category: "Educational Institution" or "Tutoring Service"
- Business name: The NCA Hub
- Website: thencahub.com
- Service area: Canada (nationwide online)
- Description: "NCA exam study notes for internationally trained lawyers qualifying in Canada."

---

## PHASE 1 — AI STUDY ASSISTANT (The Airbnb move)
**Use:** `superpowers:brainstorming` → `superpowers:writing-plans` → build
**Persona:** `/sc:design --api --persona-architect` then `/sc:implement --persona-backend`
**Expected impact: +$500-1,500/month + massive competitive differentiation**

### Task 1.1: Audit the existing nca-chat-widget.js

```bash
cat nca-chat-widget.js | head -100
grep -n "anthropic\|api.anthropic\|fetch" nca-chat-widget.js | head -20
grep -n "system\|prompt\|messages" nca-chat-widget.js | head -20
```

Understand the current implementation before touching it.

### Task 1.2: Design the AI Study Assistant Architecture

The AI study assistant is a web-based interface where NCA candidates:
1. Select their subject (Admin Law, Con Law, Criminal, FCL, PR, Property)
2. Ask a question about that subject ("explain the Vavilov framework")
3. Get a response structured as an exam-ready IRAC answer

**Architecture constraints (static site — no server):**
- All logic runs in the browser via JavaScript
- Notes content is stored as JSON in the repo (extracted from PDFs)
- The Anthropic API is called directly from the browser (API key exposed client-side)
  — this is acceptable because the widget already does this
- Rate limiting: use a simple daily counter stored in localStorage

**System prompt for each subject (this is the key — it uses your notes content):**
```
You are an NCA exam preparation assistant specializing in [SUBJECT].
Your responses must always follow IRAC structure:
- Issue: Identify the legal issue
- Rule: State the applicable Canadian law framework
- Application: Apply the rule to the facts
- Conclusion: Reach a clear conclusion

Key frameworks for this subject: [INJECT SUBJECT-SPECIFIC FRAMEWORK LIST]

IMPORTANT: You are a study tool, not a substitute for the candidate's own notes.
Always tell candidates to verify rules in their study materials.
Never provide complete model answers to practice exam questions — guide candidates
to think through the framework themselves.
```

**Create:** `/nca-ai-assistant/index.html` as a standalone page
**Also embed:** A compact version on each notes subject page

### Task 1.3: Extract Notes Content for RAG

For each subject that has notes in the repo, extract key frameworks into a JSON file:
```bash
find free-chapters/ notes/ -name "*.pdf" | head -10
ls free-chapters/
```

For each PDF found, run:
```python
import subprocess
import json

subjects = {
    'admin': 'Administrative Law',
    'con': 'Constitutional Law',
    'crim': 'Criminal Law',
    'fcl': 'Foundations of Canadian Law',
    'pr': 'Professional Responsibility',
    'property': 'Property Law'
}

# Extract text from each PDF (only the free chapter — not the full notes)
# The free chapters are the only content available to the AI without purchase
for slug, name in subjects.items():
    pdf_path = f'free-chapters/{slug}*.pdf'  # use glob
    # Extract text, store in /data/nca-frameworks.json
```

The JSON structure should be:
```json
{
  "administrative-law": {
    "keyFrameworks": ["Vavilov standard of review", "Baker procedural fairness", "Doré Charter distinction"],
    "systemPromptAddition": "Core frameworks: (1) Vavilov: presumption of reasonableness...",
    "freeChapterContent": "[extracted text from free chapter only]"
  }
}
```

**Critical:** Only use FREE CHAPTER content in the AI. Do not include paid notes content.
The AI should know the frameworks at a surface level, not the full template detail.
This creates natural demand for the paid notes: "For the complete answer template, see
the Admin Law Complete System."

### Task 1.4: Build the AI Assistant Page

**Create:** `/nca-ai-assistant/index.html`

The page should:
- Have a subject selector dropdown (9 subjects)
- A chat interface (question input, answer display)
- The system prompt is loaded from `/data/nca-frameworks.json` based on selected subject
- Each answer ends with: "For the complete answer template and all exam frameworks,
  see the [Subject] Complete System →" linking to the relevant notes page
- Mobile-responsive
- Rate limiting: 5 questions per session (localStorage counter)
- After hitting the limit: "You've used your daily questions. Get the Complete System
  for unlimited AI assistance and the full answer templates."

**API call pattern** (copy from nca-chat-widget.js pattern):
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: systemPrompt, // loaded from nca-frameworks.json
    messages: [{role: 'user', content: userQuestion}]
  })
});
```

**Revenue gate:** After 5 questions, show: "Enjoying the AI assistant? Get unlimited
access when you purchase the Complete System for [subject] →"

---

## PHASE 2 — EMAIL DRIP SEQUENCE
**Use:** `/sc:implement --persona-mentor` | Write, do not build code — create the actual emails
**Expected impact: +$700-1,200/month (8-12% of free chapter subscribers convert)**

### Task 2.1: Audit the Free Chapter Email System

```bash
cat free-chapter.html | grep -A 10 "formspree\|form" | head -40
grep -n "email\|subscribe\|Formspree" index.html | head -20
```

Understand how the free chapter form currently works and where emails are collected.

### Task 2.2: Create the 7-Email Drip Sequence

Create `/docs/EMAIL_DRIP_SEQUENCE.md` with the complete email copy.

**Email 1 (Day 0 — immediately after free chapter download):**
Subject: "Your free [Subject] chapter — how to use it"
Content: Welcome. Explain the notes are built for open-book 3-hour exams. Tell them
how to use the chapter: read once for overview, then practice finding frameworks quickly.
The test — can you find the key framework in under 10 seconds? CTA: Check the readiness
score at thencahub.com/readiness/

**Email 2 (Day 2):**
Subject: "The #1 mistake NCA candidates make (and how to avoid it)"
Content: The open-book trap. They think having notes is enough. The exam tests speed
and structure, not memory. 300 pages vs 80 pages. The 10-second test for exam-ready notes.
CTA: Download the full [Subject] notes → [subject notes page]

**Email 3 (Day 4):**
Subject: "Your [Subject] exam: [X] days away"
Content: Personalized with the next exam date for their subject. Registration status.
How many weeks they have left. The hours/day calculation. One candidate's story.
CTA: Get the Complete System before registration closes

**Email 4 (Day 7):**
Subject: "The economics of an NCA resit"
Content: $500 resit + 3-month wait + emotional cost. $175 notes cost. The math.
"One avoided resit pays for three sets of notes." Show the calculator.
CTA: The Complete System costs less than one resit → [Payhip link]

**Email 5 (Day 10):**
Subject: "What Anum did differently on her 4th attempt"
Content: Anum's story. Three attempts with traditional methods. Fourth attempt with
the Hub method. The difference: answer templates, not more reading.
CTA: Get the method that worked for her → [notes page]

**Email 6 (Day 14):**
Subject: "Open-book doesn't mean easy — it means structured"
Content: NCA exam format deep dive. What "open-book" actually means for preparation.
The 45-minute question format. How candidates who fail spend their time vs those who pass.
CTA: See the complete exam format guide → [exam format article]
Secondary CTA: The notes built for this format → [notes page]

**Email 7 (Day 21 — final):**
Subject: "Your exam is approaching — are you ready?"
Content: Direct readiness check. Link to the readiness score quiz. If they haven't
bought yet: a final offer. If they have bought: encouragement and study tips.
CTA: Take the readiness score → thencahub.com/readiness/

### Task 2.3: Set Up Mailchimp Integration

Create `/docs/MAILCHIMP_SETUP.md` with step-by-step instructions:
1. Sign up at mailchimp.com (free tier: 500 contacts, 1,000 emails/month)
2. Create audience "NCA Hub Free Chapter Subscribers"
3. Create automation: "Customer Journey" triggered by tag "free-chapter-download"
4. Build 7-email sequence with the copy from EMAIL_DRIP_SEQUENCE.md
5. Connect to the Formspree form: When a form submission comes in, use Mailchimp API
   to add the email to the audience with the appropriate subject tag

Also update `free-chapter.html` to:
- Add a hidden field `subject_requested` to the form
- The subject is auto-populated based on which button they clicked
- This data goes to Mailchimp for personalization

---

## PHASE 3 — CONTENT WEAPONS (Beat LawSikho before they scale)
**Use:** `/sc:implement --persona-mentor` for writing
**SuperPowers:** Skip brainstorming — these are well-defined content pieces
**Expected impact: +300-500 additional monthly Google clicks within 8 weeks**

### Task 3.1: The Indian LLB Definitive Article

**Create:** `/blog/nca-exams-for-indian-llb/index.html`

This is NOT a duplicate of the existing Indian lawyers guide. This is a standalone
answer to the exact question "how many NCA exams for Indian LLB graduates" — the query
that has 20+ variations in search data with zero clicks.

Title: `How Many NCA Exams Do Indian LLB Graduates Need? (2026 Guide)`
Meta: `Most Indian LLB graduates are assigned 5–7 NCA exams. The 5 mandatory subjects apply to everyone. Whether you get Property and Contracts depends on your specific degree. 2026 guide.`

Content structure (write in full prose, minimum 2,500 words, no placeholders):

H1: How Many NCA Exams Do Indian LLB Graduates Need?

Opening (answer immediately): "Indian LLB graduates are typically assigned 5–7 NCA
challenge exams. The exact number depends on your specific degree, your university's
syllabus, and what the NCA assessment determines. Here is exactly how it breaks down."

Section 1 — The 5 mandatory subjects (table with all subjects, difficulty, study time)
Section 2 — The 2 most common electives for Indian LLBs (Property, Contracts) and why
Section 3 — What the NCA actually looks at in your Indian LLB transcript
Section 4 — The assessment process and how long it takes
Section 5 — Realistic timeline from today to Certificate of Qualification
Section 6 — The cost breakdown specific to Indian LLB candidates
Section 7 — Key differences between Indian law and Canadian law per subject
Section 8 — FAQ (8 questions specifically about Indian LLB requirements)

End with strong internal links to:
- /nca-for-indian-lawyers/ (existing guide)
- /nca-subject-predictor/ (tool)
- /notes/ (all subjects)
- /nca-cost-calculator/ (cost tool)

Add FAQ schema for the 8 FAQ questions.

### Task 3.2: NCA Assessment Modernization Article

**Create:** `/blog/nca-assessment-modernization-2027/index.html`

Title: `NCA Assessment Changes 2026–2027: What the New Framework Means for You`
Meta: `The NCA approved a new competency-based assessment framework in October 2025. CPLED is developing new assessment tools. What changes, what stays the same, and how to prepare.`

Content (write in full, ~1,500 words):
- What the Federation approved in October 2025 (cite flsc.ca)
- What a "competency-based assessment system" means vs current exam format
- What the NCA Assessment Modernization Committee recommended
- The CPLED involvement (they are developing the new tools)
- Timeline: what is happening and when
- What this means for candidates registering NOW (complete your NCA under current rules)
- The 2029 in-person exam changes (already announced)
- How to protect yourself by completing the NCA process under the current system

### Task 3.3: NCA Results Announcement Template

**Create:** `/blog/nca-results-template/` (a working template)

But more importantly, create a system for Kartik to publish results announcements
quickly every time NCA results come out. Create the template article at:
`/blog/nca-admin-law-results-june-2026/index.html` (first one — Admin Law results
come approximately 10 weeks after Jun 2 exam = August 2026)

The article template structure:
Title: `NCA [Subject] Exam Results Released — [Month Year]`
Meta: `NCA [Subject] results have been released. If you passed: congratulations. If you didn't: here is the exact resit strategy.`

Content:
- Results released (acknowledge the announcement)
- What a pass means (you can register for next subjects)
- What a fail means — the exact path to resit success
- The resit timeline (next available session for this subject)
- What to do differently next time (study approach)
- CTA: Get the notes that give you the best chance on your resit

Create a markdown template at `/docs/RESULTS_ANNOUNCEMENT_TEMPLATE.md` so Kartik
can publish a results article within 1 hour of NCA announcing results.

---

## PHASE 4 — PRACTICE QUESTIONS (Close Vanessa's biggest advantage)
**Use:** `superpowers:brainstorming` for design | Claude Code cannot write the legal content
**Note:** Kartik must write the actual question content — Claude Code creates the structure

### Task 4.1: Create Practice Question Pack Framework

**Create:** `/practice-questions/index.html`

This page serves as the hub for practice question packs. Each subject has a pack.
The page shows:
- Subject grid (same order as notes — by next exam date)
- For each subject: number of questions, format, price, and buy button
- Sample question preview (one question visible, full pack behind Payhip)

**Create the product structure on Payhip:** Create a step-by-step instruction file
at `/docs/PAYHIP_PRACTICE_QUESTIONS_SETUP.md` explaining how Kartik should:
1. Write 5-10 practice questions + model answers per subject
2. Format them as PDF
3. Upload to Payhip as a new product at $35-50 CAD each
4. Link from the practice questions page

**Create the subject-specific practice question pages:**
`/practice-questions/professional-responsibility/index.html` (start with PR — highest pass rate)
`/practice-questions/administrative-law/index.html`
`/practice-questions/criminal-law/index.html`
`/practice-questions/constitutional-law/index.html`
`/practice-questions/foundations-of-canadian-law/index.html`
`/practice-questions/property/index.html`

Each page shows:
- Subject name and next exam date countdown
- What the questions cover
- One sample question (visible, answer locked)
- "Get full pack" CTA → Payhip product page
- "Get notes + practice questions bundle" (a combined offer)

### Task 4.2: Build the Sample Question Display

For each subject page, add one free sample question with a partial model answer.
The answer is cut off at a strategic point: "The model answer continues with the
application of the Baker factors to the specific facts... Get the full pack to see
the complete model answer →"

This is a lead generation mechanism. One free question demonstrates quality.
The rest are paid.

---

## PHASE 5 — CANDIDATE SUCCESS WALL
**Use:** `/sc:implement --persona-frontend`
**Expected impact: Social proof that compounds over time**

### Task 5.1: Create the Success Wall Page

**Create:** `/nca-passes/index.html`

Title: `NCA Candidates Who Passed — Results Wall | The NCA Hub`
Meta: `NCA candidates who prepared with The NCA Hub and passed their exams. Real results from internationally trained lawyers across 12+ countries.`

The page has two sections:
1. A curated section showing Anum's testimonial (already verified)
2. A submission form where candidates can submit their own pass

The submission form collects:
- First name (or how they want to be identified)
- Subject passed
- Session (month/year)
- Country of origin
- One sentence about their experience
- Optional: study duration

Form goes to Formspree with subject: "NCA Hub Pass Submission"
(Use the same Formspree account as the free chapter form)

Submissions display as cards:
"[Name] — [Country] — Passed [Subject] — [Session]"
"[Their one-sentence quote]"

Include a prominent banner: "Did you pass using The NCA Hub? Share your result →"

### Task 5.2: Add the Success Wall CTA to Every Notes Page

On each notes subject page, find the section after the primary buy button and add:
```html
<div style="background:#E1F5EE;border-radius:8px;padding:12px 14px;margin-top:14px;font-size:12px;color:#0F6E56">
  Passed using these notes? <a href="/nca-passes/#submit" style="color:#0F6E56;font-weight:500">Share your result →</a>
  Join the candidates who passed across 12+ countries.
</div>
```

---

## PHASE 6 — LSO BAR EXAM NOTES PAGE
**Use:** `/sc:implement --persona-frontend`
**Expected impact: 3× addressable market**

### Task 6.1: Create the LSO Bar Exam Notes Landing Page

**Create:** `/notes/lso-bar-exam/index.html`

**IMPORTANT:** Kartik is currently writing these exams himself and building these notes.
This page is a pre-launch/coming-soon page that:
1. Establishes that bar exam notes are coming
2. Captures email addresses of interested candidates
3. Explains what the Barrister and Solicitor exams are
4. Links to the existing Ontario guide (/become-a-lawyer-in-ontario/)

Title: `LSO Bar Exam Notes 2026 — Barrister & Solicitor Prep | The NCA Hub`
Meta: `NCA Hub bar exam study notes for the Ontario Barrister and Solicitor licensing exams. Built by someone writing the exams right now. Coming 2026.`

Content:
- What the LSO bar exams are (multiple choice, open-book, Ontario-specific)
- The 2 exams: Barrister and Solicitor
- Why the NCA Hub approach works for bar exams too
- "These notes are being built by the founder — who is writing the bar exams right now."
- Email capture: "Get notified when bar exam notes launch"
- Expected launch: [realistic date based on when Kartik expects to finish]

The email capture form: Formspree with subject "LSO Bar Exam Notes Interest"
Store these emails separately — this is a warm list of high-intent buyers.

---

## PHASE 7 — ARTICLING DIRECTORY
**Use:** `superpowers:brainstorming` then `/sc:implement --persona-architect`
**Expected impact: Most-linked resource in the NCA space**

### Task 7.1: Design the Articling Directory

**Create:** `/articling-directory/index.html`

The articling directory is a searchable database of Ontario law firms that are known
to hire internationally trained lawyers. This does not require legal advice — it is
a resource directory.

**Data sources to research (Claude Code should search the web for these):**
- LSO Find a Lawyer tool (public database)
- Law firm websites that specifically mention ITL hiring
- Community discussions from Reddit and WhatsApp groups (patterns you know)
- South Asian-owned Ontario firms (Kartik's existing research from "Operation Article")

**Directory structure:**
Each firm entry has:
- Firm name
- City (Toronto / Ottawa / other)
- Practice areas
- Size (small 1-5 / medium 6-20 / large 20+)
- Publicly known ITL hire history (yes/no/unknown)
- Languages spoken (if publicly known)
- Website link
- Application email or careers page (if public)

**Filters:**
- City
- Practice area (corporate, immigration, litigation, family, real estate)
- Firm size
- Language

**Build this as a static JSON file + JavaScript filter system:**
`/data/articling-firms.json` (the database)
`/articling-directory/index.html` (the interface)

Start with 20-30 firms you know from your Operation Article research.

---

## PHASE 8 — SEO CONTENT CLUSTER (Hub and Spoke)
**Use:** `/sc:implement --persona-mentor` | Superpowers skip brainstorm (well-defined)
**Expected impact: +500-1,000 monthly Google clicks over 3 months**

### Task 8.1: Create Supporting Articles for Administrative Law

Administrative Law already has a pillar page. It needs 8 supporting articles that
rank for long-tail queries. Create these pages:

1. `/blog/vavilov-explained/index.html` — "Vavilov Standard of Review Explained for NCA Candidates"
2. `/blog/baker-procedural-fairness/index.html` — "Baker Procedural Fairness: The 6 Factors You Must Know"
3. `/blog/judicial-review-canada/index.html` — "Judicial Review in Canada: What NCA Candidates Need to Know"
4. `/blog/dore-charter-analysis/index.html` — "Doré vs Charter Analysis: How to Tell Them Apart"
5. `/blog/nca-admin-law-pass-rate/index.html` — "NCA Administrative Law Pass Rate & Exam Strategy"

Each article: minimum 800 words, prose not bullets, links to /notes/administrative-law/,
proper title/meta, Article schema, published date.

### Task 8.2: Create Supporting Articles for Constitutional Law

1. `/blog/oakes-test-explained/index.html` — "The Oakes Test: All 4 Steps Explained for NCA Exams"
2. `/blog/charter-section-2/index.html` — "Section 2 Charter Rights: Fundamental Freedoms for NCA"
3. `/blog/division-of-powers-nca/index.html` — "Division of Powers: POGG, Trade and Commerce, and Criminal Law Powers"

### Task 8.3: Update Sitemap with All New Pages

After all Phase 3-8 articles are created, update `/sitemap.xml` with every new URL.
Run this to verify:
```bash
find . -name "index.html" | sed 's|./||' | sed 's|/index.html||' | sort > /tmp/pages.txt
cat sitemap.xml | grep -o 'https://[^<]*' | sed 's|https://www.thencahub.com||' | sort > /tmp/sitemap.txt
diff /tmp/pages.txt /tmp/sitemap.txt
```
Every page in pages.txt that is missing from sitemap.txt must be added.

---

## PHASE 9 — COMPARISON PAGES (Capture purchase-intent traffic)
**Use:** `/sc:implement --persona-mentor` | **Critical: factual only, not disparaging**

### Task 9.1: "NCA Hub vs NCA Mentor" Comparison Page

**Create:** `/nca-hub-vs-nca-mentor/index.html`

Title: `NCA Hub vs NCA Mentor: Choosing Your NCA Prep Materials (2026)`
Meta: `Comparing NCA Hub and NCA Mentor for NCA exam preparation. Honest comparison of approach, page count, price, tools, and what candidates actually choose.`

Content must be:
- Factual and verifiable
- Not disparaging or derogatory
- Focused on genuine differences (not "we're better")
- Fair to both options

Key differences to cover (factual, no editorializing):
- Note length: NCA Hub ~80 pages vs NCA Mentor 200+ pages
- Format: NCA Hub = PDF with templates vs NCA Mentor = comprehensive text notes
- Tools: NCA Hub has exam planner, readiness score, AI assistant; NCA Mentor has live classes
- Price: NCA Hub $175/subject vs NCA Mentor packages $150-300+
- Support: NCA Hub = email; NCA Mentor = personal tutor relationship
- Approach: NCA Hub = open-book exam optimization; NCA Mentor = comprehensive coverage
- Community: NCA Hub has tools; NCA Mentor has WhatsApp groups and live sessions

End with: "The right choice depends on your learning style, time, and budget."
Then a clear CTA for NCA Hub with specific benefits.

### Task 9.2: "NCA Notes vs Law School Course" Comparison Page

**Create:** `/nca-prep-course-vs-notes/index.html`

Title: `NCA Law School Course ($6,000) vs Self-Study with Notes ($175): What Candidates Choose`
Meta: `Universities charge $6,000–8,000 for NCA prep courses. Challenge exams cost $500 each. Study notes cost $175. Here's what internationally trained lawyers actually choose and why.`

---

## PHASE 10 — REFERRAL PROGRAM SETUP
**Use:** Create documentation only — Payhip handles the mechanics

**Create:** `/docs/REFERRAL_PROGRAM_SETUP.md`

Payhip has a built-in affiliate program. Set it up as follows:
1. Go to Payhip admin → Marketing → Affiliates
2. Enable affiliate program
3. Set commission: $25 CAD per referred sale
4. Create a dedicated referral landing page at `/refer/index.html`

**Create:** `/refer/index.html`

Title: "Refer a Colleague — Earn $25 for Every Candidate You Help"
Content: Every candidate who passes using the NCA Hub is already in WhatsApp groups
talking to other candidates. Give them a financial incentive to share.

- How it works (simple 3 steps)
- How much you earn ($25 per referred purchase)
- How to get your link (click the button → Payhip generates it)
- CTA: "Get my referral link →" → links to Payhip affiliate signup

---

# SECTION 5: ANTI-HALLUCINATION AND QUALITY RULES

These rules apply to EVERY task. No exceptions.

### Rule 1: Never Invent Facts
Never state NCA pass rates as specific percentages unless they come from:
(a) The existing data in this file, OR
(b) A verified Google search result in this session
The phrase "community-estimated ~X% pass rate" is acceptable. Never say "official X%."

### Rule 2: Never Modify Verified Content
Do not change:
- Any pricing numbers ($149, $175, $749)
- Any Payhip purchase links
- Any exam dates from Section 2.5
- Anum's exact testimonial text ("I passed on my 4th and final attempt...")
- The "4 subjects in 3 months" claim (it is accurate — do not upgrade or downgrade it)

### Rule 3: Protect Revenue by Protecting Content
The notes content is the product. Never:
- Display more than one chapter of notes on the website
- Reveal complete answer templates in free content
- Allow the AI assistant to substitute for buying the notes
- Make the AI assistant answer practice exam questions fully

### Rule 4: Static Site Discipline
No npm. No build tools. No React. No server-side code. No PHP. No Node.
All JavaScript must be plain ES6 that works by opening the HTML file directly.
External fetch calls: Anthropic API and Formspree only.

### Rule 5: Always Verify Before Committing
Before committing any change, run:
```bash
# Check no broken links
grep -r 'href="[^"]*"' [modified file] | grep -v "http\|#\|mailto\|javascript" | grep -v "$(find . -name 'index.html' | sed 's|./||' | sed 's|/index.html||')"

# Check no JS syntax errors
node --check [any modified JS] 2>&1 | head -20

# Verify the page renders (check for unclosed tags)
python3 -c "from html.parser import HTMLParser; p = HTMLParser(); p.feed(open('[file]').read())" 2>&1
```

### Rule 6: Revenue Before Content
Execute phases in order. Phase 0 (revenue) before Phase 1 (AI). Phase 1 before
Phase 3 (content). Do not skip to "interesting" tasks while revenue-critical tasks
remain incomplete.

### Rule 7: Git Discipline
After completing each Phase (not each task — each Phase):
```bash
git add -A
git commit -m "Phase [N]: [brief description]"
git pull --rebase origin main
git push
```

---

# SECTION 6: TOOL INTERACTION RULES

## When to use each tool

**Use Superpowers brainstorming skill when:**
- Building a genuinely new feature (AI assistant, mock exam, articling directory)
- You are uncertain about the approach
- The task involves multiple interconnected files

**Skip Superpowers brainstorming when:**
- The task is a simple file edit (title tag change, CSS fix)
- The task is clearly defined in this document
- You are in Phase 0 (emergency revenue — speed matters more than process here)

**Use SuperClaude persona when:**
- Building interactive JavaScript tools → `--persona-frontend`
- Designing API architecture → `--persona-architect`
- Writing email or tutorial content → `--persona-mentor`
- Analyzing SEO data → `--persona-analyzer`
- Setting up API integrations → `--persona-backend`

**Use subagent-driven-development when:**
- Executing Phase 8 (8+ articles needed simultaneously)
- Running parallel tasks within the same Phase that touch different files
- Any task set where 5+ independent files need creation

## Preventing conflicts between frameworks

Superpowers and SuperClaude do not conflict — they operate at different levels.
Superpowers provides workflow (when and how to work).
SuperClaude provides expertise (what lens to apply).

If Superpowers brainstorming tries to pause and ask you questions about a task that
is already fully specified in this document: override it. The spec is already written.
Tell Superpowers: "Design is already specified in CLAUDE.md. Proceeding to writing-plans."

If SuperClaude's QA persona wants to write unit tests for static HTML pages: decline
gracefully. Tests for static sites mean: "does the page load, does the link work, does
the form submit." Manual verification is sufficient.

---

# SECTION 7: SUCCESS METRICS

After completing all Phases, verify:

**Revenue metrics (check in Payhip):**
- Abandoned checkout email is active
- Referral program is enabled
- All 6 notes pages have exit-intent popups
- Practice question pack products exist on Payhip (at least PR)

**SEO metrics (check via search):**
- All 9 title tags have been changed
- New Indian LLB article is published at /blog/nca-exams-for-indian-llb/
- NCA modernization article is published
- Sitemap.xml includes all new pages

**Tool metrics (check each URL):**
- /nca-ai-assistant/ loads and accepts questions
- /nca-passes/ has submission form working
- /notes/lso-bar-exam/ is live with email capture
- /practice-questions/ shows all 6 subject packs

**Content metrics:**
- /blog/vavilov-explained/ is live
- /blog/baker-procedural-fairness/ is live
- /nca-hub-vs-nca-mentor/ is live
- /articling-directory/ is live with minimum 20 firm entries

**Commit after all phases:**
```bash
git add -A
git commit -m "Complete: all 60 strategic initiatives — Phases 0-10"
git pull --rebase origin main
git push
```

---

# SECTION 8: SCOPE LIMITS — DO NOT DO THESE

1. Do not change any pricing ($149 / $175 / $749)
2. Do not modify Payhip purchase links
3. Do not touch the global stylesheet
4. Do not introduce npm, Node.js, or any build system
5. Do not add third-party analytics scripts without explicit instruction
6. Do not create 2027 exam schedule content — 2026 only
7. Do not fabricate testimonials — only use Anum's verified quote
8. Do not reveal full notes content or complete answer templates for free
9. Do not build features that require a server (database, user accounts, server-side code)
10. Do not modify any file in `/blog/` article body content without explicit instruction

---

*Prompt version 2.0 | The NCA Hub | April 2026*
*Integrates: Obra Superpowers · SuperClaude Framework · Awesome Claude Code*
*60 strategic initiatives across 10 phases*
*Revenue first. Data-driven. Zero hallucination. Static site discipline.*
