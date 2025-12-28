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
              <span className="mb-5 block uppercase">CUSTOMIZED SERVICES & RESOURCES</span>
              <h2>Everything You Need to Excel in the NCA Exams</h2>
              <p className="mt-3">
                Looking for something just for you? We've got you covered.
              </p>
            </div>

            <div className="inline-block" data-aos="fade-left" data-aos-delay="100">
              <Link className="btn btn-primary is-icon group" href="/contact">
                Enquire Now
                <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                  <Image src="/assets/img/icons/icon-purple-arrow-right.svg" alt="arrow" width={13} height={12} />
                </span>
                <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                  <Image src="/assets/img/icons/icon-purple-arrow-right.svg" alt="arrow" width={13} height={12} />
                </span>
              </Link>
            </div>
          </div>

          {/* 6 Items */}
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {[
              {
                icon: "1",
                name: "Legal Research Writing",
                action: "Enquire Now",
                bg: "#DE1EF9",
              },
              {
                icon: "2",
                name: "Doubt Clearing Session",
                action: "Enquire Now",
                bg: "#42AC98",
              },
              {
                icon: "3",
                name: "Live Mock Exam",
                action: "Enquire Now",
                bg: "#DF4343",
              },
              {
                icon: "4",
                name: "Recorded Lectures",
                action: "Demo",
                bg: "#543EE4",
              },
              {
                icon: "5",
                name: "Study Materials",
                action: "Sample",
                bg: "#543EE5",
              },
              {
                icon: "6",
                name: "Sample Question Papers With Answers",
                action: "Sample",
                bg: "#DF4343",
              },
            ].map((item, idx) => (
              <li key={idx} data-aos="fade-up" data-aos-delay={idx * 100}>
                <a
                  className="flex items-center gap-6 rounded-[100px] bg-white p-[10px] transition-all duration-300 hover:shadow-lg"
                  href="#"
                >
                  <div
                    className="inline-flex h-[72px] w-[72px] items-center justify-center rounded-[50%]"
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
                    <span className="mb-1 block font-title text-xl font-bold text-colorBlackPearl">
                      {item.name}
                    </span>
                    <span className="text-sm">{item.action}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
};

export default Categories;
