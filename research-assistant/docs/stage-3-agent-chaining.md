## What I built
A three agent pipeline where each agent has one focused job.
Data flows from raw question → search query → raw results 
→ summaries → final report.

## What I learned
- Focused agents with tight prompts outperform one big prompt
- Promise.all runs multiple LLM calls in parallel
- Data transforms shape at each stage of the chain
- System prompts are where the agent's "personality" lives

## What confused me at first
how the agents will talk o each other, further more how will they wait for one response to get that output as input for the next agent. 
How will the agent know how to search the web 


## How the data flows
Question → orchestrator → search query → Tavily → 
raw results → summarizer → summaries → writer → report

## What I'd do differently
[fill in as you go]