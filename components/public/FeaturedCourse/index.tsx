import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getActiveSubjectsWithStats } from "@/lib/actions/subjects";

const FeaturedCourse = async () => {
  const result = await getActiveSubjectsWithStats();

  // Get first 4 courses for featured section
  const courses = result.success && result.data ? result.data.slice(0, 4) : [];

  if (!result.success || courses.length === 0) {
    return (
      <section className="section-course">
        <div className="bg-white">
          <div className="section-space">
            <div className="container">
              <div className="mx-auto max-w-md text-center">
                <p className="text-colorBlackPearl/70">No courses available at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-course">
      <div className="bg-white">
        <div className="section-space">
          <div className="container">

            {/* Section Header */}
            <div className="mb-10 lg:mb-[60px]">
              <div className="mx-auto max-w-md text-center" data-aos="fade-up">
                <span className="mb-5 block uppercase">FEATURED COURSES</span>
                <h2>NCA Core Subjects</h2>
              </div>
            </div>

            {/* Course Grid */}
            <ul className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {courses.map((item, idx) => {
                const { subject, stream, examType, stats } = item;
                const bundlePrice = subject.bundlePrice ? parseFloat(subject.bundlePrice) : 0;

                return (
                  <li key={subject.id} data-aos="fade-up" data-aos-delay={idx * 100}>
                    <Link href={`/courses/${subject.id}`}>
                      <div className="group overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md">

                        {/* Image */}
                        <div className="relative block overflow-hidden">
                          <Image
                            src={subject.thumbnail || "/assets/img/images/th-1/course-img-1.jpg"}
                            alt={subject.title}
                            width={370}
                            height={270}
                            className="h-auto w-full transition-all duration-300 group-hover:scale-105 object-cover"
                          />
                          <span className="absolute left-3 top-3 inline-block rounded-[40px] bg-colorBrightGold px-3.5 py-1.5 text-sm leading-none text-colorBlackPearl">
                            {stream?.name || "Featured"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="bg-[#F5F5F5] px-5 py-8">
                          <div className="flex gap-9">
                            <span className="inline-flex items-center gap-1.5 text-sm">
                              <Image
                                src="/assets/img/icons/icon-grey-book-3-line.svg"
                                alt="lessons"
                                width={17}
                                height={17}
                              />
                              {stats.lessonsCount} Lessons
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-sm text-colorBlackPearl/70">
                              <Image
                                src="/assets/img/icons/icon-grey-user-3-line.svg"
                                alt="stream"
                                width={17}
                                height={18}
                              />
                              {examType?.name || stream?.name || "Course"}
                            </span>
                          </div>

                          <h3 className="my-4 font-title text-xl font-bold text-colorBlackPearl">
                            {subject.title}
                          </h3>

                          <p className="mb-4 text-sm text-colorBlackPearl/70 line-clamp-2">
                            {subject.description || "Comprehensive course covering essential topics and concepts."}
                          </p>

                          <div className="inline-flex gap-x-[10px] text-sm">
                            <div className="inline-flex items-center gap-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Image
                                  key={i}
                                  src="/assets/img/icons/icon-yellow-star.svg"
                                  alt="star"
                                  width={16}
                                  height={15}
                                />
                              ))}
                            </div>
                            <span>({stats.reviews} Reviews)</span>
                          </div>

                          <div className="my-6 h-px w-full bg-[#E9E5DA]"></div>

                          <div className="flex items-center justify-between">
                            <span className="font-title text-xl font-bold text-colorPurpleBlue">
                              {subject.isBundleEnabled && bundlePrice > 0
                                ? `$${bundlePrice.toFixed(2)}`
                                : "Contact"}
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-sm">
                              <Image
                                src="/assets/img/icons/icon-grey-graduation-cap-line.svg"
                                alt="students"
                                width={17}
                                height={17}
                              />
                              {stats.studentsCount} Students
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourse;
