# PromptGuard Test Site (Simple AI Arena)

> **Modern Multi-Model AI Arena & Client-Side PII Redaction Testbed**  
> Built with Next.js 16, React 19, Tailwind CSS 4, and the Vercel AI SDK.

---

## Overview

**PromptGuard Test Site (Simple AI Arena)** is a lightweight, responsive testing ground and AI chat arena designed to evaluate model responses and audit client-side prompt security tooling. 

It serves as the dedicated counterpart to **PromptGuard Redactor** extensions (such as [Test-Site-Redactor](../Test-Site-Redactor) and [GPT-Redactor](../GPT-Redactor)), providing developers with an observable environment to verify that sensitive Personally Identifiable Information (PII) is intercepted, tokenized, and cleanly restored without leaking over the wire.

```
+-----------------------------------------------------------------------------------------+
|                                PROMPTGUARD TEST ECOSYSTEM                               |
|                                                                                         |
|       [ Browser Extension ]                             [ Simple AI Arena ]             |
|       Test-Site-Redactor                                Next.js 16 + React 19           |
|                │                                                  │                     |
|                ▼                                                  ▼                     |
|     Intercepts & Tokenizes PII                         Receives Tokenized Prompts       |
|     (e.g., {{EMAIL_1}}, {{NAME_1}})                       over HTTP POST /api/chat      |
|                │                                                  │                     |
|                │                                                  ▼                     |
|                │                                      [ Unified AI Gateway ]            |
|                │                                     Groq API & OpenRouter API          |
|                │                                                  │                     |
|                ▼                                                  ▼                     |
|     Live UI Restorer (DOM)                           LLM Model Response Generation      |
|     Restores {{...}} back to user UI                 (Groq Llama/GPT-OSS, Claude, GPT)  |
+-----------------------------------------------------------------------------------------+
```

---

## Features

- **Blazing-Fast Multi-Model Switching**  
  Switch seamlessly between ultra-fast free models and advanced frontier models:
  - **Groq (Free & Instant)**: OpenAI GPT-OSS 120B, OpenAI GPT-OSS 20B, Qwen 3.8 27B, Llama 3.3 70B.
  - **OpenRouter (Free Tier & Frontier)**: Auto-Select Free, Claude 3.5 Sonnet, GPT-4o, Llama 3.1 405B, Gemini 1.5 Pro.
- **Client-Side Redaction Auditing**  
  Specially structured with React 19 form inputs and dynamic message bubbles to test prototype property descriptor patching, event capture order, and `MutationObserver` token restoration in real time.
- **Modern Dark Glassmorphic Design**  
  Built with Tailwind CSS 4, featuring subtle gradients, pulsing status badges, syntax-aware font stacks, responsive drawer controls, and message copying.
- **Unified Vercel AI SDK Backend**  
  Clean API route implementation in Next.js App Router (`/api/chat`) utilizing `@ai-sdk/groq` and `@openrouter/ai-sdk-provider`.
- **Intuitive Ergonomics**  
  Supports `Enter` for instant submission, `Shift + Enter` for multiline input, auto-expanding message flows, and quick chat reset.

---

## Project Structure

```
PromptGuard-Test-Site/
├── simple-ai-arena/             # Main Next.js web application
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts     # Multi-provider chat endpoint (Groq / OpenRouter)
│   │   ├── globals.css          # Tailwind CSS 4 configuration and tokens
│   │   ├── layout.tsx           # Root application layout and font config
│   │   └── page.tsx             # Interactive Chat Arena frontend interface
│   ├── public/                  # Static assets
│   ├── package.json             # App dependencies & scripts
│   ├── tsconfig.json            # TypeScript configuration
│   └── README.md                # Subdirectory documentation
└── README.md                    # Root repository documentation
```

---

## Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or newer recommended)
- `npm` or `pnpm`
- An API key for [Groq](https://console.groq.com/) and/or [OpenRouter](https://openrouter.ai/) (free tiers available for both).

### 2. Setup Environment Variables

Navigate to the `simple-ai-arena` directory and configure your `.env.local` file:

```bash
cd simple-ai-arena
```

Create or edit `.env.local`:
```env
# Groq API Key (Free, provides ultra-fast inference)
GROQ_API_KEY=your_groq_api_key_here

# OpenRouter API Key (Supports free routing & premium models)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the arena.

---

## Testing with PromptGuard Redactor Extensions

To test client-side prompt redaction end-to-end:

1. Follow the setup instructions in [Test-Site-Redactor](../Test-Site-Redactor) to load the unpacked extension in Chrome.
2. Navigate to `http://localhost:3000`.
3. Open the **Console** and **Network** tabs in Chrome DevTools (`F12`).
4. Type a prompt containing sensitive data:
   > *"Hello, I am Marcus Vance and my telephone is (555) 234-5678. I attend Horizon Academy."*
5. Submit the form.
6. Verify the following:
   - **DevTools Console**: Logs show the intercepted original text, the tokenized text, and the local vault dictionary.
   - **DevTools Network Tab**: The POST payload to `/api/chat` contains only tokens (`{{INTRO_1}}`, `{{PHONE_1}}`, `{{SCHOOL_1}}`).
   - **User Interface**: Once the AI model replies containing those tokens, the extension's `MutationObserver` seamlessly decodes them on your screen.

---

## Available Free Models

| Provider | Model Name | Speed Profile |
| **Groq** | OpenAI GPT-OSS 120B | Ultra-Fast |
| **Groq** | OpenAI GPT-OSS 20B | Instant |
| **Groq** | Qwen 3.8 27B | Fast |
| **OpenRouter** | OpenRouter Free (Auto) | Standard |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
