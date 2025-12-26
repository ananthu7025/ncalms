/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { CheckCircle, ArrowLeft, Clock, Users, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import { getSubjectById } from "@/lib/actions/subjects";
import { EmptyState } from "@/components/EmptyState";
import { DemoVideoButton } from "@/components/DemoVideoButton";
import { AddToCartButton } from "@/components/learner/add-to-cart-button";
import { getCartItems } from "@/lib/actions/cart";
import {
  getContentTypeIcon,
  getContentTypeColor,
  getContentBundleDescription
} from "@/lib/content-type-utils";
import { getActiveSubjectContents } from "@/lib/actions/subject-contents";
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import auth from "@/auth";

export default async function PublicCourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [subjectResult, contentsResult] = await Promise.all([
    getSubjectById(id),
    getActiveSubjectContents(id),
  ]);

  if (!subjectResult.success || !subjectResult.data) {
    return (
      <>
        <Header />
        <div className="container py-5 min-vh-100">
          <div className="my-5">
            <EmptyState
              title="Course not found"
              description="The course you're looking for doesn't exist or has been removed."
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { subject, stream, examType } = subjectResult.data;
  const contents = contentsResult.success && contentsResult.data ? contentsResult.data : [];

  // Group contents by content type to get all content types
  const contentTypesMap = new Map();
  contents.forEach((item: any) => {
    if (item.contentType) {
      contentTypesMap.set(item.contentType.id, item.contentType);
    }
  });
  const contentTypes = Array.from(contentTypesMap.values());

  // Fetch cart items to check what's already added (only for logged-in users)
  const session = await auth();
  const cartItems = session?.user?.id ? await getCartItems() : [];

  const isItemInCart = (contentTypeId: string | null, isBundle: boolean) => {
    return cartItems.some(item =>
      item.subjectId === subject.id &&
      item.isBundle === isBundle &&
      (isBundle || item.contentTypeId === contentTypeId)
    );
  };

  // Group contents by content type
  const contentsByType = contents.reduce((acc: any, item: any) => {
    const typeId = item.contentType?.id;
    if (typeId) {
      if (!acc[typeId]) {
        acc[typeId] = [];
      }
      acc[typeId].push(item.content);
    }
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate total price for each content type by summing individual content prices
  const getContentTypePrice = (contentTypeId: string): number => {
    const typeContents = contentsByType[contentTypeId] || [];
    return typeContents.reduce((sum: number, content: any) => {
      return sum + parseFloat(content.price || "0");
    }, 0);
  };

  return (
    <>
      <Header />
      <section className="course-details-section bg-light py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <Link
              href="/courses"
              className="d-inline-flex align-items-center text-decoration-none text-primary fw-medium"
            >
              <ArrowLeft className="me-2 icon-16" />
              <span className="hover-text-dark">Back to All Courses</span>
            </Link>
          </nav>

          {/* Main Content */}
          <div className="row g-4">
            {/* Left Column - Course Details */}
            <div className="col-12 col-lg-8">
              {/* Course Image */}
              {subject.thumbnail && (
                <div className="card border-0 shadow-lg mb-4 overflow-hidden course-hero-card">
                  <div className="position-relative">
                    <div className="ratio ratio-16x9">
                      <img
                        src={subject.thumbnail}
                        alt={subject.title}
                        className="object-fit-cover"
                      />
                    </div>
                    {subject.demoVideoUrl && (
                      <DemoVideoButton videoUrl={subject.demoVideoUrl} courseTitle={subject.title} />
                    )}
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge bg-white text-dark px-3 py-2 shadow-sm">
                        <BookOpen className="icon-16 me-1" />
                        Preview Available
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Title & Meta */}
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {stream && (
                    <span className="badge bg-primary-subtle text-primary px-3 py-2 fs-6">
                      {stream.name}
                    </span>
                  )}
                  {examType && (
                    <span className="badge bg-info-subtle text-info px-3 py-2 fs-6">
                      {examType.name}
                    </span>
                  )}
                </div>

                <h1 className="display-4 fw-bold mb-3 text-dark">{subject.title}</h1>

                {subject.description && (
                  <p className="lead text-muted mb-4">{subject.description}</p>
                )}

                {/* Course Stats */}
                <div className="d-flex flex-wrap gap-4 mb-4">
                  <div className="d-flex align-items-center text-muted">
                    <BookOpen className="icon-20 me-2 text-primary" />
                    <span className="fw-medium">{contents.length} Learning Items</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <Award className="icon-20 me-2 text-success" />
                    <span className="fw-medium">Professional Certification</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <Clock className="icon-20 me-2 text-warning" />
                    <span className="fw-medium">Lifetime Access</span>
                  </div>
                </div>
              </div>

              {/* What You'll Learn Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4 p-lg-5">
                  <h3 className="h4 fw-bold mb-4 text-dark">
                    <Award className="icon-24 me-2 text-primary" />
                    What You'll Learn
                  </h3>
                  <div className="row g-3">
                    {contentTypes.map((ct: any) => (
                      <div key={ct.id} className="col-12 col-md-6">
                        <div className="d-flex align-items-start">
                          <CheckCircle className="text-success flex-shrink-0 icon-20 me-3 mt-1" />
                          <div>
                            <h6 className="fw-bold mb-1">{ct.name} Content</h6>
                            {ct.description && (
                              <p className="text-muted small mb-0">{ct.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Features */}
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <h3 className="h4 fw-bold mb-4 text-dark">Course Features</h3>
                  <div className="row g-4">
                    <div className="col-6 col-md-3 text-center">
                      <div className="p-3 bg-primary-subtle rounded-3 mb-2 d-inline-block">
                        <BookOpen className="icon-32 text-primary" />
                      </div>
                      <p className="fw-medium mb-0 small">Rich Content</p>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="p-3 bg-success-subtle rounded-3 mb-2 d-inline-block">
                        <Users className="icon-32 text-success" />
                      </div>
                      <p className="fw-medium mb-0 small">Expert Support</p>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="p-3 bg-warning-subtle rounded-3 mb-2 d-inline-block">
                        <Clock className="icon-32 text-warning" />
                      </div>
                      <p className="fw-medium mb-0 small">Lifetime Access</p>
                    </div>
                    <div className="col-6 col-md-3 text-center">
                      <div className="p-3 bg-info-subtle rounded-3 mb-2 d-inline-block">
                        <Award className="icon-32 text-info" />
                      </div>
                      <p className="fw-medium mb-0 small">Certification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div className="col-12 col-lg-4">
              <div className="sticky-top-custom">
                {/* Bundle Card */}
                {subject.isBundleEnabled && subject.bundlePrice && (
                  <div className="card border-0 shadow-lg mb-4 overflow-hidden bundle-card">
                    {/* Best Value Ribbon */}
                    <div className="bg-gradient-primary text-white text-center py-3">
                      <h6 className="mb-0 fw-bold">
                        <Award className="icon-16 me-2" />
                        ⚡ BEST VALUE - COMPLETE BUNDLE
                      </h6>
                    </div>

                    <div className="card-body p-4">
                      {/* Price */}
                      <div className="text-center mb-4 pb-4 border-bottom">
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                          <span className="display-3 fw-bold text-primary">${subject.bundlePrice}</span>
                          {(() => {
                            const totalIndividual = contentTypes.reduce((sum: number, ct: any) => sum + getContentTypePrice(ct.id), 0);
                            const bundlePrice = parseFloat(subject.bundlePrice);
                            const savings = totalIndividual - bundlePrice;
                            const discountPercent = totalIndividual > 0 ? Math.round((savings / totalIndividual) * 100) : 0;

                            return totalIndividual > bundlePrice ? (
                              <div className="text-start">
                                <div className="text-muted text-decoration-line-through fs-4">${totalIndividual.toFixed(2)}</div>
                                <span className="badge bg-success fs-6">{discountPercent}% OFF</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                        <p className="text-muted mb-0">One-time payment • Lifetime access</p>
                      </div>

                      {/* What's Included */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">This bundle includes:</h6>
                        <div className="list-group list-group-flush">
                          {contentTypes.map((ct: any) => (
                            <div key={ct.id} className="list-group-item px-0 border-0 py-2">
                              <CheckCircle className="text-success icon-16 me-2" />
                              <span className="fw-medium small">All {ct.name} {getContentBundleDescription(ct.name)}</span>
                            </div>
                          ))}
                          <div className="list-group-item px-0 border-0 py-2">
                            <CheckCircle className="text-success icon-16 me-2" />
                            <span className="fw-medium small">Lifetime Access</span>
                          </div>
                          <div className="list-group-item px-0 border-0 py-2">
                            <CheckCircle className="text-success icon-16 me-2" />
                            <span className="fw-medium small">Expert Support</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <AddToCartButton
                        subjectId={subject.id}
                        contentTypeId={null}
                        isBundle={true}
                        price={parseFloat(subject.bundlePrice || "0")}
                        buttonText="Add Complete Bundle to Cart"
                        size="lg"
                        fullWidth={true}
                        className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow-sm"
                        initialIsAdded={isItemInCart(null, true)}
                      />

                      <p className="text-center text-muted small mb-0 mt-3">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                )}

                {/* Individual Items Card */}
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                      {subject.isBundleEnabled && subject.bundlePrice
                        ? "Or buy individually:"
                        : "Available Content:"}
                    </h5>

                    <div className="d-flex flex-column gap-3">
                      {contentTypes.map((ct: any) => {
                        const Icon = getContentTypeIcon(ct.name);
                        const colors = getContentTypeColor(ct.name);
                        return (
                          <div key={ct.id} className="p-3 border rounded-3 hover-shadow-sm transition-all">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${colors.bg} icon-32`}>
                                  <Icon className={`${colors.icon} icon-16`} />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 small">{ct.name}</h6>
                                  <p className="text-primary fw-bold mb-0 fs-6">${getContentTypePrice(ct.id).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                            <AddToCartButton
                              subjectId={subject.id}
                              contentTypeId={ct.id}
                              isBundle={false}
                              price={getContentTypePrice(ct.id)}
                              buttonText="Add to Cart"
                              size="sm"
                              variant="outline"
                              className="btn btn-outline-primary btn-sm w-100 fw-medium"
                              initialIsAdded={isItemInCart(ct.id, false)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
