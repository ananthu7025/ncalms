import React from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import Reveal from '@/components/animations/Reveal';
import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import FounderSection from '@/components/home/FounderSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';

export default function AboutPage() {
    return (
        <>
            <Header />

            {/* About Content Section */}
            <section className="content-section pt-120 pb-120 overflow-hidden bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <Reveal x={-100} duration={1.2}>
                                <div className="content-img-wrap">
                                    <div className="content-img-1">
                                        <img src="/assets/img/images/content-img-1.png" alt="img" />
                                    </div>
                                    <div className="content-img-2">
                                        <img src="/assets/img/images/content-img-2.png" alt="img" />
                                    </div>
                                    <div className="content-img-3">
                                        <img src="/assets/img/images/content-img-3.png" alt="img" />
                                    </div>
                                    <div className="border-shape"></div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-6 ">
                            <div className="content-info">
                                <div className="section-heading mb-20">
                                    <Reveal x={50} delay={0.1}>
                                        <h4 className="sub-heading">
                                            <span className="heading-icon"><Zap size={16} /></span>
                                            About Us
                                        </h4>
                                    </Reveal>

                                    <Reveal x={50} delay={0.2}>
                                        <h2 className="section-title">
                                            Welcome to Our <br />
                                            Online Learning Center
                                        </h2>
                                    </Reveal>
                                </div>

                                <Reveal x={50} delay={0.3}>
                                    <p className="mb-30">
                                        <strong>NCA Made Easy</strong> is the trusted choice for navigating the National Committee on Accreditation (NCA) exams successfully in Canada.
                                        We specialize in personalized mentorship and comprehensive study resources.
                                    </p>
                                </Reveal>

                                <Reveal x={50} y={0} delay={0.4}>
                                    <div className="content-item mb-30">
                                        <div className="icon">
                                            <img src="/assets/img/icon/content-1.png" alt="icon" />
                                        </div>
                                        <div className="content">
                                            <h4 className="title">Expert-Led Mentorship</h4>
                                            <p>
                                                Founded by Ms. Vidya Puthran, who cleared all core NCA subjects on her first attempt, our guidance is rooted in real success and deep expertise.
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal x={50} y={0} delay={0.5}>
                                    <div className="content-item">
                                        <div className="icon">
                                            <img src="/assets/img/icon/content-2.png" alt="icon" />
                                        </div>
                                        <div className="content">
                                            <h4 className="title">Why Students Trust Us</h4>
                                            <p>
                                                First-attempt success, personalized mentorship, comprehensive study materials,
                                                and 24/7 doubt-clearing support for every learner.
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FounderSection />

            <WhyChooseUsSection />

            {/* CTA Section */}
            <section className="cta-section pt-140 pb-140">
                <div className="cta-bg-img">
                    <img src="/assets/img/bg-img/cta-bg-img.png" alt="cta" />
                </div>

                <div className="shapes">
                    <div className="shape-1">
                        <img src="/assets/img/shapes/dot-shape.png" alt="shape" />
                    </div>
                    <div className="shape-2">
                        <img src="/assets/img/shapes/cta-shape-2.png" alt="shape" />
                    </div>
                </div>

                <div className="container">
                    <div className="cta-content">
                        <Reveal scale={0.8} duration={0.8} delay={0.1}>
                            <h2 className="title">Ontario Bar & NCA Bundle Offers</h2>
                        </Reveal>

                        <Reveal x={100} delay={0.2} duration={1}>
                            <p>
                                Solicitior (4 subjects) at <strong>$900 CAD</strong> and Barrister (5 subjects) at
                                <strong> $1,000 CAD</strong>. Get all 6 NCA subjects together for just
                                <strong> $1,500 CAD</strong> and save $300.
                            </p>
                        </Reveal>

                        <Reveal y={50} delay={0.3}>
                            <div className="cta-btn-wrap">
                                <Link href="/contact" className="ed-primary-btn cta-btn">
                                    Enroll Now <ArrowRight size={16} className="ml-2" />
                                </Link>
                                <Link href="/contact" className="ed-primary-btn cta-btn-2">
                                    View Details <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
