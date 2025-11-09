import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { table } from "console";

export const getTest = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new Error("Missing organization");
        }

        const user = await ctx.db.query("users").collect();
        return user;
    }
});

export const add = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new Error("Missing organization");
        }

        const user = await ctx.db.insert("users", {
            // TODO: Change this "test" name
            name: "test"
        })
        return user;
    }
});