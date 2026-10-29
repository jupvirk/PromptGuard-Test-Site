# 🏟️ Simple AI Arena (PromptGuard Test Site)

This is the Next.js application powering the **PromptGuard Test Site**, an interactive arena built to evaluate and benchmark LLM response quality while stress-testing client-side prompt privacy and PII redaction extensions.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & State**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`ai` v7)
- **Inference Providers**:
  - [`@ai-sdk/groq`](https://github.com/vercel/ai/tree/main/packages/groq)
  - [`@openrouter/ai-sdk-provider`](https://github.com/OpenRouterTeam/openrouter-runner)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quickstart

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in this directory:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start chatting and testing.

---

## 🧪 Testing with PromptGuard Redactor

This app is designed to work in conjunction with the [Test-Site-Redactor](../../Test-Site-Redactor) Chrome extension. Load the extension in your browser to observe:
- Capture-phase form submission interception
- React 19 synthetic event state synchronization
- Client-side PII replacement before network transit to `/api/chat`
- Real-time response token decoding via `MutationObserver`
