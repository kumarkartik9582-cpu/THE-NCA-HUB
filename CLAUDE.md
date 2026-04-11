# NCA HUB — HOMEPAGE FIX PROMPT
## Critical Visual and Content Fixes for index.html

---

## BEFORE YOU TOUCH ANYTHING

Run these three commands first and read every output:

```bash
cat index.html | grep -n "prefers-reduced-motion" | head -20
cat index.html | grep -n "Nothingwasted\|Ownitforever\|Yoursubject\|Beforeyousit" | head -20
cat index.html | grep -n "subjects\|property\|Property" | head -30
```

Then open index.html in full and read it completely before writing a single line of code.
The bugs described below are all in index.html and its associated CSS/JS. Do not touch
any other file until index.html is fully fixed.

---

## WHAT IS BROKEN — READ EVERY ITEM CAREFULLY

### BUG 1: CONJOINED TEXT — WORDS RUNNING TOGETHER WITH NO SPACES

On the live site, multiple text strings appear with no spaces between words:
- "Beforeyousit." should be "Before you sit."
- "NCAjourney." should be "NCA journey."
- "Thennothing." should be "Then nothing."
- "Oneweektoprepare." should be "One week to prepare."
- "builtitself." should be "built itself."
- "nobodyelsedoes." should be "nobody else does."
- "You'reaccountableto4others." should be "You're accountable to 4 others."
- "builddifferently." should be "build differently."
- "Nothingwasted." should be "Nothing wasted."
- "Ownitforever." should be "Own it forever."
- "Yoursubject." should be "Your subject."
- "topass." should be "to pass."
- "Completelythen" should be "Completely then"

**Root cause to investigate:** This is almost certainly one of two things:
(a) The HTML has these words written without spaces and a CSS property like
`word-spacing: 0` or `letter-spacing` is not the issue — the actual HTML text
nodes are missing spaces. Find every instance and add the spaces.
(b) OR there is a CSS animation/typewriter effect that is concatenating strings
incorrectly in JavaScript. Find the JS and fix the string array.

Search for these exact strings in index.html and in any linked JS files:
```bash
grep -rn "Beforeyousit\|NCAjourney\|Oneweektoprepare\|Nothingwasted\|Ownitforever" . --include="*.html" --include="*.js"
```

Fix every instance. Every word must have a space after it.

---

### BUG 2: DARK EMPTY STATS SECTION

The section showing:
```
5  Subjects cleared all complete
3  Months for first 4 subjects
7  Days to prepare for the first exam
80 Pages max per subject vs 200+ elsewhere
```

...appears as a DARK BLOCK with NO VISIBLE CONTENT. The numbers and labels exist in
the HTML but are not visible because either:
(a) Text colour is set to dark on a dark background — check CSS for this section
(b) The section has `opacity: 0` and an animation that never triggers
(c) A JavaScript intersection observer is supposed to animate these numbers in but
    is failing silently

**Fix:** Find this stats section in index.html. Inspect its CSS classes. Check:
- What background colour is applied to the section
- What colour is applied to the text/numbers
- Whether there is an `opacity: 0` or `visibility: hidden` that needs to be removed
- Whether there is a scroll-triggered animation (`IntersectionObserver`) that is
  failing — if so, either fix the observer or remove it and make the content
  permanently visible with `opacity: 1`

The stats must be fully visible without any interaction. Remove any animation that
hides them. If you want to keep an animation, ensure the fallback state is visible.

---

### BUG 3: ANUM TESTIMONIAL NOT VISIBLE + MISSING ANIMATION

The testimonial:
> "I passed on my 4th and final attempt. This is the only method that worked for me."
> — ANUM, WHO PASSED CONSTITUTIONAL LAW ON HER 4TH AND FINAL ATTEMPT

Is either invisible (same colour as background, or opacity 0) or not rendering at all.

**Fix requirements:**
1. Make the testimonial fully visible with correct contrast
2. The exact quote text must be: "I passed on my 4th and final attempt. This is the
   only method that worked for me."
