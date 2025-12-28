/* eslint-disable @next/next/no-img-element */
import { getPublishedBlogPosts } from "@/lib/actions/blog";
import Link from "next/link";
import { format } from "date-fns";

export default async function BlogSection() {
  const result = await getPublishedBlogPosts(3);
  const blogPosts = result.data || [];

  // If no blog posts, return null or a placeholder
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="section-blog">
      <div className="relative z-10 overflow-hidden bg-white pb-44">
        <div className="section-space">
          <div className="container">
            <div className="mb-10 lg:mb-[60px]">
              <div className="mx-auto max-w-md text-center" data-aos="fade-up">
                <span className="mb-5 block uppercase">OUR NEWS</span>
                <h2>Our New Articles</h2>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3">
              {blogPosts.map((post, idx) => {
                const publishedDate = post.publishedAt
                  ? format(new Date(post.publishedAt), "dd MMMM, yyyy")
                  : "Not published";

                return (
                  <li key={post.id} data-aos="fade-up" data-aos-delay={idx * 100}>
                    <div className="group overflow-hidden rounded-lg transition-all duration-300">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block overflow-hidden rounded-[10px]"
                      >
                        <img
                          src={
                            post.image ||
                            "/assets/img/images/th-1/blog-img-1.jpg"
                          }
                          alt={post.title}
                          width="370"
                          height="334"
                          className="h-auto w-full transition-all duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <div className="mt-7">
                        <div className="flex gap-9">
                          <div className="inline-flex items-center gap-1.5 text-sm">
                            <img
                              src="/assets/img/icons/icon-grey-calendar.svg"
                              alt="icon-grey-calendar"
                              width="23"
                              height="23"
                            />
                            <span className="flex-1">{publishedDate}</span>
                          </div>
                        
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="my-6 block font-title text-xl font-bold text-colorBlackPearl hover:text-colorPurpleBlue"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="absolute -left-80 top-1/2 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#BFC06F] blur-[230px]"></div>
        <div className="absolute -right-40 -top-20 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#6FC081] blur-[230px]"></div>
      </div>
    </section>
  );
}
