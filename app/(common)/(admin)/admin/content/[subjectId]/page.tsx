/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getSubjects, getSubjectByIdWithStats } from "@/lib/actions/subjects";

import { SubjectSelector } from "@/components/admin/content/SubjectSelector";

interface PageProps {
  params: Promise<{
    subjectId: string;
  }>;
}

export default async function AdminCourseContentWithSubject({
  params,
}: PageProps) {
  const { subjectId } = await params;

  // Fetch initial data on the server
  // We use getSubjectByIdWithStats because it returns contentTypes filtered by "isIncluded" (pricing)
  // and also returns the contents, so we don't need separate calls.
  const [subjectsResult, subjectDetailsResult] = await Promise.all([
    getSubjects(),
    getSubjectByIdWithStats(subjectId),
  ]);

  const subjects =
    subjectsResult.success && subjectsResult.data
      ? subjectsResult.data.map((s: any) => s.subject)
      : [];

  const contentTypes =
    subjectDetailsResult.success && subjectDetailsResult.data
      ? subjectDetailsResult.data.contentTypes
      : [];

  const initialContents =
    subjectDetailsResult.success && subjectDetailsResult.data
      ? subjectDetailsResult.data.contents
      : [];

  // Validate that the subject exists (using the list of all subjects)
  const subjectExists = subjects.some((s: any) => s.id === subjectId);



  return (
    <div className="space-y-6 animate-fade-in">
      <SubjectSelector
        subjects={subjects}
        contentTypes={contentTypes}
        initialContents={initialContents}
        initialSubjectId={subjectId}
      />
    </div>
  );
}
