/* eslint-disable react/no-unescaped-entities */
import { CheckCircle, Users, Award, BookOpen } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of experience",
  },
  {
    icon: Award,
    title: "Certified Courses",
    description: "Get recognized certificates upon course completion",
  },
  {
    icon: BookOpen,
    title: "Lifetime Access",
    description: "Access your courses anytime, anywhere, forever",
  },
];

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 h-48 flex items-center justify-center">
                  <div className="text-7xl">👩‍🏫</div>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-6 h-36 flex items-center justify-center ml-8">
                  <div className="text-5xl">📖</div>
                </div>
              </div>
              <div className="pt-8">
                <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-8 h-64 flex items-center justify-center">
                  <div className="text-7xl">🎯</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm opacity-90">Years Experience</div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                We Care About Your Life For{" "}
                <span className="text-primary">Better Future</span>
              </h2>
              <p className="text-muted-foreground">
                Our platform is designed to help you achieve your learning goals
                with high-quality content, expert instructors, and a supportive
                community. Whether you're starting a new career or advancing in
                your current one, we're here to help you succeed.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Learn at your own pace
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                Mobile friendly
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
