/**
 * fix-all.js
 * Fixes three problems:
 * 1. FAQ accordion not working (truncated JS in all articles)
 * 2. Golden screen when pressing back button (blog/index.html)
 * 3. nca-exam-complete-guide missing from blog listing
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const BLOG = path.join(__dirname, 'blog');

// ── FIX 1 & 2: All article index.html files ──────────────
const COMPLETE_FAQ_JS = `  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    function toggle(){
      var item=q.closest('.faq-item');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isOpen){item.classList.add('open');q.setAttribute('aria-expanded','true');}
    }
    q.addEventListener('click',toggle);
    q.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });`;

// Back button fix — insert before </script> at end of each article
const BACK_BTN_FIX = `  // Fix golden screen on browser back button
  window.addEventListener('pageshow',function(e){
    var overlay=document.getElementById('transition-overlay');
    if(overlay){overlay.style.display='none';overlay.style.clipPath='circle(0% at 50% 50%)';}
  });`;

let fixed = 0, skipped = 0;

const dirs = fs.readdirSync(BLOG).filter(d => {
  const full = path.join(BLOG, d);
  return fs.statSync(full).isDirectory() && d.startsWith('article') || d === 'nca-exam-complete-guide';
});

dirs.forEach(dir => {
  const filePath = path.join(BLOG, dir, 'index.html');
  if (!fs.existsSync(filePath)) { skipped++; return; }

  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix 1: Replace truncated FAQ or broken FAQ with complete version
  // Pattern: anything from "// FAQ accordion" to end of its block
  if (html.includes('.faq-q')) {
    // Remove old broken FAQ JS entirely first
    html = html.replace(/\/\/ FAQ accordion[\s\S]*?(?=\}\)\(\);|\n<\/script>)/m, '');
    // Then inject complete version just before the closing IIFE
    if (!html.includes('faq-q').toString || !html.includes("addEventListener('click',toggle)")) {
      html = html.replace('})();', COMPLETE_FAQ_JS + '\n})();');
      changed = true;
    }
  }

  // Fix 2: Add back button fix if not already there
  if (!html.includes('pageshow') && html.includes('</script>')) {
    html = html.replace('})();', BACK_BTN_FIX + '\n})();');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅  Fixed: ${dir}/index.html`);
    fixed++;
  } else {
    console.log(`  ⏭️   Skipped (already OK): ${dir}/index.html`);
    skipped++;
  }
});

// ── FIX 3: Add nca-exam-complete-guide card to blog/index.html ──
const BLOG_INDEX = path.join(BLOG, 'index.html');
let blogHtml = fs.readFileSync(BLOG_INDEX, 'utf8');

const NEW_CARD = `
    <!-- NCA Complete Guide -->
    <article class="article-card featured tilt-card" data-cluster="strategy">
      <div class="card-highlight"></div>
      <div class="card-cluster">Exam Strategy</div>
      <h2 class="card-title split-heading">NCA Exams Canada: The Complete Guide for Internationally Trained Lawyers</h2>
      <p class="card-excerpt">Everything you need to know about NCA exams — who qualifies, required subjects, exam format, study strategy, timelines, and the full path to the Canadian Bar.</p>
      <div class="card-meta">
        <span class="card-read">20 min read</span>
        <a href="/blog/nca-exam-complete-guide/" class="card-link">Read</a>
      </div>
    </article>`;

// Fix 3: Add back button fix to blog/index.html too
if (!blogHtml.includes('pageshow')) {
  blogHtml = blogHtml.replace(
    '// Page Transition In (Gold Sweep Reveal)',
    `// Fix golden screen on browser back
window.addEventListener('pageshow',function(e){
  var overlay=document.getElementById('transition-overlay');
  if(overlay){overlay.style.display='none';overlay.style.clipPath='circle(0% at 50% 50%)';}
});

// Page Transition In (Gold Sweep Reveal)`
  );
  console.log('  ✅  Fixed back button in blog/index.html');
}

// Add the card if not already there
if (!blogHtml.includes('nca-exam-complete-guide')) {
  // Insert as first card in the grid (after the grid opening div)
  blogHtml = blogHtml.replace(
    '<!-- 1. FEATURED: 90 Days (Working Correctly) -->',
    NEW_CARD + '\n\n    <!-- 1. FEATURED: 90 Days (Working Correctly) -->'
  );
  console.log('  ✅  Added nca-exam-complete-guide card to blog/index.html');
}

fs.writeFileSync(BLOG_INDEX, blogHtml, 'utf8');

console.log(`\n✨  Done — ${fixed} articles fixed, ${skipped} skipped`);
console.log('\nNext: git add -A && git commit -m "fix: faq accordion, back button, add complete guide card" && git push');
