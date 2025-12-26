"use server";

import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createExamTypeSchema,
  updateExamTypeSchema,
  type CreateExamTypeInput,
  type UpdateExamTypeInput
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all exam types
 */
export async function getExamTypes() {
  try {
    const examTypes = await db
      .select()
      .from(schema.examTypes)
      .orderBy(schema.examTypes.createdAt);

    return {
      success: true,
      data: examTypes,
    };
  } catch (error) {
    console.error("Get exam types error:", error);
    return {
      success: false,
      error: "Failed to fetch exam types",
    };
  }
}

/**
 * Get exam types by stream ID
 */
export async function getExamTypesByStream(streamId: string) {
  try {
    const examTypes = await db
      .select()
      .from(schema.examTypes)
      .where(eq(schema.examTypes.streamId, streamId))
      .orderBy(schema.examTypes.name);

    return {
      success: true,
      data: examTypes,
    };
  } catch (error) {
    console.error("Get exam types by stream error:", error);
    return {
      success: false,
      error: "Failed to fetch exam types",
    };
  }
}

/**
 * Get a single exam type by ID
 */
export async function getExamTypeById(id: string) {
  try {
    const [examType] = await db
      .select()
      .from(schema.examTypes)
      .where(eq(schema.examTypes.id, id))
      .limit(1);

    if (!examType) {
      return {
        success: false,
        error: "Exam type not found",
      };
    }

    return {
      success: true,
      data: examType,
    };
  } catch (error) {
    console.error("Get exam type error:", error);
    return {
      success: false,
      error: "Failed to fetch exam type",
    };
  }
}

/**
 * Create a new exam type (Admin only)
 */
export async function createExamType(data: CreateExamTypeInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = createExamTypeSchema.parse(data);

    // Check if stream exists
    const [stream] = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.id, validatedData.streamId))
      .limit(1);

    if (!stream) {
      return {
        success: false,
        error: "Learning stream not found",
      };
    }

    // Check if exam type with same name exists in this stream (unique constraint)
    const existing = await db
      .select()
      .from(schema.examTypes)
      .where(
        and(
          eq(schema.examTypes.streamId, validatedData.streamId),
          eq(schema.examTypes.name, validatedData.name)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        error: "An exam type with this name already exists in this stream",
      };
    }

    // Create the exam type
    const [newExamType] = await db
      .insert(schema.examTypes)
      .values({
        streamId: validatedData.streamId,
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .returning();

    // Revalidate the admin exam types page
    revalidatePath("/admin/exam-types");

    return {
      success: true,
      data: newExamType,
      message: "Exam type created successfully",
    };
  } catch (error) {
    console.error("Create exam type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create exam type",
    };
  }
}

/**
 * Update an existing exam type (Admin only)
 */
export async function updateExamType(data: UpdateExamTypeInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = updateExamTypeSchema.parse(data);

    // Check if exam type exists
    const [existing] = await db
      .select()
      .from(schema.examTypes)
      .where(eq(schema.examTypes.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Exam type not found",
      };
    }

    // Check if stream exists
    const [stream] = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.id, validatedData.streamId))
      .limit(1);

    if (!stream) {
      return {
        success: false,
        error: "Learning stream not found",
      };
    }

    // Check if new name conflicts with another exam type in the same stream
    const nameConflict = await db
      .select()
      .from(schema.examTypes)
      .where(
        and(
          eq(schema.examTypes.streamId, validatedData.streamId),
          eq(schema.examTypes.name, validatedData.name)
        )
      )
      .limit(1);

    if (nameConflict.length > 0 && nameConflict[0].id !== validatedData.id) {
      return {
        success: false,
        error: "An exam type with this name already exists in this stream",
      };
    }

    // Update the exam type
    const [updatedExamType] = await db
      .update(schema.examTypes)
      .set({
        streamId: validatedData.streamId,
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .where(eq(schema.examTypes.id, validatedData.id))
      .returning();

    // Revalidate the admin exam types page
    revalidatePath("/admin/exam-types");

    return {
      success: true,
      data: updatedExamType,
      message: "Exam type updated successfully",
    };
  } catch (error) {
    console.error("Update exam type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update exam type",
    };
  }
}

/**
 * Delete an exam type (Admin only)
 */
export async function deleteExamType(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Check if exam type exists
    const [existing] = await db
      .select()
      .from(schema.examTypes)
      .where(eq(schema.examTypes.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Exam type not found",
      };
    }

    // Check if exam type has associated subjects
    const subjects = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.examTypeId, id))
      .limit(1);

    if (subjects.length > 0) {
      return {
        success: false,
        error: "Cannot delete exam type with associated subjects. Please delete or reassign subjects first.",
      };
    }

    // Delete the exam type
    await db
      .delete(schema.examTypes)
      .where(eq(schema.examTypes.id, id));

    // Revalidate the admin exam types page
    revalidatePath("/admin/exam-types");

    return {
      success: true,
      message: "Exam type deleted successfully",
    };
  } catch (error) {
    console.error("Delete exam type error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete exam type",
    };
  }
}
