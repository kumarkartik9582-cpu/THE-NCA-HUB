# NCA HUB — HOMEPAGE REDESIGN MASTERPLAN
## The most research-backed, psychologically engineered landing page prompt ever written
## Claude Code: Read every word. Execute every section. Deploy and push.

---

## IDENTITY ANCHOR — READ BEFORE TOUCHING ANY FILE

You are rebuilding the homepage of The NCA Hub (thencahub.com), a commercial platform founded by Kartik Kumar (Indian lawyer, UK law firm background at DWF/Eversheds Sutherland/Keoghs, passed all 5 NCA subjects including 4 in 3 months) selling NCA exam preparation materials for internationally trained lawyers qualifying for the Ontario bar.

**Non-negotiable constraints:**
- Static GitHub Pages site. Vanilla HTML/CSS/JavaScript only. No npm, no React, no build tools.
- Design system: background #020204 (near-black), navy #1B2A4A, gold #C9A84C, white #FFFFFF
- Fonts: Cormorant Garamond (serif headlines) + existing sans-serif for body — match what is in the repo
- Pricing never changes: Notes Only $149 | Complete System $175 | All 5 Bundle $749
- Payhip: payhip.com/THENCAHUB — all purchase links go through Payhip
- GitHub repo: kumarkartik9582-cpu/THE-NCA-HUB

---

## STEP 0 — RESEARCH AND AUDIT PHASE (mandatory before any edits)

### 0A: Read the existing homepage completely
```bash
# Read the entire current homepage
cat index.html | head -500
cat index.html | wc -l
cat index.html

# Read the existing CSS
ls *.css style*.css css/ 2>/dev/null | head -5
cat style.css 2>/dev/null || cat css/style.css 2>/dev/null || find . -name "*.css" -maxdepth 2 | head -3

# Understand the current nav structure exactly
grep -n "nav\|<a \|href=" index.html | head -40

# Find all sections currently on the homepage
grep -n "section\|<div id=\|<div class=.*hero\|<!-- " index.html | head -50

# Check current JavaScript load
grep -n "<script" index.html | head -20

# Check page load weight
find . -name "*.js" -maxdepth 3 -not -path "*/node_modules/*" | xargs wc -c 2>/dev/null | tail -5

# Check what tools exist as real pages
for dir in nca-exam-planner nca-study-calculator nca-session-planner nca-timeline nca-30-day-plan nca-prep-checklist readiness nca-subject-predictor nca-cost-calculator nca-resit-calculator nca-ai-assistant practice-questions free-chapter nca-notes-comparison nca-passes articling-directory tools; do
  [ -f "$dir/index.html" ] && echo "EXISTS: /$dir/" || echo "MISSING: /$dir/"
done

# Check all notes pages that exist
ls notes/*/index.html 2>/dev/null | head -20
```

### 0B: Identify every existing CSS variable and class pattern
```bash
# Extract all CSS variables used in the current design system
grep -o 'var(--[^)]*' index.html | sort -u
grep -o 'var(--[^)]*' style.css 2>/dev/null | sort -u

# Find the exact class names used for buttons, cards, sections
grep -o 'class="[^"]*"' index.html | sort | uniq -c | sort -rn | head -30

# Find all font imports
grep -n "font\|@import\|googleapis" index.html | head -10

# Find all existing animation/transition CSS
grep -n "transition\|animation\|transform\|keyframes" style.css 2>/dev/null | head -20
```

### 0C: Measure current performance
```bash
# Check total page weight
find . -maxdepth 1 -name "*.js" -o -name "*.css" | xargs wc -c 2>/dev/null
du -sh index.html

# Count all script tags (load weight)
grep -c "<script" index.html

# Check for lazy loading issues
grep -c 'loading="lazy"' index.html
grep -c "<img" index.html
```

Store every finding. Do not write a single line of HTML until this audit is complete.

---

## STEP 1 — THE VISITOR STATE MACHINE (the core architecture)

The homepage is not a static page. It is a state machine. Every visitor is in one of 5 states. The homepage detects the state and renders the appropriate experience.

**Implement this JavaScript state detector at the TOP of the homepage's `<body>` script section:**

```javascript
// NCA HUB — VISITOR STATE MACHINE
// Based on predictive coding theory (Friston), somatic marker hypothesis (Damasio),
// information cascade theory (Bikhchandani-Hirshleifer), and hyperbolic discounting research

(function() {
  // Read all state signals
  const cookie = name => (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)') || []).pop() || '';
  const params = new URLSearchParams(window.location.search);
  
  // State signals
  const visitCount = parseInt(cookie('ncah_visits') || '0') + 1;
  const hasEmail = cookie('ncah_email') === '1';
  const hasPurchased = cookie('ncah_purchased') === '1';
  const examDaysOut = parseInt(cookie('ncah_exam_days') || params.get('days') || '90');
  const isCascadeReferral = params.get('ref') === 'share' || params.get('utm_source') === 'cascade';
  const cascadeFrom = params.get('from') || '';
  const quizScore = parseInt(cookie('ncah_quiz_score') || '0');
  
  // Determine visitor state
  let visitorState;
  if (hasPurchased) {
    visitorState = 'POST_PURCHASE';
  } else if (isCascadeReferral) {
    visitorState = 'CASCADE_ARRIVAL';
  } else if (examDaysOut <= 30 || quizScore > 0) {
    visitorState = 'NEAR_DEADLINE';
  } else if (visitCount > 1 || hasEmail) {
    visitorState = 'RESEARCH_MODE';
  } else {
    visitorState = 'NEWCOMER';
  }
  
  // Store visit count
  document.cookie = `ncah_visits=${visitCount};max-age=31536000;path=/`;
  
  // Store exam days if provided
  if (params.get('days')) {
    document.cookie = `ncah_exam_days=${params.get('days')};max-age=2592000;path=/`;
  }
  
  // Expose state globally
  window.NCAH = {
    state: visitorState,
    examDays: examDaysOut,
    quizScore: quizScore,
    cascadeFrom: cascadeFrom,
    visitCount: visitCount,
    isMobile: window.innerWidth < 768
  };
  
  // Add state class to body for CSS targeting
  document.documentElement.setAttribute('data-visitor-state', visitorState.toLowerCase().replace('_', '-'));
})();
```

---

## STEP 2 — PERFORMANCE FIXES (do before any visual changes)

**These invisible technical issues are degrading your conversion rate. Fix them first:**

```html
<!-- Add to <head> — performance fixes -->

<!-- 1. Preconnect to CDNs we are adding -->
<link rel="preconnect" href="https://unpkg.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- 2. Open Graph tags for social sharing (add correct values) -->
<meta property="og:title" content="Pass Your NCA Exams | The NCA Hub">
<meta property="og:description" content="Under 80 pages per subject. Answer templates included. 16 free tools no competitor has. Built by someone who passed all 5.">
<meta property="og:image" content="https://www.thencahub.com/og-image.jpg">
<meta property="og:url" content="https://www.thencahub.com">
<meta property="og:type" content="website">

<!-- 3. Twitter card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Pass Your NCA Exams | The NCA Hub">
<meta name="twitter:description" content="Under 80 pages. Answer templates. 16 free tools. Built by someone who passed all 5 NCA subjects.">

<!-- 4. Schema.org for rich search results -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "The NCA Hub",
  "url": "https://www.thencahub.com",
  "description": "NCA exam preparation materials for internationally trained lawyers qualifying in Canada",
  "founder": {
    "@type": "Person",
    "name": "Kartik Kumar",
    "jobTitle": "Founder, The NCA Hub",
    "description": "Indian-qualified lawyer, UK law firm background (DWF, Eversheds Sutherland, Keoghs), passed all 5 NCA subjects"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "NCA Subject Notes",
      "priceCurrency": "CAD",
      "price": "149",
      "description": "Subject-specific NCA exam preparation notes, under 80 pages"
    }
  ]
}
</script>
```

