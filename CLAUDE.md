# THE NCA HUB — MASTER ORCHESTRATION PROMPT
## Complete Website Enhancement: 37 Issues, 6 Agents, Zero Errors

---

# SECTION 0: HOW TO READ AND EXECUTE THIS PROMPT

You are the **Orchestrator Agent** for a complete enhancement of The NCA Hub website.
Your job is to read this entire document, then execute the work by spawning 6 sub-agents
using the Task tool. Each sub-agent has a precisely defined scope. You must not begin
any sub-agent until you have read Section 1 (Project Context) and Section 2 (Pre-flight)
in full. All agents share the same repository and must not overwrite each other's work.

**Execution order is mandatory:**
1. Agent 0 (you, the Orchestrator): read this document, run pre-flight checks
2. Agent 1: Critical Bug Fixes (must complete before any other agent runs)
3. Agent 2: Tool Builder — Calculators (can run after Agent 1 completes)
4. Agent 3: Tool Builder — Planning (can run in parallel with Agent 2)
5. Agent 4: Pages Builder (can run in parallel with Agents 2 and 3)
6. Agent 5: Conversion Optimizer (must run after Agents 2, 3, 4 complete)
7. Agent 6: Content, SEO and Navigation (runs last — touches every page)

After all agents complete, run the Master Testing Checklist in Section 9.

---

# SECTION 1: PROJECT CONTEXT — READ EVERY WORD

## 1.1 Repository and Hosting

- **Repository:** `kumarkartik9582-cpu/THE-NCA-HUB`
- **Hosting:** GitHub Pages (static site, no server)
- **Live URL:** `https://www.thencahub.com`
- **Technology:** Pure HTML, CSS, and vanilla JavaScript ONLY
- **Build tools:** NONE. No npm. No Node. No React. No Webpack. No Sass.
  Every file must work by opening it directly in a browser.
- **Deployment:** Pushing to the main branch deploys automatically via GitHub Pages

## 1.2 File Structure Convention

Every page on this site is a folder containing an `index.html` file:
```
/ (root)                   → homepage
/notes/                    → notes index
/notes/administrative-law/ → admin law notes page
/notes/constitutional-law/ → con law notes page
/notes/criminal-law/       → crim law notes page
/notes/foundations-of-canadian-law/ → FCL notes page
/notes/professional-responsibility/ → PR notes page
/nca-exam-dates-2026/      → exam dates page
/nca-cost-calculator/      → cost calculator
/nca-exam-planner/         → (TO BE CREATED by Agent 2)
/blog/                     → blog index
/blog/article-a2-nca-exam-format/        → working article
/blog/article-a3-administrative-law-nca/ → working article
/blog/article-b1-constitutional-law-nca/ → working article
/blog/article-b2-criminal-law-nca/       → working article
/blog/article-b3-professional-responsibility-nca/ → working article
/blog/article-b4-foundations-canadian-law-nca/    → working article
/blog/article-e1-nca-study-schedule-working/      → working article
/blog/article-e3-nca-study-hours/        → working article
/blog/article-e4-nca-process-timeline/   → working article
/blog/nca-lrw-guide/       → working article
/faq/                      → 404 ERROR — MUST BE CREATED
/about/                    → may not exist — MUST BE CREATED
/become-a-lawyer-in-ontario/ → exists
/become-a-lawyer-in-bc/    → exists
/become-a-lawyer-in-alberta/ → exists
/nca-for-indian-lawyers/   → exists
/nca-for-uk-lawyers/       → exists
/nca-for-nigerian-lawyers/ → exists
/nca-for-philippine-lawyers/ → exists
/nca-for-pakistani-lawyers/  → exists
/nca-for-jamaican-lawyers/   → exists
/nca-statistics/           → exists
/nca-prep-checklist/       → exists
/sitemap.xml               → DOES NOT EXIST — must create
/robots.txt                → may not exist — must create
```

**Before touching any file:** run `find . -name "*.html" | sort` to verify the actual
structure. Treat this file list as a guide, not a guarantee. Reality in the repo wins.

## 1.3 Brand and Design System

**IMPORTANT:** Before writing any CSS, read the existing global stylesheet to find the
actual CSS variable names and colour values. The values below are approximate — the
actual repo values take precedence.

- **Primary colour (navy):** approximately `#1a2e4a` — used for nav background, headings
- **Accent colour (gold/amber):** approximately `#c9a84c` — used for CTAs, highlights
- **Font:** Arial, sans-serif (body); the site does not use Google Fonts
- **Page max-width:** 760px, centred
- **Button style:** navy background, gold text OR gold background, navy text
- **Card style:** white background, 1px border, 8px border-radius

**Do NOT use:** React, Vue, Tailwind, Bootstrap, or any external CSS framework.
**Do NOT use:** Google Fonts, external icon libraries, or CDN-hosted UI libraries.
All styles must be written as plain CSS in `<style>` tags or the global stylesheet.

**Nav and Footer:** Copy from `index.html` exactly. Every new page MUST have the same
nav and footer. Check if the site uses an `include` pattern or if nav is hardcoded per
page — if hardcoded, copy it manually to every new page.

**The global stylesheet:** There is likely a `styles.css` or `main.css` file linked in
`<head>`. Do not modify it. Add page-specific styles in `<style>` tags within the
individual page's `<head>`.

## 1.4 Business Context

The NCA Hub is a commercial study materials platform for internationally trained lawyers
preparing for NCA (National Committee on Accreditation) exams to qualify as lawyers in
Canada. The founder (Kartik Kumar) passed all 5 mandatory NCA subjects — 4 in under 3
months — and sells precision study notes for each subject.

**Products and Pricing (DO NOT CHANGE THESE NUMBERS):**
- Notes Only per subject: $149 CAD + taxes
- Complete System per subject (notes + templates + practice questions): $175 CAD + taxes
- All 5 Subjects Bundle (Complete System): $749 CAD + taxes
- Shop URL: `https://payhip.com/THENCAHUB`
- Admin Law direct: `https://payhip.com/b/UNbgM`

**The 5 mandatory NCA subjects:**
1. Administrative Law — Vavilov framework, Baker procedural fairness
2. Constitutional Law — Charter analysis, Oakes test, division of powers
3. Criminal Law — actus reus, mens rea, defences
4. Foundations of Canadian Law — sources of law, statutory interpretation
5. Professional Responsibility — Model Code, conflicts, confidentiality

**Key claims (do not contradict or modify these):**
- "Passed all 5 NCA subjects — 4 cleared in under 3 months"
- "100% pass rate (author)" — this refers to the author's personal pass rate
- "Read by NCA candidates across 12+ countries"
- "Notes used in the exam room"
- Testimonial: "I passed on my 4th and final attempt. This is the only method that
  worked for me." — Anum, Constitutional Law, 4th attempt

**Founder bio (use exactly for About page):**
Kartik Kumar. Indian-qualified lawyer (BA LLB Hons, NLU Odisha; LLM International
Commercial Law, University of Bristol). UK paralegal experience at Keoghs, Eversheds
Sutherland, and DWF (approximately 20 months total). Passed all 5 NCA mandatory subjects,
4 in under 3 months. Currently completing Ontario Barrister and Solicitor bar exams.
Founded The NCA Hub to give internationally trained lawyers the preparation they actually
need — not theoretical textbooks, but exam-ready templates built from real exam
experience.

## 1.5 The 2026 NCA Exam Schedule (Source of Truth — Do Not Modify Dates)

This is the complete 2026 NCA exam schedule. Every tool, page, and widget must use
these exact dates. The reference date for all calculations is April 11, 2026.

```
JANUARY 2026 SESSION — Registration closed Dec 11, 2025
Jan 5:  Commercial Law (Midday)
Jan 6–9: Canadian Constitutional Law (Morning/Afternoon alternating)
Jan 12: Contracts (Morning and Afternoon)
Jan 13–16: Foundations of Canadian Law (Morning/Afternoon alternating)

FEBRUARY 2026 SESSION — Registration closed Jan 8, 2026
Feb 2:  Business Organizations (Midday)
Feb 3–6: Canadian Professional Responsibility (Morning/Afternoon alternating)
Feb 9:  Property (Morning and Afternoon)
Feb 10–13: Canadian Criminal Law (Morning/Afternoon alternating)

MARCH 2026 SESSION — Registration closed Feb 5, 2026
Mar 2:  Remedies (Midday)
Mar 3–6: Canadian Administrative Law (Morning/Afternoon alternating)
Mar 9:  Torts (Morning and Afternoon)
Mar 10: Civil Procedure (Morning and Afternoon)

APRIL 2026 SESSION — Registration closed Mar 5, 2026
Mar 30–Apr 2: Canadian Constitutional Law (Morning/Afternoon alternating)
Apr 7–10: Foundations of Canadian Law (Morning/Afternoon alternating)
Apr 13: Family Law (Morning and Afternoon)
Apr 14: Evidence (Midday)

MAY 2026 SESSION — Registration CLOSED Apr 2, 2026
May 4–7: Canadian Professional Responsibility (Morning/Afternoon alternating)
May 11: Contracts (Morning and Afternoon)
May 12–15: Canadian Criminal Law (Morning/Afternoon alternating)

JUNE 2026 SESSION — Registration closes May 7, 2026
Jun 1:  Property (Morning and Afternoon)
Jun 2–5: Canadian Administrative Law (Morning/Afternoon alternating)

JULY 2026 SESSION — Registration closes Jun 11, 2026
Jul 6:  Commercial Law (Midday)
Jul 7–10: Canadian Constitutional Law (Morning/Afternoon alternating)
Jul 13: Torts (Morning and Afternoon)
Jul 14–17: Foundations of Canadian Law (Morning/Afternoon alternating)

AUGUST 2026 SESSION — Registration closes Jul 9, 2026
Aug 4–7: Canadian Professional Responsibility (Morning/Afternoon alternating)
Aug 10–13: Canadian Criminal Law (Morning/Afternoon alternating)
Aug 17: Business Organizations (Midday)
Aug 18: Remedies (Midday)

SEPTEMBER 2026 SESSION — Registration closes Aug 6, 2026
Aug 31–Sep 3: Canadian Administrative Law (Morning/Afternoon alternating)
Sep 8:  Contracts (Morning and Afternoon)
Sep 9:  Civil Procedure (Morning and Afternoon)

OCTOBER 2026 SESSION — Registration closes Sep 10, 2026
Oct 5–8: Canadian Constitutional Law (Morning/Afternoon alternating)
Oct 13–16: Foundations of Canadian Law (Morning/Afternoon alternating)
Oct 19: Evidence (Midday)
Oct 20: Property (Morning and Afternoon)

NOVEMBER 2026 FIRST SESSION — Registration closes Oct 1, 2026
Nov 2:  Family Law (Morning and Afternoon)
Nov 3–6: Canadian Professional Responsibility (Morning/Afternoon alternating)
Nov 9–13: Canadian Criminal Law (Mon/Tue, skip Wed Remembrance Day, Thu/Fri)

NOVEMBER 2026 SECOND SESSION — Registration closes Oct 22, 2026
Nov 16: Torts (Morning and Afternoon)
Nov 17–20: Canadian Administrative Law (Morning/Afternoon alternating)
```

