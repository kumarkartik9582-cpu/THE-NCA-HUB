/**
 * NCA Hub AI Chat Widget — v2
 * World-class floating chat widget for thencahub.com
 * Features: smooth animations, markdown rendering, typing indicator,
 * session persistence, scroll fix, copy button, mobile fullscreen
 */
(function () {
  'use strict';

  /* ── Styles ── */
  var css = `
/* === FAB Button === */
#nca-chat-btn{position:fixed;bottom:24px;left:24px;width:56px;height:56px;border-radius:50%;background:#C9A84C;border:none;cursor:pointer;z-index:8900;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(201,168,76,.45);transition:transform .3s cubic-bezier(.34,1.56,.64,1),background .25s ease,box-shadow .3s ease;padding:0;}
#nca-chat-btn:hover{transform:scale(1.1);background:#e0be6a;box-shadow:0 6px 28px rgba(201,168,76,.6);}
#nca-chat-btn:active{transform:scale(.95);}
#nca-chat-btn svg{width:26px;height:26px;fill:#02020A;transition:transform .3s ease;}
#nca-chat-btn.nca-chat-open svg{transform:rotate(90deg) scale(.85);}
#nca-chat-btn .nca-notif{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:#ff4444;border-radius:50%;display:block;animation:nca-pulse 2s infinite;}
@keyframes nca-pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.3);opacity:.7;}}

/* === Chat Overlay === */
#nca-chat-overlay{position:fixed;bottom:92px;left:24px;width:380px;height:560px;max-height:calc(100vh - 120px);background:#0a0a0f;border:1px solid rgba(201,168,76,.2);border-radius:16px;z-index:8900;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.7),0 0 0 1px rgba(201,168,76,.08) inset;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden;opacity:0;transform:translateY(16px) scale(.96);pointer-events:none;transition:opacity .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1);}
#nca-chat-overlay.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}

/* Mobile fullscreen */
@media(max-width:500px){
  #nca-chat-overlay{left:0;right:0;bottom:0;top:0;width:100%;height:100%;max-height:100vh;border-radius:0;border:none;}
  #nca-chat-btn{bottom:16px;left:16px;width:52px;height:52px;}
}
@media(min-width:501px) and (max-width:800px){
  #nca-chat-overlay{left:12px;right:12px;width:auto;bottom:84px;}
}

/* === Header === */
.nca-chat-head{background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.04));border-bottom:1px solid rgba(201,168,76,.12);padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.nca-chat-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#e0be6a);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#02020A;box-shadow:0 2px 8px rgba(201,168,76,.3);}
.nca-chat-info{flex:1;min-width:0;}
.nca-chat-name{font-size:.78rem;font-weight:600;color:#f0e6cc;letter-spacing:.06em;text-transform:uppercase;}
.nca-chat-status{font-size:.66rem;color:rgba(201,168,76,.7);display:flex;align-items:center;gap:5px;margin-top:1px;}
.nca-chat-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;animation:nca-dot-pulse 2s infinite;}
@keyframes nca-dot-pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
#nca-chat-close{background:none;border:none;color:rgba(201,168,76,.5);font-size:1.2rem;cursor:pointer;padding:6px;line-height:1;transition:color .2s,transform .2s;border-radius:6px;}
#nca-chat-close:hover{color:#C9A84C;transform:scale(1.1);background:rgba(201,168,76,.08);}

/* === Messages Area === */
.nca-chat-msgs{flex:1;overflow-y:auto;overflow-x:hidden;padding:16px 14px 8px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;min-height:0;}
.nca-chat-msgs::-webkit-scrollbar{width:5px;}
.nca-chat-msgs::-webkit-scrollbar-track{background:transparent;}
.nca-chat-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.15);border-radius:3px;}
.nca-chat-msgs::-webkit-scrollbar-thumb:hover{background:rgba(201,168,76,.3);}

/* === Message Bubbles === */
.nca-msg{max-width:85%;line-height:1.6;font-size:.8rem;padding:10px 14px;border-radius:14px;word-break:break-word;opacity:0;transform:translateY(8px);animation:nca-msg-in .3s cubic-bezier(.4,0,.2,1) forwards;position:relative;}
@keyframes nca-msg-in{to{opacity:1;transform:translateY(0);}}
.nca-msg.bot{background:rgba(255,255,255,.06);color:#d8d0c4;border-bottom-left-radius:4px;align-self:flex-start;border:1px solid rgba(255,255,255,.04);}
.nca-msg.user{background:linear-gradient(135deg,#C9A84C,#d4b35e);color:#02020A;border-bottom-right-radius:4px;align-self:flex-end;font-weight:500;box-shadow:0 2px 8px rgba(201,168,76,.2);}

/* Bot message markdown */
.nca-msg.bot p{margin:0 0 8px;}
.nca-msg.bot p:last-child{margin-bottom:0;}
.nca-msg.bot strong{color:#f0e6cc;font-weight:600;}
.nca-msg.bot a{color:#C9A84C;text-decoration:underline;text-decoration-color:rgba(201,168,76,.3);text-underline-offset:2px;transition:text-decoration-color .2s;}
.nca-msg.bot a:hover{text-decoration-color:#C9A84C;}
.nca-msg.bot ul,.nca-msg.bot ol{margin:6px 0;padding-left:18px;}
.nca-msg.bot li{margin-bottom:3px;}
.nca-msg.bot code{background:rgba(201,168,76,.1);padding:1px 5px;border-radius:3px;font-size:.75rem;font-family:'SF Mono',Monaco,monospace;}

/* Message timestamp */
.nca-msg-time{font-size:.58rem;color:rgba(255,255,255,.15);margin-top:4px;text-align:right;}
.nca-msg.bot .nca-msg-time{text-align:left;}

/* Copy button on bot messages */
.nca-msg-copy{position:absolute;top:6px;right:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.3);font-size:.6rem;padding:3px 6px;border-radius:4px;cursor:pointer;opacity:0;transition:opacity .2s,color .2s,background .2s;font-family:inherit;line-height:1;}
.nca-msg.bot:hover .nca-msg-copy{opacity:1;}
.nca-msg-copy:hover{color:#C9A84C;background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.2);}
.nca-msg-copy.copied{color:#4ade80;border-color:rgba(74,222,128,.2);}

/* === Typing Indicator === */
.nca-typing{display:flex;align-items:center;gap:4px;padding:10px 14px;align-self:flex-start;opacity:0;animation:nca-msg-in .3s cubic-bezier(.4,0,.2,1) forwards;}
.nca-typing-dot{width:6px;height:6px;border-radius:50%;background:rgba(201,168,76,.5);animation:nca-typing-bounce .6s infinite alternate;}
.nca-typing-dot:nth-child(2){animation-delay:.15s;}
.nca-typing-dot:nth-child(3){animation-delay:.3s;}
@keyframes nca-typing-bounce{from{transform:translateY(0);opacity:.4;}to{transform:translateY(-4px);opacity:1;}}

/* === Welcome Animation === */
.nca-welcome{text-align:center;padding:8px 0 4px;opacity:0;animation:nca-welcome-in .6s .2s cubic-bezier(.4,0,.2,1) forwards;}
@keyframes nca-welcome-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
.nca-welcome-icon{font-size:1.8rem;margin-bottom:6px;display:block;animation:nca-wave 1.5s .6s ease-in-out forwards;transform-origin:70% 70%;}
@keyframes nca-wave{0%{transform:rotate(0);}15%{transform:rotate(14deg);}30%{transform:rotate(-8deg);}40%{transform:rotate(14deg);}50%{transform:rotate(-4deg);}60%{transform:rotate(10deg);}70%{transform:rotate(0);}100%{transform:rotate(0);}}
.nca-welcome-title{font-size:.82rem;font-weight:600;color:#f0e6cc;margin-bottom:4px;}
.nca-welcome-sub{font-size:.72rem;color:rgba(255,255,255,.35);line-height:1.5;}

/* === Quick Actions / Chips === */
.nca-chips{padding:4px 14px 10px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;}
.nca-chip{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.2);color:rgba(201,168,76,.75);font-size:.68rem;padding:6px 12px;border-radius:20px;cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);white-space:nowrap;letter-spacing:.02em;font-family:inherit;}
.nca-chip:hover{background:rgba(201,168,76,.12);border-color:#C9A84C;color:#C9A84C;transform:translateY(-1px);box-shadow:0 2px 8px rgba(201,168,76,.15);}
.nca-chip:active{transform:translateY(0);}

/* === Input Area === */
.nca-chat-input-row{border-top:1px solid rgba(201,168,76,.1);padding:10px 12px;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:rgba(0,0,0,.2);}
#nca-chat-input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(201,168,76,.15);border-radius:12px;color:#f0e6cc;font-size:.8rem;padding:9px 14px;resize:none;min-height:38px;max-height:96px;outline:none;font-family:inherit;line-height:1.4;transition:border-color .25s,box-shadow .25s;}
#nca-chat-input:focus{border-color:rgba(201,168,76,.4);box-shadow:0 0 0 3px rgba(201,168,76,.06);}
#nca-chat-input::placeholder{color:rgba(240,230,204,.25);}
#nca-chat-send{width:36px;height:36px;border-radius:10px;background:rgba(201,168,76,.2);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .25s cubic-bezier(.4,0,.2,1);padding:0;}
#nca-chat-send.active{background:#C9A84C;box-shadow:0 2px 10px rgba(201,168,76,.3);}
#nca-chat-send.active:hover{background:#e0be6a;transform:scale(1.05);}
#nca-chat-send:disabled{background:rgba(201,168,76,.1);cursor:not-allowed;}
#nca-chat-send svg{width:16px;height:16px;fill:rgba(201,168,76,.4);transition:fill .25s;}
#nca-chat-send.active svg{fill:#02020A;}

/* === Footer === */
.nca-chat-footer{text-align:center;padding:5px 0 7px;font-size:.58rem;color:rgba(255,255,255,.12);flex-shrink:0;letter-spacing:.03em;}

/* === Reduced Motion === */
@media(prefers-reduced-motion:reduce){
  .nca-msg{animation:none!important;opacity:1;transform:none;}
  .nca-typing-dot{animation:none!important;opacity:.6;}
  .nca-welcome{animation:none!important;opacity:1;transform:none;}
  .nca-welcome-icon{animation:none!important;}
  #nca-chat-overlay{transition:opacity .15s!important;transform:none!important;}
  #nca-chat-overlay.open{transform:none!important;}
  #nca-chat-btn .nca-notif{animation:none!important;}
  .nca-chat-dot{animation:none!important;}
}
`;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── HTML ── */
  var html = `
<button id="nca-chat-btn" aria-label="Ask the NCA AI assistant" title="Ask the NCA AI assistant">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.1-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 15H7v-2h6v2zm2-4H7v-2h8v2zm0-4H7V7h8v2z"/></svg>
  <span class="nca-notif" id="nca-notif" aria-hidden="true"></span>
</button>
<div id="nca-chat-overlay" role="dialog" aria-modal="true" aria-label="NCA AI Assistant">
  <div class="nca-chat-head">
    <div class="nca-chat-avatar">N</div>
    <div class="nca-chat-info">
      <div class="nca-chat-name">NCA AI Assistant</div>
      <div class="nca-chat-status"><span class="nca-chat-dot"></span> Online now</div>
    </div>
    <button id="nca-chat-close" aria-label="Close chat">&#x2715;</button>
  </div>
  <div class="nca-chat-msgs" id="nca-chat-msgs"></div>
  <div class="nca-chips" id="nca-chips"></div>
  <div class="nca-chat-input-row">
    <textarea id="nca-chat-input" placeholder="Ask about NCA exams..." rows="1" aria-label="Your message"></textarea>
    <button id="nca-chat-send" aria-label="Send message" disabled>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </button>
  </div>
  <div class="nca-chat-footer">AI-powered &middot; Not official NCA advice</div>
</div>`;

  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  /* ── State ── */
  var SESSION_KEY = 'nca_chat_history';
  var SESSION_TS_KEY = 'nca_chat_opened_at';
  var messages = [];
  var isLoading = false;
  var hasOpened = false;
  var isSending = false;
  var messageQueue = [];
  var _lastFocusedBeforeOpen = null; // Fix 1: store element to return focus to on close

  /* ── Rate limiter state ── */
  var rateLimitWindow = 30000; // 30 seconds
  var rateLimitMax = 5;
  var rateLimitTimestamps = [];

  /* ── Inactivity timer ── */
  var inactivityTimeout = null;
  var INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

  var btn = document.getElementById('nca-chat-btn');
  var overlay = document.getElementById('nca-chat-overlay');
  var closeBtn = document.getElementById('nca-chat-close');
  var msgsEl = document.getElementById('nca-chat-msgs');
  var input = document.getElementById('nca-chat-input');
  var sendBtn = document.getElementById('nca-chat-send');
  var chipsEl = document.getElementById('nca-chips');
  var notif = document.getElementById('nca-notif');

  var SUGGESTIONS = [
    'How many NCA exams do I need?',
    'What is the NCA exam format?',
    'How long to prepare for one subject?',
    'What happens after passing NCA?',
    'NCA fees \u2014 how much does it cost?'
  ];

  /* ── Session Persistence ── */
  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch (_e) { /* quota exceeded or private mode */ }
  }

  function loadSession() {
    try {
      /* Fix 15: Clear session if the opened-at timestamp is over 60 minutes old */
      var tsRaw = sessionStorage.getItem(SESSION_TS_KEY);
      if (tsRaw) {
        var ts = parseInt(tsRaw, 10);
        if (!isNaN(ts) && (Date.now() - ts) > 60 * 60 * 1000) {
          sessionStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(SESSION_TS_KEY);
          return null;
        }
      }
      var saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_e) { /* corrupt data */ }
    return null;
  }

  /* ── Simple Markdown Renderer ── */
  function renderMarkdown(text) {
    if (!text) return '';
    var html = text
      // Fix 14: Handle escaped asterisks and underscores (replace with placeholders)
      .replace(/\\\*/g, '\x00ESCSTAR\x00')
      .replace(/\\_/g, '\x00ESCUND\x00')
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Fix 14: Horizontal rules
      .replace(/\n---\n/g, '\n<hr>\n')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(m, text, url) {
        var safe = /^https?:\/\//.test(url.trim()) ? url.trim() : '#';
        return '<a href="' + safe + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
      })
      // Unordered lists (- item)
      .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
      // Numbered lists (1. item)
      .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      // Paragraphs (double newline)
      .replace(/\n\n/g, '</p><p>')
      // Single newlines to <br>
      .replace(/\n/g, '<br>')
      // Fix 14: Restore escaped asterisks and underscores
      .replace(/\x00ESCSTAR\x00/g, '*')
      .replace(/\x00ESCUND\x00/g, '_');

    return '<p>' + html + '</p>';
  }

  /* ── Time Formatting ── */
  function timeStamp() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  /* ── Add Message ── */
  function addMsg(role, text, opts) {
    opts = opts || {};
    var div = document.createElement('div');
    div.className = 'nca-msg ' + role;

    if (role === 'bot' && !opts.plain) {
      div.innerHTML = renderMarkdown(text);

      // Copy button
      var copyBtn = document.createElement('button');
      copyBtn.className = 'nca-msg-copy';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy message');
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 1500);
        }).catch(function (err) { console.warn('Clipboard unavailable', err); }); // Fix 7
      });
      div.appendChild(copyBtn);
    } else {
      div.textContent = text;
    }

    // Timestamp
    if (!opts.noTime) {
      var timeEl = document.createElement('div');
      timeEl.className = 'nca-msg-time';
      timeEl.textContent = opts.time || timeStamp();
      div.appendChild(timeEl);
    }

    msgsEl.appendChild(div);
    requestAnimationFrame(function () {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    });
    return div;
  }

  /* ── Typing Indicator ── */
  function showTyping() {
    var div = document.createElement('div');
    div.className = 'nca-typing';
    div.innerHTML = '<span class="nca-typing-dot"></span><span class="nca-typing-dot"></span><span class="nca-typing-dot"></span>';
    div.setAttribute('aria-label', 'Assistant is typing');
    msgsEl.appendChild(div);
    requestAnimationFrame(function () {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    });
    return div;
  }

  /* ── Welcome Screen ── */
  function showWelcome() {
    var wel = document.createElement('div');
    wel.className = 'nca-welcome';
    wel.innerHTML = '<span class="nca-welcome-icon" aria-hidden="true">\u{1F44B}</span>' +
      '<div class="nca-welcome-title">Hi! I\u2019m the NCA Hub AI assistant.</div>' +
      '<div class="nca-welcome-sub">I can help with NCA exam subjects, study strategies, fees, timelines, and provincial requirements.</div>';
    msgsEl.appendChild(wel);
  }

  /* Fix 3: Helper to create a keyboard-accessible chip button */
  function makeChip(q) {
    var chip = document.createElement('button');
    chip.className = 'nca-chip';
    chip.textContent = q;
    chip.setAttribute('tabindex', '0');
    chip.addEventListener('click', function () { sendMessage(q); });
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sendMessage(q);
      }
    });
    return chip;
  }

  function showChips() {
    chipsEl.innerHTML = '';
    if (messages.length > 0) return;
    SUGGESTIONS.forEach(function (q) {
      chipsEl.appendChild(makeChip(q));
    });
  }

  /* ── Restore Session ── */
  function restoreSession() {
    var saved = loadSession();
    if (saved && saved.length > 0) {
      messages = saved;
      hasOpened = true;
      saved.forEach(function (m) {
        addMsg(m.role === 'assistant' ? 'bot' : 'user', m.content, { noTime: true });
      });
    }
  }

  /* Fix 6: Inactivity timer — clear chat after 30 minutes of no user message */
  function resetInactivityTimer() {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(function () {
      messages = [];
      saveSession();
      msgsEl.innerHTML = '';
      chipsEl.innerHTML = '';
      hasOpened = false;
      addMsg('bot', 'Session cleared after 30 minutes of inactivity.', { plain: true });
    }, INACTIVITY_MS);
  }

  /* Fix 2: Focus trap — cycle focus through focusable elements inside the dialog */
  function trapFocus(e) {
    if (!overlay.classList.contains('open')) return;
    var focusable = Array.prototype.slice.call(
      overlay.querySelectorAll('button:not([disabled]), [tabindex="0"], textarea:not([disabled]), input:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  /* ── Open / Close ── */
  function openChat() {
    // Fix 1: store element that had focus before opening so we can restore it on close
    _lastFocusedBeforeOpen = document.activeElement;
    overlay.classList.add('open'); // Fix 10: use only class check — removed isOpen variable
    overlay.setAttribute('aria-hidden', 'false');
    btn.classList.add('nca-chat-open');
    btn.setAttribute('aria-expanded', 'true');
    if (notif) notif.style.display = 'none';
    if (!hasOpened) {
      hasOpened = true;
      // Fix 15: record first-open timestamp for 60-min sessionStorage expiry check
      try { sessionStorage.setItem(SESSION_TS_KEY, String(Date.now())); } catch (_e) {}
      showWelcome();
      showChips();
    }
    // Fix 1: move focus to close button (or input) when overlay opens
    setTimeout(function () { closeBtn.focus(); }, 150);
    // Fix 2: attach focus trap listener
    overlay.addEventListener('keydown', trapFocus);
    // Fix 6: start inactivity timer
    resetInactivityTimer();
  }

  function closeChat() {
    overlay.classList.remove('open'); // Fix 10: use only class check — removed isOpen variable
    overlay.setAttribute('aria-hidden', 'true');
    btn.classList.remove('nca-chat-open');
    btn.setAttribute('aria-expanded', 'false');
    // Fix 2: remove focus trap listener
    overlay.removeEventListener('keydown', trapFocus);
    // Fix 1: return focus to the element that opened the chat
    if (_lastFocusedBeforeOpen && typeof _lastFocusedBeforeOpen.focus === 'function') {
      _lastFocusedBeforeOpen.focus();
    }
    // Fix 6: clear inactivity timer when chat is closed
    if (inactivityTimeout) { clearTimeout(inactivityTimeout); inactivityTimeout = null; }
  }

  /* ── Update send button state ── */
  function updateSendBtn() {
    var hasText = input.value.trim().length > 0;
    sendBtn.disabled = !hasText || isLoading;
    if (hasText && !isLoading) {
      sendBtn.classList.add('active');
    } else {
      sendBtn.classList.remove('active');
    }
  }

  /* ── Build page context ── */
  function getPageContext() {
    var pageContent = '';
    var artBody = document.querySelector('.art-body, #art-body, .article-body, main article');
    if (artBody) {
      pageContent = artBody.innerText.replace(/\s+/g, ' ').trim().slice(0, 3500);
    }
    return {
      title: document.title.replace(' \u2014 The NCA Hub', '').trim(),
      path: window.location.pathname,
      content: pageContent || undefined
    };
  }

  /* ── Parse follow-up suggestions from bot reply ── */
  function parseFollowUps(text) {
    var lines = text.split('\n');
    var followUps = [];
    var bodyLines = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim().indexOf('>>>') === 0) {
        followUps.push(lines[i].trim().slice(3).trim());
      } else {
        bodyLines.push(lines[i]);
      }
    }
    // Trim trailing empty lines from body
    while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') {
      bodyLines.pop();
    }
    return { body: bodyLines.join('\n'), followUps: followUps };
  }

  /* ── Show follow-up suggestion chips ── */
  function showFollowUpChips(followUps) {
    chipsEl.innerHTML = '';
    if (!followUps || followUps.length === 0) return;
    followUps.forEach(function (q) {
      chipsEl.appendChild(makeChip(q)); // Fix 3: uses makeChip for keyboard support
    });
  }

  /* ── API Call (non-streaming) ── */
  async function callChatAPI(msgPayload) {
    /* Fix 8: wrap fetch with a 15-second Promise.race timeout */
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 15000);
    var timeoutPromise = new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error('API_TIMEOUT')); }, 15000);
    });
    var fetchPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgPayload, pageContext: getPageContext() }),
      signal: controller.signal
    });
    var res;
    try {
      res = await Promise.race([fetchPromise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }

    var data;
    try {
      data = await res.json();
    } catch (_) {
      if (res.status === 404) {
        data = { error: 'not_found' };
      } else {
        data = { error: 'unexpected_response', status: res.status };
      }
    }
    return { res: res, data: data };
  }

  /* ── Streaming API Call ── */
  async function callChatStreamAPI(msgPayload) {
    var res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgPayload, pageContext: getPageContext(), stream: true }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined
    });
    return res;
  }

  /* ── Add a streaming bot message (updates in-place) ── */
  function addStreamingMsg() {
    var div = document.createElement('div');
    div.className = 'nca-msg bot';
    div.innerHTML = '<p></p>';
    msgsEl.appendChild(div);
    requestAnimationFrame(function () {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    });
    return div;
  }

  /* ── Send Message (streaming with non-streaming fallback) ── */
  async function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text) return;

    // Fix 11: strip HTML tags from user input before processing
    text = text.replace(/<[^>]*>/g, '');
    if (!text) return;

    // Fix 9: if already sending, queue the message for after current completes
    if (isSending) {
      messageQueue.push(text);
      return;
    }

    // Fix 5: client-side rate limiting (max 5 messages per 30 seconds)
    var now = Date.now();
    rateLimitTimestamps = rateLimitTimestamps.filter(function (ts) { return now - ts < rateLimitWindow; });
    if (rateLimitTimestamps.length >= rateLimitMax) {
      addMsg('bot', 'Please slow down \u2014 you can send 5 messages per 30 seconds.', { plain: true });
      return;
    }
    rateLimitTimestamps.push(now);

    // Fix 6: reset inactivity timer on each user message
    if (overlay.classList.contains('open')) resetInactivityTimer();

    chipsEl.innerHTML = '';
    input.value = '';
    input.style.height = '';
    isLoading = true;
    isSending = true; // Fix 9
    updateSendBtn();

    addMsg('user', text);
    messages.push({ role: 'user', content: text });
    saveSession();

    // Fix 4: set aria-busy on messages container while bot is generating
    msgsEl.setAttribute('aria-busy', 'true');

    var typing = showTyping();

    try {
      /* Try streaming first */
      var res = await callChatStreamAPI(messages);

      if (res.ok && res.headers.get('Content-Type') && res.headers.get('Content-Type').indexOf('text/event-stream') !== -1) {
        /* ── Streaming response ── */
        typing.remove();
        var msgDiv = addStreamingMsg();
        var fullText = '';
        var reader = res.body.getReader();
        var decoder = new TextDecoder();

        while (true) {
          var chunk = await reader.read();
          if (chunk.done) break;
          var raw = decoder.decode(chunk.value, { stream: true });

          /* Parse SSE data lines from Workers AI */
          var sseLines = raw.split('\n');
          for (var i = 0; i < sseLines.length; i++) {
            var line = sseLines[i];
            if (line.indexOf('data: ') === 0) {
              var payload = line.slice(6).trim();
              if (payload === '[DONE]') continue;
              try {
                var parsed = JSON.parse(payload);
                var token = parsed.response || '';
                fullText += token;
              } catch (_) {
                /* Non-JSON SSE data — treat as raw text */
                fullText += payload;
              }
            }
          }

          /* Re-render with markdown */
          var result = parseFollowUps(fullText);
          msgDiv.innerHTML = renderMarkdown(result.body);
          requestAnimationFrame(function () {
            msgsEl.scrollTop = msgsEl.scrollHeight;
          });
        }

        /* Final render with copy button and timestamp */
        var final = parseFollowUps(fullText);
        msgDiv.innerHTML = renderMarkdown(final.body);

        var copyBtn = document.createElement('button');
        copyBtn.className = 'nca-msg-copy';
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('aria-label', 'Copy message');
        copyBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(final.body).then(function () {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function () {
              copyBtn.textContent = 'Copy';
              copyBtn.classList.remove('copied');
            }, 1500);
          }).catch(function (err) { console.warn('Clipboard unavailable', err); }); // Fix 7
        });
        msgDiv.appendChild(copyBtn);

        var timeEl = document.createElement('div');
        timeEl.className = 'nca-msg-time';
        timeEl.textContent = timeStamp();
        msgDiv.appendChild(timeEl);

        messages.push({ role: 'assistant', content: fullText });
        saveSession();

        /* Show follow-up chips */
        if (final.followUps.length > 0) {
          showFollowUpChips(final.followUps);
        }

      } else {
        /* ── Non-streaming fallback with exponential backoff retry (Fix 13) ── */
        var data;
        try {
          data = await res.json();
        } catch (_) {
          data = res.status === 404 ? { error: 'not_found' } : { error: 'unexpected_response', status: res.status };
        }

        /* Fix 13: exponential backoff — up to 3 total attempts, delays: 1s, 2s, 4s */
        var retryDelays = [1000, 2000, 4000];
        var attempt = 0;
        while (!data.reply && (data.retryable || res.status === 502 || res.status === 503 || res.status === 529) && attempt < retryDelays.length) {
          await new Promise(function (r) { setTimeout(r, retryDelays[attempt]); });
          attempt++;
          var retryResult = await callChatAPI(messages);
          res = retryResult.res;
          data = retryResult.data;
        }

        typing.remove();

        if (data.reply) {
          var parsedReply = parseFollowUps(data.reply);
          addMsg('bot', parsedReply.body);
          messages.push({ role: 'assistant', content: data.reply });
          saveSession();
          if (parsedReply.followUps.length > 0) {
            showFollowUpChips(parsedReply.followUps);
          }
        } else {
          var errText;
          var errStr = (data.error || '').toString().toLowerCase();
          if (data.error === 'not_found' || res.status === 404) {
            errText = 'The AI assistant isn\u2019t available yet. Browse our [FAQ](/faq/) or [articles](/blog/) for NCA info, or email thencahub@gmail.com.';
          } else if (errStr.indexOf('api key') !== -1 || errStr.indexOf('not configured') !== -1 || errStr.indexOf('authentication') !== -1) {
            errText = 'The AI assistant is being configured. Please try again in a moment.';
          } else if (res.status === 429) {
            errText = 'You\u2019ve sent a lot of messages! Please wait a minute before trying again.';
          } else if (res.status >= 500 || data.error === 'unexpected_response') {
            errText = 'The AI service is temporarily unavailable. Please try again in a moment.';
          } else if (data.error) {
            errText = data.error + ' Please try again.';
          } else {
            errText = 'Something went wrong. Please try again.';
          }
          addMsg('bot', errText);
          messages.pop();
        }
      }
    } catch (e) {
      typing.remove();
      var netMsg;
      // Fix 8: handle API_TIMEOUT from Promise.race as well as native TimeoutError
      if (e && (e.message === 'API_TIMEOUT' || e.name === 'TimeoutError' || e.name === 'AbortError')) {
        netMsg = 'Request timed out \u2014 please try again.';
      } else {
        netMsg = 'Unable to reach the AI assistant. Please check your internet connection.';
      }
      addMsg('bot', netMsg);
      messages.pop();
    }

    // Fix 4: remove aria-busy when bot is done generating
    msgsEl.removeAttribute('aria-busy');
    isLoading = false;
    isSending = false; // Fix 9
    updateSendBtn();

    // Fix 9: process queued message if any
    if (messageQueue.length > 0) {
      var nextMsg = messageQueue.shift();
      sendMessage(nextMsg);
    }
  }

  /* ── Event Listeners ── */
  btn.addEventListener('click', function () {
    // Fix 10: use only class check — no isOpen variable
    overlay.classList.contains('open') ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  input.addEventListener('input', function () {
    updateSendBtn();
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 96) + 'px';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', function () {
    sendMessage();
  });

  document.addEventListener('keydown', function (e) {
    // Fix 10: use only class check — no isOpen variable
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeChat();
  });

  /* ── Restore previous session on load ── */
  restoreSession();

  /* Show notification pulse after 8s if not opened */
  setTimeout(function () {
    if (!hasOpened && notif) {
      notif.style.display = 'block';
    }
  }, 8000);

})();
