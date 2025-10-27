import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTest = query({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.db.query("users").collect();
        return user
    }
});