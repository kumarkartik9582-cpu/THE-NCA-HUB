/**
 * Cloudflare Pages Function: /api/chat
 * Proxies requests to the Anthropic Claude API.
 * Set ANTHROPIC_API_KEY in your Cloudflare Pages environment variables.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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
- Use plain English, not heavy legalese`;

  const anthropicBody = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: systemPrompt,
    messages: messages.slice(-10)
  };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(anthropicBody)
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'API error' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reply = data.content?.[0]?.text || '';
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to reach AI service' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
