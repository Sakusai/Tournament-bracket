import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
    region : process.env.B2_REGION,
    endpoint : process.env.B2_ENDPOINT,
    credentials: {
        secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!,
        accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    },
    // B2 does not support checksums requests/responses
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
})

export async function uploadImage(logo: File) {
    const buffer = await logo.arrayBuffer();
    const params = {
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: `uploads/${Date.now()}-${logo.name}`,
        Body: buffer,
        // ContentType: file.mimetype,
    };
    try {
        await s3Client.send(new PutObjectCommand(params));
        return params.Key;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getLogoUrl(logoKey: string | null): Promise<string | null> {
    if (!logoKey) return null;

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: logoKey,
        });

        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error("Erreur lors de la génération de l'URL du logo", error);
        return null;
    }
}