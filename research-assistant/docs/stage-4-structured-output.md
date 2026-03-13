## What I built
Added Zod schema validation to all three agents forcing them
to return predictable JSON instead of free text.

## What I learned
- LLMs are non-deterministic — same prompt can return different structures
- Zod validates data shape and gives clear errors when it fails
- z.infer generates TypeScript types from schemas automatically
- Structured output unlocks filtering, storage, and reliable UI rendering

## What confused me at first
How Zod Works in the mix, what importance it has , turns out typescripts only works for 
type checking during build time. Zod works for type checking during run time 


## How the data flows
LLM response (raw string) → strip markdown → JSON.parse 
→ Zod validation → typed TypeScript object

## What I'd do differently
[fill in as you go]