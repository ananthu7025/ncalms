/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  ArrowLeft,
  Lock,
  Download,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSubjectForLearner } from "@/lib/actions/subjects";
import auth from "@/auth";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { DemoVideoButton } from "@/components/DemoVideoButton";
import { VideoPlayerButton } from "@/components/VideoPlayerButton";
import { AddToCartButton } from "@/components/learner/add-to-cart-button";
import { getCartItems } from "@/lib/actions/cart";
import {
  getContentTypeIcon,
  getContentTypeColor,
  isVideoContentType,
  isDocumentContentType,
  getContentBundleDescription
} from "@/lib/content-type-utils";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getSubjectForLearner(id, session.user.id);
  if (!result.success || !result.data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  const { subject, stream, examType, contentTypes, contents, accessMap, hasBundleAccess, stats } = result.data;
  // Check if user has any access
  const hasAnyAccess = accessMap.size > 0;

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

  const whyChoose = [
    "Study at your own pace with flexible online access",
    "High-quality video lectures and detailed study materials",
    "Proven track record of student success and satisfaction",
    "Dedicated support from our team of instructors",
  ];

  // Fetch cart items to check what's already added
  const cartItems = await getCartItems();

  const isItemInCart = (contentTypeId: string | null, isBundle: boolean) => {
    return cartItems.some(item =>
      item.subjectId === subject.id &&
      item.isBundle === isBundle &&
      (isBundle || item.contentTypeId === contentTypeId)
    );
  };

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

  // Calculate total price for each content type by summing individual content prices
  const getContentTypePrice = (contentTypeId: string): number => {
    const typeContents = contentsByType[contentTypeId] || [];
    return typeContents.reduce((sum, content) => {
      return sum + parseFloat(content.price || "0");
    }, 0);
  };

  // Calculate total price of all individual content types
  const totalIndividualPrices = contentTypes.reduce((sum, ct) => {
    return sum + getContentTypePrice(ct.id);
  }, 0);

  // Get the actual bundle price - use database value if set and valid, otherwise use individual prices sum
  const actualBundlePrice = subject.bundlePrice && parseFloat(subject.bundlePrice) > 0
    ? parseFloat(subject.bundlePrice)
    : totalIndividualPrices;

  return (
    <div className="space-y-6 animate-fade-in">
      {hasAnyAccess ? (
        <>
          {/* Header */}
          <Link
            href="/learner/library"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
          </Link>

          {/* Course Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {subject.thumbnail && (
              <img
                src={subject.thumbnail}
                alt={subject.title}
                className="w-full md:w-64 h-40 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <Badge className="bg-success text-success-foreground mb-2">
                {hasBundleAccess ? "Complete Bundle Purchased" : "Partially Purchased"}
              </Badge>

              <h1 className="text-2xl font-bold">{subject.title}</h1>
              {subject.description && (
                <p className="text-muted-foreground mb-4">
                  {subject.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {stream && (
                  <Badge variant="secondary">{stream.name}</Badge>
                )}
                {examType && (
                  <Badge variant="outline">{examType.name}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <Tabs defaultValue={contentTypes.find(ct => accessMap.has(ct.id))?.name.toLowerCase() || "videos"}>
                <TabsList className={`grid grid-cols-${contentTypes.length} max-w-md`}>
                  {contentTypes.map((ct) => {
                    const Icon = getContentTypeIcon(ct.name);
                    return (
                      <TabsTrigger key={ct.id} value={ct.name.toLowerCase()}>
                        <Icon className="w-4 h-4 mr-2" />
                        {ct.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Dynamic Content Tabs */}
                {contentTypes.map((ct) => {
                  const hasAccess = accessMap.has(ct.id);
                  const typeContents = contentsByType[ct.id] || []

                  return (
                    <TabsContent key={ct.id} value={ct.name.toLowerCase()} className="mt-6">
                      {hasAccess ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">{ct.name} Content</h2>
                            <span className="text-sm text-muted-foreground">
                              {typeContents.length} items
                            </span>
                          </div>

                          {typeContents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                              {typeContents.map((content) => (
                                <Card key={content.id} className="hover:shadow-lg transition">
                                  <CardContent className="p-4 flex items-center gap-4">
                                    {(() => {
                                      const Icon = getContentTypeIcon(ct.name);
                                      const colors = getContentTypeColor(ct.name);
                                      return (
                                        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                                        </div>
                                      );
                                    })()}
                                    <div className="flex-1">
                                      <h3 className="font-medium">{content.title}</h3>
                                      {content.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                          {content.description}
                                        </p>
                                      )}
                                      {content.duration && (
                                        <p className="text-sm text-muted-foreground">
                                          {content.duration} min
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isDocumentContentType(ct.name) && content.fileUrl && (
                                        <Button variant="ghost" size="icon" asChild>
                                          <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-4 h-4" />
                                          </a>
                                        </Button>
                                      )}
                                      {isVideoContentType(ct.name) && content.fileUrl && (
                                        <VideoPlayerButton
                                          videoUrl={content.fileUrl}
                                          title={content.title}
                                        />
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <Card className="text-center py-12">
                              <p className="text-muted-foreground">No content available yet for this section.</p>
                            </Card>
                          )}
                        </div>
                      ) : (
                        <Card className="text-center py-12">
                          <Lock className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">{ct.name} Bundle Not Purchased</h3>
                          <p className="text-muted-foreground mb-4">
                            Purchase the {ct.name} bundle to access this content.
                          </p>
                          <AddToCartButton
                            subjectId={subject.id}
                            contentTypeId={ct.id}
                            isBundle={false}
                            price={getContentTypePrice(ct.id)}
                            buttonText={`Add ${ct.name} Bundle - $${getContentTypePrice(ct.id).toFixed(2)}`}
                            variant="default"
                            className="gradient-primary"
                            initialIsAdded={isItemInCart(ct.id, false)}
                          />
                        </Card>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Information Sidebar */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Course Information:</h3>
                  <ul className="divide-y divide-border">
                    <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                      <span className="font-semibold text-muted-foreground">Category:</span>
                      <span className="font-normal">{stream?.name || "General"}</span>
                    </li>
                    {examType && (
                      <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                        <span className="font-semibold text-muted-foreground">Exam Type:</span>
                        <span className="font-normal">{examType.name}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                      <span className="font-semibold text-muted-foreground">Lessons:</span>
                      <span className="font-normal">{stats.lessonsCount}</span>
                    </li>
                    <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                      <span className="font-semibold text-muted-foreground">Students Enrolled:</span>
                      <span className="font-normal">{stats.studentsCount}</span>
                    </li>
                    <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                      <span className="font-semibold text-muted-foreground">Rating:</span>
                      <span className="font-normal inline-flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Image
                            key={i}
                            src={i < stats.rating ? "/assets/img/icons/icon-yellow-star.svg" : "/assets/img/icons/icon-yellow-star-blank.svg"}
                            alt="star"
                            width={16}
                            height={15}
                          />
                        ))}
                        <span className="ml-2">({stats.reviews} reviews)</span>
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-x-5 py-3 first-of-type:pt-0 last-of-type:pb-0">
                      <span className="font-semibold text-muted-foreground">Access:</span>
                      <span className="font-normal">Lifetime</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Us Sidebar */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                  <ul className="flex flex-col gap-y-3">
                    <li className="inline-flex gap-x-4">
                      <div className="h-7 w-auto">
                        <Image
                          src="/assets/img/icons/icon-purple-phone-ring.svg"
                          alt="icon-purple-phone-ring"
                          width={28}
                          height={28}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm text-muted-foreground">24/7 Support</span>
                        <a
                          href="tel:+918123283217"
                          className="font-semibold text-foreground hover:underline"
                        >
                          +91 81232 83217
                        </a>
                      </div>
                    </li>
                    <li className="inline-flex gap-x-4">
                      <div className="h-7 w-auto">
                        <Image
                          src="/assets/img/icons/icon-purple-mail-open.svg"
                          alt="icon-purple-mail-open"
                          width={28}
                          height={28}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm text-muted-foreground">Send Message</span>
                        <a
                          href="mailto:vidyahej999@gmail.com"
                          className="font-semibold text-foreground hover:underline"
                        >
                          vidyahej999@gmail.com
                        </a>
                      </div>
                    </li>
                    <li className="inline-flex gap-x-4">
                      <div className="h-7 w-auto">
                        <Image
                          src="/assets/img/icons/icon-purple-location.svg"
                          alt="icon-purple-location"
                          width={28}
                          height={28}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm text-muted-foreground">Our Location</span>
                        <address className="font-semibold not-italic text-foreground">
                          Bangalore, India
                        </address>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Not Purchased View */}
          <Link
            href="/learner/courses"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>

          {/* Course Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {subject.thumbnail && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={subject.thumbnail} alt={subject.title} className="w-full h-full object-cover" />
                  {subject.demoVideoUrl && (
                    <DemoVideoButton videoUrl={subject.demoVideoUrl} courseTitle={subject.title} />
                  )}
                  <Badge className="absolute top-4 left-4 bg-background/90">
                    Preview
                  </Badge>
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  {stream && <Badge variant="secondary">{stream.name}</Badge>}
                  {examType && <Badge variant="outline">{examType.name}</Badge>}
                </div>
                {subject.description && (
                  <p className="text-muted-foreground">{subject.description}</p>
                )}
              </div>

              {/* Syllabus Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Course Syllabus</h3>
                    {subject.syllabusPdfUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={subject.syllabusPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      </Button>
                    )}
                  </div>

                  {objectives.length === 0 && !subject.additionalCoverage ? (
                    <p className="text-muted-foreground text-center py-6">
                      Course objectives will be available soon.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {objectives.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">What You'll Learn:</h4>
                          <div className="max-h-96 overflow-y-auto pr-2">
                            <ul className="space-y-2">
                              {objectives.slice(0, 10).map((objective, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1 text-sm">{objective}</span>
                                </li>
                              ))}
                            </ul>
                            {objectives.length > 10 && (
                              <p className="text-sm text-muted-foreground mt-3 italic">
                                ... and {objectives.length - 10} more objectives. Download the PDF for complete details.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {subject.additionalCoverage && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-success" />
                            Additionally, We Cover:
                          </h4>
                          <div className="whitespace-pre-line text-sm text-muted-foreground">
                            {subject.additionalCoverage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Why Choose This Course */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Why choose this course?</h3>
                  <ul className="space-y-3">
                    {whyChoose.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
              {subject.isBundleEnabled && subject.bundlePrice && (
                <Card className="border-2 border-primary overflow-hidden">
                  {/* Best Value Badge */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-center">
                    <span className="font-semibold text-sm">⚡ Best Value - Save Money!</span>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {/* Bundle Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">Complete Bundle</h3>
                        <p className="text-sm text-muted-foreground">All {contentTypes.length} content types included</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-blue-600">${actualBundlePrice.toFixed(2)}</span>
                      {(() => {
                        const savings = totalIndividualPrices - actualBundlePrice;
                        const discountPercent = totalIndividualPrices > 0 ? Math.round((savings / totalIndividualPrices) * 100) : 0;

                        return totalIndividualPrices > actualBundlePrice ? (
                          <>
                            <span className="text-lg text-muted-foreground line-through">${totalIndividualPrices.toFixed(2)}</span>
                            <Badge className="bg-green-500 text-white hover:bg-green-600">
                              {discountPercent}% OFF
                            </Badge>
                          </>
                        ) : null;
                      })()}
                    </div>

                    {/* What's Included */}
                    <div className="space-y-2.5 py-3">
                      {contentTypes.map((ct) => (
                        <div key={ct.id} className="flex items-start gap-2.5">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">All {ct.name} {getContentBundleDescription(ct.name)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="font-medium text-sm">Lifetime Access</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <AddToCartButton
                      subjectId={subject.id}
                      contentTypeId={null}
                      isBundle={true}
                      price={actualBundlePrice}
                      buttonText="Add Complete Bundle"
                      size="lg"
                      fullWidth={true}
                      className="gradient-primary text-base font-semibold"
                      initialIsAdded={isItemInCart(null, true)}
                    />

                    {/* Go to Cart Button - Shows when any item is in cart */}
                    {cartItems.some(item => item.subjectId === subject.id) && (
                      <div className="pt-3 border-t">
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="w-full"
                        >
                          <Link href="/learner/cart" className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Go to Cart ({cartItems.filter(item => item.subjectId === subject.id).length} {cartItems.filter(item => item.subjectId === subject.id).length === 1 ? 'item' : 'items'})
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Individual Purchase Options */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {subject.isBundleEnabled && subject.bundlePrice
                      ? "Or purchase individually:"
                      : "Purchase Content:"}
                  </h3>
                  <div className="space-y-3">
                    {contentTypes.map((ct) => {
                      const Icon = getContentTypeIcon(ct.name);
                      const colors = getContentTypeColor(ct.name);
                      return (
                        <div key={ct.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded ${colors.bg} flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 ${colors.icon}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{ct.name}</p>
                              <p className="text-xs text-muted-foreground">${getContentTypePrice(ct.id).toFixed(2)}</p>
                            </div>
                          </div>
                          <AddToCartButton
                            subjectId={subject.id}
                            contentTypeId={ct.id}
                            isBundle={false}
                            price={getContentTypePrice(ct.id)}
                            buttonText="Add"
                            size="sm"
                            variant="outline"
                            className="hover:bg-primary hover:text-white"
                            initialIsAdded={isItemInCart(ct.id, false)}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Go to Cart Button - Shows when any item is in cart */}
                  {cartItems.some(item => item.subjectId === subject.id) && (
                    <div className="pt-3 border-t">
                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="w-full gradient-primary"
                      >
                        <Link href="/learner/cart" className="flex items-center justify-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Go to Cart ({cartItems.filter(item => item.subjectId === subject.id).length} {cartItems.filter(item => item.subjectId === subject.id).length === 1 ? 'item' : 'items'})
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
