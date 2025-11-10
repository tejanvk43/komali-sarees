import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucket = process.env.AWS_S3_BUCKET;
const bucketUrl = process.env.AWS_S3_BUCKET_URL;

if (!bucket || !bucketUrl) {
  console.warn("⚠️  AWS S3 not configured. Image uploads will be disabled.");
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string = "image/jpeg"
): Promise<string> {
  if (!bucket) {
    throw new Error("AWS S3 bucket not configured");
  }

  const key = `products/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  });

  try {
    await s3Client.send(command);
    return `${bucketUrl}/${key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload image to S3");
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!bucket || !imageUrl.includes(bucket)) {
    return; // Skip if not an S3 URL
  }

  try {
    const key = imageUrl.replace(`${bucketUrl}/`, "");
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("S3 delete error:", error);
    // Don't throw - deletion failures shouldn't block operations
  }
}

export function getPublicImageUrl(key: string): string {
  if (!bucketUrl) {
    throw new Error("AWS S3 bucket URL not configured");
  }
  return `${bucketUrl}/${key}`;
}
