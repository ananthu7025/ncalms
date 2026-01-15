import Image from "next/image";
import Link from "next/link";

const PrivateTutoring = () => {
  return (
    <section className="section-private-tutoring">
      <div className="relative z-10 overflow-hidden bg-white ">
        <div className="section-space">
          <div className="container">
            {/* Section Header */}
            <div className="mb-10 lg:mb-[60px]">
              <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
                <span className="mb-5 block uppercase tracking-wider text-colorPurpleBlue">
                  Personalized Coaching
                </span>
                <h2 className="font-title text-3xl font-bold text-colorBlackPearl lg:text-5xl">
                  Book Your 1:1 Coaching Session
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:gap-20">

              {/* Left Content */}
              <div className="order-2 lg:order-1" data-aos="fade-right">

                {/* NCA Services Card */}
                <div className="rounded-2xl bg-gradient-to-br from-colorPurpleBlue/5 to-colorLightSeaGreen/5 p-8 lg:p-10">
                  <div className="mb-6 flex items-center gap-5">
                    <div className="inline-flex h-[70px] w-[70px] items-center justify-center rounded-[50%] bg-colorPurpleBlue/10">
                      <Image
                        src="/assets/img/icons/icon-red-tomato-graduation-cap-line.svg"
                        alt="nca services"
                        width={35}
                        height={35}
                      />
                    </div>
                    <h3 className="flex-1 font-title text-2xl font-bold text-colorBlackPearl lg:text-3xl">
                      1:1 Call Options
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700">
                      Book personalized 1:1 coaching sessions with our experienced NCA experts.
                      Get tailored guidance and support for your specific needs.
                    </p>

                    {/* Services List */}
                    <ul className="mt-8 space-y-4">
                      {[
                        {
                          title: "NCA Assessment Guidance",
                          desc: "Get expert advice on NCA eligibility, course selection, and application process. Understand what to expect and how to prepare for your NCA journey."
                        },
                        {
                          title: "NCA Exam Preparation",
                          desc: "Personalized coaching for NCA exams. Review your answers, get detailed feedback, and learn proven strategies to pass your exams with confidence."
                        },
                        {
                          title: "Teaching / Answer Writing",
                          desc: "Master the art of legal writing. Learn how to structure answers, apply IRAC methodology, and write like a Canadian lawyer."
                        }
                      ].map((service, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-colorLightSeaGreen/20 flex-shrink-0 mt-1">
                            <svg
                              className="h-4 w-4 text-colorLightSeaGreen"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-colorBlackPearl">{service.title}</span>
                            <p className="text-sm text-gray-600 mt-1">{service.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Buttons */}
                    <div className="mt-8 pt-6 flex flex-col sm:flex-row gap-4">
                      <Link href="/courses">
                        <button className="group inline-flex items-center gap-3 rounded-lg bg-colorPurpleBlue px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-colorBlackPearl hover:shadow-lg">
                          <span>Explore Courses</span>
                          <svg
                            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </button>
                      </Link>
                      <Link href="/book-a-call">
                        <button className="group inline-flex items-center gap-3 rounded-lg border-2 border-colorPurpleBlue px-8 py-4 font-semibold text-colorPurpleBlue transition-all duration-300 hover:bg-colorPurpleBlue hover:text-white hover:shadow-lg">
                          <span>Book a Call</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Visual */}
              <div className="relative order-1 lg:order-2" data-aos="fade-left">
                <div className="relative rounded-2xl bg-gradient-to-br from-colorPurpleBlue/10 to-colorLightSeaGreen/10 p-8">
                  <Image
                    src="/assets/img/images/th-1/cta-img.png"
                    alt="private tutoring"
                    width={600}
                    height={600}
                    className="mx-auto max-w-full"
                  />

                  {/* Limited Slots Badge */}
                  <div className="absolute -top-4 right-8 z-10 rounded-full bg-gradient-to-r from-[#4c6ae6] to-[#FF6B6B] px-6 py-3 shadow-lg" data-aos="zoom-in" data-aos-delay="200">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
                      </div>
                      <span className="font-semibold text-white">
                        Limited Coaching Slots Available!
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -left-10 top-20 -z-10 h-40 w-40 rounded-full bg-colorPurpleBlue/20 blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 -z-10 h-40 w-40 rounded-full bg-colorLightSeaGreen/20 blur-3xl"></div>
                </div>

                {/* Abstract Decorations */}
                <Image
                  src="/assets/img/abstracts/abstract-dots-3.svg"
                  alt="abstract"
                  width={79}
                  height={50}
                  className="absolute -left-5 top-10 hidden animate-pulse lg:inline-block"
                />
                <Image
                  src="/assets/img/abstracts/abstract-orange-1.svg"
                  alt="abstract"
                  width={70}
                  height={55}
                  className="absolute -bottom-5 -right-5 hidden animate-bounce lg:inline-block"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute -left-80 bottom-1/4 -z-10 h-[457px] w-[457px] rounded-[50%] bg-[#BFC06F] blur-[230px]"></div>
        <div className="absolute -right-80 top-1/4 -z-10 h-[457px] w-[457px] rounded-[50%] bg-[#6FC081] blur-[230px]"></div>
      </div>
    </section>
  );
};

export default PrivateTutoring;
