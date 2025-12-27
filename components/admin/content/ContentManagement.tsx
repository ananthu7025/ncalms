"use client";

import { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { AddContentDialog } from "./AddContentDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YouTubeModal } from "@/components/modals/YouTubeModal";
import { PDFModal } from "@/components/modals/PDFModal";
import {
  getSubjectContents,
  deleteSubjectContent,
} from "@/lib/actions/subject-contents";
import {
  Video,
  FileText,
  HelpCircle,
  Search,
  Loader2,
  GripVertical,
  Eye,
  Trash2,
} from "lucide-react";

interface ContentType {
  id: string;
  name: string;
}

interface Content {
  content: {
    id: string;
    title: string;
    price: string;
    duration: number | null;
    isActive: boolean;
    fileUrl: string | null;
  };
  contentType: {
    id: string;
    name: string;
  } | null;
}

interface ContentManagementProps {
  contentTypes: ContentType[];
  selectedSubjectId: string;
  initialContents: Content[];
  loading: boolean;
}

const getContentIcon = (contentTypeName: string) => {
  if (contentTypeName?.toLowerCase().includes("video")) return Video;
  if (contentTypeName?.toLowerCase().includes("pdf")) return FileText;
  return HelpCircle;
};

export function ContentManagement({
  contentTypes,
  selectedSubjectId,
  initialContents,
  loading,
}: ContentManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contents, setContents] = useState<Content[]>(initialContents);
  const [activeTab, setActiveTab] = useState(contentTypes[0]?.id || "");

  // Modal states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Update contents when initialContents changes
  useEffect(() => {
    setContents(initialContents);
  }, [initialContents]);

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setCurrentFileIndex(0); // Reset to first file

    if (!content.content.fileUrl) {
      toaster.error("No file URL available for this content");
      return;
    }

    const contentTypeName = content.contentType?.name.toLowerCase() || "";

    if (contentTypeName.includes("video")) {
      setIsVideoModalOpen(true);
    } else if (contentTypeName.includes("pdf")) {
      setIsPDFModalOpen(true);
    } else {
      toaster.error("Unsupported content type for preview");
    }
  };

  // Helper function to get the count of files from fileUrl
  const getFileCount = (fileUrl: string | null): number => {
    if (!fileUrl) return 0;

    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(fileUrl);
      if (Array.isArray(parsed)) {
        return parsed.length;
      }
      return 1; // Single URL
    } catch {
      // If not valid JSON, assume it's a single URL
      return 1;
    }
  };

  // Helper function to get all URLs from fileUrl
  const getAllFileUrls = (fileUrl: string | null): string[] => {
    if (!fileUrl) return [];

    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(fileUrl);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [fileUrl]; // Single URL
    } catch {
      // If not valid JSON, assume it's a single URL
      return [fileUrl];
    }
  };

  // Get current file URL based on index
  const getCurrentFileUrl = (): string => {
    if (!selectedContent) return "";
    const urls = getAllFileUrls(selectedContent.content.fileUrl);
    return urls[currentFileIndex] || "";
  };

  // Navigate to next file
  const handleNextFile = () => {
    if (!selectedContent) return;
    const urls = getAllFileUrls(selectedContent.content.fileUrl);
    if (currentFileIndex < urls.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  // Navigate to previous file
  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const result = await deleteSubjectContent(contentId);
    if (result.success) {
      toaster.success("Content deleted successfully");
      const refreshResult = await getSubjectContents(selectedSubjectId);
      if (refreshResult.success && refreshResult.data) {
        setContents(refreshResult.data);
      }
    } else {
      toaster.error(result.error || "Failed to delete content");
    }
  };

  const handleContentCreated = async () => {
    const refreshResult = await getSubjectContents(selectedSubjectId);
    if (refreshResult.success && refreshResult.data) {
      setContents(refreshResult.data);
    }
  };

  const filteredContents = contents.filter((item) =>
    item.content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContentType = contentTypes.find((ct) => ct.id === activeTab);

  const tabFilteredContents = filteredContents.filter(
    (item) => item.contentType?.id === activeTab
  );

  const getAddButtonText = () => {
    if (!activeContentType) return "Add Content";
    return `Add ${activeContentType.name}`;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <TabsList className="inline-flex w-full sm:w-auto">
          {contentTypes.map((ct) => {
            const Icon = getContentIcon(ct.name);
            return (
              <TabsTrigger
                key={ct.id}
                value={ct.id}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {ct.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddContentDialog
            contentTypes={contentTypes}
            selectedSubjectId={selectedSubjectId}
            activeContentTypeId={activeTab}
            buttonText={getAddButtonText()}
            onContentCreated={handleContentCreated}
          />
        </div>
      </div>
      {contentTypes.map((ct) => (
        <TabsContent key={ct.id} value={ct.id} className="mt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tabFilteredContents.length === 0 ? (
            <EmptyState
              title={`No ${ct.name.toLowerCase()} found`}
              description={
                searchQuery
                  ? `No ${ct.name.toLowerCase()} match your search`
                  : `Add ${ct.name.toLowerCase()} to get started`
              }
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {tabFilteredContents.map((item) => {
                    const Icon = getContentIcon(item.contentType?.name || "");
                    return (
                      <div
                        key={item.content.id}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.content.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.contentType?.name} • ${item.content.price}
                            {item.content.duration &&
                              ` • ${item.content.duration} min`}
                            {item.content.fileUrl && getFileCount(item.content.fileUrl) > 0 && (
                              ` • ${getFileCount(item.content.fileUrl)} ${
                                item.contentType?.name.toLowerCase().includes("video")
                                  ? `video${getFileCount(item.content.fileUrl) > 1 ? 's' : ''}`
                                  : `file${getFileCount(item.content.fileUrl) > 1 ? 's' : ''}`
                              }`
                            )}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.content.isActive ? "default" : "secondary"
                          }
                        >
                          {item.content.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewContent(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteContent(item.content.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      ))}

      {/* Video Modal */}
      {selectedContent && (
        <YouTubeModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedContent(null);
            setCurrentFileIndex(0);
          }}
          videoUrl={getCurrentFileUrl()}
          title={`${selectedContent.content.title}${
            getFileCount(selectedContent.content.fileUrl) > 1
              ? ` (${currentFileIndex + 1}/${getFileCount(selectedContent.content.fileUrl)})`
              : ""
          }`}
          onNext={
            currentFileIndex < getFileCount(selectedContent.content.fileUrl) - 1
              ? handleNextFile
              : undefined
          }
          onPrevious={currentFileIndex > 0 ? handlePreviousFile : undefined}
        />
      )}

      {/* PDF Modal */}
      {selectedContent && (
        <PDFModal
          isOpen={isPDFModalOpen}
          onClose={() => {
            setIsPDFModalOpen(false);
            setSelectedContent(null);
            setCurrentFileIndex(0);
          }}
          pdfUrl={getCurrentFileUrl()}
          title={`${selectedContent.content.title}${
            getFileCount(selectedContent.content.fileUrl) > 1
              ? ` (${currentFileIndex + 1}/${getFileCount(selectedContent.content.fileUrl)})`
              : ""
          }`}
          onNext={
            currentFileIndex < getFileCount(selectedContent.content.fileUrl) - 1
              ? handleNextFile
              : undefined
          }
          onPrevious={currentFileIndex > 0 ? handlePreviousFile : undefined}
        />
      )}
    </Tabs>
  );
}
