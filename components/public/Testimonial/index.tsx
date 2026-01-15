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
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index !== activeIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Auto rotate every 5s with progress indicator
  useEffect(() => {
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 2; // 100 / 50 = 2% every 100ms for 5s total
      if (currentProgress <= 100) {
        setProgress(currentProgress);
      }
    }, 100);

    const rotateInterval = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(rotateInterval);
      setProgress(0);
    };
  }, [activeIndex]);

  const active = testimonials[activeIndex];

  return (
    <section className="section-testimonial">
      <div className="section-space">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-32">

            {/* Testimonial */}
            <div data-aos="fade-left">
              <div className="mb-10 lg:mb-[60px]">
                <span className="mb-3 block uppercase text-colorPurpleBlue font-semibold tracking-wider">OUR TESTIMONIAL</span>
                <h2 className="font-title text-3xl font-bold text-colorBlackPearl lg:text-5xl mb-3">What Students Say About NCA MADE EASY</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4 text-colorPurpleBlue animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="3"/>
                    </svg>
                    <span className="text-sm font-medium">Live Carousel Animation</span>
                  </span>
                  <span className="text-sm text-gray-400">• Auto-rotating testimonials</span>
                </p>
              </div>

              <div className={`relative rounded-lg bg-white p-8 shadow-lg transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                {/* LIVE Badge */}
                <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide">Live</span>
                </div>

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

              {/* Auto-rotation Progress Bar */}
              <div className="mt-6 relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-colorPurpleBlue to-colorLightSeaGreen transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Carousel Controls */}
              <div className="mt-6 flex items-center justify-between">
                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-colorPurpleBlue/30 bg-white transition-all duration-300 hover:border-colorPurpleBlue hover:bg-colorPurpleBlue"
                    aria-label="Previous testimonial"
                  >
                    <svg
                      className="h-5 w-5 text-colorPurpleBlue transition-colors group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-colorPurpleBlue/30 bg-white transition-all duration-300 hover:border-colorPurpleBlue hover:bg-colorPurpleBlue"
                    aria-label="Next testimonial"
                  >
                    <svg
                      className="h-5 w-5 text-colorPurpleBlue transition-colors group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Counter */}
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      {activeIndex + 1} / {testimonials.length}
                    </span>
                    {activeIndex < testimonials.length - 1 ? (
                      <span className="text-xs text-colorPurpleBlue font-medium animate-pulse">
                        {testimonials.length - activeIndex - 1} more {testimonials.length - activeIndex - 1 === 1 ? 'testimonial' : 'testimonials'}
                      </span>
                    ) : (
                      <span className="text-xs text-colorLightSeaGreen font-medium">
                        Restarting...
                      </span>
                    )}
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === activeIndex
                          ? 'w-8 h-2 bg-colorPurpleBlue'
                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
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
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#4c6ae6]/5">
                  <Image
                    src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                    alt="rating"
                    width={28}
                    height={28}
                  />
                </div>
                <div>
                  <span className="block font-title text-[28px] font-bold leading-[1.73] text-colorPurpleBlue">
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
