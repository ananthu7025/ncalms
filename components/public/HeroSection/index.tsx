import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="section-hero">
      <div
        className="relative z-10 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/assets/img/images/th-1/hero-bg.svg)" }}
      >
        <div className="grid grid-cols-1 px-5 pt-[210px] md:pt-[235px] lg:px-0 lg:pb-[100px] lg:pl-20 lg:pt-[310px] xxl:pb-[166px] xxxl:pl-32 xxxxl:pl-[250px]">
          {/* LEFT CONTENT */}
          <div className="lg:max-w-lg xxl:max-w-2xl">
            {/* Pass Rate Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 shadow-lg" data-aos="fade-down" data-aos-delay="50">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-white">Pass Rate – 98%</span>
            </div>

            <h1 className="mb-[30px]" data-aos="fade-up" data-aos-delay="100">
              <span className="font-extrabold text-colorPurpleBlue">NCA MADE EASY</span>
              {" "}- Begin your journey of becoming a{" "}
              <span className="inline-flex rounded-md bg-colorBrightGold px-2">
                Licensed Lawyer
              </span>{" "}
              in Canada with{" "}
              <span className="font-extrabold underline decoration-2 decoration-primary underline-offset-4 whitespace-nowrap">
                NCA MADE EASY!
              </span>
            </h1>

            <p className="mb-8 max-w-[400px] xl:max-w-[474px]" data-aos="fade-up" data-aos-delay="200">
              Expert-led NCA exam preparation, Ontario Bar licensing guidance,
              and personalized mentorship to help you succeed.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center" data-aos="fade-up" data-aos-delay="300">
              <Link href="/courses" className="btn btn-primary is-icon group">
                Explore Courses
                <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                  <Image
                    src="/assets/img/icons/icon-purple-arrow-right.svg"
                    alt="arrow-right"
                    width={13}
                    height={12}
                  />
                </span>
                <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                  <Image
                    src="/assets/img/icons/icon-purple-arrow-right.svg"
                    alt="arrow-right"
                    width={13}
                    height={12}
                  />
                </span>
              </Link>

              <a
                href="https://www.youtube.com/playlist?list=PLk-9Hiidr8C7jltqeKH_KYY_K9WsBdGMJ"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-semibold text-colorPurpleBlue hover:text-colorBlackPearl transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 group-hover:bg-red-200 transition-colors">
                  <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Watch Demo</span>
                  <span className="text-xs text-gray-600">Free Lectures</span>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="bottom-0 right-20 mt-10 lg:absolute lg:mt-0 xxxxl:right-44" data-aos="fade-left" data-aos-delay="400">
            <div className="relative z-10 flex items-end justify-center">
              <Image
                src="/assets/img/images/th-1/hero-img-1.png"
                alt="hero-img"
                width={653}
                height={740}
                priority
                className="element-move-x z-10 max-w-full -translate-x-[50px] md:max-w-md xl:max-w-lg xxl:max-w-full"
              />

              <div
                className="jos absolute -bottom-28 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-[#D7E1D8] to-white xl:h-[500px] xl:w-[500px] xxl:h-[706px] xxl:w-[706px]"
                data-jos_animation="zoom-in-up"
              />

              <Image
                src="/assets/img/abstracts/abstract-dots-2.svg"
                alt="abstract-dots"
                width={49}
                height={79}
                className="element-move absolute bottom-[86px] left-24"
              />
            </div>
          </div>
        </div>

        {/* FLOATING ELEMENTS */}
        <Image
          src="/assets/img/abstracts/abstract-red-plus-1.svg"
          alt="abstract-plus"
          width={46}
          height={32}
          className="element-move absolute left-[125px] top-[296px] -z-10"
        />
        <Image
          src="/assets/img/abstracts/abstract-dots-1.svg"
          alt="abstract-dots"
          width={49}
          height={94}
          className="element-move absolute right-0 top-52 -z-10"
        />
        <Image
          src="/assets/img/abstracts/element-book-1.svg"
          alt="book-element"
          width={93}
          height={73}
          className="element-move absolute -bottom-40 left-[771px] -z-10"
        />
        <Image
          src="/assets/img/abstracts/element-crown-1.svg"
          alt="crown-element"
          width={47}
          height={39}
          className="absolute bottom-[86px] right-[63px] -z-10"
        />
      </div>
    </section>
  );
};

export default HeroSection;
