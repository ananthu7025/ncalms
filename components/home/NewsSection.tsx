import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const news = [
  {
    title: 'How to improve your skills in digital marketing',
    date: 'Dec 15, 2024',
    image: '📱',
    category: 'Marketing',
  },
  {
    title: 'The importance of UI/UX design in modern web development',
    date: 'Dec 12, 2024',
    image: '🎨',
    category: 'Design',
  },
  {
    title: 'New technologies shaping the future of education',
    date: 'Dec 10, 2024',
    image: '🚀',
    category: 'Technology',
  },
];

export function NewsSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends and news in education
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card 
              key={item.title}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border cursor-pointer"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{item.image}</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                  <span className="ml-auto text-primary font-medium">{item.category}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <Button variant="link" className="p-0 mt-4 text-primary">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
