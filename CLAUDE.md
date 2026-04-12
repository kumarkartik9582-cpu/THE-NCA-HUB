# NCA HUB — ADD PROPERTY LAW TO READINESS SCORE QUIZ
## One task. Zero guessing. Read the existing code first.

---

## STEP 1 — FIND AND READ THE QUIZ CODE COMPLETELY

Do not write a single line of code until you have done this.

```bash
# Find the readiness score quiz
find . -name "*.html" | xargs grep -l "readiness\|Readiness" 2>/dev/null | grep -v node_modules | grep -v .git
find . -name "*.js" | xargs grep -l "readiness\|subject.*quiz\|quiz.*subject" 2>/dev/null | grep -v node_modules | head -10

# Read the main readiness page
cat readiness/index.html > /tmp/readiness_full.html
wc -l /tmp/readiness_full.html

# Find the subject data structure
grep -n "Administrative Law\|Criminal Law\|Contract Law\|Family Law\|Evidence" readiness/index.html | head -30

# Find where subjects are defined (array, object, or HTML)
grep -n "subjects\|SUBJECTS\|subjectList\|subjectData" readiness/index.html | head -20

# Find the question structure for one existing subject (e.g. Criminal Law)
grep -n -A 3 "Criminal Law\|actus reus" readiness/index.html | head -40

# Check if questions are inline in HTML or in a JS object
grep -n "question\|Question\|questions" readiness/index.html | head -30

# Find where "Contract Law" is defined (it is in the list, so use it as template)
grep -n -B 2 -A 20 "Contract Law\|Formation, terms" readiness/index.html | head -60
```

Read every output. Understand exactly:
1. How subjects are stored (JS array? HTML elements? JSON?)
2. How questions are stored per subject
3. How many questions per subject
4. What format each question takes (multiple choice? scale? yes/no?)
5. What the "description" line under each subject looks like

---

## STEP 2 — ADD PROPERTY LAW AS THE 9TH SUBJECT

Once you understand the structure, add Property Law using the EXACT SAME format
as every other subject. Do not invent a new format. Copy the structure precisely.

### Subject entry to add:

**Display name:** Property Law
**Description line:** Torrens system, estates in land, co-ownership, easements, mortgages, priorities
**Position:** Add after Evidence Law (last in the current list) OR in exam-date order
  (Property exam is Jun 1, so it should appear after Criminal Law which is May 12
  and before Admin Law which is Jun 2 — but follow whatever ordering logic exists)

---

## STEP 3 — PROPERTY LAW QUESTIONS

Read how many questions each existing subject has. Match that number exactly for Property Law.

Use these questions. Select the ones that match the quiz format you discovered in Step 1.
If the quiz uses multiple choice, adapt accordingly. If it uses confidence scales, adapt accordingly.

**Questions for Property Law readiness assessment:**

### Q1 — The Torrens system
"Can you explain the difference between immediate and deferred indefeasibility, and name the main exception to Torrens title protection?"

**Why this question:** The Torrens system is the most common failure point for internationally trained lawyers. Vavilov is to Admin Law what Torrens is to Property — the make-or-break framework.

### Q2 — Estates in land
"Can you identify the key characteristics of fee simple, life estate, and leasehold, and explain how each can be created or transferred?"

**Why this question:** Core classification question that appears in foundational property issues.

### Q3 — Co-ownership
"Can you name the four unities required for joint tenancy and explain all three methods of severing a joint tenancy from Williams v Hensman?"

**Why this question:** Co-ownership is a high-frequency exam topic with specific technical rules.

### Q4 — Leases vs licences
"Can you apply the Street v Mountford test to distinguish a lease from a licence, and explain why the distinction matters for covenants?"

**Why this question:** The lease/licence distinction appears in scenario questions and requires applying a specific case test.

### Q5 — Easements
"Can you state the four characteristics from Re Ellenborough Park and explain how easements can be created by implied grant?"

**Why this question:** Easements are almost always tested and require knowing both the characteristics AND the creation methods.

### Q6 — Mortgages
"Can you explain the equity of redemption, name at least two mortgagee remedies, and state the duty on a mortgagee exercising the power of sale?"

**Why this question:** Mortgages appear in the exam and require both conceptual understanding and specific remedy knowledge.

### Q7 — Restrictive covenants
"Can you explain why restrictive covenants in equity (Tulk v Moxhay) bind successors while positive covenants generally do not run at law?"

**Why this question:** The benefit/burden distinction in covenants is a frequent conceptual question.

### Q8 — Priority rules
"Can you explain the nemo dat rule and the main exception that protects a bona fide purchaser for value without notice of a prior equitable interest?"

**Why this question:** Priority is the connective tissue of the whole Property course — tested in almost every scenario question involving competing interests.

### Q9 — Answer structure
"Do you have a pre-built answer template you can open in under 10 seconds that structures a Property Law exam answer from issue identification through to remedy?"

**Why this question:** Open-book exam readiness — this is the meta-question that measures exam-day preparedness, not just legal knowledge.

### Q10 — Exam awareness
"Do you know the next NCA Property Law exam date and whether registration is currently open?"

**Answer:** June 1, 2026 · Registration closes May 7 (OPEN as of April 2026)
**Why this question:** Tactical readiness — a candidate who does not know their exam date is not ready.

---

## STEP 4 — RESULTS AND CTA FOR PROPERTY LAW

The quiz likely shows a result/score at the end with a recommendation.
For Property Law, the recommendation text and CTA should be:

**If score is low (not ready):**
"Property Law requires building from scratch for most internationally trained lawyers.
The Torrens system has no direct equivalent in most foreign jurisdictions — start there.
Get the Property Law notes → /notes/property/"

**If score is medium (partially ready):**
"You have the foundations. Focus on Torrens indefeasibility and the priority rules —
these are where marks are won and lost. The answer template in the notes pre-structures
every question.
Get the Property Law Complete System → /notes/property/"

**If score is high (ready):**
"Strong preparation. Run one full practice question under timed conditions before your
exam date. The next Property Law exam is June 1, 2026.
Review the notes → /notes/property/"

**The CTA button for Property Law:**
Text: "Get Property Law Notes →"
Link: /notes/property/

---

## STEP 5 — VERIFY

```bash
# Confirm Property Law appears in the readiness quiz subject list
grep -n "Property\|Torrens\|property law" readiness/index.html | head -20

# Count total subjects now — should be 9
grep -c "Administrative Law\|Criminal Law\|Constitutional Law\|Foundations\|Professional Resp\|Contract Law\|Family Law\|Evidence Law\|Property Law" readiness/index.html

# Check the subject selector renders correctly — count the subject option divs
grep -c "Vavilov\|actus reus\|Division of powers\|Sources of law\|Conflicts\|Formation\|Divorce Act\|Admissibility\|Torrens" readiness/index.html
```

All counts must return 9 or match the expected number.

---

## STEP 6 — COMMIT AND PUSH

```bash
git add readiness/index.html
git add -A
git commit -m "feat: add Property Law to readiness score quiz with 10 subject-specific questions"
git pull --rebase origin main
git push
```

---

## WHAT NOT TO DO

- Do not change the quiz format, styling, or any other subject's questions
- Do not change the scoring algorithm
- Do not rename any existing subjects
- Do not add Property Law as a mandatory subject — it is an elective
- Do not change any links for existing subjects
- Do not modify any other file except readiness/index.html (and any linked JS files
  if the question data lives in a separate JS file)

*End of prompt*