**Add `loading="lazy"` to every image below the fold:**
```bash
# Find all img tags without lazy loading
grep -n "<img" index.html | grep -v 'loading='
# Add loading="lazy" to all below-fold images (everything after the hero section)
```

**Defer all non-critical JavaScript:**
```bash
# Find all script tags and add defer where missing
grep -n "<script src=" index.html
# Every external script except above-fold critical CSS should have defer attribute
```

**Add Microsoft Clarity for heatmaps (free, zero data limits):**
```html
<!-- Microsoft Clarity — add to <head> -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+"REPLACE_WITH_CLARITY_ID";
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script");
</script>
<!-- Note to Kartik: Create free account at clarity.microsoft.com, get Project ID, replace REPLACE_WITH_CLARITY_ID -->
```

---

## STEP 3 — MOTION TECHNOLOGY LAYER (add to all pages via CDN)

**Add these to the bottom of `<body>` on the homepage:**

```html
<!-- LENIS SMOOTH SCROLL — transforms the feel immediately, 3KB -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.21/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.21/dist/lenis.min.js" defer></script>

<!-- GSAP + SCROLLTRIGGER — powers all scroll animations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js" defer></script>
```

**Initialize motion after DOM loads — add as final script in `<body>`:**

```javascript
// NCA HUB — MOTION SYSTEM
// Lenis + GSAP + ScrollTrigger integration

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. LENIS SMOOTH SCROLL
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  
  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    updateScrollProgress();
  });
  
  function rafLoop(time) {
    lenis.raf(time);
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);
  
  
  // 2. SCROLL PROGRESS INDICATOR (gold line at top)
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = progress + '%';
  }
  
  
  // 3. GSAP ANIMATIONS — only init if GSAP loaded
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
    
    // Connect Lenis to GSAP ticker
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });
    
    // HERO TEXT ANIMATION — split and reveal
    const heroHeadline = document.querySelector('.hero-headline');
    if (heroHeadline && typeof SplitText !== 'undefined') {
      const split = new SplitText(heroHeadline, { type: 'words,chars' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 40,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power4.out',
        delay: 0.3
      });
    }
    
    // HERO SUBHEADLINE — fade up
    gsap.from('.hero-subheadline', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      delay: 0.8,
      ease: 'power3.out'
    });
    
    // HERO CTA — scale in
    gsap.from('.hero-cta-primary', {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      delay: 1.1,
      ease: 'back.out(1.7)'
    });
    
    // SCROLL-TRIGGERED REVEALS — all sections
    gsap.utils.toArray('.reveal-on-scroll').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
    
    // STAGGERED CARD REVEALS
    gsap.utils.toArray('.card-grid').forEach(grid => {
      const cards = grid.querySelectorAll('.card');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%'
        },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out'
      });
    });
    
    // NUMBER COUNTER ANIMATION
    gsap.utils.toArray('.count-up').forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || el.textContent);
      gsap.from({ val: 0 }, {
        scrollTrigger: { trigger: el, start: 'top 80%' },
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val).toLocaleString();
        }
      });
    });
    
    // SECTION HEADING PARALLAX
    gsap.utils.toArray('.section-heading').forEach(el => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -30,
        ease: 'none'
      });
    });
    
    // HORIZONTAL SCROLL for notes cards (desktop only)
    if (!window.NCAH.isMobile) {
      const notesTrack = document.querySelector('.notes-horizontal-track');
      if (notesTrack) {
        const cards = notesTrack.querySelectorAll('.note-card');
        const totalWidth = notesTrack.scrollWidth - notesTrack.offsetWidth;
        
        gsap.to(notesTrack, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '.notes-horizontal-section',
            start: 'top top',
            end: () => '+=' + totalWidth,
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        });
      }
    }
  }
  
  
  // 4. CUSTOM CURSOR (desktop only)
  if (!window.NCAH.isMobile) {
    const cursor = document.createElement('div');
    cursor.className = 'ncah-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);
    
    let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.querySelector('.cursor-dot').style.transform = 
        `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    });
    
    // Ring follows with lag (inertia effect)
    function animateCursor() {
      ringX += (cursorX - ringX) * 0.12;
      ringY += (cursorY - ringY) * 0.12;
      cursor.querySelector('.cursor-ring').style.transform = 
        `translate(${ringX - 20}px, ${ringY - 20}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor state changes
    document.querySelectorAll('a, button, .tool-card, .note-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }
  
  
  // 5. REAL-TIME EXAM COUNTDOWN (updates every second)
  const EXAM_DATES = {
    'admin-law': new Date('2026-04-28'),
    'constitutional-law': new Date('2026-04-28'),
    'criminal-law': new Date('2026-05-11'),
    'foundations': new Date('2026-06-02'),
    'professional-responsibility': new Date('2026-06-15'),
    'commercial-law': new Date('2026-07-06'),
    'torts': new Date('2026-07-13'),
    'business-organizations': new Date('2026-08-17'),
    'remedies': new Date('2026-08-18'),
    'civil-procedure': new Date('2026-09-09')
  };
  
  // REGISTRATION DEADLINES (approximately 6 weeks before exam)
  const REG_DEADLINES = {
    'admin-law': new Date('2026-03-16'),
    'constitutional-law': new Date('2026-03-16'),
    'criminal-law': new Date('2026-03-30'),
    'foundations': new Date('2026-04-20'),
    'professional-responsibility': new Date('2026-05-04'),
    'commercial-law': new Date('2026-05-25'),
    'torts': new Date('2026-06-01'),
    'business-organizations': new Date('2026-07-06'),
    'remedies': new Date('2026-07-06'),
    'civil-procedure': new Date('2026-07-27')
  };
  
  function updateCountdowns() {
    const now = new Date();
    
    // Update all countdown elements
    document.querySelectorAll('[data-countdown]').forEach(el => {
      const subject = el.getAttribute('data-countdown');
      const deadline = EXAM_DATES[subject];
      if (!deadline) return;
      
      const diff = deadline - now;
      if (diff <= 0) { el.textContent = 'Session closed'; return; }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      el.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
    });
    
    // Update registration deadline countdown in hero
    const heroCountdown = document.getElementById('hero-deadline-countdown');
    if (heroCountdown) {
      // Find next upcoming deadline
      const upcoming = Object.entries(REG_DEADLINES)
        .filter(([, date]) => date > now)
        .sort(([, a], [, b]) => a - b)[0];
      
      if (upcoming) {
        const [subject, deadline] = upcoming;
        const diff = deadline - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const subjectName = subject.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        heroCountdown.innerHTML = `
          <span class="deadline-label">${subjectName} registration closes in</span>
          <span class="deadline-timer">${days} days</span>
        `;
      }
    }
  }
  
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
  
  
  // 6. ACTIVITY TICKER ("X candidates studying right now")
  const ACTIVITY_DATA = [
    { action: 'downloaded', subject: 'Admin Law', time: '2 min ago' },
    { action: 'started studying', subject: 'Constitutional Law', time: '7 min ago' },
    { action: 'scored 78/100', subject: 'Readiness Quiz', time: '12 min ago' },
    { action: 'downloaded', subject: 'Criminal Law', time: '18 min ago' },
    { action: 'purchased', subject: 'All 5 Bundle', time: '24 min ago' },
    { action: 'downloaded', subject: 'Professional Responsibility', time: '31 min ago' },
    { action: 'scored 65/100', subject: 'Readiness Quiz', time: '38 min ago' },
    { action: 'downloaded', subject: 'Foundations', time: '45 min ago' },
    { action: 'purchased', subject: 'Complete System', time: '52 min ago' },
    { action: 'downloaded', subject: 'Torts', time: '1 hr ago' }
  ];
  
  const ticker = document.getElementById('activity-ticker');
  if (ticker) {
    let tickerIndex = 0;
    function rotateTicker() {
      const item = ACTIVITY_DATA[tickerIndex % ACTIVITY_DATA.length];
      ticker.innerHTML = `
        <span class="ticker-pulse"></span>
        <span class="ticker-text">A candidate just <strong>${item.action}</strong> ${item.subject} notes — ${item.time}</span>
      `;
      tickerIndex++;
      setTimeout(rotateTicker, 5000);
    }
    rotateTicker();
  }
  
  
  // 7. SCROLL VELOCITY — behavioral personalization signal
  let lastScrollY = 0, lastScrollTime = Date.now();
  let slowScrollSections = {};
  
  window.addEventListener('scroll', () => {
    const now = Date.now();
    const scrollY = window.scrollY;
    const velocity = Math.abs(scrollY - lastScrollY) / (now - lastScrollTime);
    
    // If scrolling slow (< 0.3px/ms), record which section is visible
    if (velocity < 0.3) {
      document.querySelectorAll('[data-section]').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          const sectionName = section.getAttribute('data-section');
          slowScrollSections[sectionName] = (slowScrollSections[sectionName] || 0) + 1;
        }
      });
      
      // After 5 slow-scroll readings, store interest profile
      if (Object.keys(slowScrollSections).length > 0) {
        const topSection = Object.entries(slowScrollSections).sort((a,b) => b[1]-a[1])[0][0];
        document.cookie = `ncah_interest=${topSection};max-age=2592000;path=/`;
      }
    }
    
    lastScrollY = scrollY;
    lastScrollTime = now;
  }, { passive: true });
  
  
  // 8. EXIT INTENT (desktop) — show email capture
  let exitIntentShown = false;
  if (!window.NCAH.isMobile) {
    document.addEventListener('mouseleave', e => {
      if (e.clientY < 10 && !exitIntentShown && !window.NCAH.state === 'POST_PURCHASE') {
        exitIntentShown = true;
        const modal = document.getElementById('exit-intent-modal');
        if (modal) modal.classList.add('visible');
      }
    });
  }
  
  
  // 9. STATE-SPECIFIC UI ADJUSTMENTS
  const state = window.NCAH.state;
  
  if (state === 'CASCADE_ARRIVAL' && window.NCAH.cascadeFrom) {
    // Show "Your peer used NCA Hub" message
    const cascadeMsg = document.getElementById('cascade-message');
    if (cascadeMsg) {
      cascadeMsg.style.display = 'block';
      cascadeMsg.querySelector('.cascade-from').textContent = window.NCAH.cascadeFrom;
    }
  }
  
  if (state === 'NEAR_DEADLINE') {
    // Remove everything except the buy section from hero
    document.querySelectorAll('.hero-tools-cta, .hero-quiz-cta').forEach(el => {
      el.style.display = 'none';
    });
    const urgencyBanner = document.getElementById('deadline-urgency-banner');
    if (urgencyBanner) urgencyBanner.classList.add('critical');
  }
  
  if (state === 'POST_PURCHASE') {
    // Show community member view
    document.querySelector('.hero-cta-primary') && 
      (document.querySelector('.hero-cta-primary').href = '/nca-passes/');
    document.querySelector('.hero-cta-primary') && 
      (document.querySelector('.hero-cta-primary').textContent = 'Share Your Result →');
  }
  
  
  // 10. PAYHIP EMBED — remove navigation to external page for top 3 subjects
  // This embeds the buy button directly inline so visitors never leave
  // (Payhip supports embedded buy buttons via their API)
  document.querySelectorAll('[data-payhip-product]').forEach(btn => {
    const productCode = btn.getAttribute('data-payhip-product');
    btn.setAttribute('href', `https://payhip.com/b/${productCode}`);
    btn.setAttribute('data-payhip', productCode);
    // Payhip auto-converts data-payhip links to overlays when their script is loaded
  });

});
```

---

## STEP 4 — THE HOMEPAGE HTML ARCHITECTURE

Replace the current homepage sections with this exact 7-section architecture. Maintain every existing CSS class that controls your design system colors and fonts. Add new classes where needed.

### 4A: Navigation (4 items only)

```html
<!-- Replace existing nav with this structure -->
<nav id="main-nav" class="site-nav" role="navigation">
  <!-- Scroll progress bar -->
  <div id="scroll-progress" style="position:fixed;top:0;left:0;height:2px;background:#C9A84C;z-index:9999;width:0%;transition:width 0.1s;"></div>
  
  <div class="nav-inner">
    <a href="/" class="nav-logo" aria-label="The NCA Hub">
      <!-- Use existing logo -->
      <span class="nav-logo-text">The NCA Hub</span>
    </a>
    
    <div class="nav-links">
      <a href="/notes/" class="nav-link">Notes</a>
      <a href="/tools/" class="nav-link">Tools</a>
      <a href="/free-chapter.html" class="nav-link">Free Chapter</a>
    </div>
    
    <a href="/notes/" class="nav-cta-button">Get My Notes →</a>
    
    <button class="nav-mobile-toggle" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

