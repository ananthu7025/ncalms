import React from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Reveal from '@/components/animations/Reveal';
import { getActiveSubjects } from '@/lib/actions/subjects';
import { EmptyState } from '@/components/EmptyState';
import { PublicCourseCard } from '@/components/PublicCourseCard';

export default async function CoursesPage() {
    const result = await getActiveSubjects();
    const subjects = result.success && result.data ? result.data : [];

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section style={{marginTop:"20px"}} className="bg-gradient-to-br from-blue-600/10 via-teal-500/5 to-transparent pt-32 pb-16 mt-4 ">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Reveal>
                        <div className="text-center max-w-3xl mx-auto space-y-4 mt-2">
                            <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-2 mt-4">
                                <span className="text-lg">⚡</span>
                                NCA Exam Preparation
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Explore Our Courses
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                Comprehensive preparation courses designed to help you succeed in your NCA exams
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Courses Grid Section */}
            <section className="bg-gray-50/50 py-16 md:py-20 min-h-[60vh]">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Reveal>
                        {subjects.length === 0 ? (
                            <div className="py-20">
                                <EmptyState
                                    title="No courses available"
                                    description="Check back soon for new courses!"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
                                {subjects.map((item) => (
                                    <PublicCourseCard
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
