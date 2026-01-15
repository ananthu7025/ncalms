"use server";

import auth from "@/auth";
import { db } from "@/lib/db";
import {
  userAccess,
  subjects,
  contentTypes,
  subjectContents,
  purchases,
} from "@/lib/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface LibraryCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  streamId: string;
  examTypeId: string | null;
  purchaseDate: Date;
  contentAccess: {
    contentTypeId: string;
    contentTypeName: string;
    hasAccess: boolean;
  }[];
  contents: {
    id: string;
    contentTypeId: string;
    contentTypeName: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    duration: number | null;
    sortOrder: number;
  }[];
}

/**
 * Get all courses in user's library with their accessible content
 */
export async function getLibraryCourses(): Promise<{
  success: boolean;
  courses?: LibraryCourse[];
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get all subjects the user has access to (distinct subjects)
    const userAccessData = await db
      .select({
        subjectId: userAccess.subjectId,
        contentTypeId: userAccess.contentTypeId,
        contentTypeName: contentTypes.name,
        subjectTitle: subjects.title,
        subjectDescription: subjects.description,
        subjectThumbnail: subjects.thumbnail,
        streamId: subjects.streamId,
        examTypeId: subjects.examTypeId,
      })
      .from(userAccess)
      .innerJoin(subjects, eq(userAccess.subjectId, subjects.id))
      .innerJoin(contentTypes, eq(userAccess.contentTypeId, contentTypes.id))
      .where(eq(userAccess.userId, userId));

    if (userAccessData.length === 0) {
      return { success: true, courses: [] };
    }

    // Group by subject
    const subjectMap = new Map<string, LibraryCourse>();

    for (const access of userAccessData) {
      if (!subjectMap.has(access.subjectId)) {
        // Get the earliest purchase date for this subject
        const purchaseData = await db
          .select({ createdAt: purchases.createdAt })
          .from(purchases)
          .where(
            and(
              eq(purchases.userId, userId),
              eq(purchases.subjectId, access.subjectId)
            )
          )
          .orderBy(desc(purchases.createdAt))
          .limit(1);

        subjectMap.set(access.subjectId, {
          id: access.subjectId,
          title: access.subjectTitle,
          description: access.subjectDescription,
          thumbnail: access.subjectThumbnail,
          streamId: access.streamId,
          examTypeId: access.examTypeId,
          purchaseDate: purchaseData[0]?.createdAt || new Date(),
          contentAccess: [],
          contents: [],
        });
      }

      const course = subjectMap.get(access.subjectId)!;
      course.contentAccess.push({
        contentTypeId: access.contentTypeId,
        contentTypeName: access.contentTypeName,
        hasAccess: true,
      });
    }

    // Fetch content for each subject
    for (const [subjectId, course] of subjectMap) {
      const contentTypeIds = course.contentAccess.map((ca) => ca.contentTypeId);

      const contents = await db
        .select({
          id: subjectContents.id,
          contentTypeId: subjectContents.contentTypeId,
          contentTypeName: contentTypes.name,
          title: subjectContents.title,
          description: subjectContents.description,
          fileUrl: subjectContents.fileUrl,
          duration: subjectContents.duration,
          sortOrder: subjectContents.sortOrder,
        })
        .from(subjectContents)
        .innerJoin(
          contentTypes,
          eq(subjectContents.contentTypeId, contentTypes.id)
        )
        .where(
          and(
            eq(subjectContents.subjectId, subjectId),
            eq(subjectContents.isActive, true),
            inArray(subjectContents.contentTypeId, contentTypeIds)
          )
        )
        .orderBy(subjectContents.sortOrder);

      course.contents = contents;
    }

    const courses = Array.from(subjectMap.values());

    return { success: true, courses };
  } catch (error) {
    console.error("Error fetching library courses:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch library",
    };
  }
}

/**
 * Get content statistics for a subject
 */
export async function getSubjectContentStats(subjectId: string): Promise<{
  success: boolean;
  stats?: {
    totalVideos: number;
    totalPDFs: number;
    totalQA: number;
    totalDuration: number; // in minutes
  };
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user has access to this subject
    const hasAccess = await db
      .select()
      .from(userAccess)
      .where(
        and(
          eq(userAccess.userId, userId),
          eq(userAccess.subjectId, subjectId)
        )
      )
      .limit(1);

    if (hasAccess.length === 0) {
      return { success: false, error: "Access denied" };
    }

    // Get content type IDs
    const contentTypeData = await db
      .select({ id: contentTypes.id, name: contentTypes.name })
      .from(contentTypes);

    const videoTypeId = contentTypeData.find((ct) => ct.name === "Video Lectures")?.id;
    const pdfTypeId = contentTypeData.find((ct) => ct.name === "Notes")?.id;
    const mockTypeId = contentTypeData.find((ct) => ct.name === "Question & Answers")?.id;

    // Get content counts
    const contents = await db
      .select({
        contentTypeId: subjectContents.contentTypeId,
        duration: subjectContents.duration,
      })
      .from(subjectContents)
      .where(
        and(
          eq(subjectContents.subjectId, subjectId),
          eq(subjectContents.isActive, true)
        )
      );

    const stats = {
      totalVideos: contents.filter((c) => c.contentTypeId === videoTypeId)
        .length,
      totalPDFs: contents.filter((c) => c.contentTypeId === pdfTypeId).length,
      totalQA: contents.filter((c) => c.contentTypeId === mockTypeId).length,
      totalDuration: contents.reduce((sum, c) => sum + (c.duration || 0), 0),
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching content stats:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}

/**
 * Check if user has access to specific content
 */
export async function checkContentAccess(
  subjectId: string,
  contentTypeId: string
): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const access = await db
      .select()
      .from(userAccess)
      .where(
        and(
          eq(userAccess.userId, session.user.id),
          eq(userAccess.subjectId, subjectId),
          eq(userAccess.contentTypeId, contentTypeId)
        )
      )
      .limit(1);

    return access.length > 0;
  } catch (error) {
    console.error("Error checking content access:", error);
    return false;
  }
}

/**
 * Get content by type for a specific subject
 */
export async function getSubjectContentByType(
  subjectId: string,
  contentTypeName: string
): Promise<{
  success: boolean;
  contents?: {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    duration: number | null;
    sortOrder: number;
  }[];
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get content type ID
    const contentType = await db
      .select()
      .from(contentTypes)
      .where(eq(contentTypes.name, contentTypeName))
      .limit(1);

    if (contentType.length === 0) {
      return { success: false, error: "Invalid content type" };
    }

    const contentTypeId = contentType[0].id;

    // Verify user has access
    const hasAccess = await db
      .select()
      .from(userAccess)
      .where(
        and(
          eq(userAccess.userId, userId),
          eq(userAccess.subjectId, subjectId),
          eq(userAccess.contentTypeId, contentTypeId)
        )
      )
      .limit(1);

    if (hasAccess.length === 0) {
      return { success: false, error: "Access denied" };
    }

    // Get contents
    const contents = await db
      .select({
        id: subjectContents.id,
        title: subjectContents.title,
        description: subjectContents.description,
        fileUrl: subjectContents.fileUrl,
        duration: subjectContents.duration,
        sortOrder: subjectContents.sortOrder,
      })
      .from(subjectContents)
      .where(
        and(
          eq(subjectContents.subjectId, subjectId),
          eq(subjectContents.contentTypeId, contentTypeId),
          eq(subjectContents.isActive, true)
        )
      )
      .orderBy(subjectContents.sortOrder);

    return { success: true, contents };
  } catch (error) {
    console.error("Error fetching subject content:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch content",
    };
  }
}
