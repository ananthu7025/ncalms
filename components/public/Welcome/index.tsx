"use client";

import React from "react";
import Image from "next/image";

const WelcomeSection = () => {
  return (
    <div>
      {/* Welcome Section */}
      <section className="section-welcome">
        <div className="relative z-10">
          <div className="section-space-top">
            <div className="container">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-32">
                
                {/* Image Block */}
                <div
                  className="relative order-2 mx-auto lg:order-1"
                  data-aos="fade-right"
                >
                  <Image
                    src="/assets/img/images/th-1/welcome-img.png"
                    alt="welcome"
                    width={482}
                    height={486}
                    className="max-w-full"
                  />

                  <div className="absolute bottom-24 left-16 z-10 inline-flex items-center gap-5 rounded-lg bg-white py-4 pl-4 pr-8 shadow-[17px_18px_30px_16px] shadow-[#070229]/10 xxl:-left-16 xxxl:-left-28" data-aos="zoom-in" data-aos-delay="200">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#DF4343]/5">
                      <Image
                        src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                        alt="graduation"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div>
                      <span className="block font-title text-[28px] font-bold leading-[1.73] text-[#DF4343]">
                        100%
                      </span>
                      <span>First Attempt Focus</span>
                    </div>
                  </div>

                  <Image
                    src="/assets/img/abstracts/abstract-dots-2.svg"
                    alt="abstract"
                    width={80}
                    height={80}
                    className="absolute -left-10 top-1/2 z-20 -translate-y-1/2 rotate-90"
                  />

                  <Image
                    src="/assets/img/abstracts/abstract-golden-yellow-bg-black-dash-1.svg"
                    alt="abstract"
                    width={83}
                    height={74}
                    className="absolute bottom-5 right-0 z-20"
                  />
                </div>

                {/* Content Block */}
                <div
                  className="order-1 lg:order-2"
                  data-aos="fade-left"
                >
                  <div className="mb-6" data-aos="fade-up">
                    <span className="mb-5 block uppercase">
                      Welcome to NCA
                    </span>
                    <h2>Online Learning Centre</h2>
                  </div>

                  <div data-aos="fade-up" data-aos-delay="100">
                    <p>
                      <strong>NCA MADE EASY</strong> is a specialised, exam-focused platform built exclusively for
                      internationally trained lawyers navigating NCA and Ontario Licensing Candidates
                      preparing for BAR exams in Canada.
                    </p>

                    <ul className="mt-6 flex flex-col gap-y-4 font-title text-colorBlackPearl" data-aos="fade-up" data-aos-delay="200">
                      <li className="flex items-center gap-2">
                        <Image src="/assets/img/icons/icon-purple-check.svg" alt="check" width={20} height={20} />
                        98% pass rate for NCA exams
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/assets/img/icons/icon-purple-check.svg" alt="check" width={20} height={20} />
                        Expert instructors with proven track records
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/assets/img/icons/icon-purple-check.svg" alt="check" width={20} height={20} />
                        Exam-focused methodology
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/assets/img/icons/icon-purple-check.svg" alt="check" width={20} height={20} />
                        Comprehensive study materials
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Background Elements */}
          <Image
            src="/assets/img/abstracts/abstract-element-regular.svg"
            alt="abstract"
            width={133}
            height={154}
            className="absolute bottom-0 right-20 -z-10"
          />
          <div className="absolute -bottom-20 left-0 -z-10 h-[383px] w-[531px] -translate-x-1/2 rounded-[50%] bg-colorBrightGold/[23%] blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default WelcomeSection;
