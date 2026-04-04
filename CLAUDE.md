# The NCA Hub — Claude Code Project Context

## Project Overview
- **Site:** thencahub.com
- **Type:** Static website — Cloudflare Pages, vanilla HTML/CSS/JS
- **Purpose:** NCA exam preparation for internationally trained lawyers qualifying in Canada
- **Serverless functions:** `/functions/api/` (Cloudflare Pages Functions)
- **Active branch:** `claude/organize-nca-hub-table-3rp5y`
- **Push target:** `git push -u origin claude/organize-nca-hub-table-3rp5y`

## Founder — Kartik Kumar
- India-qualified lawyer (NOT UK-qualified — never write "UK-qualified")
- Built career at UK law firms: DWF, Eversheds Sutherland, Keoghs
- Passed all 5 NCA subjects — first exam with only 7 days to prepare
- CoQ (Certificate of Qualification) requested
- Contact: thencahub@gmail.com

**Correct credential string (use exactly):**
> India-qualified lawyer · UK law firm career (DWF, Eversheds Sutherland, Keoghs) · Passed all 5 NCA subjects · CoQ requested

**NEVER write:**
- "500+ candidates" — false claim, never use
- "UK-qualified" — false, Kartik is India-qualified only
- "Indian and UK-qualified" — false

## Design System
```
Background:   #020204  (--void)
Dark:         #0D0D18  (--dark)
Gold bright:  #F0D878  (--g0)
Gold:         #C9A84C  (--g1)
Gold mid:     #9E7B30  (--g2)
Gold deep:    #4E3A14  (--g3)
Cream:        #EDE5CE  (--cream)
Fog:          #998E7C  (--fog)
Dim:          #6B6257  (--dim)
Serif:        'Cormorant Garamond', Georgia, serif  (--fd)
Sans:         'Bricolage Grotesque', 'Helvetica Neue', sans-serif  (--fb)
```

Font sizes: `--nano:.57rem` | `--sm:.8rem` | `--body:.93rem` | `--lead:1.08rem`

## Key Pages
| Path | Purpose |
|---|---|
| `/index.html` | Homepage — hero, subjects, pricing, FAQ, proof |
| `/notes/` | Notes selling pages (all 5 subjects + bundle) |
| `/free-chapter/` | Lead capture + Payhip free download |
| `/blog/` | 44+ articles, SEO traffic driver |
| `/about/` | Founder story |
| `/readiness/` | Free 6-question readiness assessment |
| `/failed-nca/` | Page for candidates who failed NCA |
| `/alumni/` | Results table |
| `/roadmap/` | Product roadmap Q3 2026 → Q1 2027 |
| `/404.html` | Custom error page with conversion CTAs |

## NCA Subjects (5 total)
1. **Administrative Law** — Vavilov standard of review, Baker procedural fairness
2. **Constitutional Law** — Charter s.1 Oakes test, division of powers, s.35
3. **Criminal Law** — general vs specific intent, Charter s.8/9/10, intoxication
4. **Foundations of Canadian Law (FCL)** — unique 3-format structure (not IRAC)
5. **Professional Responsibility (PR)** — Model Code "may" vs "must" distinctions

## Verified Candidate Results (use exact wording)
- `Anum S. · Toronto · Administrative Law · 1st attempt · 10 days · Passed`
- `Anum S. · Toronto · Constitutional Law · 4th attempt · 10 days · Passed`
- `M.B. · Toronto · Administrative Law · 1st attempt · 3 weeks · Passed`
- `R.O. · Vancouver · Constitutional Law · 1st attempt · 6 weeks · Passed`
- `P.S. · Calgary · Criminal Law · 2nd attempt · 4 weeks · Passed`
- `A.K. · Ottawa · 3 subjects · 1st attempt each · Passed`

## SEO Rules — NEVER BREAK THESE
1. **Never alter** `<h1 class="seo-h1">` — it's hidden but indexed; changing it destroys keyword targeting
2. **Never alter** the 5 `<script type="application/ld+json">` schema blocks in index.html without explicit instruction
3. **Never alter** `llms.txt` without explicit instruction
4. **Never remove** canonical `<link rel="canonical">` tags from any page
5. **Never remove** the discovery bar (`.disc-bar`) from any page
6. All schema must say "India-qualified lawyer with UK law firm career at DWF, Eversheds Sutherland, and Keoghs" — not "UK-qualified"

## Blog Article Format
Every blog article must include:
- Schema: Article + LearningResource + BreadcrumbList + FAQPage (all 4 in one `@graph`)
- Author byline block (after article hero, before body):
  ```html
  <div class="author-byline" style="display:flex;align-items:center;gap:16px;padding:16px 0;border-top:1px solid rgba(201,168,76,.1);border-bottom:1px solid rgba(201,168,76,.1);margin-bottom:32px;">
    <div>
      <div style="font-size:.57rem;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C;font-family:'Bricolage Grotesque',sans-serif;font-weight:600;">Written by</div>
      <div style="font-size:.88rem;color:#EDE5CE;">Kartik Kumar</div>
      <div style="font-size:.75rem;color:#998E7C;">India-qualified lawyer · UK law firm career (DWF, Eversheds Sutherland, Keoghs) · Passed all 5 NCA subjects · CoQ requested</div>
    </div>
  </div>
  ```
- Canonical URL, hreflang, OG/Twitter meta
- CTA section at end linking to free chapter and readiness assessment
- Reference existing articles: `/blog/article-c3-one-month-nca-prep/` as style template

## Common Tasks
- **New blog article:** Copy structure from `/blog/article-c3-one-month-nca-prep/index.html`
- **Commit + push:** `git add -A && git commit -m "..." && git push -u origin claude/organize-nca-hub-table-3rp5y`
- **Push with retry:** If push fails, retry up to 4x with exponential backoff (2s, 4s, 8s, 16s)

## API / Backend
- `/functions/api/newsletter.js` — Cloudflare Pages Function, connects to email provider
- `/functions/api/ai-chat.js` — AI assistant endpoint
- Payments: Payhip (external), no server-side payment code in this repo
- Email forms: Formspree for free chapter

## What This Project Is NOT
- Not a React/Vue/Angular app — no build step for HTML pages
- Not a Node.js server — static files only (Cloudflare Pages)
- `build.js` only generates blog article HTML from Markdown (optional utility)
