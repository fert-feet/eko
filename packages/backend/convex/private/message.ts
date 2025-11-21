import { saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { generateText } from "ai";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agent/supportAgent";
import { glm } from "../../glm-provider/glm-provider";
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from "../system/ai/constants";

export const enhanceResponse = action({
    args: {
        prompt: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const response = await generateText({
            model: glm("glm-4.5-flash"),
            messages: [
                {
                    role: "system",
                    content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT
                },
                {
                    role: "user",
                    content: args.prompt
                }
            ],
                    providerOptions: {
                        glm: {
                            thinking: {
                                type: "disabled"
                            }
                        }
                    }
        });
        return response.text;
    }
});


// 使用 "mutation" 而不是 "action"，是因为这里不使用 ai，因为我们是管理员，我们直接回复消息
export const create = mutation({
    args: {
        prompt: v.string(),
        conversationId: v.id("conversations")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }

        if (conversation.organizationId !== organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid organization ID",
            });
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation resolved"
            });
        }

        if (conversation.status === "unresolved") {
            await ctx.db.patch(args.conversationId, { status: "escalated" });
        }

        // 不使用 ai，而是管理员回复
        await saveMessage(ctx, components.agent, {
            threadId: conversation.threadId,
            // TODO: Check if "agentName" is needed or not
            agentName: identity.familyName,
            message: {
                role: "assistant",
                content: args.prompt
            }
        });
    }
});

export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const conversation = await ctx.db
            .query("conversations")
            .withIndex("by_thread_id", (q) =>
                q
                    .eq("threadId", args.threadId)
            )
            .unique();

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }

        if (conversation.organizationId !== organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid organization ID",
            });
        }

        const paginated = await supportAgent.listMessages(ctx, {
            threadId: args.threadId,
            paginationOpts: args.paginationOpts
        });

        return paginated;

    }
});