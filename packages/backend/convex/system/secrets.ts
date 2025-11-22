import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const upsert = internalAction({
    args: {
        organizationId: v.string(),
        service: v.union(v.literal("vapi")),
        value: v.any()
    },
    handler: async (ctx, args) => {
        const secretName = `tenant/${args.organizationId}/${args.service}`

        // TODO: 插入密钥
        // await upsertSecret(secretName, args.value)

        await ctx.runMutation(
            internal.system.plugins.upsert,
            {
                service: args.service,
                secretName: secretName,
                organizationId: args.organizationId
            }
        )

        return {status: "success"}
    }
})