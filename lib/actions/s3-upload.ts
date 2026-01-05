"use server";

import { s3Client, S3_BUCKET_NAME, S3_BUCKET_URL } from "@/lib/s3/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin } from "@/lib/auth/helpers";
import { v4 as uuidv4 } from "uuid";

export async function getSyllabusUploadUrl(
    fileName: string,
    contentType: string
) {
    try {
        // Check admin authorization
        await requireAdmin();

        if (!fileName || !contentType) {
            return { success: false, error: "File name and content type are required" };
        }

        // Validate content type is PDF
        if (contentType !== "application/pdf") {
            return { success: false, error: "Only PDF files are allowed" };
        }

        // Create unique key
        const extension = fileName.split(".").pop() || "pdf";
        const key = `syllabus/${uuidv4()}.${extension}`;

        // Create command
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
            // ACL: "public-read", // Assuming bucket policy handles public access, or we can use Signed URLs to read too. keeping it simple for now as per public access pattern in local-upload.
        });

        // Generate signed URL
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Construct public URL (this assumes the bucket is public or behind CloudFront)
        // If S3_BUCKET_URL is set, use it, otherwise fallback to standard S3 URL
        const publicUrl = `${S3_BUCKET_URL}/${key}`;

        return {
            success: true,
            uploadUrl,
            publicUrl,
            key,
        };
    } catch (error) {
        console.error("Get S3 upload URL error:", error);
        return { success: false, error: "Failed to generate upload URL" };
    }
}
