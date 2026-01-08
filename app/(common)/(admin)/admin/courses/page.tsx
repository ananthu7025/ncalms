import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getSubjects } from "@/lib/actions/subjects";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/page-header";
import { CourseCard } from "@/components/CourseCard";
import { CourseCardActions } from "@/components/admin/course-card-actions";
import { CoursesGridSkeleton } from "@/components/skeletons/course-card-skeleton";

export const dynamic = 'force-dynamic';

async function CoursesListContent() {
  const result = await getSubjects();
  console.log(result.data);

  if (!result) return null;

  if (!result.success) {
    return (
      <EmptyState
        title="Error loading courses"
        description={result.error || "Failed to load courses"}
      />
    );
  }

  const subjects = (result.data || []).map((s) => ({
    ...s.subject,
    stream: s.stream,
    examType: s.examType,
  }));

  if (subjects.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="Get started by creating your first course"
        action={
          <Link href="/admin/add-course">
            <Button className="gradient-primary">Create Course</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <CourseCard
          key={subject.id}
          id={subject.id}
          title={subject.title}
          description={subject.description}
          thumbnail={subject.thumbnail}
          demoVideoUrl={subject.demoVideoUrl}
          streamName={subject.stream?.name}
          examTypeName={subject.examType?.name}
          bundlePrice={subject.bundlePrice}
          isBundleEnabled={subject.isBundleEnabled}
          isFeatured={subject.isFeatured}
          isMandatory={subject.isMandatory}
          isActive={subject.isActive}
          href={`/admin/add-course?courseId=${subject.id}`}
          showInactiveBadge={true}
          customActions={
            <CourseCardActions
              courseId={subject.id}
              courseTitle={subject.title}
            />
          }
        />
      ))}
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="All Courses"
        description="Manage your NCA exam preparation courses"
      >
        <Link href="/admin/add-course">
          <Button className="gradient-primary">Add New Course</Button>
        </Link>
      </PageHeader>
      <Suspense fallback={<CoursesGridSkeleton />}>
        <CoursesListContent />
      </Suspense>
    </div>
  );
}