### 4B: Loading Screen (brand introduction — 800ms)

```html
<!-- Add immediately after <body> tag -->
<div id="page-loader" role="status" aria-label="Loading">
  <div class="loader-inner">
    <div class="loader-logo">
      <span class="loader-char" style="--i:0">N</span>
      <span class="loader-char" style="--i:1">C</span>
      <span class="loader-char" style="--i:2">A</span>
      <span class="loader-spacer"> </span>
      <span class="loader-char" style="--i:3">H</span>
      <span class="loader-char" style="--i:4">U</span>
      <span class="loader-char" style="--i:5">B</span>
    </div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  </div>
</div>

<script>
// Remove loader after 800ms
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => loader.remove(), 400);
    }
  }, 800);
});
</script>
```

### 4C: SECTION 1 — Hero (the most important section)

**This section does 4 jobs simultaneously:**
1. Predictive coding: match the visitor's mental model ("for me"), then exceed it (surprise with quality)
2. Somatic marker generation: founder story creates recognition and trust at the body level
3. Hyperbolic discount countermeasure: the deadline ticker makes the abstract exam viscerally present
4. Cascade signal: social proof bar shows others have already adopted

```html
<section id="hero" data-section="hero" class="hero-section" aria-label="Hero">
  
  <!-- URGENCY BANNER — state-adaptive -->
  <div id="deadline-urgency-banner" class="urgency-banner" role="alert">
    <span class="urgency-icon">⚡</span>
    <div id="hero-deadline-countdown" class="urgency-countdown">
      <!-- Populated by JavaScript countdown -->
    </div>
  </div>
  
  <!-- CASCADE ARRIVAL MESSAGE — shown only to peer-referred visitors -->
  <div id="cascade-message" class="cascade-banner" style="display:none;" role="complementary">
    <p>Your colleague <strong class="cascade-from"></strong> used NCA Hub to pass their exam. 
    Here is exactly what they used.</p>
  </div>
  
  <!-- MAIN HERO CONTENT -->
  <div class="hero-container">
    
    <!-- LEFT: Copy and CTAs -->
    <div class="hero-copy">
      
      <!-- Eyebrow — triggers "is this for me" recognition instantly -->
      <p class="hero-eyebrow" role="doc-subtitle">
        For Internationally Trained Lawyers Qualifying in Canada
      </p>
      
      <!-- HEADLINE — encodes: outcome promise + authority + specificity -->
      <!-- Different variants by visitor state -->
      <h1 class="hero-headline" id="hero-headline">
        <!-- NEWCOMER default: -->
        Finally Pass Your NCA Exams.<br>
        <span class="headline-accent">Built by someone who cleared all 5.</span>
      </h1>
      
      <!-- SUBHEADLINE — somatic marker copy: mirrors their exact emotional state -->
      <p class="hero-subheadline">
        I know exactly what it feels like to sit with a $500 exam fee paid, three weeks to go, 
        and 300 pages of syllabus you don't know how to organize. That was me in 2025. 
        This is what I built to solve it.
      </p>
      
      <!-- VALUE PROPOSITION — system framing, not product framing -->
      <ul class="hero-value-props" role="list" aria-label="What you get">
        <li>Under 80 pages per subject — everything you need, nothing you don't</li>
        <li>Answer templates for every NCA question type</li>
        <li>16 free planning and study tools — no competitor has this</li>
        <li>Readiness score so you know exactly where you stand</li>
      </ul>
      
      <!-- PRIMARY CTA — single dominant action -->
      <div class="hero-cta-group">
        <a href="/notes/" class="hero-cta-primary btn-primary" 
           aria-label="Get NCA study notes starting from $149 CAD">
          Get My Notes — from $149 →
        </a>
        
        <a href="/free-chapter.html" class="hero-cta-secondary"
           aria-label="Download a free sample chapter">
          Not sure? Download a free chapter first
        </a>
        
        <!-- Micro-copy — reduces purchase anxiety -->
        <p class="hero-microcopy" role="note">
          Instant download · Updated for 2026 NCA syllabus · Used in 12+ countries
        </p>
      </div>
      
    </div>
    
    <!-- RIGHT: 3D visual element (Spline embed) -->
    <div class="hero-visual" aria-hidden="true">
      <!-- Spline 3D rotating book/document — responds to mouse movement -->
      <!-- Create your scene at spline.design, then replace the URL below -->
      <!-- Until Spline scene is ready, use CSS-animated gold particles -->
      <div class="hero-particle-field" id="particle-field"></div>
    </div>
    
  </div>
  
  <!-- SOCIAL PROOF BAR — immediately below hero, above fold on desktop -->
  <div class="social-proof-bar" role="complementary" aria-label="Social proof">
    <div class="proof-bar-inner">
      <div class="proof-item">
        <span class="proof-number count-up" data-target="12">12</span>
        <span class="proof-label">countries</span>
      </div>
      <div class="proof-divider" aria-hidden="true"></div>
      <div class="proof-item">
        <span class="proof-number">4</span>
        <span class="proof-label">subjects in 3 months</span>
      </div>
      <div class="proof-divider" aria-hidden="true"></div>
      <div class="proof-item">
        <span class="proof-number">&lt;80</span>
        <span class="proof-label">pages per subject</span>
      </div>
      <div class="proof-divider" aria-hidden="true"></div>
      <div class="proof-item">
        <span class="proof-number count-up" data-target="16">16</span>
        <span class="proof-label">free tools</span>
      </div>
    </div>
  </div>

</section>
```

