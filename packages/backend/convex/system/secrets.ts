import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const upsert = internalAction({
    args: {
        organizationId: v.string(),
        service: v.union(v.literal("vapi")),
        value: v.any()
    },
    handler: async (ctx, args) => {
        const secretName = `tenant/${args.organizationId}/${args.service}`
    }
})