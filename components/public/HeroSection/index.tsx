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
            <h1 className="mb-[30px]" data-aos="fade-up" data-aos-delay="100">
              Trusted{" "}
              <span className="inline-flex rounded-md bg-colorBrightGold px-2">
                Online
              </span>{" "}
              Platform for{" "}
              <span className="font-extrabold underline decoration-2 decoration-primary underline-offset-4 whitespace-nowrap">
                NCA & Ontario Bar
              </span>
            </h1>

            <p className="mb-10 max-w-[400px] xl:max-w-[474px]" data-aos="fade-up" data-aos-delay="200">
              Begin your journey to becoming a qualified Canadian lawyer with
              expert-led NCA exam preparation, Ontario Bar licensing guidance,
              and personalized mentorship.
            </p>

            <Link href="/courses" className="btn btn-primary is-icon group" data-aos="fade-up" data-aos-delay="300">
              Find Courses
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
