"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createLearningStreamSchema,
  updateLearningStreamSchema,
  type CreateLearningStreamInput,
  type UpdateLearningStreamInput
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all learning streams
 */
export async function getLearningStreams() {
  try {
    const streams = await db
      .select()
      .from(schema.learningStreams)
      .orderBy(schema.learningStreams.createdAt);

    return {
      success: true,
      data: streams,
    };
  } catch (error) {
    console.error("Get learning streams error:", error);
    return {
      success: false,
      error: "Failed to fetch learning streams",
    };
  }
}

/**
 * Get a single learning stream by ID
 */
export async function getLearningStreamById(id: string) {
  try {
    const [stream] = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.id, id))
      .limit(1);

    if (!stream) {
      return {
        success: false,
        error: "Learning stream not found",
      };
    }

    return {
      success: true,
      data: stream,
    };
  } catch (error) {
    console.error("Get learning stream error:", error);
    return {
      success: false,
      error: "Failed to fetch learning stream",
    };
  }
}

/**
 * Create a new learning stream (Admin only)
 */
export async function createLearningStream(data: CreateLearningStreamInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = createLearningStreamSchema.parse(data);

    // Check if stream with same name already exists
    const existing = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.name, validatedData.name))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        error: "A learning stream with this name already exists",
      };
    }

    // Create the stream
    const [newStream] = await db
      .insert(schema.learningStreams)
      .values({
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .returning();

    // Revalidate the admin streams page
    revalidatePath("/admin/streams");

    return {
      success: true,
      data: newStream,
      message: "Learning stream created successfully",
    };
  } catch (error) {
    console.error("Create learning stream error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create learning stream",
    };
  }
}

/**
 * Update an existing learning stream (Admin only)
 */
export async function updateLearningStream(data: UpdateLearningStreamInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = updateLearningStreamSchema.parse(data);

    // Check if stream exists
    const [existing] = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Learning stream not found",
      };
    }

    // Check if new name conflicts with another stream
    const nameConflict = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.name, validatedData.name))
      .limit(1);

    if (nameConflict.length > 0 && nameConflict[0].id !== validatedData.id) {
      return {
        success: false,
        error: "A learning stream with this name already exists",
      };
    }

    // Update the stream
    const [updatedStream] = await db
      .update(schema.learningStreams)
      .set({
        name: validatedData.name,
        description: validatedData.description || null,
      })
      .where(eq(schema.learningStreams.id, validatedData.id))
      .returning();

    // Revalidate the admin streams page
    revalidatePath("/admin/streams");

    return {
      success: true,
      data: updatedStream,
      message: "Learning stream updated successfully",
    };
  } catch (error) {
    console.error("Update learning stream error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update learning stream",
    };
  }
}

/**
 * Delete a learning stream (Admin only)
 */
export async function deleteLearningStream(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Check if stream exists
    const [existing] = await db
      .select()
      .from(schema.learningStreams)
      .where(eq(schema.learningStreams.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Learning stream not found",
      };
    }

    // Check if stream has associated subjects
    const subjects = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.streamId, id))
      .limit(1);

    if (subjects.length > 0) {
      return {
        success: false,
        error: "Cannot delete stream with associated subjects. Please delete or reassign subjects first.",
      };
    }

    // Delete the stream
    await db
      .delete(schema.learningStreams)
      .where(eq(schema.learningStreams.id, id));

    // Revalidate the admin streams page
    revalidatePath("/admin/streams");

    return {
      success: true,
      message: "Learning stream deleted successfully",
    };
  } catch (error) {
    console.error("Delete learning stream error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete learning stream",
    };
  }
}
