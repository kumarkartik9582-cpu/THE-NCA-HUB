# NCA HUB — PROPERTY LAW FULL SITE INTEGRATION
## Make Property Law work identically to every other subject across the entire site

---

## READ THIS FIRST — WHAT YOU ARE DOING

Property Law notes and a free chapter PDF have been uploaded to this repo. Right now:
- Clicking Property Law anywhere on the site goes directly to Payhip (no subject page)
- The free chapter download feature does not include Property Law
- Multiple pages across the site list subjects but exclude Property Law or show it as locked

Your job is to make Property Law work IDENTICALLY to how Administrative Law, Criminal Law,
Constitutional Law, Foundations, and Professional Responsibility work — everywhere on the site.

---

## STEP 1 — DISCOVER EVERYTHING BEFORE WRITING ANY CODE

Run every command below. Read every output. Do not write a single line of code until
you have completed this entire discovery phase.

```bash
# 1. Find the free chapter files — confirm property is uploaded
ls -la free-chapters/
ls free-chapters/ | grep -i prop

# 2. Find the notes folder structure
ls -la notes/
ls notes/ | grep -i prop

# 3. Read one complete working subject page as your template
cat notes/administrative-law/index.html > /tmp/admin_full.html
wc -l /tmp/admin_full.html
echo "Admin law page read"

# 4. Read the notes index page in full
cat notes/index.html > /tmp/notes_index.html
wc -l /tmp/notes_index.html

# 5. Find the free chapter delivery system — how does it work?
grep -rn "free-chapter\|free_chapter\|freeChapter\|sample" index.html | head -30
grep -rn "free-chapter\|free_chapter" free-chapter.html 2>/dev/null | head -20
ls free-chapters/

# 6. Find every place that lists subjects across the whole site
grep -rn "Administrative Law\|admin-law" . --include="*.html" -l | grep -v node_modules | grep -v ".git"

# 7. Find every place that mentions specific subjects in navigation, lists, or dropdowns
grep -rn "administrative-law\|criminal-law\|constitutional-law\|foundations\|professional-responsibility" . --include="*.html" -l | grep -v node_modules | grep -v ".git" | sort

# 8. Find how the free chapter form/feature works — what JS handles the subject selection?
grep -rn "subject\|free.*chapter\|chapter.*free" index.html | grep -i "select\|option\|dropdown\|form" | head -20
find . -name "*.js" | xargs grep -l "free.*chapter\|chapter.*free" 2>/dev/null | head -10

# 9. Check the current property page if it exists
cat notes/property/index.html 2>/dev/null | wc -l || echo "DOES NOT EXIST"
cat notes/property/index.html 2>/dev/null | head -30 || echo "File missing"

# 10. Find the Payhip links pattern for existing subjects
grep -rn "payhip.com" notes/administrative-law/index.html | head -5
grep -rn "payhip.com" notes/criminal-law/index.html | head -5

# 11. Find where subject cards are rendered on the homepage
grep -n "subject\|Subject\|card\|Card" index.html | grep -v "//\|class\|CSS\|style" | head -30

# 12. Find the nca-exam-planner SUBS array
grep -n "property\|Property\|prop" nca-exam-planner/index.html | head -20

# 13. Check which country guides mention Property specifically
grep -rn "Property\|property law" nca-for-indian-lawyers/index.html | head -10
grep -rn "Property\|property law" nca-for-nigerian-lawyers/index.html | head -5
grep -rn "Property\|property law" nca-for-jamaican-lawyers/index.html | head -5

# 14. Check the subject predictor
grep -n "property\|Property" nca-subject-predictor/index.html | head -10

# 15. Check the study calculator
grep -n "property\|Property" nca-study-calculator/index.html | head -10

# 16. Check if there is a free-chapters page or free chapter download mechanism
cat free-chapter.html 2>/dev/null | grep -i "subject\|admin\|criminal\|property" | head -20
ls free-chapters/

# 17. Find the sitemap
grep -i "property\|notes" sitemap.xml | head -20
```

