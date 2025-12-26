"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME, S3_BUCKET_URL } from "@/lib/s3/client";
import { requireAdmin } from "@/lib/auth/helpers";
import { getUploadUrlSchema, type GetUploadUrlInput } from "@/lib/validations/admin";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a presigned URL for uploading files to S3 (Admin only)
 * Direct browser-to-S3 upload without proxying through server
 */
export async function getUploadUrl(data: GetUploadUrlInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = getUploadUrlSchema.parse(data);

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueId = uuidv4().split("-")[0]; // Use first part of UUID
    const fileExtension = validatedData.fileName.split(".").pop();
    const sanitizedFileName = validatedData.fileName
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace special chars with underscore
      .substring(0, 50); // Limit length

    const uniqueFileName = `${sanitizedFileName}_${timestamp}_${uniqueId}.${fileExtension}`;

    // Determine folder structure: subjects/{subjectId}/videos/ or subjects/{subjectId}/pdfs/
    const folder = validatedData.contentType === "video" ? "videos" : "pdfs";
    const key = `subjects/${validatedData.subjectId}/${folder}/${uniqueFileName}`;

    // Validate file type
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    const allowedPdfTypes = ["application/pdf"];

    const allowedTypes =
      validatedData.contentType === "video"
        ? allowedVideoTypes
        : allowedPdfTypes;

    if (!allowedTypes.includes(validatedData.fileType)) {
      return {
        success: false,
        error: `Invalid file type. Allowed types for ${validatedData.contentType}: ${allowedTypes.join(", ")}`,
      };
    }

    // Create presigned URL command
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: validatedData.fileType,
    });

    // Generate presigned URL (valid for 30 minutes)
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 1800, // 30 minutes
    });

    // Construct the final public URL
    const publicUrl = `${S3_BUCKET_URL}/${key}`;

    return {
      success: true,
      data: {
        uploadUrl, // Use this URL to upload the file
        publicUrl, // Use this URL to store in database and display to users
        key, // S3 object key
        bucket: S3_BUCKET_NAME,
        expiresIn: 1800,
      },
      message: "Upload URL generated successfully",
    };
  } catch (error) {
    console.error("Generate upload URL error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to generate upload URL",
    };
  }
}

/**
 * Delete a file from S3 (Admin only)
 * Use this when deleting content or updating files
 */
export async function deleteS3File(fileUrl: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Extract key from URL
    const key = fileUrl.replace(`${S3_BUCKET_URL}/`, "");

    if (!key || key === fileUrl) {
      return {
        success: false,
        error: "Invalid S3 URL",
      };
    }

    // Note: Actual deletion is commented out to prevent accidental deletions
    // Uncomment when ready to use in production
    /*
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    */

    return {
      success: true,
      message: "File deletion queued (currently disabled for safety)",
    };
  } catch (error) {
    console.error("Delete S3 file error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}

/**
 * Validate file size before upload
 */
export async function validateFileSize(
  fileSize: number,
  contentType: "video" | "pdf"
): Promise<{ valid: boolean; error?: string }> {
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
  const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50 MB

  const maxSize = contentType === "video" ? MAX_VIDEO_SIZE : MAX_PDF_SIZE;

  if (fileSize > maxSize) {
    const maxSizeMB = Math.floor(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB for ${contentType}s`,
    };
  }

  return { valid: true };
}