**Next exam dates from April 11, 2026 (pre-computed, use these exactly):**
- Administrative Law: Jun 2, 2026 — 52 days — reg closes May 7 (OPEN)
- Constitutional Law: Jul 7, 2026 — 87 days — reg closes Jun 11 (OPEN)
- Criminal Law: May 12, 2026 — 31 days — reg for May CLOSED Apr 2 / next reg: Aug
- Professional Responsibility: May 4, 2026 — 23 days — reg for May CLOSED Apr 2 / next: Aug
- Foundations of Canadian Law: Jul 14, 2026 — 94 days — reg closes Jun 11 (OPEN)

---

# SECTION 2: PRE-FLIGHT CHECKLIST (ORCHESTRATOR MUST DO FIRST)

Before spawning any sub-agent, the Orchestrator must:

1. `git clone [repo URL]` or `cd` into the repo if already cloned
2. Run `find . -name "*.html" | sort > /tmp/site_structure.txt` and read it
3. Run `cat index.html | head -100` — identify the nav HTML pattern
4. Run `cat index.html | tail -60` — identify the footer HTML pattern
5. Run `find . -name "*.css" | head -5` — identify the global stylesheet filename
6. Run `cat [global-stylesheet].css | head -50` — note actual CSS variable names and values
7. Run `curl -s -o /dev/null -w "%{http_code}" https://www.thencahub.com/faq/` to confirm 404
8. Run `grep -r "article.html" . --include="*.html" | wc -l` to count broken article links
9. Store all findings in `/tmp/nca_preflight.txt` for sub-agents to read

The Orchestrator must share the pre-flight findings with every sub-agent via the Task
tool's prompt parameter so each agent knows the actual file names and CSS variables.

---

# SECTION 3: SHARED RULES FOR ALL AGENTS

Every agent must follow these rules without exception:

### Rule 1: Never Break Existing Functionality
- Do not modify the Formspree free chapter email form
- Do not modify the readiness score quiz on the homepage
- Do not change any Payhip purchase links (payhip.com/THENCAHUB or payhip.com/b/UNbgM)
- Do not modify the global stylesheet — only add `<style>` tags in individual pages
- Do not touch any file in `/blog/` article pages except to fix broken URLs (Agent 1 only)

### Rule 2: Static Site Discipline
- No server-side code, no PHP, no Python, no Node.js
- No npm packages or package.json
- No external JavaScript libraries except the Anthropic API fetch (for AI tools only)
- All JavaScript must be plain ES6 — no transpilation
- All dates in tools must be hardcoded to the 2026 schedule — do NOT use `new Date()`
  for exam date calculations (the schedule is fixed; live dates would give wrong results)

### Rule 3: Nav and Footer Consistency
- Every new page must have IDENTICAL nav and footer to the main site
- Check `index.html` for the exact HTML — copy it character-for-character
- If the nav has a mobile hamburger menu, include it on every page
- Add any new nav links to every page's nav, not just the new pages

### Rule 4: File Naming
- Every new page is a folder with an `index.html` inside:
  - `/about/index.html` NOT `/about.html`
  - `/testimonials/index.html` NOT `/testimonials.html`
- Exception: `sitemap.xml` and `robots.txt` go in the root

### Rule 5: SEO Requirements for Every New Page
Every new `index.html` must have in `<head>`:
```html
<title>[Page Title] | The NCA Hub</title>
<meta name="description" content="[150-160 char description]">
<link rel="canonical" href="https://www.thencahub.com/[path]/">
<meta property="og:title" content="[Page Title] | The NCA Hub">
<meta property="og:description" content="[description]">
<meta property="og:url" content="https://www.thencahub.com/[path]/">
<meta property="og:type" content="website">
```

### Rule 6: The Widget Reference Date
Every tool that uses exam dates must use `const TODAY = new Date(2026,3,11)` as the
reference date, NOT `new Date()`. The 2026 schedule is fixed data; using a live date
would produce incorrect results as the year progresses.

### Rule 7: Verify Before Committing
Before marking any task done, the agent must:
1. Open the created/modified file and read the full HTML
2. Check for unclosed tags, broken JavaScript, and syntax errors
3. Verify all internal links resolve to pages that exist
4. Verify the nav and footer match the homepage pattern exactly

---

# SECTION 4: AGENT 1 — CRITICAL BUG FIXER
## Priority: HIGHEST. Must complete before any other agent runs.
## Estimated time: 2–3 hours

### Task 1.1: Create the /faq/ page

The `/faq/` URL currently returns a 404. The FAQ content exists across multiple pages
(the exam dates page, notes pages, individual subject pages) but there is no central FAQ.
This page is linked from mobile nav and possibly other places.

**Create:** `/faq/index.html`

**Page title:** `NCA Exam FAQ 2026 — Everything Candidates Ask | The NCA Hub`
**Meta description:** `Answers to the most common NCA exam questions — fees, timelines, subject assignment, exam format, re-sits, and more. Verified against nca.legal as of 2026.`
**Canonical:** `https://www.thencahub.com/faq/`

**H1:** `NCA Exam FAQ 2026`

**Content structure:** Implement as expandable/collapsible accordion (click to expand).
Each question is a `<button>` that toggles visibility of the answer `<div>`. No JS library
needed — implement with plain JS toggle class pattern.

**Required FAQ questions and answers (write complete, accurate answers):**

Q1: How many NCA subjects do I need to write?
A: The NCA assigns subjects individually based on your law degree. All internationally trained lawyers must write 5 mandatory subjects: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Depending on your specific degree, you may also be assigned elective subjects such as Property, Contracts, Torts, Business Organizations, and others. Most candidates with a 3-year LLB are assigned 5–7 subjects total. The NCA assessment letter specifies your exact requirements.

Q2: How much does each NCA exam cost?
A: Each NCA challenge exam costs approximately $500 CAD plus applicable taxes (HST/GST) per attempt. This is the fee per subject per sitting. The NCA assessment application fee is $400 CAD plus taxes — a one-time fee paid when you first apply. Use our NCA Cost Calculator at thencahub.com/nca-cost-calculator/ to estimate your total cost.

Q3: When are the 2026 NCA exam sessions?
A: The NCA offers multiple exam sessions throughout 2026. Sessions are available in January, February, March, April, May, June, July, August, September, October, and November — though not every subject is available in every session. See the full 2026 exam schedule at thencahub.com/nca-exam-dates-2026/ for subject-specific dates.

Q4: How long do NCA exam results take?
A: The NCA states results take 10–12 weeks from the exam date. In practice, results often arrive in 6–8 weeks for some sessions. Results are posted to your NCA portal account and you receive an email notification.

Q5: What is the passing mark for NCA exams?
A: The passing mark is 50%. Exams are marked by NCA-appointed assessors and scored on a pass/fail basis. Passing means a competency determination, not a numeric percentage score reported to you.

Q6: Can I re-sit an NCA exam if I fail?
A: Yes. There is no limit on the number of attempts. You may re-sit in any subsequent session. After 3 unsuccessful attempts, the NCA may require a formal reassessment before allowing further attempts. Each re-sit costs the full exam fee (~$500 CAD).

Q7: Are NCA exams open-book?
A: Yes. All NCA challenge exams are open-book. You may bring printed, hard copy materials into the exam. No electronic devices, no internet access, and no digital notes are permitted during the exam. The exam is conducted online via MonitorEDU remote proctoring.

Q8: How long is each NCA exam?
A: Each NCA exam is 3 hours. Exams typically consist of 3–4 long-form written questions requiring you to identify legal issues, apply Canadian law frameworks, and reach reasoned conclusions.

Q9: What is the Indigenous Law and Peoples competency requirement?
A: Effective March 1, 2026, all NCA candidates must complete an Indigenous Law and Peoples competency from an NCA-approved provider. This is a separate requirement from your challenge exams and can be completed at any time during the NCA process. It is not a written exam. Approved providers and costs vary ($150–$400 CAD estimate). Always verify approved providers at nca.legal.

Q10: What is the LRW (Legal Research and Writing) requirement?
A: Most internationally trained lawyers are required to complete the LRW course through CPLED (Centre for Legal Professional Development). It is a written assignment-based course (not a timed exam) covering legal research and memo writing in the Canadian context. Cost is approximately $375 CAD. It must be completed before the NCA issues your Certificate of Qualification.

