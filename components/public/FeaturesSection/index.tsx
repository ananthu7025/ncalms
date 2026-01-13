
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <div className="section-feature">
      <div className="relative z-10 bg-colorBlackPearl">
        <div className="py-[60px] lg:py-[90px]">
          <div className="container">
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

              {/* Feature 1 */}
              <li className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="100">
                <div className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-[50%] bg-colorBrightGold/10 flex-shrink-0">
                  <Image
                    src="/assets/img/icons/feature-icon-1.svg"
                    alt="feature-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-lg font-bold text-white">
                    Video Lectures
                  </span>
                  <span className="text-white/80 text-sm">
                    Complete syllabus coverage.
                  </span>
                </div>
              </li>

              {/* Feature 2 */}
              <li className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
                <div className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-[50%] bg-[#6FC081]/10 flex-shrink-0">
                  <Image
                    src="/assets/img/icons/feature-icon-2.svg"
                    alt="feature-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-lg font-bold text-white">
                    Study Materials
                  </span>
                  <span className="text-white/80 text-sm">
                    Notes, questions & answers.
                  </span>
                </div>
              </li>

              {/* Feature 3 */}
              <li className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="300">
                <div className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-[50%] bg-[#DF4343]/10 flex-shrink-0">
                  <Image
                    src="/assets/img/icons/feature-icon-3.svg"
                    alt="feature-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-lg font-bold text-white">
                    Doubt Clearing
                  </span>
                  <span className="text-white/80 text-sm">
                    Personalized 1:1 sessions.
                  </span>
                </div>
              </li>

              {/* Feature 4 - WhatsApp */}
              <li className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
                <div className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-[50%] bg-[#25D366]/10 flex-shrink-0">
                  <Image
                    src="/assets/img/icons/icon-whatsapp.svg"
                    alt="whatsapp-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex-1">
                  <span className="mb-2 block font-title text-lg font-bold text-white">
                    WhatsApp Chat
                  </span>
                  <span className="mb-3 block text-white/80 text-sm">
                    Instant support team access.
                  </span>
                  <a
                    href="https://wa.me/81232 83217"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#128C7E]"
                  >
                    <span>Message Us</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
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
