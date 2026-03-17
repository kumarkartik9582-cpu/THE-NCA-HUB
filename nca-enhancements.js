/**
 * NCA Hub Enhancements
 * - Auto reading time calculation
 * - Scroll-triggered animations (Intersection Observer)
 * - AI-personalized recommended next articles
 * - Reading progress tracking (localStorage)
 */
(function () {
  'use strict';

  /* ─── 1. READING TIME AUTO-CALCULATION ─────────────────────────────── */
  function calcReadingTime() {
    var body = document.getElementById('art-body');
    if (!body) return;
    var text = body.innerText || body.textContent || '';
    var words = text.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 220)); // 220 wpm average
    // Find the span containing "min read" and update it
    var spans = document.querySelectorAll('.art-read');
    spans.forEach(function (s) {
      if (/\d+\s*min read/i.test(s.textContent)) {
        s.textContent = mins + ' min read';
        s.setAttribute('data-words', words);
      }
    });
    // Also update any element with id="reading-time"
    var rt = document.getElementById('reading-time');
    if (rt) rt.textContent = mins + ' min read';
  }

  /* ─── 2. READING PROGRESS BAR ──────────────────────────────────────── */
  function initProgressBar() {
    var prog = document.getElementById('prog');
    if (!prog) return;
    function update() {
      var doc = document.documentElement;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var total = doc.scrollHeight - doc.clientHeight;
      var pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      prog.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─── 3. SCROLL-TRIGGERED ANIMATIONS ───────────────────────────────── */
  function initScrollAnimations() {
    // Add fade-in-up to article sections, tables, blockquotes, stat boxes
    var targets = document.querySelectorAll(
      '.art-body h2, .art-body h3, .art-body table, .art-body blockquote, ' +
      '.stat-box, .comparison-table, .answer-capsule, .rel-card, ' +
      '.art-cta, .nca-inline-newsletter'
    );
    if (!targets.length) return;

    // CSS for animations — inject once
    if (!document.getElementById('nca-anim-style')) {
      var style = document.createElement('style');
      style.id = 'nca-anim-style';
      style.textContent = [
        '.nca-anim{opacity:0;transform:translateY(22px);transition:opacity .55s ease,transform .55s ease}',
        '.nca-anim.nca-visible{opacity:1;transform:translateY(0)}',
        '.nca-anim-delay-1{transition-delay:.08s}',
        '.nca-anim-delay-2{transition-delay:.16s}',
        '.nca-anim-delay-3{transition-delay:.24s}',
        /* Reading progress bar polish */
        '#prog{transition:width .1s linear}',
        /* Highlight anchor sections on scroll */
        '.nca-section-highlight{animation:nca-sec-flash .7s ease-out}',
        '@keyframes nca-sec-flash{0%{background:rgba(201,168,76,.12)}100%{background:transparent}}'
      ].join('');
      document.head.appendChild(style);
    }

    targets.forEach(function (el, i) {
      el.classList.add('nca-anim');
      if (i % 3 === 1) el.classList.add('nca-anim-delay-1');
      if (i % 3 === 2) el.classList.add('nca-anim-delay-2');
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      targets.forEach(function (el) { el.classList.add('nca-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('nca-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ─── 4. READING HISTORY (localStorage) ────────────────────────────── */
  var STORAGE_KEY = 'nca_read_articles';

  function getReadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) { return []; }
  }

  function markCurrentArticleRead() {
    var slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
    if (!slug) return;
    var history = getReadHistory();
    if (history.indexOf(slug) === -1) {
      history.unshift(slug);
      // Keep last 30
      if (history.length > 30) history = history.slice(0, 30);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
    }
  }

  /* ─── 5. AI-PERSONALIZED RECOMMENDED NEXT ──────────────────────────── */
  function personalizeRecommendations() {
    var grid = document.querySelector('.rel-grid');
    if (!grid) return;

    var readHistory = getReadHistory();
    if (!readHistory.length) return; // No history yet — keep defaults

    var cards = Array.from(grid.querySelectorAll('.rel-card'));
    if (cards.length < 2) return;

    // De-prioritize already-read articles by moving them to the end
    var unread = [], read = [];
    cards.forEach(function (card) {
      var href = (card.getAttribute('href') || '').replace(/\/$/, '').split('/').pop();
      if (readHistory.indexOf(href) !== -1) {
        read.push(card);
      } else {
        unread.push(card);
      }
    });

    if (read.length === 0) return; // nothing to reorder

    // Rebuild grid: unread first, then read (with "already read" label)
    grid.innerHTML = '';
    unread.forEach(function (c) { grid.appendChild(c); });
    read.forEach(function (c) {
      var badge = document.createElement('span');
      badge.textContent = 'Read';
      badge.style.cssText = 'font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;' +
        'background:rgba(201,168,76,.12);color:rgba(201,168,76,.6);padding:2px 7px;' +
        'border-radius:3px;position:absolute;top:12px;right:12px;';
      c.style.position = 'relative';
      c.appendChild(badge);
      grid.appendChild(c);
    });

    // Update eyelet label
    var eyelet = document.querySelector('.rel-eyelet');
    if (eyelet && unread.length > 0) {
      eyelet.textContent = 'Recommended Next';
    }
  }

  /* ─── 6. SMOOTH ANCHOR HIGHLIGHT ON HASH CHANGE ────────────────────── */
  function highlightTargetSection() {
    var hash = window.location.hash;
    if (!hash) return;
    var target = document.querySelector(hash);
    if (target) {
      target.classList.add('nca-section-highlight');
      setTimeout(function () { target.classList.remove('nca-section-highlight'); }, 700);
    }
  }

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  function init() {
    calcReadingTime();
    initProgressBar();
    initScrollAnimations();
    markCurrentArticleRead();
    personalizeRecommendations();
    highlightTargetSection();
    window.addEventListener('hashchange', highlightTargetSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
