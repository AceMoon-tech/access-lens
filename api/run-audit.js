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
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  
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

// Detect low-signal input (gibberish, abstract, non-UI concepts)
function isLowSignalInput(input) {
  const text = input.trim().toLowerCase();
  
  // Very short input (less than 15 characters)
  if (text.length < 15) return true;
  
  // Non-UI concept keywords
  const nonUIKeywords = ['database', 'api', 'backend', 'infrastructure', 'server', 'endpoint', 'sql', 'query'];
  if (nonUIKeywords.some(keyword => text.includes(keyword))) return true;
  
  // High ratio of special characters or numbers (potential gibberish)
  const specialCharCount = (text.match(/[^a-z0-9\s]/g) || []).length;
  const numberCount = (text.match(/[0-9]/g) || []).length;
  const totalChars = text.length;
  if (totalChars > 0 && (specialCharCount + numberCount) / totalChars > 0.5) return true;
  
  // Very abstract / no UI-related keywords
  const uiKeywords = ['button', 'field', 'input', 'form', 'screen', 'page', 'interface', 'ui', 'link', 'menu', 'nav', 'modal', 'dialog', 'card', 'list'];
  const hasUIKeywords = uiKeywords.some(keyword => text.includes(keyword));
  if (!hasUIKeywords && text.length < 50) return true;
  
  return false;
}

// Detect if input is near-minimum detail (passed validation but lacks depth)
function isNearMinimumDetail(input) {
  const text = input.trim();
  const MIN_LENGTH = 20; // Minimum validation threshold
  const NEAR_MIN_THRESHOLD = 80; // Consider near-minimum if under this length
  
  // Check if input is short (near minimum validation length)
  if (text.length < NEAR_MIN_THRESHOLD) return true;
  
  // Check if input is missing multiple concrete UI primitives
  const concreteUIPrimitives = [
    'form', 'field', 'input', 'button', 'table', 'row', 'column',
    'error', 'validation', 'state', 'disabled', 'loading',
    'navigation', 'nav', 'menu', 'link', 'tab', 'modal', 'dialog'
  ];
  
  const foundPrimitives = concreteUIPrimitives.filter(primitive => 
    text.toLowerCase().includes(primitive)
  );
  
  // If fewer than 2 concrete UI primitives found, consider it near-minimum
  if (foundPrimitives.length < 2) return true;
  
  return false;
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
    const { input, context } = req.body;

    // Malformed input validation (before any processing)
    // Validate input: must exist, be a string, and not be empty after trim
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        error: "invalid_request_format",
        message: "Invalid request format. Please provide a valid screen description.",
      });
    }

    // Validate context (if present): must be a string
    // Reject null, arrays, objects, numbers, booleans
    if (context !== undefined && typeof context !== "string") {
      return res.status(400).json({
        error: "invalid_request_format",
        message: "Invalid request format. Please provide a valid screen description.",
      });
    }

    // Payload size validation (after type validation)
    const MAX_LENGTH = 2000;
    
    if (input.length > MAX_LENGTH) {
      return res.status(413).json({
        error: "payload_too_large",
        message: "Input is too long. Please shorten your description.",
      });
    }
    
    if (context && context.length > MAX_LENGTH) {
      return res.status(413).json({
        error: "payload_too_large",
        message: "Input is too long. Please shorten your description.",
      });
    }

    // Detect low-signal input
    const lowConfidence = isLowSignalInput(input);
    
    // Detect if input is near-minimum detail (for partial results warning)
    const nearMinimumDetail = isNearMinimumDetail(input);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are an accessibility guidance assistant for early-stage design concepts.

You MUST return strict JSON only.
No markdown. No prose outside JSON.

CRITICAL: What this is NOT:
- This is NOT an accessibility checker, validator, or certification tool.
- This does NOT determine compliance or provide pass/fail assessments.
- This does NOT audit code, DOM, or implementation details.
- This does NOT audit full systems, products, or enterprise requirements.

Input scope (MUST enforce):
- ONLY audit screen-level or UI-level concepts described by the user.
- NEVER audit BRDs, PRDs, system specifications, architecture documents, or full workflows.
- If input describes systems, specs, or non-UI concepts, return an empty issues array.

High-level UI descriptions (MUST handle):
- If the input describes a UI screen at a high level but lacks detailed attributes, DO NOT return an empty issues array.
- Instead, return a baseline set of common, hypothetical accessibility risks using conditional language only.
- Focus on: labels, focus order, error handling, contrast, and input affordances.
- Use phrasing like "If present…", "May affect…", "Could impact…" for all guidance.
- Never require explicit user-reported problems to surface issues.
- Only return an empty issues array if the input is explicitly out of scope (e.g. system architecture, backend logic, non-UI concepts).

Out-of-scope (NEVER assume):
- NEVER assume DOM structure, HTML semantics, or ARIA attributes.
- NEVER assume code implementation, JavaScript behavior, or backend logic.
- NEVER audit full systems, multi-screen workflows, or enterprise requirements.
- NEVER evaluate actual runtime behavior, screen reader output, or focus order.

Global language rule (MANDATORY):
- ALL findings MUST be conditional and hypothetical. The audit does not confirm the presence of issues.
- NEVER state certainty. NEVER claim something "is missing", "lacks", "fails", "violates", or "does not comply".
- NEVER use pass/fail, approval, or certification language.
- MUST use conditional phrasing: "If present…", "May affect…", "Could impact…", "Consider whether…", "Ensure that…"

Each issue MUST include ALL fields below (in this exact order):

- guidance: string
  (MUST use conditional phrasing only. Actionable advice. Never accusatory. Never definitive.)
- whoItAffects: string
  (MUST use conditional phrasing only. Impacted user groups.)
- whyItMatters: string
  (MUST use conditional phrasing only. User impact or usability risk.)
- wcagRefs: array of WCAG reference strings
- severity: "low" | "medium" | "high"
  (MUST represent potential user impact, not a confirmed failure. NEVER implies compliance/failure.)

Prohibited language (NEVER use):
- 'is missing', 'lacks', 'fails', 'violates', 'does not have', 'is incorrect', 'is inaccessible'
- 'does not comply', 'non-compliant', 'fails WCAG', 'violates standard'
- 'is broken', 'is wrong', 'is invalid', 'is incorrect'
- 'pass', 'fail', 'approved', 'certified', 'compliant'

Enforcement:
If any rule is violated, regenerate the response until compliant.

Return JSON in this exact shape:

{
  "issues": [
    {
      "guidance": "",
      "whoItAffects": "",
      "whyItMatters": "",
      "wcagRefs": [],
      "severity": "low"
    }
  ]
}
          `.trim(),
        },
        {
          role: "user",
          content: `
Screen description:

${input}

Return only valid JSON matching the required schema.
          `.trim(),
        },
      ],
    });

    const raw = response.choices[0].message.content;
    console.log('RAW_OPENAI_JSON:', raw);
    const parsed = JSON.parse(raw);
    
    // Add lowConfidence and nearMinimumDetail flags to response
    const responseWithConfidence = {
      ...parsed,
      lowConfidence,
      nearMinimumDetail
    };

    return res.status(200).json(responseWithConfidence);
  } catch (err) {
    console.error("run-audit error:", err);

    console.log("RUN-AUDIT REACHED END");
    return res.status(500).json({
      error: "audit_failed",
      message: "Unable to generate audit results",
    });
  }
}
