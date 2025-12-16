import OpenAI from "openai";

export async function POST(req) {
  try {
    const { input } = await req.json();

    if (!input || input.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No input provided." }),
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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

    return new Response(
      JSON.stringify({ error: "LLM request failed." }),
      { status: 500 }
    );
  }
}

