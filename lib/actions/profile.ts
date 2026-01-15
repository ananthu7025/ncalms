"use server";

import auth from "@/auth";
import { db } from "@/lib/db";
import {
  users,
  purchases,
  userAccess,
  subjects,
  contentTypes,
  subjectContents,
} from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  stats: {
    coursesEnrolled: number;
    hoursLearned: number;
    certificatesEarned: number;
    currentStreak: number;
  };
  enrolledCourses: {
    id: string;
    title: string;
    thumbnail: string | null;
    overallProgress: number;
  }[];
  achievements: {
    title: string;
    description: string;
    earned: boolean;
    icon: string;
  }[];
}

/**
 * Get user profile data including stats, courses, and achievements
 */
export async function getProfileData(): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  try {
    const session = await auth();
    console.log("Profile - Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized - No session found" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    console.log("Profile - Looking for user ID:", userId);

    // Get user basic info - try by ID first, then by email as fallback
    let user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Fallback: try finding by email if ID doesn't match (session might be stale)
    if (!user && userEmail) {
      console.log("Profile - User not found by ID, trying email:", userEmail);
      user = await db.query.users.findFirst({
        where: eq(users.email, userEmail),
        columns: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    }

    console.log("Profile - User found:", user);

    if (!user) {
      return {
        success: false,
        error: `User not found. Please log out and log back in to refresh your session.`
      };
    }

    // Use the actual user ID from database (might differ from session if session is stale)
    const actualUserId = user.id;

    // Get user statistics
    const stats = await getUserStats(actualUserId);

    // Get enrolled courses with progress
    const enrolledCourses = await getEnrolledCoursesWithProgress(actualUserId);

    // Get achievements based on actual data
    const achievements = await getUserAchievements(actualUserId, stats);

    return {
      success: true,
      data: {
        user,
        stats,
        enrolledCourses,
        achievements,
      },
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch profile data",
    };
  }
}

/**
 * Calculate user statistics
 */
async function getUserStats(userId: string) {
  // Get distinct courses enrolled
  const coursesEnrolled = await db
    .select({ count: sql<number>`count(DISTINCT ${userAccess.subjectId})` })
    .from(userAccess)
    .where(eq(userAccess.userId, userId));

  // Get total video duration (as proxy for hours learned)
  const userSubjects = await db
    .selectDistinct({ subjectId: userAccess.subjectId })
    .from(userAccess)
    .where(eq(userAccess.userId, userId));

  const subjectIds = userSubjects.map((s) => s.subjectId);

  let totalMinutes = 0;
  if (subjectIds.length > 0) {
    // Get all video content for user's subjects
    const videoType = await db
      .select()
      .from(contentTypes)
      .where(eq(contentTypes.name, "Video Lectures"))
      .limit(1);

    if (videoType.length > 0) {
      for (const subjectId of subjectIds) {
        const videos = await db
          .select({ duration: subjectContents.duration })
          .from(subjectContents)
          .where(
            and(
              eq(subjectContents.subjectId, subjectId),
              eq(subjectContents.contentTypeId, videoType[0].id),
              eq(subjectContents.isActive, true)
            )
          );

        totalMinutes += videos.reduce((sum, v) => sum + (v.duration || 0), 0);
      }
    }
  }

  const hoursLearned = Math.floor(totalMinutes / 60);

  // Certificates earned (mock for now - could be based on completion)
  const certificatesEarned = 0;

  // Current streak (mock for now - would need a progress tracking table)
  const currentStreak = 0;

  return {
    coursesEnrolled: Number(coursesEnrolled[0]?.count) || 0,
    hoursLearned,
    certificatesEarned,
    currentStreak,
  };
}

/**
 * Get enrolled courses with progress
 */
async function getEnrolledCoursesWithProgress(userId: string) {
  // Get all subjects the user has access to
  const userSubjectsData = await db
    .selectDistinct({
      subjectId: userAccess.subjectId,
      subjectTitle: subjects.title,
      subjectThumbnail: subjects.thumbnail,
    })
    .from(userAccess)
    .innerJoin(subjects, eq(userAccess.subjectId, subjects.id))
    .where(eq(userAccess.userId, userId))
    .limit(5); // Limit to 5 for profile display

  // For now, we'll use mock progress since we don't have a progress tracking table
  const enrolledCourses = userSubjectsData.map((subject) => ({
    id: subject.subjectId,
    title: subject.subjectTitle,
    thumbnail: subject.subjectThumbnail,
    overallProgress: Math.floor(Math.random() * 100), // Mock progress - would need actual tracking
  }));

  return enrolledCourses;
}

/**
 * Calculate user achievements based on actual data
 */
async function getUserAchievements(
  userId: string,
  stats: {
    coursesEnrolled: number;
    hoursLearned: number;
    certificatesEarned: number;
    currentStreak: number;
  }
) {
  const achievements = [
    {
      title: "First Course",
      description: "Enrolled in your first course",
      earned: stats.coursesEnrolled >= 1,
      icon: "Trophy",
    },
    {
      title: "Dedicated Learner",
      description: "Completed 10+ hours of learning",
      earned: stats.hoursLearned >= 10,
      icon: "Star",
    },
    {
      title: "Multi-Subject",
      description: "Enrolled in 3 or more courses",
      earned: stats.coursesEnrolled >= 3,
      icon: "TrendingUp",
    },
    {
      title: "Scholar",
      description: "Enrolled in 5 courses",
      earned: stats.coursesEnrolled >= 5,
      icon: "Award",
    },
  ];

  return achievements;
}

/**
 * Update user profile information
 */
export async function updateProfile(data: {
  name: string;
  email: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized - No session found" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Get current user from database
    let user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // Fallback: try finding by email if ID doesn't match
    if (!user && userEmail) {
      user = await db.query.users.findFirst({
        where: eq(users.email, userEmail),
      });
    }

    if (!user) {
      return {
        success: false,
        error: "User not found. Please log out and log back in.",
      };
    }

    const actualUserId = user.id;

    // Check if email is being changed and if it's already taken by another user
    if (data.email !== user.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existingUser && existingUser.id !== actualUserId) {
        return { success: false, error: "Email is already in use" };
      }
    }

    // Update user profile
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, actualUserId));

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
