import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agent/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
    args: {
        contactSessionId: v.id("contactSessions"),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });
        }

        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_contact_session_id", (q) =>
                q.eq("contactSessionId", args.contactSessionId)
            )
            .order("desc")
            .paginate(args.paginationOpts);

        const conversationsWithLastMessage = await Promise.all(
            conversations.page.map(async (conversation) => {
                let lastMessage: MessageDoc | null = null;

                // 根据 conversation 找每个对话的消息列表，按照一页一个排列
                const messages = await supportAgent.listMessages(ctx, {
                    threadId: conversation.threadId,
                    paginationOpts: { numItems: 1, cursor: null }
                });

                // 找到最后一条消息
                if (messages.page.length > 0) {
                    lastMessage = messages.page[0] ?? null
                }

                return {
                    _id: conversation._id,
                    _createTime: conversation._creationTime,
                    status: conversation.status,
                    organizationId: conversation.organizationId,
                    threadId: conversation.threadId,
                    lastMessage
                }
            })
        );
        
        // TODO: 还是不理解，需要进一步解释
        return {
            ...conversations,
            page: conversationsWithLastMessage
        }
    }
});

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSessions")
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });
        }

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            throw new ConvexError({
                code: "NOT FOUNT",
                message: "Conversation not found"
            });
        }

        if (conversation.contactSessionId !== session._id) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Incorrect session"
            });
        }

        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId,
        };
    }
});

export const create = mutation({
    args: {
        contactSessionId: v.id("contactSessions"),
        organizationId: v.string()
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });
        }

        const { threadId } = await supportAgent.createThread(ctx, {
            userId: args.organizationId
        });

        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",
                content: "Hello, how can i help you today?"
            }
        });

        const conversationId = await ctx.db.insert("conversations", {
            threadId,
            organizationId: args.organizationId,
            contactSessionId: args.contactSessionId,
            status: "unresolved"
        });

        return conversationId;
    }
});