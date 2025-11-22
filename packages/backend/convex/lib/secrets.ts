import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
    },
});

const bucketName = process.env.S3_BUCKET_NAME ?? '';

type S3Body = Readable | Uint8Array | { transformToString: () => Promise<string>; };

const streamToString = async (body?: S3Body): Promise<string> => {
    if (!body) {
        return '';
    }

    if ('transformToString' in body) {
        return body.transformToString();
    }

    if (body instanceof Uint8Array) {
        return Buffer.from(body).toString('utf-8');
    }

    return new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        (body as Readable)
            .on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
            .on('error', reject)
            .on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
};

export const upsertSecret = async (
    secretName: string,
    secretValue: Record<string, unknown>,
) => {
    const body = JSON.stringify(secretValue);

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: secretName,
            Body: body,
            ContentType: 'application/json',
        }),
    );
};

export const getSecretValue = async (
    secretName: string,
): Promise<Record<string, unknown> | null> => {
    try {
        const result = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: secretName,
            }),
        );

        const content = await streamToString(result.Body as S3Body);
        return JSON.parse(content);
    } catch (error) {
        const err = error as { name?: string; $metadata?: { httpStatusCode?: number; }; };
        if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
            return null;
        }

        throw error;
    }
};
