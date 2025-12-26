/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BookOpen,
  Clock,
  Award,
  Trophy,
  Star,
  Calendar,
  TrendingUp,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import { getProfileData } from '@/lib/actions/profile';

const iconMap: Record<string, any> = {
  Trophy,
  Star,
  TrendingUp,
  Award,
};

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

  const { user, stats, enrolledCourses, achievements } = result.data;

  // Format member since date
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <Badge variant="secondary">NCA Candidate</Badge>
                <Badge variant="outline">Member since {memberSince}</Badge>
              </div>
            </div>
            <Link href="/learner/settings">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
            <p className="text-sm text-muted-foreground">Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-info mb-2" />
            <p className="text-2xl font-bold">{stats.hoursLearned}</p>
            <p className="text-sm text-muted-foreground">Hours Learned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
            <p className="text-sm text-muted-foreground">Certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-warning mb-2" />
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
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

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, i) => {
                const IconComponent = iconMap[achievement.icon] || Trophy;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${achievement.earned
                        ? 'bg-accent/50 border-primary/30'
                        : 'bg-muted/30 border-border opacity-50'
                      }`}
                  >
                    <IconComponent className={`w-8 h-8 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    <p className="font-medium text-sm mt-2">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
