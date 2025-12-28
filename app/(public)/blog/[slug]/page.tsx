/* eslint-disable @next/next/no-img-element */
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/actions/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import Breadcrumb from "@/components/public/Breadcrumb";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Blog Not Found",
    };
  }

  const post = result.data;

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;
  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "dd MMMM, yyyy")
    : "Not published";

  // Get recent blog posts for sidebar
  const recentPostsResult = await getPublishedBlogPosts(3);
  const recentPosts = recentPostsResult.data || [];

  return (
    <div className="relative">
      {/* Breadcrumb Section */}
      <Breadcrumb
        title="Blog"
        items={[
          { label: "HOME", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Post Title" },
        ]}
      />
      {/* Blog Content Section */}
      <section className="section-course">
        <div className="bg-white pb-44">
          <div className="section-space">
            <div className="container">
              <div className="grid grid-cols-1 gap-x-[30px] gap-y-10 lg:grid-cols-[1fr_minmax(0,360px)]">
                {/* Main Blog Content */}
                <div className="jos">
                  <div>
                    {/* Hero Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        width="783"
                        height="439"
                        className="max-w-full rounded-lg"
                      />
                    )}

                    {/* Blog Metadata */}
                    <div className="mt-7 flex gap-9">
                      <div className="inline-flex items-center gap-1.5 text-sm">
                        <img
                          src="/assets/img/icons/icon-grey-calendar.svg"
                          alt="icon-grey-calendar"
                          width="23"
                          height="23"
                        />
                        <span className="flex-1">{publishedDate}</span>
                      </div>
                      {post.author && (
                        <div className="inline-flex items-center gap-1.5 text-sm">
                          <img
                            src="/assets/img/icons/icon-grey-user-3-line.svg"
                            alt="icon-grey-user"
                            width="23"
                            height="23"
                          />
                          <span className="flex-1">{post.author.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Blog Title */}
                    <h2 className="mt-6 mb-6 font-title text-3xl font-bold text-colorBlackPearl">
                      {post.title}
                    </h2>

                    {/* Blog Content */}
                    <div
                      className="rich-text-area"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="jos">
                  <ul className="grid grid-cols-1 gap-y-9">
                    {/* Popular News */}
                    {recentPosts.length > 0 && (
                      <li className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                        <h5 className="mb-7">Recent Posts</h5>
                        <ul className="grid grid-cols-1 gap-y-4">
                          {recentPosts.map((recentPost) => {
                            const recentDate = recentPost.publishedAt
                              ? format(
                                  new Date(recentPost.publishedAt),
                                  "dd MMMM, yyyy"
                                )
                              : "";

                            return (
                              <li
                                key={recentPost.id}
                                className="group flex items-center gap-x-4"
                              >
                                {recentPost.image && (
                                  <Link
                                    href={`/blog/${recentPost.slug}`}
                                    className="h-auto w-20 overflow-hidden rounded-[4px]"
                                  >
                                    <img
                                      src={recentPost.image}
                                      alt={recentPost.title}
                                      width="81"
                                      height="77"
                                      className="max-w-full transition-all duration-300 group-hover:scale-105"
                                    />
                                  </Link>
                                )}
                                <div className="flex-1">
                                  <Link
                                    href={`/blog/${recentPost.slug}`}
                                    className="mb-2 block font-medium text-colorBlackPearl hover:text-colorPurpleBlue line-clamp-2"
                                  >
                                    {recentPost.title}
                                  </Link>
                                  {recentDate && (
                                    <span className="text-sm text-colorPurpleBlue">
                                      {recentDate}
                                    </span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    )}

                    {/* Back to Blog */}
                    <li className="rounded-lg bg-[#f5f5f5] px-[30px] py-6">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-x-2 font-title text-lg font-bold text-colorBlackPearl hover:text-colorPurpleBlue"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Back to Home
                      </Link>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="absolute -left-80 top-1/2 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#BFC06F] blur-[230px]"></div>
      <div className="absolute -right-40 -top-20 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#6FC081] blur-[230px]"></div>
    </div>
  );
}
