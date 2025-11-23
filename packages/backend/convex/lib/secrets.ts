import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';
import { CompactEncrypt, compactDecrypt } from 'jose';

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? '',
        secretAccessKey: process.env.S3_SECRET_KEY ?? '',
    },
});

const bucketName = process.env.S3_BUCKET_NAME ?? '';

const getKey = () => {
    const keyString = process.env.S3_ENCRYPTION_KEY;
    if (!keyString) {
        throw new Error('Missing environment variable: S3_ENCRYPTION_KEY');
    }
    return new TextEncoder().encode(keyString);
};

type S3Body = Readable | Uint8Array | { transformToString: () => Promise<string>; };

const streamToString = async (body?: S3Body): Promise<string> => {
    if (!body) {
        return '';
    }

    if ('transformToString' in body) {
        return body.transformToString();
    }

    if (body instanceof Uint8Array) {
        return new TextDecoder().decode(body);
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
    const jsonContent = JSON.stringify(secretValue);
    
    const encryptedJwt = await new CompactEncrypt(new TextEncoder().encode(jsonContent))
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(getKey());

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: secretName,
            Body: encryptedJwt,
            ContentType: 'application/jose', 
        }),
    );
};

export const getSecretValue = async (
    secretName: string,
): Promise<string | null> => {
    try {
        const result = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: secretName,
            }),
        );

        const jweString = await streamToString(result.Body as S3Body);
        
        if (!jweString) return null;

        const { plaintext } = await compactDecrypt(jweString, getKey());
        
        const decodedString = new TextDecoder().decode(plaintext);

        return decodedString;
    } catch (error) {
        const err = error as { name?: string; $metadata?: { httpStatusCode?: number; }; };
        
        if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
            return null;
        }

        throw error;
    }
};

export function parseSecretSrting<T = Record<string, unknown>>(
    secret: string | null
): T | null {
    if (!secret) {
        return null 
    }

    try {
        return JSON.parse(secret) as T
    } catch {
        return null
    }
}