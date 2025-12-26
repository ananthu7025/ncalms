import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="pt-4 mt-4 border-t flex justify-between items-center">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
