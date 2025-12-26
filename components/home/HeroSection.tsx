import { ArrowRight, Search, Zap } from 'lucide-react';
import Reveal from '../animations/Reveal';

export function HeroSection() {
  return (
    <section className="hero-section-2 hero-7 overflow-hidden">
      {/* Side Images */}
      <div className="hero-img-wrap-7">
        <Reveal x={-100} duration={1.2}>
          <div className="hero-img-1">
            <img src="/assets/img/images/content-img-1.png" alt="hero" />
          </div>
        </Reveal>
        <Reveal x={100} duration={1.2}>
          <div className="hero-img-2">
            <img src="/assets/img/images/content-img-2.png" alt="hero" />
          </div>
        </Reveal>
      </div>

      {/* Shapes */}
      <div className="shapes">
        <div className="shape shape-1">
          <img src="/assets/img/shapes/hero-shape-11.png" alt="shape" />
        </div>
        <div className="shape shape-2">
          <img src="/assets/img/shapes/hero-shape-12.png" alt="shape" />
        </div>
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="hero-content-2 hero-content-7 text-center">
              {/* Heading */}
              <div className="section-heading mb-20 text-center">
                <Reveal y={-30} delay={0.1}>
                  <h4 className="sub-heading">
                    <span className="heading-icon">
                      <Zap size={16} />
                    </span>
                    Trusted by 1000+ Students
                  </h4>
                </Reveal>

                <Reveal y={-50} delay={0.2} duration={1}>
                  <h2 className="section-title">
                    NCA Made Easy <br />
                    <span>Your Gateway to NCA & Ontario Bar Excellence</span>
                  </h2>
                </Reveal>
              </div>

              {/* Description */}
              <Reveal y={50} delay={0.3}>
                <p className="desc">
                  Begin your journey to becoming a qualified Canadian lawyer with
                  expert-led NCA preparation, structured courses, and one-on-one
                  guidance.
                </p>
              </Reveal>

              {/* Search */}
              <Reveal scale={0.9} delay={0.4} duration={0.8}>
                <div className="hero-form">
                  <form action="#">
                    <input
                      type="text"
                      id="text"
                      name="text"
                      className="form-control"
                      placeholder="Search NCA subjects, exams, or guidance..."
                    />
                  </form>
                  <button className="ed-primary-btn">
                    Explore Courses <ArrowRight size={16} className="ml-2" />
                  </button>
                  <div className="icon">
                    <Search />
                  </div>
                </div>
              </Reveal>

              {/* Counters */}
              <div className="about-counter-items mb-0">
                {[
                  {
                    count: '10',
                    text: 'Students successfully cleared<br/>NCA exams',
                    icon: 'about-1.png',
                  },
                  {
                    count: '25',
                    text: 'Expert mentors &<br/>law professionals',
                    icon: 'about-2.png',
                  },
                  {
                    count: '12',
                    text: 'NCA subjects &<br/>Ontario Bar modules',
                    icon: 'about-3.png',
                  },
                ].map((item, i) => (
                  <Reveal
                    key={i}
                    y={40}
                    delay={0.5 + i * 0.1}
                    className="d-inline-block"
                  >
                    <div className="about-counter-item">
                      <div className="icon">
                        <img
                          src={`/assets/img/icon/${item.icon}`}
                          alt="about"
                        />
                      </div>
                      <div className="content">
                        <h3 className="title">
                          <span className="odometer">{item.count}</span>
                          <span className="number">K+</span>
                        </h3>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item.text,
                          }}
                        />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              {/* End Counters */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
