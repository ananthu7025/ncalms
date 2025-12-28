"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const testimonials = [
  {
    text: `The interactive workshops and tailored feedback helped me pass the core subjects. Vidya's guidance made a huge difference in my confidence and performance. Highly recommend!`,
    name: "Rajat",
    country: "Canada",
    avatar: "R",
  },
  {
    text: `I highly recommend NCA MADE EASY to anyone preparing for the NCA exams. The study materials and workshops were thorough and insightful. Vidya's expertise truly shines.`,
    name: "Gagan",
    country: "Canada",
    avatar: "G",
  },
  {
    text: `The resources provided by NCA MADE EASY are top-notch. From recorded lectures to detailed notes, everything was incredibly helpful.`,
    name: "Emily",
    country: "UK",
    avatar: "E",
  },
  {
    text: `Vidya's mentorship was a game-changer for me. The comprehensive coverage of the syllabus and one-on-one coaching sessions gave me the edge I needed.`,
    name: "Pragati",
    country: "India",
    avatar: "P",
  },
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section className="section-testimonial">
      <div className="section-space">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-32">

            {/* Testimonial */}
            <div data-aos="fade-left">
              <div className="mb-10 lg:mb-[60px]">
                <span className="mb-5 block uppercase">OUR TESTIMONIAL</span>
                <h2>What Students Say About NCA MADE EASY</h2>
              </div>

              <div className="rounded-lg bg-white p-8 transition-all duration-500">
                <div className="mb-5 inline-flex items-center gap-x-1">
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

                <blockquote className="text-lg">
                  “{active.text}”
                </blockquote>

                <div className="mt-8 flex items-center gap-x-4">
                  <div className="flex h-[43px] w-[43px] items-center justify-center rounded-[50%] bg-colorPurpleBlue text-white font-bold">
                    {active.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="block font-title text-xl font-bold text-colorBlackPearl">
                      {active.name}
                    </span>
                    <span className="block text-sm">{active.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative mx-auto" data-aos="fade-right">
              <Image
                src="/assets/img/images/th-1/testimonial-img.png"
                alt="testimonial"
                width={437}
                height={520}
                className="max-w-full"
              />

              <div className="absolute bottom-12 left-16 z-10 inline-flex items-center gap-5 rounded-lg bg-white py-2 pl-4 pr-8 shadow-[17px_18px_30px_16px] shadow-[#070229]/10 xxl:-left-16 xxxl:-left-28" data-aos="zoom-in" data-aos-delay="200">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#DF4343]/5">
                  <Image
                    src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                    alt="rating"
                    width={28}
                    height={28}
                  />
                </div>
                <div>
                  <span className="block font-title text-[28px] font-bold leading-[1.73] text-[#DF4343]">
                    5★
                  </span>
                  <span>Rated by Students</span>
                </div>
              </div>

              <Image
                src="/assets/img/abstracts/abstract-dots-3.svg"
                alt="abstract"
                width={80}
                height={60}
                className="absolute -right-10 top-1/2 z-20 -translate-y-1/2 animate-pulse"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
