"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Star, BookOpen, GraduationCap, X, Filter } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { getActiveSubjects } from '@/lib/actions/subjects';
import { EmptyState } from '@/components/EmptyState';
import { CoursesGridSkeleton } from '@/components/skeletons/course-card-skeleton';

type SubjectWithRelations = {
  subject: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    demoVideoUrl: string | null;
    bundlePrice: string | null;
    isBundleEnabled: boolean;
    isFeatured: boolean;
    isMandatory: boolean;
  };
  stream: { name: string } | null;
  examType: { name: string } | null;
};

export default function AllCoursesPage() {
  const [subjects, setSubjects] = useState<SubjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [showMandatoryOnly, setShowMandatoryOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    setLoading(true);
    try {
      const result = await getActiveSubjects();
      if (result.success && result.data) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  }

  // Extract unique learning streams from subjects
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    subjects.forEach((item) => {
      if (item.stream?.name) {
        uniqueCategories.add(item.stream.name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [subjects]);

  // Extract unique exam types from subjects
  const examTypes = useMemo(() => {
    const uniqueExamTypes = new Set<string>();
    subjects.forEach((item) => {
      if (item.examType?.name) {
        uniqueExamTypes.add(item.examType.name);
      }
    });
    return Array.from(uniqueExamTypes).sort();
  }, [subjects]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedExamType !== 'all') count++;
    if (showMandatoryOnly) count++;
    if (showFeaturedOnly) count++;
    return count;
  }, [selectedCategory, selectedExamType, showMandatoryOnly, showFeaturedOnly]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedExamType('all');
    setShowMandatoryOnly(false);
    setShowFeaturedOnly(false);
    setSearchQuery('');
  };

  // Filter subjects based on search and category
  const filteredSubjects = useMemo(() => {
    let filtered = subjects;

    // Apply category filter (by learning stream)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (item) => item.stream?.name === selectedCategory
      );
    }

    // Apply exam type filter
    if (selectedExamType !== 'all') {
      filtered = filtered.filter(
        (item) => item.examType?.name === selectedExamType
      );
    }

    // Apply mandatory filter
    if (showMandatoryOnly) {
      filtered = filtered.filter((item) => item.subject.isMandatory);
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter((item) => item.subject.isFeatured);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.subject.title.toLowerCase().includes(query) ||
          item.subject.description?.toLowerCase().includes(query) ||
          item.stream?.name.toLowerCase().includes(query) ||
          item.examType?.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [subjects, selectedCategory, selectedExamType, showMandatoryOnly, showFeaturedOnly, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded" />
        </div>
        {/* Search skeleton */}
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
        {/* Categories skeleton */}
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
        </div>
        {/* Courses grid skeleton */}
        <CoursesGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
        <p className="text-muted-foreground mt-1">
          Explore our comprehensive NCA exam preparation courses
        </p>
      </div>

      {/* Search and Filter Button */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant={activeFiltersCount > 0 ? 'default' : 'outline'}
              className={activeFiltersCount > 0 ? 'gradient-primary' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="space-y-4 p-4">
              {/* Header with Clear All */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="rounded-full">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground h-auto p-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              {/* Learning Streams */}
              {categories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Learning Streams:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      className={selectedCategory === 'all' ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        size="sm"
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        className={selectedCategory === category ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Types */}
              {examTypes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Exam Types:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={selectedExamType === 'all' ? 'default' : 'outline'}
                      className={selectedExamType === 'all' ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                      onClick={() => setSelectedExamType('all')}
                    >
                      <GraduationCap className="w-4 h-4 mr-1" />
                      All Exams
                    </Button>
                    {examTypes.map((examType) => (
                      <Button
                        key={examType}
                        size="sm"
                        variant={selectedExamType === examType ? 'default' : 'outline'}
                        className={selectedExamType === examType ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                        onClick={() => setSelectedExamType(examType)}
                      >
                        {examType}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quick Filters:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={showFeaturedOnly ? 'default' : 'outline'}
                    className={showFeaturedOnly ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                    onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  >
                    <Star className={`w-4 h-4 mr-1 ${showFeaturedOnly ? 'fill-current' : ''}`} />
                    Featured
                  </Button>
                  <Button
                    size="sm"
                    variant={showMandatoryOnly ? 'default' : 'outline'}
                    className={showMandatoryOnly ? 'rounded-full gradient-primary border-0' : 'rounded-full'}
                    onClick={() => setShowMandatoryOnly(!showMandatoryOnly)}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    Mandatory
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Courses Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title={searchQuery || selectedCategory !== 'all' || selectedExamType !== 'all' || showMandatoryOnly || showFeaturedOnly ? 'No courses found' : 'No courses available'}
            description={
              searchQuery || selectedCategory !== 'all' || selectedExamType !== 'all' || showMandatoryOnly || showFeaturedOnly
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new courses!'
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((item) => (
            <CourseCard
              key={item.subject.id}
              id={item.subject.id}
              title={item.subject.title}
              description={item.subject.description}
              thumbnail={item.subject.thumbnail}
              demoVideoUrl={item.subject.demoVideoUrl}
              streamName={item.stream?.name}
              examTypeName={item.examType?.name}
              bundlePrice={item.subject.bundlePrice}
              isBundleEnabled={item.subject.isBundleEnabled}
              isFeatured={item.subject.isFeatured}
              isMandatory={item.subject.isMandatory}
              href={`/learner/courses/${item.subject.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
