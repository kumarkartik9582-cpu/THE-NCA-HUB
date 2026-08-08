#!/usr/bin/env node
/**
 * NCA Hub — Static Article Generator
 * Reads every .md file in blog/article/, renders it into a
 * fully pre-rendered HTML page, and writes it to
 * blog/[slug]/index.html — giving Google clean, crawlable URLs
 * with all content visible without JavaScript.
 *
 * Also regenerates sitemap.xml automatically.
 *
 * Usage:  node build.js
 * CI:     runs automatically via .github/workflows/seo-build.yml
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Try to load marked; fall back to a simple converter ──
let marked;
try {
  marked = require('marked').marked || require('marked');
  if (typeof marked !== 'function') throw new Error('bad import');
} catch (_) {
  // Minimal fallback markdown → HTML (handles the common cases)
  marked = function simpleMd(md) {
    return md
      // Fenced code blocks
      .replace(/```[\w]*\n([\s\S]*?)```/gm, (_, c) => `<pre><code>${esc(c.trim())}</code></pre>`)
      // Headings
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm,  '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,   '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
      // HR
      .replace(/^---$/gm, '<hr>')
      // Bold / italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Unordered lists (greedy group)
      .replace(/((?:^- .+\n?)+)/gm, (block) =>
        '<ul>' + block.replace(/^- (.+)$/gm, '<li>$1</li>') + '</ul>')
      // Ordered lists
      .replace(/((?:^\d+\. .+\n?)+)/gm, (block) =>
        '<ol>' + block.replace(/^\d+\. (.+)$/gm, '<li>$1</li>') + '</ol>')
      // Paragraphs (double newline)
      .split(/\n{2,}/)
      .map(chunk => {
        chunk = chunk.trim();
        if (!chunk) return '';
        if (/^<(h[1-4]|ul|ol|li|blockquote|pre|hr)/.test(chunk)) return chunk;
        return `<p>${chunk.replace(/\n/g, ' ')}</p>`;
      })
      .join('\n');
  };
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
}

// ── CONFIGURATION ──────────────────────────────────────────
const SITE_ROOT   = path.resolve(__dirname);
const MD_DIR      = path.join(SITE_ROOT, 'blog', 'article');
const OUT_DIR     = path.join(SITE_ROOT, 'blog');
const SITEMAP_OUT = path.join(SITE_ROOT, 'sitemap.xml');
const BASE_URL    = 'https://www.thencahub.com';

// ── PARSE YAML FRONTMATTER ─────────────────────────────────
function parseFrontMatter(raw) {
  // Try YAML --- block first
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end !== -1) {
      const block   = raw.slice(3, end).trim();
      const content = raw.slice(end + 4).trim();
      const meta    = {};
      block.split('\n').forEach(line => {
        const colon = line.indexOf(':');
        if (colon === -1) return;
        const key = line.slice(0, colon).trim();
        const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
        meta[key] = val;
      });
      return { meta, content };
    }
  }
  // Fall back: parse **Key:** Value bold frontmatter (NCA Hub article format)
  return parseBoldFrontMatter(raw);
}

// ── PARSE BOLD FRONTMATTER ─────────────────────────────────
// Handles the **SEO Title:** / **Meta Description:** format used by all articles
function parseBoldFrontMatter(raw) {
  const lines = raw.split('\n');
  const meta  = {};
  const bodyLines = [];
  let pastFrontMatter = false;

  for (const line of lines) {
    if (!pastFrontMatter) {
      const m = line.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
      if (m) {
        const key = m[1].trim().toLowerCase().replace(/\s+/g, '_');
        meta[key] = m[2].trim();
        continue;
      }
      // Once we hit a non-bold-frontmatter line that isn't blank, we're in body
      if (line.trim() !== '' && line.trim() !== '---') {
        pastFrontMatter = true;
      }
    }
    if (pastFrontMatter) bodyLines.push(line);
  }

  // Map NCA Hub bold-format keys to standard keys
  if (meta['seo_title'])        meta['title']            = meta['seo_title'];
  if (meta['meta_description']) meta['meta_description'] = meta['meta_description'];

  return { meta, content: bodyLines.join('\n').trim() };
}

// ── SEO META OVERRIDES ─────────────────────────────────────
// Optimised titles, descriptions, clusters and dates for every article.
// These override whatever is in the markdown frontmatter.
const SEO_META = {
  'article-pass-nca-90-days': {
    title:       'How to Pass the NCA Exam in 90 Days: Week-by-Week Plan (2026)',
    description: 'The exact framework used to pass 4 NCA subjects in 3 months. Week-by-week calendar, subject sequencing logic, and the 2-hour daily study formula for internationally trained lawyers.',
    cluster:     'strategy',
    readTime:    '12 min',
    datePublished: '2025-11-01',
  },
  'article-a2-nca-exam-format': {
    title:       'NCA Exam Format Explained: What Happens on Exam Day (2026)',
    description: 'Open-book, online-proctored, 3 hours. Exactly what happens on NCA exam day — room setup, question types, time strategy, and what to do if something goes wrong.',
    cluster:     'strategy',
    readTime:    '12 min',
    datePublished: '2025-11-01',
  },
  'article-a3-administrative-law-nca': {
    title:       'NCA Administrative Law Exam Guide 2026: Vavilov, Baker & Full Answer Template',
    description: 'Complete NCA Administrative Law exam guide. Vavilov standard of review, Baker procedural fairness, judicial review — with the exact answer template for every Admin Law question.',
    cluster:     'subjects',
    readTime:    '18 min',
    datePublished: '2025-11-01',
  },
  'article-a4-nca-readiness-score': {
    title:       'NCA Readiness Score: Are You Actually Ready to Sit Your Exam? (2026)',
    description: 'Five dimensions of NCA exam readiness, scored 0–100. The objective answer to "is this enough?" — with a specific action plan for every result band.',
    cluster:     'readiness',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-b1-constitutional-law-nca': {
    title:       'NCA Constitutional Law 2026: Charter Analysis, Division of Powers & Oakes Test Guide',
    description: 'Complete NCA Constitutional Law exam guide. Charter analysis sequence, division of powers, the Oakes test, and Aboriginal rights under s.35 — with a full answer template.',
    cluster:     'subjects',
    readTime:    '16 min',
    datePublished: '2025-11-01',
  },
  'article-b2-criminal-law-nca': {
    title:       'NCA Criminal Law Exam Guide 2026: Actus Reus, Defences & Charter Framework',
    description: 'Complete NCA Criminal Law exam guide. Actus reus, mens rea, major defences under the Criminal Code, and the answer structure that separates pass from fail answers.',
    cluster:     'subjects',
    readTime:    '15 min',
    datePublished: '2025-11-01',
  },
  'article-b3-professional-responsibility-nca': {
    title:       'NCA Professional Responsibility Exam Guide 2026: Model Code, Conflicts & Confidentiality',
    description: 'Complete NCA Professional Responsibility exam guide. CBA Model Code, duties to clients, conflicts of interest, withdrawal — with the answer template that pre-structures every PR question.',
    cluster:     'subjects',
    readTime:    '14 min',
    datePublished: '2025-11-01',
  },
  'article-b4-foundations-canadian-law-nca': {
    title:       'NCA Foundations of Canadian Law: The Complete Guide to the Hardest Core Exam (2026)',
    description: 'Complete NCA Foundations of Canadian Law exam guide. Sources of law, common law methodology, statutory interpretation, and Quebec\'s bijural tradition — the subject most candidates underestimate.',
    cluster:     'subjects',
    readTime:    '14 min',
    datePublished: '2025-11-01',
  },
  'article-c1-failed-nca-exam': {
    title:       'Failed the NCA Exam? The Complete Retake Strategy & Recovery Plan',
    description: 'Failed an NCA exam? Failure is data, not a verdict. The failure autopsy framework: what actually went wrong, what to change, and the retake strategy that works.',
    cluster:     'fear',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-c2-nca-proctoring-guide': {
    title:       'NCA Exam Proctoring: The Complete Technical Setup Guide (2026)',
    description: 'Browser, room, phone setup for NCA remote proctoring. What to cover, what happens if the connection drops, and everything that causes exam-day anxiety — resolved before exam day.',
    cluster:     'fear',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-c3-one-month-nca-prep': {
    title:       'Is One Month Enough to Prepare for the NCA? Day-by-Day Breakdown (2026)',
    description: 'Can you prepare for an NCA exam in one month? Honest answer with a day-by-day schedule. For some subjects, in the right conditions — yes.',
    cluster:     'fear',
    readTime:    '9 min',
    datePublished: '2025-11-01',
  },
  'article-c4-nca-textbook-necessary': {
    title:       'Do You Need the NCA Textbook? The Honest Answer (It Could Save You $400)',
    description: 'Do you actually need the NCA textbook? For most candidates, no. Here is why — and what to use instead that fits inside an open-book 3-hour exam and actually helps you pass.',
    cluster:     'fear',
    readTime:    '8 min',
    datePublished: '2025-11-01',
  },
  'article-c5-nca-exam-anxiety': {
    title:       'NCA Exam Anxiety: What It Actually Is and What to Do (2026)',
    description: 'NCA exam anxiety explained — the real causes, the rational responses, and how to replace uncertainty with precision. Specific techniques for the 72 hours before and during the exam.',
    cluster:     'fear',
    readTime:    '9 min',
    datePublished: '2025-11-01',
  },
  'article-d1-nca-prep-materials-compared': {
    title:       'NCA Prep Materials Compared 2026: What to Look for Before You Buy',
    description: 'Honest evaluation framework for NCA preparation materials. Volume vs precision, live class vs async, objective readiness vs guesswork — before you spend money on any NCA course.',
    cluster:     'comparison',
    readTime:    '11 min',
    datePublished: '2025-11-01',
  },
  'article-d2-nca-to-bar-exam': {
    title:       'NCA to Bar Exam: The Complete Canadian Lawyer Pathway (2026)',
    description: 'Full roadmap from NCA assessment to Call to the Bar. NCA exams, LRW, articling, provincial bar exams — every stage mapped with realistic timelines for internationally trained lawyers.',
    cluster:     'pathway',
    readTime:    '13 min',
    datePublished: '2025-11-01',
  },
  'article-d3-nca-indian-lawyers': {
    title:       'How Indian Lawyers Qualify in Canada: Complete NCA Guide 2026 (Written by an Indian Lawyer)',
    description: 'NCA exam guide for Indian-qualified lawyers. Specific challenges, subject advantages, and the preparation strategy that works — written by an Indian lawyer who passed 4 NCA subjects.',
    cluster:     'pathway',
    readTime:    '11 min',
    datePublished: '2025-11-01',
  },
  'article-d4-nca-uk-based-lawyers': {
    title:       'How UK Lawyers Qualify in Canada via NCA: The Complete 2026 Guide',
    description: 'NCA exam guide for UK-qualified lawyers — solicitors and barristers. Which subjects transfer, which require attention, common pitfalls, and the UK to Canada transition strategy.',
    cluster:     'pathway',
    readTime:    '11 min',
    datePublished: '2025-11-01',
  },
  'article-e1-nca-study-schedule-working': {
    title:       'NCA Study Schedule for Working Professionals: The 2-Hour Daily Formula (2026)',
    description: 'Realistic NCA study plan for candidates balancing full-time work. Week-by-week breakdown built around a 2-hour daily study window — for internationally trained lawyers who cannot quit their job.',
    cluster:     'strategy',
    readTime:    '11 min',
    datePublished: '2025-11-01',
  },
  'article-e2-nca-vs-bar-exam': {
    title:       'NCA vs Bar Exam: Key Differences in Format, Content & Strategy (2026)',
    description: 'How NCA exams differ from provincial bar exams in Canada. Different formats, different content, different strategies — what passes the NCA is not what passes the Bar.',
    cluster:     'comparison',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-e3-nca-study-hours': {
    title:       'How Many Hours to Study for the NCA Exam? The Evidence-Based Answer (2026)',
    description: 'Subject-by-subject NCA study hour breakdowns. What 80 hours vs 200 hours actually looks like — and how to tell if you are over-studying or under-prepared for your NCA exam.',
    cluster:     'strategy',
    readTime:    '9 min',
    datePublished: '2025-11-01',
  },
  'article-e4-nca-process-timeline': {
    title:       'The NCA Process Timeline: From Assessment to Certificate of Qualification (2026)',
    description: 'How long each NCA stage really takes — assessment, subject allocation, exam registration, sitting, and results. Real timelines for internationally trained lawyers, not best-case estimates.',
    cluster:     'strategy',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-e5-300-page-notes-worth-it': {
    title:       '300-Page NCA Notes vs Short Notes: Why Shorter Wins in an Open-Book Exam',
    description: 'Are 300-page NCA notes worth it? Volume is a liability in a 3-hour open-book exam. Why shorter, structured templates outperform lengthy notes on NCA exam day.',
    cluster:     'comparison',
    readTime:    '8 min',
    datePublished: '2025-11-01',
  },
  'article-e6-nca-live-classes-vs-self-study': {
    title:       'NCA Live Classes vs Self-Study: Which Works Better? (2026 Comparison)',
    description: 'NCA live classes or self-study? Cost, time, discipline requirements, and learning styles compared. When to pay for live instruction — and when independent study is more effective.',
    cluster:     'comparison',
    readTime:    '10 min',
    datePublished: '2025-11-01',
  },
  'article-e7-nca-study-checklist': {
    title:       'NCA Study Checklist: What to Complete Before Exam Day (2026)',
    description: 'Week-by-week NCA study checklist covering content review, practice questions, tech setup, and the final 48-hour preparation sequence. Everything to complete before you sit your NCA exam.',
    cluster:     'strategy',
    readTime:    '8 min',
    datePublished: '2025-11-01',
  },
  'article-e8-nca-pass-criteria': {
    title:       'NCA Pass Criteria: What Score Do You Actually Need to Pass? (2026)',
    description: 'Understanding the NCA 50% passing threshold, how exams are graded, and what "competent" means in the NCA marking context. What you actually need to pass — clearly explained.',
    cluster:     'strategy',
    readTime:    '7 min',
    datePublished: '2025-11-01',
  },
  'article-f1-nca-policy-changes-2026': {
    title:       'NCA Policy Changes 2026: Indigenous Law Requirement & Language Screening Explained',
    description: 'NCA policy changes effective March 1, 2026 — the new mandatory Indigenous Law competency, language screening before assessment, and the 2029 in-person education change.',
    cluster:     'pathway',
    readTime:    '9 min',
    datePublished: '2026-03-01',
  },
  'article-f2-nca-nigerian-lawyers': {
    title:       'NCA for Nigerian Lawyers: The Complete Canada Qualification Guide (2026)',
    description: 'Complete NCA guide for Nigerian-qualified lawyers. Assessment timelines, typical subject assignments, common law advantages, and the fastest strategy to complete the NCA process.',
    cluster:     'pathway',
    readTime:    '10 min',
    datePublished: '2026-03-01',
  },
  'article-f3-nca-philippine-lawyers': {
    title:       'NCA for Philippine Lawyers: Hybrid Jurisdiction Guide to Qualifying in Canada (2026)',
    description: 'Complete NCA guide for Philippine-qualified lawyers. How the hybrid civil/common law background is assessed, typical subject requirements, and the preparation strategy that works.',
    cluster:     'pathway',
    readTime:    '10 min',
    datePublished: '2026-03-01',
  },
  'nca-exam-complete-guide': {
    title:       'NCA Exams Canada: The Complete Guide for Internationally Trained Lawyers (2026)',
    description: 'Everything internationally trained lawyers need to know about NCA exams in Canada — who qualifies, required subjects, exam format, study strategy, timelines, and the full path to the Canadian Bar.',
    cluster:     'strategy',
    readTime:    '20 min',
    datePublished: '2026-03-01',
  },
};

// ── EXTRACT FAQ SCHEMA FROM MARKDOWN ──────────────────────
// Reads the ## FAQ section of any article and returns JSON-LD
// FAQPage schema. Returns null if no FAQ section found.
function extractFAQSchema(markdown) {
  const faqIdx = markdown.search(/^## FAQ/m);
  if (faqIdx === -1) return null;

  const faqSection = markdown.slice(faqIdx);
  const pairs = [];

  // Matches: **Q: question text**\n\nanswer text (up to next **Q: or end)
  const re = /\*\*Q:\s*([^*]+)\*\*\n+([\s\S]+?)(?=\n\*\*Q:|$)/g;
  let m;
  while ((m = re.exec(faqSection)) !== null) {
    const question = m[1].trim();
    // Strip markdown from answer: bold, links, newlines
    const answer = m[2].trim()
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, ' ')
      .trim();
    if (question && answer) pairs.push({ question, answer });
  }

  if (pairs.length === 0) return null;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': pairs.map(p => ({
      '@type': 'Question',
      'name': p.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': p.answer }
    }))
  }, null, 2);
}

// ── HTML TEMPLATE ──────────────────────────────────────────
// Uses identical CSS to article.html so pages look exactly the same.
// The key SEO difference: all content is in the HTML response —
// no JavaScript fetch needed for Googlebot to read every word.
function buildHTML({ slug, title, description, cluster, clusterLabel, readTime, bodyHTML, canonicalURL, datePublished, dateModified, faqSchema }) {
  const encodedURL = encodeURIComponent(canonicalURL);
  const encodedTitle = encodeURIComponent(title);
  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(title)} — The NCA Hub</title>
<meta name="description" content="${escHtml(description)}">
<link rel="canonical" href="${canonicalURL}">
<meta name="geo.region" content="CA">
<meta name="geo.country" content="Canada">
<meta http-equiv="content-language" content="en-ca">
<link rel="alternate" hreflang="en-ca" href="${canonicalURL}">
<link rel="alternate" hreflang="en" href="${canonicalURL}">
<link rel="alternate" hreflang="x-default" href="${canonicalURL}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<!-- Open Graph -->
<meta property="og:type"        content="article">
<meta property="og:url"         content="${canonicalURL}">
<meta property="og:title"       content="${escHtml(title)} — The NCA Hub">
<meta property="og:description" content="${escHtml(description)}">
<meta property="og:site_name"   content="The NCA Hub">

<!-- Twitter Card -->
<meta property="twitter:card"        content="summary_large_image">
<meta property="twitter:url"         content="${canonicalURL}">
<meta property="twitter:title"       content="${escHtml(title)} — The NCA Hub">
<meta property="twitter:description" content="${escHtml(description)}">

<!-- Schema.org Article + BreadcrumbList -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "${escJson(title)}",
      "description": "${escJson(description)}",
      "url": "${canonicalURL}",
      "datePublished": "${datePublished}",
      "dateModified": "${dateModified}",
      "author": {
        "@type": "Person",
        "name": "Kartik Kumar",
        "url": "https://www.thencahub.com/about/",
        "jobTitle": "Founder, The NCA Hub",
        "description": "Indian-qualified lawyer who built his career at UK law firms DWF, Eversheds Sutherland, and Keoghs. Passed all 5 NCA subjects and completed CPLED LRW — 4 subjects cleared in under 3 months, with one week to prepare for the first. Certificate of Qualification — received."
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
      "mainEntityOfPage": "${canonicalURL}",
      "image": "https://www.thencahub.com/og-image.jpg",
      "inLanguage": "en-CA"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thencahub.com" },
        { "@type": "ListItem", "position": 2, "name": "Free Guides", "item": "https://www.thencahub.com/blog/" },
        { "@type": "ListItem", "position": 3, "name": "${escJson(title)}", "item": "${canonicalURL}" }
      ]
    }
  ]
}
</script>

${faqSchema ? `<!-- FAQ Schema -->
<script type="application/ld+json">
${faqSchema}
</script>` : ''}

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.json">
<link rel="search" type="application/opensearchdescription+xml" title="The NCA Hub" href="/opensearch.xml">
<!-- Google Analytics 4 — consent mode -->
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
<meta property="og:image" content="https://www.thencahub.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The NCA Hub — NCA exam preparation for internationally trained lawyers in Canada">
<meta property="twitter:image" content="https://www.thencahub.com/og-image.jpg">
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
#read-progress{position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,var(--g1),var(--g0));z-index:10000;transition:width .1s linear;pointer-events:none;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
nav{position:fixed;top:0;inset-x:0;z-index:800;padding:22px 72px;display:flex;align-items:center;justify-content:space-between;background:rgba(2,2,4,.94);backdrop-filter:blur(40px) saturate(180%);border-bottom:1px solid rgba(201,168,76,.1);}
.nl{font-family:var(--fd);font-size:1.1rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--g1);line-height:1;margin-right:48px}
.nl .hub{color:var(--g1)}
.nav-links{display:flex;gap:44px}
.nav-links a{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--fog);font-weight:500;transition:color .3s;}
.nav-links a:hover,.nav-links a.active{color:var(--cream)}
.nc{font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;font-weight:600;color:var(--void);background:var(--g1);padding:11px 26px;display:inline-block;transition:transform .3s var(--expo),background .3s;margin-left:20px}
.nc:hover{transform:translateY(-2px);background:var(--g0)}
.nh{display:none;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;background:none;border:none;padding:9px;cursor:pointer;position:relative;z-index:9200}
.nh span{display:block;height:1px;background:var(--cream);transition:transform .45s var(--expo),opacity .35s,background .3s}
.nh.active span:nth-child(1){transform:translateY(6px) rotate(45deg);background:var(--g1)}
.nh.active span:nth-child(2){opacity:0;transform:scaleX(0)}
.nh.active span:nth-child(3){transform:translateY(-6px) rotate(-45deg);background:var(--g1)}
@media(max-width:960px){.nav-links,.nc{display:none}.nh{display:flex}nav{padding:18px 24px}}
.mob-overlay{position:fixed;inset:0;z-index:9100;clip-path:circle(0% at calc(100% - 44px) 44px);transition:clip-path .75s cubic-bezier(.77,0,.18,1);will-change:clip-path;pointer-events:none}
.mob-overlay.open{clip-path:circle(150% at calc(100% - 44px) 44px);pointer-events:all}
.mob-ink{position:absolute;inset:0;background:radial-gradient(ellipse at top right,#0a0a12 0%,var(--void) 55%)}
.mob-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g1),transparent);transform:scaleX(0);transform-origin:center;transition:transform .6s .3s cubic-bezier(.16,1,.3,1)}
.mob-overlay.open .mob-line{transform:scaleX(1)}
.mob-glow{position:absolute;top:-120px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 65%);pointer-events:none}
.mob-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 48px;padding-top:80px}
.mob-item{overflow:hidden}
.mob-link{display:block;font-family:var(--fd);font-size:clamp(2.2rem,8vw,3.4rem);font-weight:300;color:var(--fog);letter-spacing:-.01em;line-height:1.15;padding:.3em 0;transition:color .3s,transform .3s;will-change:transform}
.mob-link::after{content:'→';opacity:0;margin-left:16px;color:var(--g1);transition:opacity .25s,margin .25s}
.mob-link:hover{color:var(--cream)}
.mob-link:hover::after{opacity:1;margin-left:24px}
.mob-cta{display:inline-block;margin-top:32px;padding:16px 40px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:.72rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo),background .3s}
.mob-cta:hover{transform:translateY(-2px);background:var(--g0)}
.mob-utils{margin-top:28px;display:flex;flex-wrap:wrap;gap:12px 28px}
.mob-utils a{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);transition:color .3s}
.mob-utils a:hover{color:var(--g1)}
.mob-deco{position:absolute;bottom:40px;right:48px;font-family:var(--fd);font-size:clamp(4rem,14vw,8rem);font-weight:300;color:rgba(201,168,76,.04);letter-spacing:.1em;pointer-events:none;user-select:none;line-height:1}
.mob-x{position:absolute;top:20px;right:20px;width:44px;height:44px;background:none;border:none;color:var(--fog);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .3s;z-index:10;}.mob-x:hover{color:var(--g1);}
.mob-counter{font-family:var(--fb);font-size:.62rem;letter-spacing:.2em;color:var(--g2);margin-right:18px;font-weight:500}
@supports not (clip-path: circle(0%)){
  .mob-ink{clip-path:none!important;opacity:0;transition:opacity .5s ease;}
  .mob-overlay.open .mob-ink{opacity:1;}
}
@supports not (backdrop-filter: blur(1px)){
  .mob-overlay .mob-ink{background:rgba(2,2,4,0.99);}
}
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
.art-body h1,.art-body h2,.art-body h3,.art-body h4{font-family:var(--fd);font-weight:400;color:var(--cream);line-height:1.2;margin-top:2.4em;margin-bottom:.8em;}
.art-body h1{font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em}
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
.art-body code{font-family:monospace;font-size:.85em;background:rgba(201,168,76,.08);color:var(--g0);padding:2px 7px;border-radius:2px}
.art-body pre{background:rgba(14,14,26,.8);border:1px solid rgba(201,168,76,.1);padding:24px;margin:1.6em 0;overflow-x:auto}
.art-body pre code{background:none;padding:0;color:var(--cream)}
.art-body hr{border:none;border-top:1px solid rgba(201,168,76,.1);margin:3em 0}
.art-body table{width:100%;border-collapse:collapse;margin:1.6em 0;font-size:var(--sm)}
.art-body th{font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;color:var(--g1);border-bottom:1px solid rgba(201,168,76,.2);padding:10px 16px;text-align:left}
.art-body td{color:var(--fog);border-bottom:1px solid rgba(201,168,76,.06);padding:10px 16px}
.art-body *{font-family:inherit;line-height:inherit}
.art-body > *:first-child{margin-top:0}
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
/* Subject-specific notes CTA */
.art-notes-cta{background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.03));border:1px solid rgba(201,168,76,.25);border-radius:4px;padding:44px 48px;margin:56px 0 48px;text-align:center}
@media(max-width:640px){.art-notes-cta{padding:32px 24px;margin:40px 0 36px}}
.art-notes-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g1);font-weight:600;margin-bottom:14px}
.art-notes-title{font-family:var(--fd);font-size:clamp(1.3rem,2.8vw,2rem);font-weight:300;color:var(--cream);line-height:1.25;margin-bottom:14px}
.art-notes-sub{font-size:var(--body);color:var(--fog);line-height:1.7;margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto}
.art-notes-btn{display:inline-block;padding:14px 40px;background:var(--g1);color:var(--void);font-family:var(--fb);font-size:var(--nano);font-weight:700;letter-spacing:.22em;text-transform:uppercase;transition:transform .3s var(--expo),background .3s;border-radius:2px}
.art-notes-btn:hover{transform:translateY(-2px);background:var(--g0)}
/* Related articles */
.related-articles{padding:48px 72px 0}
@media(max-width:640px){.related-articles{padding:36px 24px 0}}
.rel-eyelet{font-size:var(--nano);letter-spacing:.3em;text-transform:uppercase;color:var(--g2);font-weight:600;margin-bottom:24px}
.rel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.rel-card{display:block;padding:24px;border:1px solid rgba(201,168,76,.12);transition:border-color .3s,transform .3s}
.rel-card:hover{border-color:rgba(201,168,76,.35);transform:translateY(-2px)}
.rel-card-title{font-family:var(--fd);font-size:1.05rem;color:var(--cream);line-height:1.3;margin-bottom:10px;font-weight:400}
.rel-card-desc{font-size:.78rem;color:var(--fog);line-height:1.6}
@media print{#nav,footer,.article-cta,.related-grid,#read-progress,.grain,#spotlight,#cookie-banner,#ep,#discovery-bar{display:none!important;}body{background:#fff!important;color:#000!important;font-size:11pt;line-height:1.6;cursor:auto!important;}h1,h2,h3{color:#000!important;font-family:Georgia,serif;page-break-after:avoid;}a{color:#000!important;text-decoration:underline;}.w{max-width:100%!important;padding:0 1cm!important;}body::before{content:'The NCA Hub — thencahub.com | NCA Exam Preparation';display:block;font-size:8pt;color:#555;border-bottom:1px solid #ccc;padding-bottom:6pt;margin-bottom:16pt;font-family:Arial,sans-serif;}}
</style>
</head>
<body>
<div id="read-progress" aria-hidden="true"></div>
<div class="grain" aria-hidden="true"></div>
<div id="prog" aria-hidden="true"></div>
<div id="cd" aria-hidden="true"></div>
<div id="cr" aria-hidden="true"></div>

<nav aria-label="Site navigation">
  <a href="/" class="nl" aria-label="The NCA Hub home">The NCA <span class="hub">Hub</span></a>
  <div class="nav-links">
    <a href="/#method">Method</a>
    <a href="/#subjects">Subjects</a>
    <a href="/#pricing">Pricing</a>
    <a href="/blog/" class="active">Articles</a>
    <a href="/#sample">Free Chapter</a>
  </div>
  <a href="/#readiness" class="nc">Get My Score</a>
  <button class="nh" id="nh" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
</nav>

<!-- ═══ PREMIUM MOBILE MENU ═══ -->
<div class="mob-overlay" id="mob-overlay" aria-hidden="true" role="dialog" aria-label="Navigation">
  <div class="mob-ink" id="mob-ink"></div>
  <div class="mob-line"></div>
  <div class="mob-glow"></div>
  <canvas id="mob-particles" style="position:absolute;inset:0;pointer-events:none;opacity:.4;"></canvas>
  <div class="mob-deco" aria-hidden="true">NCA</div>
  <div class="mob-content">
    <button class="mob-x" id="mobx" aria-label="Close navigation menu">&#x2715;</button>
    <nav aria-label="Mobile navigation">
      <div class="mob-item"><span class="mob-counter">01</span><a href="/#method" class="mob-link">Method</a></div>
      <div class="mob-item"><span class="mob-counter">02</span><a href="/#subjects" class="mob-link">Subjects</a></div>
      <div class="mob-item"><span class="mob-counter">03</span><a href="/notes/" class="mob-link" style="color:var(--g1);">Notes</a></div>
      <div class="mob-item"><span class="mob-counter">04</span><a href="/#pricing" class="mob-link">Pricing</a></div>
      <div class="mob-item"><span class="mob-counter">05</span><a href="/blog/" class="mob-link">Articles</a></div>
      <div class="mob-item"><span class="mob-counter">06</span><a href="/#sample" class="mob-link">Free Chapter</a></div>
      <div class="mob-item"><span class="mob-counter">07</span><a href="/nca-cost-calculator/" class="mob-link">Cost Calculator</a></div>
    </nav>
    <a href="https://payhip.com/THENCAHUB" class="mob-cta" target="_blank" rel="noopener">Get My Notes →</a>
    <div class="mob-utils">
      <a href="/nca-exam-dates-2026/">Exam Dates 2026</a>
      <a href="/nca-for-indian-lawyers/">Indian Lawyers Guide</a>
      <a href="/become-a-lawyer-in-ontario/">Qualify in Ontario</a>
      <a href="/#readiness">Readiness Score</a>
    </div>
  </div>
</div>

<div id="article-wrap">
  <article>
    <header class="art-hero">
      <div class="art-breadcrumb">
        <a href="/blog/">Articles</a>
        <span aria-hidden="true">›</span>
        <span>${escHtml(clusterLabel)}</span>
      </div>
      <div class="art-cluster" aria-label="Category">${escHtml(clusterLabel)}</div>
      <h1 class="art-title">${escHtml(title)}</h1>
      <div class="art-meta">
        <span class="art-read" style="color:var(--fog);font-size:var(--nano);letter-spacing:.2em;text-transform:uppercase;">By <a href="/about/" style="color:var(--g1);text-decoration:none;">Kartik Kumar</a></span>
        ${readTime ? '<span class="art-read" style="color:var(--dim);">·</span><span class="art-read">' + escHtml(readTime) + ' read</span>' : ''}
        <span class="art-read" style="color:var(--dim);">·</span>
        <span class="art-read" style="color:var(--dim);">Updated: <time datetime="${dateModified}">${dateModified}</time></span>
      </div>
      <p class="art-desc">${escHtml(description)}</p>
      <div style="display:flex;gap:12px;margin-top:24px;margin-bottom:8px;align-items:center;flex-wrap:wrap;">
  <span style="font-size:var(--nano);letter-spacing:.16em;text-transform:uppercase;color:var(--dim);font-family:var(--fb);">Share:</span>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}"
     target="_blank" rel="noopener"
     style="display:inline-flex;align-items:center;padding:8px 18px;border:1px solid rgba(201,168,76,.18);color:var(--fog);font-size:var(--nano);letter-spacing:.14em;text-transform:uppercase;font-family:var(--fb);text-decoration:none;transition:all .25s;"
     onmouseover="this.style.borderColor='var(--g1)';this.style.color='var(--g1)'"
     onmouseout="this.style.borderColor='rgba(201,168,76,.18)';this.style.color='var(--fog)'">LinkedIn</a>
  <a href="https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedURL}"
     target="_blank" rel="noopener"
     style="display:inline-flex;align-items:center;padding:8px 18px;border:1px solid rgba(201,168,76,.18);color:var(--fog);font-size:var(--nano);letter-spacing:.14em;text-transform:uppercase;font-family:var(--fb);text-decoration:none;transition:all .25s;"
     onmouseover="this.style.borderColor='var(--g1)';this.style.color='var(--g1)'"
     onmouseout="this.style.borderColor='rgba(201,168,76,.18)';this.style.color='var(--fog)'">WhatsApp</a>
