# CLAUDE.md — AI Assistant Guide for THE-NCA-HUB

## Project Overview

THE-NCA-HUB (`www.thencahub.com`) is a static content website providing study guides and resources for candidates sitting the National Committee on Accreditation (NCA) exams in Canada. It is built as a **GitHub Pages static site** with a custom Node.js generator.

- **Founder:** Kartik Kumar (Indian lawyer; passed all 5 NCA subjects; completed CPLED LRW)
- **Contact:** hello@thencahub.com
- **Shop:** https://payhip.com/THENCAHUB
- **Disclaimer:** Not affiliated with the NCA, FLSC, or any provincial law society

---

## Technology Stack

| Layer | Technology |
|---|---|
| Content | Markdown files with bold or YAML frontmatter |
| Build tool | Node.js script (`build.js`) |
| Markdown parser | `marked` npm package (installed at CI time) |
| Output | Pre-rendered HTML (zero JavaScript for content) |
| Hosting | GitHub Pages |
| Domain | Custom via `CNAME` |
| CI/CD | GitHub Actions (`.github/workflows/build.yml`) |
| SEO | Schema.org JSON-LD, Open Graph, Twitter Card, XML sitemap, IndexNow |

There is **no package.json**, no frontend framework, no database, and no backend server. This is a pure static site.

---

## Repository Structure

```
THE-NCA-HUB/
├── build.js                    # Static site generator (855 lines) — core build logic
├── index.html                  # Homepage (~3,290 lines) — product info, pricing, testimonials
├── 404.html                    # Custom error page
├── sitemap.xml                 # Auto-generated; updated by build.js
├── robots.txt                  # SEO crawling rules
├── llms.txt                    # LLM-indexing description of the project
├── CNAME                       # GitHub Pages custom domain (www.thencahub.com)
├── favicon.svg                 # Site favicon
├── og-image.svg                # Open Graph preview image
├── privacy.html                # Privacy policy
├── refund.html                 # Refund policy
├── terms.html                  # Terms of service
├── free-chapter.html           # Free chapter landing page
├── 679ea90259474fdb89ba975b64b7ec6a.txt  # IndexNow API key file (do not rename/delete)
├── .nojekyll                   # Disables GitHub's Jekyll processing
├── blog/
│   ├── article/                # ← WRITE CONTENT HERE (28 .md source files)
│   ├── [article-slug]/         # Auto-generated output directories (do not edit manually)
│   │   └── index.html
│   ├── index.html              # Blog hub/listing page
│   └── article.html            # Article display template
├── about/
│   └── index.html              # Founder profile with Schema.org Person/Organization
├── free-chapters/              # PDF downloads
│   ├── admin_free_chapter.pdf
│   ├── con_free_chapter.pdf
│   ├── crim_free_chapter.pdf
│   ├── fcl_free_chapter.pdf
│   └── pr_free_chapter.pdf
└── .github/
    └── workflows/
        └── build.yml           # CI/CD: auto-build on push to main
```

---

## Content Pipeline (How Articles Are Published)

1. **Write** a markdown file in `blog/article/` following the naming convention and frontmatter format below.
2. **Push** to the `master` branch (or merge a PR targeting `master`).
3. **GitHub Actions** triggers automatically:
   - Installs `marked` via `npm install marked`
   - Runs `node build.js`
   - `build.js` reads every `.md` file in `blog/article/`, renders it to `blog/[slug]/index.html`
   - Updates `sitemap.xml`
   - Auto-commits the generated files with message `chore: rebuild static article pages [skip ci]`
4. **GitHub Pages** deploys the updated static files automatically.

> **Important:** Never manually edit files inside `blog/[slug]/` directories — they are overwritten on every build.

### Running the Build Locally

```bash
npm install marked
node build.js
```

There are no other dependencies. Node.js v20+ is recommended (matching CI).

---

## Article Markdown Format

### File Naming Convention

```
blog/article/article-[CODE][NUMBER]-[descriptive-slug].md
```

**Category codes:**
- `A` — Strategy & Foundation (A1–A4)
- `B` — Subject Guides (B1–B4)
- `C` — Common Fears & Objections (C1–C5)
- `D` — Career Pathways & Comparisons (D1–D4)
- `E` — Study Methodology (E1–E8)
- `F` — Regional / Recent Updates (F1–F3)

### Frontmatter (Bold Format — used by all existing articles)

```markdown
**SEO Title:** Your Optimized Page Title Here
**Meta Description:** 150–160 character description for search result snippets.
**Slug:** your-article-slug
**Category:** Strategy & Foundation
**Tags:** nca exam, canadian law, study guide
**Read Time:** 8 min read
**Published:** 2026-03-01

# Article Heading

Body content in standard markdown...
```

The parser also supports YAML frontmatter (`--- key: value ---`) as an alternative.

