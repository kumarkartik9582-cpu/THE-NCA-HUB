/**
 * fix2.js
 * 1. Removes the golden page transition animation from ALL pages
 * 2. Properly fixes FAQ accordion in all articles
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const BLOG = path.join(ROOT, 'blog');

// ── Collect ALL html files to process ──────────────────────────────
function collectHTML(dir, results = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) collectHTML(full, results);
    else if (f.endsWith('.html')) results.push(full);
  });
  return results;
}

const allHTML = collectHTML(ROOT).filter(f =>
  !f.includes('node_modules') && !f.includes('.git')
);

let transitionFixed = 0;
let faqFixed = 0;

// ── FAQ JS to inject ────────────────────────────────────────────────
const FAQ_JS = `
<script>
(function(){
  var items = document.querySelectorAll('.faq-item');
  if(!items.length) return;
  items.forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      // close all
      items.forEach(function(i){
        i.classList.remove('open');
        var b = i.querySelector('.faq-q');
        if(b) b.setAttribute('aria-expanded','false');
      });
      // open clicked one if it was closed
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();
</script>`;

allHTML.forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const rel = path.relative(ROOT, filePath);

  // ── REMOVE GOLDEN TRANSITION ──────────────────────────────────────
  // 1. Remove the overlay div
  html = html.replace(/<div[^>]*id=["']transition-overlay["'][^>]*>[\s\S]*?<\/div>/g, '');
  html = html.replace(/<div[^>]*id=["']transition-overlay["'][^>]*\/?>/g, '');

  // 2. Remove CSS block for #transition-overlay (inside <style> tags)
  // This removes the rule and any animation keyframes associated
  html = html.replace(/#transition-overlay\s*\{[^}]*\}/g, '');
  html = html.replace(/@keyframes\s+\w*[Gg]old\w*\s*\{[^}]*\}/g, '');
  html = html.replace(/@keyframes\s+\w*[Ss]weep\w*\s*\{[\s\S]*?\}\s*\}/g, '');
  html = html.replace(/@keyframes\s+\w*[Tt]ransition\w*\s*\{[\s\S]*?\}\s*\}/g, '');

  // 3. Remove ALL JS blocks that reference transition-overlay
  // Strategy: remove entire <script> blocks that contain transition-overlay
  // But only if they're the dedicated transition script (not inline in a bigger script)
  html = html.replace(/<script[^>]*>[\s\S]*?transition-overlay[\s\S]*?<\/script>/g, function(match) {
    // If the script block ONLY does transition stuff, remove entirely
    // If it does other things too, just blank the transition-overlay references
    const withoutTransition = match
      .replace(/\/\/[^\n]*transition[^\n]*/gi, '')
      .replace(/\/\/[^\n]*overlay[^\n]*/gi, '')
      .replace(/document\.getElementById\(['"]transition-overlay['"]\)[^;]*;/g, '')
      .replace(/var\s+overlay\s*=[^;]*;/g, '')
      .replace(/overlay\.[^;]*;/g, '')
      .replace(/window\.addEventListener\(['"]pageshow['"][^)]*\)[^;]*;/g, '')
      .replace(/\boverlay\b[^;]*;/g, '');
    
    // Check if anything meaningful is left (besides whitespace and empty function shells)
    const stripped = withoutTransition
      .replace(/<script[^>]*>/g,'')
      .replace(/<\/script>/g,'')
      .replace(/\(function\(\)\{[\s\n]*\}\)\(\);?/g,'')
      .replace(/\s+/g,' ')
      .trim();
    
    if(stripped.length < 20) return ''; // effectively empty, remove it
    return withoutTransition;
  });

  // 4. Remove transition-triggering link click handlers (data-href patterns)
  // Replace <a data-href="..."> with normal <a href="...">
  html = html.replace(/<a([^>]*)\bdata-href=["']([^"']+)["']([^>]*)>/g, function(m, before, href, after) {
    // Remove the data-href, add href if not already there
    const combined = (before + after).replace(/\bhref=["'][^"']*["']/g, '').trim();
    return `<a href="${href}"${combined ? ' '+combined : ''}>`;
  });

  // 5. Remove any remaining pageshow overlay hacks we added earlier
  html = html.replace(/\/\/ Fix golden screen on browser back button[\s\S]*?}\);/g, '');

  if(html !== fs.readFileSync(filePath, 'utf8')) changed = true;

  // ── FIX FAQ (only article pages that have .faq-item) ─────────────
  if(html.includes('faq-item') && html.includes('faq-q')) {
    // Remove ALL existing FAQ JS — any script block mentioning faq-q
    html = html.replace(/<script[^>]*>[\s\S]*?faq-q[\s\S]*?<\/script>/g, '');
    
    // Also remove partial/truncated faq references left in existing scripts
    html = html.replace(/\/\/\s*FAQ accordion[\s\S]*?(?=<\/script>|\}\)\(\))/g, '');

    // Inject fresh FAQ script just before </body>
    if(!html.includes("querySelector('.faq-q')") && !html.includes('querySelector(".faq-q")')) {
      html = html.replace('</body>', FAQ_JS + '\n</body>');
      faqFixed++;
    }
  }

  if(html !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅  ${rel}`);
    transitionFixed++;
  } else {
    console.log(`  ⏭️   No change: ${rel}`);
  }
});

console.log(`\n✨ Done — ${transitionFixed} files updated, FAQ fixed in ${faqFixed} articles`);
console.log('Next: git add -A && git commit -m "fix: remove golden transition, fix faq accordion" && git push');