</div>
    </header>

    <div class="art-body" id="art-body">
      ${bodyHTML}

      <!-- Subject CTA (general — specific versions added per-article) -->
      <div class="art-notes-cta">
        <p class="art-notes-eyelet">Study Notes</p>
        <h3 class="art-notes-title">Notes built to clear every NCA subject.</h3>
        <p class="art-notes-sub">Precision study notes for all 5 NCA subjects — Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, and Professional Responsibility. Built for internationally trained lawyers.</p>
        <a href="/notes/" class="art-notes-btn">Browse My Notes →</a>
      </div>
    </div>
  </article>

  <div class="related-articles" style="max-width:720px;margin:0 auto;padding:48px 72px 0;">
    <p class="rel-eyelet">Related Guides</p>
    <div class="rel-grid">
      <!-- Related article cards injected per-article by build script -->
    </div>
  </div>

  <div style="max-width:720px;margin:0 auto;padding:0 72px 100px;">
    <div class="art-cta">
      <p class="art-cta-eyelet">Ready to prepare?</p>
      <h2 class="art-cta-title">Get the notes used to pass all 5 NCA subjects — 4 cleared in under 3 months.</h2>
      <p class="art-cta-sub">Precision study notes, answer templates, and the readiness score tool — built for internationally trained lawyers.</p>
      <a href="https://payhip.com/THENCAHUB" class="art-cta-btn" target="_blank" rel="noopener">Get Your Notes →</a>
    </div>
    <a href="/blog/" class="art-back">← Back to all articles</a>
  </div>