Q11: What is the NCA Certificate of Qualification?
A: The Certificate of Qualification (COQ) is the document the NCA issues when you have successfully completed all required challenge exams, the LRW course, and the Indigenous Law competency. The COQ is your entry ticket to apply to a provincial law society for admission. You cannot begin articling or the provincial bar admission process without it.

Q12: Can I register for multiple NCA exams in one session?
A: Yes. There is no formal limit on how many subjects you register for in a single session. Most candidates write 2–3 subjects per session. Writing more than 3 subjects simultaneously significantly increases the risk of failing at least one — each subject requires substantial preparation. Each exam is registered and paid for separately.

Q13: What happens if I miss a registration deadline?
A: Registration deadlines are firm. If you miss a deadline, you must wait until the next available session for that subject. Contact the NCA (nca.legal) to confirm whether late registration is available — it is sometimes offered in limited circumstances.

Q14: How do I register for NCA exams?
A: Registration is completed through the NCA portal at nca.legal. You must have an NCA account and an active assessment file. Registration typically opens 8–10 weeks before the exam session and closes approximately 5–6 weeks before the session dates.

Q15: Is The NCA Hub affiliated with the NCA?
A: No. The NCA Hub is an independent educational resource created by an internationally trained lawyer who completed the NCA process. The NCA Hub is not affiliated with, endorsed by, or connected to the National Committee on Accreditation (NCA™), the Federation of Law Societies of Canada, or any provincial law society. Always verify official information at nca.legal.

**Below the FAQ accordion, add a CTA section:**
H2: Still have questions?
Text: Email us at hello@thencahub.com — we respond within 24 hours. Or use the NCA Readiness Score tool to assess your specific preparation gap.
Buttons: [Get My Readiness Score →] linking to /#readiness | [Browse Study Notes →] linking to /notes/

**Add FAQ Schema markup** in a `<script type="application/ld+json">` block in `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many NCA subjects do I need to write?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[full answer text]"
      }
    }
    // ... repeat for all 15 questions
  ]
}
```

---

### Task 1.2: Fix Broken Blog Article URLs

**Background:** The blog index at `/blog/` links some articles as
`/article.html?post=article-xxx` which returns 404. The working URL format is
`/blog/article-xxx/`. Every broken article link must be fixed.

**Step 1:** Run this command to find all broken article links:
```bash
grep -r "article.html?post=" . --include="*.html" -l
```

**Step 2:** For each file found, open it and replace every instance of:
`href="/article.html?post=XXXXX"` with `href="/blog/XXXXX/"`

Also replace any `href="article.html?post=XXXXX"` (without leading slash) with
`href="/blog/XXXXX/"`

**Step 3:** For each article that has a working `/blog/article-xxx/` folder, verify
the folder exists. For any article that has a broken link AND no corresponding folder,
create a minimal redirect page at `/blog/[article-id]/index.html` that redirects to
the blog index:
```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=/blog/">
  <title>Redirecting... | The NCA Hub</title>
</head>
<body>
  <p>Redirecting to <a href="/blog/">articles</a>...</p>
</body>
</html>
```

**Specific broken articles to fix (based on audit):**
- `article-pass-nca-90-days` — "How to Pass the NCA in 90 Days" — HIGH PRIORITY
- `article-c1-failed-nca-exam` — "Failed the NCA Exam. What Now?"
- `article-c2-nca-proctoring-guide` — "NCA Proctoring: Complete Technical Setup"
- `article-c3-one-month-nca-prep` — "Is One Month Enough?"
- `article-c4-nca-textbook-necessary` — "Do You Actually Need the NCA Textbook?"
- `article-c5-nca-exam-anxiety` — "Managing NCA Exam Anxiety"
- `article-d1-nca-prep-materials-compared` — "NCA Prep Materials: What to Look For"
- `article-d2-nca-to-bar-exam` — "NCA to Bar Exam: Complete Pathway"
- `article-d3-nca-indian-lawyers` — "NCA for Indian-Qualified Lawyers"
- `article-d4-nca-uk-based-lawyers` — "NCA for UK-Qualified Lawyers"
- `article-e2-nca-vs-bar-exam` — "NCA vs Bar Exam: What's the Difference?"
- `article-e5-300-page-notes-worth-it` — "Are 300-Page NCA Notes Worth It?"
- `article-e6-nca-live-classes-vs-self-study` — "NCA Live Classes vs Self-Study"
- `article-e7-nca-study-checklist` — "The NCA Study Checklist"
- `article-e8-nca-pass-criteria` — "NCA Pass Criteria: What Score Do You Need?"
- `article-a4-nca-readiness-score` — "The NCA Readiness Score"
- `article-f1-nca-policy-changes-2026` — "NCA Policy Changes in 2026"
- `article-f2-nca-nigerian-lawyers` — "NCA for Nigerian Lawyers"
- `article-f3-nca-philippine-lawyers` — "NCA for Philippine Lawyers"

For each of these: check if a real folder exists. If yes, just fix the link.
If no folder exists, create the redirect page.

---

### Task 1.3: Fix Nav Inconsistency Across All Pages

**Background:** The blog articles use a reduced nav (4 items). The main site has 9+
items. Every page must have the identical nav.

**Step 1:** Read `index.html` and extract the complete nav HTML including mobile menu.
Save it to `/tmp/correct_nav.html`.

**Step 2:** Find every HTML file with a nav element:
```bash
grep -r "<nav" . --include="*.html" -l
```

**Step 3:** For each file, compare its nav to the correct nav. If different, replace it.

**Specific pages to check:**
- All `/blog/article-*/index.html` files (blog articles use different, shorter nav)
- All `/notes/*/index.html` files (subject notes pages may have variant nav)
- `/nca-for-*/index.html` (country guide pages)
- `/become-a-lawyer-in-*/index.html` (province guides)

**What to add to the nav across all pages:**
Once the nav is unified, also add these links if not already present:
- `Exam Planner` → `/nca-exam-planner/` (new page, Agent 2 creates it)
- `Cost Calculator` → `/nca-cost-calculator/`
- `FAQ` → `/faq/`

If the nav has a mobile hamburger menu, add the same links there too.

---

### Task 1.4: Fix Inconsistent Study Hour Claims

**Background:** The cost calculator uses 80 hours for Admin Law. The Admin Law notes
page and Indian lawyers guide say 100–140 hours. The subject data in all tools should
use these correct recommended study hours:

- Administrative Law: 100–140 hours (use 100 as the base for calculator defaults)
- Constitutional Law: 100–140 hours (use 100)
- Criminal Law: 80–120 hours (use 80)
- Foundations of Canadian Law: 100–140 hours (use 100)
- Professional Responsibility: 60–100 hours (use 60)

**Update in:** `/nca-cost-calculator/index.html` — find the study hours default values
and correct them to match the above. Do not change any other calculator values.

**Also update** any hardcoded hour claims in:
- `/nca-for-indian-lawyers/index.html` — verify consistency with the table
- Any subject notes pages that mention study hours

---

# SECTION 5: AGENT 2 — TOOL BUILDER: CALCULATORS
## Runs after Agent 1 completes. Estimated time: 4–6 hours.

### Task 2.1: Create the NCA Exam Planner Page

**Create:** `/nca-exam-planner/index.html`

**This is the most important new tool on the site.** The complete widget source code
is provided in Section 8 (Reference Data). The page should:

1. Use the site's standard nav and footer
2. Include a proper `<h1>`, intro paragraph, and disclaimer
3. Embed the complete NCA Exam Planner widget (all three tabs: Countdown, Calendar, Analysis)
4. Include a post-widget CTA section

**Page title:** `NCA Exam Planner 2026 — Countdown, Calendar & Study Analysis | The NCA Hub`
**Meta description:** `Free interactive NCA exam planner. Select your subjects, see your exact countdown per subject, registration deadlines, monthly study load, and schedule risk analysis.`
**Canonical:** `https://www.thencahub.com/nca-exam-planner/`

**H1:** `NCA Exam Planner 2026`

**Intro paragraph (write in prose, no bullets):**
"Most NCA candidates think about their exam schedule as a single date on a calendar. It is not. Different subjects have different exam windows — Administrative Law next sits in June, Constitutional Law not until July, Criminal Law in May. This planner shows your actual countdown per subject, flags registration deadlines you may have already missed, calculates your minimum daily study hours from today, and tells you whether your current schedule is feasible or heading toward overload. Select your assigned subjects below."

**Disclaimer (12px, muted text, below the widget):**
"Exam dates sourced from the official 2026 NCA Examination Schedule (issued October 9, 2025). Always verify at nca.legal before registering. Registration deadlines are official per the published schedule. Pass rate figures are community-estimated — the NCA does not publish official subject-level pass rates."

**Post-widget CTA (after disclaimer):**
H2: Ready to prepare?
Two columns: Left column — "Get your notes" section with subject links. Right column — cost calculator link.

**The complete widget source code to embed is in Section 8.1 of this document.**

---

### Task 2.2: Create the Subject Assignment Predictor

**Create:** `/nca-subject-predictor/index.html`

**Page title:** `NCA Subject Assignment Predictor — What Exams Will You Need? | The NCA Hub`
**Meta description:** `Based on your country of qualification and degree type, predict which NCA subjects you will likely be assigned before you receive your assessment letter.`

**H1:** `NCA Subject Assignment Predictor`

**Intro paragraph:** "The NCA assigns subjects individually after reviewing your transcripts and syllabi. This tool predicts your likely subject assignment based on patterns across thousands of NCA assessments. It is not a guarantee — only the NCA assessment letter is definitive — but it gives you a working plan while you wait."

**The interactive tool:**

Build as a 3-step form:
- Step 1: Country of qualification (dropdown)
- Step 2: Degree type (dropdown)  
- Step 3: Years of legal practice (slider 0–20)
- Result: Shows predicted subject list with likelihood indicators

**Data for the prediction logic (hardcode these rules exactly):**

