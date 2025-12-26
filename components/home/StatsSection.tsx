const stats = [
  { value: '3,192+', label: 'Courses Available' },
  { value: '15,445+', label: 'Active Students' },
  { value: '97.55%', label: 'Satisfaction Rate' },
  { value: '97.55%', label: 'Career Improvement' },
];

export function StatsSection() {
  return (
    <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm lg:text-base opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
