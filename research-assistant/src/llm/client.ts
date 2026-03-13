import {Ollama} from 'ollama'
import {Groq} from 'groq-sdk'

// The shape every agent expects back from a chat call
export interface LLMResponse {
  content: string
}

// One function that works regardless of provider
export async function chat(
  messages: { role: 'system' | 'user' | 'assistant', content: string }[],
  options?: { temperature?: number }
): Promise<LLMResponse> {
  const provider = process.env.LLM_PROVIDER || 'ollama'

  if (provider === 'groq') {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',  // fast, free Groq model
      messages,
      temperature: options?.temperature ?? 0.1,
      max_tokens: 2048
    })

    const choice = response.choices && response.choices[0]
    const content = choice?.message?.content ?? ''
    return { content }
  }

  // Default to Ollama for local development
  const ollama = new Ollama()
  const response = await ollama.chat({
    model: 'llama3.2',
    messages,
    options: { temperature: options?.temperature ?? 0.1 }
  })

  return { content: response.message.content }
}

// Streaming version
export async function* chatStream(
  messages: { role: 'system' | 'user' | 'assistant', content: string }[],
  options?: { temperature?: number }
): AsyncGenerator<string> {
  const provider = process.env.LLM_PROVIDER || 'ollama'

  if (provider === 'groq') {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: options?.temperature ?? 0.4,
      max_tokens: 2048,
      stream: true
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content
      if (token) yield token
    }

    return
  }

  // Ollama streaming for local dev
  const ollama = new Ollama()
  const stream = await ollama.chat({
    model: 'llama3.2',
    messages,
    options: { temperature: options?.temperature ?? 0.4 },
    stream: true
  })

  for await (const chunk of stream) {
    const token = chunk.message.content
    if (token) yield token
  }
}