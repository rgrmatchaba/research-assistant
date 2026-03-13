## What I built
A basic Express server that accepts a question and returns an 
answer from a local LLM via Ollama.

## What I learned
- LLMs are just APIs that take messages and return text
- System prompts set the AI's behavior, user prompts are the input
- Ollama runs models locally so no API key or cost needed
- The response lives at response.message.content
- The LLM responds with trainig data, this is not internet data and it is not up to date. 

## What confused me at first
The difference between system prompts and user prompts 

## How the data flows
POST /ask → Express → Ollama SDK → llama3.2 model → response → JSON back to client

## What I'd do differently
Nothing yet 