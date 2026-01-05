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
              className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-10"
              data-aos="fade-right"
            >
              <div className="mb-6 flex items-start gap-5">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ring-4 ring-colorPurpleBlue/20">
                  <Image
                    src="/assets/img/team/vidya-puthran.jpg"
                    alt="Ms. Vidya Puthran"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-title text-2xl font-bold text-colorPurpleBlue">
                    Ms. Vidya Puthran
                  </h3>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Founder & NCA Program Lead</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700">
                  Our NCA Exam Preparation Program is led by <strong>Ms. Vidya Puthran</strong>, an NCA-qualified
                  lawyer and legal educator with extensive experience teaching internationally trained
                  lawyers on how to succeed in NCA exams.
                </p>

                <p className="text-base leading-relaxed text-gray-700">
                  She has <strong>9 years of teaching experience</strong>,
                  focused on NCA tutoring by building NCA MADE EASY platform. She has taught all
                  core and optional NCA subjects that we offer, guiding candidates through real exam
                  methodology, Canadian case-law application, and structured answer-writing.
                </p>

                {/* Stats */}
                <div className="mt-6 flex items-center gap-6 rounded-lg bg-emerald-50 p-4">
                  <div className="text-center">
                    <div className="font-title text-3xl font-bold text-emerald-600">98%</div>
                    <div className="text-xs text-gray-600">Pass Rate</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="font-title text-3xl font-bold text-emerald-600">9</div>
                    <div className="text-xs text-gray-600">Years Experience</div>
                  </div>
                </div>

                <p className="text-sm italic text-gray-600">
                  Under her instruction, students have achieved a <strong className="text-emerald-600">98% pass rate</strong>,
                  reflecting a disciplined, exam-focused approach built on how the NCA actually assesses
                  legal reasoning and written performance.
                </p>
              </div>
            </div>

            {/* Ontario Bar Instructors */}
            <div
              className="rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-10"
              data-aos="fade-left"
            >
              <div className="mb-6 flex items-start gap-5">
                <div className="inline-flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-colorPurpleBlue/10">
                  <Image
                    src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                    alt="ontario bar"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h3 className="font-title text-2xl font-bold text-colorPurpleBlue">
                    Ontario Bar Team
                  </h3>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Licensing Exam Experts</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base leading-relaxed text-gray-700">
                  Our Ontario Bar Exam Preparation Program is delivered by experienced, exam-qualified
                  instructors who understand exactly how the Law Society of Ontario tests candidates.
                </p>

                {/* Aparna Anand - Solicitor */}
                <div className="rounded-lg border-l-4 border-colorPurpleBlue bg-gray-50 p-4">
                  <h4 className="font-title text-lg font-bold text-colorBlackPearl mb-2">
                    Aparna Anand - Solicitor Exam
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    <strong>Aparna Anand</strong> has successfully passed the Ontario Solicitor Licensing
                    Examination and has guided candidates through the 2025 sittings with a{" "}
                    <strong className="text-emerald-600">97% pass rate</strong>. Having more than{" "}
                    <strong>10 years of teaching experience</strong>, her teaching focuses on exam strategy,
                    time management, and how to apply the LSO materials effectively under test conditions.
                  </p>
                </div>

                {/* Barrister Instructor */}
                <div className="rounded-lg border-l-4 border-gray-400 bg-gray-50 p-4">
                  <h4 className="font-title text-lg font-bold text-colorBlackPearl mb-2">
                    Barrister Exam - Coming Soon
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    The Barrister Examination stream is being led by an experienced licensing-exam
                    educator who will be formally announced shortly, ensuring that candidates receive
                    the same high-quality, exam-focused instruction across both components of the
                    Ontario licensing process.
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-6 flex items-center gap-6 rounded-lg bg-emerald-50 p-4">
                  <div className="text-center">
                    <div className="font-title text-3xl font-bold text-emerald-600">97%</div>
                    <div className="text-xs text-gray-600">Pass Rate</div>
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="font-title text-3xl font-bold text-emerald-600">10+</div>
                    <div className="text-xs text-gray-600">Years Experience</div>
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

export default AboutInstructors;