Country + degree combinations and typical assignment patterns:
```
India (LLB 3-year): 5 mandatory + likely Property + likely Contracts = 7 subjects
India (LLB 5-year / BA LLB integrated): 5 mandatory + maybe 1–2 electives = 5–7 subjects
India (LLM only, no LLB): unusual, consult NCA directly
UK (LLB or qualifying law degree): 5 mandatory + check for Property — sometimes waived
UK (GDL/CPE conversion): 5 mandatory + likely Property and Contracts
UK (LLM only): non-standard, NCA assesses individually
Nigeria (LLB): 5 mandatory + likely Property + possible Contracts = 6–7 subjects
Philippines (LLB): 5 mandatory + likely Property = 6 subjects
Pakistan (LLB): 5 mandatory + possible Property = 5–6 subjects
Jamaica (LLB): 5 mandatory, usually no electives (Common Law jurisdiction alignment)
South Africa (LLB): 5 mandatory + possible Contracts = 5–6 subjects
Ireland (BCL/LLB): 5 mandatory, similar to UK — check individual subjects
USA (JD): may receive exemptions for some electives; 5 mandatory likely minimum
Other Common Law: 5 mandatory + electives depend on degree coverage
Other Civil Law: 5 mandatory + more electives likely (up to 9 subjects)
```

Years of practice adjustment: 5+ years of practice in a common law jurisdiction often
reduces elective requirements. Reflect this with a note in the results, not a definitive
reduction (the NCA decides, not us).

**Result display format:**
For each predicted subject, show:
- Subject name
- Likelihood badge: "Mandatory" (all 5 mandatory subjects) or "Likely" or "Possible"
- For mandatory subjects with available notes: "Get notes →" button linking to the
  subject notes page (/notes/administrative-law/ etc.)
- Days until next exam (from the pre-computed values in Section 1.5)

**Footer note on results:**
"This prediction is based on historical NCA assessment patterns and is not a guarantee.
The NCA makes individual decisions based on your specific transcripts and syllabi.
The only authoritative source is your NCA assessment letter. Always verify at nca.legal."

**Below the tool:**
H2 section: "Why knowing your subjects early matters"
- 3 bullet points about exam timing, preparation lead time, registration deadlines
- CTA: "See the full 2026 schedule → /nca-exam-dates-2026/"

---

### Task 2.3: Create the Study Hours Calculator

**Create:** `/nca-study-calculator/index.html`

**Page title:** `NCA Study Hours Calculator — How Long Do You Need to Prepare? | The NCA Hub`
**Meta description:** `Enter your available study hours per day and the subjects you need to write. Get a personalised week-by-week study plan and which exam session you can realistically target.`

**H1:** `NCA Study Hours Calculator`

**The interactive tool:**

Inputs (sliders with live readout):
1. Study hours per day (range: 0.5–8, step 0.5, default 2)
2. Days per week available (range: 1–7, step 1, default 5)
3. Number of subjects (range: 1–9, step 1, default 5)

Subject selector (checkboxes for the 5 mandatory subjects, showing individual or combined):
- Pre-check all 5 mandatory subjects

**Calculated outputs (update live as inputs change):**

