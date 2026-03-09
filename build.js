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
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(title)} — The NCA Hub</title>
<meta name="description" content="${escHtml(description)}">
<link rel="canonical" href="${canonicalURL}">

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
        "description": "Indian-qualified lawyer who built his career at UK law firms DWF, Eversheds Sutherland, and Keoghs. Passed all 5 NCA subjects and completed CPLED LRW — 4 subjects cleared in under 3 months, with one week to prepare for the first. Certificate of Qualification requested."
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
      "image": "https://www.thencahub.com/og-image.svg",
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
<meta property="og:image" content="https://www.thencahub.com/og-image.svg">
<meta property="twitter:image" content="https://www.thencahub.com/og-image.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700&display=swap" rel="stylesheet">
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
nav{position:fixed;top:0;inset-x:0;z-index:800;padding:22px 72px;display:flex;align-items:center;justify-content:space-between;background:rgba(2,2,4,.94);backdrop-filter:blur(40px) saturate(180%);border-bottom:1px solid rgba(201,168,76,.1);}
.nl{font-family:var(--fd);font-size:1.1rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;color:var(--g1);line-height:1;margin-right:48px}
.nl .hub{color:var(--g1)}
.nav-links{display:flex;gap:44px}
.nav-links a{font-size:var(--nano);letter-spacing:.28em;text-transform:uppercase;color:var(--fog);font-weight:500;transition:color .3s;}
.nav-links a:hover,.nav-links a.active{color:var(--cream)}
.nc{font-size:var(--nano);letter-spacing:.24em;text-transform:uppercase;font-weight:600;color:var(--void);background:var(--g1);padding:11px 26px;display:inline-block;transition:transform .3s var(--expo),background .3s;margin-left:20px}
.nc:hover{transform:translateY(-2px);background:var(--g0)}
.nh{display:none;flex-direction:column;gap:5px;width:26px;background:none;border:none;padding:0;cursor:pointer}
.nh span{display:block;height:1px;background:var(--cream);transition:transform .4s var(--expo),opacity .3s}
@media(max-width:960px){.nav-links,.nc{display:none}.nh{display:flex}nav{padding:18px 24px}}
.mob{position:fixed;inset:0;background:var(--void);z-index:870;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;clip-path:inset(0 0 100% 0);transition:clip-path .7s var(--expo)}
.mob.op{clip-path:inset(0 0 0% 0)}
.mob-link{font-family:var(--fd);font-size:clamp(1.6rem,5vw,2.4rem);font-weight:300;color:var(--fog);letter-spacing:.04em;transition:color .3s}
.mob-link:hover{color:var(--g1)}
.mob-x{position:absolute;top:22px;right:24px;font-size:1.1rem;color:var(--fog);background:none;border:none;padding:8px;cursor:pointer}
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
</style>
</head>
<body>
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

<div class="mob" id="mob">
  <button class="mob-x" id="mobx" aria-label="Close menu">✕</button>
  <a href="/#method"   class="mob-link">Method</a>
  <a href="/#subjects" class="mob-link">Subjects</a>
  <a href="/#pricing"  class="mob-link">Pricing</a>
  <a href="/blog/"     class="mob-link">Articles</a>
  <a href="/#sample"   class="mob-link">Free Chapter</a>
  <a href="/#readiness" class="mob-link" style="color:var(--g1)">Get My Score →</a>
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
    </header>

    <div class="art-body" id="art-body">
      ${bodyHTML}
    </div>
  </article>

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
        <li><a href="mailto:hello@thencahub.com">hello@thencahub.com</a></li>
        <li><a href="https://payhip.com/THENCAHUB" target="_blank" rel="noopener">Shop Now</a></li>
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
  // Mobile nav
  var nh=document.getElementById('nh'),mob=document.getElementById('mob'),mobx=document.getElementById('mobx');
  if(nh)nh.addEventListener('click',function(){mob.classList.add('op');nh.setAttribute('aria-expanded','true')});
  if(mobx)mobx.addEventListener('click',function(){mob.classList.remove('op');nh.setAttribute('aria-expanded','false')});
  if(mob)mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mob.classList.remove('op')})});
  // Scroll reveal for article body
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

  console.log(`\n🔨  Building ${mdFiles.length} articles...\n`);

  const sitemapURLs = [
    { loc: `${BASE_URL}/`,       priority: '1.0', changefreq: 'weekly',  lastmod: new Date().toISOString().slice(0,10) },
    { loc: `${BASE_URL}/blog/`,  priority: '0.8', changefreq: 'weekly',  lastmod: new Date().toISOString().slice(0,10) },
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

    // Clean URL: /blog/[slug]/
    const canonicalURL = `${BASE_URL}/blog/${slug}/`;
    const outDir       = path.join(OUT_DIR, slug);
    const outFile      = path.join(outDir, 'index.html');

    // Create directory
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Write HTML
    const html = buildHTML({ slug, title, description, cluster, clusterLabel, readTime, bodyHTML, canonicalURL, datePublished, dateModified, faqSchema });
    fs.writeFileSync(outFile, html, 'utf8');

    console.log(`  ✅  ${slug}/index.html`);
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

  console.log(`\n📄  sitemap.xml updated (${sitemapURLs.length} URLs)`);
  console.log(`\n✨  Done — ${built} pages built${skipped ? `, ${skipped} skipped` : ''}`);
  console.log(`    Static pages are at:  blog/[slug]/index.html`);
  console.log(`    Clean URLs will be:   ${BASE_URL}/blog/[slug]/\n`);
}

build();
