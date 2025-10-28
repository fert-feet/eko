import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTest = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new Error("Missing organization")
        }

        const user = await ctx.db.query("users").collect();
        return user;
    }
});