- Total hours needed (sum of selected subjects' recommended hours)
- Hours available per week (hours_per_day × days_per_week)
- Weeks needed (total_hours_needed / hours_per_week, rounded up)
- Earliest viable exam session for each subject (based on weeks_needed from April 11)
- Whether studying all selected subjects simultaneously is feasible (flag if individual
  weeks_needed > 12 or total_hours_per_day exceeds 4 for multiple subjects at once)

**Recommended hours per subject (use these exactly):**
```
Administrative Law: 100 hours
Constitutional Law: 100 hours
Criminal Law: 80 hours
Foundations of Canadian Law: 100 hours
Professional Responsibility: 60 hours
Contracts: 65 hours
Property: 70 hours
Torts: 65 hours
Business Organizations: 60 hours
```

**Session mapping:** Map weeks_needed to the next available session for each subject.
If a subject needs 5 weeks and there are 7 weeks until the next session, show that session
as viable. If only 3 weeks until next session, show the subsequent one.

Available next sessions by subject (from today, April 11, 2026):
```
Admin Law: Jun 2 (7.4 weeks away), Aug 31 (20.6 weeks), Nov 17 (31.6 weeks)
Con Law: Jul 7 (12.4 weeks), Oct 5 (25.4 weeks)
Criminal Law: May 12 (4.4 weeks — REGISTRATION CLOSED), Aug 10 (17.4 weeks), Nov 9 (28.9 weeks)
PR: May 4 (3.3 weeks — REGISTRATION CLOSED), Aug 4 (16.9 weeks), Nov 3 (28.1 weeks)
FCL: Jul 14 (13.4 weeks), Oct 13 (26.1 weeks)
Contracts: May 11 (4.3 weeks — REG CLOSED), Sep 8 (21.3 weeks)
Property: Jun 1 (7.3 weeks), Oct 20 (27.3 weeks)
Torts: Jul 13 (13.1 weeks), Nov 16 (31.4 weeks)
Business Org: Aug 17 (18.4 weeks)
```

**Output display:** For each selected subject, a row showing:
[Subject] | [Hours needed] | [Weeks needed at your pace] | [Recommended session]
with a green/amber/red indicator: green = comfortable, amber = tight, red = too soon

**Below calculator:**
Paragraph: "These estimates assume focused, structured study using exam-ready materials.
Open-book exams reward speed and structure over volume — which is why our notes are
under 80 pages per subject."
CTA: "Get the notes used to clear 4 subjects in 3 months → /notes/"

---

### Task 2.4: Create the ROI / Resit Calculator

**Create:** `/nca-resit-calculator/index.html`

**Page title:** `NCA Exam ROI Calculator — Cost of Failing vs Cost of Preparing | The NCA Hub`
**Meta description:** `Calculate the real cost of an NCA exam resit versus the cost of proper preparation. One failed resit costs $500 and 3 months. This calculator shows you the economics.`

**H1:** `The Economics of NCA Preparation`

**Intro (prose, 2 paragraphs):**
"Every NCA candidate faces the same decision before registering for their exam: how much to invest in preparation? The answer depends on a number that most candidates ignore — the expected cost of failing.

A single NCA exam resit costs approximately $500 CAD plus taxes and delays your timeline by 3–6 months while you wait for the next available session and results. This calculator makes that tradeoff explicit."

**The interactive tool:**

Inputs:
1. Number of subjects you are preparing for (slider 1–7, default 5)
2. Your estimated pass probability WITHOUT proper notes (slider 30–80%, step 5, default 55%)
   Label: "Estimated pass probability without structured preparation (industry estimate: ~55%)"
3. Your estimated pass probability WITH NCA Hub notes (slider 50–95%, step 5, default 80%)
   Label: "Estimated pass probability with precision study materials (our candidates: ~80%)"

**Outputs (compute and display as large numbers):**

```
Expected exam cost WITHOUT notes:
  = subjects × ($500 × (1 + (1-pass_without) × 1.3))
  // The 1.3 factor accounts for partial probability of 2+ resits

Expected exam cost WITH notes:
  = subjects × $175 (notes cost)
  + subjects × ($500 × (1 + (1-pass_with) × 1.3))

Expected savings:
  = cost_without - cost_with
  (show this as a large, highlighted number)

Expected time saved:
  = subjects × (1-pass_with) × 0.7 months
  vs subjects × (1-pass_without) × 0.7 months
  (0.7 months per resit avoided, accounting for session availability)
```

Show all three output numbers prominently:
- "Expected cost without notes: $X,XXX"
- "Expected cost with notes: $X,XXX"  
- "Expected savings from preparation: $XXX" (in gold/accent colour)

**Below the calculator:**
CTA: "Get the notes that change these odds → /notes/"
Note: "Pass rate estimates are based on available community data and reasonable assumptions.
Individual results vary. The NCA does not publish official subject-level pass rates."

---

# SECTION 6: AGENT 3 — TOOL BUILDER: PLANNING TOOLS
## Can run in parallel with Agent 2. Estimated time: 4–5 hours.

### Task 3.1: Create the Full Qualification Timeline Generator

**Create:** `/nca-timeline/index.html`

**Page title:** `NCA Timeline Calculator — From Assessment to Call to the Bar | The NCA Hub`
**Meta description:** `Enter your assessment submission date, province, and number of subjects. Get a personalised timeline from NCA application to call to the bar — every milestone, every wait.`

**H1:** `NCA Qualification Timeline Generator`

**Intro paragraph:** "The most common question internationally trained lawyers ask is: how long will this actually take? The honest answer depends on your specific situation — how many subjects you need, how many sessions you take, and which province you are targeting. This generator builds your personalised timeline."

**The interactive tool:**

Inputs:
1. Assessment application submitted (date picker, or month/year dropdowns — default: this month)
2. Target province (dropdown: Ontario, British Columbia, Alberta, Other)
3. Number of NCA subjects assigned (slider 5–9, default 5)
4. Subjects per session plan (dropdown: 1 per session, 2 per session, 3 per session)
5. Do you need LRW? (yes/no radio, default yes)

**Timeline logic (compute these durations and map them to calendar dates):**

```
Phase 1 — NCA Assessment
  Duration: 8–16 weeks (use 12 weeks as estimate)
  Start: input date
  End: assessment_start + 12 weeks
  Milestone: "Receive assessment letter"

Phase 2 — Subject Preparation and Exams
  Duration: ceiling(subjects / subjects_per_session) exam sessions
  Each session: 3 months apart (NCA offers sessions roughly quarterly)
  Add results waiting time: 10 weeks per session (after exam, before next registration)
  
  For each session:
    - Registration opens: 8 weeks before exam
    - Registration closes: 5–6 weeks before exam
    - Exam date: use actual next session dates from schedule
    - Results: 10 weeks after exam

Phase 3 — LRW (if selected)
  Duration: 8–16 weeks (use 12 weeks estimate)
  Can overlap with exam prep
  Place it during the last exam session or immediately after

Phase 4 — Certificate of Qualification
  Duration: 4–8 weeks processing (use 6 weeks)
  Starts after: all exams passed + LRW complete

Phase 5 — Provincial Licensing
  Ontario: Apply to LSO → 4–6 weeks processing → Articling (10 months) → Bar exams
  BC: Apply to LSBC → 4–6 weeks processing → Articling (9 months) → Bar exams
  Alberta: Apply to LSA → 4–6 weeks processing → Articling (12 months) → Bar course

Phase 6 — Bar Exams (Ontario example)
  Barrister: 1 exam → results 6–8 weeks
  Solicitor: 1 exam → results 6–8 weeks
  Can be taken concurrently with articling
```

**Output:** A vertical timeline component showing each milestone as a row with:
- Phase name
- Date range (computed from inputs)
- Status indicator (future = gray, current = blue highlight)
- Estimated cost for that phase (from the cost data)

**Total summary at bottom:**
- "Total time from today to call to the bar: X years, Y months"
- "Total estimated fees: $XX,XXX" (use fee data from Section 1.4 context)

**Note on total time (display prominently):**
"For a candidate with 5 subjects writing 2 per session and passing all first time:
approximately 3–4 years from application to call. Writing 3 per session can reduce
this to 2.5–3 years. Failed resits add 3–6 months per subject."

---

### Task 3.2: Create the Session Sequence Optimizer

**Create:** `/nca-session-planner/index.html`

**Page title:** `NCA Session Planner — Optimal Subject Sequencing for 2026 | The NCA Hub`
**Meta description:** `Plan the optimal order and session pairing for your NCA subjects. Avoid scheduling conflicts, respect results wait times, and finish your NCA process as fast as possible.`

**H1:** `NCA Session Sequence Planner`

**Intro paragraph:** "Writing NCA subjects in the wrong order can cost you months. Some subjects are naturally sequential (Administrative Law before Constitutional Law makes sense conceptually). Others are governed by exam window availability — you cannot write Criminal Law in June because it does not appear in June. This planner optimises your sequence."

**The interactive tool:**

Step 1: User selects their assigned subjects (checkboxes, same as the exam planner)
Step 2: User sets target finish date (dropdown: fastest possible, 6 months, 1 year, 18 months)
Step 3: User sets subjects per session (1, 2, or 3)

**Output:** A session-by-session schedule showing:
- Session name (e.g. "Session 1: June 2026")
- Which subjects to write in that session
- Registration deadline for that session
- Difficulty rating for that session (sum of individual subject difficulties)
- Results expected date
- Next registration opens date

**Sequencing logic rules (apply these in order):**
1. Never schedule two "Most Complex" subjects (difficulty 5) in the same session
2. Constitutional Law and Administrative Law are complementary — scheduling them within
   one session apart is ideal
3. Professional Responsibility is the "easiest" mandatory subject — good as first exam
   to build confidence or as add-on to a heavier session
4. Foundations of Canadian Law is essay-heavy and independent — can go any session
5. Criminal Law is conceptually accessible but detail-heavy — good middle candidate
6. Respect registration deadlines: if a deadline has passed, skip that session

**Add a recommendation section:**
After showing the optimised schedule, display 2–3 specific recommendations like:
"Start with Professional Responsibility in August 2026 — it has the highest
community pass rate (~65%) and will build your confidence for the harder subjects."

**Below the tool:**
CTA pointing to the exam planner: "See your countdown for each subject →"
And notes CTA: "Get notes for your first session → /notes/"

---

### Task 3.3: Create the "30 Days or Less" Emergency Page

**Create:** `/nca-30-day-plan/index.html`

**Page title:** `NCA Exam in 30 Days — Emergency Preparation Guide | The NCA Hub`
**Meta description:** `30 days or less until your NCA exam? This is the only strategy that works when time is short. Day-by-day plan, what to cut, what to prioritise, and why open-book format is your friend.`

**H1:** `NCA Exam in 30 Days`

**Subheading:** `The emergency preparation guide for candidates under serious time pressure`

**Content (write in full, no placeholders — this is a real guide):**

Opening section (prose): Explain that 30 days is enough for a focused candidate who
uses the right materials. The exam is open-book — you do not need to memorise 300 pages.
You need 3 things: the key legal frameworks, a reliable answer structure, and practice
applying it under timed conditions. Most candidates who fail with 30 days preparation
fail because they tried to read too much, not because they prepared too little of the
right things.

Section 1: What to cut immediately
- The full NCA textbook: do not read it cover to cover with 30 days left
- Case summaries beyond the key cases: you will not have time to locate and apply them
- Academic analysis: the NCA tests application, not theory
- Anything that takes more than 10 seconds to find in your notes during the exam

Section 2: What to focus on instead
- The 5–7 key legal frameworks per subject (Vavilov, Baker, Oakes, etc.)
- A pre-built answer template you know by heart in structure
- The exact cases that apply to each framework
- 2–3 practice questions under timed conditions

Section 3: The 30-day daily schedule
Write a week-by-week breakdown:
Week 1: Framework acquisition — read the notes, nothing else
Week 2: Template drilling — practice structuring answers without writing them
Week 3: Timed practice — 2 full practice questions per day under exam conditions
Week 4: Consolidation — identify weak frameworks, review them, final mock exam

Section 4: The open-book advantage
Explain that with 30 days, you can make open-book work for you in a way a 300-page
textbook cannot. Notes under 80 pages mean you can find any framework in under 10
seconds. This is what "exam-ready" means.

**CTA box (prominent, styled differently from surrounding text):**
"These notes are built for exactly this situation — 30 days, open-book, 3 hours.
Under 80 pages per subject. Pre-built answer templates. Used to pass 4 subjects in
3 months."
Button: "Get the Complete System — $175 CAD → /notes/"
Note: "Instant PDF delivery. Start studying within minutes of purchase."

Section 5: Technical setup — do not ignore this
Bullet points about MonitorEDU setup, phone placement, internet speed test, covering
mirrors, etc. (reference the exam format article for technical details)

Section 6: The night before
Short, practical list: charge phone to 100%, tab your notes, light review only, sleep.

**Cross-links at bottom:**
- NCA Exam Format Guide → /blog/article-a2-nca-exam-format/
- Study Hours Calculator → /nca-study-calculator/
- Exam Planner → /nca-exam-planner/

---

# SECTION 7: AGENT 4 — PAGES BUILDER
## Can run in parallel with Agents 2 and 3. Estimated time: 5–7 hours.

### Task 4.1: Create the About / Founder Page

**Create:** `/about/index.html`

**Page title:** `About The NCA Hub — Built by an Internationally Trained Lawyer | The NCA Hub`
**Meta description:** `The NCA Hub was built by Kartik Kumar — an Indian-qualified lawyer who passed 4 NCA subjects in 3 months. Here is the story behind the method.`

**H1:** `The story behind the method`

**Content structure:**

Opening (short, powerful): "In September 2025, I sat my first NCA exam with one week
of preparation. I passed. By November 2025, I had cleared 4 of the 5 mandatory subjects.
The method I used — and the notes I built for myself — became The NCA Hub."

Founder bio section:
- Name: Kartik Kumar
- Education: BA LLB (Hons), NLU Odisha; LLM International Commercial Law, University
  of Bristol
- UK practice: Paralegal at Keoghs LLP, Eversheds Sutherland LLP, and DWF LLP
  (approximately 20 months combined)
- NCA: Completed all 5 mandatory subjects, 4 cleared in under 3 months (Sep–Nov 2025)
- Currently completing Ontario Bar (Barrister and Solicitor exams)
- Founded The NCA Hub to give internationally trained lawyers the preparation material
  they actually needed — not theoretical textbooks designed for students, but exam-ready
  templates built from real exam experience

Why The NCA Hub exists section:
Explain the problem: most NCA candidates arrive with legal knowledge but without
understanding of open-book exam strategy. A 300-page textbook is a liability in a
3-hour open-book exam. The NCA Hub was built around the insight that structure beats
volume every time.

The method section:
- Under 80 pages per subject: every concept that actually appears in NCA exams
- Answer templates: pre-built structures that work for every question type
- Tested in the room: these are the actual notes used in the actual exams

**Testimonial (include Anum's):**
Quote box: "I passed on my 4th and final attempt. This is the only method that worked
for me." — Anum, Constitutional Law, 4th attempt

**Contact section:**
Email: hello@thencahub.com
LinkedIn: [if Kartik has shared his LinkedIn URL, include it; otherwise omit]

---

### Task 4.2: Create the Testimonials / Social Proof Page

**Create:** `/testimonials/index.html`

**Page title:** `Candidate Results — NCA Hub Study Notes | The NCA Hub`
**Meta description:** `Internationally trained lawyers who used The NCA Hub notes to pass their NCA exams. Real results from real candidates across 12+ countries.`

**H1:** `Candidate results`

**Opening statement:**
"The NCA Hub notes have been used by candidates across 12+ countries. These are their results."

**Anum's testimonial (full treatment):**
Large quote block: "I passed on my 4th and final attempt. This is the only method that worked for me."
Attribution: Anum — Constitutional Law — 4th attempt
Context note: "Anum contacted us after three unsuccessful attempts using traditional
preparation methods. She switched to the NCA Hub Complete System before her fourth
sitting."

**Note on social proof:**
Below Anum's testimonial, add a section:
"More results are added as candidates share them. If you passed using The NCA Hub
notes, we would love to hear from you: hello@thencahub.com"

**Add a result statistics section:**
- Used by candidates across 12+ countries
- 5 mandatory subjects covered
- 4 subjects cleared in 3 months (author)

**CTA:** "Get the notes → /notes/"

**Note to Agent:** The testimonials page is intentionally lean because we currently
have one confirmed testimonial. Build the page to be expandable — the structure should
make it easy to add more testimonials by duplicating a card template.

---

### Task 4.3: Create the Notes Comparison / Bundle Page

**Create:** `/nca-notes-comparison/index.html`

**Page title:** `NCA Notes Comparison — Notes Only vs Complete System vs Bundle | The NCA Hub`
**Meta description:** `Compare NCA Hub study notes options: Notes Only ($149), Complete System ($175), or All 5 Bundle ($749). See exactly what each tier includes and which is right for you.`

**H1:** `Which notes package is right for you?`

**Intro (prose):** "Every NCA Hub package gives you precision notes under 80 pages.
The difference is in what surrounds the notes — answer templates, practice questions,
and bundle pricing. Here is a direct comparison."

**Comparison table:**

| Feature | Notes Only ($149) | Complete System ($175) | All 5 Bundle ($749) |
|---|---|---|---|
| PDF study notes | Yes | Yes | Yes (all 5 subjects) |
| Answer templates | No | Yes | Yes (all subjects) |
| Practice questions | No | Yes | Yes (all subjects) |
| Per-subject price | $149 | $175 | $150/subject |
| Best for | Tight budget, 1 subject | Standard preparation | Multiple subjects |

**Below the table:**
ROI callout box: "One failed NCA exam resit costs $500 CAD. The Complete System costs
$175. If structured notes help you pass first time — which is the point — the maths
are straightforward."

**Per-subject links (cards):**
Show a card for each of the 5 mandatory subjects with:
- Subject name
- Next exam date and days remaining
- "Get Complete System →" button linking to /notes/[subject]/

**Bundle CTA:**
Large button: "Get All 5 Subjects — $749 CAD → [Payhip bundle link]"
Note below: "Instant PDF delivery. Pay in instalments available at checkout."

---

### Task 4.4: Create the Articling Guide Page

**Create:** `/articling-in-ontario/index.html`

**Page title:** `Articling in Ontario as a Foreign Lawyer — Complete 2026 Guide | The NCA Hub`
**Meta description:** `How articling works in Ontario for internationally trained lawyers. Finding a principal, the LPP alternative, articling timelines, and what firms look for.`

**H1:** `Articling in Ontario: A Guide for Internationally Trained Lawyers`

**Content sections (write in full prose, no placeholders):**

Section 1: What is articling and why it matters
Articling is the mandatory supervised practice period required before a lawyer can be
called to the bar in Ontario. For internationally trained lawyers, it comes after
completing the NCA process and obtaining the Certificate of Qualification.

Section 2: The two routes — articling vs LPP
Articling: minimum 10 months (most placements 10–12 months) with a principal who is
an LSO member in good standing. Highly competitive, particularly in Toronto.
LPP (Law Practice Program): 4-month skills training + 4-month work placement, offered
by Toronto Metropolitan University and University of Ottawa. Created to address the
shortage of articling positions. Less prestigious but accessible.

Section 3: How competitive is the articling market?
Toronto corporate law market is extremely competitive. Small-firm and regional market is
more accessible. International experience is valued in specific practice areas (energy,
immigration, international trade, corporate). Language skills (Hindi, Punjabi, Mandarin,
French, Spanish, Arabic) are often differentiators in niche markets.

Section 4: What firms look for in internationally trained candidates
NCA results and timeline (how quickly you completed the NCA process matters)
UK or Commonwealth legal experience in relevant practice areas
Strong English written communication (the NCA exams already test this)
Articling application timing (most firms hire 12–18 months in advance)

Section 5: Costs and timeline
LSO licensing fees: approximately $4,500 CAD
Articling: unpaid in some positions, paid in others (minimum wage requirements apply)
Bar exam fees: Barrister ~$720, Solicitor ~$720 (check LSO for current fees)

**CTA:** "See total cost breakdown → /nca-cost-calculator/"
**Related:** Link to /become-a-lawyer-in-ontario/

---

### Task 4.5: Add Missing Country Guide — South Africa

**Create:** `/nca-for-south-african-lawyers/index.html`

Follow the exact same structure as `/nca-for-indian-lawyers/index.html`.
Content specific to South African LLB graduates:
- South African LLB is a 4-year professional degree
- Common law jurisdiction (British-derived, mixed with Roman-Dutch)
- Typically assigned 5 mandatory subjects, possible Property addition
- Constitutional law expertise from SA Constitution may assist with Canadian Charter analysis
- No direct equivalent to Vavilov administrative law framework
- SAFLII (SA Legal Information Institute) experience useful for Canadian legal research

---

### Task 4.6: Add Missing Country Guide — Ireland

**Create:** `/nca-for-irish-lawyers/index.html`

Follow the exact structure as `/nca-for-indian-lawyers/index.html`.
Content specific to Irish-qualified lawyers:
- Irish LLB is a common law degree with EU law elements
- Strong alignment with Canadian common law system
- Typically 5 mandatory subjects, sometimes reduced electives due to common law alignment
- Barristers and solicitors both qualify (both routes count)
- The King's Inns and Law Society of Ireland qualifications both assessed

---

### Task 4.7: Add Missing Province Guide — Quebec

**Create:** `/become-a-lawyer-in-quebec/index.html`

Follow the structure of `/become-a-lawyer-in-ontario/index.html`.
Quebec-specific content:
- Quebec uses civil law (not common law) — the Barreau du Québec oversees admission
- The NCA process applies to the common law aspects — more complex assessment
- The Barreau has its own Equivalence Committee that assesses foreign credentials
- Language requirement: French is essential for Quebec practice (Bill 96 requirements)
- The process is notably different from other provinces — candidates should contact
  both the NCA and the Barreau du Québec separately

---

### Task 4.8: Add Missing Province Guide — British Columbia

Check whether `/become-a-lawyer-in-bc/index.html` exists. If it exists but is thin,
enhance it. If it does not exist, create it following the Ontario guide structure.
BC-specific content: LSBC admission, PLTC (Law Society BC articling course), 9-month
articling, Vancouver legal market overview (corporate, immigration, real estate).

---

# SECTION 8: AGENT 5 — CONVERSION OPTIMIZER
## Must run after Agents 2, 3, 4 complete. Estimated time: 3–4 hours.

### Task 5.1: Add Exam Countdown Badges to Notes Subject Pages

For each of the 5 mandatory subject notes pages, add a countdown badge immediately
above the primary purchase button.

**Files to modify:**
- `/notes/administrative-law/index.html`
- `/notes/constitutional-law/index.html`
- `/notes/criminal-law/index.html`
- `/notes/foundations-of-canadian-law/index.html`
- `/notes/professional-responsibility/index.html`

**Badge HTML to insert (adapt dates per subject):**

For Administrative Law:
```html
<div class="exam-urgency-badge" style="background:#E1F5EE;border-radius:8px;padding:10px 14px;margin-bottom:16px;display:inline-flex;align-items:center;gap:10px">
  <div style="font-size:22px;font-weight:500;color:#0F6E56;line-height:1">52</div>
  <div>
    <div style="font-size:12px;font-weight:500;color:#0F6E56">days until the next Admin Law exam</div>
    <div style="font-size:11px;color:#1D9E75">Jun 2, 2026 · Registration closes May 7 (open now)</div>
  </div>
</div>
```

Adapt for each subject using these values:
- Admin Law: 52 days, Jun 2, reg closes May 7, green badge (OPEN)
- Con Law: 87 days, Jul 7, reg closes Jun 11, blue badge (OPEN)
- Crim Law: 31 days, May 12, reg for May CLOSED — amber/red badge
  Text: "31 days to May exam (registration closed) · Next registerable: Aug 10"
- PR: 23 days, May 4, reg for May CLOSED — red badge
  Text: "23 days to May exam (registration closed) · Next registerable: Aug 4"
- FCL: 94 days, Jul 14, reg closes Jun 11, blue badge (OPEN)

Place the badge immediately above whichever button or section represents the primary
purchase action. If there is a "Get My Complete System →" button, the badge goes
directly above it.

---

### Task 5.2: Place Anum's Testimonial on Every Notes Page

Find Anum's testimonial on the Admin Law notes page. Copy the exact HTML quote block
and paste it into each of the other 4 notes subject pages in the same position.

Also add it to:
- `/notes/index.html` (the notes listing page) — below the stat row
- `index.html` homepage — in the pricing or notes section

The exact text: "I passed on my 4th and final attempt. This is the only method that
worked for me." — Anum · Constitutional Law · 4th attempt

---

### Task 5.3: Upgrade the Cost Calculator CTA

**Modify:** `/nca-cost-calculator/index.html`

Find the existing "Reduce the cost of re-sits" / "Browse My Notes →" CTA at the
bottom of the cost calculator. Replace it with a dynamic, personalised CTA.

**New CTA logic:**
Read the number of subjects selected in the calculator (default 5). Display:

```html
<div style="background:#E6F1FB;border-radius:12px;padding:1.5rem;margin-top:2rem">
  <p style="font-size:14px;color:#185FA5;font-weight:500;margin-bottom:8px">
    One avoided resit covers the cost of your notes — three times over.
  </p>
  <p style="font-size:13px;color:#0C447C;margin-bottom:16px">
    At $175 per subject, preparing properly costs less than a single failed attempt
    ($500 + 3-month delay). For [N] subjects, the Complete System costs $[N×175] —
    less than one resit on just one subject.
  </p>
  <a href="https://www.thencahub.com/notes/" style="...">Browse All [N] Subjects →</a>
</div>
```

The N in "[N] subjects" should update dynamically based on the slider value.
Use JavaScript to read the subject count slider and update this CTA text live.

---

### Task 5.4: Add Email Opt-In for Exam Countdown Reminder

**Modify:** `/nca-exam-dates-2026/index.html` and the new `/nca-exam-planner/index.html`

Below the planner widget on both pages, add an email capture form:

```html
<div style="border:0.5px solid #e0e0e0;border-radius:12px;padding:1.5rem;margin-top:2rem;background:#fff">
  <h3 style="font-size:16px;font-weight:500;margin-bottom:8px">
    Get a reminder 30 days before your exam
  </h3>
  <p style="font-size:13px;color:#666;margin-bottom:16px">
    Enter your email and your next exam date. We will send you one reminder
    30 days before — nothing else.
  </p>
  <form action="https://formspree.io/f/[YOUR_FORMSPREE_ID]" method="POST"
        style="display:flex;flex-direction:column;gap:10px;max-width:400px">
    <input type="email" name="email" placeholder="Your email address" required
           style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px">
    <select name="exam_subject" style="padding:10px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px">
      <option value="">Select your next exam subject</option>
      <option value="admin_jun2">Administrative Law — Jun 2, 2026</option>
      <option value="con_jul7">Constitutional Law — Jul 7, 2026</option>
      <option value="crim_aug10">Criminal Law — Aug 10, 2026</option>
      <option value="pr_aug4">Professional Responsibility — Aug 4, 2026</option>
      <option value="fcl_jul14">Foundations of Canadian Law — Jul 14, 2026</option>
    </select>
    <button type="submit" style="padding:10px 20px;background:#185FA5;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer">
      Set My Reminder
    </button>
    <input type="hidden" name="_subject" value="NCA Exam Reminder Signup">
  </form>
  <p style="font-size:11px;color:#999;margin-top:8px">
    One email only. No spam. Unsubscribe any time.
  </p>
</div>
```

**Important:** Use the SAME Formspree form ID that already exists on the site for
the free chapter form. Find it in `index.html` (`action="https://formspree.io/f/[ID]"`).
Do NOT create a new Formspree account — use the existing one with a different subject
field to distinguish signups.

---

### Task 5.5: Create a Standalone Readiness Score Page

**Create:** `/nca-readiness-score/index.html`

**Page title:** `NCA Exam Readiness Score — Are You Ready to Sit? | The NCA Hub`
**Meta description:** `Take the free NCA readiness assessment. Five dimensions, 0–100 score, and a specific action for each result band. Know before you sit.`

**H1:** `NCA Exam Readiness Score`

**Content:** Copy the readiness score quiz from the homepage (`#readiness` section)
into this standalone page, preserving all JavaScript functionality exactly.

Add canonical meta tag pointing to `/nca-readiness-score/`.

Below the quiz, add the same CTAs that appear on the homepage after the score result.

Update the homepage `#readiness` section: add a note under the quiz:
"Share your readiness score: [link to /nca-readiness-score/]"

---

# SECTION 9: AGENT 6 — CONTENT, SEO AND NAVIGATION
## Runs last. Estimated time: 4–5 hours.

### Task 6.1: Fix Internal Linking from Blog Articles to Notes Pages

For each of the following blog articles, find the final CTA section (the "Get Your
Notes →" button) and update the link from the generic `/notes/` to the
subject-specific notes page:

- Admin Law article → `/notes/administrative-law/`
- Con Law article → `/notes/constitutional-law/`
- Crim Law article → `/notes/criminal-law/`
- FCL article → `/notes/foundations-of-canadian-law/`
- PR article → `/notes/professional-responsibility/`
- General articles (study hours, study schedule, etc.) → `/notes/` (keep generic)

Also, for each subject-specific article, add a visible "Quick stats" box near the
top of the article (after the H1 but before the first paragraph) showing:
- Next exam date for that subject
- Days remaining
- Registration status

---

### Task 6.2: Add Schema Markup to All Key Pages

For each of the following pages, add the appropriate Schema.org structured data
in a `<script type="application/ld+json">` block in `<head>`:

**Blog articles:** Add `Article` schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article title]",
  "author": {
    "@type": "Person",
    "name": "Kartik Kumar"
  },
  "publisher": {
    "@type": "Organization",
    "name": "The NCA Hub"
  },
  "dateModified": "2026-04-11",
  "url": "https://www.thencahub.com/blog/[article-slug]/"
}
```

**Notes product pages:** Add `Product` schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "NCA [Subject] Notes — Complete System",
  "description": "[Subject description from the page]",
  "brand": {"@type": "Brand", "name": "The NCA Hub"},
  "offers": {
    "@type": "Offer",
    "price": "175",
    "priceCurrency": "CAD",
    "availability": "https://schema.org/InStock",
    "url": "https://payhip.com/THENCAHUB"
  }
}
```

**FAQ page:** Already specified in Task 1.1

**Homepage:** Add `Organization` schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The NCA Hub",
  "url": "https://www.thencahub.com",
  "description": "NCA exam preparation for internationally trained lawyers",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@thencahub.com"
  }
}
```

---

### Task 6.3: Create sitemap.xml

**Create:** `/sitemap.xml` in the root

Include ALL pages including new ones created by Agents 1–5:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.thencahub.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.thencahub.com/notes/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/notes/administrative-law/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/notes/constitutional-law/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/notes/criminal-law/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/notes/foundations-of-canadian-law/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/notes/professional-responsibility/</loc><priority>0.9</priority></url>
  <url><loc>https://www.thencahub.com/nca-exam-dates-2026/</loc><priority>0.8</priority></url>
  <url><loc>https://www.thencahub.com/nca-cost-calculator/</loc><priority>0.8</priority></url>
  <url><loc>https://www.thencahub.com/nca-exam-planner/</loc><priority>0.8</priority></url>
  <url><loc>https://www.thencahub.com/nca-subject-predictor/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-study-calculator/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-resit-calculator/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-timeline/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-session-planner/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-30-day-plan/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-readiness-score/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/faq/</loc><priority>0.8</priority></url>
  <url><loc>https://www.thencahub.com/about/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/testimonials/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/nca-notes-comparison/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/articling-in-ontario/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/become-a-lawyer-in-ontario/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/become-a-lawyer-in-bc/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/become-a-lawyer-in-alberta/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/become-a-lawyer-in-quebec/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-indian-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-uk-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-nigerian-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-philippine-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-pakistani-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-jamaican-lawyers/</loc><priority>0.7</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-south-african-lawyers/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/nca-for-irish-lawyers/</loc><priority>0.6</priority></url>
  <url><loc>https://www.thencahub.com/blog/</loc><priority>0.8</priority></url>
  <!-- Add all working blog articles here -->
</urlset>
```

