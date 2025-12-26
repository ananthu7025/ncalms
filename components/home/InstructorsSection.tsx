import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const instructors = [
  { name: 'John Smith', role: 'Web Development', students: 1250, courses: 8, avatar: '👨‍💼' },
  { name: 'Sarah Johnson', role: 'UI/UX Design', students: 890, courses: 5, avatar: '👩‍💼' },
  { name: 'Mike Brown', role: 'Digital Marketing', students: 2100, courses: 12, avatar: '👨‍🏫' },
  { name: 'Emily Davis', role: 'Business Strategy', students: 750, courses: 6, avatar: '👩‍🏫' },
];

export function InstructorsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn from industry professionals who are passionate about teaching
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <Card 
              key={instructor.name}
              className="group text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <CardContent className="p-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                  {instructor.avatar}
                </div>
                <h3 className="font-semibold text-lg text-foreground">{instructor.name}</h3>
                <Badge variant="secondary" className="mt-2 mb-4">{instructor.role}</Badge>
                <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <div className="font-semibold text-foreground">{instructor.students}</div>
                    <div>Students</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{instructor.courses}</div>
                    <div>Courses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
