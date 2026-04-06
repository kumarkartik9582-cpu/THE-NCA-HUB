/**
 * Cloudflare Pages Function: /api/voice
 * Accepts an audio file (multipart/form-data, field: "audio"),
 * transcribes it using Workers AI Whisper, and returns JSON:
 *   { text: "transcribed text" }
 *
 * SETUP (same as /api/chat):
 *   Cloudflare Dashboard → Pages → your project → Settings →
 *   Functions → Bindings → Add → Workers AI → Variable name: AI
 *
 * Supported audio: webm, mp4, wav, ogg, flac (browser MediaRecorder default: webm)
 * Model: @cf/openai/whisper — free on Workers AI
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

/* ── Simple in-process rate limiter ── */
const _rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const entry = _rateMap.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60_000; }
  entry.count++;
  _rateMap.set(ip, entry);
  return entry.count > 10; // 10 voice requests per minute
}

export async function onRequestPost(context) {
  const { request, env } = context;

  /* ── Validate AI binding ── */
  if (!env.AI) {
    return jsonResponse({ error: 'AI binding not configured' }, 500);
  }

  /* ── Rate limit ── */
  const ip = request.headers.get('CF-Connecting-IP') ||
             request.headers.get('X-Forwarded-For') || 'unknown';
  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'Too many requests' }, 429);
  }

  /* ── Parse multipart form ── */
  let formData;
  try {
    formData = await request.formData();
  } catch (_) {
    return jsonResponse({ error: 'Invalid form data' }, 400);
  }

  const audioFile = formData.get('audio');
  if (!audioFile || typeof audioFile.arrayBuffer !== 'function') {
    return jsonResponse({ error: 'No audio file provided (field: "audio")' }, 400);
  }

  /* ── Size limit: 25 MB ── */
  const MAX_BYTES = 25 * 1024 * 1024;
  const buffer = await audioFile.arrayBuffer();
  if (buffer.byteLength === 0) {
    return jsonResponse({ error: 'Empty audio file' }, 400);
  }
  if (buffer.byteLength > MAX_BYTES) {
    return jsonResponse({ error: 'Audio too large (max 25 MB)' }, 413);
  }

  /* ── Transcribe with Whisper ── */
  try {
    console.log(`VOICE: Transcribing ${buffer.byteLength} bytes`);
    const result = await env.AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(buffer)]
    });

    const text = result?.text?.trim() || '';
    console.log(`VOICE: Transcribed: "${text.slice(0, 100)}"`);

    if (!text) {
      return jsonResponse({ text: '', error: 'No speech detected' });
    }

    return jsonResponse({ text });
  } catch (err) {
    console.error('VOICE: Whisper error:', err.message || String(err));
    return jsonResponse({ error: 'Transcription failed. Please try again.' }, 502);
  }
}
