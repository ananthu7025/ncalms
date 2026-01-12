import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="section-hero relative overflow-hidden bg-[#1a365d]">

      {/* Background Pattern grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 px-5 pt-[210px] md:pt-[235px] lg:px-0 lg:pb-[100px] lg:pl-20 lg:pt-[310px] xxl:pb-[166px] xxxl:pl-32 xxxxl:pl-[250px]"

      ></div>

      <div
        style={{
          backgroundImage: "radial-gradient(#4a5568 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px] items-center">
        {/* LEFT CONTENT */}
        <div className="px-5 pt-[180px] pb-12 lg:pl-20 xl:pl-32 relative z-10 flex flex-col justify-center h-full">
          {/* Pass Rate Badge */}
          <div className="mb-8 w-fit rounded-full border border-gray-500 bg-white/5 backdrop-blur-sm px-6 py-2" data-aos="fade-down">
            <span className="flex items-center gap-2 font-bold text-white">
              <span className="text-colorBrightGold">🏆</span> 98% Pass Rate
            </span>
          </div>

          <h1 className="mb-8 leading-tight" data-aos="fade-up" data-aos-delay="100">
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

          <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="300">
            <Link href="/courses?category=nca" className="btn-outline-white group flex items-center gap-2 rounded-full border-2 border-gray-500 bg-transparent px-6 py-3 font-bold text-colorBrightGold hover:border-colorBrightGold hover:bg-white/5 transition-all">
              <span className="text-lg">⚖️</span>
              NCA Exams
            </Link>

            <Link href="/courses?category=solicitor" className="btn-outline-white group flex items-center gap-2 rounded-full border-2 border-gray-500 bg-transparent px-6 py-3 font-bold text-white hover:border-white hover:bg-white/5 transition-all">
              <span className="text-lg">💼</span>
              Ontario Bar - Solicitor
            </Link>

            <Link href="/courses?category=barrister" className="btn-outline-white group flex items-center gap-2 rounded-full border-2 border-gray-500 bg-transparent px-6 py-3 font-bold text-white hover:border-white hover:bg-white/5 transition-all">
              <span className="text-lg">🏛️</span>
              Ontario Bar - Barrister
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative h-full flex items-end justify-center lg:justify-end overflow-hidden pt-[100px]" data-aos="fade-left" data-aos-delay="400">
          {/* Abstract shapes behind */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

          <Image
            src="/assets/img/images/th-1/hero-male.png"
            alt="Male Law Student"
            width={740}
            height={840}
            priority
            className="relative z-10 max-w-[90%] md:max-w-md lg:max-w-xl xl:max-w-2xl object-cover object-top"
            style={{
              maskImage: 'radial-gradient(circle at center 40%, black 50%, transparent 98%)',
              WebkitMaskImage: 'radial-gradient(circle at center 40%, black 50%, transparent 98%)'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
