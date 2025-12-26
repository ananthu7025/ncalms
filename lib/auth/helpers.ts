import auth from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated session
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  return await auth();
}

/**
 * Require authentication - redirects to login if not authenticated
 * @returns Session object
 */
export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Require admin role - redirects to learner dashboard if not admin
 * @returns Session object
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/learner/dashboard");
  }

  return session;
}

/**
 * Check if the current user is an admin
 * @returns boolean
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/**
 * Check if the current user is authenticated
 * @returns boolean
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Get the current user's ID
 * @returns User ID or null
 */
export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id || null;
}

/**
 * Get the current user's role
 * @returns User role or null
 */
export async function getCurrentUserRole() {
  const session = await auth();
  return session?.user?.role || null;
}
