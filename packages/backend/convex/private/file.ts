import { ConvexError, convexToJson, v } from "convex/values";
import { action } from "../_generated/server";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension } from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes) ||
        "application/octet-stream"
    );
}

export const addFile = action({
    args: {
        filename: v.string(),
        mimeType: v.string(),
        bytes: v.bytes(),
        category: v.optional(v.string())
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

        const { bytes, filename, category } = args;

        const mimeType = args.mimeType || guessMimeType(filename, bytes);
        const blob = new Blob([bytes], { type: mimeType });

        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContent(ctx, {
            storageId,
            filename,
            bytes,
            mimeType
        });

        const {} = await rag.add(ctx, {
            // namespace 很重要！文件要在不同组织之间隔离！
            namespace: organizationId,
            text,
            key: filename,
            title: filename,
            metadata: {
                storageId,
                filename,
                category: category ?? null
            },

            // 防止重复上传
            contentHash: await contentHashFromArrayBuffer(bytes)
        })


    }
}); 