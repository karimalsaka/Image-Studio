import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

    let s3Client: S3Client | null = null;

    function getS3Client() {
        if (!s3Client) {
            s3Client = new S3Client({
                region: process.env.AWS_REGION!,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                },
            });
        }
        return s3Client;
    }

    export async function uploadImage(base64Url: string, filename: string):
    Promise<string> {
        const s3 = getS3Client();
        const bucket = process.env.S3_BUCKET_NAME!;

        const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        await s3.send(new PutObjectCommand({
            Bucket: bucket,
            Key: `images/${filename}`,
            Body: buffer,
            ContentType: 'image/png',
        }));

        return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/images/${filename}`;
    }

    export async function imageUrlToBase64(url: string): Promise<string> {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    }