Save all findings mentally before proceeding to Step 2.

---

## STEP 2 — CREATE THE PROPERTY LAW SUBJECT PAGE

**File:** `notes/property/index.html`

**Critical rule:** Copy `notes/administrative-law/index.html` as your starting template.
Do not invent a new structure. Copy it line by line and replace only the content.
Every CSS link, JS script, nav element, footer element must be identical.

Find the actual Property Law free chapter filename:
```bash
ls free-chapters/ | grep -i prop
```
Use the exact filename you find. If it is `property-law-free-chapter.pdf` then use that.
If it is `NCA-Property-Free-Chapter.pdf` use that. Do not guess — use the real filename.

### HEAD SECTION — replace these values from the admin law template:

```
TITLE: NCA Property Law Notes 2026 — Torrens System, Estates & Answer Templates | The NCA Hub
META DESCRIPTION: NCA Property Law study notes. Under 80 pages. Torrens system, estates and interests in land, co-ownership, leases, mortgages, easements, covenants, and priorities. Answer templates included.
CANONICAL: https://www.thencahub.com/notes/property/
OG:TITLE: NCA Property Law Notes 2026 | The NCA Hub
OG:URL: https://www.thencahub.com/notes/property/
```

### SCHEMA — replace the Product schema with:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "NCA Property Law Notes — Complete System",
  "description": "Precision NCA Property Law study notes under 80 pages with answer templates. Torrens system, estates in land, co-ownership, mortgages, easements, covenants, and priorities.",
  "brand": {"@type": "Brand", "name": "The NCA Hub"},
  "offers": [
    {"@type": "Offer", "name": "Notes Only", "price": "149", "priceCurrency": "CAD", "availability": "https://schema.org/InStock", "url": "https://payhip.com/THENCAHUB"},
    {"@type": "Offer", "name": "Complete System", "price": "175", "priceCurrency": "CAD", "availability": "https://schema.org/InStock", "url": "https://payhip.com/THENCAHUB"}
  ]
}
```

### BREADCRUMB: Home › Notes › Property

### PAGE LABEL: NCA Study Notes · Instant PDF Download

### H1: Property Law NCA Notes

### EXAM URGENCY BADGE (use identical CSS class as admin law badge):
```
51 days until the next Property exam
Jun 1, 2026 · Registration closes May 7 (open now) [GREEN badge]
```

### PRICING TIERS (copy structure from admin law, same prices):
- Notes Only: $149 CAD + taxes
- Complete System (Most Popular): $175 CAD + taxes — PDF notes + Answer templates + Practice questions
- All 5 Subjects: $749 CAD + taxes

### RESIT LINE (copy exactly):
One NCA resit costs **$500 CAD + taxes** and a **3-month wait**.
These notes cost **$175 CAD**. The maths are straightforward.

### GUARANTEE LINE (copy exactly):
If you sit your exam using these notes and don't pass, email hello@thencahub.com and we
will send you the updated notes for your resit — **free.**

### PRIMARY CTA: "Get My Complete System →" → https://payhip.com/THENCAHUB

### FREE CHAPTER DOWNLOAD (this must match how other subjects handle it):
Look at how the admin law page handles the free chapter download link/button.
Copy that exact HTML structure and replace the PDF filename with the Property Law
free chapter filename you found in Step 1.

### TESTIMONIAL (copy verbatim from admin law page):
"I passed on my 4th and final attempt. This is the only method that worked for me."
Anum · Constitutional Law · 4th attempt

### WHAT'S INSIDE SECTION:

H2: What these notes cover

Intro: Every rule, framework, and answer template that appears in NCA Property Law
exams — organised around the answer structure the exam demands.

Content (use → bullet format matching the admin law page):

→ **Estates and interests in land:** Fee simple absolute, life estates, leasehold
estates. The numerus clausus principle. Distinction between legal and equitable
interests. Priority rules between competing interests — the nemo dat principle
and its exceptions.

→ **The Torrens system:** How land registration operates in Canadian provinces.
Immediate vs deferred indefeasibility. Fraud exception. In personam exceptions.
What the register guarantees and what it does not. Compare with the deed registration
systems in provinces that have not adopted Torrens.

→ **Co-ownership:** Joint tenancy vs tenancy in common. The four unities (time, title,
interest, possession). Severance of joint tenancy — Williams v Hensman methods: act of
one party alienating their interest, mutual agreement, course of dealing. Partition and
sale. Rights and obligations of co-owners.

→ **Personal property:** Real vs personal property distinction. Fixtures — degree and
object of annexation test. Gifts inter vivos (delivery + intention + acceptance) and
gifts causa mortis. Bailment — duties of bailor and bailee, standard of care.

→ **Leases and licences:** Street v Mountford — three hallmarks of a lease (exclusive
possession, at a rent, for a term). Distinguishing licence from lease. Covenants in
leases — which run with the land at law (Spencer's Case) and in equity (Tulk v Moxhay).
Assignment and subletting — consent requirements.

→ **Mortgages:** Legal vs equitable mortgages. The equity of redemption and clogs on it.
Mortgagee's remedies — possession, power of sale, appointment of receiver, foreclosure.
Duty on sale — duty to obtain market value (Cuckmere Brick principle in Canadian context).
Priority between mortgages.

→ **Easements:** Four characteristics from Re Ellenborough Park — dominant and servient
tenement, easement must accommodate the dominant land, different owners, capable of
forming subject matter of a grant. Creation — express, implied (necessity, common
intention, Wheeldon v Burrows equivalent), prescription. Extinguishment.

→ **Restrictive covenants:** Equity's intervention — Tulk v Moxhay. Running of benefit
and burden in equity. Building scheme / scheme of development requirements. Discharge
and modification. Why positive covenants do not run at common law.

→ **Priorities:** General priority rules. Legal vs equitable interests. Notice — actual,
constructive, imputed. Registration and its effect on priorities. The bona fide purchaser
for value without notice defence.

→ **Full answer template:** Pre-built answer framework for any NCA Property Law question.
Issue identification → rule statement → application → conclusion, structured for the
3-hour open-book exam format.

### WHY IT MATTERS SECTION:

H2: Why Property Law is harder than it looks

Content (prose, 2 paragraphs):

Property Law spans both real and personal property, covers both common law and equitable
principles, and requires navigating priority disputes between competing interests — all
in a 3-hour open-book exam. Internationally trained lawyers frequently underestimate it.

The Torrens system is the most common failure point. Most foreign jurisdictions operate
on deed registration or title registration systems that differ fundamentally from the
Torrens system used in most Canadian provinces. Candidates who attempt to import their
home jurisdiction's approach to land registration consistently lose marks on priority
questions. These notes build the Canadian framework from scratch with the answer template
that structures every Property question before you start writing.

### READY TO START CTA:
*$175 CAD* · Instant access.
Button: "Get My Notes →" → https://payhip.com/THENCAHUB

### FAQ SECTION:

Q: Is Property Law one of the 5 mandatory NCA subjects?
A: Property Law is not mandatory for all candidates. The 5 mandatory subjects are
Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and
Professional Responsibility. Property is assigned as an elective based on your specific
degree. Indian, Nigerian, and Philippine LLB graduates are frequently assigned Property.
Your NCA assessment letter specifies exactly which subjects you must write.

Q: When is the next NCA Property Law exam?
A: The next NCA Property Law exam is June 1, 2026 — 51 days from April 11, 2026.
Registration closes May 7, 2026. The session after that is October 20, 2026.

Q: How long should I study for NCA Property Law?
A: Most candidates need 70–100 study hours. The Torrens system section typically needs
extra time for candidates from non-Torrens jurisdictions. With The NCA Hub notes and
the answer template, 70 focused hours is achievable for most candidates.

Q: Is Property Law open-book?
A: Yes. All NCA exams are open-book — hard copy materials only. No digital notes or
internet access during the exam.

### RELATED GUIDES SECTION (copy structure from admin law):
- NCA Exam Planner 2026 → /nca-exam-planner/
- How Many Hours to Study for the NCA? → /blog/article-e3-nca-study-hours/
- NCA Subject Assignment Predictor → /nca-subject-predictor/
- NCA Cost Calculator → /nca-cost-calculator/

---

## STEP 3 — UPDATE THE FREE CHAPTER SYSTEM

This is the feature that lets visitors download a free chapter PDF by entering their
email. Find exactly how it works before touching anything.

```bash
# Find the free chapter mechanism
cat free-chapter.html 2>/dev/null | head -100
grep -rn "free.*chapter\|chapter.*free\|freeChapter" . --include="*.js" | head -20
grep -rn "formspree\|Formspree" . --include="*.html" | grep -i "free\|chapter" | head -10
```

Once you understand the mechanism, add Property Law as an option:

**If the free chapter is a subject dropdown/selector:**
Find where the other subjects are listed (Admin Law, Criminal Law, etc.) as options.
Add Property Law as a new option with the correct PDF filename from `free-chapters/`.

**If the free chapter is a direct download link per subject page:**
Add the download link/button on the Property Law notes page pointing to the correct
PDF in `free-chapters/`.

**If the free chapter uses a Formspree form that emails the PDF:**
Find the form. Add a "Property Law" option to the subject selector. Make sure the
Formspree form is set up to recognise this option and deliver the correct PDF.

**The exact free chapter filename:**
```bash
ls free-chapters/ | grep -i prop
```
Use whatever filename you find. Do not rename it.

---

## STEP 4 — UPDATE EVERY PAGE THAT LISTS SUBJECTS

Find every HTML file that lists subjects. For each one, add Property Law in the
correct position. Property Law should appear after the 5 mandatory subjects and before
any blurred/locked subjects.

### 4.1 notes/index.html

Find the grid/list of subject cards. Add a Property Law card matching the exact HTML
structure of the other cards. Use these values:

```
Label: Elective Subject
H2/Heading: Property
Description: Torrens system, estates and interests in land, co-ownership, leases,
mortgages, easements, covenants, and priorities — with a full answer template.
Tags: Under 80 pages + Answer templates
Link text: View Notes →
Link href: /notes/property/
Status: ACTIVE (not blurred, not locked)
```

### 4.2 index.html (homepage subjects section)

Find the subjects section. Find the Property Law card. Verify it:
- Is NOT blurred or locked
- Links to /notes/property/ (NOT directly to payhip.com)
- Shows exam date: Jun 1, 2026
- Shows "51 days" countdown
- Has a "Get Notes →" or "View Notes →" button linking to /notes/property/
- Does NOT say "Materials in Development" or "Coming Soon"

If the card currently links directly to Payhip, change the link to /notes/property/.
The subject page is the landing destination — not Payhip directly.

### 4.3 nca-exam-planner/index.html

Find the SUBS JavaScript array. Find the Property entry. Ensure it has:
```javascript
hasNotes: true,
notesUrl: '/notes/property/'
```
If hasNotes is false or notesUrl is missing or wrong, fix it.

### 4.4 nca-subject-predictor/index.html

Find where subject predictions are listed. For every country profile that predicts
Property Law as a subject (India, Nigeria, Philippines, UK GDL), ensure it shows:
- Property Law as a predicted subject
- A "Get notes →" link pointing to /notes/property/

### 4.5 nca-study-calculator/index.html

Find the subjects list in the calculator. Verify Property Law is listed with:
```
Recommended hours: 70
Subject name: Property
```
If it is missing, add it.

### 4.6 nca-for-indian-lawyers/index.html

Find the table showing subject difficulty and study time for Indian LLB graduates.
It currently shows 5 mandatory subjects. Add Property Law as a 6th row:
```
Subject: Property Law
Typical difficulty: Moderate — Torrens system unfamiliar to Indian lawyers
Study time: 70–100 hrs
```

Also find any paragraph that says "Many Indian LLB graduates are also assigned Property
Law" — if it exists, ensure the subject name links to /notes/property/.

### 4.7 nca-for-nigerian-lawyers/index.html

Find the subject table or list. Add Property Law as a "frequently assigned" elective
with a link to /notes/property/.

### 4.8 nca-for-philippine-lawyers/index.html

Same as above — add Property Law as a frequently assigned elective with notes link.

### 4.9 nca-cost-calculator/index.html

Find the notes pricing section. It currently shows notes available for the 5 mandatory
subjects. Add Property Law to the list:
```
Property Law Notes — Complete System: $175 CAD
Link: /notes/property/
```

### 4.10 nca-notes-comparison/index.html (if it exists)

```bash
cat nca-notes-comparison/index.html 2>/dev/null | grep -i "subject\|admin\|property" | head -10
```

If this page lists the available subjects, add Property Law to the list.

### 4.11 sitemap.xml

Add this entry after the other /notes/ entries:
```xml
<url>
  <loc>https://www.thencahub.com/notes/property/</loc>
  <priority>0.9</priority>
  <changefreq>monthly</changefreq>
