
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <div className="section-feature">
      <div className="relative z-10 bg-colorBlackPearl">
        <div className="py-[60px] lg:py-[90px]">
          <div className="container">
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Feature 1 */}
              <li className="flex items-start gap-5" data-aos="fade-up" data-aos-delay="100">
                <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-colorBrightGold/10">
                  <Image
                    src="/assets/img/icons/feature-icon-1.svg"
                    alt="feature-icon"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-xl font-bold text-white">
                    Detailed Lecture Recordings
                  </span>
                  <span className="text-white/80">
                    Complete NCA syllabus material coverage with concept-focused explanations.
                  </span>
                </div>
              </li>

              {/* Feature 2 */}
              <li className="flex items-start gap-5" data-aos="fade-up" data-aos-delay="200">
                <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-[#6FC081]/10">
                  <Image
                    src="/assets/img/icons/feature-icon-2.svg"
                    alt="feature-icon"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-xl font-bold text-white">
                    Study Materials
                  </span>
                  <span className="text-white/80">
                    Summary notes, exam-oriented sample questions and model answers.
                  </span>
                </div>
              </li>

              {/* Feature 3 */}
              <li className="flex items-start gap-5" data-aos="fade-up" data-aos-delay="300">
                <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-[#DF4343]/10">
                  <Image
                    src="/assets/img/icons/feature-icon-3.svg"
                    alt="feature-icon"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-xl font-bold text-white">
                    1:1 Doubt Clearing
                  </span>
                  <span className="text-white/80">
                    Personalized one-on-one sessions with prior booking for focused guidance.
                  </span>
                </div>
              </li>

            </ul>
          </div>
        </div>

        {/* Background Abstracts */}
        <Image
          src="/assets/img/abstracts/abstract-dots-2.svg"
          alt="abstract"
          width={49}
          height={79}
          className="absolute left-[100px] top-1/2 -z-10 hidden -translate-y-1/2 rotate-90 animate-pulse xxxl:inline-block"
        />
        <Image
          src="/assets/img/abstracts/abstract-golden-yellow-dash-1.svg"
          alt="abstract"
          width={45}
          height={37}
          className="absolute bottom-12 right-[100px] -z-10 hidden animate-bounce xxxl:inline-block"
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
