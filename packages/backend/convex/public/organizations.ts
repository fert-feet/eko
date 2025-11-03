import { createClerkClient } from "@clerk/backend";
import { action, mutation } from "../_generated/server";
import { v } from "convex/values";

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY || ""
});

// third party sdk use action
export const validate = action({
    args: {
        organizationId: v.string()
    },
    handler: async (_, args) => {
        try {
            await clerkClient.organizations.getOrganization({
                organizationId: args.organizationId
            });

            return { valid: true };
        } catch {
            return { valid: false, reason: "Organization not valid" };
        }
    }
});