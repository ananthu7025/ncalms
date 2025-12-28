"use client";

import React from "react";
import Image from "next/image";

const WhyChooseUsContent = () => {
  const features = [
    {
      icon: "/assets/img/icons/content-icon-1.svg",
      title: "Face-to-face Teaching",
      description:
        "Experience personalized instruction with our expert tutors through one-on-one sessions.",
    },
    {
      icon: "/assets/img/icons/content-icon-2.svg",
      title: "24/7 Support Available",
      description:
        "Get help whenever you need it with our round-the-clock support team.",
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
                  WHY CHOOSE US
                </span>
                <h2 className="font-title text-4xl font-bold text-colorBlackPearl lg:text-5xl">
                  Transform Your Best Practice with Our Online Course
                </h2>
                <p className="mt-6 text-lg">
                  We provide comprehensive online courses designed to help you
                  excel in your studies. Our expert instructors and proven
                  teaching methods ensure you get the best learning experience.
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
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#DF4343]/10">
                    <Image
                      src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                      alt="students"
                      width={28}
                      height={28}
                    />
                  </div>
                  <div>
                    <span className="block font-title text-2xl font-bold text-[#DF4343]">
                      69K+
                    </span>
                    <span className="text-sm">Satisfied Students</span>
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
