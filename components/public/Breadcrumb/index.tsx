import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BreadcrumbProps {
  title: string;
  items: {
    label: string;
    href?: string;
  }[];
}

const Breadcrumb = ({ title, items }: BreadcrumbProps) => {
  return (
    <section style={{marginTop:"130px"}} className="section-breadcrum">
      <div className="relative z-10 overflow-hidden bg-[#FAF9F6]">
        {/* Section Space */}
        <div className="py-[60px] lg:py-[90px]">
          <div className="container">
            <div className="text-center">
              {/* Title */}
              <h1 className="mb-5 text-4xl capitalize tracking-normal" data-aos="fade-up">
                {title}
              </h1>

              {/* Breadcrumb */}
              <nav className="text-base font-medium uppercase" data-aos="fade-up" data-aos-delay="100">
                <ul className="flex justify-center gap-2">
                  {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                      <li
                        key={`${item.label}-${index}`}
                        className={`flex items-center ${
                          item.href ? "text-colorJasper" : "text-black"
                        }`}
                      >
                        {item.href && !isLast ? (
                          <Link href={item.href} className="hover:underline">
                            {item.label}
                          </Link>
                        ) : (
                          <span>{item.label}</span>
                        )}

                        {!isLast && (
                          <span className="mx-2 text-colorCarbonGrey">/</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Background Blur Elements */}
        <div className="absolute -left-48 top-0 -z-10 h-[327px] w-[371px] bg-[#BFC06F] blur-[250px]" />
        <div className="absolute -right-36 bottom-20 -z-10 h-[327px] w-[371px] bg-[#AAC3E9] blur-[200px]" />

        {/* Decorative Images */}
        <Image
          src="/assets/img/abstracts/abstract-purple-dash-1.svg"
          alt="abstract decoration"
          width={120}
          height={120}
          className="absolute left-56 top-1/2 -z-10 hidden -translate-y-1/2 sm:inline-block"
        />

        <Image
          src="/assets/img/abstracts/abstract-element-regular.svg"
          alt="abstract decoration"
          width={120}
          height={120}
          className="absolute -bottom-14 right-[100px] -z-10 hidden sm:inline-block"
        />
      </div>
    </section>
  );
};

export default Breadcrumb;
