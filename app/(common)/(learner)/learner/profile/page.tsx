import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { currentUser, purchasedCourses, learnerStats } from '@/data/mockData';
import Link from 'next/link';

export default function Profile() {
  const achievements = [
    { icon: Trophy, title: 'First Course', description: 'Completed your first course', earned: true },
    { icon: Star, title: 'High Achiever', description: 'Scored 90%+ on an exam', earned: true },
    { icon: TrendingUp, title: '7-Day Streak', description: 'Studied for 7 days in a row', earned: true },
    { icon: Award, title: 'Scholar', description: 'Complete 5 courses', earned: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
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
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <Badge variant="secondary">NCA Candidate</Badge>
                <Badge variant="outline">Member since Jan 2024</Badge>
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
            <p className="text-2xl font-bold">{learnerStats.coursesEnrolled}</p>
            <p className="text-sm text-muted-foreground">Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-info mb-2" />
            <p className="text-2xl font-bold">{learnerStats.hoursLearned}</p>
            <p className="text-sm text-muted-foreground">Hours Learned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold">{learnerStats.certificatesEarned}</p>
            <p className="text-sm text-muted-foreground">Certificates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-warning mb-2" />
            <p className="text-2xl font-bold">{learnerStats.currentStreak}</p>
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
            {purchasedCourses.map((pc) => (
              <div key={pc.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={pc.course.thumbnail}
                    alt={pc.course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{pc.course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={pc.overallProgress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{pc.overallProgress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${achievement.earned
                      ? 'bg-accent/50 border-primary/30'
                      : 'bg-muted/30 border-border opacity-50'
                    }`}
                >
                  <achievement.icon className={`w-8 h-8 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  <p className="font-medium text-sm mt-2">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
