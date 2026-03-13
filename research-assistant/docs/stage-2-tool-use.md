## What I built
Added web search capability — the LLM can now decide to search 
the web and use real results to answer questions.

## What I learned
- Tool use is a two round trip conversation with the LLM
- The LLM never runs code itself — it just requests tool calls
- You pass results back as a "tool" role message
- The LLM decides whether to search based on the question type

## What confused me at first
[fill in as you go]

## How the data flows
Question → LLM (round 1) → tool call request → 
Tavily search → results → LLM (round 2) → final answer

## What I'd do differently
[fill in as you go]