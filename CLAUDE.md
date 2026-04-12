# NCA HUB — BUILD /tools/ PAGE + HOMEPAGE TOOLS SECTION
## One task. Two outputs. No guessing.

---

## STEP 0 — READ THE REPO BEFORE TOUCHING ANYTHING

```bash
# 1. Confirm every tool actually exists
for dir in nca-exam-planner nca-study-calculator nca-session-planner nca-timeline nca-30-day-plan nca-prep-checklist readiness nca-subject-predictor nca-cost-calculator nca-resit-calculator nca-ai-assistant practice-questions free-chapter nca-notes-comparison nca-passes articling-directory; do
  if [ -f "$dir/index.html" ]; then
    echo "EXISTS: $dir"
  else
    echo "MISSING: $dir"
  fi
done

# 2. Read the homepage CSS variables and design tokens
grep -o 'var(--[^)]*' index.html | sort -u | head -40

# 3. Read the homepage nav structure exactly
grep -n "nav\|<a " index.html | head -30

# 4. Find where to insert the tools section on the homepage
grep -n 'section\|<!-- \|id="' index.html | head -50

# 5. Read one existing page to understand the exact CSS/font/structure
head -60 nca-cost-calculator/index.html
```

Store every finding. Do not write a single line of HTML until this is done.

---

## STEP 1 — CREATE /tools/index.html

The tools page is the single most powerful page on this website. It showcases 16 free tools that no competitor has. It must look exceptional.

**Page title and meta:**
```html
<title>Free NCA Exam Tools 2026 — Planners, Calculators & AI Study Assistant | The NCA Hub</title>
<meta name="description" content="16 free NCA exam tools: readiness score quiz, exam planner, cost calculator, subject predictor, AI study assistant, practice questions and more. Built exclusively for internationally trained lawyers.">
```

**Hero:**
```
16 Free Tools. Zero Competitors Have This.
Built exclusively for internationally trained lawyers preparing for NCA exams.
No signup required. No cost. Use them now.
```

**Tool grid — ordered by candidate journey (most needed first):**

The tools must appear in this exact order because this is the order a new candidate needs them:

GROUP 1 — "Where do I start?" (label: Discovery)
1. Subject Predictor → /nca-subject-predictor/
   "Which NCA subjects will you likely need? Answer 3 questions. Get your predicted subject list."
   Badge: MOST POPULAR

2. Cost Calculator → /nca-cost-calculator/
   "Total cost from assessment to Certificate of Qualification. Every fee included."

3. Readiness Score Quiz → /readiness/
   "10 subject-specific questions. Score out of 100. Find out exactly where you stand."
   Badge: HIGHEST CONVERTING

GROUP 2 — "How do I plan this?" (label: Planning)
4. NCA Exam Planner → /nca-exam-planner/
   "Live countdown to your exam. Gantt calendar. Study load analysis. 3 tools in one."
   Badge: FAN FAVOURITE

5. Study Hours Calculator → /nca-study-calculator/
   "Input your hours per day. Get the earliest realistic exam session you can target."

6. Session Sequence Planner → /nca-session-planner/
   "Which subjects should you write first? Optimal ordering based on your schedule."

7. Qualification Timeline → /nca-timeline/
   "Your complete roadmap from NCA assessment to call to the bar. Province-specific."

8. Preparation Checklist → /nca-prep-checklist/
   "Every milestone from assessment to exam day. Track your progress interactively."

GROUP 3 — "I'm writing soon" (label: Exam Prep)
9. 30-Day Emergency Plan → /nca-30-day-plan/
   "Writing in under 30 days? This is your strategy. Day by day, subject by subject."

10. Resit ROI Calculator → /nca-resit-calculator/
    "The maths on a $500 resit vs $175 notes. Every candidate should see this once."

11. AI Study Assistant → /nca-ai-assistant/
    "Ask any NCA exam question. Get structured IRAC answers. Powered by Claude AI."
    Badge: NEW

GROUP 4 — "I'm studying now" (label: Study Tools)
12. Practice Questions Hub → /practice-questions/
    "Simulated NCA exam questions for all 6 subjects with model answers."

13. Free Chapter Delivery → /free-chapter.html
    "Download a free sample chapter for any subject. No signup. Instant."

14. Notes Comparison → /nca-notes-comparison/
    "Side-by-side comparison of all NCA Hub subject notes packages."

GROUP 5 — "What happens after I pass?" (label: After the NCA)
15. Articling Directory → /articling-directory/
    "Searchable database of Ontario law firms that hire internationally trained lawyers."

16. Candidate Success Wall → /nca-passes/
    "Candidates who passed their NCA exams using The NCA Hub. Add your result."

**Each card design:**
```html
<a href="/[url]/" class="tool-card">
  <!-- If badge exists -->
  <span class="tool-badge">[BADGE TEXT]</span>

  <!-- Group label -->
  <span class="tool-group">[GROUP NAME]</span>

  <!-- Tool name -->
  <h3 class="tool-name">[TOOL NAME]</h3>

  <!-- Description -->
  <p class="tool-desc">[DESCRIPTION]</p>

  <!-- CTA -->
  <span class="tool-cta">Open tool →</span>
</a>
```

