import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden flex flex-col border-gray-200">
      <div className="aspect-[16/10] w-full bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-6 flex-1 flex flex-col min-h-0">
        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer with price and button */}
        <div className="pt-5 mt-6 border-t border-gray-200 flex justify-between items-center gap-4">
          <Skeleton className="h-7 w-28 rounded" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