</url>
```

---

## STEP 5 — CHECK FOR ANY OTHER MENTIONS

```bash
# Find any other pages that list all available subjects
grep -rn "Administrative Law.*Criminal Law\|all.*subject\|every subject" . --include="*.html" -l | grep -v node_modules | grep -v ".git"

# Find any hardcoded "5 subjects" claims that should now say "6 subjects" or "5+ subjects"
grep -rn "5 subjects\|five subjects\|5 mandatory" . --include="*.html" | grep -v "node_modules\|.git" | head -20

# Find any "available subjects" lists
grep -rn "available.*notes\|notes.*available" . --include="*.html" | grep -v "node_modules\|.git" | head -10
```

For any page that explicitly lists all 5 mandatory subjects and says "notes available
for all 5", update it to reflect that notes are also available for Property Law:
"Notes available for all 5 mandatory subjects and Property Law."

Do NOT change "5 mandatory NCA subjects" — that is a factual statement about the NCA
process. Only change claims about notes availability.

---

## STEP 6 — VERIFY EVERYTHING

Run these checks. Every one must pass. If any fails, fix it before committing.

```bash
# 1. Property page exists and has real content
wc -l notes/property/index.html
grep "Torrens\|co-ownership\|easement" notes/property/index.html | wc -l

# 2. Title tag is correct
grep "<title>" notes/property/index.html

