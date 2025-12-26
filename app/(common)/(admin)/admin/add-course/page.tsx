import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { getSubjectById } from "@/lib/actions/subjects";
import { getLearningStreams } from "@/lib/actions/learning-streams";
import { AddCourseClient } from "@/components/admin/add-course-form";

export const dynamic = "force-dynamic";

interface AdminAddCoursePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminAddCoursePage({
  searchParams,
}: AdminAddCoursePageProps) {
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedSearchParams.courseId as string | undefined;

  // Fetch streams (always needed)
  const streamsResult = await getLearningStreams();
  const streams =
    streamsResult.success && streamsResult.data ? streamsResult.data : [];

  let initialData = null;

  // Fetch course if editing
  if (courseId) {
    const courseResult = await getSubjectById(courseId);
    if (!courseResult.success || !courseResult.data) {
      return (
        <EmptyState
          title="Course not found"
          description="The course you are trying to edit does not exist or could not be loaded."
          action={
            <Link href="/admin/courses">
              <Button>Go Back</Button>
            </Link>
          }
        />
      );
    }
    initialData = courseResult.data.subject;
  }

  return (
    <AddCourseClient
      initialData={initialData}
      streams={streams}
      courseId={courseId}
    />
  );
}
