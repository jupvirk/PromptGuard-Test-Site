'use client';

import { useState } from 'react';
import { Send, PlusCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MODELS = [
  // The permanent free routing slug that never expires
  { id: 'openrouter/free', name: 'OpenRouter Free (Auto-Select)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Paid)' },
  { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B (Paid)' },
  { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro (Paid)' },
  { id: 'openai/gpt-4o', name: 'GPT-4o (Paid)' }
];

export default function ChatArena() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startNewChat = () => setMessages([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: response.ok ? data.text : (data.text || "❌ Request Failed.") 
        },
      ]);
      
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: `❌ Fetch Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Simple AI Arena</h1>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="p-2 border rounded-md bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-900"
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>

          <button 
            onClick={startNewChat}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
          >
            <PlusCircle size={18} />
            New Chat
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-lg">Select a model and start chatting.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-xl max-w-[85%] whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 
                  m.content.includes('❌') ? 'bg-red-50 border-red-200 text-red-700 border' :
                  'bg-white border shadow-sm text-gray-800'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-xl bg-white border shadow-sm text-gray-500 animate-pulse">
                  Generating response...
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="p-4 bg-white border-t">
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center cursor-pointer"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}