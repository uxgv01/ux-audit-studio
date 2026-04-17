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
    },
  };

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const raw = await upstream.text();
    if (!upstream.ok) {
      res.status(upstream.status);
      res.setHeader("Content-Type", "application/json");
      return res.send(raw);
    }

    let data;
    try { data = JSON.parse(raw); } catch { return res.status(502).json({ error: "Upstream returned non-JSON", raw: raw.slice(0, 500) }); }

    // Extract text and normalize to Anthropic-like shape { content: [{type:"text", text}] }
    const text = (data.candidates || [])
      .flatMap((c) => (c.content?.parts || []).map((p) => p.text || ""))
      .join("");

    return res.status(200).json({
      content: [{ type: "text", text }],
      _provider: "gemini",
      _model: model,
    });
  } catch (err) {
    return res.status(502).json({ error: "Upstream fetch failed", detail: String(err?.message || err) });
  }
}