### FAQ Section (for rich snippets)

If the article includes a `## FAQ` heading, `build.js` automatically extracts it into JSON-LD `FAQPage` schema. Structure FAQ items as:

```markdown
## FAQ

**Q: Question text here?**
A: Answer text here.

**Q: Another question?**
A: Another answer.
```

---

## SEO Architecture

Every generated article page includes:

- **`<title>`** and **`<meta name="description">`** from frontmatter
- **Canonical URL:** `https://www.thencahub.com/blog/[slug]/`
- **Open Graph** (`og:title`, `og:description`, `og:image`, `og:url`)
- **Twitter Card** meta tags
- **JSON-LD structured data:**
  - `Article` schema (with `datePublished`, `dateModified`, `author`)
  - `BreadcrumbList` schema
  - `FAQPage` schema (if `## FAQ` section present)
- **Sitemap** entry with `lastmod`, `changefreq: monthly`, `priority: 0.9`
- **IndexNow** submission to `api.indexnow.org` for rapid Bing/Yandex indexing

### SEO Overrides in build.js

`build.js` contains **27 hardcoded per-article SEO overrides** (starting around line 127). These map article slugs to optimized titles, meta descriptions, canonical read times, and publication dates. When adding a new article, add its entry to this override map if the frontmatter values need to differ from the markdown content.

---

## Key Files: What to Edit vs. What Not to Touch

| File | Edit? | Notes |
|---|---|---|
| `blog/article/*.md` | YES | Primary content source |
| `index.html` | YES | Homepage — product info, pricing, testimonials |
| `blog/index.html` | YES | Blog hub listing page |
| `about/index.html` | YES | Founder profile |
| `build.js` | CAREFULLY | Core generator; SEO override map is inside |
| `blog/[slug]/index.html` | NO | Auto-generated; overwritten on every build |
| `sitemap.xml` | NO | Auto-generated by build.js |
| `CNAME` | NO | Changing breaks the custom domain |
| `679ea90259474fdb89ba975b64b7ec6a.txt` | NO | IndexNow key; must stay as-is |
| `.nojekyll` | NO | Required for GitHub Pages to work correctly |

---

## Git Workflow

### Branches

- **`master`** — Production branch; pushes here trigger the CI/CD build and GitHub Pages deploy.
- **`claude/*`** — Claude Code session branches; always merge/PR into `master` when done.

### Commit Conventions

- Use lowercase imperative messages: `add article on NCA admin law`, `update homepage pricing`, `fix build.js sitemap generation`
- CI auto-commits use: `chore: rebuild static article pages [skip ci]` — do not replicate this pattern for manual commits
- Use `[skip ci]` only when the commit contains no content changes (e.g., pure formatting), to avoid redundant builds

### CI/CD Notes

- The workflow file is `.github/workflows/build.yml` and triggers on pushes to **`main`** (note: repo default branch is `master` — if builds are not triggering, check that the branch name in the workflow matches)
- `permissions: contents: write` is required for the bot to push generated files back
- The build step runs `git add blog/*/index.html sitemap.xml` — it only stages generated files, not source markdown

---

## Common Tasks

### Add a New Article

1. Create `blog/article/article-[CODE][N]-[slug].md` with bold frontmatter and body.
2. Optionally add a slug entry to the SEO override map in `build.js` (around line 127).
3. If it should appear in the blog listing, add a card to `blog/index.html`.
4. Push to `master`; CI rebuilds and deploys automatically.

### Update Homepage Content

Edit `index.html` directly. This file is hand-authored HTML and is not generated by `build.js`.

### Add a Free Chapter PDF

Place the PDF in `free-chapters/` and link to it from `free-chapter.html` or `index.html`.

### Modify the HTML Template for All Articles

Edit the template embedded inside `build.js` (roughly lines 377–687). Changes apply to all articles on the next build.

### Force a Rebuild Without Content Changes

Use **Actions → Run workflow** (workflow_dispatch) from the GitHub UI, or push an empty commit:

```bash
git commit --allow-empty -m "chore: force rebuild"
git push
```

---

## Important Conventions

- **Pre-rendered HTML only** — Never add client-side rendering for content. All article text must be in the initial HTML response for SEO.
- **No npm dependencies beyond `marked`** — The build has a fallback markdown converter if `marked` is unavailable. Keep the build lightweight.
- **Schema.org compliance** — All structured data must be valid. Test with Google's Rich Results Test when adding new schema types.
- **Clean URLs** — Articles live at `/blog/[slug]/` (trailing slash, served via `index.html`). Never use `.html` extensions in links.
- **Mobile-first HTML/CSS** — All pages use embedded CSS with responsive breakpoints. No CSS frameworks.
- **No secrets in the repo** — The IndexNow key file is a public verification token (by design); actual API secrets must never be committed.