**CSS for the tools page** — match the site's exact design system:
- Background: var(--void) or #020204 (site's dark background)
- Card border: 1px solid rgba(255,255,255,0.1)
- Card hover border: 1px solid rgba(201,168,76,0.4) (gold on hover)
- Card background: rgba(255,255,255,0.03)
- Tool name: white, Cormorant Garamond or site's serif font, 20px
- Group label: gold (#C9A84C), 11px, uppercase, letter-spacing 0.12em
- Description: rgba(255,255,255,0.6), 13px, line-height 1.6
- CTA text: #C9A84C, 12px
- Badge: gold background, navy text, 10px, uppercase, pill shape
- Grid: 3 columns desktop, 2 columns tablet, 1 column mobile

**Group headers between card clusters:**
Each group has a section header:
```html
<div class="tools-group-header">
  <span class="tools-group-number">01</span>
  <h2 class="tools-group-title">Discovery</h2>
  <p class="tools-group-sub">Start here. Figure out what you need and what it costs.</p>
</div>
```

**JSON-LD Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "NCA Exam Tools",
  "description": "Free tools for internationally trained lawyers preparing for NCA exams",
  "numberOfItems": 16,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "NCA Subject Predictor", "url": "https://www.thencahub.com/nca-subject-predictor/" },
    { "@type": "ListItem", "position": 2, "name": "NCA Cost Calculator", "url": "https://www.thencahub.com/nca-cost-calculator/" },
    ... (all 16)
  ]
}
```

**ONLY INCLUDE TOOLS CONFIRMED TO EXIST IN STEP 0.**
If a tool is MISSING in Step 0, remove it from this page entirely. Do not link to dead pages.

---

## STEP 2 — ADD TOOLS SECTION TO HOMEPAGE (index.html)

Find the right place on the homepage. It goes AFTER the notes grid section and BEFORE the footer/blog section.

Add this section showing ONLY the 6 highest-converting tools:

```html
<section id="tools-hub" style="padding:80px 24px; background: [match site bg];">
  <div style="max-width:1100px; margin:0 auto;">

    <div style="text-align:center; margin-bottom:16px;">
      <p style="color:#C9A84C; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">16 Free Tools</p>
      <h2 style="font-size:clamp(26px,4vw,40px); font-family:[site serif font]; font-weight:400; color:#fff; margin-bottom:14px;">
        The Most Powerful NCA Toolkit Online
      </h2>
      <p style="color:rgba(255,255,255,0.55); font-size:15px; max-width:520px; margin:0 auto 40px;">
        No competitor has built what we have. Use every tool free — no signup required.
      </p>
    </div>

    <!-- 6-card grid: Subject Predictor, Cost Calculator, Readiness Quiz, Exam Planner, AI Study Assistant, 30-Day Plan -->
    <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:14px; margin-bottom:32px;">
      [INSERT 6 CARDS using same card design as /tools/ page]
    </div>

    <div style="text-align:center;">
      <a href="/tools/" style="
        display:inline-block;
        border:1px solid rgba(201,168,76,0.4);
        color:#C9A84C;
        padding:14px 36px;
        font-size:13px;
        letter-spacing:0.06em;
        text-decoration:none;
        transition: border-color 0.2s, background 0.2s;
      ">
        View all 16 free tools →
      </a>
    </div>

  </div>
</section>
```

---

## STEP 3 — ADD "TOOLS" TO THE NAVIGATION

```bash
# Find the current nav items
grep -n 'href.*nav\|nav.*href\|class="nav' index.html | head -20
```

Add "Tools" as a nav item pointing to /tools/ in the existing nav structure.
Match whatever class pattern the existing nav links use exactly.

Also add the nav item to these pages if they share the same nav:
```bash
grep -rl 'nca-exam-planner\|href.*notes' --include="*.html" . | grep -v ".git\|node_modules" | wc -l
```

If more than 20 pages share the nav, use sed to do a global replace:
```bash
# Find the nav pattern that appears on every page (e.g. the last nav item before closing nav tag)
# Add Tools link immediately after that item on all pages
```

---

## STEP 4 — UPDATE SITEMAP

```bash
grep "tools" sitemap.xml || echo "NOT IN SITEMAP"
```

Add to sitemap.xml if missing:
```xml
<url>
  <loc>https://www.thencahub.com/tools/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## STEP 5 — VERIFY EVERYTHING

```bash
# 1. Tools page exists
test -f tools/index.html && echo "TOOLS PAGE: OK" || echo "TOOLS PAGE: MISSING"

# 2. Every link on the tools page points to a real file
grep -oP 'href="/[^"]*/"' tools/index.html | while IFS= read -r href; do
  path=$(echo "$href" | sed 's|href="||;s|/$||;s|^/||')
  [ -f "$path/index.html" ] && echo "OK: $path" || echo "BROKEN: $path — REMOVE THIS LINK"
done

# 3. Tools section exists on homepage
grep -c "tools-hub\|16 Free Tools" index.html && echo "HOMEPAGE SECTION: OK"

# 4. Tools in nav
grep -c 'href="/tools/"' index.html && echo "NAV: OK"

# 5. No broken links — fix any BROKEN links found in step 2
```

Fix every broken link before committing.

---

## STEP 6 — COMMIT AND PUSH

```bash
git add -A
git commit -m "feat: /tools/ hub page with all 16 tools + homepage section + nav link"
git pull --rebase origin main
git push
```

---

## RULES

1. Only link to tools confirmed to exist as real index.html files — no exceptions
2. Match the site's exact design system — no new fonts, no new colors
3. Do not change any existing tool pages
4. Do not remove any existing homepage content — only ADD the tools section
5. The order of tools on both pages must follow the candidate journey order in this document
6. The word "16 free tools" must appear prominently — this is the competitive message

*End of prompt*
