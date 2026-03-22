/**
 * Cloudflare Pages Function: /api/chat-health
 * Diagnostic endpoint to verify API key configuration and connectivity.
 *
 * Visit https://thencahub.com/api/chat-health in your browser to check status.
 *
 * DELETE THIS FILE once the chatbot is confirmed working.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { env } = context;
  const results = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  /* Check 1: Is the env variable set? */
  const apiKey = env.ANTHROPIC_API_KEY;
  results.checks.apiKeySet = !!apiKey;

  if (!apiKey) {
    results.checks.apiKeyLength = 0;
    results.status = 'FAIL';
    results.message = 'ANTHROPIC_API_KEY is NOT set in Cloudflare environment variables. Go to Workers & Pages → the-nca-hub → Settings → Environment variables → Production and add it.';
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  /* Check 2: Does the key look valid? */
  results.checks.apiKeyLength = apiKey.length;
  results.checks.apiKeyPrefix = apiKey.slice(0, 10) + '...';
  results.checks.looksLikeAnthropicKey = apiKey.startsWith('sk-ant-');

  if (!apiKey.startsWith('sk-ant-')) {
    results.status = 'FAIL';
    results.message = 'API key does not start with "sk-ant-" — this does not look like a valid Anthropic API key. Please check the value in Cloudflare environment variables.';
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  /* Check 3: Test the key with a minimal API call */
  try {
    const testRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say OK' }]
      })
    });

    const text = await testRes.text();
    let data;
    try { data = JSON.parse(text); } catch (_) { data = { _raw: text.slice(0, 300) }; }

    results.checks.apiCallStatus = testRes.status;
    results.checks.apiCallOk = testRes.ok;

    if (testRes.ok) {
      results.status = 'OK';
      results.message = 'API key is valid and working! The chatbot should be functional. If it still fails, check the browser console for other errors.';
      results.checks.modelUsed = data?.model || 'unknown';
    } else {
      const errType = data?.error?.type || 'unknown';
      const errMsg = data?.error?.message || text.slice(0, 200);
      results.checks.errorType = errType;
      results.checks.errorMessage = errMsg;
      results.status = 'FAIL';

      if (errType === 'authentication_error') {
        results.message = 'API key is INVALID or REVOKED. Go to console.anthropic.com → API Keys, delete this key, create a new one, and update it in Cloudflare.';
      } else if (errType === 'permission_error') {
        results.message = 'API key lacks permission. Check your Anthropic account — you may need to accept terms of service or verify your account.';
      } else if (errType === 'billing_error' || errType === 'rate_limit_error') {
        results.message = 'Billing issue — your Anthropic account has no credits. Go to console.anthropic.com → Billing and add at least $5 in credits.';
      } else if (errType === 'not_found_error') {
        results.message = 'Model not found — trying fallback check...';
        /* Try older model */
        const fallbackRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Say OK' }]
          })
        });
        results.checks.fallbackStatus = fallbackRes.status;
        if (fallbackRes.ok) {
          results.status = 'PARTIAL';
          results.message = 'API key works but claude-haiku-4-5 is not available on your plan. The chatbot should still work via model fallback (claude-3-haiku).';
        } else {
          const fbText = await fallbackRes.text();
          let fbData;
          try { fbData = JSON.parse(fbText); } catch (_) { fbData = {}; }
          results.checks.fallbackError = fbData?.error?.type || fbText.slice(0, 200);
          results.message = `API key authentication or billing issue. Error: ${fbData?.error?.message || fbText.slice(0, 200)}`;
        }
      } else if (errType === 'invalid_request_error' && errMsg.includes('credit')) {
        results.message = 'Your Anthropic account has no API credits. Go to console.anthropic.com → Billing and add credits.';
      } else {
        results.message = `API call failed: ${errType} — ${errMsg}`;
      }
    }
  } catch (networkErr) {
    results.checks.networkError = networkErr.message || String(networkErr);
    results.status = 'FAIL';
    results.message = 'Network error connecting to Anthropic API. This is unusual from Cloudflare Workers — the API may be down.';
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
