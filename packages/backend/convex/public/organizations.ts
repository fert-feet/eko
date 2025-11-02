import { createClerkClient } from "@clerk/backend";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || ""
});

export const validate = mutation({
    args: {
        organizationId: v.string()
    },
    handler: async (_, args) => {
        try {
            await clerkClient.organizations.getOrganization({
                organizationId: args.organizationId
            });
        } catch {
            return { valid: false, reason: "Organization not found" };
        }
    }
});