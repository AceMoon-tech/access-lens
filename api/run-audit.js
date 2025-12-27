import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use POST",
    });
  }

  try {
    const { input } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        error: "invalid_input",
        message: "Screen description is required",
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are an accessibility audit assistant for early-stage design concepts.

You MUST return strict JSON only.
No markdown. No prose outside JSON.

Scope rules:
- Audit only what is implied by the screen description.
- Do NOT assume DOM, code, or implementation details.
- Do NOT claim compliance or failure.
- Use preventive, guidance-based language only.

Global rule:
- All findings must be conditional and hypothetical. The audit does not confirm the presence of issues.

Each issue MUST include ALL fields below:

- guidance: string
  (Actionable advice. Never accusatory. Use conditional phrasing only (e.g., 'If present…', 'May affect…', 'Could impact…').)
- whoItAffects: string
  (Impacted user groups. Use conditional phrasing only (e.g., 'If present…', 'May affect…', 'Could impact…').)
- whyItMatters: string
  (User impact or usability risk. Use conditional phrasing only (e.g., 'If present…', 'May affect…', 'Could impact…').)
- wcagRefs: array of WCAG reference strings
- severity: "low" | "medium" | "high"
  (Severity must represent potential user impact, not a confirmed failure. Avoid compliance/failure claims.)

Language rules:
- Use phrasing like:
  "Ensure that…"
  "If present…"
  "Consider whether…"
- Never say something is broken.
- Never say pass/fail.
- Never use definitive language such as:
  'is missing', 'lacks', 'fails', 'violates', 'does not have', 'is incorrect', 'is inaccessible'.

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
  


return res.status(200).json(parsed);


    return res.status(200).json(parsed);
  } catch (err) {
    console.error("run-audit error:", err);

    console.log("RUN-AUDIT REACHED END");
    return res.status(500).json({
      error: "audit_failed",
      message: "Unable to generate audit results",
    });
  }
}