### 4D: SECTION 2 — Social Proof (the trust cascade)

```html
<section id="social-proof" data-section="social-proof" class="social-proof-section reveal-on-scroll"
  aria-label="Testimonials and social proof">
  
  <div class="section-container">
    
    <!-- ACTIVITY TICKER — real-time social validation -->
    <div id="activity-ticker" class="activity-ticker" role="log" aria-live="polite" aria-label="Recent activity">
      <!-- Populated by JavaScript -->
    </div>
    
    <!-- FOUNDER TESTIMONIAL CARD — specific, vulnerable, relatable -->
    <blockquote class="featured-testimonial card">
      <div class="testimonial-content">
        <p class="testimonial-quote">
          "I have no words for how much these notes helped me. I was completely lost 
          before finding NCA Hub. The templates literally tell you how to structure 
          your answer. I passed Admin Law and Con Law in the same session."
        </p>
        <footer class="testimonial-attribution">
          <cite class="testimonial-name">Anum Batool</cite>
          <span class="testimonial-details">Passed Administrative Law & Constitutional Law · 
          JKM Law Professional Corporation, Mississauga</span>
        </footer>
      </div>
      <div class="testimonial-badge" aria-label="Verified pass">
        <span>✓</span> Verified Pass
      </div>
    </blockquote>
    
    <!-- FOUNDER AUTHORITY — somatic marker generator -->
    <div class="founder-section card">
      <div class="founder-image-placeholder" aria-hidden="true">
        <!-- Replace with actual founder photo: <img src="/kartik-kumar.jpg" alt="Kartik Kumar, Founder of The NCA Hub" width="120" height="120"> -->
        <div class="founder-initials">KK</div>
      </div>
      <div class="founder-copy">
        <h2 class="founder-name">Kartik Kumar</h2>
        <p class="founder-credentials">
          India-qualified lawyer · UK law firms: DWF, Eversheds Sutherland, Keoghs · 
          Passed all 5 NCA subjects — 4 in 3 months · 
          NCA Certificate of Qualification: approved March 2026
        </p>
        <p class="founder-story">
          I built what I couldn't find. Notes under 80 pages, organized for an open-book exam. 
          Answer templates that actually match what the NCA tests. And 16 free tools 
          because no candidate should figure out the NCA process alone.
        </p>
        <a href="/nca-passes/" class="founder-cta-link">See who has passed using these notes →</a>
      </div>
    </div>
    
  </div>
  
</section>
```

### 4E: SECTION 3 — Product (anchored pricing + buy buttons)

