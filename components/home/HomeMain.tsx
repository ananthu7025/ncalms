import Link from 'next/link';
import { X, MapPin, Phone, Mail, Zap, Search, ArrowRight, Star, Clock, Folder, Code, PenTool, BookOpen, PieChart, Cpu, Briefcase, CheckCircle, FileText, HelpCircle, Video, ClipboardList } from 'lucide-react';
import CourseItem from './CourseItem';
import Reveal from '@/components/animations/Reveal';
import { HeroSection } from './HeroSection';
import DemoVideoSection from './DemoVideoSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import FAQSection from './FAQSection';
import BlogSection from './BlogSection';
import FounderSection from './FounderSection';
import CoachingSection from './CoachingSection';
import { CoursesSection } from './CoursesSection';
import { getActiveSubjects } from '@/lib/actions/subjects';

export default async function HomeMain() {
    // Fetch real courses
    const result = await getActiveSubjects();
    const courses = result.success && result.data ? result.data : [];
    return (
        <main>
            <div id="popup-search-box">
                <div className="box-inner-wrap d-flex align-items-center">
                    <form id="form" action="#" method="get" role="search">
                        <input id="popup-search" type="text" name="s" placeholder="Type keywords here..." />
                    </form>
                    <div className="search-close"><X /></div>
                </div>
            </div>

            <div className="mobile-side-menu">
                <div className="side-menu-content">
                    <div className="side-menu-head">
                        <Link href="/"><img src="/assets/img/logo/logo-new.jpeg" alt="logo" /></Link>
                        <button className="mobile-side-menu-close"><X /></button>
                    </div>
                    <div className="side-menu-wrap"></div>
                    <ul className="side-menu-list">
                        <li><MapPin size={16} />Address : <span>Bangalore, India</span></li>
                        <li><Phone size={16} />Phone : <a href="tel:+918123283217">+91 81232 83217</a></li>
                        <li><Mail size={16} />Email : <a href="mailto:vidyahej999@gmail.com">vidyahej999@gmail.com</a></li>
                    </ul>
                </div>
            </div>
            <div className="mobile-side-menu-overlay"></div>

            <HeroSection />
            <section className="promo-section pt-120 pb-120 overflow-hidden">
                <div className="bg-item">
                    <div className="bg-shape-1"></div>
                    <div className="bg-shape-2"></div>
                </div>

                <div className="shapes">
                    <div className="shape shape-1">
                        <img src="/assets/img/shapes/promo-shape-1.png" alt="shape" />
                    </div>
                    <div className="shape shape-2">
                        <img src="/assets/img/shapes/promo-shape-2.png" alt="shape" />
                    </div>
                </div>

                <div className="container">
                    <div className="section-heading promo-heading text-center white-content">
                        <Reveal y={-30} delay={0.1}>
                            <h4 className="sub-heading">
                                <span className="heading-icon"><Zap size={16} /></span>
                                Customized Services & Resources
                            </h4>
                        </Reveal>

                        <Reveal scale={0.9} delay={0.2} duration={0.8}>
                            <h2 className="section-title">
                                Everything You Need to Excel in the NCA Exams
                            </h2>
                        </Reveal>
                    </div>

                    <div className="row category-wrap gy-lg-0 gy-5">
                        {[
                            {
                                icon: BookOpen,
                                title: "Legal Research Writing",
                                desc: "Personalized legal research and answer writing aligned with NCA exam requirements.",
                            },
                            {
                                icon: HelpCircle,
                                title: "Doubt Clearing Session",
                                desc: "One-on-one sessions to resolve doubts and strengthen conceptual clarity.",
                            },
                            {
                                icon: Video,
                                title: "Live Mock Exam",
                                desc: "Real exam simulation with expert evaluation and feedback.",
                            },
                            {
                                icon: Video,
                                title: "Recorded Lectures",
                                desc: "Expert-led recorded lectures covering all major NCA subjects.",
                            },
                            {
                                icon: FileText,
                                title: "Study Materials",
                                desc: "Structured notes, case law summaries, and exam-focused study content.",
                            },
                            {
                                icon: ClipboardList,
                                title: "Sample Question Papers with Answers",
                                desc: "Practice exam-style questions with detailed model answers.",
                            },
                        ].map((cat, i) => (
                            <div className="col-lg-4 col-md-6" key={i}>
                                <Reveal y={50} delay={0.2 + i * 0.1} className="h-100">
                                    <div className="category-item-2 white-content h-100">
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <cat.icon size={48} className="text-primary" />
                                        </div>

                                        <div className="content">
                                            <h3 className="title">
                                                <Link href="/course-details">{cat.title}</Link>
                                            </h3>

                                            <p>
                                                {cat.desc.split(".")[0]}
                                                <br />
                                                {cat.desc.split(".")[1]}
                                            </p>

                                            <Link href="/course-details" className="learn-more">
                                                Learn More <ArrowRight size={16} className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="feature-course pt-120 pb-120">
                <div className="container">

                    {/* Section Heading */}
                    <div className="section-heading text-center">
                        <Reveal y={-30} delay={0.1}>
                            <h4 className="sub-heading">
                                <span className="heading-icon"><Zap size={16} /></span>
                                Comprehensive Course Packages
                            </h4>
                        </Reveal>
                        <Reveal scale={0.8} delay={0.2} duration={0.8}>
                            <h2 className="section-title">
                                Expert Preparation for NCA & Ontario Bar Exams
                            </h2>
                        </Reveal>
                    </div>

                    {/* Tabs */}
                    <Reveal y={30} delay={0.3}>
                        <ul className="course-nav nav nav-tabs mb-40" id="myTab" role="tablist">
                            {[
                                { label: 'All Courses', id: 'home' },
                                { label: 'NCA Mandatory', id: 'profile' },
                                { label: 'NCA Featured', id: 'contact' },
                                { label: 'Solicitor Exam', id: 'contact-2' },
                                { label: 'Barrister Exam', id: 'contact-3' },
                                { label: 'IRAC Format', id: 'contact-4' },
                                { label: 'Essay Format', id: 'contact-5' },
                                { label: 'Coming Soon', id: 'contact-6' }
                            ].map((tab, i) => (
                                <li className="nav-item" role="presentation" key={i}>
                                    <button
                                        className={`nav-link ${i === 0 ? 'active' : ''}`}
                                        id={`${tab.id}-tab`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#${tab.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === 0}
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    {/* Tab Content */}
                    <div className="course-tab-content tab-content" id="myTabContent">

                        {/* ALL COURSES */}
                        <div className="tab-pane fade show active" id="home">
                            <CoursesSection courses={courses} />
                        </div>

                        {/* NCA MANDATORY */}
                        <div className="tab-pane fade" id="profile">
                            <div className="row gy-4 justify-content-center">
                                {[
                                    'Canadian Constitutional Law',
                                    'Canadian Administrative Law',
                                    'Canadian Criminal Law',
                                    'Foundations of Canadian Law',
                                    'Professional Responsibility'
                                ].map((title, i) => (
                                    <Reveal key={i} y={50} className="col-lg-4 col-md-6">
                                        <CourseItem
                                            image={`/assets/img/images/course-img-${(i % 3) + 1}.png`}
                                            category="NCA Mandatory"
                                            title={title}
                                            lessons="Exam Oriented"
                                            students="Core Subject"
                                            views="IRAC / Essay"
                                            authorImg={`/assets/img/images/course-author-${(i % 3) + 1}.png`}
                                            authorName="NCA Made Easy"
                                            price="$50 CAD"
                                        />
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* NCA FEATURED */}
                        <div className="tab-pane fade" id="contact">
                            <div className="row gy-4 justify-content-center">
                                {[
                                    'Canadian Property Law',
                                    'Torts Law',
                                    'Contracts Law',
                                    'Canadian Business Organization'
                                ].map((title, i) => (
                                    <Reveal key={i} y={50} className="col-lg-4 col-md-6">
                                        <CourseItem
                                            image={`/assets/img/images/course-img-${(i % 3) + 1}.png`}
                                            category="Featured"
                                            title={title}
                                            lessons="IRAC Based"
                                            students="Advanced"
                                            views="Practice Focused"
                                            authorImg={`/assets/img/images/course-author-${(i % 3) + 1}.png`}
                                            authorName="NCA Made Easy"
                                            price="$50 CAD"
                                        />
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* SOLICITOR EXAM */}
                        <div className="tab-pane fade" id="contact-2">
                            <div className="row gy-4 justify-content-center">
                                {[
                                    'Business Law',
                                    'Estate Planning',
                                    'Real Estate Law',
                                    'Professional Responsibility'
                                ].map((title, i) => (
                                    <Reveal key={i} y={50} className="col-lg-4 col-md-6">
                                        <CourseItem
                                            image={`/assets/img/images/course-img-${(i % 3) + 1}.png`}
                                            category={i < 2 ? '✓ Available' : 'Coming Soon'}
                                            title={title}
                                            lessons="Solicitor Exam"
                                            students="Ontario Bar"
                                            views="Transactional Law"
                                            authorImg={`/assets/img/images/course-author-${(i % 3) + 1}.png`}
                                            authorName="Ontario Bar Prep"
                                            price={i < 2 ? '$50 CAD' : 'Coming Soon'}
                                        />
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* BARRISTER EXAM */}
                        <div className="tab-pane fade" id="contact-3">
                            <div className="row gy-4 justify-content-center">
                                {[
                                    'Civil Litigation',
                                    'Criminal Law',
                                    'Family Law',
                                    'Public Law',
                                    'Professional Responsibility'
                                ].map((title, i) => (
                                    <Reveal key={i} y={50} className="col-lg-4 col-md-6">
                                        <CourseItem
                                            image={`/assets/img/images/course-img-${(i % 3) + 1}.png`}
                                            category="Coming Soon"
                                            title={title}
                                            lessons="Barrister Exam"
                                            students="Litigation"
                                            views="Court Practice"
                                            authorImg={`/assets/img/images/course-author-${(i % 3) + 1}.png`}
                                            authorName="Ontario Bar Prep"
                                            price="Coming Soon"
                                        />
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <CoachingSection />

            <section className="cta-section pt-140 pb-140">
                <div className="cta-bg-img">
                </div>

                <div className="shapes">
                    <div className="shape-1">
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

            <section className="content-section pt-120 pb-120 overflow-hidden">
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

                        <div className="col-lg-6">
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

            <DemoVideoSection />

            <WhyChooseUsSection />

            <FAQSection />


            <section
                className="request-section"
                style={{ backgroundImage: "url('/assets/img/bg-img/request-bg.png')" }}
            >
                <div
                    className="bg-img"
                    style={{ backgroundImage: "url('/assets/img/images/request-img-1.png')" }}
                ></div>

                <div className="shape">
                    <img src="/assets/img/shapes/req-shape-1.html" alt="shape" />
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-6"></div>

                        <div className="col-xl-6 col-lg-12">
                            <div className="request-content white-content pt-120 pb-120">
                                <div className="section-heading white-content mb-20">
                                    <Reveal y={-20} delay={0.1}>
                                        <h4 className="sub-heading">
                                            <span className="heading-icon"><Zap size={16} /></span>
                                            Limited Time Offer
                                        </h4>
                                    </Reveal>

                                    <Reveal x={50} delay={0.2}>
                                        <h2 className="section-title">
                                            Ready to Begin Your <br />
                                            Legal Career Journey?
                                        </h2>
                                    </Reveal>
                                </div>

                                <Reveal x={50} delay={0.3}>
                                    <p className="desc mb-20">
                                        Join thousands of successful NCA candidates. Get access to
                                        comprehensive study materials, expert mentorship, and proven
                                        strategies designed to help you succeed.
                                    </p>
                                </Reveal>

                                <Reveal y={50} delay={0.4}>
                                    <div className="request-form-wrapper">
                                        <form action="#">
                                            <div className="form-items">
                                                <div className="form-item">
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control"
                                                        placeholder="Your Name"
                                                    />
                                                </div>
                                                <div className="form-item">
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </Reveal>

                                <Reveal y={20} delay={0.5}>
                                    <div className="request-btn">
                                        <button className="ed-primary-btn">Start Learning Today</button>
                                    </div>
                                </Reveal>

                                <Reveal y={20} delay={0.6}>
                                    <ul className="mt-20">
                                        <li>✓ 30-day money back guarantee</li>
                                        <li>✓ Lifetime access to materials</li>
                                        <li>✓ 24/7 support</li>
                                    </ul>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}
