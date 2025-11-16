import vector_search from './similarity_search.js';
import * as z from "zod";  // Schema validation library
import { tool } from "@langchain/core/tools";  // LangChain tool creation function
import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import path from 'path';
import process from 'process';

// Set SSL certificate environment variables (like in your Python code)
const certPath = path.resolve('oneEGaDCA.crt');
process.env.SSL_CERT_FILE = certPath;
process.env.REQUESTS_CA_BUNDLE = certPath;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // For Node.js specifically

// Read netrc credentials
function getNetrcCredentials() {
    const netrcPath = path.resolve('.netrc');
    const netrcContent = fs.readFileSync(netrcPath, 'utf8');
    const parsed = netrc.parse(netrcContent);
    const credentials = parsed['llm.model'];
    return {
        apiKey: credentials.login,
        baseURL: credentials.password
    };
}

class Rag {
    constructor(query, document) {
        this.vector_search = vector_search;
        this.query = query;
        this.document = document;
    }

    get_tools() {
        const retrieveSchema = z.object({ query: z.string() });
        const retrieve = tool(
            async ({ }) => {
                // Use this.query from constructor instead of parameter
                const vector_search_instance = new vector_search(this.document, this.query);
                const retrievedDocs = await vector_search_instance.get_semanitc_search_values(2);
                const serialized = retrievedDocs.map(doc => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`).join("\n");
                return [serialized, retrievedDocs];
            },
            {
                name: "retrieve",
                description: "Retrieve information related to a query.",
                schema: retrieveSchema,
                responseFormat: "content_and_artifact"
            }
        );

        return retrieve;
    }

    get_model() {
        const { apiKey, baseURL } = getNetrcCredentials();
        const model = new ChatOpenAI({
            model: "LLaMA3.1-8b",
            temperature: 0,
            maxTokens: 1000,
            timeout: 90000,
            apiKey: apiKey,
            configuration: {
              baseURL: baseURL,
            },
        });
        return model;
    }

    async create_agent() {
        const tools = [this.get_tools()];
        const systemPrompt ="You have access to a tool that retrieves context from a blog post. Use the tool to help answer user queries."
        const agent = createAgent({ model: this.get_model(), tools, systemPrompt });
        let agentInputs = { messages: [{ role: "user", content: this.query }] };

        const stream = await agent.stream(agentInputs, {streamMode: "values",});
        for await (const step of stream) {
            const lastMessage = step.messages[step.messages.length - 1];
            const role = lastMessage.role || lastMessage._getType() || 'assistant';
            console.log(`[${role}]: ${lastMessage.content}`);
            console.log("-----\n");
        }
    }


}

export default Rag;