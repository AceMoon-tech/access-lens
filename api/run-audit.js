import OpenAI from "openai";

/**
 * Get OpenAI API key from environment
 * Fails gracefully with clear error if missing
 */
function getOpenAIApiKey() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    const error = new Error(
      'OPENAI_API_KEY is required but is not set. ' +
      'Please configure this environment variable in your deployment settings.'
    )
    error.name = 'ConfigError'
    error.missingVar = 'OPENAI_API_KEY'
    throw error
  }

  return apiKey.trim()
}

export async function POST(req) {
  try {
    // Validate API key before processing request
    const apiKey = getOpenAIApiKey()

    const { input } = await req.json();

    if (!input || input.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No input provided." }),
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `
You are Access Lens, a WCAG 2.2 accessibility auditor.

INPUT:
${input}

Return JSON:
{
  "issues": [
    {
      "id": "string",
      "title": "string",
      "severity": "low | med | high",
      "details": "string",
      "fixes": ["string"]
    }
  ]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    return new Response(
      response.choices[0].message.content,
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("LLM Error:", err);

    // Handle configuration errors with clear message
    if (err.name === 'ConfigError') {
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error",
          message: err.message,
          details: "Please contact the administrator or check server logs."
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({ 
        error: "LLM request failed.",
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