</div>

<!-- LEAD CAPTURE -->
<section aria-label="Free sample chapter" style="background:#020204;border-top:1px solid rgba(201,168,76,.12);border-bottom:1px solid rgba(201,168,76,.12);padding:56px 24px;">
  <div style="max-width:640px;margin:0 auto;text-align:center;">
    <p style="font-size:.6rem;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;font-weight:600;margin-bottom:12px;font-family:'Bricolage Grotesque',sans-serif;">Free sample chapter</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.5rem,3.5vw,2.2rem);font-weight:300;color:#EDE5CE;margin-bottom:12px;line-height:1.15;">See exactly how these notes read.</h2>
    <p style="font-size:.9rem;color:#998E7C;line-height:1.7;margin-bottom:22px;font-family:'Bricolage Grotesque',sans-serif;">Enter your email for a strategic NCA sample chapter, plus the weekly NCA strategy email. Every subject is $100.</p>
    <form id="leadcap-form" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:460px;margin:0 auto;">
      <input type="email" id="leadcap-email" name="email" required placeholder="Your email address" autocomplete="email" style="flex:1;min-width:200px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.25);color:#EDE5CE;padding:14px 16px;font-family:'Bricolage Grotesque',sans-serif;font-size:.9rem;outline:none;">
      <input type="hidden" name="source" value="blog">
      <input type="hidden" name="_subject" value="Free chapter request (blog)">
      <button type="submit" id="leadcap-btn" style="background:#C9A84C;color:#020204;border:none;padding:14px 26px;font-family:'Bricolage Grotesque',sans-serif;font-size:.76rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;white-space:nowrap;">Get my free chapter &rarr;</button>
    </form>
    <p style="font-size:.66rem;color:#6B6257;margin-top:10px;font-family:'Bricolage Grotesque',sans-serif;">Instant delivery &middot; No payment &middot; Unsubscribe anytime</p>
  </div>
  <script>
  (function(){
    var f=document.getElementById('leadcap-form');if(!f)return;
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=document.getElementById('leadcap-btn');
      var email=(document.getElementById('leadcap-email').value||'').trim();
      if(!email)return;
      btn.disabled=true;btn.textContent='Sending...';
      var go=function(){window.location.href='/free-chapter.html?subject=multiple+subjects';};
      try{fetch('https://formspree.io/f/mkoqgvqd',{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(go).catch(go);}catch(err){go();}
    });
  })();
  </script>
