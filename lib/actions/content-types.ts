"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createContentTypeSchema,
  updateContentTypeSchema,
  type CreateContentTypeInput,
  type UpdateContentTypeInput
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all content types
 */
export async function getContentTypes() {
  try {
    const contentTypes = await db
      .select()
      .from(schema.contentTypes)
      .orderBy(schema.contentTypes.name);

    return {
      success: true,
      data: contentTypes,
    };
  } catch (error) {
    console.error("Get content types error:", error);
    return {
      success: false,
      error: "Failed to fetch content types",
    };
  }
}

/**
 * Get a single content type by ID
 */
export async function getContentTypeById(id: string) {
  try {
    const [contentType] = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.id, id))
      .limit(1);

    if (!contentType) {
      return {
        success: false,
        error: "Content type not found",
      };
    }

    return {
      success: true,
      data: contentType,
    };
  } catch (error) {
    console.error("Get content type error:", error);
    return {
      success: false,
      error: "Failed to fetch content type",
    };
  }
}

/**
 * Create a new content type (Admin only)
 */
export async function createContentType(data: CreateContentTypeInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = createContentTypeSchema.parse(data);

    // Check if content type with same name already exists
    const existing = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.name, validatedData.name))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        error: "A content type with this name already exists",
      };
    }

    // Create the content type
    const [newContentType] = await db
      .insert(schema.contentTypes)
      .values({
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .returning();

    // Revalidate the admin content types page
    revalidatePath("/admin/content-types");

    return {
      success: true,
      data: newContentType,
      message: "Content type created successfully",
    };
  } catch (error) {
    console.error("Create content type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create content type",
    };
  }
}

/**
 * Update an existing content type (Admin only)
 */
export async function updateContentType(data: UpdateContentTypeInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = updateContentTypeSchema.parse(data);

    // Check if content type exists
    const [existing] = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Content type not found",
      };
    }

    // Check if new name conflicts with another content type
    const nameConflict = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.name, validatedData.name))
      .limit(1);

    if (nameConflict.length > 0 && nameConflict[0].id !== validatedData.id) {
      return {
        success: false,
        error: "A content type with this name already exists",
      };
    }

    // Update the content type
    const [updatedContentType] = await db
      .update(schema.contentTypes)
      .set({
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .where(eq(schema.contentTypes.id, validatedData.id))
      .returning();

    // Revalidate the admin content types page
    revalidatePath("/admin/content-types");

    return {
      success: true,
      data: updatedContentType,
      message: "Content type updated successfully",
    };
  } catch (error) {
    console.error("Update content type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update content type",
    };
  }
}

/**
 * Delete a content type (Admin only)
 */
export async function deleteContentType(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Check if content type exists
    const [existing] = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Content type not found",
      };
    }

    // Check if content type has associated subject contents
    const subjectContents = await db
      .select()
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.contentTypeId, id))
      .limit(1);

    if (subjectContents.length > 0) {
      return {
        success: false,
        error: "Cannot delete content type with associated content. Please delete the content first.",
      };
    }

    // Delete the content type
    await db
      .delete(schema.contentTypes)
      .where(eq(schema.contentTypes.id, id));

    // Revalidate the admin content types page
    revalidatePath("/admin/content-types");

    return {
      success: true,
      message: "Content type deleted successfully",
    };
  } catch (error) {
    console.error("Delete content type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete content type",
    };
  }
}
