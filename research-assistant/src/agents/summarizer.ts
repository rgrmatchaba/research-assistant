import { Ollama } from "ollama";
import { SummarySchema, Summary} from '../schema'
import { parseAgentOutput } from '../utils/parseJSON'
import { chat } from '../llm/client'

const ollama = new Ollama();


//Defines what a single search result looks like coming in 
interface SearchResult {
    title: string,
    url: string,
    content: string
}


//defines whata summray looks like going out
// interface Summary {
//     title: string,
//     url: string,
//     summary: string,
// }


export async function summarize(results: SearchResult[]): Promise<Summary[]> {
    console.log(`\n📝 Summarizer: condensing ${results.length} results...`);

    // Run all summaries in parallel - much faster than one by one
//     const summaries: Summary[] = await Promise.all(
//         results.map(async (result) => {
//             const response = await ollama.chat({
//                 model: 'llama3.2',
//                 messages: [
//                     {
//                         role: 'system',
//                         content: `You are an expert at condensing articles.
// Rules:
// - Summarize in exactly 2 sentences
// - Only include the most important facts
// - Be direct, no filler phrases like "This article discusses..."
// - Never include your own opinions`
//                     },
//                     {
//                         role: 'user',
//                         content: `Title: ${result.title}\n\nContent: ${result.content}`
//                     }
//                 ]
//             });

//             return {
//                 title: result.title,
//                 url: result.url,
//                 summary: response.message.content.trim(),
//             };
//         })
//     );

  const parsed = await Promise.all(
    results.map(async (result, index) => {
      const response = await chat(
        
        [
          {
            role: 'system',
            content: `You are an expert at condensing articles.
            You MUST respond with valid JSON only. No explanation, no markdown.
            
            Return exactly this structure:
            {
              "title": "article title",
              "url": "article url",
              "keyPoint": "the single most important fact in one sentence",
              "relevance": "high" or "medium" or "low"
            }`
          },
          {
            role: 'user',
            content: `Title: ${result.title}
            URL: ${result.url}
            Content: ${result.content}`
          }
        ]
      )

      try {
        return parseAgentOutput(response.content, SummarySchema)
      } catch (err) {
        console.error('Summarizer JSON parse failed for result', index, err)
        return null
      }
    })
  )

  const summaries = parsed.filter((s): s is Summary => s !== null)
    
     // Only keep high and medium relevance results
  // This is where you can filter noise before it reaches the writer
  const relevant = summaries.filter(s => s.relevance !== 'low')
  console.log(`✅ Summarizer: ${relevant.length}/${summaries.length} results were relevant`)

  return relevant
}