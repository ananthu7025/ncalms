/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
  return (
    <section className="section-course-category">
      <div className="section-space">
        <div className="container">

          {/* Header */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-8 lg:mb-[60px]">
            <div className="max-w-xl" data-aos="fade-up">
              <h2>We Offer</h2>
            </div>

            <div className="inline-block" data-aos="fade-left" data-aos-delay="100">
              <Link
                className="btn btn-primary is-icon group"
                href="https://wa.me/1234567890" // Placeholder for WhatsApp link
                target="_blank"
              >
                Contact via WhatsApp
                <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                  <Image src="/assets/img/icons/icon-white-chat-2.svg" alt="whatsapp" width={20} height={20} className="filter invert" />
                </span>
                <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                  <Image src="/assets/img/icons/icon-white-chat-2.svg" alt="whatsapp" width={20} height={20} className="filter invert" />
                </span>
              </Link>
            </div>
          </div>

          {/* 4 Items */}
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            {[
              {
                icon: "4", // Using existing icon numbers as placeholders, assuming they exist
                name: "Detailed Lecture Recordings",
                description: "Complete NCA updated syllabus coverage and how to write answers",
                bg: "#543EE4",
              },
              {
                icon: "6",
                name: "Study Materials",
                description: "Notes, Questions and Answers, IRACs, Essay Answer Structures",
                bg: "#543EE5",
              },
              {
                icon: "2",
                name: "1:1 Doubt Clearing",
                description: "Personal sessions with prior booking",
                bg: "#42AC98",
              },
              {
                icon: "1",
                name: "Legal Research & Writing",
                description: "Learn how to research Canadian law, write clear legal memos — connect via WhatsApp",
                bg: "#DE1EF9",
              },
            ].map((item, idx) => (
              <li key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                <div
                  className="flex h-full items-start gap-6 rounded-[20px] bg-white p-8 transition-all duration-300 hover:shadow-lg"
                >
                  <div
                    className="inline-flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-[50%]"
                    style={{ backgroundColor: `${item.bg}1A` }}
                  >
                    <Image
                      src={`/assets/img/icons/category-icon-${item.icon}.svg`}
                      alt={item.name}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="mb-2 block font-title text-xl font-bold text-colorBlackPearl">
                      {item.name}
                    </span>
                    <p className="text-base text-gray-600">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
};

export default Categories;
