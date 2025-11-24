import { ConvexError } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { getSecretValue, parseSecretSrting } from "../lib/secrets";
import { VapiClient } from "@vapi-ai/server-sdk";

export const getPhoneNumbers = action({
    args: {

    },
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

        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdAndService,
            {
                organizationId,
                service: "vapi"
            }
        );

        if (!plugin) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Plugin not found",
            });
        }

        const secretName = plugin.secretName;
        const secret = await getSecretValue(secretName);
        const secretData = parseSecretSrting<{
            publicApiKey: string;
            privateApiKey: string;
        }>(secret);

        if (!secretData) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Credentials not found",
            });
        }

        if (!secretData.privateApiKey || !secretData.publicApiKey) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Credentials incomplete.",
            });
        }

        const vapiClient = new VapiClient({
            token: secretData.privateApiKey
        });

        const phoneNumbers = await vapiClient.phoneNumbers.list();

        return phoneNumbers
    }
});

export const getAssistants = action({
    args: {

    },
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

        const plugin = await ctx.runQuery(
            internal.system.plugins.getByOrganizationIdAndService,
            {
                organizationId,
                service: "vapi"
            }
        );

        if (!plugin) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Plugin not found",
            });
        }

        const secretName = plugin.secretName;
        const secret = await getSecretValue(secretName);
        const secretData = parseSecretSrting<{
            publicApiKey: string;
            privateApiKey: string;
        }>(secret);

        // TODO: remove this test log
        console.log(JSON.stringify(secretData));

        if (!secretData) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Credentials not found",
            });
        }

        if (!secretData.privateApiKey || !secretData.publicApiKey) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Credentials incomplete.",
            });
        }

        const vapiClient = new VapiClient({
            token: secretData.privateApiKey
        });

        const assistans = await vapiClient.assistants.list();
        
        return assistans
    }
});