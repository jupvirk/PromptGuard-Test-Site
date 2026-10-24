'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ShieldCheck, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  AlertTriangle, 
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ModelOption {
  id: string;
  name: string;
  provider: 'Groq' | 'OpenRouter';
  tier: 'Free' | 'Paid';
  speed: 'Ultra-Fast' | 'Instant' | 'Fast' | 'Standard';
  tag?: string;
}

const MODELS: ModelOption[] = [
  // --- Blazing Fast Free Models (via Groq) ---
  { 
    id: 'groq/openai/gpt-oss-120b', 
    name: 'Groq: OpenAI GPT-OSS 120B (Ultra-Fast)', 
    provider: 'Groq', 
    tier: 'Free', 
    speed: 'Ultra-Fast',
    tag: 'Recommended'
  },
  { 
    id: 'groq/openai/gpt-oss-20b', 
    name: 'Groq: OpenAI GPT-OSS 20B (Instant)', 
    provider: 'Groq', 
    tier: 'Free', 
    speed: 'Instant' 
  },
  { 
    id: 'groq/qwen/qwen3.8-27b', 
    name: 'Groq: Qwen 3.8 27B (Fast)', 
    provider: 'Groq', 
    tier: 'Free', 
    speed: 'Fast' 
  },

  // --- Free OpenRouter Models ---
  { 
    id: 'openrouter/free', 
    name: 'OpenRouter Free (Auto-Select)', 
    provider: 'OpenRouter', 
    tier: 'Free', 
    speed: 'Standard' 
  },

  // --- Paid Models (Require OpenRouter Account Balance) ---
  { 
    id: 'anthropic/claude-3.5-sonnet', 
    name: 'Claude 3.5 Sonnet (Paid)', 
    provider: 'OpenRouter', 
    tier: 'Paid', 
    speed: 'Standard' 
  },
  { 
    id: 'openai/gpt-4o', 
    name: 'GPT-4o (Paid)', 
    provider: 'OpenRouter', 
    tier: 'Paid', 
    speed: 'Standard' 
  },
  { 
    id: 'meta-llama/llama-3.1-405b-instruct', 
    name: 'Llama 3.1 405B (Paid)', 
    provider: 'OpenRouter', 
    tier: 'Paid', 
    speed: 'Standard' 
  },
  { 
    id: 'google/gemini-1.5-pro', 
    name: 'Gemini 1.5 Pro (Paid)', 
    provider: 'OpenRouter', 
    tier: 'Paid', 
    speed: 'Standard' 
  }
];

