/**
 * fix6.js — injects FAQ JS into articles that are missing it entirely
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const BLOG = path.join(__dirname, 'blog');

const FAQ_JS = `  // FAQ accordion
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

  // Already has complete FAQ JS
  if (html.includes("addEventListener('keydown',function(e)")) {
    console.log(`  ⏭️   OK: ${rel}`);
    return;
  }

  // Has faq-item elements but no FAQ JS — inject before })();
  if (html.includes('faq-item') && html.includes('})();')) {
    html = html.replace('})();', FAQ_JS + '\n})();');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅  Injected FAQ: ${rel}`);
    fixed++;
    return;
  }

  console.log(`  ⚠️   Skipped (no faq-item or no IIFE): ${rel}`);
});

console.log(`\n✨ Done — ${fixed} articles fixed`);
console.log('Next: git add -A && git commit -m "fix: faq accordion all articles" && git push');
