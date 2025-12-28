/* eslint-disable @next/next/no-img-element */

import FAQ from "@/components/public/FAQ";
import Categories from "@/components/public/Catogories";
import Breadcrumb from "@/components/public/Breadcrumb";
import VideoSection from "@/components/public/VideoSection";
import WhyChooseUs from "@/components/public/WhyChooseSection";
import TestimonialSection from "@/components/public/Testimonial";
import WhyChooseUsContent from "@/components/public/WhyChooseUsContent";

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        title="About Us"
        items={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <WhyChooseUsContent />
      <Categories />
      <VideoSection />
      <WhyChooseUs/>
      <TestimonialSection />
      <FAQ />
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
                {[
                  {
                    img: "blog-img-1.jpg",
                    category: "Education",
                    date: "09 May, 2024",
                    comments: "32",
                    title:
                      "Solutions Your All Problem With Online Courses For Your Thinking",
                  },
                  {
                    img: "blog-img-2.jpg",
                    category: "Business",
                    date: "09 January, 2024",
                    comments: "98",
                    title:
                      "Exploring Learning Landscapes in All Academic Calendar For Season",
                  },
                  {
                    img: "blog-img-3.jpg",
                    category: "Marketing",
                    date: "03 June, 2024",
                    comments: "04",
                    title:
                      "Voices from the Learning Education Hub For Your Children",
                  },
                ].map((blog, idx) => (
                  <li key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                    <div className="group overflow-hidden rounded-lg transition-all duration-300">
                      <div className="relative block overflow-hidden rounded-[10px]">
                        <img
                          src={`/assets/img/images/th-1/${blog.img}`}
                          alt={blog.img}
                          width="370"
                          height="334"
                          className="h-auto w-full transition-all duration-300 group-hover:scale-105"
                        />
                        <a
                          className="absolute bottom-4 left-4 inline-block rounded-[40px] bg-colorPurpleBlue px-3.5 py-3 text-sm leading-none text-white hover:bg-colorBlackPearl"
                          href="#"
                        >
                          {blog.category}
                        </a>
                      </div>
                      <div className="mt-7">
                        <div className="flex gap-9">
                          <a
                            className="inline-flex items-center gap-1.5 text-sm hover:underline"
                            href="#"
                          >
                            <img
                              src="/assets/img/icons/icon-grey-calendar.svg"
                              alt="icon-grey-calendar"
                              width="23"
                              height="23"
                            />
                            <span className="flex-1">{blog.date}</span>
                          </a>
                          <div className="inline-flex items-center gap-1.5 text-sm">
                            <img
                              src="/assets/img/icons/icon-grey-chat.svg"
                              alt="icon-grey-chat"
                              width="23"
                              height="23"
                            />
                            <span className="flex-1">
                              {blog.comments} Comments
                            </span>
                          </div>
                        </div>
                        <a
                          className="my-6 block font-title text-xl font-bold text-colorBlackPearl hover:text-colorPurpleBlue"
                          href="#"
                        >
                          {blog.title}
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="absolute -left-80 top-1/2 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#BFC06F] blur-[230px]"></div>
          <div className="absolute -right-40 -top-20 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#6FC081] blur-[230px]"></div>
        </div>
      </section>
    </>
  );
}