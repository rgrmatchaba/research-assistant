import { tavily } from "@tavily/core";
import * as dotenv from "dotenv";
import { setTraceSigInt } from "node:util";
dotenv.config();

const tavilyApiKey = process.env.TAVILY_API_KEY;

if (!tavilyApiKey) {
    throw new Error("TAVILY_API_KEY is not set in the environment");
}

const client = tavily({ apiKey: tavilyApiKey });

//this is he actual funnctions that hits the tavly api
export async function websearch(query: string) {
    console.log(`Searching the web for: ${query}`);

    const response = await client.search(query, {
        maxResults: 5, //get 5 articles back 
        searchDepth: "basic", //nly get the top 5 results, advanced would get more but is more expensive
    })

    return response.results.map((result:any) => ({
        title: result.title,
        url: result.url,
        content: result.content,
    }));
}