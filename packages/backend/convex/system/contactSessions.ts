import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

// convex 内部方法
export const getOne = internalQuery({
    args: {
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.contactSessionId)
    }
})