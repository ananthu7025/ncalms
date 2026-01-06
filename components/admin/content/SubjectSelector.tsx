"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContentStats } from "./ContentStats";
import { Button } from "@/components/ui/button";
import { ContentManagement } from "./ContentManagement";
import { getSubjectContents } from "@/lib/actions/subject-contents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subject {
  id: string;
  title: string;
}

interface ContentType {
  id: string;
  name: string;
}

interface Content {
  content: {
    id: string;
    title: string;
    duration: number | null;
    isActive: boolean;
    fileUrl: string | null;
  };
  contentType: {
    id: string;
    name: string;
  } | null;
}

interface SubjectSelectorProps {
  subjects: Subject[];
  contentTypes: ContentType[];
  initialContents: Content[];
  initialSubjectId: string;
}

export function SubjectSelector({
  subjects,
  contentTypes,
  initialContents,
  initialSubjectId,
}: SubjectSelectorProps) {
  
  const router = useRouter();
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [loading, setLoading] = useState(false);

  const handleSubjectChange = (newSubjectId: string) => {
    setSelectedSubjectId(newSubjectId);
    // Update URL when subject changes
    router.push(`/admin/content/${newSubjectId}`);
  };

  // Fetch contents when subject changes
  useEffect(() => {
    async function fetchContents() {
      if (!selectedSubjectId) return;

      setLoading(true);
      const result = await getSubjectContents(selectedSubjectId);
      if (result.success && result.data) {
        setContents(result.data);
      }
      setLoading(false);
    }

    // Only fetch if different from initial
    if (selectedSubjectId !== initialSubjectId) {
      fetchContents();
    }
  }, [selectedSubjectId, initialSubjectId]);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Course Content</h1>
          <p className="text-muted-foreground mt-1">
            Manage videos, PDFs, and other content
          </p>
        </div>
        <Select value={selectedSubjectId} onValueChange={handleSubjectChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ContentStats contentTypes={contentTypes} contents={contents} />

      <ContentManagement
        contentTypes={contentTypes}
        selectedSubjectId={selectedSubjectId}
        initialContents={contents}
        loading={loading}
      />
    </>
  );
}