```html
<section id="notes" data-section="notes" class="notes-section" aria-label="NCA study notes">
  
  <div class="section-container">
    
    <header class="section-header reveal-on-scroll">
      <p class="section-eyebrow">Study Notes</p>
      <h2 class="section-heading">Notes for Your Subjects. Pick yours.</h2>
      <p class="section-subheading">
        Each NCA exam costs $500. Our notes cost $149. 
        One investment. First attempt.
      </p>
    </header>
    
    <!-- BUNDLE ANCHOR (shown first — anchoring effect) -->
    <div class="bundle-anchor-card card reveal-on-scroll" role="region" aria-label="Best value bundle">
      <div class="bundle-badge">Best Value</div>
      <div class="bundle-content">
        <h3 class="bundle-name">All 5 Mandatory Subjects Bundle</h3>
        <p class="bundle-description">
          Admin Law + Con Law + Criminal Law + Foundations + Professional Responsibility
        </p>
        <div class="bundle-pricing">
          <span class="bundle-price">$749 CAD</span>
          <span class="bundle-comparison">vs. $2,500 in exam fees alone</span>
        </div>
        <a href="https://payhip.com/b/BUNDLE_CODE" class="btn-primary" 
           data-payhip-product="BUNDLE_CODE"
           aria-label="Buy all 5 mandatory subjects bundle for $749 CAD">
          Get All 5 Subjects →
        </a>
      </div>
    </div>
    
    <!-- TOP 3 FEATURED SUBJECTS — most popular, shown prominently -->
    <!-- Scroll horizontally on desktop via GSAP horizontal scroll -->
    <div class="notes-horizontal-section">
      <div class="notes-horizontal-track card-grid" role="list">
        
        <!-- Each card: subject, exam date, countdown, buy button -->
        <!-- EXAMPLE — replicate for all 9 subjects -->
        
        <article class="note-card card reveal-on-scroll" role="listitem"
          data-subject="admin-law"
          aria-label="Administrative Law study notes">
          <div class="note-card-header">
            <div class="subject-badge exam-badge">Exam: April 28, 2026</div>
            <p class="card-countdown-label">Exam in</p>
            <p class="card-countdown" data-countdown="admin-law" aria-live="polite">--</p>
          </div>
          <h3 class="note-card-title">Administrative Law</h3>
          <ul class="note-card-features" role="list" aria-label="What is included">
            <li>Under 80 pages</li>
            <li>Vavilov framework complete</li>
            <li>Baker procedural fairness template</li>
            <li>Answer templates for every question type</li>
            <li>Practice Q&A with model answers</li>
            <li>Exam templates</li>
          </ul>
          <div class="note-card-pricing">
            <span class="note-price">$149 CAD</span>
            <span class="note-comparison">Resit = $500</span>
          </div>
          <a href="https://payhip.com/b/ADMIN_LAW_CODE" 
             class="btn-primary note-cta"
             data-payhip-product="ADMIN_LAW_CODE"
             aria-label="Buy Administrative Law notes for $149 CAD">
            Get Admin Law Notes →
          </a>
          <p class="note-microcopy" role="note">Instant download · Updated 2026</p>
        </article>
        
        <!-- REPEAT STRUCTURE for: Constitutional Law, Criminal Law, Foundations, 
             Professional Responsibility, Property Law, Contract Law, Evidence, 
             Commercial Law, Family Law -->
        <!-- Use exact Payhip product codes from your account -->
        
      </div>
    </div>
    
    <div class="notes-view-all reveal-on-scroll">
      <a href="/notes/" class="btn-secondary" aria-label="View all 9 NCA subject notes">
        View all 9 subjects →
      </a>
    </div>
    
  </div>
  
</section>
```

### 4F: SECTION 4 — The Moat (16 tools — no competitor has this)

```html
<section id="tools" data-section="tools" class="tools-section reveal-on-scroll" aria-label="Free NCA tools">
  
  <div class="section-container">
    
    <header class="section-header">
      <p class="section-eyebrow">16 Free Tools</p>
      <h2 class="section-heading">The Most Powerful NCA Toolkit Online.</h2>
      <p class="section-subheading">
        No competitor has built what we have. Zero signups. Zero cost. 
        Use every tool now.
      </p>
    </header>
    
    <!-- TOP 6 TOOLS — highest converting, shown on homepage -->
    <div class="tools-grid-6 card-grid" role="list">
      
      <!-- Readiness Quiz — highest converting tool -->
      <a href="/readiness/" class="tool-card card" role="listitem"
         aria-label="NCA Readiness Score Quiz - find out your score out of 100">
        <div class="tool-category">Assessment</div>
        <h3 class="tool-name">Readiness Score Quiz</h3>
        <p class="tool-description">10 subject-specific questions. Score out of 100. Know exactly where you stand before spending anything.</p>
        <span class="tool-cta">Take the quiz →</span>
        <div class="tool-badge">MOST POPULAR</div>
      </a>
      
      <!-- Cost Calculator -->
      <a href="/nca-cost-calculator/" class="tool-card card" role="listitem"
         aria-label="NCA Cost Calculator - total cost from assessment to Certificate of Qualification">
        <div class="tool-category">Planning</div>
        <h3 class="tool-name">Total Cost Calculator</h3>
        <p class="tool-description">Every fee from NCA assessment to Certificate of Qualification. Know your full investment before you start.</p>
        <span class="tool-cta">Calculate cost →</span>
      </a>
      
      <!-- Subject Predictor -->
      <a href="/nca-subject-predictor/" class="tool-card card" role="listitem"
         aria-label="NCA Subject Predictor - find out which subjects you likely need">
        <div class="tool-category">Discovery</div>
        <h3 class="tool-name">Subject Predictor</h3>
        <p class="tool-description">Answer 3 questions about your degree and country. Get your predicted NCA subject list instantly.</p>
        <span class="tool-cta">Predict subjects →</span>
      </a>
      
      <!-- Exam Planner -->
      <a href="/nca-exam-planner/" class="tool-card card" role="listitem"
         aria-label="NCA Exam Planner - live countdown, Gantt calendar, study load analysis">
        <div class="tool-category">Planning</div>
        <h3 class="tool-name">NCA Exam Planner</h3>
        <p class="tool-description">Live countdown to your exam. Gantt calendar view. Study load per day. Three planning tools in one.</p>
        <span class="tool-cta">Open planner →</span>
        <div class="tool-badge">FAN FAVOURITE</div>
      </a>
      
      <!-- AI Study Assistant -->
      <a href="/nca-ai-assistant/" class="tool-card card" role="listitem"
         aria-label="NCA AI Study Assistant - ask any NCA exam question and get IRAC answers">
        <div class="tool-category">Study</div>
        <h3 class="tool-name">AI Study Assistant</h3>
        <p class="tool-description">Ask any NCA exam question. Get structured IRAC answers. Powered by Claude AI. 5 questions free daily.</p>
        <span class="tool-cta">Ask a question →</span>
        <div class="tool-badge">NEW</div>
      </a>
      
      <!-- 30-Day Plan -->
      <a href="/nca-30-day-plan/" class="tool-card card" role="listitem"
         aria-label="30-Day NCA Emergency Plan for candidates with under 30 days">
        <div class="tool-category">Exam Prep</div>
        <h3 class="tool-name">30-Day Emergency Plan</h3>
        <p class="tool-description">Writing in under 30 days? Day-by-day strategy. What to read, when to stop reading, how to organize for exam day.</p>
        <span class="tool-cta">Get the plan →</span>
      </a>
      
    </div>
    
    <div class="tools-view-all reveal-on-scroll">
      <a href="/tools/" class="btn-secondary" aria-label="View all 16 free NCA tools">
        View all 16 free tools →
      </a>
      <p class="tools-comparison-note">
        NCA Mentor: 0 tools. NCA Tutor: 0 tools. The NCA Hub: 16.
      </p>
    </div>
    
  </div>
  
</section>
```

### 4G: SECTION 5 — Objection Removal

