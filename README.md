## 🔍 Research Assistant

A multi-agent AI system that researches any topic in real time — 
 powered by 3 collaborating agents, streamed word by word.


[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://research-assistant-w3tf.onrender.com/)
[![GitHub](https://img.shields.io/badge/View-Code-blue)](https://github.com/rgrmatchaba/research-assistant)
[![Blog Post](https://img.shields.io/badge/Read-Blog_Post-orange)](https://dev.to/ruethedev)
[![Video Demo](https://img.shields.io/badge/Watch-Video_Demo-red)](https://www.loom.com/share/8954ebda56f3412f8ae279c95103eb35)

## What It Does

You type any research question. Three AI agents collaborate 
to produce a sourced, structured report in real time:

- **Orchestrator** reads your question and decides the 
  optimal search query
- **Summariser** fetches 5 live web results and condenses 
  each one to its key point
- **Writer** synthesises all summaries into a clean, 
  structured report — streamed word by word as it's generated

The result appears in your browser in real time, with 
clickable sources, exactly like watching someone research 
and write for you live.



## Architecture
```
User Question
      │
      ▼
┌─────────────────┐
│   Orchestrator  │  Converts question to optimal search query
│     Agent       │
└────────┬────────┘
         │ search query
         ▼
┌─────────────────┐
│   Tavily API    │  Returns 5 real web results
│  (Web Search)   │
└────────┬────────┘
         │ raw results
         ▼
┌─────────────────┐
│   Summariser    │  Condenses each result (runs in parallel)
│     Agent       │  Filters low-relevance sources
└────────┬────────┘
         │ structured summaries
         ▼
┌─────────────────┐
│     Writer      │  Synthesises final report
│     Agent       │  Streams output token by token
└────────┬────────┘
         │ token stream (SSE)
         ▼
    Browser UI
```



## Stack

| Layer | Technology | Purpose |
|---|---|---|
| Language | TypeScript | Type safety across the pipeline |
| Runtime | Node.js + Express | API server and SSE streaming |
| LLM (dev) | Ollama + llama3.2 | Free local model for development |
| LLM (prod) | Groq + llama3.1 | Free hosted API for production |
| Web Search | Tavily API | Real-time web results for agents |
| Validation | Zod | Runtime schema validation on LLM outputs |
| Deployment | Docker + Render | Containerised, free cloud deployment |




## Key Concepts Learned

**Tool Use & Function Calling**  
LLMs don't browse the internet — your code does. The LLM 
requests a tool call, your code executes it, results are 
passed back. Two round trips, not one.

**Non-Determinism & Structured Output**  
LLMs return different structures for the same prompt. 
Zod schema validation catches malformed output before 
it crashes the pipeline — TypeScript alone can't do this 
because it only validates at compile time, not runtime.

**Agent Chaining**  
Three focused agents with tight system prompts outperform 
one agent doing everything. Each agent has one job, 
one temperature setting, one output shape.

**Streaming Architecture**  
Async generators yield tokens one at a time as the LLM 
produces them. Server-Sent Events push each token to the 
browser immediately — no waiting for the full response.

**Local vs Production LLM Gap**  
Ollama is a local process — invisible inside Docker. 
Environment-based provider switching (Ollama in dev, 
Groq in prod) solved this with zero code changes.

## Run Locally

**Prerequisites:** Node.js 20+, Docker, Ollama installed

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/research-assistant.git
cd research-assistant
```

**2. Install dependencies**
```bash
npm install
```

**3. Pull the local model**
```bash
ollama pull llama3.2
```

**4. Set up environment variables**
```bash
cp .env.example .env
# Add your Tavily API key to .env
# Get a free key at tavily.com
```

**5. Start the server**
```bash
npm run dev
```

**6. Open the app**
```
http://localhost:3000
```


#API KEYS NEEDED 
LLM Provider — 'ollama' for local dev, 'groq' for production
LLM_PROVIDER=ollama

Required for web search — get free key at tavily.com
TAVILY_API_KEY=

Required if LLM_PROVIDER=groq — get free key at console.groq.com
GROQ_API_KEY=
```

## Author

Rue Matchaba  
Intermediate developer learning AI engineering in public.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue)](https://www.linkedin.com/in/rumbidzai-matchaba)
[![Blog](https://img.shields.io/badge/Blog-dev.to-black)](https://dev.to/ruethedev)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://research-assistant-w3tf.onrender.com/)

Built in one weekend as a first AI project. 
Zero AI experience before this.
