/**
 * fix4.js — fixes truncated article files
 * Some files end abruptly mid-line with no </script></body></html>
 * Others have </script> after the truncation but are missing the completion
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const BLOG = path.join(__dirname, 'blog');

const BROKEN = `if(!isOpen){item.classList.add('`;

// Everything that should come after the broken point
const TAIL = `if(!isOpen){item.classList.add('open');q.setAttribute('aria-expanded','true');}
    }
    q.addEventListener('click',toggle);
    q.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
})();
</script>
</body>
</html>`;

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

  if (!html.includes(BROKEN)) {
    console.log(`  ⏭️   OK: ${rel}`);
    return;
  }

  const brokenIdx = html.indexOf(BROKEN);

  // Cut everything from the broken point onward, then append the correct tail
  html = html.substring(0, brokenIdx) + TAIL;

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✅  Fixed: ${rel}`);
  fixed++;
});

console.log(`\n✨ Done — ${fixed} articles fixed`);
console.log('Next: git add -A && git commit -m "fix: complete truncated faq in articles" && git push');