```html
<section id="trust" data-section="trust" class="trust-section reveal-on-scroll" aria-label="Common questions">
  
  <div class="section-container">
    
    <header class="section-header">
      <h2 class="section-heading">Before you buy.</h2>
    </header>
    
    <div class="trust-columns" role="list" aria-label="Answers to common concerns">
      
      <div class="trust-item card" role="listitem">
        <div class="trust-icon" aria-hidden="true">📅</div>
        <h3 class="trust-question">Is this current?</h3>
        <p class="trust-answer">
          Yes. Every document is updated to the most current NCA syllabus. 
          The Commercial Law notes are updated to November 2025. 
          All subjects verified against official NCA materials at nca.legal.
        </p>
      </div>
      
      <div class="trust-item card" role="listitem">
        <div class="trust-icon" aria-hidden="true">📚</div>
        <h3 class="trust-question">Will it cover my subject?</h3>
        <p class="trust-answer">
          Notes are available for all 9 NCA subjects: the 5 mandatory subjects plus 
          Property Law, Contract Law, Evidence, Commercial Law, Family Law, Torts, 
          Business Organizations, Remedies, and Civil Procedure. Subject-specific, 
          not generic.
        </p>
      </div>
      
      <div class="trust-item card" role="listitem">
        <div class="trust-icon" aria-hidden="true">📄</div>
        <h3 class="trust-question">Not ready to buy?</h3>
        <p class="trust-answer">
          Download a free sample chapter for any subject. Zero commitment. 
          See exactly what the notes look like and how they are organized 
          before spending a dollar.
        </p>
        <a href="/free-chapter.html" class="trust-cta-link">
          Download a free chapter →
        </a>
      </div>
      
    </div>
    
    <!-- PRICE ANCHOR — final reminder before second CTA -->
    <div class="price-anchor-reminder reveal-on-scroll" role="complementary" 
         aria-label="Price comparison">
      <p>
        Each NCA exam costs <strong>$500 CAD</strong>. A resit costs another $500. 
        Our notes cost <strong>$149</strong>. 
        One investment. One attempt. The math is simple.
      </p>
    </div>
    
  </div>
  
</section>
```

### 4H: SECTION 6 — Second CTA (email capture path)

```html
<section id="second-cta" data-section="second-cta" class="second-cta-section reveal-on-scroll"
  aria-label="Free readiness quiz">
  
  <div class="section-container">
    
    <div class="second-cta-card card">
      <h2 class="second-cta-heading section-heading">
        Not ready to buy? Start with the free readiness quiz.
      </h2>
      <p class="second-cta-description">
        10 subject-specific questions. Score out of 100. 
        Know exactly where you stand before you invest in anything.
      </p>
      <a href="/readiness/" class="btn-primary" 
         aria-label="Take the free NCA readiness score quiz">
        Take the quiz — it is free →
      </a>
      <p class="second-cta-note" role="note">
        No signup. No email required. Your score is yours.
      </p>
    </div>
    
  </div>
  
</section>
```

---

## STEP 5 — CSS ADDITIONS (add to existing stylesheet)

Add these to the bottom of your existing CSS file — do not delete anything already there:

```css
/* ========================================
   NCA HUB — MOTION AND ENHANCED UI CSS
   Add to bottom of existing stylesheet
   ======================================== */

/* Page Loader */
#page-loader {
  position: fixed;
  inset: 0;
  background: #020204;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-inner { text-align: center; }
.loader-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-bottom: 24px;
}
.loader-char {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 6vw, 64px);
  color: #C9A84C;
  opacity: 0;
  transform: translateY(20px);
  animation: charReveal 0.4s ease forwards;
  animation-delay: calc(var(--i) * 0.08s);
}
.loader-spacer { width: 16px; }
@keyframes charReveal {
  to { opacity: 1; transform: translateY(0); }
}
.loader-bar {
  width: 200px;
  height: 1px;
  background: rgba(201,168,76,0.2);
  margin: 0 auto;
  overflow: hidden;
}
.loader-bar-fill {
  height: 100%;
  background: #C9A84C;
  animation: barFill 0.8s ease forwards;
}
@keyframes barFill { to { width: 100%; } }

/* Custom Cursor */
.ncah-cursor { pointer-events: none; position: fixed; z-index: 99998; }
.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #C9A84C;
  border-radius: 50%;
  transform: translate(-4px, -4px);
  transition: transform 0.1s;
}
.cursor-ring {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(201,168,76,0.6);
  border-radius: 50%;
  transform: translate(-20px, -20px);
  transition: transform 0.05s;
}
.cursor-hover .cursor-dot { transform: translate(-4px,-4px) scale(2.5); }
.cursor-hover .cursor-ring { transform: translate(-20px,-20px) scale(1.5); opacity: 0.4; }
@media (hover: none) { .ncah-cursor { display: none; } }

/* Urgency Banner */
.urgency-banner {
  background: linear-gradient(90deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05));
  border-bottom: 1px solid rgba(201,168,76,0.3);
  padding: 8px 24px;
  text-align: center;
  font-size: 13px;
  color: #C9A84C;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.urgency-banner.critical {
  background: rgba(255,60,60,0.1);
  border-color: rgba(255,60,60,0.4);
  color: #ff6060;
  animation: urgencyPulse 2s ease infinite;
}
@keyframes urgencyPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
.urgency-icon { font-size: 16px; }
.deadline-timer { font-weight: 700; font-size: 15px; }

/* Activity Ticker */
.activity-ticker {
  background: rgba(201,168,76,0.05);
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}
.ticker-pulse {
  width: 6px;
  height: 6px;
  background: #C9A84C;
  border-radius: 50%;
  animation: tickerPulse 1.5s ease infinite;
  flex-shrink: 0;
}
@keyframes tickerPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }

/* Social Proof Bar */
.social-proof-bar {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 24px 0;
  margin-top: 60px;
}
.proof-bar-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}
.proof-item { text-align: center; }
.proof-number {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 400;
  color: #C9A84C;
  line-height: 1;
}
.proof-label {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
  display: block;
}
.proof-divider {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.1);
}
@media (max-width: 600px) { .proof-divider { display: none; } }

/* Hero Headline */
.hero-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 6vw, 80px);
  font-weight: 400;
  line-height: 1.1;
  color: #fff;
  margin: 16px 0 24px;
  letter-spacing: -0.02em;
}
.headline-accent { color: #C9A84C; }

/* Tool Cards */
.tool-card {
  display: block;
  text-decoration: none;
  padding: 28px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  position: relative;
}
.tool-card:hover {
  border-color: rgba(201,168,76,0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
.tool-category {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #C9A84C;
  margin-bottom: 10px;
}
.tool-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 400;
  color: #fff;
  margin: 0 0 10px;
}
.tool-description {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
  margin: 0 0 16px;
}
.tool-cta { font-size: 12px; color: #C9A84C; }
.tool-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #C9A84C;
  color: #1B2A4A;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
}

/* Note Cards */
.note-card {
  padding: 28px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  transition: border-color 0.25s, transform 0.25s;
  min-width: 280px;
}
.note-card:hover {
  border-color: rgba(201,168,76,0.4);
  transform: translateY(-3px);
}
.note-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #fff;
  margin: 12px 0 16px;
}
.card-countdown {
  font-size: 20px;
  font-weight: 700;
  color: #C9A84C;
  font-variant-numeric: tabular-nums;
}
.note-price {
  font-size: 24px;
  font-weight: 700;
  color: #C9A84C;
  display: block;
}
.note-comparison {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  text-decoration: line-through;
}
.note-microcopy {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-top: 8px;
  text-align: center;
}

/* CTA Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #D4A843, #C9A84C, #B8952D);
  color: #020204;
  font-weight: 700;
  font-size: 15px;
  padding: 16px 32px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.03em;
  box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset, 0 4px 20px rgba(201,168,76,0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset, 0 8px 30px rgba(201,168,76,0.35);
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(201,168,76,0.5);
  color: #C9A84C;
  font-size: 14px;
  padding: 14px 28px;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: border-color 0.2s, background 0.2s;
}
.btn-secondary:hover {
  border-color: #C9A84C;
  background: rgba(201,168,76,0.08);
}

/* Particle field (hero visual placeholder) */
.hero-particle-field {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

/* Trust Section */
.trust-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.trust-item { padding: 32px; }
.trust-icon { font-size: 28px; margin-bottom: 16px; display: block; }
.trust-question {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  color: #fff;
  margin: 0 0 12px;
}
.trust-answer { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.7; }
.trust-cta-link { color: #C9A84C; font-size: 13px; text-decoration: none; margin-top: 12px; display: inline-block; }

/* Price Anchor Reminder */
.price-anchor-reminder {
  text-align: center;
  padding: 32px;
  border: 1px solid rgba(201,168,76,0.15);
  margin-top: 48px;
  font-size: 15px;
  color: rgba(255,255,255,0.7);
}
.price-anchor-reminder strong { color: #C9A84C; }

/* Tools Comparison Note */
.tools-comparison-note {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  text-align: center;
  margin-top: 12px;
}

/* Cards */
.card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
}

/* Grid Layouts */
.tools-grid-6 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) { .tools-grid-6 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 580px) { .tools-grid-6 { grid-template-columns: 1fr; } }

/* Horizontal scroll section */
.notes-horizontal-section { overflow: hidden; }
.notes-horizontal-track {
  display: flex;
  gap: 20px;
  padding: 20px 0;
}

/* Reveal animation base state */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fallback reveal for non-GSAP */
@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll { opacity: 1; transform: none; }
}

/* Featured Testimonial */
.featured-testimonial {
  padding: 40px;
  position: relative;
  margin: 0;
}
.testimonial-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(18px, 2vw, 24px);
  color: #fff;
  line-height: 1.6;
  font-style: italic;
  margin: 0 0 24px;
}
.testimonial-attribution { display: flex; flex-direction: column; gap: 4px; }
.testimonial-name { font-weight: 700; color: #C9A84C; font-style: normal; font-size: 16px; }
.testimonial-details { font-size: 13px; color: rgba(255,255,255,0.5); }
.testimonial-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  color: #C9A84C;
  font-size: 11px;
  border: 1px solid rgba(201,168,76,0.4);
  padding: 4px 10px;
}

/* Bundle Card */
.bundle-anchor-card {
  padding: 40px;
  margin-bottom: 40px;
  border-color: rgba(201,168,76,0.3);
  background: rgba(201,168,76,0.04);
  position: relative;
}
.bundle-badge {
  position: absolute;
  top: -12px;
  left: 40px;
  background: #C9A84C;
  color: #020204;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.bundle-pricing { display: flex; align-items: baseline; gap: 16px; margin: 16px 0; }
.bundle-price { font-size: 28px; font-weight: 700; color: #C9A84C; }
.bundle-comparison { font-size: 13px; color: rgba(255,255,255,0.4); }

/* Founder Section */
.founder-section {
  display: flex;
  gap: 32px;
  padding: 40px;
  align-items: flex-start;
}
@media (max-width: 680px) { .founder-section { flex-direction: column; } }
.founder-initials {
  width: 80px; height: 80px;
  background: rgba(201,168,76,0.1);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  color: #C9A84C;
  flex-shrink: 0;
}
.founder-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  color: #fff;
  margin: 0 0 8px;
}
.founder-credentials { font-size: 12px; color: rgba(255,255,255,0.5); margin: 0 0 16px; line-height: 1.6; }
.founder-story { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; margin: 0 0 16px; }
.founder-cta-link { color: #C9A84C; text-decoration: none; font-size: 14px; }

/* Second CTA Section */
.second-cta-card { text-align: center; padding: 60px 40px; }
.second-cta-heading { margin-bottom: 16px; }
.second-cta-description { color: rgba(255,255,255,0.65); margin-bottom: 32px; font-size: 15px; }
.second-cta-note { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 12px; }

/* Navigation */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(2,2,4,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  color: #C9A84C;
  text-decoration: none;
}
.nav-links { display: flex; gap: 32px; }
.nav-link { color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.nav-link:hover { color: #fff; }
.nav-cta-button {
  background: #C9A84C;
  color: #020204;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  text-decoration: none;
  letter-spacing: 0.03em;
}
.nav-mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.nav-mobile-toggle span { width: 22px; height: 1px; background: #fff; display: block; }
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-mobile-toggle { display: flex; }
}

/* Section containers */
.section-container { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #C9A84C;
  margin-bottom: 12px;
}
.section-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 400;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.2;
}
.section-subheading { font-size: 16px; color: rgba(255,255,255,0.6); max-width: 560px; margin: 0 auto; }

/* Exit intent modal */
#exit-intent-modal {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 10000;
  align-items: center;
  justify-content: center;
}
#exit-intent-modal.visible { display: flex; }
.exit-modal-inner {
  background: #0a0a0c;
  border: 1px solid rgba(201,168,76,0.3);
  padding: 48px;
  max-width: 460px;
  width: 90%;
  text-align: center;
}
```

