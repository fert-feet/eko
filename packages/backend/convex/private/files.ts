import { contentHashFromArrayBuffer, Entry, EntryId, guessMimeTypeFromContents, guessMimeTypeFromExtension, vEntryId } from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { internal } from "../_generated/api";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes) ||
        "application/octet-stream"
    );
}

export const deleteFile = mutation({
    args: {
        entryId: vEntryId
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

        const namespace = await rag.getNamespace(ctx, {
            namespace: organizationId
        });

        if (!namespace) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Namespace",
            });
        }

        const entry = await rag.getEntry(ctx, {
            entryId: args.entryId
        });

        if (!entry) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Entry not found",
            });
        }

        if (entry.metadata?.uploadedBy !== organizationId) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Invalid Organization ID",
            });
        }

        if (entry.metadata?.storageId) {
            await ctx.storage.delete(entry.metadata?.storageId as Id<"_storage">);
        }

        await rag.deleteAsync(ctx, {
            entryId: args.entryId
        });
    }
});

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

        const subscriptions = await ctx.runQuery(
            internal.system.subscription.getByOrganizationId,
            {
                organizationId: organizationId
            }
        )

        if (subscriptions?.status !== "active") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Missing subscription",
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

        const { entryId, created } = await rag.add(ctx, {
            // namespace 很重要！文件要在不同组织之间隔离！
            namespace: organizationId,
            text,
            key: filename,
            title: filename,
            metadata: {
                storageId,
                uploadedBy: organizationId,
                filename,
                category: category ?? null
            } as EntryMetadata,

            // 防止重复上传
            contentHash: await contentHashFromArrayBuffer(bytes)
        });

        if (!created) {
            console.log("Entry already exists!");
            await ctx.storage.delete(storageId);
        }

        return {
            url: await ctx.storage.getUrl(storageId),
            entryId
        };

    }
});

export const list = query({
    args: {
        category: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
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


        const namespace = await rag.getNamespace(ctx, {
            namespace: organizationId
        });

        if (!namespace) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await rag.list(ctx, {
            namespaceId: namespace.namespaceId,
            paginationOpts: args.paginationOpts
        });

        const files = await Promise.all(
            results.page.map((entry) => convertEntryToPublicFile(ctx, entry))
        );

        const filteredFiles = args.category
            ? files.filter((file) => file.category === args.category)
            : files;

        return {
            page: filteredFiles,
            isDone: results.isDone,
            continueCursor: results.continueCursor
        };
    }
});

export type PublicFile = {
    id: EntryId;
    name: string;
    type: string;
    size: string;
    status: "ready" | "processing" | "error";
    url: string | null;
    category?: string;
};

type EntryMetadata = {
    storageId: Id<"_storage">;
    uploadedBy: string;
    filename: string;
    category: string | null;
};

async function convertEntryToPublicFile(
    ctx: QueryCtx,
    entry: Entry,
): Promise<PublicFile> {
    const metadata = entry.metadata as EntryMetadata | undefined;
    const storageId = metadata?.storageId;

    let fileSize = "unknow";

    if (storageId) {
        try {
            const storageMetadata = await ctx.db.system.get(storageId);

            if (storageMetadata) {
                fileSize = formatFileSize(storageMetadata.size);
            }
        } catch (error) {
            console.error("Failed to get storage metadata: ", error);
        }
    }

    const filename = entry.key || "Unknow";
    const extension = filename.split(".").pop()?.toLowerCase() || "txt";

    let status: "ready" | "processing" | "error" = "error";

    if (entry.status === "ready") {
        status = "ready";
    } else if (entry.status === "pending") {
        status = "processing";
    }

    const url = storageId ? await ctx.storage.getUrl(storageId) : null;

    return {
        id: entry.entryId,
        name: filename,
        type: extension,
        size: fileSize,
        status,
        url,
        category: metadata?.category || undefined
    };
}

/**
 * 将字节数 (Bytes) 转换为人类可读的文件大小字符串
 * 例如: 1536 -> "1.5 KB"
 * 
 * @param bytes - 文件的大小（字节）
 * @returns 格式化后的字符串 (如 "1.5 KB", "2 MB")
 */
function formatFileSize(bytes: number): string {
    // 1. 边界处理：如果不处理 0，下面的 Math.log(0) 会得到 -Infinity
    if (bytes === 0) {
        return "0 B";
    }

    // 2. 定义进制基数：计算机存储通常使用 1024 (2^10) 而非 1000
    const k = 1024;

    // 3. 定义单位层级
    // 注意：如果预期有 TB 级文件，需要在此数组后添加 "TB"
    const sizes = ["B", "KB", "MB", "GB"];

    // 4. 核心计算：确定单位层级 (i)
    // Math.log(bytes) / Math.log(k) 等同于求 "以 1024 为底 bytes 的对数"
    // 结果向下取整，0=B, 1=KB, 2=MB, 3=GB
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // 5. 格式化数值并拼接单位
    // (bytes / k ** i): 将原始字节除以对应层级的基数 (如除以 1024^2 得到 MB)
    // .toFixed(1): 保留 1 位小数 (字符串)，如 "1.5" 或 "2.0"
    // Number.parseFloat(): 巧妙去除末尾多余的 ".0" (例如 "2.0" 变回数字 2)
    return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}