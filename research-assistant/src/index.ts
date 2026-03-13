import express from "express";
import cors from "cors";
import { Ollama } from "ollama";
import { websearch } from "./tools/search";
import { toolDefinitions } from './tools/definations'
import { orchestrate } from './agents/orchestrator'
import { summarize } from './agents/summarizer'
import { writeReport, writeReportStream } from './agents/writer'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config()

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve the static UI assets
app.use(express.static(path.join(__dirname, 'public')));
console.log('Serving static from:', path.join(__dirname, 'public'));

// Explicitly serve index.html at the root
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const ollama = new Ollama()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/ask', async (req, res) => {
    const {question} = req.body;

    console.log("Question:", question);
    try {

        //stage 1 : Orchestrator decides what to search
        const { searchQuery, reasoning } = await orchestrate(question)

        //stage 2 : search web 
        const rawResults = await websearch(searchQuery); // this is the tool

        // stage 3 : summarizer
        const summaries = await summarize(rawResults);

        //stage 4 : writer produces the final report 
        const report = await writeReport(question, summaries);

        // Send everything back
        res.json({
            question,
            searchQuery,
            reasoning,
            sourceCount: summaries.length,
            report  // { directAnswer, keyFindings, conclusion, sources }
          })

    }catch (error: any){
        console.error('Pipeline error:', error);
        res.status(500).json({ error: 'Something went wrong in the research pipeline' })
    }

//     const firstResponse  =  await  ollama.chat({
//         model: "llama3.2",
//         messages: [
//             {
//                 role: "system",
//                 content: "You are a helpful research assistant. Give clear, concise answers."
//             },
//             {
//                 role: "user",
//                 content: question
//             }
//         ],
//         tools: toolDefinitions  // LLM now knows about the web_search tool
//     })


//   console.log(`\n🤔 LLM decision: ${firstResponse.message.tool_calls ? 'wants to search' : 'answering directly'}`)

// // --- Check if LLM wants to use a tool ---
// if (firstResponse.message.tool_calls && firstResponse.message.tool_calls.length > 0) {
//     const toolCall = firstResponse.message.tool_calls[0];
//     const rawQuery = toolCall?.function.arguments.query;
//     const searchQuery =
//       typeof rawQuery === "string"
//         ? rawQuery
//         : rawQuery?.value ?? rawQuery?.query ?? String(rawQuery);

//     // --- YOUR CODE runs the actual search ---
//     const searchResults = await websearch(searchQuery);
//     console.log(`\n📰 Got ${searchResults.length} results back`)

//     const finalResponse = await ollama.chat({
//        model: "llama3.2",
//        messages: [
//         {
//             role: "system",
//             content: "You are a helpful research assistant. Give clear, concise answers."
//         },
//         {
//             role: "user",
//             content: question
//         },
//         {
//             role: "assistant",
//             content: firstResponse.message.content,
//             tool_calls: firstResponse.message.tool_calls
//         },
//         {
//             role: "tool",
//             content: JSON.stringify(searchResults),
//         }]
//     })
//     return res.json({
//         answer: finalResponse.message.content,
//         searchQuery,
//         sourceCount: searchResults.length
//       })

// }
// return res.json({
//     answer: firstResponse.message.content,
//     searchQuery: null,
//     sourceCount: 0
//   })

 });


 app.get('/ask/stream', async (req, res) => {
  const question = req.query.question as string

  if(!question) {
    res.status(400).json({error: 'Question is required'})
    return
  }

  // Set SSE headers — this tells the browser to keep the connection open
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')


   // Helper to send a chunk in SSE format
   const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }


  try {
       // Run the pipeline — these are fast so no streaming needed
       send({ type: 'status', message: 'Analysing your question...' })
       const { searchQuery, reasoning } = await orchestrate(question)
   
       send({ type: 'status', message: `Searching for: ${searchQuery}` })
       const rawResults = await websearch(searchQuery)
   
       send({ type: 'status', message: `Summarising ${rawResults.length} sources...` })
       const summaries = await summarize(rawResults)

       // Send metadata before streaming starts
      send({
        type: 'metadata',
        searchQuery,
        reasoning,
        sources: summaries.map(s => ({ title: s.title, url: s.url }))
      })

      send({ type: 'status', message: 'Writing report...' })

      // Stream the writer output token by token
      for await (const token of writeReportStream(question, summaries)) {
        send({ type: 'token', value: token })
      }

      // Signal to the browser that streaming is complete
      send({ type: 'done' })
      res.end()



  } catch (error) {
    console.error('Streaming pipeline error:', error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Pipeline failed'
    send({ type: 'error', message })
    res.end()
  }


 })