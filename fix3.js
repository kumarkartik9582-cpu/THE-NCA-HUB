/**
 * fix3.js — surgical fixes only
 * 1. Completes the truncated FAQ JS in all articles
 * 2. Removes golden transition from blog/index.html and index.html only
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const BLOG = path.join(ROOT, 'blog');

// ── FIX 1: FAQ truncation ─────────────────────────────────────────
// The truncation always looks like:
//   if(!isOpen){item.classList.add('      <-- cuts off here (inside the script block)
// We just need to complete that broken line and close everything properly

const BROKEN = `if(!isOpen){item.classList.add('`;
const COMPLETE = `if(!isOpen){item.classList.add('open');q.setAttribute('aria-expanded','true');}
    }
    q.addEventListener('click',toggle);
    q.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });`;

let faqFixed = 0;

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

const articles = collectArticleHTML(BLOG);

articles.forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(ROOT, filePath);

  if (!html.includes(BROKEN)) {
    console.log(`  ⏭️   FAQ ok: ${rel}`);
    return;
  }

  // Find the broken point — everything after BROKEN on the same "line" is garbage
  // We need to remove from BROKEN to the next </script> close of that block, then inject complete code

  // The broken section looks like:
  //   if(!isOpen){item.classList.add('<GARBAGE>\n</script>
  // Replace it with the complete code + close the IIFE + close script

  // Find index of BROKEN
  const brokenIdx = html.indexOf(BROKEN);
  
  // Find the </script> that closes this block (after the broken point)
  const scriptCloseIdx = html.indexOf('</script>', brokenIdx);
  
  if (scriptCloseIdx === -1) {
    console.log(`  ⚠️   Couldn't find </script> after truncation: ${rel}`);
    return;
  }

  // Replace from BROKEN to </script> with the complete code + close IIFE + </script>
  const before = html.substring(0, brokenIdx);
  const after = html.substring(scriptCloseIdx + '</script>'.length);

  html = before + COMPLETE + '\n})();\n</script>' + after;

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✅  FAQ fixed: ${rel}`);
  faqFixed++;
});

console.log(`\n  FAQ: ${faqFixed} articles fixed\n`);

// ── FIX 2: Remove golden transition from blog/index.html & index.html ─
// We do NOT touch article files — the transition is triggered from these two files

const TRANSITION_FILES = [
  path.join(BLOG, 'index.html'),
  path.join(ROOT, 'index.html'),
];

let transFixed = 0;

TRANSITION_FILES.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(ROOT, filePath);
  const original = html;

  // 1. Remove the overlay div (self-closing or with content)
  html = html.replace(/<div[^>]*id=["']transition-overlay["'][^>]*>[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div[^>]*id=["']transition-overlay["'][^>]*\/?>/g, '');

  // 2. Remove CSS for #transition-overlay
  html = html.replace(/#transition-overlay\s*\{[^}]*\}\s*/g, '');

  // 3. Remove @keyframes for the gold sweep animation
  // These keyframes have names like goldSweep, sweepOut, transitionIn etc.
  html = html.replace(/@keyframes\s+\w+\s*\{(?:[^{}]*|\{[^{}]*\})*\}\s*/g, function(match) {
    // Only remove keyframes that are transition/gold related
    if (/gold|sweep|reveal|wipe|overlay/i.test(match)) return '';
    return match;
  });

  // 4. Remove link-click JS that triggers the overlay animation
  // Pattern: document.querySelectorAll('a[href]').forEach or similar that sets overlay style
  // We surgically remove just the transition-overlay references from JS
  html = html.replace(/\/\/[^\n]*(transition|overlay|gold|sweep)[^\n]*/gi, '');
  html = html.replace(/[^\n]*transition-overlay[^\n]*/g, '');
  html = html.replace(/[^\n]*transitionOverlay[^\n]*/g, '');

  // 5. Remove pageshow handler we added in fix-all.js
  html = html.replace(/\/\/ Fix golden screen on browser back button[\s\S]*?}\);/g, '');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅  Transition removed: ${rel}`);
    transFixed++;
  } else {
    console.log(`  ⏭️   No transition found: ${rel}`);
  }
});

console.log(`\n✨ Done — ${faqFixed} FAQs fixed, ${transFixed} transition files cleaned`);
console.log('Next: git add -A && git commit -m "fix: faq accordion + remove golden transition" && git push');
