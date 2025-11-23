import { paginationOptsValidator } from "convex/server";
import { v, ConvexError } from "convex/values";
import { query } from "../_generated/server";

export const getOne = query({
    args: {},
    handler: async (ctx) => {
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

        const widgetSettings = await ctx.db
            .query("widgetSettings")
            .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId));

        return widgetSettings;
    }
});