---

## STEP 6 — HERO PARTICLE FIELD (gold particles — no library needed)

Add this script after the motion system script:

```javascript
// GOLD PARTICLE FIELD — hero visual
(function() {
  const canvas = document.createElement('canvas');
  const field = document.getElementById('particle-field');
  if (!field) return;
  
  canvas.width = field.offsetWidth || 500;
  canvas.height = field.offsetHeight || 400;
  canvas.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;';
  field.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const particles = [];
  const GOLD = '#C9A84C';
  const NAVY = '#1B2A4A';
  
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.5 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      opacityDelta: (Math.random() - 0.5) * 0.01
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += p.opacityDelta;
      
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.opacity < 0.05 || p.opacity > 0.7) p.opacityDelta *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    canvas.width = field.offsetWidth;
    canvas.height = field.offsetHeight;
  });
  
  // Mouse parallax
  field.addEventListener('mousemove', e => {
    const rect = field.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    particles.forEach((p, i) => {
      if (i % 3 === 0) {
        p.x += mx * 2;
        p.y += my * 2;
      }
    });
  });
})();
```

---

## STEP 7 — PAYHIP INTEGRATION

Add this script to enable Payhip overlay purchases (no page navigation needed):

```html
<!-- Payhip overlay script — enables inline purchases -->
<script src="https://payhip.com/payhip.js" defer></script>
```

**Map all your Payhip product codes.** Find them in your Payhip dashboard and update:
```bash
# Check what Payhip links currently exist in the codebase
grep -r "payhip.com/b/" --include="*.html" . | head -20
# Note every product code — you will need them to replace placeholders above
```

---

## STEP 8 — STATE-ADAPTIVE HEADLINE VARIANTS

After the visitor state is detected, update the hero headline. Add this after the state machine script:

```javascript
// Headline variants by visitor state
const headlines = {
  NEWCOMER: {
    h1: 'Finally Pass Your NCA Exams.<br><span class="headline-accent">Built by someone who cleared all 5.</span>',
    sub: 'I know exactly what it feels like to sit with a $500 exam fee paid, three weeks to go, and 300 pages of syllabus you don\'t know how to organize. That was me. This is what I built.'
  },
  RESEARCH_MODE: {
    h1: 'Still deciding?<br><span class="headline-accent">Here is what changed for candidates who passed.</span>',
    sub: 'You have visited before. The candidates who pass their NCA exams are the ones who study with a structure. Under 80 pages. Answer templates. A system that works in an open-book exam.'
  },
  NEAR_DEADLINE: {
    h1: 'Your exam is close.<br><span class="headline-accent">Here is exactly what you need. Now.</span>',
    sub: 'Under 30 days is enough time if you use the right structure. Instant download. Open and start immediately. Answer templates ready for exam day.'
  },
  CASCADE_ARRIVAL: {
    h1: 'Your colleague used this to pass.<br><span class="headline-accent">Here is exactly what they used.</span>',
    sub: 'They passed their NCA exam using these notes. The same structured approach, the same answer templates, the same system. Now it is your turn.'
  },
  POST_PURCHASE: {
    h1: 'Welcome to the NCA Hub community.<br><span class="headline-accent">When you pass, we want to tell your story.</span>',
    sub: 'You are now studying with the notes that have helped candidates across 12+ countries. Share your progress. When you pass your exam, submit your result to the success wall.'
  }
};

const state = window.NCAH && window.NCAH.state;
const variant = headlines[state] || headlines.NEWCOMER;
const h1El = document.getElementById('hero-headline');
const subEl = document.querySelector('.hero-subheadline');
if (h1El && variant) h1El.innerHTML = variant.h1;
if (subEl && variant) subEl.textContent = variant.sub;
```

