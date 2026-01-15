/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getProfileData } from '@/lib/actions/profile';

// Force dynamic rendering since we use auth() which requires headers
export const dynamic = 'force-dynamic';

export default async function Profile() {
  const result = await getProfileData();

  // Handle errors gracefully without redirecting
  if (!result.success || !result.data) {
    console.error('Profile data fetch error:', result.error);

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">Unable to load profile data</p>
            <p className="text-sm text-muted-foreground mt-2">{result.error || 'Please try again later'}</p>
            <Link href="/learner/dashboard" className="mt-4 inline-block">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, enrolledCourses } = result.data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Courses</CardTitle>
            <Link href="/learner/library">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg">
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={course.overallProgress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{course.overallProgress}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No courses enrolled yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
