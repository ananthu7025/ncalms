"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowRight,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import {
  getLibraryCourses,
  type LibraryCourse,
} from "@/lib/actions/library";
import { EmptyState } from "@/components/EmptyState";
import toaster from "@/lib/toaster";
import { YouTubeModal } from "@/components/modals/YouTubeModal";
import {
  getContentTypeIcon,
  getContentTypeColor,
  isVideoContentType,
  isDocumentContentType,
} from "@/lib/content-type-utils";
import { LibraryPageSkeleton } from "@/components/skeletons/library-skeleton";

type FilterType = "all" | string;

export default function MyLibrary() {
  const [courses, setCourses] = useState<LibraryCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    loadLibrary();
  }, []);

  async function loadLibrary() {
    setLoading(true);
    try {
      const result = await getLibraryCourses();
      if (result.success && result.courses) {
        setCourses(result.courses);
      } else {
        toaster.error(result.error || "Failed to load library");
      }
    } catch (error) {
      console.error("Error loading library:", error);
      toaster.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  }

  // Get unique content types from all courses
  const uniqueContentTypes = useMemo(() => {
    const types = new Set<string>();
    courses.forEach(course => {
      course.contentAccess.forEach(access => {
        types.add(access.contentTypeName);
      });
    });
    return Array.from(types);
  }, [courses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    // Apply content type filter
    if (filterType !== "all") {
      filtered = filtered.filter((course) =>
        course.contentAccess.some(
          (access) => access.contentTypeName.toLowerCase() === filterType.toLowerCase()
        )
      );
    }

    return filtered;
  }, [courses, searchQuery, filterType]);

  // Get content by type for a course
  const getContentByType = (course: LibraryCourse, typeName: string) => {
    return course.contents.filter(
      (content) => content.contentTypeName === typeName
    );
  };

  // Check if course has access to content type
  const hasAccessToType = (course: LibraryCourse, typeName: string) => {
    return course.contentAccess.some(
      (access) => access.contentTypeName === typeName
    );
  };

  // Get content type icon and color (using utility function)
  const getContentTypeInfo = (typeName: string) => {
    const Icon = getContentTypeIcon(typeName);
    const colors = getContentTypeColor(typeName);
    return {
      icon: Icon,
      color: colors.icon,
      bgColor: colors.bg,
    };
  };

  // Calculate progress (placeholder - can be enhanced with actual progress tracking)
  const calculateProgress = (course: LibraryCourse) => {
    // For now, return 0% - this can be enhanced later with actual progress tracking
    return 0;
  };

  if (loading) {
    return <LibraryPageSkeleton />;
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Courses Yet"
        description="Browse our catalog and start learning!"
        actionLabel="Browse Courses"
        actionHref="/learner/courses"
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
          <p className="text-muted-foreground mt-1">
            Access all your purchased courses and materials
          </p>
        </div>

        <Badge variant="secondary" className="text-sm py-1.5 px-3 w-fit">
          {courses.length} {courses.length === 1 ? "Course" : "Courses"}
        </Badge>
      </div>

      {/* Search & Filter Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
          >
            All
          </Button>
          {uniqueContentTypes.map((contentType) => (
            <Button
              key={contentType}
              size="sm"
              variant={filterType.toLowerCase() === contentType.toLowerCase() ? "default" : "outline"}
              onClick={() => setFilterType(contentType)}
            >
              {contentType}
            </Button>
          ))}
        </div>
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No courses found matching your search.
          </p>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredCourses.map((course) => {
          const courseContentTypes = course.contentAccess.map(access => access.contentTypeName);
          return (
            <Card
              key={course.id}
              className="hover:shadow-card-hover transition-all overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Thumbnail */}
                <div className="lg:w-64 aspect-video bg-muted relative overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardContent className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Content Type Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.contentAccess.map((access) => {
                      const info = getContentTypeInfo(access.contentTypeName);
                      const Icon = info.icon;
                      return (
                        <Badge
                          key={access.contentTypeId}
                          variant="outline"
                          className="text-xs"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {access.contentTypeName}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Tabs for Content Types */}
                  <Tabs defaultValue={courseContentTypes[0]?.toLowerCase() || "content"} className="mt-4">
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${courseContentTypes.length}, minmax(0, 1fr))` }}>
                      {courseContentTypes.map((contentType) => {
                        const Icon = getContentTypeIcon(contentType);
                        return (
                          <TabsTrigger
                            key={contentType}
                            value={contentType.toLowerCase()}
                            className="text-xs"
                          >
                            <Icon className="w-3 h-3 mr-1" /> {contentType}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {/* Dynamic Content Tabs */}
                    {courseContentTypes.map((contentType) => {
                      const typeContents = getContentByType(course, contentType);
                      const Icon = getContentTypeIcon(contentType);
                      const colors = getContentTypeColor(contentType);
                      const isVideo = isVideoContentType(contentType);
                      const isDocument = isDocumentContentType(contentType);
                      return (
                        <TabsContent key={contentType} value={contentType.toLowerCase()} className="mt-3 space-y-2">
                          {typeContents.length > 0 ? (
                            typeContents.map((content) => (
                              <div
                                key={content.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg} ${colors.icon} flex-shrink-0`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {content.title}
                                    </p>
                                    {content.duration && (
                                      <p className="text-xs text-muted-foreground">
                                        {content.duration} min
                                      </p>
                                    )}
                                    {content.description && !content.duration && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {content.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
{content.fileUrl && (() => {
                                  // Parse fileUrl - it's stored as JSON string in DB
                                  let url = "";
                                  try {
                                    const parsed = JSON.parse(content.fileUrl);
                                    url = Array.isArray(parsed) ? parsed[0] : parsed;
                                  } catch {
                                    // If parsing fails, use as-is
                                    url = content.fileUrl;
                                  }

                                  return (
                                    <>
                                      {isVideo && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            setVideoModal({
                                              isOpen: true,
                                              url: url,
                                              title: content.title,
                                            })
                                          }
                                        >
                                          <span className="text-sm">Watch</span>
                                          <Icon className="w-3 h-3 ml-1" />
                                        </Button>
                                      )}
                                      {isDocument && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => window.open(url, "_blank")}
                                        >
                                          <span className="text-sm">Open</span>
                                          <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                      )}
                                      {!isVideo && !isDocument && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => window.open(url, "_blank")}
                                        >
                                          <span className="text-sm">View</span>
                                          <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No {contentType.toLowerCase()} content available
                            </p>
                          )}
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Video Modal */}
      <YouTubeModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, url: "", title: "" })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
}
