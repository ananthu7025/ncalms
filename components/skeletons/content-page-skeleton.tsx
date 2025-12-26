import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ContentPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-64 rounded-md" />
      </div>

      {/* Content Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b">
            <Skeleton className="h-4 w-full col-span-4" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 py-3">
              <Skeleton className="h-5 w-full col-span-4" />
              <Skeleton className="h-5 w-16 col-span-2 rounded-full" />
              <Skeleton className="h-5 w-12 col-span-2" />
              <Skeleton className="h-5 w-20 col-span-2" />
              <div className="col-span-2 flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