3. The attribution must be: "Anum · Constitutional Law · 4th attempt"
   (NOT "ANUM, WHO PASSED CONSTITUTIONAL LAW ON HER 4TH AND FINAL ATTEMPT" in all caps
   — that is too long and reads like a label not a person's name)
4. Add an "unfurl" reveal animation: when the user scrolls to this section, the quote
   should animate in with a fade + slight upward movement. Use CSS:
   ```css
   @keyframes testimonial-reveal {
     from { opacity: 0; transform: translateY(16px); }
     to   { opacity: 1; transform: translateY(0); }
   }
   .testimonial-reveal {
     animation: testimonial-reveal 0.7s ease forwards;
   }
   ```
   Trigger this with an IntersectionObserver when the element enters the viewport.
   The initial state should be `opacity: 0` only if the JS is guaranteed to fire.
   Add a fallback: if JS fails, the testimonial is still visible (`opacity: 1` via
   a `.no-js` class or a timeout fallback).

---

### BUG 4: VISIBLE CODE COMMENT IN PAGE

The string `// end prefers-reduced-motion` is visible on the page as text.
This is a JavaScript or CSS comment that has leaked into the HTML content.

Search for it:
```bash
grep -n "end prefers-reduced-motion" index.html
```

Find it and delete it entirely. It must not appear anywhere on the rendered page.

---

### BUG 5: INVISIBLE TEXT SECTIONS

The following sections exist in the HTML but their text is not visible to the user.
Each one needs to be investigated and fixed. The text is there — the CSS is hiding it.

**Section A: "Know exactly where you stand"**
The line after this heading is not visible. Find the heading, find the paragraph or
span that follows it, and ensure its colour is set to a visible value (not transparent,
not matching the background).

**Section B: "Plan your [something]"**
A section beginning with "Plan your" has text that is not showing. Same fix — check
colour, opacity, z-index, and overflow settings.

**Section C: UK law firm + Supreme Court judgment section**
A section referencing "three UK law firms" and "Supreme Court judgment" is showing
in black text but is not visible — meaning it is black text on a dark background OR
the section is overflowing and being clipped. Fix the colour contrast so the text
is readable.

**Section D: "One week to prepare" timeline items**
The journey/timeline section showing:
- One week to prepare
- All five subjects passed
- Certificate issued

...is not visible. These are likely inside a timeline or step component where the
text colour is set incorrectly. Find the component and fix text colours to be
visible against their background.

**General fix approach for all invisible text:**
```bash
# Find sections with these strings
grep -n "where you stand\|Plan your\|UK law firm\|Supreme Court\|One week to prepare\|five subjects passed\|Certificate" index.html
```
For each section found, trace its CSS classes and fix colour/opacity/visibility.

---

### BUG 6: SUBJECT ORDERING — SORT BY UPCOMING EXAM DATE

On the homepage, subjects are listed in a fixed order. They should be dynamically
sorted so that the subject with the SOONEST upcoming exam date appears FIRST.

**The correct sort order as of April 11, 2026 (use these exact dates):**

| Position | Subject | Next Exam | Days Away |
|----------|---------|-----------|-----------|
| 1st | Professional Responsibility | May 4, 2026 | 23 days |
| 2nd | Criminal Law | May 12, 2026 | 31 days |
| 3rd | Administrative Law | Jun 2, 2026 | 52 days |
| 4th | Constitutional Law | Jul 7, 2026 | 87 days |
| 5th | Foundations of Canadian Law | Jul 14, 2026 | 94 days |
| 6th | Property (notes available) | Jun 1, 2026 | 51 days |
| 7th | Contracts | May 11, 2026 | 30 days |
| 8th | Business Organizations | Aug 17, 2026 | 128 days |
| 9th | Family Law | Nov 2, 2026 | 205 days |
| LAST | Subjects with no notes yet (blurred/locked) | — | — |

**Rules for ordering:**
1. Subjects where notes ARE available and uploaded → show first, sorted by exam date (soonest first)
2. Subjects where notes are NOT yet available → show last, greyed out / blurred
3. Never show a subject's exam date if it has already passed — skip to the next session

**Implementation:** If the subjects are rendered in HTML as static elements, reorder
the HTML elements to match the above order. If they are rendered by JavaScript from
a data array, sort the array by next exam date before rendering.

---

### BUG 7: ADD PROPERTY LAW AS A FULL SUBJECT

Property Law notes are now available (the user will upload files to the repo under
the `notes/property/` and `free-chapters/` folders). Update the entire site to treat
Property as a fully available subject — NOT blurred, NOT "coming soon", NOT locked.

**Every place that lists subjects must now include Property Law as available:**

1. **Homepage subjects section:** Add/update Property Law card with:
   - Subject name: Property
   - Next exam: Jun 1, 2026 (51 days from April 11)
   - Registration: closes May 7, 2026 (OPEN)
   - Status: AVAILABLE (not blurred)
   - Link to: `/notes/property/`
   - Payhip link: use same `https://payhip.com/THENCAHUB` as other subjects

2. **Notes index page (`/notes/index.html`):** Add Property card alongside the 5
   mandatory subjects. Use identical card design. Link to `/notes/property/`

3. **Create `/notes/property/index.html`:** Follow the EXACT same template as
   `/notes/administrative-law/index.html`. Replace Admin Law content with:
   - Subject name: Property
   - Key topics: estates and interests in land, personal property, torrens system,
     co-ownership, leases, mortgages, easements, covenants, priorities
   - Exam urgency badge: "51 days · Jun 1, 2026 · Registration closes May 7 (OPEN)"
   - Pricing: same tiers ($149 Notes Only, $175 Complete System)
   - Payhip link: `https://payhip.com/THENCAHUB`
   - Anum testimonial (same as other pages)
   - Related articles pointing to any property law articles that exist

4. **Sitemap (`sitemap.xml`):** Add `https://www.thencahub.com/notes/property/`

5. **nca-exam-planner and all tools:** Ensure Property is listed as a subject with
   notes available (`hasNotes: true`, `notesUrl: '/notes/property/'`)

6. **nca-subject-predictor:** Include Property in predicted subject lists for India,
   Nigeria, Philippines, UK (GDL) country profiles

---

### BUG 8: SUBJECTS WITH NO NOTES GO TO THE BACK

Subjects that do not yet have notes uploaded must be:
- Shown AFTER all subjects that have notes
- Visually indicated as "coming soon" or blurred/locked
- NOT shown before available subjects

Subjects currently without notes (keep blurred, put last):
- Evidence
- Civil Procedure
- Remedies
- Commercial Law
- Torts (check if notes exist — if not, keep blurred)

Subjects that now have notes (show first, fully active):
- Administrative Law ✓
- Constitutional Law ✓
- Criminal Law ✓
- Foundations of Canadian Law ✓
- Professional Responsibility ✓
- Property ✓ (new — user is uploading)
- Contracts (check if notes exist — if yes, show active; if no, keep blurred)
- Business Organizations (check if notes exist)
- Family Law (check if notes exist)

```bash
# Check which subject note folders exist and have content
ls -la notes/*/index.html 2>/dev/null
```

Show only subjects with actual `/notes/[subject]/index.html` files as fully active.
Everything else goes to the blurred/coming-soon section at the bottom.

---

### BUG 9: "MATERIALS AND DEVELOPMENT" LABEL MUST BE REMOVED FROM VISIBLE SUBJECTS

Wherever a subject card shows "Materials in Development" or similar placeholder text,
and that subject NOW has notes available (see Bug 8 list above), remove that label
and replace it with the proper subject description and buy button.

Search for it:
```bash
grep -n "Materials in Development\|materials and development\|in development\|coming soon" index.html --ignore-case
```

For every subject that now has notes: remove the placeholder and replace with proper
subject card content matching the format of the working subjects.

---

## WHAT TO DO AFTER FIXING index.html

Once all bugs above are fixed in index.html:

1. Check `/notes/index.html` — apply the same subject ordering (soonest exam first,
   available subjects before blurred subjects)

2. Check `/nca-exam-planner/index.html` — ensure Property is in the SUBS data array
   with `hasNotes: true`

3. Check `/nca-subject-predictor/index.html` — ensure Property appears in predicted
   subject lists

4. Run a final visual check:
```bash
# Look for any remaining conjoined text
grep -n "[a-z][A-Z]" index.html | grep -v "class\|href\|src\|url\|http\|var\|function\|const\|let" | head -30
```

5. Commit and push:
```bash
git add -A
git commit -m "Fix: conjoined text, invisible sections, subject ordering, Property Law added"
git push
```

---

## WHAT NOT TO CHANGE

- Do not change any Payhip purchase links
- Do not change pricing ($149 / $175 / $749)
- Do not modify the nav or footer structure
- Do not change any working sections of the homepage
- Do not introduce new CSS frameworks or JS libraries
- Do not change the global stylesheet — only fix inline styles and page-level styles

---

## TESTING CHECKLIST BEFORE COMMITTING

- [ ] Every word on the homepage has proper spaces between words
- [ ] Stats section (5/3/7/80) is fully visible with correct colours
- [ ] Anum testimonial is visible and has fade-in animation
- [ ] "// end prefers-reduced-motion" text does not appear anywhere
- [ ] "Know exactly where you stand" section text is visible
- [ ] "Plan your" section text is visible
- [ ] UK law firm / Supreme Court section text is visible and readable
- [ ] Timeline section (one week to prepare / five subjects / certificate) is visible
- [ ] Subjects are sorted: soonest exam first, available notes first, blurred last
- [ ] Property Law appears as a fully active subject (not blurred)
- [ ] Property Law links to /notes/property/
- [ ] /notes/property/index.html exists and has full content
- [ ] No subject with available notes shows "Materials in Development"
- [ ] All Payhip links unchanged
- [ ] git push succeeded

*End of prompt*
