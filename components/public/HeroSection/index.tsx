import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="section-hero relative overflow-hidden bg-[#1a365d]">

      {/* Background Pattern grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 px-5 pt-[180px] md:pt-[225px] lg:px-0 lg:pb-[100px] lg:pl-20 lg:pt-[310px] xxl:pb-[166px] xxxl:pl-32 xxxxl:pl-[250px]"

      ></div>

      <div
        style={{
          backgroundImage: "radial-gradient(#4c6ae6 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
        {/* LEFT CONTENT */}
        <div className="px-5 pt-[100px] pb-12 lg:pl-20 xl:pl-32 relative z-10 flex flex-col justify-center h-full">
          {/* Pass Rate Badge */}
          <div className="mb-8 w-fit rounded-full border border-gray-500 bg-white/5 backdrop-blur-sm px-6 py-2" data-aos="fade-down">
            <span className="flex items-center gap-2 font-bold text-white">
              <span className="text-colorBrightGold">🏆</span> 98% Pass Rate
            </span>
          </div>

          <h1 className="mb-8 leading-tight" data-aos="fade-up" data-aos-delay="30">
            <span className="block text-4xl lg:text-6xl font-extrabold text-white mb-2">
              Begin your journey
            </span>
            <span className="block text-4xl lg:text-6xl font-extrabold text-white mb-2">
              of becoming a
            </span>
            <span className="block text-4xl lg:text-6xl font-extrabold text-colorBrightGold mb-2">
              Licensed Lawyer
            </span>
            <span className="block text-4xl lg:text-6xl font-extrabold text-white">
              in <span className="text-colorBrightGold">Canada!</span>
            </span>
          </h1>

          <p className="mb-12 max-w-xl text-lg text-gray-300 font-medium leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Expert preparation for NCA Exams and Ontario Bar Licensing with personalized mentorship and comprehensive study materials.
          </p>

          <div className="flex flex-wrap gap-3 pt-4 mt-2" data-aos="fade-up" data-aos-delay="300">
            <Link
              href="/courses"
              className="group flex items-center gap-2 rounded-full border-2 border-colorBrightGold/60 bg-colorBrightGold/15 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition-all hover:scale-110 hover:border-colorBrightGold hover:bg-colorBrightGold/25 hover:shadow-lg hover:shadow-amber-400/30 active:scale-105"
            >
              Explore Courses
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              href="https://www.youtube.com/playlist?list=PLk-9Hiidr8C7jltqeKH_KYY_K9WsBdGMJ"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition-all hover:scale-110 hover:border-white/60 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 active:scale-105"
            >
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Free Demo Lectures
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative h-full flex items-end justify-center lg:justify-end overflow-hidden pt-[80px]" data-aos="fade-left" data-aos-delay="400">
          {/* Abstract shapes behind */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

          <Image
            src="/assets/img/images/th-1/hero-male.png"
            alt="Male Law Student"
            width={740}
            height={900}
            priority
            className="relative z-10 max-w-[90%] md:max-w-md lg:max-w-xl xl:max-w-2xl object-cover object-top"
            style={{
              maskImage: 'radial-gradient(circle at center 40%, black 50%, transparent 98%)',
              WebkitMaskImage: 'radial-gradient(circle at center 40%, black 50%, transparent 98%)',
              height: '769px',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