---

### Task 6.4: Create robots.txt

**Create:** `/robots.txt` in root:
```
User-agent: *
Allow: /

Sitemap: https://www.thencahub.com/sitemap.xml
```

---

### Task 6.5: Update Navigation Across All Pages

Add the following new pages to the nav on every page of the site:

Check the existing mobile nav dropdown (hamburger). Add all new links:
- `Exam Planner` → `/nca-exam-planner/`
- `FAQ` → `/faq/`

Also add a "Tools" section or dropdown in the desktop nav if the nav supports dropdowns.
If not (flat nav), add at minimum `Exam Planner` and `FAQ` as standalone links.

Add the Candidate Guides (country guides) to the nav — either as a dropdown or in the
footer's navigation section (they are currently only in the footer):
- Indian Lawyers → `/nca-for-indian-lawyers/`
- UK Lawyers → `/nca-for-uk-lawyers/`
- Nigerian Lawyers → `/nca-for-nigerian-lawyers/`
- Philippine Lawyers → `/nca-for-philippine-lawyers/`
- Pakistani Lawyers → `/nca-for-pakistani-lawyers/`
- Jamaican Lawyers → `/nca-for-jamaican-lawyers/`
- South African Lawyers → `/nca-for-south-african-lawyers/` (new)
- Irish Lawyers → `/nca-for-irish-lawyers/` (new)

