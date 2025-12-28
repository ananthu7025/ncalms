"use client";

import React, { useState } from "react";
import Image from "next/image";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How can I start with your online class?",
      answer:
        "Getting started is easy! Simply browse our course catalog, select the course that interests you, and click enroll. You'll have immediate access to all course materials and can start learning right away.",
    },
    {
      question: "How can I register to your website to learn?",
      answer:
        "Click on the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. Once registered, you can browse and enroll in any of our courses.",
    },
    {
      question: "Can i get lifetime access for your any courses?",
      answer:
        "Yes! When you enroll in any of our courses, you get lifetime access to all course materials, including future updates and additions. Learn at your own pace, anytime, anywhere.",
    },
    {
      question: "How can I contact a school directly?",
      answer:
        "You can reach out to us through our contact form, email us directly, or use the live chat feature available on our website. Our support team is available 24/7 to assist you.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="section-faq">
      <div className="section-space bg-[#FAF9F6]">
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Left Column - Images */}
            <div className="relative" data-aos="fade-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Image
                    src="/assets/img/images/th-2/faq-img-1.png"
                    alt="faq"
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                  />
                </div>
                <Image
                  src="/assets/img/images/th-2/faq-img-2.png"
                  alt="faq"
                  width={195}
                  height={195}
                  className="w-full rounded-lg"
                />
                <Image
                  src="/assets/img/images/th-2/faq-img-3.png"
                  alt="faq"
                  width={195}
                  height={195}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -left-10 top-1/4 -z-10">
                <Image
                  src="/assets/img/abstracts/abstract-dots-3.svg"
                  alt="abstract"
                  width={100}
                  height={100}
                  className="animate-pulse opacity-50"
                />
              </div>
            </div>

            {/* Right Column - Accordion */}
            <div data-aos="fade-left">
              <div className="mb-10">
                <span className="mb-5 block uppercase text-colorPurpleBlue">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="font-title text-4xl font-bold text-colorBlackPearl lg:text-5xl">
                  Most Popular Questions About Our Online Courses
                </h2>
              </div>

              <ul className="flex flex-col gap-4">
                {faqs.map((faq, idx) => (
                  <li
                    key={idx}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="flex w-full items-center justify-between p-6 text-left transition-all"
                    >
                      <span className="font-title text-lg font-bold text-colorBlackPearl">
                        {faq.question}
                      </span>
                      <Image
                        src="/assets/img/icons/icon-dark-arrow-solid-down.svg"
                        alt="arrow"
                        width={16}
                        height={16}
                        className={`transition-transform duration-300 ${
                          openIndex === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === idx ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="border-t border-gray-200 px-6 pb-6 pt-4">
                        <p className="text-base">{faq.answer}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