</section>

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
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener">Shop</a></li>
        <li><a href="/blog/">Articles</a></li>
        <li><a href="/#sample">Free Chapter</a></li>
      </ul>
    </div>
    <div>
      <div class="fct">Contact</div>
      <ul class="fls">
        <li><a href="mailto:thencahub@gmail.com">thencahub@gmail.com</a></li>
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener">Shop Now</a></li>
        <li><a href="https://www.linkedin.com/company/thencahub" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/thencahub/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="/#readiness">Get My Score</a></li>
      </ul>
    </div>
  </div>
  <div class="fb2">
    <p class="fcl">"Built for the lawyers who had to start over. And refused to stop."</p>
    <p class="fleg">© ${new Date().getFullYear()} The NCA Hub. All rights reserved.</p>
  </div>
  <p class="f-disc"><strong>NOT AFFILIATED WITH THE NCA.</strong> The NCA Hub is an independent educational resource and is not affiliated with, endorsed by, or connected to the National Committee on Accreditation (NCA™), the Federation of Law Societies of Canada, or any provincial law society. All trademarks belong to their respective owners.</p>
</footer>

<script>
(function(){
  // Cursor
  var cd=document.getElementById('cd'),cr=document.getElementById('cr');
  if(cd&&cr&&window.innerWidth>960){
    var mx=0,my=0,cx=0,cy=0;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){cr.classList.add('h')});
      el.addEventListener('mouseleave',function(){cr.classList.remove('h')});
    });
    function loop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cd.style.left=mx+'px';cd.style.top=my+'px';cr.style.left=cx+'px';cr.style.top=cy+'px';requestAnimationFrame(loop);}
    loop();
  }
  // Progress bar
  var p=document.getElementById('prog');
  window.addEventListener('scroll',function(){
    var pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
    if(p)p.style.width=Math.min(100,pct)+'%';
  },{passive:true});
  // Mobile menu
  var BTN=document.getElementById('nh');
  var OV=document.getElementById('mob-overlay');
  var MOBX=document.getElementById('mobx');
  if(BTN&&OV){
    var isOpen=false;
    function openMenu(){isOpen=true;OV.classList.add('open');OV.setAttribute('aria-hidden','false');BTN.classList.add('active');BTN.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';if(navigator.vibrate)navigator.vibrate(10);}
    function closeMenu(){isOpen=false;OV.classList.remove('open');OV.setAttribute('aria-hidden','true');BTN.classList.remove('active');BTN.setAttribute('aria-expanded','false');document.body.style.overflow='';}
    BTN.addEventListener('click',function(e){e.stopPropagation();isOpen?closeMenu():openMenu();});
    if(MOBX)MOBX.addEventListener('click',closeMenu);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closeMenu();});
    OV.querySelectorAll('.mob-link').forEach(function(a){a.addEventListener('click',function(){var href=a.getAttribute('href')||'';if(!href.startsWith('http'))closeMenu();else setTimeout(closeMenu,100);});});
    OV.querySelectorAll('.mob-link').forEach(function(link){link.addEventListener('mousemove',function(e){var r=link.getBoundingClientRect();var x=((e.clientX-r.left)/r.width-.5)*8;var y=((e.clientY-r.top)/r.height-.5)*4;link.style.transform='translate('+x+'px,'+y+'px)';});link.addEventListener('mouseleave',function(){link.style.transform='';});});
  });
    },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.art-body > *').forEach(function(el){
      el.style.opacity='0';el.style.transform='translateY(24px)';
      el.style.transition='opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)';
      obs.observe(el);
    });
  }
})();
/* MOBILE MENU PARTICLES */
(function(){
  var canvas=document.getElementById('mob-particles');
  var overlay=document.getElementById('mob-overlay');
  if(!canvas||!overlay)return;
  var ctx=canvas.getContext('2d');
  var animId=null;
  var particles=[];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize,{passive:true});
  var COLORS=['rgba(201,168,76,','rgba(240,216,120,','rgba(237,229,206,'];
  for(var i=0;i<60;i++){particles.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,r:Math.random()*2+0.5,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,o:Math.random()*.6+.1,c:COLORS[Math.floor(Math.random()*COLORS.length)]});}
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c+p.o+')';ctx.fill();
    });
  }
  function animate(){draw();animId=requestAnimationFrame(animate);}
  var observer=new MutationObserver(function(){
    if(overlay.classList.contains('open')){if(!animId)animate();}
    else{if(animId){cancelAnimationFrame(animId);animId=null;ctx.clearRect(0,0,canvas.width,canvas.height);}}
  });
  observer.observe(overlay,{attributes:true,attributeFilter:['class']});
})();
</script>
<div id="cookie-banner" role="dialog" aria-label="Cookie consent" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9500;background:rgba(5,5,8,.97);border:1px solid rgba(201,168,76,.22);padding:22px 28px;max-width:540px;width:calc(100% - 48px);backdrop-filter:blur(20px);font-family:var(--fb)">
  <p style="font-size:.78rem;color:var(--fog);line-height:1.6;margin:0 0 16px">We use cookies to measure traffic and improve your experience. See our <a href="/privacy/" style="color:var(--g1)">Privacy Policy</a>.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <button id="ck-necessary" style="background:transparent;color:var(--fog);border:1px solid rgba(201,168,76,.25);padding:9px 20px;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Necessary only</button>
    <button id="ck-all" style="background:var(--g1);color:var(--void);border:none;padding:9px 24px;font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;font-family:var(--fb)">Accept all</button>
  </div>
