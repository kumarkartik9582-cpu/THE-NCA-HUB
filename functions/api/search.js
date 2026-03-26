/**
 * Cloudflare Pages Function: /api/search
 * Semantic search using Workers AI embeddings (bge-base-en-v1.5).
 *
 * Computes cosine similarity between the query embedding and
 * pre-embedded search index entries. Returns top results ranked
 * by semantic relevance.
 *
 * SETUP: Same AI binding as chatbot — already configured if chat works.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://www.thencahub.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';

/* ── In-memory embedding cache (persists per worker instance) ── */
let cachedEmbeddings = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600_000; // 1 hour

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Fetch and embed the search index
 */
async function getIndexEmbeddings(ai, origin) {
  const now = Date.now();
  if (cachedEmbeddings && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedEmbeddings;
  }

  // Fetch the search index
  const indexUrl = `${origin}/search-index.json`;
  const res = await fetch(indexUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch search index: ${res.status}`);
  }
  const index = await res.json();

  // Build text representations for embedding
  const texts = index.map(item => {
    const parts = [item.title || ''];
    if (item.h1 && item.h1 !== item.title) parts.push(item.h1);
    if (item.desc) parts.push(item.desc);
    return parts.join(' — ');
  });

  // Embed all texts in a single batch call (very efficient)
  const embeddingResult = await ai.run(EMBEDDING_MODEL, { text: texts });

  if (!embeddingResult || !embeddingResult.data) {
    throw new Error('Embedding model returned no data');
  }

  cachedEmbeddings = {
    index,
    embeddings: embeddingResult.data
  };
  cacheTimestamp = now;

  console.log(`SEARCH: Embedded ${index.length} pages successfully`);
  return cachedEmbeddings;
}

/* ── Simple rate limiter ── */
const _searchRateMap = new Map();
function isSearchRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const maxRequests = 30;
  const entry = _searchRateMap.get(ip) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  _searchRateMap.set(ip, entry);
  if (_searchRateMap.size > 5000) {
    for (const [k, v] of _searchRateMap) { if (now > v.reset) _searchRateMap.delete(k); }
  }
  return entry.count > maxRequests;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  /* Rate limit */
  const ip = request.headers.get('CF-Connecting-IP') ||
             request.headers.get('X-Forwarded-For') || 'unknown';
  if (isSearchRateLimited(ip)) {
    return jsonResponse({ error: 'Too many search requests. Please slow down.' }, 429);
  }

  /* Validate AI binding */
  if (!env.AI) {
    return jsonResponse({ error: 'AI service not configured' }, 500);
  }

  /* Parse request */
  let body;
  try {
    body = await request.json();
  } catch (_e) {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const query = (body.query || '').trim();
  if (!query || query.length < 2) {
    return jsonResponse({ error: 'Query too short' }, 400);
  }
  if (query.length > 200) {
    return jsonResponse({ error: 'Query too long' }, 400);
  }

  const limit = Math.min(body.limit || 8, 15);

  try {
    /* Get or build the index embeddings */
    const origin = new URL(request.url).origin;
    const { index, embeddings } = await getIndexEmbeddings(env.AI, origin);

    /* Embed the query */
    const queryResult = await env.AI.run(EMBEDDING_MODEL, { text: [query] });
    if (!queryResult || !queryResult.data || !queryResult.data[0]) {
      return jsonResponse({ error: 'Failed to process search query' }, 500);
    }
    const queryVec = queryResult.data[0];

    /* Compute similarities and rank */
    const scored = index.map((item, i) => ({
      ...item,
      score: cosineSimilarity(queryVec, embeddings[i])
    }));

    scored.sort((a, b) => b.score - a.score);

    /* Filter by minimum relevance threshold and return top results */
    const results = scored
      .filter(r => r.score > 0.45)
      .slice(0, limit)
      .map(({ url, title, desc, h1, score }) => ({
        url,
        title,
        desc: desc ? desc.slice(0, 200) : '',
        h1: h1 || undefined,
        score: Math.round(score * 100) / 100
      }));

    return new Response(JSON.stringify({ results, query }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        ...CORS_HEADERS
      }
    });
  } catch (err) {
    console.error('SEARCH: Error:', err.message || String(err));
    return jsonResponse({
      error: 'Search service temporarily unavailable. Please try again.',
      retryable: true
    }, 502);
  }
}
