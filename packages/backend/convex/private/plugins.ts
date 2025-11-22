import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export const getOne = query({
    args: {
        service: v.union(v.literal("vapi"))
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
        return await ctx.db
            .query("plugins")
            .withIndex("by_organization_id_and_service", (q) =>
                q
                    .eq("organizationId", organizationId)
                    .eq("service", args.service)
            )
            .unique();
    }
});