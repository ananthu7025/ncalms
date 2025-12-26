/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getSubjects } from "@/lib/actions/subjects";
import { EmptyState } from "@/components/EmptyState";

export default async function AdminCourseContent() {
  // Fetch subjects to redirect to first one
  const subjectsResult = await getSubjects();

  const subjects =
    subjectsResult.success && subjectsResult.data
      ? subjectsResult.data.map((s: any) => s.subject)
      : [];

  // Redirect to first subject if available
  if (subjects.length > 0) {
    redirect(`/admin/content/${subjects[0].id}`);
  }

  // If no subjects, show empty state
  return (
    <div className="space-y-6 animate-fade-in">
      <EmptyState
        title="No Subjects Found"
        description="Please create a subject first to manage content."
      />
    </div>
  );
}
