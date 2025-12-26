"use server";

import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { requireAdmin, getCurrentUserId } from "@/lib/auth/helpers";
import {
  createSubjectContentSchema,
  updateSubjectContentSchema,
  type CreateSubjectContentInput,
  type UpdateSubjectContentInput
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all contents for a subject
 */
export async function getSubjectContents(subjectId: string) {
  try {
    const contents = await db
      .select({
        content: schema.subjectContents,
        contentType: schema.contentTypes,
      })
      .from(schema.subjectContents)
      .leftJoin(schema.contentTypes, eq(schema.subjectContents.contentTypeId, schema.contentTypes.id))
      .where(eq(schema.subjectContents.subjectId, subjectId))
      .orderBy(schema.subjectContents.sortOrder, schema.subjectContents.createdAt);

    return {
      success: true,
      data: contents,
    };
  } catch (error) {
    console.error("Get subject contents error:", error);
    return {
      success: false,
      error: "Failed to fetch subject contents",
    };
  }
}

/**
 * Get active contents for a subject (for learners)
 * Also checks if user has access to the content
 */
export async function getActiveSubjectContents(subjectId: string) {
  try {
    const userId = await getCurrentUserId();

    const contents = await db
      .select({
        content: schema.subjectContents,
        contentType: schema.contentTypes,
      })
      .from(schema.subjectContents)
      .leftJoin(schema.contentTypes, eq(schema.subjectContents.contentTypeId, schema.contentTypes.id))
      .where(
        and(
          eq(schema.subjectContents.subjectId, subjectId),
          eq(schema.subjectContents.isActive, true)
        )
      )
      .orderBy(schema.subjectContents.sortOrder, schema.subjectContents.createdAt);

    // If user is logged in, check access for each content
    if (userId) {
      const contentsWithAccess = await Promise.all(
        contents.map(async (item) => {
          const hasAccess = await checkUserContentAccess(
            userId,
            subjectId,
            item.content.contentTypeId
          );
          return {
            ...item,
            hasAccess,
          };
        })
      );

      return {
        success: true,
        data: contentsWithAccess,
      };
    }

    // Not logged in - all content locked
    return {
      success: true,
      data: contents.map((item) => ({
        ...item,
        hasAccess: false,
      })),
    };
  } catch (error) {
    console.error("Get active subject contents error:", error);
    return {
      success: false,
      error: "Failed to fetch subject contents",
    };
  }
}

/**
 * Check if user has access to specific content
 */
async function checkUserContentAccess(
  userId: string,
  subjectId: string,
  contentTypeId: string
): Promise<boolean> {
  try {
    const access = await db
      .select()
      .from(schema.userAccess)
      .where(
        and(
          eq(schema.userAccess.userId, userId),
          eq(schema.userAccess.subjectId, subjectId),
          eq(schema.userAccess.contentTypeId, contentTypeId)
        )
      )
      .limit(1);

    return access.length > 0;
  } catch (error) {
    console.error("Check user content access error:", error);
    return false;
  }
}

/**
 * Get a single content by ID
 */
export async function getSubjectContentById(id: string) {
  try {
    const [result] = await db
      .select({
        content: schema.subjectContents,
        contentType: schema.contentTypes,
        subject: schema.subjects,
      })
      .from(schema.subjectContents)
      .leftJoin(schema.contentTypes, eq(schema.subjectContents.contentTypeId, schema.contentTypes.id))
      .leftJoin(schema.subjects, eq(schema.subjectContents.subjectId, schema.subjects.id))
      .where(eq(schema.subjectContents.id, id))
      .limit(1);

    if (!result) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Get subject content error:", error);
    return {
      success: false,
      error: "Failed to fetch content",
    };
  }
}

/**
 * Create new subject content (Admin only)
 */
export async function createSubjectContent(data: CreateSubjectContentInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = createSubjectContentSchema.parse(data);

    // Check if subject exists
    const [subject] = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, validatedData.subjectId))
      .limit(1);

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Check if content type exists
    const [contentType] = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.id, validatedData.contentTypeId))
      .limit(1);

    if (!contentType) {
      return {
        success: false,
        error: "Content type not found",
      };
    }

    // Create the content
    const [newContent] = await db
      .insert(schema.subjectContents)
      .values({
        subjectId: validatedData.subjectId,
        contentTypeId: validatedData.contentTypeId,
        title: validatedData.title,
        description: validatedData.description || null,
        fileUrl: validatedData.fileUrl || null,
        duration: validatedData.duration || null,
        price: validatedData.price,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
      })
      .returning();

    // Revalidate relevant pages
    revalidatePath("/admin/content");
    revalidatePath(`/admin/courses/${validatedData.subjectId}`);
    revalidatePath(`/courses/${validatedData.subjectId}`);

    return {
      success: true,
      data: newContent,
      message: "Content created successfully",
    };
  } catch (error) {
    console.error("Create subject content error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create content",
    };
  }
}

