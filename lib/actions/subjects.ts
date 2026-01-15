"use server";

import { db, schema } from "@/lib/db";
import { eq, and, count, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createSubjectSchema,
  updateSubjectSchema,
  type CreateSubjectInput,
  type UpdateSubjectInput
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

/**
 * Get all subjects with related data
 */
export async function getSubjects() {
  try {
    const subjects = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .orderBy(schema.subjects.createdAt);

    return {
      success: true,
      data: subjects,
    };
  } catch (error) {
    console.error("Get subjects error:", error);
    return {
      success: false,
      error: "Failed to fetch subjects",
    };
  }
}

/**
 * Get active subjects (for learner browsing)
 */
export async function getActiveSubjects() {
  try {
    const subjects = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .where(eq(schema.subjects.isActive, true))
      .orderBy(schema.subjects.title);

    return {
      success: true,
      data: subjects,
    };
  } catch (error) {
    console.error("Get active subjects error:", error);
    return {
      success: false,
      error: "Failed to fetch subjects",
    };
  }
}

/**
 * Get subjects by stream ID
 */
export async function getSubjectsByStream(streamId: string) {
  try {
    const subjects = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .where(
        and(
          eq(schema.subjects.streamId, streamId),
          eq(schema.subjects.isActive, true)
        )
      )
      .orderBy(schema.subjects.title);

    return {
      success: true,
      data: subjects,
    };
  } catch (error) {
    console.error("Get subjects by stream error:", error);
    return {
      success: false,
      error: "Failed to fetch subjects",
    };
  }
}

/**
 * Get a single subject by ID with all related data
 */
export async function getSubjectById(id: string) {
  try {
    const [result] = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .where(eq(schema.subjects.id, id))
      .limit(1);

    if (!result) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Get associated contents count
    const contents = await db
      .select()
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.subjectId, id));

    // Get pricing for all content types for this subject
    const pricing = await db
      .select({
        contentTypeId: schema.subjectContentTypePricing.contentTypeId,
        price: schema.subjectContentTypePricing.price,
      })
      .from(schema.subjectContentTypePricing)
      .where(eq(schema.subjectContentTypePricing.subjectId, id));

    return {
      success: true,
      data: {
        ...result,
        contentsCount: contents.length,
        pricing,
      },
    };
  } catch (error) {
    console.error("Get subject error:", error);
    return {
      success: false,
      error: "Failed to fetch subject",
    };
  }
}

/**
 * Create a new subject (Admin only)
 */
export async function createSubject(data: CreateSubjectInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = createSubjectSchema.parse(data);

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

    // If exam type is provided, verify it exists and belongs to the stream
    if (validatedData.examTypeId) {
      const [examType] = await db
        .select()
        .from(schema.examTypes)
        .where(eq(schema.examTypes.id, validatedData.examTypeId))
        .limit(1);

      if (!examType) {
        return {
          success: false,
          error: "Exam type not found",
        };
      }

      if (examType.streamId !== validatedData.streamId) {
        return {
          success: false,
          error: "Exam type does not belong to the selected stream",
        };
      }
    }

    // Create the subject
    const [newSubject] = await db
      .insert(schema.subjects)
      .values({
        title: validatedData.title,
        description: validatedData.description || null,
        thumbnail: validatedData.thumbnail || null,
        demoVideoUrl: validatedData.demoVideoUrl || null,
        streamId: validatedData.streamId,
        examTypeId: validatedData.examTypeId || null,
        bundlePrice: validatedData.bundlePrice || null,
        isBundleEnabled: validatedData.isBundleEnabled,
        isFeatured: validatedData.isFeatured,
        isMandatory: validatedData.isMandatory,
        isActive: validatedData.isActive,
        objectives: validatedData.objectives || null,
        additionalCoverage: validatedData.additionalCoverage || null,
      })
      .returning();

    // Handle pricing if provided
    if (validatedData.pricing && validatedData.pricing.length > 0) {
      for (const priceItem of validatedData.pricing) {
        if (priceItem.isIncluded) {
          await db
            .insert(schema.subjectContentTypePricing)
            .values({
              subjectId: newSubject.id,
              contentTypeId: priceItem.contentTypeId,
              price: priceItem.price,
            })
            .onConflictDoUpdate({
              target: [schema.subjectContentTypePricing.subjectId, schema.subjectContentTypePricing.contentTypeId],
              set: { price: priceItem.price, updatedAt: new Date() }
            });
        }
      }
    }

    // Revalidate relevant pages
    revalidatePath("/admin/courses");
    revalidatePath("/learner/courses");
    revalidatePath("/courses");

    return {
      success: true,
      data: newSubject,
      message: "Subject created successfully",
    };
  } catch (error) {
    console.error("Create subject error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create subject",
    };
  }
}

