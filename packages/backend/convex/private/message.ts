import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { action, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agent/supportAgent";

export const create = action({
    args: {
        contactSessionId: v.id("contactSessions"),
        threadId: v.string(),
        prompt: v.string()
    },
    handler: async (ctx, args) => {
        const session = await ctx.runQuery(
            internal.system.contactSessions.getOne,
            {
                contactSessionId: args.contactSessionId,
            }
        );

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid session"
            });
        }

        // 在 action 中不能直接查，要使用内部方法
        const conversation = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {
                threadId: args.threadId
            }
        );

        if (!conversation) {
            throw new ConvexError({
                code: "NOT FOUNT",
                message: "Conversation not found"
            });
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation resolved"
            });
        }

        await supportAgent.generateText(
            ctx,
            {
                threadId: args.threadId
            },
            {
                prompt: args.prompt
            }
        );
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
        .unique()

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