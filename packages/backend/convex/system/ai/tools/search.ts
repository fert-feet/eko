import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import rag from "../rag";
import { generateText } from "ai";
import { glm } from "../../../../glm-provider/glm-provider";
import { supportAgent } from "../agent/supportAgent";

export const search = createTool({
    description: "Search the knowledge base for relevant information to help answer user questions",
    args: z.object({
        query: z
            .string()
            .describe("The search query to find relevant information")
    }),
    handler: async (ctx, args) => {
        if (!ctx.threadId) {
            return "Missing thread ID";
        }

        const conversation = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            { threadId: ctx.threadId }
        );

        if (!conversation) {
            return "Conversation not found";
        }

        const orgId = conversation.organizationId;

        const searchResult = await rag.search(ctx, {
            namespace: orgId,
            query: args.query,
            limit: 5
        });

        // Example output (final content of contextText):
        // Found results in Scrambled Eggs with Tomatoes Recipe,Braised Pork Secrets. Here is the context:
        // 
        // Fry eggs first, then tomatoes, add a pinch of sugar to balance sourness;
        // Braise pork with cold water for blanching, simmer on low heat for 1 hour;
        // Add a spoonful of vinegar to rice for better taste
        const contextText = `Found results in ${searchResult.entries
            .map((e) => e.title || null)
            .filter((t) => t !== null)
            .join(",")}. Here is the context:\n\n${searchResult.text}`;

        const response = await generateText({
            messages: [
                {
                    role: "system",
                    content: "You interpret knowledge base search results and provide helpful, accurate answers to user questions",
                },
                // 这是说给 ai 听的
                {
                    role: "user",
                    content: `User asked: ${args.query}\n\nSearch results: ${contextText}`
                }
            ],
            model: glm("glm-4.5-flash")
        });

        await supportAgent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message: {
                role: "assistant",
                content: response.text
            }
        });

        return response.text;
    }
});