/**
 * Update an existing subject (Admin only)
 */
export async function updateSubject(data: UpdateSubjectInput) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Validate input
    const validatedData = updateSubjectSchema.parse(data);

    // Check if subject exists
    const [existing] = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, validatedData.id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Subject not found",
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

    // If exam type is provided, verify it exists and belongs to the stream
    if (validatedData.examTypeId) {
      const [examType] = await db
        .select()
        .from(schema.examTypes)
        .where(eq(schema.examTypes.id, validatedData.examTypeId))
        .limit(1);

      if (!examType) {
        return {
          success: false,
          error: "Exam type not found",
        };
      }

      if (examType.streamId !== validatedData.streamId) {
        return {
          success: false,
          error: "Exam type does not belong to the selected stream",
        };
      }
    }

    // Update the subject
    const [updatedSubject] = await db
      .update(schema.subjects)
      .set({
        title: validatedData.title,
        description: validatedData.description || null,
        thumbnail: validatedData.thumbnail || null,
        demoVideoUrl: validatedData.demoVideoUrl || null,
        streamId: validatedData.streamId,
        examTypeId: validatedData.examTypeId || null,
        bundlePrice: validatedData.bundlePrice || null,
        isBundleEnabled: validatedData.isBundleEnabled,
        isFeatured: validatedData.isFeatured,
        isMandatory: validatedData.isMandatory,
        isActive: validatedData.isActive,
        syllabusPdfUrl: validatedData.syllabusPdfUrl || null,
        objectives: validatedData.objectives || null,
        additionalCoverage: validatedData.additionalCoverage || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.subjects.id, validatedData.id))
      .returning();

    // Handle pricing if provided
    if (validatedData.pricing && validatedData.pricing.length > 0) {
      for (const priceItem of validatedData.pricing) {
        if (priceItem.isIncluded) {
          await db
            .insert(schema.subjectContentTypePricing)
            .values({
              subjectId: validatedData.id,
              contentTypeId: priceItem.contentTypeId,
              price: priceItem.price,
            })
            .onConflictDoUpdate({
              target: [schema.subjectContentTypePricing.subjectId, schema.subjectContentTypePricing.contentTypeId],
              set: { price: priceItem.price, updatedAt: new Date() }
            });
        } else {
          // If not included, remove any existing pricing
          await db
            .delete(schema.subjectContentTypePricing)
            .where(
              and(
                eq(schema.subjectContentTypePricing.subjectId, validatedData.id),
                eq(schema.subjectContentTypePricing.contentTypeId, priceItem.contentTypeId)
              )
            );
        }
      }
    }

    // Revalidate relevant pages
    revalidatePath("/admin/courses");
    revalidatePath("/learner/courses");
    revalidatePath("/courses");
    revalidatePath(`/courses/${validatedData.id}`);

    return {
      success: true,
      data: updatedSubject,
      message: "Subject updated successfully",
    };
  } catch (error) {
    console.error("Update subject error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update subject",
    };
  }
}

/**
 * Delete a subject (Admin only)
 */
