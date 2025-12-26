"use client";

import Link from "next/link";
import toaster from "@/lib/toaster";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { deleteSubject } from "@/lib/actions/subjects";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseCardActionsProps {
  courseId: string;
  courseTitle: string;
}

export function CourseCardActions({
  courseId,
  courseTitle,
}: CourseCardActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteSubject(courseId);

        if (!result?.success) {
          toaster.error(result?.error ?? "Failed to delete course");
          return;
        }
        toaster.success("Course deleted successfully");
        setOpen(false);
        router.refresh();
      } catch {
        toaster.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        href={`/admin/add-course?courseId=${courseId}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          aria-label={`Edit course ${courseTitle}`}
        >
          <Edit className="w-4 h-4 mr-1.5" />
          Edit
        </Button>
      </Link>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="h-8"
            aria-label={`Delete course ${courseTitle}`}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The course{" "}
              <span className="font-medium text-foreground">
                “{courseTitle}”
              </span>{" "}
              and all its associated content will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting…" : "Delete"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
