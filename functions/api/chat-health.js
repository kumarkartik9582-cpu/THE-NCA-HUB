/**
 * Cloudflare Pages Function: /api/chat-health
 * Diagnostic endpoint to verify Workers AI binding and connectivity.
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

  /* Check 1: Is the AI binding set? */
  results.checks.aiBindingSet = !!env.AI;

  if (!env.AI) {
    results.status = 'FAIL';
    results.message = 'Workers AI binding "AI" is NOT configured. Go to Cloudflare Dashboard → Pages → your project → Settings → Functions → Bindings → Add → Workers AI → Variable name: AI, then redeploy.';
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  /* Check 2: Test the binding with a minimal call */
  const testModel = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
  try {
    const result = await env.AI.run(testModel, {
      messages: [
        { role: 'user', content: 'Say OK' }
      ]
    });

    results.checks.testModel = testModel;
    results.checks.testCallOk = !!(result && result.response);

    if (result && result.response) {
      results.status = 'OK';
      results.message = 'Workers AI binding is configured and working! The chatbot should be functional.';
      results.checks.testResponse = result.response.slice(0, 100);
    } else {
      results.status = 'PARTIAL';
      results.message = 'Workers AI binding exists but the test model returned an empty response. The chatbot may still work with fallback models.';
      results.checks.rawResult = JSON.stringify(result).slice(0, 300);
    }
  } catch (err) {
    results.checks.testModel = testModel;
    results.checks.testError = err.message || String(err);
    results.status = 'FAIL';
    results.message = `Workers AI test call failed: ${err.message || String(err)}. Check that the AI binding is correctly configured.`;
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
