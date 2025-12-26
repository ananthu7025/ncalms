import React from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Reveal from '@/components/animations/Reveal';
import { getActiveSubjects } from '@/lib/actions/subjects';
import { EmptyState } from '@/components/EmptyState';
import { CourseCard } from '@/components/CourseCard';

export default async function CoursesPage() {
    const result = await getActiveSubjects();
    const subjects = result.success && result.data ? result.data : [];

    return (
        <>
            <Header />
            <section className="feature-course bg-white pt-24 pb-24">
                <div className="container mx-auto px-4">
                    <Reveal>
                        <div className="section-heading text-center mb-12">
                            <h4 className="sub-heading text-blue-600 font-semibold mb-2">
                                <span className="heading-icon mr-2">⚡</span>
                                NCA Exam Preparation
                            </h4>
                            <h2 className="section-title text-3xl md:text-4xl font-bold">
                                Explore Our Courses
                            </h2>
                        </div>

                        {subjects.length === 0 ? (
                            <div className="py-12">
                                <EmptyState
                                    title="No courses available"
                                    description="Check back soon for new courses!"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subjects.map((item) => (
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
                                        isActive={item.subject.isActive}
                                        href={`/courses/${item.subject.id}`}
                                    />
                                ))}
                            </div>
                        )}
                    </Reveal>
                </div>
            </section>
            <Footer />
        </>
    );
}
