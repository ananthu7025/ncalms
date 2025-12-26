import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function LibraryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail skeleton */}
        <div className="lg:w-64 aspect-video bg-muted flex-shrink-0">
          <Skeleton className="w-full h-full" />
        </div>

        <CardContent className="flex-1 p-5 space-y-4">
          {/* Title and description */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Content type badges */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          {/* Tabs skeleton */}
          <div className="space-y-3">
            {/* Tab list */}
            <div className="flex gap-2 border-b">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Tab content */}
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function LibraryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 gap-6">
        <LibraryCardSkeleton />
        <LibraryCardSkeleton />
        <LibraryCardSkeleton />
      </div>
    </div>
  );
}
