# Paid Ads Playbook — The NCA Hub

Ready-to-launch Google Search and Meta campaigns to drive NCA-notes sales. Copy the ad text and settings straight into Google Ads / Meta Ads Manager. All prices reflect the current $100-per-subject founding price.

**Positioning reminder:** you are not the cheapest (budget sellers exist around $45 to $120) and not the priciest (premium sellers sit around $150 to $160). Sell on value: concise under-80-page notes, answer templates, a free readiness score, built by someone who passed all five NCA subjects, now $100. Never claim "cheapest."

---

## 0. Before you spend a dollar (one-time setup, ~30 min)

1. **Conversion tracking.** In Google Ads and Meta, create a "Purchase" conversion. Payhip fires a confirmation/thank-you on purchase; point the pixel/tag at the `/purchase-complete/` page (already on the site) or Payhip's post-purchase redirect. Also track a "Lead" conversion on `/free-chapter.html` (the lead-capture success page) and a "Readiness quiz start" event.
2. **Google Analytics + Google Ads link** — already have GA4 (`G-CFFP8T95DZ`); link it to Google Ads so you can import conversions.
3. **Budget rule.** Start at **$15/day per platform ($30/day total)** for two weeks. Kill any ad group with 0 conversions after 100 clicks. Double the budget on any ad group under a $30 cost-per-sale.
4. **UTM tags** on every ad URL so you can see what converts: `?utm_source=google&utm_medium=cpc&utm_campaign=<name>`.

---

## 1. Google Search Ads (highest intent — do this first)

People searching these terms are ready to buy. This is the fastest path to daily sales.

### Campaign A — "NCA Notes" (brand-of-category, high intent)
- **Landing page:** `/notes/`
- **Match types:** phrase + exact. Start tight.
- **Keywords:**
  - "nca notes"
  - "nca exam notes"
  - "nca study notes"
  - "nca preparation notes"
  - "nca notes canada"
  - "best nca notes"
  - "affordable nca notes"
- **Negative keywords:** free, pdf free, torrent, jobs, salary, "nca" (National Cadet Corps / other NCA meanings), reddit, login.

**Ad 1 (responsive search ad):**
- Headlines: `NCA Notes — $100 a Subject` · `Under 80 Pages, Built to Pass` · `Answer Templates Included` · `By Someone Who Passed All 5` · `Free Readiness Score` · `Buy Only the Subjects You Need`
- Descriptions:
  - `Concise NCA notes built for the 3-hour open-book exam. Answer templates for every question type. $100 per subject.`
  - `Stop reading 300 pages. Get the frameworks the exam actually rewards. Free sample chapter and readiness score.`
- Final URL: `https://www.thencahub.com/notes/?utm_source=google&utm_medium=cpc&utm_campaign=nca-notes`

### Campaign B — Per-subject (one ad group per subject → subject page)
For each subject, keyword "nca [subject] notes" / "[subject] nca exam" → its `/notes/[subject]/` page. Highest converters first (from your Payhip data): **Criminal, Administrative, Professional Responsibility, Constitutional.**
- Example (Criminal): keywords "nca criminal law notes", "criminal law nca exam prep" → `/notes/criminal-law/`
- Headline: `NCA Criminal Law Notes — $100` · `Actus Reus, Mens Rea, Defences` · `Answer Templates Included`
- Description: `Precision Criminal Law notes for the NCA challenge exam. Under 80 pages, answer templates, free readiness score. $100.`

### Campaign C — Problem/decision intent (mid-funnel → guide/notes)
- Keywords: "how to pass nca exam", "nca exam prep", "how to study for nca", "failed nca exam", "nca exam in 30 days"
- Landing: the most relevant blog guide (e.g., `/blog/article-pass-nca-90-days/`) or `/nca-cost-calculator/`, which now carry lead capture.
- Headline: `Pass the NCA This Cycle` · `The Method That Cleared 5 Subjects` · `Free Readiness Score`

### Campaign D — Cost/affordability intent
- Keywords: "nca exam cost", "how much are nca notes", "cheap nca notes", "nca notes price"
- Landing: `/nca-cost-calculator/`
- Headline: `NCA Notes $100 a Subject` · `A Fifth of One Resit Fee` · `Calculate Your Total NCA Cost`

**Bid strategy:** start "Maximize clicks" with a max CPC cap of ~$1.50 to gather data, then switch to "Maximize conversions" / target CPA once you have 15+ conversions.

---

## 2. Meta (Facebook + Instagram) Ads (demand-gen — run after Search is live)

Search captures existing intent; Meta creates it among internationally trained lawyers. Best for retargeting and lookalikes.

### Audiences
1. **Retargeting (highest ROI):** everyone who visited the site or started the readiness quiz in the last 30 days but did not buy. Install the Meta pixel first.
2. **Interest targeting:** location = Canada + India + Nigeria + Pakistan + Philippines + UK; interests = "law", "lawyer", "bar exam", "immigration to Canada", "LLB"; age 25–45. Layer job title "lawyer/advocate" where available.
3. **Lookalike:** 1% lookalike of your buyer email list (export from Payhip) once you have 100+ buyers.

### Creative angles (make 3–4 short videos or single images each)
- **The math:** "One failed NCA resit = $500 + 3 months. These notes = $100." (static image, bold numbers)
- **Founder story:** 20-sec talking-head — "I passed all 5 NCA subjects, 4 in under 3 months, with notes under 80 pages. Here's the method." (you on camera)
- **Concise vs 300 pages:** side-by-side visual — a giant textbook vs a slim tabbed binder. "You have 3 hours. You cannot search 300 pages."
- **Readiness score hook:** "Not sure if you're ready to sit? Take the free 5-question NCA readiness score." → drives quiz leads, retarget later.

**Primary text template:**
> Qualified abroad and facing the NCA? You do not need to read for volume — you need the frameworks the exam rewards. The NCA Hub notes are under 80 pages per subject, with answer templates built for the 3-hour open-book exam. Written by someone who passed all 5. $100 per subject. Start with a free sample chapter → [link]

**CTA button:** "Download" (for free-chapter lead) or "Shop Now" (for direct sale). Run both; the free-chapter lead usually wins on cost-per-lead, then nurture by email.

---

## 3. What to measure (check weekly)
- **Cost per sale** (target under $30 → profitable at $100 with ~zero COGS).
- **Cost per lead** (free-chapter signups; target under $3).
- Best subjects / keywords → shift budget there.
- Landing-page conversion rate per campaign → fix the weakest.

## 4. 30-day ramp
- **Week 1:** Search Campaigns A + B (top 4 subjects), $15/day. Meta pixel + retargeting only.
- **Week 2:** add Search C + D; start Meta interest audiences at $10/day.
- **Week 3:** cut losers, double winners; launch Meta lookalike once list is big enough.
- **Week 4:** scale the profitable ad groups; add remaining subjects.

Keep every ad honest and specific — the exam-technique angle and the $100 value are the whole pitch.