---

### Task 6.6: Add Province Guide Links to Cost Calculator

**Modify:** `/nca-cost-calculator/index.html`

Find where the calculator shows the "After the NCA" section (articling and bar exam
costs). Below the province-specific costs, add links:
"See the complete qualification process for your province:"
- [Ontario →] /become-a-lawyer-in-ontario/
- [British Columbia →] /become-a-lawyer-in-bc/
- [Alberta →] /become-a-lawyer-in-alberta/
- [Quebec →] /become-a-lawyer-in-quebec/

---

# SECTION 10: MASTER TESTING CHECKLIST

After all agents complete, the Orchestrator must verify the following:

## Critical Tests (failure = restart that agent's task)

- [ ] `curl -s -o /dev/null -w "%{http_code}" https://www.thencahub.com/faq/` returns 200
- [ ] All blog article links on /blog/ return 200 (test a sample of 5)
- [ ] `/nca-exam-planner/` loads and all 3 tabs function
- [ ] `/nca-subject-predictor/` loads, form works, results display
- [ ] `/nca-study-calculator/` loads, sliders work, outputs update
- [ ] `/nca-timeline/` loads and generates a timeline
- [ ] `/nca-resit-calculator/` loads and calculates
- [ ] `/about/` loads with correct founder bio
- [ ] `/testimonials/` loads with Anum's testimonial
- [ ] `/faq/` accordion opens and closes correctly
- [ ] All 5 notes subject pages show exam countdown badge above buy button
- [ ] All 5 notes subject pages show Anum's testimonial
- [ ] `/sitemap.xml` is valid XML and lists all new pages
- [ ] `/robots.txt` exists and contains sitemap reference

## Design Tests

- [ ] Every new page has identical nav to the homepage
- [ ] Every new page has identical footer to the homepage
- [ ] No page has broken images or CSS (visual spot check)
- [ ] Mobile layout works on each new page at 375px width
- [ ] No external requests to unapproved CDNs or libraries

## SEO Tests

