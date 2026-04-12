# NCA Results Announcement — Rapid Publish Template

## Purpose

This template lets you publish an NCA results announcement article within 1 hour of the NCA releasing results. Speed matters: candidates search for "[subject] NCA results" immediately after release. Being first to publish captures that traffic.

---

## Variables to Replace

Find and replace every instance of these placeholders before publishing:

| Variable | Example | Description |
|----------|---------|-------------|
| `[SUBJECT]` | `Administrative Law` | Full subject name, title case |
| `[SUBJECT_SLUG]` | `administrative-law` | Lowercase, hyphenated for URLs |
| `[MONTH_YEAR]` | `August 2026` | Month and year results were released |
| `[SESSION_MONTH]` | `June` | The exam session month (e.g. June, October) |
| `[SESSION_YEAR]` | `2026` | The exam session year |
| `[PUBLISH_DATE]` | `2026-08-15` | ISO date for schema (YYYY-MM-DD) |
| `[PUBLISH_MONTH_YEAR]` | `August 2026` | Human-readable publish date |
| `[NEXT_SESSION_DATES]` | `Aug 31 – Sep 3, 2026` | Next exam session date range |
| `[NEXT_SESSION_MONTH]` | `September` | Month name of next session |
| `[NEXT_REG_DEADLINE]` | `August 10` | Registration deadline for next session |
| `[DAYS_UNTIL_NEXT]` | `47` | Days from publish date to next exam |
| `[PAYHIP_LINK]` | `https://payhip.com/b/xxxxx` | Payhip product link (if different from notes page) |
| `[NOTES_PAGE_URL]` | `/notes/administrative-law/` | Path to the subject notes page |
| `[YEAR]` | `2026` | Current year for copyright |

---

## Pre-Publish Checklist

- [ ] NCA has officially released results (verify at nca.legal or via official NCA email)
- [ ] Replace ALL placeholder variables (search for `[` to find any remaining)
- [ ] Verify the next exam session dates are correct (check /nca-exam-dates-2026/)
- [ ] Verify the registration deadline is correct
- [ ] Verify the notes page URL is correct and the page exists
- [ ] Update the canonical URL to match the folder name
- [ ] Update OG and Twitter meta to match the title/description
- [ ] Test locally: open index.html in browser, check for broken layout
- [ ] Add the article to /search-index.json
- [ ] Add the article to /blog/index.html (articles listing page)
- [ ] Run `git add`, `git commit`, `git push` to deploy via Cloudflare Pages
- [ ] Verify the live page loads at the canonical URL
- [ ] Share the link in WhatsApp groups and social channels within 30 minutes of publishing

---

## Folder Naming Convention

Use: `blog/nca-[subject-slug]-results-[session-month]-[year]/index.html`

Examples:
- `blog/nca-admin-law-results-june-2026/index.html`
- `blog/nca-criminal-law-results-may-2026/index.html`
- `blog/nca-constitutional-law-results-july-2026/index.html`
- `blog/nca-pr-results-may-2026/index.html`
- `blog/nca-fcl-results-july-2026/index.html`

---

## HTML Template

Copy the entire block below into `index.html` inside the appropriately named folder.

