import { z } from 'zod'

// What the orchestrator must return
export const OrchestratorSchema = z.object({
  searchQuery: z.string(),
  reasoning: z.string()  // why it chose this query — useful for debugging
})

// What each individual summary must look like
export const SummarySchema = z.object({
  title: z.string(),
  url: z.string(),
  keyPoint: z.string(),      // the single most important fact
  relevance: z.enum(['high', 'medium', 'low'])  // how relevant to the question
})

// Array of summaries
export const SummariesSchema = z.array(SummarySchema)

// What the final report must look like
export const ReportSchema = z.object({
  directAnswer: z.string(),         // 2-3 sentence direct answer
  keyFindings: z.array(z.string()), // bullet point findings
  conclusion: z.string(),           // closing thought
  sources: z.array(z.object({
    title: z.string(),
    url: z.string()
  }))
})

// Export the TypeScript types so you can use them across the project
export type OrchestratorOutput = z.infer<typeof OrchestratorSchema>
export type Summary = z.infer<typeof SummarySchema>
export type Report = z.infer<typeof ReportSchema>