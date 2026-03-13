/**
 * fix5.js — fixes ALL truncation variants in article FAQ JS
 * Strategy: find where the FAQ JS starts, cut everything from there,
 * inject the complete FAQ JS + closing tags
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const BLOG = path.join(__dirname, 'blog');

// The FAQ JS always starts with this exact comment
const FAQ_START = `  // FAQ accordion\n  document.querySelectorAll('.faq-q').forEach(function(q){`;

// Complete replacement from that point onward
const FAQ_COMPLETE = `  // FAQ accordion
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
  });
})();
</script>
</body>
</html>`;

// Also handle the older truncation pattern (starts further in)
const BROKEN_PATTERNS = [
  `  // FAQ accordion\n  document.querySelectorAll('.faq-q').forEach(fun`,
  `if(!isOpen){item.classList.add('`,
];

let fixed = 0;

function collectArticleHTML(dir) {
  const results = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && (f.startsWith('article') || f === 'nca-exam-complete-guide')) {
      const idx = path.join(full, 'index.html');
      if (fs.existsSync(idx)) results.push(idx);
    }
  });
  return results;
}

collectArticleHTML(BLOG).forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(__dirname, filePath);

  // Check if FAQ JS is complete (has the closing addEventListener for keydown)
  if (html.includes("addEventListener('keydown',function(e)")) {
    console.log(`  ⏭️   OK: ${rel}`);
    return;
  }

  // Find the earliest truncation point
  let cutIdx = -1;

  // Try to find the FAQ start comment first (broadest cut)
  const faqStartIdx = html.indexOf(`  // FAQ accordion`);
  if (faqStartIdx !== -1) {
    cutIdx = faqStartIdx;
  } else {
    // Fall back to other broken patterns
    for (const pat of BROKEN_PATTERNS) {
      const idx = html.indexOf(pat);
      if (idx !== -1) {
        cutIdx = idx;
        break;
      }
    }
  }

  if (cutIdx === -1) {
    console.log(`  ⚠️   No truncation found but FAQ incomplete: ${rel}`);
    return;
  }

  html = html.substring(0, cutIdx) + FAQ_COMPLETE;
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✅  Fixed: ${rel}`);
  fixed++;
});

console.log(`\n✨ Done — ${fixed} articles fixed`);
console.log('Next: git add -A && git commit -m "fix: faq accordion all articles" && git push');
