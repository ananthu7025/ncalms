"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME, S3_BUCKET_URL } from "@/lib/s3/client";
import { requireAdmin } from "@/lib/auth/helpers";
import { v4 as uuidv4 } from "uuid";

export async function uploadSubjectImage(formData: FormData) {
    try {
        // Check admin authorization
        await requireAdmin();

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return { success: false, error: "Invalid file type. Only images are allowed." };
        }

        // Validate size (e.g., 5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return { success: false, error: "File size too large. Maximum 5MB allowed." };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const extension = file.name.split(".").pop() || "jpg";
        const fileName = `${uuidv4()}.${extension}`;

        // S3 key path
        const key = `images/subjects/${fileName}`;

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        // Construct public URL
        const publicUrl = `${S3_BUCKET_URL}/${key}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Subject image upload error:", error);
        return { success: false, error: "Failed to upload image" };
    }
}

export async function uploadBlogImage(formData: FormData) {
    try {
        // Check admin authorization
        await requireAdmin();

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return { success: false, error: "Invalid file type. Only images are allowed." };
        }

        // Validate size (e.g., 5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return { success: false, error: "File size too large. Maximum 5MB allowed." };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const extension = file.name.split(".").pop() || "jpg";
        const fileName = `${uuidv4()}.${extension}`;

        // S3 key path
        const key = `images/blog/${fileName}`;

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        // Construct public URL
        const publicUrl = `${S3_BUCKET_URL}/${key}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Blog image upload error:", error);
        return { success: false, error: "Failed to upload image" };
    }
}
