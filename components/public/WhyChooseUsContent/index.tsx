"use client";

import React from "react";
import Image from "next/image";

const WhyChooseUsContent = () => {
  const features = [
    {
      icon: "/assets/img/icons/content-icon-1.svg",
      title: "18 Subjects Offered",
      description:
        "Comprehensive coverage of all core and optional NCA subjects.",
    },
    {
      icon: "/assets/img/icons/content-icon-2.svg",
      title: "Personalized Mentorship",
      description:
        "Expert guidance to help you succeed on your first attempt.",
    },
  ];

  return (
    <section className="section-content">
      <div className="section-space">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-32">
            {/* Left Column - Text Content */}
            <div data-aos="fade-right">
              <div className="mb-10">
                <span className="mb-5 block uppercase text-colorPurpleBlue">
                  ABOUT US
                </span>
                <h2 className="font-title text-4xl font-bold text-colorBlackPearl lg:text-5xl">
                  NCA MADE EASY
                </h2>
                <p className="mt-6 text-lg">
                  NCA MADE EASY is a specialised, exam-focused platform built exclusively for internationally trained lawyers navigating NCA and Ontario Licensing Candidates preparing for BAR exams in Canada.
                </p>
                <p className="mt-4 text-lg">
                  We provide comprehensive study resources, expert guidance, and personalized mentorship to help you succeed on your first attempt.
                </p>
              </div>

              <ul className="flex flex-col gap-6">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4" data-aos="fade-up" data-aos-delay={idx * 100}>
                    <div className="inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[50%] bg-colorPurpleBlue/10">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-title text-xl font-bold text-colorBlackPearl">
                        {feature.title}
                      </h3>
                      <p className="text-base">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Images */}
            <div className="relative" data-aos="fade-left">
              <div className="relative">
                <Image
                  src="/assets/img/images/th-3/content-img-1.jpg"
                  alt="content"
                  width={456}
                  height={465}
                  className="w-full rounded-lg"
                />
                <div className="relative -mt-20 ml-auto max-w-[355px]">
                  <Image
                    src="/assets/img/images/th-3/content-img-2.jpg"
                    alt="content"
                    width={355}
                    height={263}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Stat Card */}
                <div className="absolute -bottom-8 left-8 inline-flex items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#4c6ae6]/10">
                    <Image
                      src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                      alt="students"
                      width={28}
                      height={28}
                    />
                  </div>
                  <div>
                    <span className="block font-title text-2xl font-bold text-colorPurpleBlue">
                      1000+
                    </span>
                    <span className="text-sm">Students Trained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsContent;
