export const config = {
  runtime: 'nodejs'
}

import OpenAI from 'openai'

/**
 * Get OpenAI API key from environment
 * @returns {string} API key
 * @throws {Error} If API key is not set
 */
function getOpenAIApiKey() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return apiKey.trim()
}

/**
 * Call OpenAI to generate audit results
 * @param {string} input - UI description to audit
 * @returns {Promise<Object>} Audit result matching contract
 */
async function generateAuditResult(input) {
  const apiKey = getOpenAIApiKey()
  const client = new OpenAI({ apiKey })

  const prompt = `You are Access Lens, a WCAG 2.2 accessibility auditor.

Analyze the following UI description for accessibility issues.

INPUT:
${input}

Return ONLY valid JSON matching this exact schema (no extra keys, no markdown, no code blocks):
{
  "summary": {
    "total": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "issues": [
    {
      "id": "unique-issue-id",
      "title": "Brief issue summary",
      "severity": "low" | "medium" | "high",
      "wcagRef": "WCAG 2.2.X.X",
      "description": "Detailed description of the accessibility issue",
      "recommendation": "Recommended fix or solution"
    }
  ],
  "metadata": {
    "model": "gpt-4o-mini",
    "generatedAt": "ISO 8601 timestamp"
  }
}

Requirements:
- "id": unique string identifier for each issue
- "title": concise one-line summary
- "severity": must be exactly "low", "medium", or "high"
- "wcagRef": single WCAG 2.2 criterion reference (e.g., "WCAG 2.2.1.1")
- "description": detailed explanation of the issue
- "recommendation": clear, actionable fix suggestion
- "summary": object with counts for total, high, medium, and low severity issues
- "metadata": object with "model" (e.g., "gpt-4o-mini") and "generatedAt" (ISO 8601 timestamp)
- Return only the JSON object, no markdown formatting, no code blocks, no explanations.`

  console.log('calling OpenAI')
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a WCAG 2.2 accessibility auditor. Always return valid JSON only, no markdown, no code blocks, no explanations.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0,
    response_format: { type: 'json_object' }
  })

  console.log('OpenAI response received')
  const content = response.choices[0].message.content.trim()
  
  // Remove markdown code blocks if present
  let jsonContent = content
  if (content.startsWith('```')) {
    jsonContent = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
  }

  // Parse JSON
  let auditResult
  try {
    auditResult = JSON.parse(jsonContent)
  } catch (parseError) {
    throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`)
  }

  // Validate structure matches contract
  if (!auditResult.summary || !auditResult.issues || !auditResult.metadata) {
    throw new Error('OpenAI response missing required fields: summary, issues, or metadata')
  }

  // Ensure metadata has required fields
  if (!auditResult.metadata.generatedAt) {
    auditResult.metadata.generatedAt = new Date().toISOString()
  }
  if (!auditResult.metadata.model) {
    auditResult.metadata.model = 'gpt-4o-mini'
  }

  // Validate and calculate summary counts if needed
  if (!auditResult.summary.total && auditResult.issues.length > 0) {
    auditResult.summary.total = auditResult.issues.length
    auditResult.summary.high = auditResult.issues.filter(i => i.severity === 'high').length
    auditResult.summary.medium = auditResult.issues.filter(i => i.severity === 'medium').length
    auditResult.summary.low = auditResult.issues.filter(i => i.severity === 'low').length
  }

  return auditResult
}

export default async function handler(req, res) {
  console.log('run-audit invoked')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    // Parse request body
    const { input } = req.body;
    console.log('input length:', input?.length || 0)

    if (!input || input.trim().length === 0) {
      return res.status(400).json({
        error: "validation_error",
        message: "No input provided."
      });
    }

    // Generate audit result using OpenAI
    const auditResult = await generateAuditResult(input);

    // Return audit result as JSON
    return res.status(200).json(auditResult);
  } catch (err) {
    console.error("Audit endpoint error:", err);

    // Handle specific error types
    if (err.message && err.message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        error: "config_error",
        message: "Server configuration error. The audit service is not properly configured."
      });
    }

    if (err.message && err.message.includes('parse')) {
      return res.status(500).json({
        error: "invalid_response",
        message: "The audit service returned an invalid response. Please try again."
      });
    }

    // Generic error
    return res.status(500).json({
      error: "server_error",
      message: "An error occurred processing the request."
    });
  }
}
