import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";

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

        // TODO: temp "threadId"
        const threadId = "123";

        const conversationId = await ctx.db.insert("conversations", {
            threadId,
            organizationId: args.organizationId,
            contactSessionId: args.contactSessionId,
            status: "unresolved"
        });

        return conversationId;
    }
});