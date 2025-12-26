import { Code, Palette, TrendingUp, Users, BookOpen, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { icon: Code, name: 'Web Development', courses: '120+ Courses', color: 'bg-blue-500/10 text-blue-600' },
  { icon: Palette, name: 'UI/UX Product Design', courses: '80+ Courses', color: 'bg-pink-500/10 text-pink-600' },
  { icon: TrendingUp, name: 'Data & Analytics', courses: '95+ Courses', color: 'bg-green-500/10 text-green-600' },
  { icon: Users, name: 'Project Management', courses: '65+ Courses', color: 'bg-purple-500/10 text-purple-600' },
  { icon: BookOpen, name: 'Office Productivity', courses: '110+ Courses', color: 'bg-orange-500/10 text-orange-600' },
  { icon: Briefcase, name: 'Business Studies', courses: '75+ Courses', color: 'bg-teal-500/10 text-teal-600' },
];

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explore Top Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our most popular course categories and start your learning journey today
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.name}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-4 rounded-xl ${category.color} group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.courses}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
