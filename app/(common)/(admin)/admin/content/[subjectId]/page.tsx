/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getSubjects } from "@/lib/actions/subjects";
import { getContentTypes } from "@/lib/actions/content-types";
import { getSubjectContents } from "@/lib/actions/subject-contents";
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
  const [subjectsResult, contentTypesResult] = await Promise.all([
    getSubjects(),
    getContentTypes(),
  ]);

  const subjects =
    subjectsResult.success && subjectsResult.data
      ? subjectsResult.data.map((s: any) => s.subject)
      : [];

  const contentTypes =
    contentTypesResult.success && contentTypesResult.data
      ? contentTypesResult.data
      : [];

  // Validate that the subject exists
  const subjectExists = subjects.some((s: any) => s.id === subjectId);

  if (!subjectExists && subjects.length > 0) {
    // If subject doesn't exist, redirect to first subject
    redirect(`/admin/content/${subjects[0].id}`);
  }

  // Fetch contents for the specified subject
  const contentsResult = subjectId
    ? await getSubjectContents(subjectId)
    : { success: false, data: [] };

  const initialContents =
    contentsResult.success && contentsResult.data ? contentsResult.data : [];

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
