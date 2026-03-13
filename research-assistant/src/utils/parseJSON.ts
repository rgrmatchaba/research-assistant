import { ZodSchema } from 'zod'

export function parseAgentOutput<T>(raw: string, schema: ZodSchema<T>): T {
  // Strip markdown code blocks if present
  // LLMs often return ```json { } ``` instead of just { }
  const cleaned = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  // Parse the JSON
  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error(`Agent returned invalid JSON:\n${cleaned}`)
  }

  // Validate against your schema
  const result = schema.safeParse(parsed)

  if (!result.success) {
    // Zod gives you very clear error messages about what's wrong
    throw new Error(`Agent output failed validation:\n${result.error.message}`)
  }

  return result.data
}