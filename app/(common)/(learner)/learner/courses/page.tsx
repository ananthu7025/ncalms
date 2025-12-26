"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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
  };
  stream: { name: string } | null;
  examType: { name: string } | null;
};

export default function AllCoursesPage() {
  const [subjects, setSubjects] = useState<SubjectWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // Filter subjects based on search and category
  const filteredSubjects = useMemo(() => {
    let filtered = subjects;

    // Apply category filter (by learning stream)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (item) => item.stream?.name === selectedCategory
      );
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
  }, [subjects, selectedCategory, searchQuery]);

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

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills - Dynamic */}
      {categories.length > 0 && (
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
      )}

      {/* Courses Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title={searchQuery || selectedCategory !== 'all' ? 'No courses found' : 'No courses available'}
            description={
              searchQuery || selectedCategory !== 'all'
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
              href={`/learner/courses/${item.subject.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