export default function ChatArena() {
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: timeStr,
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
          content: response.ok ? data.text : (data.text || "❌ Request Failed."),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: `❌ Fetch Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#08090e] text-slate-100 font-sans antialiased overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Professional Header */}
      <header className="flex-none bg-[#0c0e15]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3 z-20 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Redactor Testing Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  PromptGuard
                  <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 border border-emerald-500/20 font-semibold tracking-wider">
                    TEST SITE
                  </span>
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  REDACTOR ACTIVE • {messages.length} {messages.length === 1 ? 'MESSAGE' : 'MESSAGES'}
                </span>
              </div>
            </div>
          </div>

          {/* Model Selector & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none text-slate-400">
                {currentModel.provider === 'Groq' ? (
                  <Zap className="h-4 w-4 text-amber-400" />
                ) : (
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                )}
              </div>

              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="pl-9 pr-8 py-2 bg-[#131722] hover:bg-[#181d2c] border border-white/[0.12] focus:border-indigo-500/80 rounded-xl text-sm font-medium text-slate-200 outline-none transition-all cursor-pointer shadow-inner appearance-none max-w-[240px] sm:max-w-[320px] truncate"
              >
                <optgroup label="⚡ Groq Ultra-Fast (Free)">
                  {MODELS.filter(m => m.provider === 'Groq').map((model) => (
                    <option key={model.id} value={model.id} className="bg-[#131722] text-slate-100">
                      {model.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌐 OpenRouter Models">
                  {MODELS.filter(m => m.provider === 'OpenRouter').map((model) => (
                    <option key={model.id} value={model.id} className="bg-[#131722] text-slate-100">
                      {model.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              <div className="absolute right-2.5 pointer-events-none text-slate-400">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
            </div>

            <button 
              onClick={startNewChat}
              type="button"
              title="Reset conversation session"
              className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.10] hover:border-white/[0.20] rounded-xl text-sm font-medium transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <RotateCcw className="h-4 w-4 text-slate-300" />
              <span className="hidden sm:inline">New Session</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Chat Stream Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 w-full bg-grid-pattern relative">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-between">
          
          {messages.length === 0 ? (
            /* Clean Sleek Empty State */
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
              
              <div className="relative mb-5">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-cyan-500/20 blur-xl opacity-75"></div>
                <div className="relative p-5 rounded-2xl bg-[#0f131f] border border-white/[0.1] shadow-2xl flex items-center justify-center">
                  <ShieldCheck className="h-10 w-10 text-emerald-400" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                PromptGuard Test Site
              </h2>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Test the site redactor by sending prompts with sensitive data (PII, names, emails, phone numbers) to verify redaction and monitor model outputs.
              </p>

            </div>
          ) : (
            /* Active Message Thread */
            <div className="space-y-6 pb-6">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                const isError = m.content.includes('❌');

                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group animate-in fade-in duration-300`}
                  >
                    
                    {/* Message Meta Info */}
                    <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-400 font-mono">
                      {isUser ? (
                        <>
                          <span>{m.timestamp || 'Prompt'}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-indigo-400 font-medium flex items-center gap-1">
                            <User className="h-3 w-3" /> You
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Bot className="h-3 w-3" /> {currentModel.name.split(' (')[0]}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{m.timestamp || 'Response'}</span>
                        </>
                      )}
                    </div>

                    {/* Message Bubble Card */}
                    <div className="relative max-w-[90%] sm:max-w-[85%]">
                      {isUser ? (
                        /* User Message Style */
                        <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-950/40 border border-indigo-400/20 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                          {m.content}
                        </div>
                      ) : isError ? (
                        /* Error Message Card */
                        <div className="p-4 rounded-2xl rounded-tl-sm bg-red-950/30 border border-red-500/30 text-red-200 shadow-lg shadow-red-950/30 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-400 flex-none mt-0.5" />
                          <div className="flex-1 font-mono text-xs sm:text-sm">
                            {m.content}
                          </div>
                        </div>
                      ) : (
                        /* Assistant Message Card */
                        <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-[#111420]/90 backdrop-blur-md border border-white/[0.09] text-slate-100 shadow-xl shadow-black/30 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                          {m.content}

                          {/* Quick Action Bar under assistant message */}
                          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono text-[11px] text-slate-400">
                              Response received • {currentModel.provider}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => copyToClipboard(m.content, m.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-slate-200 transition-colors border border-white/[0.05] cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}

              {/* Streaming/Loading Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Bot className="h-3 w-3" /> {currentModel.name.split(' (')[0]}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>Processing</span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-[#111420]/90 backdrop-blur-md border border-white/[0.09] shadow-xl flex items-center gap-3 text-slate-300">
                    <div className="flex gap-1.5 items-center">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">
                      Generating response...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>
      </main>

      {/* Elevated Fixed Bottom Input Bar */}
      <footer className="flex-none bg-[#090b10]/95 backdrop-blur-xl border-t border-white/[0.08] p-3 sm:p-4 z-20">
        <form onSubmit={onSubmit} className="max-w-4xl mx-auto flex flex-col gap-2">
          
          <div className="relative flex items-end gap-2 bg-[#121522] border border-white/[0.12] focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl p-2 transition-all shadow-xl shadow-black/40">
            
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to test PII redaction (names, emails, phone numbers, etc.)..."
              className="flex-1 max-h-36 min-h-[44px] p-2.5 bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none resize-none leading-relaxed font-sans"
              disabled={isLoading}
            />

            {/* Clear Input Button */}
            {input.length > 0 && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded-lg hover:bg-white/[0.06]"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-11 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 active:scale-95 flex-none"
              title="Send message (Enter)"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-semibold">Send</span>
            </button>
          </div>

          {/* Bottom Micro-Bar / Helper hints */}
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 font-mono">
            <span>
              Target: <strong className="text-slate-300">{currentModel.name.split(' (')[0]}</strong> ({currentModel.provider})
            </span>
            <span className="hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-300">Enter ↵</kbd> to send • <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-300">Shift + Enter</kbd> for newline
            </span>
          </div>

        </form>
      </footer>

    </div>
  );
}