# 3. Canonical URL is correct
grep "canonical" notes/property/index.html

# 4. Free chapter link exists on the property page
grep -i "free.*chapter\|download\|free-chapters" notes/property/index.html | head -5

# 5. Payhip link is present
grep "payhip.com" notes/property/index.html | head -3

# 6. Testimonial is present
grep -i "4th and final\|Anum" notes/property/index.html

# 7. Notes index includes property
grep -i "property" notes/index.html | head -5

# 8. Homepage property card links to /notes/property/ not payhip directly
grep -A 5 -i "property" index.html | grep "href" | head -5

# 9. Sitemap updated
grep "property" sitemap.xml

# 10. Exam planner has Property with hasNotes true
grep -A 3 "'prop'\|\"prop\"" nca-exam-planner/index.html | grep "hasNotes"

# 11. Indian lawyers page updated
grep -i "property" nca-for-indian-lawyers/index.html | head -5

# 12. Subject predictor has property notes link
grep -i "property.*notes\|notes.*property" nca-subject-predictor/index.html | head -3
```

---

## STEP 7 — COMMIT AND PUSH

```bash
git add -A
git commit -m "feat: Property Law full integration — subject page, free chapter, all site references"
git pull --rebase origin main
git push
```

---

## WHAT NOT TO DO

- Do not rename any existing files or change any existing URLs
- Do not change any pricing numbers
- Do not change Payhip links for other subjects
- Do not modify the global stylesheet
- Do not change the 5 mandatory subjects content — Property is an elective
- Do not use placeholder text — every sentence must be real content
- Do not invent a PDF filename — use the exact filename from free-chapters/
- Do not create a new nav structure — copy it from an existing working page

*End of prompt*
