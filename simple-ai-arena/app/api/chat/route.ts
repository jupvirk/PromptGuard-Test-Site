import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createGroq } from '@ai-sdk/groq';
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

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    
    const selectedModel = model || 'groq/llama-3.3-70b-versatile';

    // Route to Groq or OpenRouter depending on the model prefix
    let modelInstance;
    if (selectedModel.startsWith('groq/')) {
      const groqModelId = selectedModel.replace('groq/', '');
      modelInstance = groq(groqModelId);
    } else {
      modelInstance = openrouter.chat(selectedModel);
    }

    const result = await generateText({
      model: modelInstance,
      messages,
    });

    return Response.json({ text: result.text });
    
  } catch (error: any) {
    console.error("AI API Error:", error.message || error);
    return Response.json({ text: `❌ API Error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}