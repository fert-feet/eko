import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agent/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";

/**
 * 分页查询指定联系人会话下的所有对话，且为每个对话附加最新一条消息
 * @param {Object} args - 查询参数
 * @param {v.id("contactSessions")} args.contactSessionId - 联系人会话ID（关联contactSessions集合）
 * @param {paginationOptsValidator} args.paginationOpts - 分页配置（numItems: 每页条数, cursor: 下一页游标）
 * @returns {Object} 分页结果：包含带最新消息的对话数组、分页游标、是否有更多数据
 */
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

                const messages = await supportAgent.listMessages(ctx, {
                    threadId: conversation.threadId,

                    // 加载最新条消息，1 页，一条数据
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