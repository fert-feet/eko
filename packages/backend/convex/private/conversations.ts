import { MessageDoc } from "@convex-dev/agent";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { supportAgent } from "../system/ai/agent/supportAgent";

export const getMany = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.union(
            v.literal("unresolved"),
            v.literal("escalated"),
            v.literal("resolved"),
            v.null()
        ),
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

        let conversations: PaginationResult<Doc<"conversations">>;

        if (args.status) {
            conversations = await ctx.db
                .query("conversations")
                .withIndex("by_status_and_organization_id", (q) =>
                    q
                        .eq(
                            "status",
                            args.status as Doc<"conversations">["status"]
                        )
                        .eq("organizationId", organizationId)
                )
                .order("desc")
                .paginate(args.paginationOpts);
        } else {
            conversations = await ctx.db
                .query("conversations")
                .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
                .order("desc")
                .paginate(args.paginationOpts);
        }

        const conversationWithAdditionalData = await Promise.all(
            conversations.page.map(async (conversation) => {
                let lastMessage: MessageDoc | null = null;

                const contactSession = await ctx.db.get(conversation.contactSessionId);

                if (!contactSession) {
                    return null;
                }

                const messages = await supportAgent.listMessages(ctx, {
                    threadId: conversation.threadId,
                    paginationOpts: { numItems: 1, cursor: null }
                });

                if (messages.page.length > 0) {
                    lastMessage = messages.page[0] ?? null;
                }

                return {
                    ...conversation,
                    lastMessage,
                    contactSession
                };
            })
        );

        const validConversations = conversationWithAdditionalData.filter(
            // "conv is NonNullable<typeof conv>" 是类型守卫（type guard），表示通过过滤的元素一定不是 "Null"
            (conv): conv is NonNullable<typeof conv> => conv !== null
        );

        return {
            ...conversations,
            page: validConversations
        };
    }
});

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
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

        const contactSession = await ctx.db.get(conversation.contactSessionId);

        if (!contactSession) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Contact session not found",
            });
        }

        return {
            ...conversation,
            contactSession
        };

    }
});
