/* eslint-disable @next/next/no-img-element */

import Categories from "@/components/public/Catogories";
import WelcomeSection from "@/components/public/Welcome";
import HeroSection from "@/components/public/HeroSection";
import WhyChooseUs from "@/components/public/WhyChooseSection";
import FeaturedCourse from "@/components/public/FeaturedCourse";
import TestimonialSection from "@/components/public/Testimonial";
import FeaturesSection from "@/components/public/FeaturesSection";
import PrivateTutoring from "@/components/public/PrivateTutoring";
import BlogSection from "@/components/public/BlogSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <Categories />
      <FeaturesSection />
      <FeaturedCourse />
      <WhyChooseUs />
      <PrivateTutoring />
      <div className="section-client-logo">
        <div className="bg-white">
          <div className="z-10 -mt-44">
            <div className="container">
              <div className="rounded-lg bg-colorPurpleBlue p-5">
                <div className="grid grid-cols-1 items-center gap-x-28 gap-y-10 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-lg" data-aos="fade-right">
                    <img
                      src="/assets/img/images/th-1/funfact-image.png"
                      alt="funfact-image"
                      width="553"
                      height="315"
                      className="mx-auto max-w-full"
                    />
                  </div>
                  <div data-aos="fade-left">
                    <ul className="grid grid-cols-1 gap-x-[120px] gap-y-6 text-center sm:grid-cols-2 lg:gap-y-16 lg:text-left">
                      {[
                        { number: "5923", label: "Student enrolled" },
                        { number: "8497", label: "Classes completed" },
                        { number: "7554", label: "Learners report" },
                        { number: "2755", label: "Top instructors" },
                      ].map((stat, idx) => (
                        <li key={idx}>
                          <div className="mb-2 font-title text-4xl font-bold text-white">
                            {stat.number}+
                          </div>
                          <span className="text-white/80">{stat.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TestimonialSection />
      <BlogSection />
    </>
  );
}
