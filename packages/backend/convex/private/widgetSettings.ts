import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const upsert = mutation({
    args: {
        greetMessage: v.string(),
        defaultSuggestions: v.object({
            suggestion1: v.optional(v.string()),
            suggestion2: v.optional(v.string()),
            suggestion3: v.optional(v.string()),
        }),
        vapiSettings: v.object({
            assistantId: v.optional(v.string()),
            phoneNumber: v.optional(v.string()),
        }),
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

        const existsWidgetSettings = await ctx.db
            .query("widgetSettings")
            .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
            .unique();

        if (existsWidgetSettings) {
            await ctx.db.patch(existsWidgetSettings._id, {
                greetMessage: args.greetMessage,
                defaultSuggestions: args.defaultSuggestions,
                vapiSettings: args.vapiSettings
            });
        } else {
            await ctx.db.insert("widgetSettings", {
                organizationId: organizationId,
                greetMessage: args.greetMessage,
                defaultSuggestions: args.defaultSuggestions,
                vapiSettings: args.vapiSettings
            })
        }
    }
});

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
            .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
            .unique();

        return widgetSettings;
    }
});