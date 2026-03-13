import { Ollama } from "ollama";
import { OrchestratorSchema, OrchestratorOutput } from '../schema'
import { parseAgentOutput } from '../utils/parseJSON'
import { chat } from '../llm/client'

const ollama = new Ollama();

export async function orchestrate(question: string): Promise<OrchestratorOutput> {
    console.log('\n🧠 Orchestrator: deciding what to search for...')

    const response = await chat(
        
         [
            {
                role: "system",
                content: `You are a search query expert.
                You MUST respond with valid JSON only. No explanation, no markdown.
        
                    Return exactly this structure:
                    {
                    "searchQuery": "the search query string",
                    "reasoning": "why you chose this query"
                    }
        
                    Your ONLY job is to convert a user's question into the best possible search query.
                    Rules:        
                    - No explanation, no punctuation, no quotes
                    - Make it specific enough to find relevant recent results
                    - Maximum 8 words`
            },
            {
                role: "user",
                content: question
            }
        ],
    )
     // Validate and parse — throws if the shape is wrong
  const output = parseAgentOutput(response.content, OrchestratorSchema)
  console.log(`🔍 Search query: "${output.searchQuery}"`)
  console.log(`💭 Reasoning: "${output.reasoning}"`)

  return output

}