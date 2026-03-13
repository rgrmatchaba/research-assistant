import { Ollama } from "ollama";
import { ReportSchema, Report, Summary } from '../schema'
import { parseAgentOutput } from '../utils/parseJSON'
import { chat, chatStream } from '../llm/client'

const ollama = new Ollama();



export async function writeReport(
  question: string,
  summaries: Summary[]
): Promise<string> {
  console.log('\n✍️  Writer: generating final report...')

  // Format summaries into readable text for the LLM
  const formattedSources = formatSources(summaries);

  const response = await chat(
    buildMessages(question, formattedSources),
  
    { temperature: 0.4 },
    
  )

  return response.content;
}



// streaming version
export function writeReportStream(
  question: string,
  summaries: Summary[]
): AsyncGenerator<string> {
  const formattedSources = formatSources(summaries);

  return chatStream(
    buildMessages(question, formattedSources),
    { temperature: 0.4 }
  );
}


function formatSources(summaries: Summary[]): string {
  return summaries
    .map((s, i) => `Source ${i + 1}:\nTitle: ${s.title}\nKey point: ${s.keyPoint}\nURL: ${s.url}`)
    .join('\n\n')
}

function buildMessages(question: string, sources: string) {
  return [
    {
      role: 'system' as const,
      content: `You are a professional research analyst.
      Write clear, structured research reports based only on the sources provided.
      Use this structure:
      - Direct answer to the question (2-3 sentences)
      - Key Findings (bullet points)
      - Conclusion (one sentence)
      - Sources (list each URL)
      Never make up information not in the sources.`
    },
    {
      role: 'user' as const,
      content: `Question: ${question}\n\nSources:\n${sources}`
    }
  ]
}