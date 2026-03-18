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

  /* Build page-aware context prefix */
  const pageNote = pageContext && pageContext.title && pageContext.path !== '/'
    ? `\n\nCurrent page context: The user is reading "${pageContext.title}" (${pageContext.path}). Tailor your answer to this context where relevant.`
    : '';

  const systemPrompt = `You are the NCA Hub AI Assistant — a knowledgeable, concise guide for internationally trained lawyers preparing for NCA (National Committee on Accreditation) challenge exams in Canada.

You help users with:
- NCA exam subjects: Administrative Law, Constitutional Law, Criminal Law, Foundations of Canadian Law, Professional Responsibility, and others (Civil Procedure, Business Organisations, Property Law, Legal Research & Writing)
- NCA application process and timelines
- Province-specific requirements (Ontario via LSO, BC via LSBC, Alberta via LSA)
- Study strategies, resources, and preparation tips
- NCA exam format: open-book, 3-hour written exams with essay-style questions
- Cost estimates and scheduling
- What to expect after getting the NCA Certificate of Qualification

Key facts to know:
- The NCA is run by the Federation of Law Societies of Canada (FLSC)
- Exams are held in February/March, June, and October/November each year
- Each exam is 3 hours, open-book, essay format
- The NCA Hub (thencahub.com) offers concise study notes (under 80 pages per subject), answer templates, and a free readiness assessment
- The founder, Kartik Kumar, passed all 5 NCA subjects (4 in under 3 months, first exam in 7 days)

Guidelines:
- Be concise and direct — bullet points preferred for lists
- For official fees/dates, recommend checking flsc.ca or the relevant law society
- If you don't know something specific, say so clearly and direct them to official sources
- Encourage but be realistic — NCA exams are challenging
- Keep responses under 300 words unless a detailed explanation is genuinely needed
- Use plain English, not heavy legalese${pageNote}`;

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
      /* If model_not_found or overloaded_error, try next model */
      if (!res.ok && (data.error?.type === 'not_found_error' || data.error?.type === 'invalid_request_error')) {
        continue;
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
