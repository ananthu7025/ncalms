import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/public/Breadcrumb";
import { getSubjectByIdWithStats } from "@/lib/actions/subjects";
import CourseHeroImage from "@/components/public/CourseHeroImage";
import { AddToCartButton } from "@/components/public/AddToCartButton";
import {
  getContentTypeIcon,
  getContentBundleDescription,
} from "@/lib/content-type-utils";
import CourseSyllabus from "@/components/public/CourseSyllabus";

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { id } = await params;
  const result = await getSubjectByIdWithStats(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { subject, stream, examType, stats, contentTypes, contents, pricing } = result.data;
  const bundlePrice = subject.bundlePrice ? parseFloat(subject.bundlePrice) : 0;
  const embedUrl = subject.demoVideoUrl ? getEmbedUrl(subject.demoVideoUrl) : null;

  // Parse objectives from JSON
  let objectives: string[] = [];
  try {
    if (subject.objectives) {
      if (typeof subject.objectives === 'string') {
        objectives = JSON.parse(subject.objectives);
      } else if (Array.isArray(subject.objectives)) {
        objectives = subject.objectives;
      }
    }
  } catch (e) {
    console.error("Failed to parse objectives:", e);
    objectives = [];
  }

  console.log("DEBUG PAGE: objectivesRaw:", subject.objectives);
  console.log("DEBUG PAGE: objectivesParsed:", objectives);
  // Group contents by content type
  const contentsByType = contents.reduce((acc, item) => {
    const typeId = item.contentType?.id;
    if (typeId) {
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(item.content);
    }
    return acc;
  }, {} as Record<string, typeof contents[0]['content'][]>);

  // Create pricing map for quick lookup
  const pricingMap = new Map(
    pricing.map((p) => [p.contentTypeId, parseFloat(p.price || "0")])
  );

  // Get price for a content type from the pricing table
  const getContentTypePrice = (contentTypeId: string): number => {
    return pricingMap.get(contentTypeId) || 0;
  };

  // Calculate total price if buying individually vs bundle
  const totalIndividualPrice = contentTypes.reduce((sum, ct) => sum + getContentTypePrice(ct.id), 0);
  const savings = totalIndividualPrice - bundlePrice;
  const discountPercent = totalIndividualPrice > 0 ? Math.round((savings / totalIndividualPrice) * 100) : 0;

  // Default learning points (can be moved to database later)


  const whyChoose = [
    "Study at your own pace with flexible online access",
    "High-quality video lectures and detailed study materials",
    "Proven track record of student success and satisfaction",
    "Dedicated support from our team of instructors",
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <Breadcrumb
        title={subject.title}
        items={[
          { label: "HOME", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: subject.title },
        ]}
      />

      {/* Course Section */}
      <section className="section-course">
        <div className="bg-white pb-44">
          {/* Section Space */}
          <div className="section-space">
            {/* Section Container */}
            <div className="container">
              {/* Course Details Area */}
              <div className="grid grid-cols-1 gap-x-[30px] gap-y-10 lg:grid-cols-[1fr_minmax(0,360px)]">
                {/* Course Details Left Block */}
                <div className="jos">
                  {/* Course Hero Image with Video Modal */}
                  <CourseHeroImage
                    thumbnailUrl={subject.thumbnail || "/assets/img/images/th-1/course-details-hero-img.jpg"}
                    courseTitle={subject.title}
                    videoUrl={embedUrl}
                  />

                  {/* Course Details Content Block */}
                  <div className="rich-text-area mt-11">
                    <h2>{subject.title}</h2>

                    {/* Course Category Badge */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {stream && (
                        <span className="inline-block rounded-[40px] bg-colorPurpleBlue px-4 py-2 text-sm text-white">
                          {stream.name}
                        </span>
                      )}
                      {examType && (
                        <span className="inline-block rounded-[40px] bg-colorBrightGold px-4 py-2 text-sm text-colorBlackPearl">
                          {examType.name}
                        </span>
                      )}
                    </div>

                    {subject.description ? (
                      <div className="mb-6">
                        <p>{subject.description}</p>
                      </div>
                    ) : (
                      <>
                        <p>
                          This comprehensive course is designed to help you master all the essential concepts
                          and prepare thoroughly for your exams. Our expert instructors provide in-depth coverage
                          of all topics with practical examples and real-world applications.
                        </p>
                        <p className="mt-4">
                          Whether you&apos;re a beginner or looking to advance your knowledge, this course offers
                          structured learning materials, practice exercises, and continuous support to ensure
                          your success.
                        </p>
                      </>
                    )}

                    {/* Available Content Types */}
                    {contentTypes.length > 0 && (
                      <div className="my-8">
                        <h5 className="mb-4">Available Content Types:</h5>
                        <div className="flex flex-wrap gap-3">
                          {contentTypes.map((ct) => (
                            <div
                              key={ct.id}
                              className="flex items-center gap-2 rounded-lg border border-colorPurpleBlue/20 bg-colorPurpleBlue/5 px-4 py-2"
                            >
                              <Image
                                src={
                                  ct.name === "VIDEO"
                                    ? "/assets/img/icons/icon-purple-arrow-right.svg"
                                    : ct.name === "PDF"
                                      ? "/assets/img/icons/icon-grey-book-3-line.svg"
                                      : "/assets/img/icons/icon-grey-graduation-cap-line.svg"
                                }
                                alt={ct.name}
                                width={20}
                                height={20}
                              />
                              <span className="font-medium">{ct.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Course Objectives Section */}
                  <CourseSyllabus
                    objectives={objectives}
                    syllabusPdfUrl={subject.syllabusPdfUrl}
                    additionalCoverage={subject.additionalCoverage}
                  />

                  {/* Course Content Preview */}
                  <div className="mt-10">
                    <h5 className="mb-6">Course Content</h5>
                    <div className="space-y-4">
                      {contentTypes.map((ct) => {
                        const Icon = getContentTypeIcon(ct.name);
                        const typeContents = contentsByType[ct.id] || [];
                        const typePrice = getContentTypePrice(ct.id);

                        return (
                          <div key={ct.id} className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-colorPurpleBlue/10">
                                  <Icon className="h-6 w-6 text-colorPurpleBlue" />
                                </div>
                                <div>
                                  <h6 className="font-bold text-lg">{ct.name}</h6>
                                  <p className="text-sm text-[#6B7280]">
                                    {typeContents.length} {typeContents.length === 1 ? 'item' : 'items'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-colorPurpleBlue">${typePrice.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Show first 3 items as preview */}
                            {typeContents.length > 0 && (
                              <div className="space-y-2 border-t border-[#E5E7EB] pt-4">
                                {typeContents.slice(0, 3).map((content, idx) => (
                                  <div key={content.id} className="flex items-center gap-3 text-sm">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#6B7280]">
                                      {idx + 1}
                                    </span>
                                    <p className="flex-1 text-colorBlackPearl">{content.title}</p>
                                    {content.duration && (
                                      <span className="text-[#6B7280]">{content.duration} min</span>
                                    )}
                                  </div>
                                ))}
                                {typeContents.length > 3 && (
                                  <p className="pt-2 text-sm text-[#6B7280]">
                                    + {typeContents.length - 3} more {typeContents.length - 3 === 1 ? 'item' : 'items'}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <h5 className="mt-10">Why choose this course?</h5>
                  <ul className="mb-10 mt-6 flex list-inside list-image-[url(/assets/img/icons/icon-purple-check.svg)] flex-col gap-y-4 font-title text-colorBlackPearl">
                    {whyChoose.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* Course Details Content Block */}

                {/* Aside Bar */}
                <aside className="jos">
                  {/* Sidebar List */}
                  <ul className="grid grid-cols-1 gap-y-6">
                    {/* Best Value Bundle - Only show if bundle is enabled */}
                    {subject.isBundleEnabled && bundlePrice > 0 && (
                      <li className="rounded-lg border-2 border-colorPurpleBlue bg-white px-[30px] py-6 shadow-lg">
                        {/* Best Value Badge */}
                        <div className="-mx-[30px] -mt-6 mb-6 bg-gradient-to-r from-colorPurpleBlue to-blue-700 px-4 py-2 text-center">
                          <span className="font-semibold text-sm text-white">⚡ Best Value - Save Money!</span>
                        </div>

                        {/* Bundle Header */}
                        <div className="mb-4 flex items-start gap-3">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-colorPurpleBlue/10 flex items-center justify-center">
                            <svg className="h-6 w-6 text-colorPurpleBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">Complete Bundle</h3>
                            <p className="text-sm text-[#6B7280]">All {contentTypes.length} content types included</p>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4 flex items-baseline gap-3">
                          <span className="text-4xl font-bold text-colorPurpleBlue">${bundlePrice.toFixed(2)}</span>
                          {totalIndividualPrice > bundlePrice && (
                            <>
                              <span className="text-lg text-[#9CA3AF] line-through">${totalIndividualPrice.toFixed(2)}</span>
                              <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                                {discountPercent}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* What's Included */}
                        <div className="mb-6 space-y-2.5 border-t border-[#E5E7EB] pt-4">
                          {contentTypes.map((ct) => (
                            <div key={ct.id} className="flex items-start gap-2.5">
                              <Image
                                src="/assets/img/icons/icon-purple-check.svg"
                                alt="check"
                                width={20}
                                height={20}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">All {ct.name} {getContentBundleDescription(ct.name)}</p>
                                <p className="text-xs text-[#6B7280]">{contentsByType[ct.id]?.length || 0} items</p>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-start gap-2.5">
                            <Image
                              src="/assets/img/icons/icon-purple-check.svg"
                              alt="check"
                              width={20}
                              height={20}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <p className="font-medium text-sm">Lifetime Access</p>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <AddToCartButton
                          subjectId={subject.id}
                          contentTypeId={null}
                          isBundle={true}
                          price={bundlePrice}
                          buttonText="Add Complete Bundle"
                          size="lg"
                          className="w-full"
                        />
                      </li>
                    )}

                    {/* Individual Purchase Options */}
                    <li className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                      <h5 className="mb-6">
                        {subject.isBundleEnabled && bundlePrice > 0
                          ? "Or purchase individually:"
                          : "Purchase Content:"}
                      </h5>
                      <div className="space-y-3">
                        {contentTypes.map((ct) => {
                          const Icon = getContentTypeIcon(ct.name);
                          const typePrice = getContentTypePrice(ct.id);
                          const itemCount = contentsByType[ct.id]?.length || 0;

                          return (
                            <div key={ct.id} className="rounded-lg border border-[#E5E7EB] bg-white p-4 transition-all hover:border-colorPurpleBlue hover:shadow-md">
                              <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-colorPurpleBlue/10">
                                  <Icon className="h-5 w-5 text-colorPurpleBlue" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{ct.name}</p>
                                  <p className="text-xs text-[#6B7280]">{itemCount} items included</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-colorPurpleBlue">${typePrice.toFixed(2)}</p>
                                </div>
                              </div>
                              <AddToCartButton
                                subjectId={subject.id}
                                contentTypeId={ct.id}
                                isBundle={false}
                                price={typePrice}
                                buttonText={`Add ${ct.name}`}
                                variant="outline"
                                className="w-full"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </li>

                    {/* Sidebar Item - Course Information */}
                    <li className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                      <h5 className="mb-7">Course Information:</h5>
                      {/* Course Information List */}
                      <ul className="divide-y divide-[#E9E5DA]">
                        <li className="flex items-center justify-between gap-x-5 py-4 first-of-type:pt-0 last-of-type:pb-0">
                          <span className="font-semibold text-[#4E5450]">
                            Category:
                          </span>
                          <span className="font-normal">
                            {stream?.name || "General"}
                          </span>
                        </li>
                        {examType && (
                          <li className="flex items-center justify-between gap-x-5 py-4 first-of-type:pt-0 last-of-type:pb-0">
                            <span className="font-semibold text-[#4E5450]">
                              Exam Type:
                            </span>
                            <span className="font-normal">
                              {examType.name}
                            </span>
                          </li>
                        )}
                        <li className="flex items-center justify-between gap-x-5 py-4 first-of-type:pt-0 last-of-type:pb-0">
                          <span className="font-semibold text-[#4E5450]">
                            Lessons:
                          </span>
                          <span className="font-normal">
                            {stats.lessonsCount}
                          </span>
                        </li>
                        <li className="flex items-center justify-between gap-x-5 py-4 first-of-type:pt-0 last-of-type:pb-0">
                          <span className="font-semibold text-[#4E5450]">
                            Students Enrolled:
                          </span>
                          <span className="font-normal">
                            {stats.studentsCount}
                          </span>
                        </li>
                        <li className="flex items-center justify-between gap-x-5 py-4 first-of-type:pt-0 last-of-type:pb-0">
                          <span className="font-semibold text-[#4E5450]">
                            Access:
                          </span>
                          <span className="font-normal">
                            Lifetime
                          </span>
                        </li>
                      </ul>
                    </li>

                    {/* Sidebar Item - Contact Us */}
                    <li className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                      <h5 className="mb-7">Contact Us</h5>
                      {/* Contact Info List */}
                      <ul className="flex flex-col gap-y-3">
                        <li className="inline-flex gap-x-6">
                          <div className="h-7 w-auto">
                            <Image
                              src="/assets/img/icons/icon-purple-phone-ring.svg"
                              alt="icon-purple-phone-ring"
                              width={28}
                              height={28}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="block">24/7 Support</span>
                            <a
                              href="tel:+5323213333"
                              className="font-title text-lg text-colorBlackPearl hover:underline md:text-xl"
                            >
                              +91 81232 83217
                            </a>
                          </div>
                        </li>
                        <li className="inline-flex gap-x-6">
                          <div className="h-7 w-auto">
                            <Image
                              src="/assets/img/icons/icon-purple-mail-open.svg"
                              alt="icon-purple-mail-open"
                              width={28}
                              height={28}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="block">Send Message</span>
                            <a
                              href="mailto:yourmail@email.com"
                              className="font-title text-lg text-colorBlackPearl hover:underline md:text-xl"
                            >
                              vidyahej999@gmail.com
                            </a>
                          </div>
                        </li>
                        <li className="inline-flex gap-x-6">
                          <div className="h-7 w-auto">
                            <Image
                              src="/assets/img/icons/icon-purple-location.svg"
                              alt="icon-purple-location"
                              width={28}
                              height={28}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="block">Our Location</span>
                            <address className="font-title text-xl not-italic text-colorBlackPearl">
                              Bangalore, India
                            </address>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </aside>
                {/* Aside Bar */}
              </div>
              {/* Course Details Area */}
            </div>
            {/* Section Container */}
          </div>
          {/* Section Space */}
        </div>
      </section>
    </>
  );
};

export default CourseDetailPage;
