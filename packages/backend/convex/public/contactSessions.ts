import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        organizationId: v.string(),
        expiresAt: v.number(),
        metadata: v.optional(v.object({
            userAgent: v.optional(v.string()),
            language: v.optional(v.string()),
            languages: v.optional(v.string()),
            platform: v.optional(v.string()),
            vendor: v.optional(v.string()),
            screenResolution: v.optional(v.string()),
            viewportSize: v.optional(v.string()),
            timezone: v.optional(v.string()),
            timezoneOffset: v.optional(v.number()),
            cookieEnabled: v.optional(v.boolean()),
            referrer: v.optional(v.string()),
            currentUrl: v.optional(v.string()),
        }))
    },
    handler: async (ctx, args) => {
        return;
    }
});