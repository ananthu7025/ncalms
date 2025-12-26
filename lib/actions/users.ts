"use server";

import { db } from "@/lib/db";
import { users, roles, purchases } from "@/lib/db/schema";
import { eq, ilike, or, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UserWithStats = {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  coursesEnrolled: number;
  totalSpent: string;
  lastPurchaseDate: Date | null;
};

export type UsersFilterParams = {
  searchQuery?: string;
  roleFilter?: string;
  statusFilter?: string;
  page?: number;
  limit?: number;
};

export type UsersStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalLearners: number;
  totalAdmins: number;
};

/**
 * Fetches users with their statistics (courses enrolled, total spent)
 */
export async function getUsersWithStats(
  filters: UsersFilterParams = {}
): Promise<{ users: UserWithStats[]; total: number }> {
  try {
    const {
      searchQuery = "",
      roleFilter = "all",
      statusFilter = "all",
      page = 1,
      limit = 50,
    } = filters;

    // Build WHERE conditions
    const conditions = [];

    // Search by name or email
    if (searchQuery) {
      conditions.push(
        or(
          ilike(users.name, `%${searchQuery}%`),
          ilike(users.email, `%${searchQuery}%`)
        )
      );
    }

    // Filter by status
    if (statusFilter === "active") {
      conditions.push(eq(users.isActive, true));
    } else if (statusFilter === "inactive") {
      conditions.push(eq(users.isActive, false));
    }

    // Combine all conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get users with role information
    const usersQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleId: users.roleId,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt));

    const allUsers = await usersQuery;

    // Filter by role if specified
    let filteredUsers = allUsers;
    if (roleFilter !== "all") {
      filteredUsers = allUsers.filter((u) => u.roleName === roleFilter);
    }

    // Get total count
    const total = filteredUsers.length;

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    // Get purchase statistics for each user
    const usersWithStats: UserWithStats[] = await Promise.all(
      paginatedUsers.map(async (user) => {
        // Get purchase stats
        const purchaseStats = await db
          .select({
            count: sql<number>`count(DISTINCT ${purchases.subjectId})`,
            totalSpent: sql<string>`COALESCE(SUM(CASE WHEN ${purchases.status} = 'paid' THEN ${purchases.amount} ELSE 0 END), 0)`,
            lastPurchaseDate: sql<Date | null>`MAX(${purchases.createdAt})`,
          })
          .from(purchases)
          .where(eq(purchases.userId, user.id));

        const stats = purchaseStats[0];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: {
            id: user.roleId,
            name: user.roleName || "Unknown",
          },
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          coursesEnrolled: Number(stats?.count) || 0,
          totalSpent: stats?.totalSpent || "0",
          lastPurchaseDate: stats?.lastPurchaseDate || null,
        };
      })
    );

    return {
      users: usersWithStats,
      total,
    };
  } catch (error) {
    console.error("Error fetching users with stats:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Fetches user statistics for the dashboard
 */
export async function getUsersStats(): Promise<UsersStats> {
  try {
    const [allUsers, allRoles] = await Promise.all([
      db.select().from(users),
      db.select().from(roles),
    ]);

    const learnerRole = allRoles.find((r) => r.name === "learner");
    const adminRole = allRoles.find((r) => r.name === "admin");

    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u) => u.isActive).length,
      inactiveUsers: allUsers.filter((u) => !u.isActive).length,
      totalLearners: learnerRole
        ? allUsers.filter((u) => u.roleId === learnerRole.id).length
        : 0,
      totalAdmins: adminRole
        ? allUsers.filter((u) => u.roleId === adminRole.id).length
        : 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user statistics");
  }
}

/**
 * Toggles user active status
 */
export async function toggleUserStatus(userId: string): Promise<void> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(users)
      .set({
        isActive: !user.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw new Error("Failed to update user status");
  }
}

/**
 * Updates user role
 */
export async function updateUserRole(
  userId: string,
  roleId: string
): Promise<void> {
  try {
    await db
      .update(users)
      .set({
        roleId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

/**
 * Exports users data as CSV
 */
export async function exportUsersAsCSV(): Promise<string> {
  try {
    const { users: usersData } = await getUsersWithStats({ limit: 10000 });

    const headers = [
      "Name",
      "Email",
      "Role",
      "Status",
      "Courses Enrolled",
      "Total Spent",
      "Joined Date",
      "Last Updated",
    ];

    const rows = usersData.map((user) => [
      user.name,
      user.email,
      user.role.name,
      user.isActive ? "Active" : "Inactive",
      user.coursesEnrolled.toString(),
      `$${user.totalSpent}`,
      user.createdAt.toISOString().split("T")[0],
      user.updatedAt.toISOString().split("T")[0],
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting users:", error);
    throw new Error("Failed to export users");
  }
}

/**
 * Gets a single user by ID with stats
 */
export async function getUserById(userId: string): Promise<UserWithStats | null> {
  try {
    const result = await getUsersWithStats({ limit: 1 });
    const user = result.users.find((u) => u.id === userId);
    return user || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}
