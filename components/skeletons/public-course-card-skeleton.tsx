import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PublicCourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden flex flex-col bg-white border border-gray-200 rounded-2xl">
      {/* Thumbnail */}
      <div className="aspect-[16/10] w-full bg-gray-100 rounded-t-2xl">
        <Skeleton className="h-full w-full rounded-t-2xl" />
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/4" />
        </div>

        {/* Metadata Icons */}
        <div className="flex gap-4 mb-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Instructor Section */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-5 w-10" />
        </div>

        {/* Footer with Price and Button */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PublicCoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <PublicCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
