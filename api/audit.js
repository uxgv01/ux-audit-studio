export const config = {
  runtime: "nodejs",
  maxDuration: 60,
};

// Convert Anthropic-style messages (what the client sends) to Gemini contents[].
function toGeminiContents(messages) {
  return messages.map((m) => {
    const parts = [];
    const content = Array.isArray(m.content) ? m.content : [{ type: "text", text: String(m.content || "") }];
    for (const c of content) {
      if (c.type === "text" && c.text) {
        parts.push({ text: c.text });
      } else if (c.type === "image" && c.source?.type === "base64") {
        parts.push({
          inline_data: {
            mime_type: c.source.media_type || "image/jpeg",
            data: c.source.data,
          },
        });
      }
    }
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON body" }); }
  }
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "messages[] required" });
  }

  const model = body.geminiModel || "gemini-2.5-flash";
  const contents = toGeminiContents(body.messages);

  const payload = {
    contents,
    generationConfig: {
      maxOutputTokens: body.max_tokens || 8000,
      responseMimeType: "application/json",
      temperature: typeof body.temperature === "number" ? body.temperature : 0.2,
    },
  };
  if (body.systemInstruction) {
    payload.systemInstruction = { parts: [{ text: String(body.systemInstruction) }] };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const maxAttempts = 4;
  let lastStatus = 0, lastRaw = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await upstream.text();
      lastStatus = upstream.status;
      lastRaw = raw;

      if (upstream.ok) {
        let data;
        try { data = JSON.parse(raw); } catch { return res.status(502).json({ error: "Upstream returned non-JSON", raw: raw.slice(0, 500) }); }
        const text = (data.candidates || [])
          .flatMap((c) => (c.content?.parts || []).map((p) => p.text || ""))
          .join("");
        return res.status(200).json({
          content: [{ type: "text", text }],
          _provider: "gemini",
          _model: model,
          _attempts: attempt,
        });
      }

      // Retry on transient errors
      const retriable = upstream.status === 503 || upstream.status === 429 || upstream.status === 500;
      if (!retriable || attempt === maxAttempts) {
        res.status(upstream.status);
        res.setHeader("Content-Type", "application/json");
        return res.send(raw);
      }

      // Backoff: parse retryDelay hint if present, else exponential with jitter
      let delayMs = Math.min(8000, 600 * Math.pow(2, attempt - 1)) + Math.random() * 300;
      try {
        const parsed = JSON.parse(raw);
        const hint = parsed?.error?.details?.find?.((d) => d["@type"]?.includes("RetryInfo"))?.retryDelay;
        if (hint) {
          const sec = parseFloat(String(hint).replace("s", ""));
          if (!isNaN(sec) && sec > 0) delayMs = Math.min(12000, sec * 1000 + 200);
        }
      } catch {}
      await new Promise((r) => setTimeout(r, delayMs));
    } catch (err) {
      if (attempt === maxAttempts) {
        return res.status(502).json({ error: "Upstream fetch failed", detail: String(err?.message || err) });
      }
      await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt - 1)));
    }
  }

  // Should not reach; safety net
  res.status(lastStatus || 502);
  res.setHeader("Content-Type", "application/json");
  return res.send(lastRaw || JSON.stringify({ error: "Exhausted retries" }));
}