export async function deleteSubject(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Check if subject exists
    const [existing] = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, id))
      .limit(1);

    if (!existing) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Check if subject has been purchased
    const purchases = await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.subjectId, id))
      .limit(1);

    if (purchases.length > 0) {
      return {
        success: false,
        error: "Cannot delete subject that has been purchased.",
      };
    }

    // Check if any users have access (legacy or manual grants)
    const access = await db
      .select()
      .from(schema.userAccess)
      .where(eq(schema.userAccess.subjectId, id))
      .limit(1);

    if (access.length > 0) {
      return {
        success: false,
        error: "Cannot delete subject that has associated user access.",
      };
    }

    // Delete the subject (this will cascade delete cart items due to schema)
    await db
      .delete(schema.subjects)
      .where(eq(schema.subjects.id, id));

    // Revalidate relevant pages
    revalidatePath("/admin/courses");
    revalidatePath("/learner/courses");
    revalidatePath("/courses");

    return {
      success: true,
      message: "Subject deleted successfully",
    };
  } catch (error) {
    console.error("Delete subject error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete subject",
    };
  }
}

/**
 * Toggle subject active status (Admin only)
 */
export async function toggleSubjectStatus(id: string) {
  try {
    // Check admin authorization
    await requireAdmin();

    // Get current status
    const [subject] = await db
      .select()
      .from(schema.subjects)
      .where(eq(schema.subjects.id, id))
      .limit(1);

    if (!subject) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Toggle status
    const [updatedSubject] = await db
      .update(schema.subjects)
      .set({
        isActive: !subject.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.subjects.id, id))
      .returning();

    // Revalidate relevant pages
    revalidatePath("/admin/courses");
    revalidatePath("/learner/courses");
    revalidatePath("/courses");

    return {
      success: true,
      data: updatedSubject,
      message: `Subject ${updatedSubject.isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Toggle subject status error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to toggle subject status",
    };
  }
}

/**
 * Get active subjects with statistics (for public course listing)
 */
export async function getActiveSubjectsWithStats() {
  try {
    // Optimized: Single query with subqueries for counts instead of N+1 queries
    // Create subquery for content counts per subject
    const contentCounts = db
      .select({
        subjectId: schema.subjectContents.subjectId,
        count: count().as('content_count')
      })
      .from(schema.subjectContents)
      .where(eq(schema.subjectContents.isActive, true))
      .groupBy(schema.subjectContents.subjectId)
      .as('content_counts');

    // Create subquery for distinct enrolled students count per subject
    const enrollmentCounts = db
      .select({
        subjectId: schema.userAccess.subjectId,
        count: sql<number>`count(distinct ${schema.userAccess.userId})`.as('enrollment_count')
      })
      .from(schema.userAccess)
      .groupBy(schema.userAccess.subjectId)
      .as('enrollment_counts');

    // Single query to get all subjects with stats
    const subjects = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
        lessonsCount: sql<number>`coalesce(${contentCounts.count}, 0)`,
        studentsCount: sql<number>`coalesce(${enrollmentCounts.count}, 0)`
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .leftJoin(contentCounts, eq(schema.subjects.id, contentCounts.subjectId))
      .leftJoin(enrollmentCounts, eq(schema.subjects.id, enrollmentCounts.subjectId))
      .where(eq(schema.subjects.isActive, true))
      .orderBy(schema.subjects.createdAt);

    // Map to expected format
    const subjectsWithStats = subjects.map((row) => ({
      subject: row.subject,
      stream: row.stream,
      examType: row.examType,
      stats: {
        lessonsCount: Number(row.lessonsCount) || 0,
        studentsCount: Number(row.studentsCount) || 0,
        reviews: 0, // Can be implemented later with a reviews table
        rating: 5, // Default rating, can be calculated from reviews
      },
    }));

    return {
      success: true,
      data: subjectsWithStats,
    };
  } catch (error) {
    console.error("Get active subjects with stats error:", error);
    return {
      success: false,
      error: "Failed to fetch subjects",
    };
  }
}

/**
 * Get featured subjects with statistics
 */
export async function getFeaturedSubjects() {
  try {
    const subjects = await db
      .select()
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .where(
        and(
          eq(schema.subjects.isActive, true),
          eq(schema.subjects.isFeatured, true)
        )
      )
      .orderBy(schema.subjects.createdAt)

    // Get content counts and statistics for each subject
    const subjectsWithStats = await Promise.all(
      subjects.map(async (row) => {
        const subject = row.subjects;
        const stream = row.learning_streams;
        const examType = row.exam_types;

        // Get content count (lessons)
        const contents = await db
          .select()
          .from(schema.subjectContents)
          .where(
            and(
              eq(schema.subjectContents.subjectId, subject.id),
              eq(schema.subjectContents.isActive, true)
            )
          );

        // Get enrolled students count (users with access to this subject)
        const enrollments = await db
          .select({ userId: schema.userAccess.userId })
          .from(schema.userAccess)
          .where(eq(schema.userAccess.subjectId, subject.id))
          .groupBy(schema.userAccess.userId);

        return {
          subject,
          stream,
          examType,
          stats: {
            lessonsCount: contents.length,
            studentsCount: enrollments.length,
            reviews: 0,
            rating: 5,
          },
        };
      })
    );

    return {
      success: true,
      data: subjectsWithStats,
    };
  } catch (error) {
    console.error("Get featured subjects error:", error);
    return {
      success: false,
      error: "Failed to fetch featured subjects",
    };
  }
}

/**
 * Get subject details with statistics (for public course detail page)
 */
export async function getSubjectByIdWithStats(id: string) {
  try {
    // Optimized: Run independent queries in parallel and use COUNT instead of fetching all rows
    const [subjectResult, statsResult, pricing, contentsWithTypes] = await Promise.all([
      // Query 1: Get subject with related data
      db
        .select({
          subject: schema.subjects,
          stream: schema.learningStreams,
          examType: schema.examTypes,
        })
        .from(schema.subjects)
        .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
        .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
        .where(eq(schema.subjects.id, id))
        .limit(1),

      // Query 2: Get stats (content count + enrollment count) in one query
      db
        .select({
          lessonsCount: count(schema.subjectContents.id),
          studentsCount: sql<number>`count(distinct ${schema.userAccess.userId})`
        })
        .from(schema.subjects)
        .leftJoin(
          schema.subjectContents,
          and(
            eq(schema.subjects.id, schema.subjectContents.subjectId),
            eq(schema.subjectContents.isActive, true)
          )
        )
        .leftJoin(schema.userAccess, eq(schema.subjects.id, schema.userAccess.subjectId))
        .where(eq(schema.subjects.id, id))
        .groupBy(schema.subjects.id)
        .then(rows => rows[0] || { lessonsCount: 0, studentsCount: 0 }),

      // Query 3: Get pricing with content types
      db
        .select({
          contentTypeId: schema.subjectContentTypePricing.contentTypeId,
          price: schema.subjectContentTypePricing.price,
          contentTypeName: schema.contentTypes.name,
          contentType: schema.contentTypes,
        })
        .from(schema.subjectContentTypePricing)
        .leftJoin(schema.contentTypes, eq(schema.subjectContentTypePricing.contentTypeId, schema.contentTypes.id))
        .where(eq(schema.subjectContentTypePricing.subjectId, id)),

      // Query 4: Get contents with their content types
      db
        .select({
          content: schema.subjectContents,
          contentType: schema.contentTypes,
        })
        .from(schema.subjectContents)
        .leftJoin(schema.contentTypes, eq(schema.subjectContents.contentTypeId, schema.contentTypes.id))
        .where(
          and(
            eq(schema.subjectContents.subjectId, id),
            eq(schema.subjectContents.isActive, true)
          )
        )
        .orderBy(schema.subjectContents.sortOrder)
    ]);

    const [result] = subjectResult;

    if (!result) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Extract content types from pricing (no need for separate query + filter)
    const contentTypes = pricing
      .map(p => p.contentType)
      .filter((ct): ct is NonNullable<typeof ct> => ct !== null);

    console.log("DEBUG: getSubjectByIdWithStats returning", {
      id: result.subject.id,
      objectivesType: typeof result.subject.objectives,
      objectivesVal: result.subject.objectives
    });

    return {
      success: true,
      data: {
        ...result,
        stats: {
          lessonsCount: Number(statsResult.lessonsCount) || 0,
          studentsCount: Number(statsResult.studentsCount) || 0,
          reviews: 0, // Can be implemented later with a reviews table
          rating: 5, // Default rating, can be calculated from reviews
        },
        pricing, // Pricing for each content type
        contentTypes,
        contents: contentsWithTypes,
      },
    };
  } catch (error) {
    console.error("Get subject by ID with stats error:", error);
    return {
      success: false,
      error: "Failed to fetch subject details",
    };
  }
}

/**
 * Get subject details with content types and user access (for learners)
 */
export async function getSubjectForLearner(subjectId: string, userId: string) {
  try {
    // Get subject details
    const [result] = await db
      .select({
        subject: schema.subjects,
        stream: schema.learningStreams,
        examType: schema.examTypes,
      })
      .from(schema.subjects)
      .leftJoin(schema.learningStreams, eq(schema.subjects.streamId, schema.learningStreams.id))
      .leftJoin(schema.examTypes, eq(schema.subjects.examTypeId, schema.examTypes.id))
      .where(eq(schema.subjects.id, subjectId))
      .limit(1);

    if (!result) {
      return {
        success: false,
        error: "Subject not found",
      };
    }

    // Get all content types
    const contentTypes = await db
      .select()
      .from(schema.contentTypes)
      .orderBy(schema.contentTypes.name);

    // Get user's access for this subject
    const userAccessRecords = await db
      .select({
        contentTypeId: schema.userAccess.contentTypeId,
        contentType: schema.contentTypes,
      })
      .from(schema.userAccess)
      .leftJoin(schema.contentTypes, eq(schema.userAccess.contentTypeId, schema.contentTypes.id))
      .where(
        and(
          eq(schema.userAccess.userId, userId),
          eq(schema.userAccess.subjectId, subjectId)
        )
      );

    // Get contents for this subject grouped by content type
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
      .orderBy(schema.subjectContents.sortOrder);

    // Map user access by content type ID
    const accessMap = new Map(
      userAccessRecords.map(record => [record.contentTypeId, true])
    );

    // Get enrolled students count
    const enrollments = await db
      .select({ userId: schema.userAccess.userId })
      .from(schema.userAccess)
      .where(eq(schema.userAccess.subjectId, subjectId))
      .groupBy(schema.userAccess.userId);

    // Get pricing for all content types for this subject
    const pricing = await db
      .select({
        contentTypeId: schema.subjectContentTypePricing.contentTypeId,
        price: schema.subjectContentTypePricing.price,
        contentTypeName: schema.contentTypes.name,
      })
      .from(schema.subjectContentTypePricing)
      .leftJoin(schema.contentTypes, eq(schema.subjectContentTypePricing.contentTypeId, schema.contentTypes.id))
      .where(eq(schema.subjectContentTypePricing.subjectId, subjectId));

    // Filter content types to only those enabled in pricing
    const filteredContentTypes = contentTypes.filter(ct =>
      pricing.some(p => p.contentTypeId === ct.id)
    );

    // Check if user has purchased the complete bundle (based on enabled content types)
    const hasBundleAccess = filteredContentTypes.length > 0 && filteredContentTypes.every(ct => accessMap.has(ct.id));

    return {
      success: true,
      data: {
        ...result,
        contentTypes: filteredContentTypes,
        userAccess: userAccessRecords,
        contents,
        hasBundleAccess,
        accessMap,
        pricing, // Pricing for each content type

        stats: {
          lessonsCount: contents.length,
          studentsCount: enrollments.length,
          reviews: 0, // Can be implemented later with a reviews table
          rating: 5, // Default rating, can be calculated from reviews
        },
      },
    };
  } catch (error) {
    console.error("Get subject for learner error:", error);
    return {
      success: false,
      error: "Failed to fetch subject details",
    };
  }
}
