import { S3Client } from "@aws-sdk/client-s3";

// Validate required environment variables
if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is not set in environment variables");
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID is not set in environment variables");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY is not set in environment variables");
}

if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error("AWS_S3_BUCKET_NAME is not set in environment variables");
}

// Create S3 client instance
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Export bucket name for convenience
export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
export const S3_BUCKET_URL = process.env.AWS_S3_BUCKET_URL || `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
