"use client";

import React from "react";
import Image from "next/image";

const AboutInstructors = () => {
  return (
    <section className="section-about-instructors bg-gradient-to-b from-white to-gray-50">
      <div className="section-space">
        <div className="container">
          {/* Section Header */}
          <div className="mb-12 text-center" data-aos="fade-up">
            <span className="mb-5 block uppercase tracking-wider text-colorPurpleBlue">
              Meet Our Team
            </span>
            <h2 className="font-title text-3xl font-bold text-colorBlackPearl lg:text-5xl">
              Expert Instructors with Proven Results
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

            {/* Ms. Vidya Puthran - NCA Program */}
            <div
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-10"
              data-aos="fade-right"
            >
              <div>
                <div className="mb-8 flex items-center gap-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ring-4 ring-colorPurpleBlue/10">
                    <Image
                      src="/assets/img/team/vidya-puthran.jpg"
                      alt="Ms. Vidya Puthran"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-title text-2xl font-bold text-colorBlackPearl">
                      Ms. Vidya Puthran
                    </h3>
                    <p className="font-semibold text-colorPurpleBlue">Founder & Lead Instructor</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-600">
                  <p className="leading-relaxed">
                    Our NCA Exam Preparation Program is led by <strong>Ms. Vidya Puthran</strong>, an NCA-qualified
                    lawyer and legal educator with extensive experience teaching internationally trained
                    lawyers on how to succeed in NCA exams.
                  </p>
                  <p className="leading-relaxed">
                    She has <strong>9 years of teaching experience</strong>,
                    focused on NCA tutoring by building NCA MADE EASY platform. She has taught all
                    core and optional NCA subjects that we offer, guiding candidates through real exam
                    methodology, Canadian case-law application, and structured answer-writing.
                  </p>
                  <p className="leading-relaxed">
                    Under her instruction, students have achieved a <strong className="text-emerald-600">98% pass rate</strong>,
                    reflecting a disciplined, exam-focused approach built on how the NCA actually assesses
                    legal reasoning and written performance.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center divide-x divide-gray-200 rounded-xl bg-gray-50 py-4">
                <div className="flex-1 px-4 text-center">
                  <div className="font-title text-3xl font-bold text-colorPurpleBlue">98%</div>
                  <div className="text-sm font-medium text-gray-500">Pass Rate</div>
                </div>
                <div className="flex-1 px-4 text-center">
                  <div className="font-title text-3xl font-bold text-colorPurpleBlue">9+</div>
                  <div className="text-sm font-medium text-gray-500">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Ontario Bar Instructors */}
            <div
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-10"
              data-aos="fade-left"
            >
              <div>
                <div className="mb-8 flex items-center gap-6">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-red-100/50">
                    <Image
                      src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                      alt="ontario bar"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="font-title text-2xl font-bold text-colorBlackPearl">
                      Ontario Bar Team
                    </h3>
                    <p className="font-semibold text-[#DF4343]">Licensing Exam Experts</p>
                  </div>
                </div>

                <div className="space-y-6 text-gray-600">
                  <p className="leading-relaxed">
                    Our Ontario Bar Exam Preparation Program is delivered by experienced, exam-qualified
                    instructors who understand exactly how the Law Society of Ontario tests candidates.
                  </p>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                    <h4 className="mb-2 font-bold text-colorBlackPearl">Solicitor Examination</h4>
                    <p className="text-sm leading-relaxed">
                      The Solicitors Exam subjects are taught by <strong>Aparna Anand</strong>, who has
                      successfully passed the Ontario Solicitor Licensing Examination and has guided
                      candidates through the 2025 sittings with a <strong className="text-emerald-600">97% pass rate</strong>.
                      Having more than <strong>10 years of teaching experience</strong>, her teaching focuses
                      on exam strategy, time management, and how to apply the LSO materials effectively.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                    <h4 className="mb-2 font-bold text-colorBlackPearl">Barrister Examination</h4>
                    <p className="text-sm leading-relaxed">
                      The Barrister Examination stream is being led by an experienced licensing-exam
                      educator who will be formally announced shortly, ensuring that candidates receive
                      the same high-quality, exam-focused instruction across both components.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center divide-x divide-gray-200 rounded-xl bg-gray-50 py-4">
                <div className="flex-1 px-4 text-center">
                  <div className="font-title text-3xl font-bold text-[#DF4343]">97%</div>
                  <div className="text-sm font-medium text-gray-500">Pass Rate</div>
                </div>
                <div className="flex-1 px-4 text-center">
                  <div className="font-title text-3xl font-bold text-[#DF4343]">10+</div>
                  <div className="text-sm font-medium text-gray-500">Years Experience</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInstructors;
