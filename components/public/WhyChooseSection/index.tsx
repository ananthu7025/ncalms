import Image from "next/image";

const WhyChooseUs = () => {
  return (
    <section className="section-content">
      <div className="relative z-10">
        <div className="section-space-top pb-[286px]">
          <div className="container">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr] xxl:gap-28">

              {/* Content */}
              <div
                className="order-1 lg:order-2"
                data-aos="fade-left"
              >
                <div className="mb-6" data-aos="fade-up">
                  <span className="mb-5 block uppercase">
                    WHY CHOOSE US
                  </span>
                  <h2>Our Mission & Values</h2>
                </div>

                <div className="mt-7" data-aos="fade-up" data-aos-delay="100">
                  <p>
                    We are dedicated to empowering aspiring lawyers to succeed in their Canadian legal journey through expert guidance and comprehensive resources.
                  </p>

                  <ul className="mt-10 flex flex-col gap-y-10">

                    {/* Mission */}
                    <li data-aos="fade-up" data-aos-delay="200">
                      <div className="mb-5 flex items-center gap-x-5">
                        <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-colorLightSeaGreen/10">
                          <Image
                            src="/assets/img/icons/content-icon-1.svg"
                            alt="mission"
                            width={25}
                            height={25}
                          />
                        </div>
                        <span className="flex-1 font-title text-xl font-bold text-colorBlackPearl">
                          Our Mission
                        </span>
                      </div>
                      <p>
                        To empower aspiring Canadian lawyers with the knowledge, skills, and confidence to excel in their NCA and Ontario Bar examinations on their first attempt.
                      </p>
                    </li>

                    {/* Values */}
                    <li data-aos="fade-up" data-aos-delay="300">
                      <div className="mb-5 flex items-center gap-x-5">
                        <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-colorJasper/10">
                          <Image
                            src="/assets/img/icons/content-icon-2.svg"
                            alt="values"
                            width={25}
                            height={25}
                          />
                        </div>
                        <span className="flex-1 font-title text-xl font-bold text-colorBlackPearl">
                          Our Values
                        </span>
                      </div>
                      <p>
                        Excellence, integrity, and personalized support for every student. We believe in building lasting relationships and genuine success through dedicated mentorship.
                      </p>
                    </li>

                  </ul>
                </div>
              </div>

              {/* Image + Stats */}
              <div
                className="relative z-10 order-2 lg:order-1"
                data-aos="fade-right"
              >
                <Image
                  src="/assets/img/images/th-1/content-img-1.png"
                  alt="students"
                  width={586}
                  height={585}
                  className="max-w-full pl-5"
                />

                <div className="absolute bottom-[60px] left-0 z-10 inline-flex items-center gap-5 rounded-lg bg-white py-2 pl-4 pr-8 shadow-[17px_18px_30px_16px] shadow-[#070229]/10" data-aos="zoom-in" data-aos-delay="200">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-[50%] bg-[#4c6ae6]/5">
                    <Image
                      src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                      alt="success"
                      width={28}
                      height={28}
                    />
                  </div>
                  <div>
                    <span className="block font-title text-[28px] font-bold leading-[1.73] text-colorPurpleBlue">
                      98%
                    </span>
                    <span>Pass Rate</span>
                  </div>
                </div>

                {/* Proof Stats (Visual, not UI-altering) */}
                <div className="absolute left-0 top-0 -z-10 h-96 w-96 rounded-[50%] bg-[#6FC081] blur-[230px]"></div>

                <Image
                  src="/assets/img/abstracts/abstract-orange-1.svg"
                  alt="abstract"
                  width={70}
                  height={55}

                  className="absolute left-1 top-[133px] animate-bounce"
                />
                <Image
                  src="/assets/img/abstracts/abstract-dots-3.svg"
                  alt="abstract"
                  width={79}
                  height={50}
                  className="absolute -right-5 bottom-[65px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <Image
          src="/assets/img/abstracts/abstract-dots-2.svg"
          alt="abstract"
          width={49}
          height={79}
          className="absolute left-28 top-28 -z-10 hidden animate-pulse xl:inline-block"
        />
     

        <div className="absolute -left-80 top-1/2 -z-10 h-[457px] w-[457px] -translate-y-1/2 rounded-[50%] bg-[#BFC06F] blur-[230px]"></div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