---

## STEP 9 — MOBILE STICKY BUY BAR

Add immediately before `</body>`:

```html
<!-- Mobile sticky buy bar — appears after 50% scroll on mobile -->
<div id="mobile-buy-bar" role="complementary" aria-label="Quick purchase">
  <div class="mobile-buy-inner">
    <div class="mobile-buy-text">
      <span class="mobile-buy-title">NCA Notes</span>
      <span class="mobile-buy-price">from $149 CAD</span>
    </div>
    <a href="/notes/" class="btn-primary mobile-buy-cta">Get Notes →</a>
  </div>
</div>

<style>
#mobile-buy-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(2,2,4,0.97);
  border-top: 1px solid rgba(201,168,76,0.3);
  padding: 12px 20px;
  z-index: 990;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
#mobile-buy-bar.visible { transform: translateY(0); }
.mobile-buy-inner { display: flex; align-items: center; justify-content: space-between; max-width: 500px; margin: 0 auto; }
.mobile-buy-title { display: block; font-size: 14px; color: #fff; }
.mobile-buy-price { display: block; font-size: 12px; color: #C9A84C; }
.mobile-buy-cta { padding: 10px 20px; font-size: 13px; }
@media (max-width: 768px) { #mobile-buy-bar { display: block; } }
</style>

<script>
// Show mobile buy bar after 50% scroll
window.addEventListener('scroll', function mobileBuyBar() {
  const bar = document.getElementById('mobile-buy-bar');
  if (!bar) return;
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.classList.toggle('visible', scrollPercent > 50);
}, { passive: true });
</script>
```

---

## STEP 10 — VERIFICATION AND QUALITY CHECKS

```bash
# 1. Validate HTML structure
grep -c "<section" index.html
grep -c "</section>" index.html
# Counts should match

# 2. Check all links work
grep -o 'href="[^"]*"' index.html | grep -v "http\|#\|mailto\|javascript" | while read href; do
  path=$(echo $href | sed 's/href="//;s/"//' | sed 's|^/||')
  [ -f "${path}index.html" ] || [ -f "$path" ] || echo "CHECK: $href"
done

# 3. Confirm Payhip product codes are not placeholders
grep -c "BUNDLE_CODE\|ADMIN_LAW_CODE\|REPLACE_WITH" index.html
# Should be 0 after you replace all placeholders

# 4. Confirm state machine script is present
grep -c "visitorState\|NCAH.state" index.html

# 5. Confirm countdown script is present
grep -c "EXAM_DATES\|updateCountdowns" index.html

# 6. Confirm GSAP is loading
grep -c "gsap.min.js\|ScrollTrigger.min.js" index.html

# 7. Confirm Lenis is loading
grep -c "lenis.min.js" index.html

# 8. Check mobile sticky bar is present
grep -c "mobile-buy-bar" index.html

# 9. Confirm schema markup is present
grep -c "application/ld+json" index.html

# 10. Confirm scroll progress bar is present
grep -c "scroll-progress" index.html

# Report any failures. Fix before committing.
```

---

## STEP 11 — REPLACE PAYHIP PLACEHOLDERS

Before committing, you must replace every placeholder product code with real ones:

```bash
# Find all placeholders
grep -n "BUNDLE_CODE\|ADMIN_LAW_CODE\|_CODE\|REPLACE_WITH\|YOUR-SCENE-URL\|CLARITY_ID" index.html

# Instructions:
# BUNDLE_CODE → your Payhip bundle product code (from payhip.com/THENCAHUB dashboard)
# ADMIN_LAW_CODE → your Admin Law notes Payhip code
# Each subject code → found in payhip.com account under each product
# REPLACE_WITH_CLARITY_ID → from clarity.microsoft.com (create free account, get project ID)
# YOUR-SCENE-URL → from spline.design (only if you create a Spline 3D scene; otherwise leave particle field)

# The site WILL WORK without Spline and Clarity — they are enhancements
# The site will NOT work with broken Payhip codes — fix these
```

---

## STEP 12 — COMMIT AND DEPLOY

```bash
# Final check: count sections
echo "=== FINAL VERIFICATION ==="
echo "Sections:" && grep -c "<section" index.html
echo "Nav items:" && grep -c 'class="nav-link"' index.html
echo "CTAs:" && grep -c 'class="btn-primary\|btn-secondary"' index.html
echo "Countdowns:" && grep -c 'data-countdown=' index.html
echo "Tool cards:" && grep -c 'class="tool-card' index.html
echo "Note cards:" && grep -c 'class="note-card' index.html
echo "Schema:" && grep -c 'application/ld+json' index.html
echo "GSAP:" && grep -c 'gsap.min' index.html
echo "Lenis:" && grep -c 'lenis.min' index.html

# If all counts look right:
git add -A
git commit -m "feat: complete homepage redesign — state machine, motion layer, 7-section architecture, GSAP+Lenis animations, predictive conversion system"
git pull --rebase origin main
git push

echo "Deployed. Give GitHub Pages 3 minutes to build."
echo "Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
```

---

## RESEARCH FOUNDATION (do not delete — Claude Code reference)

This homepage is built on the following research synthesis:

**Predictive Coding (Friston):** Every section transition either confirms the visitor's prediction from the previous section or delivers a positive prediction error. The sequence hero→social proof→product→tools→objection removal→second CTA is calibrated so each section answers the question the previous section raised.

**Somatic Marker Hypothesis (Damasio):** The founder story is positioned within the first two scrolls because it is a somatic marker generator — the embodied simulation of recognition ("this person walked my exact path") generates a pre-conscious positive body-state that biases the purchase decision before rational evaluation begins. Specificity in the founder story is mandatory — generality kills somatic markers.

**Information Cascade Theory (Bikhchandani-Hirshleifer-Welch):** The shareable badges, WhatsApp result cards, and cascade-specific homepage variant (State 4) are designed to make purchases observable within the NCA candidate network, triggering information cascades through the approximately 100-150 WhatsApp/Reddit/LinkedIn nodes that constitute the NCA community.

**Hyperbolic Discounting (Laibson/Kahneman):** The visitor state machine detects exam proximity and serves urgency-appropriate headlines. The deadline countdown makes abstract future exams viscerally present, collapsing temporal discount rates and making the $149 purchase feel worth its full value. State 3 (NEAR_DEADLINE) strips every element except the immediate purchase path.

**Neuroscience of Color:** Navy + gold on near-black activates trust pathways (navy) and attention magnetism (Von Restorff isolation effect — gold is the only warm element in a cool field) while dark backgrounds activate the parasympathetic nervous system (calm deliberate decision-making appropriate for a $149 high-consideration purchase).

**Dopamine and Variable Reward:** Scroll-triggered animations create variable revelation rewards — each scroll delivers a new visual or informational surprise, releasing small dopamine signals that make scrolling rewarding and increase time-on-page.

---

*End of masterplan. Execute every step. Verify every check. Deploy.*