```html
<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="ai-content-declaration" content="human-authored">
<title>NCA [SUBJECT] Exam Results Released — [MONTH_YEAR] | The NCA Hub</title>
<meta name="description" content="NCA [SUBJECT] results from the [SESSION_MONTH] [SESSION_YEAR] session have been released. If you passed: congratulations. If you didn't: here is the exact resit strategy.">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#C9A84C">
<meta name="msapplication-TileColor" content="#C9A84C">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="NCA Hub">
<link rel="canonical" href="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<meta name="geo.region" content="CA">
<meta name="geo.country" content="Canada">
<meta http-equiv="content-language" content="en-ca">
<link rel="alternate" hreflang="en-ca" href="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<link rel="alternate" hreflang="en-CA" href="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<link rel="alternate" hreflang="x-default" href="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<meta name="keywords" content="NCA [SUBJECT] results, NCA [SUBJECT] exam results [SESSION_YEAR], NCA results [SESSION_MONTH] [SESSION_YEAR], NCA resit [SUBJECT]">

<!-- Open Graph -->
<meta property="og:type"        content="article">
<meta property="article:published_time" content="[PUBLISH_DATE]T00:00:00+00:00">
<meta property="og:url"         content="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<meta property="og:title"       content="NCA [SUBJECT] Exam Results Released — [MONTH_YEAR] | The NCA Hub">
<meta property="og:description" content="NCA [SUBJECT] results from the [SESSION_MONTH] [SESSION_YEAR] session have been released. Passed or failed — here is your exact next step.">
<meta property="og:site_name"   content="The NCA Hub">
<meta property="og:image"       content="https://www.thencahub.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The NCA Hub — NCA exam preparation for internationally trained lawyers qualifying in Canada">

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:url"         content="https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/">
<meta name="twitter:title"       content="NCA [SUBJECT] Exam Results Released — [MONTH_YEAR] | The NCA Hub">
<meta name="twitter:description" content="NCA [SUBJECT] results from the [SESSION_MONTH] [SESSION_YEAR] session. Passed or failed — here is your exact next step.">
<meta name="twitter:creator" content="@thencahub">
<meta name="twitter:image"       content="https://www.thencahub.com/og-image.jpg">

<!-- Schema.org: Article + BreadcrumbList -->
<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "NCA [SUBJECT] Exam Results Released — [MONTH_YEAR]",
      "description": "NCA [SUBJECT] results from the [SESSION_MONTH] [SESSION_YEAR] session have been released. If you passed: congratulations. If you didn't: here is the exact resit strategy.",
      "url": "https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/",
      "datePublished": "[PUBLISH_DATE]",
      "dateModified": "[PUBLISH_DATE]",
      "author": {
        "@type": "Person",
        "name": "Kartik Kumar",
        "url": "https://www.thencahub.com/about/",
        "jobTitle": "Founder, The NCA Hub"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The NCA Hub",
        "url": "https://www.thencahub.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.thencahub.com/favicon.svg"
        }
      },
      "mainEntityOfPage": "https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/",
      "image": "https://www.thencahub.com/og-image.jpg",
      "inLanguage": "en-CA",
      "keywords": "NCA [SUBJECT] results, NCA resit, NCA exam results [SESSION_YEAR]"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.thencahub.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free Guides",
          "item": "https://www.thencahub.com/blog/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "NCA [SUBJECT] Results — [MONTH_YEAR]",
          "item": "https://www.thencahub.com/blog/nca-[SUBJECT_SLUG]-results-[SESSION_MONTH_LOWER]-[SESSION_YEAR]/"
        }
      ]
    }
  ]
}
</script>

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&display=swap" rel="stylesheet">
<style>
:root{--void:#020204;--abyss:#050508;--dark:#0D0D18;--g0:#F0D878;--g1:#C9A84C;--g2:#9E7B30;--g3:#4E3A14;--cream:#EDE5CE;--fog:#998E7C;--dim:#6B6257;--fd:'Cormorant Garamond',Georgia,serif;--fb:'Bricolage Grotesque','Helvetica Neue',sans-serif;--nano:.57rem;--sm:.8rem;--body:.93rem;--lead:1.08rem;--expo:cubic-bezier(.16,1,.3,1);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--void);color:var(--cream);font-family:var(--fb);font-weight:300;line-height:1.75;overflow-x:hidden;-webkit-font-smoothing:antialiased;cursor:none;}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:rgba(201,168,76,0.3);color:#fff}
#cd{position:fixed;width:5px;height:5px;background:var(--g1);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .12s,opacity .2s}
#cr{position:fixed;width:34px;height:34px;border:1px solid rgba(201,168,76,.38);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);transition:width .4s var(--expo),height .4s var(--expo),border-color .3s}
#cr.h{width:64px;height:64px;border-color:var(--g1);}
body:hover #cd{opacity:1}
@media(max-width:960px){body{cursor:auto}}
.grain{position:fixed;inset:0;pointer-events:none;z-index:997;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")}
#prog{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--g3),var(--g1),var(--g0),var(--g1),var(--g3));background-size:200% 100%;z-index:9100;width:0;transform-origin:left;transition:width .1s;animation:shimmer 3s linear infinite;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
nav{position:fixed;top:0;inset-inline:0;z-index:800;padding:22px 72px;display:flex;align-items:center;justify-content:space-between;background:rgba(2,2,4,.94);backdrop-filter:blur(40px) saturate(180%);border-bottom:1px solid rgba(201,168,76,.1);}
.nl{font-family:var(--fd);font-size:1.1rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--g1);line-height:1;margin-right:48px}
.nl .hub{color:var(--g1)}
.nav-links{display:flex;gap:44px}
.nav-links a{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--fog);font-weight:500;transition:color .3s;}
.nav-links a:hover,.nav-links a.active{color:var(--cream)}
.nc{font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;font-weight:600;color:var(--void);background:var(--g1);padding:11px 26px;display:inline-block;transition:transform .3s var(--expo),background .3s;margin-left:20px}
.nc:hover{transform:translateY(-2px);background:var(--g0)}
@media(max-width:960px){.nav-links,.nc{display:none}nav{padding:18px 24px}}
#article-wrap{padding-top:100px}
.art-hero{padding:60px 72px 56px;border-bottom:1px solid rgba(201,168,76,.07);max-width:900px;margin:0 auto;}
@media(max-width:640px){.art-hero{padding:40px 24px 40px}}
.art-breadcrumb{display:flex;align-items:center;gap:12px;margin-bottom:32px}
.art-breadcrumb a{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--dim);transition:color .3s;}
.art-breadcrumb a:hover{color:var(--g1)}
.art-breadcrumb span{font-size:var(--nano);color:rgba(109,98,87,.4)}
.art-cluster{display:inline-flex;align-items:center;gap:10px;font-size:var(--nano);letter-spacing:.32em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:20px}
.art-cluster::before{content:'';width:20px;height:1px;background:var(--g1);flex-shrink:0}
.art-title{font-family:var(--fd);font-size:clamp(2rem,5vw,3.6rem);font-weight:300;line-height:1.05;letter-spacing:-.02em;color:var(--cream);margin-bottom:24px}
.art-meta{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.art-read{font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
.art-desc{font-size:var(--lead);color:var(--fog);line-height:1.75;margin-top:20px;max-width:640px;font-weight:300}
.art-body{max-width:720px;margin:0 auto;padding:64px 72px 100px;}
@media(max-width:640px){.art-body{padding:40px 24px 80px}}
.art-body h2,.art-body h3,.art-body h4{font-family:var(--fd);font-weight:400;color:var(--cream);line-height:1.2;margin-top:2.4em;margin-bottom:.8em;}
.art-body h2{font-size:clamp(1.4rem,3vw,2rem);letter-spacing:-.01em;padding-bottom:.5em;border-bottom:1px solid rgba(201,168,76,.1)}
.art-body h3{font-size:clamp(1.1rem,2.5vw,1.45rem);color:var(--g1)}
.art-body h4{font-size:1rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
.art-body p{font-size:var(--lead);color:var(--fog);line-height:1.85;margin-bottom:1.4em}
.art-body strong{color:var(--cream);font-weight:500}
.art-body em{color:var(--g1);font-style:italic}
.art-body a{color:var(--g1);text-decoration:underline;text-underline-offset:3px;transition:color .2s}
.art-body a:hover{color:var(--g0)}
.art-body ul,.art-body ol{padding-left:1.6em;margin-bottom:1.4em}
.art-body li{font-size:var(--lead);color:var(--fog);line-height:1.8;margin-bottom:.4em}
.art-body li strong{color:var(--cream)}
.art-body blockquote{border-left:2px solid var(--g1);padding:16px 24px;margin:2em 0;background:rgba(201,168,76,.03)}
.art-body blockquote p{color:var(--cream);font-family:var(--fd);font-size:1.1rem;font-style:italic;margin:0}
.art-body hr{border:none;border-top:1px solid rgba(201,168,76,.1);margin:3em 0}
.art-body table{width:100%;border-collapse:collapse;margin:1.6em 0;font-size:var(--sm)}
.art-body th{font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1);border-bottom:1px solid rgba(201,168,76,.2);padding:10px 16px;text-align:left}
.art-body td{color:var(--fog);border-bottom:1px solid rgba(201,168,76,.06);padding:10px 16px}
.rule-box{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.22);border-left:3px solid var(--g1);padding:20px 26px;margin:1.8em 0}
.rule-box p{margin:0;font-size:var(--body);color:var(--cream);line-height:1.75}
.rule-box strong{color:var(--g0)}
.author-bio{background:rgba(201,168,76,.03);border:1px solid rgba(201,168,76,.12);padding:32px 36px;margin-top:56px}
@media(max-width:640px){.author-bio{padding:24px}}
.author-bio-label{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--g2);font-weight:600;margin-bottom:10px}
.author-bio-name{font-family:var(--fd);font-size:1.3rem;font-weight:400;color:var(--cream);margin-bottom:10px}
.author-bio-name a{color:var(--g1)}
.author-bio-desc{font-size:var(--sm);color:var(--fog);line-height:1.8;margin:0}
.art-cta{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.15);padding:48px 52px;margin-top:64px;text-align:center}
@media(max-width:640px){.art-cta{padding:32px 24px}}
.art-cta-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g2);font-weight:600;margin-bottom:16px}
.art-cta-title{font-family:var(--fd);font-size:clamp(1.4rem,3vw,2.2rem);font-weight:300;color:var(--cream);line-height:1.2;margin-bottom:16px}
.art-cta-sub{font-size:var(--body);color:var(--fog);line-height:1.7;margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto}
.art-cta-btn{display:inline-block;padding:16px 44px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:var(--nano);font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo),background .3s}
.art-cta-btn:hover{transform:translateY(-2px);background:var(--g0)}
.art-back{display:block;margin-top:32px;font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;color:var(--dim);transition:color .3s}
.art-back:hover{color:var(--g1)}
footer{border-top:1px solid rgba(201,168,76,.07);padding:80px 72px 40px;margin-top:0}
@media(max-width:640px){footer{padding:60px 24px 40px}}
.ftg{display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px;margin-bottom:60px}
@media(max-width:768px){.ftg{grid-template-columns:1fr;gap:36px}}
.flog{font-family:var(--fd);font-size:1.4rem;font-weight:400;color:var(--g1);letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px}
.ftag{font-size:var(--sm);color:var(--dim);line-height:1.7;max-width:280px}
.fct{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--g2);font-weight:600;margin-bottom:20px}
.fls{list-style:none}
.fls li{margin-bottom:12px}
.fls a{font-size:var(--sm);color:var(--fog);transition:color .3s}
.fls a:hover{color:var(--cream)}
.fb2{border-top:1px solid rgba(201,168,76,.07);padding-top:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px}
.fcl{font-family:var(--fd);font-style:italic;font-size:.95rem;color:var(--dim)}
.fleg{font-size:var(--nano);color:var(--dim);letter-spacing:.08em}
.f-disc{font-size:.6rem;color:rgba(107,98,87,.5);line-height:1.7;max-width:800px}
.f-disc strong{color:rgba(107,98,87,.7)}
.f-disc a{color:rgba(107,98,87,.6)}
.art-notes-cta{background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.03));border:1px solid rgba(201,168,76,.25);border-radius:4px;padding:44px 48px;margin:56px 0 48px;text-align:center}
@media(max-width:640px){.art-notes-cta{padding:32px 24px;margin:40px 0 36px}}
.art-notes-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:14px}
.art-notes-title{font-family:var(--fd);font-size:clamp(1.3rem,2.8vw,2rem);font-weight:300;color:var(--cream);line-height:1.25;margin-bottom:14px}
.art-notes-sub{font-size:var(--body);color:var(--fog);line-height:1.7;margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto}
.art-notes-btn{display:inline-block;padding:14px 40px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:var(--nano);font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo),background .3s;border-radius:2px}
.art-notes-btn:hover{transform:translateY(-2px);background:var(--g0)}

.nh{position:relative;width:44px;height:44px;display:none;align-items:center;justify-content:center;flex-direction:column;gap:6px;background:none;border:none;cursor:pointer;padding:0;margin-left:8px;z-index:9200;flex-shrink:0;}
@media(max-width:960px){.nh{display:flex;}}
.nh span{display:block;width:24px;height:1.5px;background:var(--cream);transform-origin:center;transition:transform .4s ease,opacity .3s,background .3s;}
.nh span:nth-child(2){width:16px;}
.nh.open span:nth-child(1){transform:translateY(7.5px) rotate(45deg);background:var(--g1);}
.nh.open span:nth-child(2){opacity:0;}
.nh.open span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);background:var(--g1);}
#mob-overlay{position:fixed;inset:0;background:rgba(2,2,4,.97);z-index:9100;display:none;flex-direction:column;justify-content:center;padding:70px 48px 48px;overflow-y:auto;}
#mob-overlay.open{display:flex;}
#mob-overlay a{display:block;font-family:var(--fd);font-size:clamp(1.4rem,5vw,2rem);font-weight:300;color:var(--fog);text-decoration:none;padding:16px 0;border-bottom:1px solid rgba(201,168,76,.07);transition:color .3s;}
#mob-overlay a.mob-cta-link{color:var(--g1);}
#mob-overlay a:hover{color:var(--cream);}
.mob-shop-btn{display:inline-flex!important;align-items:center;margin-top:28px;background:var(--g1)!important;color:var(--void)!important;padding:14px 36px;font-family:var(--fb)!important;font-size:.82rem!important;font-weight:700;letter-spacing:.1em;text-transform:uppercase;align-self:flex-start;border:none!important;}
#mob-close{position:absolute;top:22px;right:24px;background:none;border:none;color:var(--g1);font-size:1.3rem;cursor:pointer;padding:8px;z-index:1;}

.nca-skip-nav{position:absolute;top:-100%;left:16px;background:#C9A84C;color:#02020A;padding:8px 16px;border-radius:0 0 6px 6px;font-size:.8rem;font-weight:600;text-decoration:none;z-index:99999;transition:top .1s}
.nca-skip-nav:focus{top:0}

@media print {
  nav,footer,.grain,#prog,#cd,#cr,#cl,.art-cta,.art-notes-cta{display:none!important}
  body{background:#fff!important;color:#000!important;font-size:12pt;line-height:1.6}
  h1,h2,h3{color:#000!important;page-break-after:avoid}
  a{color:#000!important;text-decoration:underline}
  .art-body{max-width:100%!important;padding:0!important}
  body::before{content:"thencahub.com — NCA Exam Prep";display:block;font-size:9pt;color:#666;margin-bottom:16pt;font-family:sans-serif}
}
</style>
<!-- Google Analytics GA4 -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {'analytics_storage': 'denied', 'ad_storage': 'denied', 'wait_for_update': 500});
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CFFP8T95DZ"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-CFFP8T95DZ');
</script>
<link rel="stylesheet" href="/nca-premium-v3.css">
</head>
<body>
<canvas id="ambient-cv" aria-hidden="true" style="position:fixed;inset:0;pointer-events:none;z-index:1;opacity:1;"></canvas>
<canvas id="trail-cv" aria-hidden="true" style="position:fixed;inset:0;pointer-events:none;z-index:9996;"></canvas>

<a href="#main-content" class="nca-skip-nav">Skip to main content</a>

<div class="grain" aria-hidden="true"></div>
<div id="prog"  aria-hidden="true"></div>
<div id="cd"    aria-hidden="true"></div>
<div id="cr"    aria-hidden="true"></div>

<nav aria-label="Site navigation">
  <a href="/" class="nl" aria-label="The NCA Hub home">The NCA <span class="hub">Hub</span></a>
  <div class="nav-links">
    <a href="/#method">Method</a>
    <a href="/#subjects">Subjects</a>
    <a href="/#pricing">Pricing</a>
    <a href="/blog/" class="active">Articles</a>
    <a href="/nca-exam-planner/">Exam Planner</a>
    <a href="/faq/">FAQ</a>
  </div>
  <a href="/#readiness" class="nc">Get My Score</a>
  <button class="nh" id="nh" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
</nav>

<div id="article-wrap">
  <article id="main-content">
    <header class="art-hero">
      <div class="art-breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">></span>
        <a href="/blog/">Blog</a>
        <span aria-hidden="true">></span>
        <span>NCA [SUBJECT] Results</span>
      </div>
      <div class="art-cluster" aria-label="Category">Results Update</div>
      <h1 class="art-title">NCA [SUBJECT] Exam Results Released — [MONTH_YEAR]</h1>
      <div class="art-meta">
        <span class="art-read" style="color:var(--fog);font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;">By <a href="/about/" style="color:var(--g1);text-decoration:none;">Kartik Kumar</a></span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read">5 min read</span>
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read" style="color:var(--dim);">Published: <time datetime="[PUBLISH_DATE]">[PUBLISH_MONTH_YEAR]</time></span>
      </div>
    </header>

    <div class="art-body" id="art-body">

      <p>The NCA has released [SUBJECT] results for the [SESSION_MONTH] [SESSION_YEAR] session. If you have been refreshing your NCA portal for the past few weeks, the wait is over.</p>

      <p>Two outcomes. Two very different next steps. Both of them move you forward.</p>

      <h2>If You Passed</h2>

      <p>Congratulations. One fewer subject standing between you and your Certificate of Qualification.</p>

      <p>Your immediate next steps:</p>

      <ul>
        <li><strong>Check your NCA portal</strong> — confirm the result is reflected in your assessment letter and that the subject is marked as completed.</li>
        <li><strong>Register for your next subject</strong> — if you have remaining exams, check the <a href="/nca-exam-dates-[YEAR]/">exam schedule</a> and register before the deadline closes. Do not wait.</li>
        <li><strong>If this was your last exam</strong> — you now need to complete the Legal Research and Writing (LRW) module and the Indigenous Intercultural Awareness course before the NCA issues your Certificate of Qualification (COQ). Check your portal for specific instructions.</li>
      </ul>

      <p>Do not let momentum fade. The candidates who pass all their subjects fastest are the ones who register for the next session immediately after getting a result.</p>

      <h2>If You Did Not Pass</h2>

      <p>This is not the end. It is a data point. The NCA allows unlimited resits, and many candidates who ultimately qualify did not pass every subject on the first attempt.</p>

      <p>What matters now is what you do differently.</p>

      <h3>The Resit Timeline</h3>

      <p>The next [SUBJECT] exam session is <strong>[NEXT_SESSION_DATES]</strong>. Registration typically closes around <strong>[NEXT_REG_DEADLINE]</strong>. That gives you approximately <strong>[DAYS_UNTIL_NEXT] days</strong> to prepare.</p>

      <p>That is enough time — if you use it strategically.</p>

      <h3>What to Change for Your Resit</h3>

      <p>If you used the same approach and expect a different result, you will get the same outcome. Here is what to change:</p>

      <ol>
        <li><strong>Diagnose where you lost marks.</strong> The NCA does not release marked papers, but you know what areas felt uncertain during the exam. Those are the areas to prioritise. If you ran out of time, the problem is answer structure — not knowledge.</li>
        <li><strong>Use structured answer templates.</strong> NCA exams are open-book, 3-hour, essay-format exams. The candidates who pass are not the ones who know the most law — they are the ones who present their analysis in the format the examiners expect. Every answer should follow a consistent framework: identify the legal issue, state the relevant rule, apply it to the facts, and reach a conclusion.</li>
        <li><strong>Practice under timed conditions.</strong> If you did not do at least two full timed practice exams before your first attempt, start there. Set a 3-hour timer, use only your permitted materials, and write out full answers by hand or in the exam software.</li>
        <li><strong>Cut your materials down.</strong> If your notes are over 100 pages, they are too long for a 3-hour open-book exam. You need concise, tab-indexed reference notes — not a textbook rewrite. The exam rewards fast retrieval, not comprehensive coverage.</li>
      </ol>

      <div class="rule-box">
        <p><strong>The core principle:</strong> An NCA resit is not about studying harder. It is about studying differently. Focus on answer technique, time management, and having materials you can actually navigate under pressure.</p>
      </div>

      <h2>Next [SUBJECT] Session</h2>

      <table>
        <thead>
          <tr>
            <th>Detail</th>
            <th>Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Exam dates</td>
            <td>[NEXT_SESSION_DATES]</td>
          </tr>
          <tr>
            <td>Registration deadline</td>
            <td>~[NEXT_REG_DEADLINE] (verify at nca.legal)</td>
          </tr>
          <tr>
            <td>Format</td>
            <td>Open-book, online-proctored, 3 hours</td>
          </tr>
          <tr>
            <td>Exam fee</td>
            <td>~$500 CAD per subject</td>
          </tr>
          <tr>
            <td>Full schedule</td>
            <td><a href="/nca-exam-dates-[YEAR]/">View all [YEAR] exam dates</a></td>
          </tr>
        </tbody>
      </table>

      <p>Always verify dates and deadlines directly at <a href="https://nca.legal" target="_blank" rel="noopener noreferrer">nca.legal</a> — the NCA occasionally adjusts schedules.</p>

      <hr>

      <!-- Notes CTA -->
      <div class="art-notes-cta">
        <div class="art-notes-eyelet">Resit Preparation</div>
        <div class="art-notes-title">NCA [SUBJECT] — Complete System</div>
        <p class="art-notes-sub">Under 80 pages of precision notes with answer templates for every question type. Built for 3-hour open-book exams. $175 CAD.</p>
        <a href="[NOTES_PAGE_URL]" class="art-notes-btn">View the [SUBJECT] Notes</a>
      </div>

      <!-- Author bio -->
      <div class="author-bio">
        <div class="author-bio-label">Written by</div>
        <div class="author-bio-name"><a href="/about/">Kartik Kumar</a></div>
        <p class="author-bio-desc">Indian-qualified lawyer who built his career at UK law firms DWF, Eversheds Sutherland, and Keoghs. Passed all 5 NCA subjects — 4 cleared in under 3 months, starting with Administrative Law with one week to prepare. Founder of The NCA Hub.</p>
      </div>

    </div>
  </article>
</div>

<footer>
  <div class="ftg">
    <div>
      <div class="flog">The NCA Hub</div>
      <p class="ftag">Strategic preparation for lawyers who had to start over. And refused to stop.</p>
    </div>
    <div>
      <div class="fct">Navigate</div>
      <ul class="fls">
        <li><a href="/#method">The Method</a></li>
        <li><a href="/#subjects">Subjects</a></li>
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener noreferrer">Shop</a></li>
        <li><a href="/blog/">Articles</a></li>
        <li><a href="/nca-exam-planner/">Exam Planner</a></li>
        <li><a href="/faq/">FAQ</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Contact</div>
      <ul class="fls">
        <li><a href="mailto:thencahub@gmail.com" style="color:var(--g1)">thencahub@gmail.com</a></li>
        <li><a href="https://www.linkedin.com/company/thencahub" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/thencahub/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener noreferrer">Shop Now</a></li>
        <li><a href="/#readiness">Get My Score</a></li>
      </ul>
    </div>
  </div>
  <div class="fb2">
    <p class="fcl">"Built for the lawyers who had to start over. And refused to stop."</p>
    <p class="fleg">&copy; [YEAR] The NCA Hub. All rights reserved.</p>
  </div>
  <p class="f-disc"><strong>NOT AFFILIATED WITH THE NCA.</strong> The NCA Hub is an independent educational resource and is not affiliated with, endorsed by, or connected to the National Committee on Accreditation (NCA), the Federation of Law Societies of Canada, or any provincial law society. All trademarks belong to their respective owners. Verify current exam details at <a href="https://nca.legal/exams/content/" target="_blank" rel="noopener noreferrer">nca.legal</a>.</p>
</footer>

<!-- ═══ PREMIUM MOBILE MENU ═══ -->
<div id="mob-overlay" aria-hidden="true" aria-label="Navigation" role="dialog">
  <button id="mob-close" aria-label="Close navigation menu">&#x2715;</button>
  <a href="https://www.thencahub.com/#method">Method</a>
  <a href="https://www.thencahub.com/#subjects">Subjects</a>
  <a href="https://www.thencahub.com/notes/" class="mob-cta-link">Notes</a>
  <a href="https://www.thencahub.com/#pricing">Pricing</a>
  <a href="https://www.thencahub.com/blog/">Articles</a>
  <a href="https://www.thencahub.com/#sample">Free Chapter</a>
  <a href="https://www.thencahub.com/nca-cost-calculator/">Cost Calculator</a>
  <a href="https://www.thencahub.com/faq/">FAQ</a>
  <a href="https://payhip.com/THENCAHUB" class="mob-shop-btn" target="_blank" rel="noopener noreferrer">Shop Now &rarr;</a>
</div>

<script>
(function(){
  // Custom cursor
  if(window.innerWidth>960){
    var cd=document.getElementById('cd'),cr=document.getElementById('cr'),mx=0,my=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
    document.querySelectorAll('a,button,.faq-q').forEach(function(el){
      el.addEventListener('mouseenter',function(){cr.classList.add('h')});
      el.addEventListener('mouseleave',function(){cr.classList.remove('h')});
    });
    function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cd.style.left=mx+'px';cd.style.top=my+'px';cr.style.left=cx+'px';cr.style.top=cy+'px';requestAnimationFrame(loop);}
    loop();
  }
  // Reading progress bar
  var p=document.getElementById('prog');
  window.addEventListener('scroll',function(){
    var pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
    if(p)p.style.width=Math.min(100,pct)+'%';
  },{passive:true});
  // Mobile menu
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('nh');
    var overlay=document.getElementById('mob-overlay');
    var closeBtn=document.getElementById('mob-close');
    if(!btn||!overlay)return;
    function openMenu(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');btn.classList.add('open');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';}
    function closeMenu(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');btn.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow='';}
    btn.addEventListener('click',function(e){e.stopPropagation();overlay.classList.contains('open')?closeMenu():openMenu();});
    if(closeBtn)closeBtn.addEventListener('click',closeMenu);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
    overlay.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){if(!a.href.includes('payhip'))closeMenu();});});
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeMenu();});
  });
  // Scroll reveal
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';obs.unobserve(e.target);}});
    },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.art-body > *').forEach(function(el){
      el.style.opacity='0';el.style.transform='translateY(24px)';
      el.style.transition='opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)';
      obs.observe(el);
    });
  }
})();
</script>
<script src="/nca-chat-widget.js" defer></script>
<script src="/nca-world-class.js?v=20260330" defer></script>
</body>
</html>
```

---

## Quick-Start Workflow

When the NCA releases results:

1. Copy the template HTML above into a new file at `blog/nca-[subject]-results-[month]-[year]/index.html`
2. Open the file in a text editor and use Find & Replace:
   - Replace `[SUBJECT]` with the subject name (e.g. `Administrative Law`)
   - Replace `[SUBJECT_SLUG]` with the URL slug (e.g. `admin-law`)
   - Replace all date/session variables
3. Run through the Pre-Publish Checklist above
4. `git add blog/nca-[subject]-results-[month]-[year]/`
5. `git commit -m "Results: NCA [Subject] [Month] [Year] session"`
6. `git push`
7. Share the live URL in WhatsApp groups and social channels

Target: published and live within 60 minutes of NCA releasing results.
