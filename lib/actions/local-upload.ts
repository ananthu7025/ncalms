"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

        // Define path: public/images/subjects/
        const uploadDir = join(process.cwd(), "public", "images", "subjects");

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = join(uploadDir, fileName);

        // Write file
        await writeFile(filePath, buffer);

        const publicUrl = `/images/subjects/${fileName}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Local upload error:", error);
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

        // Define path: public/images/blog/
        const uploadDir = join(process.cwd(), "public", "images", "blog");

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const filePath = join(uploadDir, fileName);

        // Write file
        await writeFile(filePath, buffer);

        const publicUrl = `/images/blog/${fileName}`;

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Blog image upload error:", error);
        return { success: false, error: "Failed to upload image" };
    }
}
