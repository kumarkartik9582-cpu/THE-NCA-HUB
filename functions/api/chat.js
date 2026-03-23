/**
 * Cloudflare Pages Function: /api/chat
 * Uses Cloudflare Workers AI (free tier, no API key needed).
 *
 * SETUP: In Cloudflare Dashboard → Pages → your project → Settings →
 *        Functions → Bindings → Add → Workers AI → Variable name: AI
 *        Then redeploy.
 *
 * Runtime: Cloudflare Workers (V8 isolate) — no Node.js APIs.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

/* Handle CORS preflight */
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/* ── Simple in-process rate limiter (resets per worker cold start) ── */
const _rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 20;
  const entry = _rateLimitMap.get(ip) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  _rateLimitMap.set(ip, entry);
  if (_rateLimitMap.size > 5000) {
    for (const [k, v] of _rateLimitMap) { if (now > v.reset) _rateLimitMap.delete(k); }
  }
  return entry.count > maxRequests;
}

/* ── Model list (fallback order) ── */
const MODELS = [
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/mistralai/mistral-small-3.1-24b-instruct'
];

/* ── Llama Guard content safety filter ── */
const SAFETY_MODEL = '@cf/meta/llama-guard-3-8b';
const BLOCKED_CATEGORIES = [
  'S1',  // Violent Crimes
  'S2',  // Non-Violent Crimes
  'S3',  // Sex-Related Crimes
  'S4',  // Child Sexual Exploitation
  'S5',  // Defamation
  'S6',  // Specialized Advice (we provide NCA-specific, not general legal advice)
  'S7',  // Privacy
  'S8',  // Intellectual Property
  'S9',  // Indiscriminate Weapons
  'S10', // Hate
  'S11', // Suicide & Self-Harm
  'S12', // Sexual Content
  'S13'  // Elections
];

