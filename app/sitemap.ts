import { MetadataRoute } from 'next';
import { getActiveSubjectsWithStats } from '@/lib/actions/subjects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL - update this to your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ncamadeeasy.com';

  // Get all active courses for dynamic routes
  const result = await getActiveSubjectsWithStats();
  const courses = result.success && result.data ? result.data : [];

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book-a-call`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic course routes
  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.subject.id}`,
    lastModified: new Date(course.subject.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...courseRoutes];
}
