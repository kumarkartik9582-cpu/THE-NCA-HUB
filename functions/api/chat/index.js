export async function onRequest(context) {
  const { request, env } = context;

  // CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const apiKey = env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: body.messages || []
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "API error" }), {
        status: res.status,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const reply = data.content?.[0]?.text || "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        ...corsHeaders
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to reach AI service" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