async function isContentUnsafe(ai, userMessage) {
  try {
    const result = await ai.run(SAFETY_MODEL, {
      messages: [{ role: 'user', content: userMessage }]
    });
    if (result && result.response) {
      const response = result.response.trim().toLowerCase();
      // Llama Guard returns "safe" or "unsafe\n<category>"
      if (response.startsWith('unsafe')) {
        console.log('CHATBOT GUARD: Blocked unsafe input:', response.split('\n')[1] || 'unknown category');
        return true;
      }
    }
    return false;
  } catch (err) {
    // If safety check fails, allow the message through (fail-open)
    // to avoid blocking legitimate users due to model errors
    console.error('CHATBOT GUARD: Safety check failed (allowing through):', err.message || String(err));
    return false;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  console.log('CHATBOT: Request received');

  /* ── Rate limit by IP ── */
  const ip = request.headers.get('CF-Connecting-IP') ||
             request.headers.get('X-Forwarded-For') || 'unknown';
  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'Too many requests. Please wait a minute before trying again.' }, 429);
  }

  /* ── Validate Workers AI binding ── */
  if (!env.AI) {
    console.error('CHATBOT FATAL: AI binding is not configured. Add a Workers AI binding named "AI" in Cloudflare Pages → Settings → Functions → Bindings.');
    return jsonResponse({ error: 'AI service not configured. The site administrator needs to add a Workers AI binding in Cloudflare Pages settings.' }, 500);
  }

  /* ── Parse request body ── */
  let body;
  try {
    body = await request.json();
  } catch (_e) {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const { messages, pageContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: 'No messages provided' }, 400);
  }

  /* ── Llama Guard safety check on latest user message ── */
  const latestUserMsg = messages[messages.length - 1];
  if (latestUserMsg && latestUserMsg.role === 'user' && latestUserMsg.content) {
    const unsafe = await isContentUnsafe(env.AI, latestUserMsg.content);
    if (unsafe) {
      return jsonResponse({
        reply: "I'm the NCA Hub AI assistant, here to help with NCA exam preparation and the Canadian legal qualification process. I can't help with that particular request, but I'm happy to answer questions about NCA subjects, study strategies, fees, timelines, or provincial requirements. What would you like to know?"
      });
    }
  }

  /* ── Build page-aware context ── */
  const pageContent = pageContext?.content ? pageContext.content.slice(0, 4000) : null;
  const pageTitle = pageContext?.title || null;
  const pagePath = pageContext?.path || null;

  let contextSection = '';
  if (pageContent) {
    contextSection = `\n\n## CURRENT PAGE CONTEXT\nThe user is reading: "${pageTitle}" (${pagePath})\n\nPage content (use as PRIMARY source):\n"""\n${pageContent}\n"""\nBase your answer on this content first. If the user's question relates to concepts on this page, build on them directly.`;
  } else if (pageTitle && pagePath && pagePath !== '/') {
    contextSection = `\n\n## CURRENT PAGE CONTEXT\nThe user is reading: "${pageTitle}" (${pagePath}). Tailor your response to this topic.`;
  }

  const systemPrompt = `You are the NCA Hub AI Advisor — a highly reliable, context-aware, decision-focused assistant for internationally trained lawyers preparing for NCA exams in Canada.

You are NOT a generic chatbot. You are an expert guide combining verified NCA knowledge, website context, and practical strategy.

## CORE OBJECTIVE
Help users:
- Understand the NCA process clearly and accurately
- Prepare efficiently for challenge exams
- Avoid costly mistakes (wrong study methods, wrong timelines, missed rules)
- Make confident, informed decisions about their qualification path

## VERIFIED FACTS (never contradict these)
- NCA run by Federation of Law Societies of Canada (FLSC) — official site: nca.legal
- Assessment fee: $400 CDN + applicable taxes (effective March 1, 2024)
- Exam fee: $500 CDN + applicable taxes per subject
- Assessment appeal fee: $285 + taxes; Exam appeal fee: $250 per exam + taxes
- Cancellation fee: $100 per exam + taxes (cancellation does NOT use an attempt)
- Maximum 3 attempts per subject (1 initial + 2 rewrites); 4th requires special application
- Exam format: 3 hours, open-book (printed notes only), essay/problem-question style
- Results take approximately 8–16 weeks after the exam session
- Passing mark: 50%
- 5 mandatory subjects: Administrative Law, Constitutional Law, Criminal Law, Professional Responsibility, Foundations of Canadian Law
- Elective subjects assigned based on individual degree assessment (e.g., Contracts, Torts, Property, Civil Procedure, Business Organisations)
- LRW (Legal Research & Writing) via CPLED is a separate mandatory requirement (~$375)
- After NCA Certificate of Qualification: Ontario → LSO (articling min. 10 months OR LPP 8 months + bar exams); BC → LSBC (PLTC + 9 months articles); Alberta → LSA (CPLED + 12 months articles)
- The NCA Hub offers concise subject notes (under 80 pages), answer templates, and readiness assessment — founded by Kartik Kumar who passed all 5 subjects (4 cleared in under 3 months)

## KNOWLEDGE PRIORITY ORDER
1. Provided page content (pageContext.content) — PRIMARY source
2. Verified facts listed above
3. Official sources (FLSC, law societies)
4. Proven NCA preparation strategies
5. General knowledge (only if reliable; flag uncertainty)

## STRICT ACCURACY RULES
- NEVER invent fees, timelines, rules, or statistics
- NEVER guess specific numbers — use ranges or say "verify at nca.legal"
- If uncertain, say: "This may vary — I recommend checking nca.legal or your provincial law society."
- If page content conflicts with general knowledge: prefer page content

## RESPONSE STRUCTURE
1. Direct answer first (1–2 sentences max)
2. Structured explanation (bullet points preferred)
3. Practical takeaway
4. One clarifying question only if genuinely needed

## STRATEGIC GUIDANCE — ACTIVELY CORRECT THESE MISTAKES
If a user shows signs of:
- Only reading (not practising with timed questions) → redirect to practice-based prep
- Not doing timed 3-hour mock exams → emphasise exam conditioning
- Misunderstanding "open-book" as "just bring notes" → clarify it tests application speed
- Taking too many subjects in one session → suggest 1–2 max
- Ignoring previously failed subjects' root cause → push failure autopsy framework
- Waiting to start LRW until after all exams → tell them to start at 3-subject mark

## DECISION SUPPORT
For vague questions: DO NOT say "it depends" — ask ONE targeted clarifying question, then give a provisional recommendation.
Example: "Quick question — how many subjects were you assigned? That determines whether 1 or 2 per session is realistic."

## CONTEXT-AWARE BEHAVIOUR
If user is on:
- A study plan page → give timelines, subject order, session structure
- A subject guide page → reference specific legal tests (Vavilov, Oakes, IRAC structure)
- An exam strategy page → focus on timed writing, note organisation, question reading
- A fees/process page → give structured step-by-step with exact figures
- A failure/retake page → run through failure autopsy framework, category diagnosis

## LENGTH
- Default: 150–300 words
- Longer only if user explicitly requests depth or topic demands it
- Use bullet points over paragraphs wherever possible

## FOLLOW-UP QUESTIONS
At the END of every response, add exactly 2-3 suggested follow-up questions on new lines, each prefixed with ">>>" (three greater-than signs). These must be relevant to what you just discussed and help the user go deeper.
Example format:
>>>How long should I study for Constitutional Law?
>>>What's the best order to take NCA subjects?
>>>Can I write 3 exams in one session?${contextSection}`;

  /* ── Determine streaming mode ── */
  const wantsStream = body.stream === true;

  /* ── Call Workers AI with model fallback ── */
  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10)
  ];

  /* ── Log question for analytics (fire-and-forget) ── */
  logAnalytics(env, latestUserMsg?.content, pagePath);

  try {
    let lastError = null;

    /* ── STREAMING MODE ── */
    if (wantsStream) {
      for (const model of MODELS) {
        try {
          console.log(`CHATBOT STREAM: Trying model ${model}`);
          const stream = await env.AI.run(model, { messages: chatMessages, stream: true });

          if (stream) {
            console.log(`CHATBOT STREAM: ${model} streaming`);
            return new Response(stream, {
              status: 200,
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-store',
                'Connection': 'keep-alive',
                ...CORS_HEADERS
              }
            });
          }
          lastError = new Error(`${model}: no stream returned`);
        } catch (err) {
          console.error(`CHATBOT STREAM: ${model} failed:`, err.message || String(err));
          lastError = err;
        }
      }

      const reason = lastError ? lastError.message : 'All models unavailable';
      console.error(`CHATBOT STREAM: All models failed — ${reason}`);
      return jsonResponse({
        error: 'Unable to reach AI service. Please try again in a moment.',
        retryable: true
      }, 502);
    }

    /* ── NON-STREAMING MODE (original) ── */
    let reply = null;

    for (const model of MODELS) {
      try {
        console.log(`CHATBOT: Trying model ${model}`);
        const result = await env.AI.run(model, { messages: chatMessages });

        if (result && result.response) {
          reply = result.response;
          console.log(`CHATBOT: ${model} responded successfully`);
          break;
        } else {
          console.error(`CHATBOT: ${model} returned empty response:`, JSON.stringify(result).slice(0, 300));
          lastError = new Error(`${model}: empty response`);
        }
      } catch (err) {
        console.error(`CHATBOT: ${model} failed:`, err.message || String(err));
        lastError = err;
      }
    }

    if (!reply) {
      const reason = lastError ? lastError.message : 'All models unavailable';
      console.error(`CHATBOT: All models failed — ${reason}`);
      return jsonResponse({
        error: 'Unable to reach AI service after multiple attempts. Please try again in a moment.',
        retryable: true
      }, 502);
    }

    console.log('CHATBOT: Reply sent successfully');
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    console.error('CHATBOT: Unhandled error:', err.message || String(err), err.stack || '');
    return jsonResponse({
      error: 'Failed to reach AI service. Please try again shortly.',
      retryable: true
    }, 502);
  }
}

/* ── Analytics: track questions to KV (or log if no KV) ── */
function logAnalytics(env, question, pagePath) {
  if (!question) return;
  const timestamp = new Date().toISOString();
  const entry = { q: question.slice(0, 200), page: pagePath || '/', ts: timestamp };

  // If KV binding exists, persist; otherwise just console.log for Cloudflare dashboard
  if (env.CHAT_ANALYTICS) {
    const key = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    env.CHAT_ANALYTICS.put(key, JSON.stringify(entry), { expirationTtl: 86400 * 90 }).catch(() => {});
  }
  console.log('CHATBOT_ANALYTICS:', JSON.stringify(entry));
}
