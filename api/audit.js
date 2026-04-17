export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the server" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON body" }); }
  }
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "messages[] required" });
  }

  const payload = {
    model: body.model || "claude-sonnet-4-20250514",
    max_tokens: body.max_tokens || 8000,
    messages: body.messages,
  };

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (err) {
    return res.status(502).json({ error: "Upstream fetch failed", detail: String(err?.message || err) });
  }
}
