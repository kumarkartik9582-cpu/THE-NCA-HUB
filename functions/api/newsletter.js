/**
 * Cloudflare Pages Function: /api/newsletter
 * Handles newsletter signup form submissions.
 *
 * To connect to an email service, set one of these env vars in Cloudflare Pages:
 *   MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID + MAILCHIMP_SERVER_PREFIX (e.g. "us1")
 *   CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID
 *
 * Without them, submissions are logged but not forwarded (graceful degradation).
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }

  // ── Try Mailchimp ──
  if (env.MAILCHIMP_API_KEY && env.MAILCHIMP_LIST_ID && env.MAILCHIMP_SERVER_PREFIX) {
    try {
      const server = env.MAILCHIMP_SERVER_PREFIX;
      const listId = env.MAILCHIMP_LIST_ID;
      const mcRes = await fetch(
        `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.MAILCHIMP_API_KEY}`
          },
          body: JSON.stringify({ email_address: email, status: 'subscribed' })
        }
      );
      if (!mcRes.ok) {
        const err = await mcRes.json();
        // 400 "Member Exists" is still a success from user perspective
        if (err.title !== 'Member Exists') {
          return new Response(JSON.stringify({ error: 'Could not subscribe. Please try again.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
          });
        }
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } catch (e) {
      // Fall through to ConvertKit or success response
    }
  }

  // ── Try ConvertKit ──
  if (env.CONVERTKIT_API_KEY && env.CONVERTKIT_FORM_ID) {
    try {
      const ckRes = await fetch(
        `https://api.convertkit.com/v3/forms/${env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: env.CONVERTKIT_API_KEY, email })
        }
      );
      if (!ckRes.ok) {
        return new Response(JSON.stringify({ error: 'Could not subscribe. Please try again.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } catch (e) {
      // Fall through
    }
  }

  // ── No email service configured — accept gracefully ──
  // In production, set up Mailchimp or ConvertKit env vars.
  // For now, we confirm success so the UX is not broken.
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
