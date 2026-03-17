/**
 * NCA Hub AI Chat Widget
 * Self-contained floating chat widget for thencahub.com
 * Calls /api/chat (Cloudflare Pages Function) which proxies to Claude API
 */
(function () {
  'use strict';

  /* ── Styles ── */
  var css = `
#nca-chat-btn{position:fixed;bottom:24px;left:24px;width:56px;height:56px;border-radius:50%;background:#C9A84C;border:none;cursor:pointer;z-index:8900;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(201,168,76,.45);transition:transform .25s ease,background .25s ease;padding:0;}
#nca-chat-btn:hover{transform:scale(1.08);background:#e0be6a;}
#nca-chat-btn svg{width:26px;height:26px;fill:#02020A;}
#nca-chat-btn .nca-notif{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:#ff4444;border-radius:50%;display:block;}
#nca-chat-overlay{position:fixed;bottom:92px;left:24px;width:340px;max-height:520px;background:#02020A;border:1px solid rgba(201,168,76,.25);border-radius:16px;z-index:8900;display:none;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;}
#nca-chat-overlay.open{display:flex;}
@media(max-width:400px){#nca-chat-overlay{left:12px;right:12px;width:auto;bottom:84px;}}
.nca-chat-head{background:rgba(201,168,76,.1);border-bottom:1px solid rgba(201,168,76,.15);padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.nca-chat-avatar{width:34px;height:34px;border-radius:50%;background:#C9A84C;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;color:#02020A;}
.nca-chat-info{flex:1;min-width:0;}
.nca-chat-name{font-size:.78rem;font-weight:600;color:#f0e6cc;letter-spacing:.06em;text-transform:uppercase;}
.nca-chat-status{font-size:.68rem;color:#C9A84C;display:flex;align-items:center;gap:4px;}
.nca-chat-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;}
#nca-chat-close{background:none;border:none;color:rgba(201,168,76,.6);font-size:1.1rem;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
#nca-chat-close:hover{color:#C9A84C;}
.nca-chat-msgs{flex:1;overflow-y:auto;padding:14px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
.nca-chat-msgs::-webkit-scrollbar{width:4px;}
.nca-chat-msgs::-webkit-scrollbar-track{background:transparent;}
.nca-chat-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.2);border-radius:2px;}
.nca-msg{max-width:88%;line-height:1.5;font-size:.8rem;padding:9px 12px;border-radius:12px;word-break:break-word;white-space:pre-wrap;}
.nca-msg.bot{background:rgba(255,255,255,.07);color:#d8d0c4;border-bottom-left-radius:4px;align-self:flex-start;}
.nca-msg.user{background:#C9A84C;color:#02020A;border-bottom-right-radius:4px;align-self:flex-end;font-weight:500;}
.nca-msg.typing{color:rgba(201,168,76,.6);font-style:italic;background:rgba(255,255,255,.04);}
.nca-chips{padding:0 14px 10px;display:flex;flex-wrap:wrap;gap:6px;}
.nca-chip{background:transparent;border:1px solid rgba(201,168,76,.3);color:rgba(201,168,76,.8);font-size:.68rem;padding:5px 10px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;letter-spacing:.04em;}
.nca-chip:hover{background:rgba(201,168,76,.12);border-color:#C9A84C;color:#C9A84C;}
.nca-chat-input-row{border-top:1px solid rgba(201,168,76,.12);padding:10px 12px;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;}
#nca-chat-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.2);border-radius:10px;color:#f0e6cc;font-size:.8rem;padding:8px 12px;resize:none;min-height:36px;max-height:96px;outline:none;font-family:inherit;line-height:1.4;transition:border-color .2s;}
#nca-chat-input:focus{border-color:rgba(201,168,76,.5);}
#nca-chat-input::placeholder{color:rgba(240,230,204,.3);}
#nca-chat-send{width:34px;height:34px;border-radius:8px;background:#C9A84C;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s;padding:0;}
#nca-chat-send:hover{background:#e0be6a;}
#nca-chat-send:disabled{background:rgba(201,168,76,.25);cursor:not-allowed;}
#nca-chat-send svg{width:16px;height:16px;fill:#02020A;}
.nca-chat-footer{text-align:center;padding:6px 0 8px;font-size:.6rem;color:rgba(255,255,255,.18);}
`;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── HTML ── */
  var html = `
<button id="nca-chat-btn" aria-label="Ask the NCA AI assistant" title="Ask the NCA AI assistant">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.1-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 15H7v-2h6v2zm2-4H7v-2h8v2zm0-4H7V7h8v2z"/></svg>
  <span class="nca-notif" id="nca-notif" aria-hidden="true"></span>
</button>
<div id="nca-chat-overlay" role="dialog" aria-modal="true" aria-label="NCA AI Assistant">
  <div class="nca-chat-head">
    <div class="nca-chat-avatar">N</div>
    <div class="nca-chat-info">
      <div class="nca-chat-name">NCA AI Assistant</div>
      <div class="nca-chat-status">Online now</div>
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
  <div class="nca-chat-footer">Powered by Claude AI &middot; Not official NCA advice</div>
</div>`;

  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  /* ── State ── */
  var messages = [];
  var isOpen = false;
  var isLoading = false;
  var hasOpened = false;

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
    'NCA fees — how much does it cost?'
  ];

  function addMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'nca-msg ' + role;
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = addMsg('bot typing', 'Thinking\u2026');
    return div;
  }

  function showChips() {
    chipsEl.innerHTML = '';
    if (messages.length > 0) return;
    SUGGESTIONS.forEach(function (q) {
      var chip = document.createElement('button');
      chip.className = 'nca-chip';
      chip.textContent = q;
      chip.addEventListener('click', function () {
        sendMessage(q);
      });
      chipsEl.appendChild(chip);
    });
  }

  function openChat() {
    isOpen = true;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    if (notif) notif.style.display = 'none';
    if (!hasOpened) {
      hasOpened = true;
      addMsg('bot', 'Hi! I\u2019m the NCA Hub AI assistant.\n\nI can help with NCA exam subjects, the application process, study strategies, and provincial requirements.\n\nWhat would you like to know?');
      showChips();
    }
    setTimeout(function () { input.focus(); }, 100);
  }

  function closeChat() {
    isOpen = false;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  async function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || isLoading) return;

    chipsEl.innerHTML = '';
    input.value = '';
    input.style.height = '';
    sendBtn.disabled = true;
    isLoading = true;

    addMsg('user', text);
    messages.push({ role: 'user', content: text });

    var typing = showTyping();

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages })
      });
      var data = await res.json();
      typing.remove();

      if (data.reply) {
        addMsg('bot', data.reply);
        messages.push({ role: 'assistant', content: data.reply });
      } else {
        addMsg('bot', 'Sorry, something went wrong. Please try again.');
        messages.pop();
      }
    } catch (e) {
      typing.remove();
      addMsg('bot', 'Could not connect to the AI assistant. Please check your connection and try again.');
      messages.pop();
    }

    isLoading = false;
    if (input.value.trim()) sendBtn.disabled = false;
  }

  /* ── Event listeners ── */
  btn.addEventListener('click', function () {
    isOpen ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  input.addEventListener('input', function () {
    sendBtn.disabled = !this.value.trim() || isLoading;
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
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  /* Show notification pulse after 8s if not opened */
  setTimeout(function () {
    if (!hasOpened && notif) {
      notif.style.display = 'block';
    }
  }, 8000);

})();
