// This is NOT code that runs
// This is a description you give to the LLM so it knows what tools exist
export const toolDefinitions = [
    {
      type: 'function',
      function: {
        name: 'web_search',
        description: 'Search the web for current, up to date information on any topic. Use this when you need recent news or facts you might not know.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to look up'
            }
          },
          required: ['query']
        }
      }
    }
  ]