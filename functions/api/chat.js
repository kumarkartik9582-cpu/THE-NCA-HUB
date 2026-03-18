/**
 * Cloudflare Pages Function: /api/chat
 * Proxies requests to the Anthropic Claude API.
 * Set ANTHROPIC_API_KEY in your Cloudflare Pages environment variables.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/* Handle CORS preflight */
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/* ── Simple in-process rate limiter (resets per worker cold start) ── */
const _rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window
  const maxRequests = 20;
  const entry = _rateLimitMap.get(ip) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  _rateLimitMap.set(ip, entry);
  // Prune map periodically to avoid memory growth
  if (_rateLimitMap.size > 5000) {
    for (const [k, v] of _rateLimitMap) { if (now > v.reset) _rateLimitMap.delete(k); }
  }
  return entry.count > maxRequests;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  /* Rate limit by IP */
  const ip = request.headers.get('CF-Connecting-IP') ||
             request.headers.get('X-Forwarded-For') || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a minute before trying again.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, 'Retry-After': '60' }
    });
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured. Please set ANTHROPIC_API_KEY in Cloudflare Pages environment variables.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  const { messages, pageContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  /* Build page-aware context */
  const pageContent = pageContext && pageContext.content ? pageContext.content.slice(0, 4000) : null;
  const pageTitle = pageContext && pageContext.title ? pageContext.title : null;
  const pagePath = pageContext && pageContext.path ? pageContext.path : null;

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
- Use bullet points over paragraphs wherever possible${contextSection}`;


  /* Try modern Haiku first, fall back to Haiku 3 if model unavailable */
  const MODELS = ['claude-haiku-4-5-20251001', 'claude-3-5-haiku-20241022', 'claude-3-haiku-20240307'];

  async function tryModel(model) {
    const body = {
      model,
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.slice(-10)
    };
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    return res;
  }

  try {
    let res;
    let data;
    for (const model of MODELS) {
      res = await tryModel(model);
      data = await res.json();
      /* Fall through to next model on any non-auth, non-billing, non-RateLimit error */
      if (!res.ok) {
        const errType = data.error?.type || '';
        const shouldRetry = errType === 'not_found_error' ||
                            errType === 'invalid_request_error' ||
                            errType === 'overloaded_error' ||
                            res.status === 529 || res.status === 503 || res.status === 404;
        if (shouldRetry) continue;
      }
      break;
    }

    if (!res.ok) {
      const errMsg = data.error?.message || `API error (${res.status})`;
      return new Response(JSON.stringify({ error: errMsg }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const reply = data.content?.[0]?.text || '';
    if (!reply) {
      return new Response(JSON.stringify({ error: 'Empty response from AI service.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to reach AI service. Please try again shortly.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
