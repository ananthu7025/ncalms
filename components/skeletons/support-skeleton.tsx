import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function SupportTicketSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          {/* Avatar skeleton (only for admin view) */}
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

          <div className="space-y-2 flex-1">
            {/* Subject and icon */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-64" />
            </div>

            {/* User info (admin only) or message preview */}
            <Skeleton className="h-4 w-96" />

            {/* Message preview */}
            <Skeleton className="h-4 w-full max-w-lg" />

            {/* Date info */}
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Category badge */}
          <Skeleton className="h-6 w-20 rounded-full" />
          {/* Status badge or date */}
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function LearnerSupportPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminSupportPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SupportTicketSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
