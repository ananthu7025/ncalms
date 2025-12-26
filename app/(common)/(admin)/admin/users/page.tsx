import { Suspense } from "react";
import { getUsersWithStats, getUsersStats } from "@/lib/actions/users";
import {
  UsersStatsCards,
  UsersFilters,
  UsersTable,
  ExportUsersButton,
} from "@/components/admin/users";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminUsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
}

// Loading skeletons
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Parse search params
  const filters = {
    searchQuery: params.search || "",
    roleFilter: params.role || "all",
    statusFilter: params.status || "all",
    page: params.page ? parseInt(params.page) : 1,
    limit: 50,
  };

  // Fetch data
  const [{ users, total }, stats] = await Promise.all([
    getUsersWithStats(filters),
    getUsersStats(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage platform users and their access
          </p>
        </div>
        <ExportUsersButton />
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsLoading />}>
        <UsersStatsCards stats={stats} />
      </Suspense>

      {/* Filters */}
      <UsersFilters />

      {/* Results count */}
      {filters.searchQuery || filters.roleFilter !== "all" || filters.statusFilter !== "all" ? (
        <div className="text-sm text-muted-foreground">
          Found {total} {total === 1 ? "user" : "users"}
          {filters.searchQuery && ` matching "${filters.searchQuery}"`}
        </div>
      ) : null}

      {/* Users Table */}
      <Suspense fallback={<TableLoading />}>
        <UsersTable users={users} />
      </Suspense>

      {/* Pagination info */}
      {total > filters.limit && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {Math.min(filters.limit, users.length)} of {total} users
        </div>
      )}
    </div>
  );
}
