"use client";

import Link from 'next/link';
import { PublicCourseCard } from '@/components/PublicCourseCard';
import Reveal from '@/components/animations/Reveal';
import { ArrowRight } from 'lucide-react';

interface Course {
    subject: {
        id: string;
        title: string;
        description: string | null;
        thumbnail: string | null;
        demoVideoUrl: string | null;
        bundlePrice: string | null;
        isBundleEnabled: boolean;
        isActive: boolean;
    };
    stream: {
        name: string;
    } | null;
    examType: {
        name: string;
    } | null;
}

interface CoursesSectionProps {
    courses: Course[];
}

export function CoursesSection({ courses }: CoursesSectionProps) {
    const displayedCourses = courses.slice(0, 6);
    const hasMore = courses.length > 6;

    return (
        <>
            <div className="row gy-4 justify-content-center">
                {displayedCourses.map((item, i) => (
                    <Reveal key={item.subject.id} y={50} delay={0.1 * (i % 3)} className="col-lg-4 col-md-6">
                        <PublicCourseCard
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
                    </Reveal>
                ))}
            </div>

            {hasMore && (
                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <Reveal y={30} delay={0.2}>
                            <Link
                                href="/courses"
                                className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow-sm text-decoration-none"
                                style={{
                                    transition: 'all 0.3s ease',
                                    borderRadius: '50rem'
                                }}
                            >
                                Show More Courses
                                <ArrowRight size={20} className="ms-2 d-inline-block align-middle" />
                            </Link>
                        </Reveal>
                    </div>
                </div>
            )}
        </>
    );
}
