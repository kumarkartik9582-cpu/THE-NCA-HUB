/**
 * NCA Hub Enhancements v2
 * - Auto reading time calculation
 * - Scroll-triggered animations (respects prefers-reduced-motion)
 * - AI-personalized recommended next articles
 * - Reading progress bar
 * - Reading history tracking (localStorage)
 * - "Was this helpful?" widget
 * - GA4 event tracking (scroll depth, CTA clicks, newsletter, helpful votes)
 * - SW update notification banner
 */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. READING TIME AUTO-CALCULATION ─────────────────────────────── */
  function calcReadingTime() {
    var body = document.getElementById('art-body');
    if (!body) return;
    var text = body.innerText || body.textContent || '';
    var words = text.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 220));
    document.querySelectorAll('.art-read').forEach(function (s) {
      if (/\d+\s*min read/i.test(s.textContent)) {
        s.textContent = mins + ' min read';
        s.setAttribute('data-words', words);
      }
    });
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
    if (REDUCED) return; // respect prefers-reduced-motion

    var targets = document.querySelectorAll(
      '.art-body h2, .art-body h3, .art-body table, .art-body blockquote, ' +
      '.stat-box, .comparison-table, .answer-capsule, .rel-card, ' +
      '.art-cta, .nca-inline-newsletter, .nca-helpful-widget'
    );
    if (!targets.length) return;

    if (!document.getElementById('nca-anim-style')) {
      var style = document.createElement('style');
      style.id = 'nca-anim-style';
      style.textContent =
        '.nca-anim{opacity:0;transform:translateY(22px);transition:opacity .55s ease,transform .55s ease}' +
        '.nca-anim.nca-visible{opacity:1;transform:translateY(0)}' +
        '.nca-anim-delay-1{transition-delay:.08s}' +
        '.nca-anim-delay-2{transition-delay:.16s}' +
        '#prog{transition:width .1s linear}' +
        '.nca-section-highlight{animation:nca-sec-flash .7s ease-out}' +
        '@keyframes nca-sec-flash{0%{background:rgba(201,168,76,.12)}100%{background:transparent}}';
      document.head.appendChild(style);
    }

    targets.forEach(function (el, i) {
      el.classList.add('nca-anim');
      if (i % 3 === 1) el.classList.add('nca-anim-delay-1');
      if (i % 3 === 2) el.classList.add('nca-anim-delay-2');
    });

    if (!('IntersectionObserver' in window)) {
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
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function markCurrentArticleRead() {
    var slug = window.location.pathname.replace(/\/$/, '').split('/').pop();
    if (!slug) return;
    var history = getReadHistory();
    if (history.indexOf(slug) === -1) {
      history.unshift(slug);
      if (history.length > 30) history = history.slice(0, 30);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
    }
  }

  /* ─── 5. AI-PERSONALIZED RECOMMENDED NEXT ──────────────────────────── */
  function personalizeRecommendations() {
    var grid = document.querySelector('.rel-grid');
    if (!grid) return;
    var readHistory = getReadHistory();
    if (!readHistory.length) return;
    var cards = Array.from(grid.querySelectorAll('.rel-card'));
    if (cards.length < 2) return;
    var unread = [], read = [];
    cards.forEach(function (card) {
      var href = (card.getAttribute('href') || '').replace(/\/$/, '').split('/').pop();
      if (readHistory.indexOf(href) !== -1) read.push(card);
      else unread.push(card);
    });
    if (!read.length) return;
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
    var eyelet = document.querySelector('.rel-eyelet');
    if (eyelet && unread.length > 0) eyelet.textContent = 'Recommended Next';
  }

  /* ─── 6. ANCHOR HIGHLIGHT ───────────────────────────────────────────── */
  function highlightTargetSection() {
    var hash = window.location.hash;
    if (!hash) return;
    var target = document.querySelector(hash);
    if (target) {
      target.classList.add('nca-section-highlight');
      setTimeout(function () { target.classList.remove('nca-section-highlight'); }, 700);
    }
  }

  /* ─── 7. GA4 EVENT TRACKING ─────────────────────────────────────────── */
  function fire(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params || {});
  }

  function initGA4Tracking() {
    // CTA clicks
    document.querySelectorAll('.art-cta-btn, .art-notes-cta a, [href*="payhip.com"]').forEach(function (el) {
      el.addEventListener('click', function () {
        fire('cta_click', { cta_text: el.textContent.trim().slice(0, 50), page: window.location.pathname });
      });
    });

    // Newsletter signup (success tracked by form submission event below)
    var nlForm = document.getElementById('nca-nl-form');
    if (nlForm) {
      nlForm.addEventListener('submit', function () {
        fire('newsletter_signup_attempt', { page: window.location.pathname });
      });
    }

    // Chat open
    var chatBtn = document.getElementById('nca-chat-btn');
    if (chatBtn) {
      var chatFired = false;
      chatBtn.addEventListener('click', function () {
        if (!chatFired) { chatFired = true; fire('chat_open', { page: window.location.pathname }); }
      });
    }

    // Scroll depth milestones (25, 50, 75, 100%)
    if (document.getElementById('art-body')) {
      var milestones = { 25: false, 50: false, 75: false, 100: false };
      window.addEventListener('scroll', function () {
        var doc = document.documentElement;
        var scrolled = doc.scrollTop || document.body.scrollTop;
        var total = doc.scrollHeight - doc.clientHeight;
        if (!total) return;
        var pct = (scrolled / total) * 100;
        [25, 50, 75, 100].forEach(function (m) {
          if (!milestones[m] && pct >= m) {
            milestones[m] = true;
            fire('scroll_depth', { depth: m, page: window.location.pathname });
          }
        });
      }, { passive: true });
    }

    // Share button clicks
    document.querySelectorAll('.art-share a').forEach(function (el) {
      el.addEventListener('click', function () {
        var platform = el.href.includes('linkedin') ? 'linkedin'
          : el.href.includes('whatsapp') ? 'whatsapp'
          : el.href.includes('twitter') || el.href.includes('x.com') ? 'twitter' : 'other';
        fire('share', { method: platform, content_type: 'article', page: window.location.pathname });
      });
    });
  }

  /* ─── 8. "WAS THIS HELPFUL?" WIDGET ────────────────────────────────── */
  function initHelpfulWidget() {
    var widget = document.getElementById('nca-helpful-widget');
    if (!widget) return;
    var VOTE_KEY = 'nca_helpful_' + window.location.pathname.replace(/\//g, '_');
    var alreadyVoted = localStorage.getItem(VOTE_KEY);

    if (alreadyVoted) {
      widget.querySelector('.nca-helpful-btns').style.display = 'none';
      var msg = widget.querySelector('.nca-helpful-thankyou');
      if (msg) { msg.hidden = false; msg.textContent = 'Thanks for your feedback! You voted: ' + alreadyVoted + '.'; }
      return;
    }

    widget.querySelectorAll('.nca-helpful-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var vote = btn.dataset.vote;
        try { localStorage.setItem(VOTE_KEY, vote); } catch (e) {}
        fire('helpful_vote', { vote: vote, page: window.location.pathname });
        widget.querySelector('.nca-helpful-btns').style.display = 'none';
        var thankyou = widget.querySelector('.nca-helpful-thankyou');
        if (thankyou) { thankyou.hidden = false; thankyou.textContent = vote === 'yes' ? 'Glad it helped! Good luck with your NCA exams.' : 'Thanks for the feedback — we\'ll keep improving.'; }
      });
    });
  }

  /* ─── 9. SW UPDATE NOTIFICATION ────────────────────────────────────── */
  function initSWUpdateBanner() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      // A new SW has taken control — show refresh banner
      var banner = document.getElementById('nca-sw-update');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'nca-sw-update';
        banner.setAttribute('role', 'alert');
        banner.style.cssText = 'position:fixed;bottom:80px;right:20px;background:#C9A84C;color:#02020A;' +
          'padding:12px 18px;border-radius:8px;font-size:.78rem;font-weight:600;z-index:9999;' +
          'display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,.4);';
        banner.innerHTML = '<span>New content available</span>' +
          '<button onclick="window.location.reload()" style="background:#02020A;color:#C9A84C;border:none;' +
          'padding:5px 12px;border-radius:5px;cursor:pointer;font-size:.75rem;font-weight:600;">Refresh</button>' +
          '<button onclick="this.parentElement.remove()" aria-label="Dismiss" style="background:none;border:none;' +
          'color:#02020A;cursor:pointer;font-size:1.1rem;line-height:1;padding:0 4px;">\u00d7</button>';
        document.body.appendChild(banner);
      } else {
        banner.style.display = 'flex';
      }
    });
  }

  /* ─── 10. MAGNETIC BUTTON EFFECT ────────────────────────────────── */
  function initMagneticButtons() {
    if (REDUCED) return;
    if (typeof gsap === 'undefined') return;
    document.querySelectorAll('.cta-primary, .art-cta-btn, [data-magnetic]').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.25;
        gsap.to(btn, { x: x, y: y, duration: 0.4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', function() {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      });
    });
  }

  /* ─── 11. ANIMATED STAT COUNTERS ────────────────────────────────── */
  function initCounterAnimations() {
    if (REDUCED) return;
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-count-suffix') || '';
        var duration = 1500;
        var start = performance.now();
        function step(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { obs.observe(el); });
  }

  /* ─── INIT ──────────────────────────────────────────────────────────── */
  function init() {
    calcReadingTime();
    initProgressBar();
    initScrollAnimations();
    markCurrentArticleRead();
    personalizeRecommendations();
    highlightTargetSection();
    initGA4Tracking();
    initHelpfulWidget();
    initSWUpdateBanner();
    initMagneticButtons();
    initCounterAnimations();
    window.addEventListener('hashchange', highlightTargetSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