/**
 * Update existing subject content (Admin only)
 */
export async function updateSubjectContent(data: UpdateSubjectContentInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = updateSubjectContentSchema.parse(data);

    // Check if content exists
    const [existing] = await db
      .select()
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    // Check if subject exists
    const [subject] = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, validatedData.subjectId))
      .limit(1);

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Check if content type exists
    const [contentType] = await db
      .select()
      .from(schema.contentTypes)
      .where(eq(schema.contentTypes.id, validatedData.contentTypeId))
      .limit(1);

    if (!contentType) {
      return {
        success: false,
        error: "Content type not found",
      };
    }

    // Update the content
    const [updatedContent] = await db
      .update(schema.subjectContents)
      .set({
        subjectId: validatedData.subjectId,
        contentTypeId: validatedData.contentTypeId,
        title: validatedData.title,
        description: validatedData.description || null,
        fileUrl: validatedData.fileUrl || null,
        duration: validatedData.duration || null,
        price: validatedData.price,
        sortOrder: validatedData.sortOrder,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.subjectContents.id, validatedData.id))
      .returning();

    // Revalidate relevant pages
    revalidatePath("/admin/content");
    revalidatePath(`/admin/courses/${validatedData.subjectId}`);
    revalidatePath(`/courses/${validatedData.subjectId}`);

    return {
      success: true,
      data: updatedContent,
      message: "Content updated successfully",
    };
  } catch (error) {
    console.error("Update subject content error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update content",
    };
  }
}

/**
 * Delete subject content (Admin only)
 */
export async function deleteSubjectContent(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Check if content exists
    const [existing] = await db
      .select()
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    // Delete the content
    await db
      .delete(schema.subjectContents)
      .where(eq(schema.subjectContents.id, id));

    // Revalidate relevant pages
    revalidatePath("/admin/content");
    revalidatePath(`/admin/courses/${existing.subjectId}`);
    revalidatePath(`/courses/${existing.subjectId}`);

    return {
      success: true,
      message: "Content deleted successfully",
    };
  } catch (error) {
    console.error("Delete subject content error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete content",
    };
  }
}

/**
 * Toggle content active status (Admin only)
 */
export async function toggleContentStatus(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Get current status
    const [content] = await db
      .select()
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.id, id))
      .limit(1);

    if (!content) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    // Toggle status
    const [updatedContent] = await db
      .update(schema.subjectContents)
      .set({
        isActive: !content.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.subjectContents.id, id))
      .returning();

    // Revalidate relevant pages
    revalidatePath("/admin/content");
    revalidatePath(`/admin/courses/${content.subjectId}`);
    revalidatePath(`/courses/${content.subjectId}`);

    return {
      success: true,
      data: updatedContent,
      message: `Content ${updatedContent.isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Toggle content status error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to toggle content status",
    };
  }
}

/**
 * Reorder subject contents (Admin only)
 */
export async function reorderSubjectContents(
  subjectId: string,
  contentIds: string[]
) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Update sort order for each content
    await Promise.all(
      contentIds.map((id, index) =>
        db
          .update(schema.subjectContents)
          .set({ sortOrder: index })
          .where(
            and(
              eq(schema.subjectContents.id, id),
              eq(schema.subjectContents.subjectId, subjectId)
            )
          )
      )
    );

    // Revalidate relevant pages
    revalidatePath("/admin/content");
    revalidatePath(`/admin/courses/${subjectId}`);
    revalidatePath(`/courses/${subjectId}`);

    return {
      success: true,
      message: "Content reordered successfully",
    };
  } catch (error) {
    console.error("Reorder contents error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to reorder contents",
    };
  }
}
