/**
 * Cloudflare Pages Function: /api/chat-analytics
 * Returns aggregated chat analytics data.
 *
 * SETUP: Optionally add a KV namespace binding named "CHAT_ANALYTICS"
 *        in Cloudflare Pages → Settings → Functions → Bindings.
 *        Without KV, analytics are only in console logs (Cloudflare dashboard → Workers → Logs).
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { env, request } = context;

  /* Simple auth: require ?key= parameter matching env var */
  const url = new URL(request.url);
  const authKey = url.searchParams.get('key');
  if (!env.ANALYTICS_KEY || authKey !== env.ANALYTICS_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  if (!env.CHAT_ANALYTICS) {
    return new Response(JSON.stringify({
      error: 'No KV binding. Analytics are available in Cloudflare Workers logs (console.log).',
      hint: 'Add a KV namespace binding named CHAT_ANALYTICS to enable persistent analytics.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  try {
    /* List recent entries */
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);
    const listResult = await env.CHAT_ANALYTICS.list({ limit });

    const entries = [];
    const questionCounts = {};

    for (const key of listResult.keys) {
      const val = await env.CHAT_ANALYTICS.get(key.name);
      if (val) {
        try {
          const entry = JSON.parse(val);
          entries.push(entry);
          /* Aggregate question frequency */
          const normalized = (entry.q || '').toLowerCase().trim();
          if (normalized) {
            questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
          }
        } catch (_) { /* skip corrupt entries */ }
      }
    }

    /* Sort by frequency */
    const topQuestions = Object.entries(questionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([question, count]) => ({ question, count }));

    return new Response(JSON.stringify({
      total: entries.length,
      topQuestions,
      recentQuestions: entries.slice(-20).reverse()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60',
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}
