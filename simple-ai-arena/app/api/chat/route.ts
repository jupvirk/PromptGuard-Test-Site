import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Prevents Next.js from caching chat responses
export const dynamic = 'force-dynamic';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Simple AI Arena"
  }
});

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    
    // Updated to the permanent free routing slug
    const selectedModel = model || 'openrouter/free';

    const result = await generateText({
      model: openrouter.chat(selectedModel),
      messages,
    });

    return Response.json({ text: result.text });
    
  } catch (error: any) {
    console.error("OpenRouter API Error:", error.message || error);
    return Response.json({ text: `❌ API Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}