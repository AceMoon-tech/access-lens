import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting: in-memory store (simple implementation for serverless)
// Note: In production with multiple instances, consider using Redis or similar
const rateLimitStore = new Map();

// Clean up old entries every 2 minutes
const CLEANUP_INTERVAL = 2 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupRateLimitStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  const oneMinuteAgo = now - 60 * 1000;

  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recent = timestamps.filter(ts => ts > oneMinuteAgo);
    if (recent.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recent);
    }
  }
}

function getClientIdentifier(req) {
  // Try to get IP from various headers (Vercel, proxies, etc.)
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const remoteAddress =
    req.connection?.remoteAddress || req.socket?.remoteAddress;

  const ip =
    forwardedFor?.split(",")[0]?.trim() || realIp || remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "";

  // Combine IP and user agent for better identification
  return `${ip}:${userAgent.substring(0, 50)}`;
}

function checkRateLimit(req) {
  cleanupRateLimitStore();

  const identifier = getClientIdentifier(req);
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  const timestamps = rateLimitStore.get(identifier) || [];
  const recentRequests = timestamps.filter(ts => ts > oneMinuteAgo);

  if (recentRequests.length >= 10) {
    return false; // Rate limit exceeded
  }

  // Add current request timestamp
  recentRequests.push(now);
  rateLimitStore.set(identifier, recentRequests);

  return true; // Within rate limit
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use POST",
    });
  }

  // Rate limiting check
  if (!checkRateLimit(req)) {
    return res.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many requests. Please wait a moment before trying again.",
    });
  }

  try {
    const { input } = req.body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        error: "invalid_request_format",
        message: "Invalid request format. Please provide a valid screen description.",
      });
    }

    const MAX_LENGTH = 2000;

    if (input.length > MAX_LENGTH) {
      return res.status(413).json({
        error: "payload_too_large",
        message: "Input is too long. Please shorten your description.",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: `
You help authors write clearer screen-level UI descriptions suitable for downstream review.

You MUST return strict JSON only.
No markdown. No prose outside JSON.

Your task:
- Rewrite the user's text into one concise, structured UI description (screen or interface focus).
- Improve clarity: components, hierarchy, controls, labels, states, errors, flows—only grounded in what the user implied.
- Do not invent unrelated screens or backend/system details unless the user mentioned them briefly as visible UI context.

You MUST NOT:
- List accessibility issues, risks, findings, recommendations, or "things to watch for".
- Mention WCAG, standards, audits, violations, conformance, certification, compliance, or pass/fail.

Return JSON in this exact shape (single root key):

{
  "improvedInput": ""
}
          `.trim(),
        },
        {
          role: "user",
          content: `
Rewrite this into an improved audit-ready UI description:

${input}

Return only valid JSON matching the required schema.
          `.trim(),
        },
      ],
    });

    const raw = response.choices[0].message.content;
    console.log("RAW_OPENAI_JSON:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("improve-input JSON parse:", parseErr);
      return res.status(500).json({
        error: "improve_input_failed",
        message: "Unable to improve description",
      });
    }

    if (
      !parsed ||
      typeof parsed.improvedInput !== "string" ||
      parsed.improvedInput.trim().length === 0
    ) {
      return res.status(500).json({
        error: "improve_input_failed",
        message: "Unable to improve description",
      });
    }

    const improvedInput = parsed.improvedInput.trim();

    if (improvedInput.length > MAX_LENGTH) {
      return res.status(500).json({
        error: "improve_input_failed",
        message: "Unable to improve description",
      });
    }

    return res.status(200).json({ improvedInput });
  } catch (err) {
    console.error("improve-input error:", err);

    console.log("IMPROVE-INPUT REACHED END");
    return res.status(500).json({
      error: "improve_input_failed",
      message: "Unable to improve description",
    });
  }
}
