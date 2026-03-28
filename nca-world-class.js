/**
 * NCA Hub — World-Class Animation Layer v1.0
 * Awwwards-level features layered on top of the existing GSAP + Lenis system.
 *
 * Features:
 *  1. ambient-cv  — slow atmospheric floating orbs
 *  2. trail-cv    — sparkle / star-burst cursor trail
 *  3. Sound system — Web Audio API synthesis (opt-in toggle)
 *  4. Button ripple — gold ripple on every CTA click
 *  5. Ambient cursor light — radial glow tracks the mouse across the page
 *  6. Scroll parallax — decorative lines and orbs move at different speeds
 *  7. GSAP horizontal drag-scroll enhancement on #HT subject cards
 *  8. Scroll-triggered clip-reveal + draw-line entrance animations
 *  9. Cursor context labels on more elements (data-cur)
 * 10. Smooth counter odometer for stat numbers
 */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth <= 768;

  /* ═══════════════════════════════════════════════════════════
     1. AMBIENT-CV — Atmospheric floating orbs
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (REDUCED) return;
    var cv = document.getElementById('ambient-cv');
    if (!cv) return;
    var cx = cv.getContext('2d');

    function rz() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    }
    rz();
    window.addEventListener('resize', rz, { passive: true });

    var orbs = [];
    for (var i = 0; i < 6; i++) {
      orbs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 180 + Math.random() * 220,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.025 + 0.008,
        ph: Math.random() * Math.PI * 2,
        phs: 0.004 + Math.random() * 0.003
      });
    }

    function drawAmbient() {
      cx.clearRect(0, 0, cv.width, cv.height);
      orbs.forEach(function (o) {
        o.ph += o.phs;
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = cv.width + o.r;
        if (o.x > cv.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = cv.height + o.r;
        if (o.y > cv.height + o.r) o.y = -o.r;
        var a = o.a * (0.6 + 0.4 * Math.sin(o.ph));
        var g = cx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, 'rgba(201,168,76,' + a + ')');
        g.addColorStop(0.5, 'rgba(201,168,76,' + (a * 0.3) + ')');
        g.addColorStop(1, 'rgba(201,168,76,0)');
        cx.beginPath();
        cx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        cx.fillStyle = g;
        cx.fill();
      });
      requestAnimationFrame(drawAmbient);
    }
    drawAmbient();
  })();

  /* ═══════════════════════════════════════════════════════════
     2. TRAIL-CV — Sparkle / star-burst cursor trail
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (IS_MOBILE || REDUCED) return;
    var cv = document.getElementById('trail-cv');
    if (!cv) return;
    var cx = cv.getContext('2d');

    function rz() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
    rz();
    window.addEventListener('resize', rz, { passive: true });

    var sparks = [];
    var mx = -999, my = -999;
    var lastX = mx, lastY = my;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      var speed = Math.hypot(mx - lastX, my - lastY);
      if (speed > 3) {
        var count = Math.min(Math.floor(speed / 5), 4);
        for (var i = 0; i < count; i++) {
          var angle = Math.random() * Math.PI * 2;
          var v = 0.4 + Math.random() * 1.2;
          sparks.push({
            x: mx, y: my,
            vx: Math.cos(angle) * v,
            vy: Math.sin(angle) * v - 0.5,
            life: 1,
            decay: 0.025 + Math.random() * 0.03,
            size: 1 + Math.random() * 2.5,
            gold: Math.random() > 0.4
          });
        }
      }
      lastX = mx; lastY = my;
    }, { passive: true });

    function drawTrail() {
      cx.clearRect(0, 0, cv.width, cv.height);
      sparks = sparks.filter(function (s) { return s.life > 0; });
      sparks.forEach(function (s) {
        s.x += s.vx; s.y += s.vy; s.vy += 0.04; s.life -= s.decay;
        var a = s.life * 0.7;
        cx.beginPath();
        cx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        if (s.gold) {
          cx.fillStyle = 'rgba(201,168,76,' + a + ')';
        } else {
          cx.fillStyle = 'rgba(240,216,120,' + (a * 0.5) + ')';
        }
        cx.fill();
        /* tiny star cross */
        if (s.size > 2 && s.life > 0.5) {
          cx.strokeStyle = 'rgba(240,216,120,' + (a * 0.3) + ')';
          cx.lineWidth = 0.5;
          cx.beginPath();
          cx.moveTo(s.x - s.size * 2, s.y);
          cx.lineTo(s.x + s.size * 2, s.y);
          cx.moveTo(s.x, s.y - s.size * 2);
          cx.lineTo(s.x, s.y + s.size * 2);
          cx.stroke();
        }
      });
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  })();

  /* ═══════════════════════════════════════════════════════════
     3. SOUND SYSTEM — Web Audio API synthesis (opt-in)
     ═══════════════════════════════════════════════════════════ */
  var SFX = (function () {
    var ctx = null, enabled = false;
    var PREF_KEY = 'nca_sfx';

    function getCtx() {
      if (!ctx) {
        try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      return ctx;
    }

    function tone(freq, type, dur, vol, delay) {
      if (!enabled) return;
      var ac = getCtx(); if (!ac) return;
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      var t = ac.currentTime + (delay || 0);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol || 0.04, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.05);
    }

    function hover() { tone(880, 'sine', 0.08, 0.015); }
    function click() {
      tone(440, 'triangle', 0.12, 0.04);
      tone(660, 'sine', 0.08, 0.02, 0.04);
    }
    function success() {
      tone(523, 'sine', 0.15, 0.04);
      tone(659, 'sine', 0.15, 0.04, 0.12);
      tone(784, 'sine', 0.3, 0.04, 0.24);
    }
    function soft() { tone(660, 'sine', 0.06, 0.01); }

    function init(on) {
      enabled = on;
      if (on) getCtx();
      try { localStorage.setItem(PREF_KEY, on ? '1' : '0'); } catch (e) {}
    }

    /* Restore preference */
    try {
      var saved = localStorage.getItem(PREF_KEY);
      if (saved === '1') init(true);
    } catch (e) {}

    /* Sound toggle button */
    function createToggle() {
      var btn = document.createElement('button');
      btn.id = 'sfx-toggle';
      btn.setAttribute('aria-label', enabled ? 'Disable sound effects' : 'Enable sound effects');
      btn.setAttribute('title', 'Toggle sound effects');
      btn.style.cssText = [
        'position:fixed', 'bottom:96px', 'left:24px', 'z-index:8800',
        'width:40px', 'height:40px', 'border-radius:50%',
        'background:rgba(201,168,76,' + (enabled ? '0.2' : '0.06') + ')',
        'border:1px solid rgba(201,168,76,' + (enabled ? '0.5' : '0.2') + ')',
        'color:rgba(201,168,76,' + (enabled ? '1' : '0.4') + ')',
        'font-size:1rem', 'cursor:pointer',
        'display:flex', 'align-items:center', 'justify-content:center',
        'transition:all .3s', 'padding:0'
      ].join(';');
      btn.innerHTML = enabled ? '🔊' : '🔇';
      btn.addEventListener('click', function () {
        enabled = !enabled;
        init(enabled);
        btn.innerHTML = enabled ? '🔊' : '🔇';
        btn.setAttribute('aria-label', enabled ? 'Disable sound effects' : 'Enable sound effects');
        btn.style.background = 'rgba(201,168,76,' + (enabled ? '0.2' : '0.06') + ')';
        btn.style.borderColor = 'rgba(201,168,76,' + (enabled ? '0.5' : '0.2') + ')';
        btn.style.color = 'rgba(201,168,76,' + (enabled ? '1' : '0.4') + ')';
        if (enabled) success();
      });
      document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createToggle);
    } else {
      createToggle();
    }

    return { hover: hover, click: click, success: success, soft: soft };
  })();

  /* ═══════════════════════════════════════════════════════════
     4. BUTTON RIPPLE — Gold ripple on CTA click
     ═══════════════════════════════════════════════════════════ */
  (function () {
    function addRipple(e) {
      var btn = e.currentTarget;
      var existing = btn.querySelector('.nca-ripple');
      if (existing) existing.remove();

      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height) * 2;
      var x = e.clientX - r.left - size / 2;
      var y = e.clientY - r.top - size / 2;

      var ripple = document.createElement('span');
      ripple.className = 'nca-ripple';
      ripple.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(201,168,76,0.25);pointer-events:none;transform:scale(0);animation:nca-ripple-anim 0.7s cubic-bezier(.4,0,.2,1) forwards;';
      btn.style.position = btn.style.position || 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
      SFX.click();
    }

    /* Inject ripple keyframes once */
    if (!document.getElementById('nca-ripple-style')) {
      var s = document.createElement('style');
      s.id = 'nca-ripple-style';
      s.textContent = '@keyframes nca-ripple-anim{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }

    function attachRipples() {
      document.querySelectorAll('.bp, .nc, .cta-primary, .art-cta-btn, [data-ripple]').forEach(function (btn) {
        if (!btn.dataset.rippleAttached) {
          btn.dataset.rippleAttached = '1';
          btn.addEventListener('click', addRipple);
        }
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachRipples);
    } else {
      attachRipples();
    }
    /* Re-attach on dynamic content */
    var ro = new MutationObserver(attachRipples);
    ro.observe(document.body, { childList: true, subtree: true });
  })();

  /* ═══════════════════════════════════════════════════════════
     5. AMBIENT CURSOR LIGHT — radial gradient follows mouse
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (IS_MOBILE || REDUCED) return;
    var mx = 50, my = 50, tx = 50, ty = 50;

    /* Inject the CSS custom-property-based spotlight */
    if (!document.getElementById('nca-spotlight-style')) {
      var s = document.createElement('style');
      s.id = 'nca-spotlight-style';
      s.textContent = [
        'body::after{',
        '  content:"";position:fixed;inset:0;pointer-events:none;z-index:0;',
        '  background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%),',
        '    rgba(201,168,76,0.04) 0%,transparent 60%);',
        '  transition:background 0.1s;',
        '}'
      ].join('');
      document.head.appendChild(s);
    }

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX / window.innerWidth * 100;
      ty = e.clientY / window.innerHeight * 100;
    }, { passive: true });

    (function lerp() {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      document.documentElement.style.setProperty('--mx', mx.toFixed(2) + '%');
      document.documentElement.style.setProperty('--my', my.toFixed(2) + '%');
      requestAnimationFrame(lerp);
    })();
  })();

  /* ═══════════════════════════════════════════════════════════
     6. SCROLL PARALLAX — Decorative .hvl lines and orbs
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (IS_MOBILE || REDUCED) return;
    var els = [];
    function collect() {
      els = [];
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        els.push({ el: el, speed: parseFloat(el.dataset.parallax) || 0.2 });
      });
      /* Fallback: auto-apply to known decorative elements */
      document.querySelectorAll('.hvl').forEach(function (el, i) {
        els.push({ el: el, speed: (i % 2 === 0 ? 0.12 : 0.18) });
      });
      document.querySelectorAll('.morph-orb, .porb, .porb2').forEach(function (el) {
        els.push({ el: el, speed: 0.08 });
      });
    }
    collect();

    var lastScroll = -1;
    function onScroll() {
      var sy = window.scrollY;
      if (Math.abs(sy - lastScroll) < 1) return;
      lastScroll = sy;
      els.forEach(function (item) {
        var y = sy * item.speed;
        item.el.style.transform = 'translateY(' + y + 'px)';
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ═══════════════════════════════════════════════════════════
     7. GSAP HORIZONTAL DRAG-SCROLL on #HT (subject cards)
     Adds momentum, snap-to-card, and progress indicator
     ═══════════════════════════════════════════════════════════ */
  (function () {
    var ht = document.getElementById('HT');
    if (!ht) return;

    /* Add progress bar */
    var bar = document.createElement('div');
    bar.style.cssText = 'height:1px;background:rgba(201,168,76,.1);margin-top:16px;position:relative;overflow:hidden;';
    var fill = document.createElement('div');
    fill.style.cssText = 'position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,var(--g2),var(--g1),var(--g0));width:0;transition:width .2s;';
    bar.appendChild(fill);
    ht.parentNode.insertBefore(bar, ht.nextSibling);

    /* Update progress on scroll */
    ht.addEventListener('scroll', function () {
      var max = ht.scrollWidth - ht.clientWidth;
      if (max <= 0) return;
      fill.style.width = (ht.scrollLeft / max * 100) + '%';
    }, { passive: true });

    /* Mouse drag momentum */
    var isDown = false, startX, scrollLeft, velX = 0, lastMoveX = 0, lastMoveT = 0, animId;

    ht.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - ht.offsetLeft;
      scrollLeft = ht.scrollLeft;
      velX = 0;
      cancelAnimationFrame(animId);
      ht.style.scrollBehavior = 'auto';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      var x = e.pageX - ht.offsetLeft;
      var dx = (x - startX) * 1.3;
      var now = Date.now();
      velX = (x - lastMoveX) / Math.max(now - lastMoveT, 1) * 16;
      lastMoveX = x; lastMoveT = now;
      ht.scrollLeft = scrollLeft - dx;
      SFX.soft();
    });

    document.addEventListener('mouseup', function () {
      if (!isDown) return;
      isDown = false;
      /* Momentum glide */
      (function glide() {
        velX *= 0.93;
        if (Math.abs(velX) < 0.5) return;
        ht.scrollLeft -= velX;
        animId = requestAnimationFrame(glide);
      })();
    });

    /* Hover sound on cards */
    ht.querySelectorAll('.sc2').forEach(function (card) {
      card.addEventListener('mouseenter', function () { SFX.hover(); });
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     8. SCROLL-TRIGGERED CLIP-REVEAL + DRAW-LINE
     Apply .clip-reveal and .draw-line to section elements
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (REDUCED) return;
    if (!('IntersectionObserver' in window)) return;

    /* Add draw-line under all .ey (eyebrow) labels */
    document.querySelectorAll('.ey').forEach(function (el) {
      if (el.querySelector('.draw-line')) return;
      var line = document.createElement('div');
      line.className = 'draw-line';
      el.parentNode.insertBefore(line, el.nextSibling);
    });

    /* Add clip-reveal to .sl (section lead) paragraphs */
    document.querySelectorAll('.sl').forEach(function (el) {
      if (!el.classList.contains('clip-reveal')) {
        el.classList.add('clip-reveal');
      }
    });

    /* Observer to trigger .on */
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.clip-reveal, .draw-line').forEach(function (el) {
      obs.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     9. CURSOR DATA-CUR on MORE elements
     Add data-cur to any unlabelled interactive elements
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (IS_MOBILE) return;
    var map = [
      ['a[href^="/notes/"]', 'Notes'],
      ['a[href^="/blog/"]', 'Read'],
      ['a[href^="/about"]', 'About'],
      ['a[href^="/contact"]', 'Contact'],
      ['a[href*="payhip"]', 'Buy'],
      ['.sc2', 'View'],
      ['.pod-card', 'Learn'],
      ['#sfx-toggle', 'Sound']
    ];
    map.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        if (!el.dataset.cur) el.dataset.cur = pair[1];
      });
    });

    /* Re-hook data-cur on dynamically added elements */
    var CR = document.getElementById('cr');
    var CD = document.getElementById('cd');
    var CL = document.getElementById('cl');
    if (!CR || !CD) return;

    document.querySelectorAll('[data-cur]').forEach(function (el) {
      if (el.dataset.curHooked) return;
      el.dataset.curHooked = '1';
      el.addEventListener('mouseenter', function () {
        if (CL) CL.textContent = el.dataset.cur;
        CR.classList.add('h'); CD.classList.add('h');
        SFX.hover();
      });
      el.addEventListener('mouseleave', function () {
        CR.classList.remove('h'); CD.classList.remove('h');
      });
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     10. SMOOTH COUNTER ODOMETER (enhancement of existing counters)
     Adds comma formatting and animated digit roll on .bsn counters
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (REDUCED) return;
    if (!('IntersectionObserver' in window)) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target') || el.getAttribute('data-count') || el.textContent, 10);
        if (isNaN(target)) return;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = performance.now();
        (function tick(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 4);
          var val = Math.round(eased * target);
          el.textContent = val.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.bsn, [data-count]').forEach(function (el) {
      obs.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     11. VIEW TRANSITIONS — Link intercept for enhanced cross-page feel
     Adds a gold sweep when navigating (Chrome 111+ View Transitions API)
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (!document.startViewTransition || REDUCED) return;

    /* Inject ::view-transition CSS if not present */
    if (!document.getElementById('nca-vt-style')) {
      var s = document.createElement('style');
      s.id = 'nca-vt-style';
      s.textContent = [
        '::view-transition-old(root){',
        '  animation:nca-vt-out 0.35s cubic-bezier(.4,0,.2,1) both;',
        '}',
        '::view-transition-new(root){',
        '  animation:nca-vt-in 0.35s cubic-bezier(.4,0,.2,1) both;',
        '}',
        '@keyframes nca-vt-out{',
        '  to{opacity:0;transform:translateY(-20px);}',
        '}',
        '@keyframes nca-vt-in{',
        '  from{opacity:0;transform:translateY(20px);}',
        '}'
      ].join('');
      document.head.appendChild(s);
    }

    /* Intercept same-origin link clicks */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var href = a.href;
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
      try {
        var url = new URL(href);
        if (url.origin !== location.origin) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        document.startViewTransition(function () {
          window.location.href = href;
        });
      } catch (err) {}
    }, { capture: true });
  })();

  /* ═══════════════════════════════════════════════════════════
     12. HOVER SOUND on nav links
     ═══════════════════════════════════════════════════════════ */
  (function () {
    document.querySelectorAll('nav a, .mob-link').forEach(function (el) {
      el.addEventListener('mouseenter', function () { SFX.hover(); });
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     13. GSAP SCROLL PIN on Philosophy section (cinematic pause)
     Uses existing GSAP + ScrollTrigger from index.html
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (REDUCED || IS_MOBILE) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    /* Animate morph orb scale on scroll */
    var orb = document.querySelector('.morph-orb');
    if (orb) {
      gsap.to(orb, {
        scale: 1.6,
        opacity: 0,
        scrollTrigger: {
          trigger: '#philosophy',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    /* Scrub-section rings fill on scroll */
    var scrubWrap = document.getElementById('scrub-section');
    if (scrubWrap) {
      document.querySelectorAll('.ring-fg').forEach(function (ring) {
        var pct = parseFloat(ring.closest('.ring-wrap').querySelector('.bsn').dataset.pct || 0.5);
        var circumference = 276.5;
        gsap.to(ring, {
          strokeDashoffset: circumference * (1 - pct),
          scrollTrigger: {
            trigger: scrubWrap,
            start: 'top 70%',
            end: 'center center',
            scrub: 1.2
          },
          ease: 'none'
        });
      });
    }

    /* Stagger the tool cards on enter */
    var toolCards = document.querySelectorAll('#tools-grid > a');
    if (toolCards.length) {
      gsap.from(toolCards, {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#tools',
          start: 'top 75%',
          once: true
        }
      });
    }

    /* Blog article cards entrance */
    var blogCards = document.querySelectorAll('#blog .art-card, #blog .lg-art, #blog .art-grid-item');
    if (blogCards.length) {
      gsap.from(blogCards, {
        y: 50, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#blog',
          start: 'top 75%',
          once: true
        }
      });
    }

    /* Country guide cards */
    var countryCards = document.querySelectorAll('#country-guides .cg-card, #country-guides .cg-item');
    if (countryCards.length) {
      gsap.from(countryCards, {
        scale: 0.95, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '#country-guides',
          start: 'top 75%',
          once: true
        }
      });
    }
  })();

  /* ═══════════════════════════════════════════════════════════
     14. CSS SCROLL-DRIVEN ANIMATIONS — Native Chrome 115+
     ═══════════════════════════════════════════════════════════ */
  (function () {
    if (!CSS.supports('animation-timeline', 'scroll()')) return;
    var s = document.createElement('style');
    s.id = 'nca-scroll-driven';
    s.textContent = [
      /* Shrink nav on scroll */
      '@keyframes nav-shrink{',
      '  from{padding-top:22px;padding-bottom:22px;}',
      '  to{padding-top:12px;padding-bottom:12px;}',
      '}',
      'nav{',
      '  animation:nav-shrink linear both;',
      '  animation-timeline:scroll();',
      '  animation-range:0px 200px;',
      '}',
      /* Progress glow pulse */
      '@keyframes prog-glow{',
      '  0%,100%{box-shadow:0 0 4px rgba(201,168,76,.3);}',
      '  50%{box-shadow:0 0 12px rgba(201,168,76,.7);}',
      '}',
      '#prog{animation:prog-glow 2s ease-in-out infinite;}'
    ].join('');
    document.head.appendChild(s);
  })();

})();
