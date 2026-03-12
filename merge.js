/**
 * merge.js — Intelligent NCA Hub Article Merger
 *
 * HOW TO USE:
 *   1. Put this file in the ROOT of your THE-NCA-HUB repo
 *   2. Run:  ANTHROPIC_API_KEY=your_key_here node merge.js
 *   3. Merged articles are written directly to blog/article-*/index.html
 *   4. Review the changes, then git add . && git commit && git push
 *
 * WHAT IT DOES:
 *   - Reads every .html file in new-articles/
 *   - Finds the matching old article in blog/article-*/index.html
 *   - Sends BOTH to Claude API for intelligent merging
 *   - Claude extracts: new content sections, updated FAQs, better SEO
 *     meta/schema, updated dates & stats — and integrates them into the
 *     old article's structure
 *   - Writes the final merged HTML back to blog/article-*/index.html
 */

const fs   = require('fs');
const path = require('path');

const API_KEY   = process.env.ANTHROPIC_API_KEY;
const API_URL   = 'https://api.anthropic.com/v1/messages';
const MODEL     = 'claude-opus-4-5';
const NEW_DIR   = path.join(__dirname, 'new-articles');
const BLOG_DIR  = path.join(__dirname, 'blog');
const LOG_FILE  = path.join(__dirname, 'merge-log.txt');

// --- Safety check ---
if (!API_KEY) {
  console.error('\n❌  Missing ANTHROPIC_API_KEY environment variable.');
  console.error('    Run:  ANTHROPIC_API_KEY=sk-ant-... node merge.js\n');
  process.exit(1);
}

// --- Collect new article files ---
const newFiles = fs.readdirSync(NEW_DIR).filter(f => f.endsWith('.html'));
if (newFiles.length === 0) {
  console.error('❌  No .html files found in new-articles/');
  process.exit(1);
}

console.log(`\n🔍  Found ${newFiles.length} new article(s) to process.\n`);

// --- Merge prompt ---
function buildPrompt(slug, oldHTML, newHTML) {
  return `You are an expert web developer and SEO specialist. Your task is to produce a single, final, production-ready HTML file by intelligently merging an OLD article and a NEW article for the same URL slug: "${slug}".

## YOUR RULES

1. **BASE STRUCTURE**: Keep the OLD article's HTML as the foundation — preserve its <head>, CSS, nav, footer, sidebar, and any structural HTML that is NOT article content.

2. **CONTENT MERGING — take from NEW where it is better**:
   - Replace the <title>, meta description, og:title, og:description, twitter:title, twitter:description with the NEW article's versions (they are more accurate and SEO-optimised).
   - Update the Schema.org JSON-LD block (dateModified, keywords, description, FAQPage entries) with the NEW article's version.
   - For each content section in the article body: if the NEW article has a section that is ABSENT from the OLD article, INSERT it in a logical position.
   - If a section EXISTS in both, keep the OLD version BUT add any new paragraphs, bullet points, tips, warnings, or data points from the NEW version that are missing from the OLD.
   - Replace any outdated statistics, dates, or figures in the OLD with the updated ones from the NEW.
   - Add ALL FAQ questions from the NEW article that are not already in the OLD article's FAQ section.
   - If the NEW article has a completely new section (e.g. a new H2 heading block), add it to the OLD article in the most logical position.

3. **PRESERVE FROM OLD**:
   - All internal links pointing to other articles on thencahub.com.
   - The CTA / product promotion blocks.
   - The author bio box.
   - Any affiliate or purchase links.
   - The overall CSS class structure and styling.

4. **OUTPUT**: Return ONLY the complete, merged HTML document. No explanation, no markdown fences, no commentary — just the raw HTML starting with <!DOCTYPE html>.

---

## OLD ARTICLE (base structure to keep)

${oldHTML}

---

## NEW ARTICLE (source of improvements to extract)

${newHTML}`;
}

// --- Call Claude API ---
async function mergeWithClaude(slug, oldHTML, newHTML) {
  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 8192,
    messages: [
      { role: 'user', content: buildPrompt(slug, oldHTML, newHTML) }
    ]
  });

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content.map(b => b.text || '').join('');

  // Strip any accidental markdown fences just in case
  return text.replace(/^```html\s*/i, '').replace(/\s*```$/i, '').trim();
}

// --- Main loop ---
async function main() {
  const log = [];
  let success = 0, skipped = 0, failed = 0;

  for (const file of newFiles) {
    const slug       = path.basename(file, '.html');
    const newPath    = path.join(NEW_DIR, file);
    const blogFolder = path.join(BLOG_DIR, slug);
    const oldPath    = path.join(blogFolder, 'index.html');

    process.stdout.write(`📄  ${slug} ... `);

    // Check old article exists
    if (!fs.existsSync(oldPath)) {
      console.log('⚠️  SKIPPED (no matching blog folder)');
      log.push(`SKIPPED: ${slug} — no blog/${slug}/index.html found`);
      skipped++;
      continue;
    }

    try {
      const oldHTML    = fs.readFileSync(oldPath,  'utf8');
      const newHTML    = fs.readFileSync(newPath,  'utf8');

      // Back up the old article first
      const backupPath = path.join(blogFolder, 'index.html.bak');
      fs.writeFileSync(backupPath, oldHTML, 'utf8');

      // Call Claude to merge
      const merged = await mergeWithClaude(slug, oldHTML, newHTML);

      // Sanity check — must look like HTML
      if (!merged.includes('<!DOCTYPE') && !merged.includes('<html')) {
        throw new Error('Response does not appear to be valid HTML');
      }

      // Write merged result
      fs.writeFileSync(oldPath, merged, 'utf8');
      console.log('✅  MERGED');
      log.push(`OK: ${slug}`);
      success++;

    } catch (err) {
      console.log(`❌  FAILED — ${err.message}`);
      log.push(`FAILED: ${slug} — ${err.message}`);
      failed++;
    }

    // Polite delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }

  // Write log
  const summary = [
    `Merge run: ${new Date().toISOString()}`,
    `Total: ${newFiles.length} | Success: ${success} | Skipped: ${skipped} | Failed: ${failed}`,
    '',
    ...log
  ].join('\n');

  fs.writeFileSync(LOG_FILE, summary, 'utf8');

  console.log('\n' + '─'.repeat(50));
  console.log(`✅  Done! ${success} merged, ${skipped} skipped, ${failed} failed`);
  console.log(`📋  Full log saved to: merge-log.txt`);
  console.log('\nNext steps:');
  console.log('  git add blog/*/index.html');
  console.log('  git commit -m "merge: apply new article improvements"');
  console.log('  git push\n');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
