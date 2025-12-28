"use server";

import { db, schema } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
} from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";
import auth from "@/auth";

/**
 * Get all blog posts with author information
 */
export async function getBlogPosts() {
  try {
    await requireAdmin();

    const posts = await db
      .select({
        post: schema.blogPosts,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
        },
      })
      .from(schema.blogPosts)
      .leftJoin(schema.users, eq(schema.blogPosts.authorId, schema.users.id))
      .orderBy(desc(schema.blogPosts.createdAt));

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Get blog posts error:", error);
    return {
      success: false,
      error: "Failed to fetch blog posts",
    };
  }
}

/**
 * Get blog post statistics
 */
export async function getBlogStats() {
  try {
    await requireAdmin();

    // Get total posts count
    const totalPostsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.blogPosts);

    const totalPosts = Number(totalPostsResult[0]?.count || 0);

    // Get published posts count
    const publishedPostsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.isPublished, true));

    const publishedPosts = Number(publishedPostsResult[0]?.count || 0);

    // Get draft posts count
    const draftPosts = totalPosts - publishedPosts;

    return {
      success: true,
      data: {
        totalPosts,
        publishedPosts,
        draftPosts,
      },
    };
  } catch (error) {
    console.error("Get blog stats error:", error);
    return {
      success: false,
      error: "Failed to fetch blog statistics",
    };
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(input: CreateBlogPostInput) {
  try {
    await requireAdmin();

    // Get current user
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Validate input
    const validatedData = createBlogPostSchema.parse(input);

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, validatedData.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return {
        success: false,
        error: "A post with this slug already exists",
      };
    }

    // Create the blog post
    const [newPost] = await db
      .insert(schema.blogPosts)
      .values({
        ...validatedData,
        authorId: session.user.id,
        publishedAt: validatedData.isPublished ? new Date() : null,
      })
      .returning();

    revalidatePath("/admin/blog");

    return {
      success: true,
      data: newPost,
      message: "Blog post created successfully",
    };
  } catch (error) {
    console.error("Create blog post error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to create blog post",
    };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(input: UpdateBlogPostInput) {
  try {
    await requireAdmin();

    // Validate input
    const validatedData = updateBlogPostSchema.parse(input);

    // Check if slug already exists (excluding current post)
    const existingPost = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, validatedData.slug))
      .limit(1);

    if (existingPost.length > 0 && existingPost[0].id !== validatedData.id) {
      return {
        success: false,
        error: "A post with this slug already exists",
      };
    }

    // Get the current post to check if publish status changed
    const [currentPost] = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.id, validatedData.id))
      .limit(1);

    if (!currentPost) {
      return {
        success: false,
        error: "Blog post not found",
      };
    }

    // Update published date if status changed to published
    const publishedAt =
      !currentPost.isPublished && validatedData.isPublished
        ? new Date()
        : currentPost.publishedAt;

    // Update the blog post
    const [updatedPost] = await db
      .update(schema.blogPosts)
      .set({
        ...validatedData,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.blogPosts.id, validatedData.id))
      .returning();

    revalidatePath("/admin/blog");

    return {
      success: true,
      data: updatedPost,
      message: "Blog post updated successfully",
    };
  } catch (error) {
    console.error("Update blog post error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "Failed to update blog post",
    };
  }
}

/**
 * Toggle blog post published status
 */
export async function toggleBlogPostStatus(id: string) {
  try {
    await requireAdmin();

    // Get current post
    const [currentPost] = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.id, id))
      .limit(1);

    if (!currentPost) {
      return {
        success: false,
        error: "Blog post not found",
      };
    }

    // Toggle status
    const newStatus = !currentPost.isPublished;
    const publishedAt = newStatus && !currentPost.publishedAt ? new Date() : currentPost.publishedAt;

    const [updatedPost] = await db
      .update(schema.blogPosts)
      .set({
        isPublished: newStatus,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.blogPosts.id, id))
      .returning();

    revalidatePath("/admin/blog");

    return {
      success: true,
      data: updatedPost,
      message: `Blog post ${newStatus ? "published" : "unpublished"} successfully`,
    };
  } catch (error) {
    console.error("Toggle blog post status error:", error);
    return {
      success: false,
      error: "Failed to toggle blog post status",
    };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string) {
  try {
    await requireAdmin();

    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));

    revalidatePath("/admin/blog");

    return {
      success: true,
      message: "Blog post deleted successfully",
    };
  } catch (error) {
    console.error("Delete blog post error:", error);
    return {
      success: false,
      error: "Failed to delete blog post",
    };
  }
}

/**
 * Get published blog posts for public display
 */
export async function getPublishedBlogPosts(limit?: number) {
  try {
    const posts = await db
      .select({
        id: schema.blogPosts.id,
        title: schema.blogPosts.title,
        slug: schema.blogPosts.slug,
        image: schema.blogPosts.image,
        excerpt: schema.blogPosts.excerpt,
        publishedAt: schema.blogPosts.publishedAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
        },
      })
      .from(schema.blogPosts)
      .leftJoin(schema.users, eq(schema.blogPosts.authorId, schema.users.id))
      .where(eq(schema.blogPosts.isPublished, true))
      .orderBy(desc(schema.blogPosts.publishedAt))
      .limit(limit || 3);

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Get published blog posts error:", error);
    return {
      success: false,
      error: "Failed to fetch blog posts",
      data: [],
    };
  }
}
