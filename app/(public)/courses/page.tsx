import type { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/public/Breadcrumb";
import { getActiveSubjectsWithStats } from "@/lib/actions/subjects";
import CourseCardImage from "@/components/public/CourseCardImage";
import CourseSearchForm from "@/components/public/CourseSearchForm";

export const metadata: Metadata = {
  title: 'NCA Courses - Comprehensive Online Learning | NCA Made Easy',
  description: 'Browse our complete collection of NCA courses. Expert-led instruction, detailed study materials, and interactive workshops to help you succeed in your NCA exams.',
  keywords: ['NCA courses', 'online law courses', 'NCA exam prep', 'Canadian law education', 'legal studies'],
  openGraph: {
    title: 'NCA Courses - Expert-Led Online Learning',
    description: 'Comprehensive NCA courses with study materials, videos, and mock exams',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ncamadeeasy.com'}/courses`,
    siteName: 'NCA Made Easy',
    images: ['/assets/img/logo.jpeg'],
    locale: 'en_CA',
    type: 'website',
  },
};

// Helper function to convert YouTube URLs to embed format
function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Check if it's a YouTube URL
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  // If already an embed URL or other video platform, return as is
  return url;
}

interface CoursePageProps {
  searchParams: Promise<{ search?: string }>;
}

const CoursePage = async ({ searchParams }: CoursePageProps) => {
  const params = await searchParams;
  const searchQuery = params.search?.toLowerCase().trim() || '';

  const result = await getActiveSubjectsWithStats();
  const allCourses = result.success && result.data ? result.data : [];

  // Filter courses based on search query
  const displayedCourses = searchQuery
    ? allCourses.filter((item) => {
      const { subject, stream, examType } = item;
      return (
        subject.title.toLowerCase().includes(searchQuery) ||
        subject.description?.toLowerCase().includes(searchQuery) ||
        stream?.name?.toLowerCase().includes(searchQuery) ||
        examType?.name?.toLowerCase().includes(searchQuery)
      );
    })
    : allCourses;

  const totalCourses = allCourses.length;
  const filteredCount = displayedCourses.length;

  return (
    <>
      {/* Breadcrumb Section */}
      <Breadcrumb
        title="Our Courses"
        items={[{ label: "HOME", href: "/" }, { label: "Courses" }]}
      />

      {/* Course Section */}
      <div className="section-course">
        <div className="bg-white pb-44">
          {/* Section Space */}
          <div className="section-space">
            {/* Section Container */}
            <div className="container">
              {/* Course Top */}
              <div className="mb-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:mb-10 md:justify-between">
                {/* Left Block */}
                <div className="order-2 md:order-1" data-aos="fade-right">
                  Showing {filteredCount > 0 ? '1' : '0'}-{filteredCount} of {searchQuery ? `${filteredCount}` : totalCourses} Result{filteredCount !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </div>

                {/* Right Block - Search Form */}
                <div className="order-1 w-full md:order-2 md:w-[436px]" data-aos="fade-left">
                  <CourseSearchForm initialQuery={searchQuery} />
                </div>
              </div>

              {/* Course List */}
              {displayedCourses.length > 0 ? (
                <ul className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-2">
                  {displayedCourses.map((item, index) => {
                    const { subject, stream, examType, stats } = item;
                    const bundlePrice = subject.bundlePrice ? parseFloat(subject.bundlePrice) : 0;
                    const embedUrl = subject.demoVideoUrl ? getEmbedUrl(subject.demoVideoUrl) : null;

                    return (
                      <li key={subject.id} data-aos="fade-up" data-aos-delay={index * 100} className="w-full">
                        <div className="jos w-full">
                          <div className="group relative flex flex-col items-center xl:flex-row w-full">
                            {/* Thumbnail with Video Modal */}
                            <CourseCardImage
                              thumbnailUrl={subject.thumbnail || "/assets/img/images/th-2/course-img-1.jpg"}
                              courseTitle={subject.title}
                              courseId={subject.id}
                              streamName={stream?.name || "Course"}
                              videoUrl={embedUrl}
                              isFeatured={subject.isFeatured}
                              isMandatory={subject.isMandatory}
                            />

                            {/* Content */}
                            <div className="mt-[106px] w-full rounded-lg bg-white px-6 py-10 pt-36 shadow-[0_0_50px_42px] shadow-[#0E0548]/5 transition-all duration-300 sm:px-8 xl:ml-[106px] xl:mt-0 xl:pl-36 xl:pt-10">
                              {/* Course Meta */}
                              <div className="flex gap-9">
                                <span className="inline-flex items-center gap-1.5 text-sm">
                                  <Image
                                    src="/assets/img/icons/icon-grey-book-3-line.svg"
                                    alt="lessons icon"
                                    width={17}
                                    height={17}
                                  />
                                  <span className="flex-1">{stats.lessonsCount} Lessons</span>
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-sm">
                                  <Image
                                    src="/assets/img/icons/icon-grey-user-3-line.svg"
                                    alt="category icon"
                                    width={17}
                                    height={18}
                                  />
                                  <span className="flex-1">{examType?.name || stream?.name || "General"}</span>
                                </span>
                              </div>

                              {/* Title Link */}
                              <Link
                                href={`/courses/${subject.id}`}
                                className="my-6 block font-title text-xl font-bold text-colorBlackPearl hover:text-colorPurpleBlue"
                              >
                                {subject.title}
                              </Link>

                              {/* Review Star */}
                              <div className="inline-flex gap-x-[10px] text-sm">
                                <div className="inline-flex items-center gap-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Image
                                      key={i}
                                      src={i < stats.rating ? "/assets/img/icons/icon-yellow-star.svg" : "/assets/img/icons/icon-yellow-star-blank.svg"}
                                      alt="star rating"
                                      width={16}
                                      height={15}
                                    />
                                  ))}
                                </div>
                                <span>({stats.reviews} Reviews)</span>
                              </div>

                              {/* Bottom Text */}
                              <div className="mt-4 flex items-center justify-between">
                                <span className="font-title text-xl font-bold text-colorPurpleBlue">
                                  {subject.isBundleEnabled && bundlePrice > 0
                                    ? `$${bundlePrice.toFixed(2)}`
                                    : ""}
                                </span>

                                <div className="inline-flex items-center gap-1.5 text-sm">
                                  <Image
                                    src="/assets/img/icons/icon-grey-graduation-cap-line.svg"
                                    alt="students icon"
                                    width={17}
                                    height={17}
                                  />
                                  <span className="flex-1">{stats.studentsCount} Students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-20">
                  <p className="text-colorBlackPearl/70">
                    {searchQuery
                      ? `No courses found matching "${searchQuery}". Try a different search term.`
                      : "No courses available at the moment."}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;