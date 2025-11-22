import { vEntryId } from "@convex-dev/rag";
import { ConvexError, v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import rag from "../system/ai/rag";
import { internal } from "../_generated/api";

export const upsert = mutation({
    args: {
        service: v.union(v.literal("vapi")),
        value: v.any()
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

        // TODO: Check for subscription

        await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
            service: args.service,
            organizationId: organizationId,
            value: args.value
        });
    }
});
