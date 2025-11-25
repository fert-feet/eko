import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

const AUTO_REFRESH_THRESHOLD_MS = 2 * 60 * 60 * 1000 
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// convex 内部方法
export const getOne = internalQuery({
    args: {
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.contactSessionId)
    }
})

export const refresh = internalMutation({
    args: {
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId)

        if (!contactSession) {
            return new ConvexError({
                code: "NOT_FOUND",
                message: "Contact session not found"
            })
        }

        if (contactSession.expiresAt < Date.now()) {
            return new ConvexError({
                code: "BAD_REQUEST",
                message: "Contact session expired"
            })
        }

        const timeRemaining = contactSession.expiresAt - Date.now()

        if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
            const newExpiredAt = Date.now() + SESSION_DURATION_MS      

            await ctx.db.patch(args.contactSessionId, {
                expiresAt: newExpiredAt
            })

            return { ...contactSession, expiresAt: newExpiredAt}
        }

        return contactSession
    }
})