</div>
<script>
(function(){
  var CONSENT_KEY='nca_cookie_consent';
  var consent=localStorage.getItem(CONSENT_KEY);
  var banner=document.getElementById('cookie-banner');
  function hideBanner(){if(banner)banner.style.display='none';}
  if(consent==='all'){if(typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'});hideBanner();return;}
  if(consent==='necessary'){hideBanner();return;}
  if(banner)banner.style.display='block';
  document.getElementById('ck-necessary').addEventListener('click',function(){localStorage.setItem(CONSENT_KEY,'necessary');hideBanner();});
  document.getElementById('ck-all').addEventListener('click',function(){localStorage.setItem(CONSENT_KEY,'all');if(typeof gtag==='function')gtag('consent','update',{'analytics_storage':'granted'});hideBanner();});
})();
</script>
<script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}</script>
</body>
</html>`;
}

// ── ESCAPE HELPERS ─────────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escJson(s) {
  return String(s || '').replace(/\\/g,'\\\\').replace(/"/g,'\\"');
}

// ── CLUSTER LABELS ─────────────────────────────────────────
const clusterLabels = {
  strategy:   'Exam Strategy',
  subjects:   'Subject Guide',
  fear:       'Common Fears',
  comparison: 'Comparison',
  pathway:    'Career Pathway',
  readiness:  'Readiness',
};

// ── MAIN BUILD ─────────────────────────────────────────────
function build() {
  // Check md directory exists
  if (!fs.existsSync(MD_DIR)) {
    console.error(`❌  Markdown directory not found: ${MD_DIR}`);
    console.error('    Expected: blog/article/*.md');
    process.exit(1);
  }

  const mdFiles  = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md'));
  if (mdFiles.length === 0) {
    console.warn('⚠️  No .md files found in', MD_DIR);
    return;
  }


  const today = new Date().toISOString().slice(0,10);
  const sitemapURLs = [
    { loc: `${BASE_URL}/`,                         priority: '1.0', changefreq: 'weekly',  lastmod: today },
    { loc: `${BASE_URL}/blog/`,                    priority: '0.8', changefreq: 'weekly',  lastmod: today },
    { loc: `${BASE_URL}/about/`,                   priority: '0.7', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/complete-bundle/`,   priority: '0.9', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/administrative-law/`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/constitutional-law/`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/criminal-law/`,      priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/foundations-of-canadian-law/`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/professional-responsibility/`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/contract-law/`,      priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/family-law/`,        priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/notes/evidence-law/`,      priority: '0.8', changefreq: 'monthly', lastmod: today },
    { loc: `${BASE_URL}/privacy.html`,             priority: '0.3', changefreq: 'yearly',  lastmod: today },
    { loc: `${BASE_URL}/terms.html`,               priority: '0.3', changefreq: 'yearly',  lastmod: today },
    { loc: `${BASE_URL}/refund.html`,              priority: '0.3', changefreq: 'yearly',  lastmod: today },
  ];

  let built = 0, skipped = 0;

  mdFiles.forEach(file => {
    const slug     = file.replace(/\.md$/, '');
    const mdPath   = path.join(MD_DIR, file);
    const raw      = fs.readFileSync(mdPath, 'utf8');
    const parsed   = parseFrontMatter(raw);
    const meta     = parsed.meta;

    const title       = (SEO_META[slug] && SEO_META[slug].title)       || meta.title            || meta.seo_title || slug;
    const description = (SEO_META[slug] && SEO_META[slug].description) || meta.meta_description || meta.description || meta.excerpt || '';
    const cluster     = (SEO_META[slug] && SEO_META[slug].cluster)     || meta.cluster          || meta.category   || 'strategy';
    const clusterLabel = clusterLabels[cluster] || cluster;
    const readTime    = (SEO_META[slug] && SEO_META[slug].readTime)    || meta.readTime         || meta.read_time  || '';
    const datePublished  = (SEO_META[slug] && SEO_META[slug].datePublished) || meta.date || meta.datePublished || new Date().toISOString().slice(0,10);
    const dateModified   = meta.lastModified || meta.dateModified || (SEO_META[slug] && SEO_META[slug].datePublished) || meta.date || new Date().toISOString().slice(0,10);

    // Extract FAQ schema from article markdown (if ## FAQ section exists)
    const faqSchema = extractFAQSchema(parsed.content);

    if (!title) {
      console.warn(`  ⚠️  Skipping ${file} — no title in frontmatter`);
      skipped++;
      return;
    }

    // Convert markdown body to HTML
    let bodyHTML;
    try {
      bodyHTML = marked(parsed.content);
    } catch (e) {
      console.warn(`  ⚠️  Markdown parse error in ${file}: ${e.message}`);
      bodyHTML = `<p>${escHtml(parsed.content.slice(0, 200))}…</p>`;
    }

    // Sanitize: remove stray </div> tags that would break out of .art-body container
    // Count <div> opens vs </div> closes; remove excess closes
    {
      const divOpens = (bodyHTML.match(/<div[\s>]/gi) || []).length;
      const divCloses = (bodyHTML.match(/<\/div>/gi) || []).length;
      if (divCloses > divOpens) {
        let excess = divCloses - divOpens;
        // Remove unmatched </div> by tracking depth
        let depth = 0;
        bodyHTML = bodyHTML.replace(/<div[\s>][^>]*>|<\/div>/gi, (tag) => {
          if (tag.toLowerCase().startsWith('<div')) {
            depth++;
            return tag;
          } else {
            if (depth > 0) { depth--; return tag; }
            else { excess--; return ''; } // Remove stray </div>
          }
        });
        if (excess !== 0) {
          console.warn(`  ⚠️  ${file}: removed stray </div> tags from bodyHTML`);
        }
      }
    }

    // Clean URL: /blog/[slug]/
    const canonicalURL = `${BASE_URL}/blog/${slug}/`;
    const outDir       = path.join(OUT_DIR, slug);
    const outFile      = path.join(outDir, 'index.html');

    // Create directory
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

   // Skip if HTML already exists — never overwrite manual edits
    if (fs.existsSync(outFile)) {
      skipped++;
      // Still add to sitemap even if skipped
      sitemapURLs.push({
        loc:        canonicalURL,
        priority:   '0.9',
        changefreq: 'monthly',
        lastmod:    new Date().toISOString().slice(0,10),
      });
      return;
    }
    const html = buildHTML({ slug, title, description, cluster, clusterLabel, readTime, bodyHTML, canonicalURL, datePublished, dateModified, faqSchema });
    fs.writeFileSync(outFile, html, 'utf8');

    built++;

    // Add to sitemap
    sitemapURLs.push({
      loc:        canonicalURL,
      priority:   '0.9',
      changefreq: 'monthly',
      lastmod:    new Date().toISOString().slice(0,10),
    });
  });

  // ── WRITE SITEMAP ────────────────────────────────────────
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapURLs.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || new Date().toISOString().slice(0,10)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_OUT, sitemapXML, 'utf8');


  // ── INDEXNOW BULK PING ───────────────────────────────────
  // Notifies Bing (+ Yandex, Seznam) of all URLs on every build.
  // Pages get crawled within hours instead of weeks.
  pingIndexNow(sitemapURLs.map(u => u.loc));
}

// ── INDEXNOW ───────────────────────────────────────────────
// Key moved to env var. Set INDEXNOW_KEY in your CI/CD environment.
// Fallback keeps existing key working if env var not yet set.
const INDEXNOW_KEY      = process.env.INDEXNOW_KEY || '679ea90259474fdb89ba975b64b7ec6a';
const INDEXNOW_KEY_FILE = `https://www.thencahub.com/${INDEXNOW_KEY}.txt`;

function pingIndexNow(urls) {
  const https = require('https');

  const payload = JSON.stringify({
    host:        'www.thencahub.com',
    key:         INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_FILE,
    urlList:     urls,
  });

  const options = {
    hostname: 'api.indexnow.org',
    path:     '/IndexNow',
    method:   'POST',
    headers:  {
      'Content-Type':   'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
    } else {
      console.warn(`⚠️   IndexNow: responded with HTTP ${res.statusCode}`);
    }
  });

  req.on('error', (e) => {
    // Non-fatal — build succeeded, ping just didn't fire
    console.warn(`⚠️   IndexNow ping failed (non-fatal): ${e.message}`);
  });

  req.write(payload);
  req.end();
}

build();