- [ ] Every new page has a unique `<title>` tag
- [ ] Every new page has a `<meta name="description">` tag
- [ ] Every new page has a `<link rel="canonical">` tag
- [ ] FAQ page has `FAQPage` schema in JSON-LD
- [ ] Notes pages have `Product` schema in JSON-LD
- [ ] Blog articles have `Article` schema in JSON-LD
- [ ] Homepage has `Organization` schema in JSON-LD

## Conversion Tests

- [ ] Exam countdown badge appears on all 5 notes subject pages
- [ ] Anum's testimonial appears on all 5 notes subject pages and homepage
- [ ] Cost calculator CTA updates dynamically with subject count
- [ ] Email opt-in form appears on exam dates page and exam planner page
- [ ] All "Get Notes →" CTAs point to correct subject-specific pages

## What Must NOT Have Changed

- [ ] Free chapter Formspree form on homepage still works (test submission)
- [ ] All Payhip purchase links still point to correct URLs
- [ ] Global stylesheet is unmodified
- [ ] Any existing working article pages are unmodified

---

# SECTION 11: REFERENCE DATA

## 11.1 Complete NCA Exam Planner Widget Source Code

The complete widget source code is too long to repeat here but can be found at:
The conversation with the user on April 11, 2026 where the widget was built.
The widget uses the SUBS data array below. Copy both the HTML/CSS/JS in full.

**SUBS data array (the authoritative subject data for all tools):**
```javascript
const SUBS = [
  {id:'admin', name:'Administrative Law', short:'Admin Law', mandatory:true, hasNotes:true,
   notesUrl:'/notes/administrative-law/', payhipUrl:'https://payhip.com/b/UNbgM',
   difficulty:4, diffLabel:'Complex', passRate:58, recHours:100, recWeeks:6, color:'#185FA5',
   sessions:[
     {s:new Date(2026,5,2),  e:new Date(2026,5,5),  r:new Date(2026,4,7)},
     {s:new Date(2026,7,31), e:new Date(2026,8,3),  r:new Date(2026,7,6)},
     {s:new Date(2026,10,17),e:new Date(2026,10,20),r:new Date(2026,9,22)}
   ]},
  {id:'con', name:'Constitutional Law', short:'Con Law', mandatory:true, hasNotes:true,
   notesUrl:'/notes/constitutional-law/', payhipUrl:'https://payhip.com/THENCAHUB',
   difficulty:5, diffLabel:'Most Complex', passRate:52, recHours:100, recWeeks:8, color:'#534AB7',
   sessions:[
     {s:new Date(2026,6,7),  e:new Date(2026,6,10), r:new Date(2026,5,11)},
     {s:new Date(2026,9,5),  e:new Date(2026,9,8),  r:new Date(2026,8,10)}
   ]},
  {id:'crim', name:'Criminal Law', short:'Crim Law', mandatory:true, hasNotes:true,
   notesUrl:'/notes/criminal-law/', payhipUrl:'https://payhip.com/THENCAHUB',
   difficulty:3, diffLabel:'Challenging', passRate:61, recHours:80, recWeeks:5, color:'#1D9E75',
   sessions:[
     {s:new Date(2026,4,12), e:new Date(2026,4,15), r:new Date(2026,3,2)},
     {s:new Date(2026,7,10), e:new Date(2026,7,13), r:new Date(2026,6,9)},
     {s:new Date(2026,10,9), e:new Date(2026,10,13),r:new Date(2026,9,1)}
   ]},
  {id:'pr', name:'Professional Responsibility', short:'Prof Resp', mandatory:true, hasNotes:true,
   notesUrl:'/notes/professional-responsibility/', payhipUrl:'https://payhip.com/THENCAHUB',
   difficulty:3, diffLabel:'Challenging', passRate:65, recHours:60, recWeeks:4, color:'#3B6D11',
   sessions:[
     {s:new Date(2026,4,4),  e:new Date(2026,4,7),  r:new Date(2026,3,2)},
     {s:new Date(2026,7,4),  e:new Date(2026,7,7),  r:new Date(2026,6,9)},
     {s:new Date(2026,10,3), e:new Date(2026,10,6), r:new Date(2026,9,1)}
   ]},
  {id:'fcl', name:'Foundations of Canadian Law', short:'FCL', mandatory:true, hasNotes:true,
   notesUrl:'/notes/foundations-of-canadian-law/', payhipUrl:'https://payhip.com/THENCAHUB',
   difficulty:4, diffLabel:'Complex', passRate:55, recHours:100, recWeeks:6, color:'#BA7517',
   sessions:[
     {s:new Date(2026,6,14), e:new Date(2026,6,17), r:new Date(2026,5,11)},
     {s:new Date(2026,9,13), e:new Date(2026,9,16), r:new Date(2026,8,10)}
   ]},
  {id:'contracts', name:'Contracts', short:'Contracts', mandatory:false, hasNotes:false,
   difficulty:3, recHours:65, recWeeks:4, color:'#888780',
   sessions:[
     {s:new Date(2026,4,11), r:new Date(2026,3,2)},
     {s:new Date(2026,8,8),  r:new Date(2026,7,6)}
   ]},
  {id:'prop', name:'Property', short:'Property', mandatory:false, hasNotes:false,
   difficulty:3, recHours:70, recWeeks:5, color:'#888780',
   sessions:[
     {s:new Date(2026,5,1),  r:new Date(2026,4,7)},
     {s:new Date(2026,9,20), r:new Date(2026,8,10)}
   ]},
  {id:'torts', name:'Torts', short:'Torts', mandatory:false, hasNotes:false,
   difficulty:3, recHours:65, recWeeks:4, color:'#888780',
   sessions:[
     {s:new Date(2026,6,13), r:new Date(2026,5,11)},
     {s:new Date(2026,10,16),r:new Date(2026,9,1)}
   ]},
  {id:'biz', name:'Business Organizations', short:'Biz Org', mandatory:false, hasNotes:false,
   difficulty:3, recHours:60, recWeeks:4, color:'#888780',
   sessions:[{s:new Date(2026,7,17), r:new Date(2026,6,9)}]},
  {id:'fam', name:'Family Law', short:'Family Law', mandatory:false, hasNotes:false,
   difficulty:3, recHours:55, recWeeks:4, color:'#888780',
   sessions:[
     {s:new Date(2026,3,13), r:new Date(2026,3,6)},
     {s:new Date(2026,10,2), r:new Date(2026,9,1)}
   ]},
  {id:'evi', name:'Evidence', short:'Evidence', mandatory:false, hasNotes:false,
   difficulty:3, recHours:60, recWeeks:4, color:'#888780',
   sessions:[
     {s:new Date(2026,3,14), r:new Date(2026,3,6)},
     {s:new Date(2026,9,19), r:new Date(2026,8,10)}
   ]},
  {id:'civil', name:'Civil Procedure', short:'Civil Proc', mandatory:false, hasNotes:false,
   difficulty:3, recHours:60, recWeeks:4, color:'#888780',
   sessions:[{s:new Date(2026,8,9), r:new Date(2026,7,6)}]},
  {id:'rem', name:'Remedies', short:'Remedies', mandatory:false, hasNotes:false,
   difficulty:2, diffLabel:'Moderate', recHours:45, recWeeks:3, color:'#888780',
   sessions:[{s:new Date(2026,7,18), r:new Date(2026,6,9)}]},
  {id:'com', name:'Commercial Law', short:'Commercial', mandatory:false, hasNotes:false,
   difficulty:3, recHours:60, recWeeks:4, color:'#888780',
   sessions:[{s:new Date(2026,6,6), r:new Date(2026,5,11)}]}
];
const TODAY = new Date(2026,3,11); // April 11, 2026 — DO NOT CHANGE TO new Date()
```

## 11.2 Fee Reference Data (for all pages and tools)

```
NCA assessment fee: $400 CAD base + taxes (HST/GST) = ~$452 incl. HST (Ontario)
NCA exam per attempt: ~$500 CAD + taxes = ~$565 incl. HST
LRW (CPLED): $375 CAD (no taxes)
Indigenous Law competency: $150–$400 CAD (estimate, varies by provider)
NCA COQ application: $200 CAD
NCA Hub Notes Only per subject: $149 CAD
NCA Hub Complete System per subject: $175 CAD
NCA Hub All 5 Bundle: $749 CAD
LSO application: ~$4,500 CAD (verify with LSO for current)
LSBC application: ~$1,700 CAD (verify with LSBC for current)
LSA application: ~$3,000 CAD (verify with LSA for current)
Ontario Barrister exam: ~$720 CAD
Ontario Solicitor exam: ~$720 CAD
```

## 11.3 Disclaimer Text (use on all pages that reference NCA information)

"The NCA Hub is an independent educational resource and is not affiliated with,
endorsed by, or connected to the National Committee on Accreditation (NCA™), the
Federation of Law Societies of Canada, or any provincial law society. All information
should be verified at nca.legal. All trademarks belong to their respective owners."

---

# SECTION 12: SCOPE LIMITS — DO NOT DO THESE

1. Do not change any pricing on any page
2. Do not modify the Payhip purchase URLs
3. Do not modify the global CSS stylesheet
4. Do not add any analytics tracking scripts (Google Analytics, Facebook Pixel, etc.)
5. Do not add cookie consent banners (one already exists)
6. Do not add any social media embeds or third-party widgets
7. Do not create pages for 2027 exam schedule data
8. Do not rename any existing page URLs (will break inbound links)
9. Do not modify `/nca-prep-checklist/` or `/nca-statistics/` (they have server-side
   restrictions — 403 errors — that mean they work correctly; do not touch)
10. Do not add password protection or login systems
11. Do not introduce any npm, node_modules, or package.json
12. Do not use localStorage or sessionStorage in widgets (not supported)
13. Do not use the Anthropic API in any new tools (static calculations only)

---

*END OF MASTER PROMPT*
*Version 1.0 | The NCA Hub | April 2026*
*37 issues | 6 agents | estimated 4–5 hours execution time*

