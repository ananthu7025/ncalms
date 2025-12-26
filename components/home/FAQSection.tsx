'use client';

import { useState } from 'react';
import { Play, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const faqs = [
        {
            question: "What is the NCA assessment process?",
            answer: "The NCA assessment evaluates your legal education and professional experience to determine what additional studies you need to practice law in Canada. Our platform guides you through every specific subject required."
        },
        {
            question: "Are the courses self-paced or live?",
            answer: "We offer a hybrid model. Major core content is available as high-quality on-demand video lectures you can watch anytime, supplemented by scheduled live Q&A sessions with mentors."
        },
        {
            question: "Will I receive mentorship support?",
            answer: "Yes! Every student gets access to our mentorship program where qualified Canadian lawyers provide guidance on exam strategies, career planning, and difficult legal concepts."
        },
        {
            question: "Can I access the platform on mobile devices?",
            answer: "Absolutely. Our LMS is fully responsive, allowing you to watch lectures, read notes, and practice exam questions from your smartphone or tablet anywhere."
        }
    ];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section pt-120 pb-120 bg-background relative overflow-hidden">
            <div className="container">
                <div className="row align-items-center gy-5">
                    {/* Left Side - Image with Video Trigger */}
                    <div className="col-lg-6">
                        <Reveal x={-50} duration={1}>
                            <div className="relative rounded-[30px] overflow-hidden shadow-2xl group">
                                <img
                                    src="/assets/img/images/content-img-1.png"
                                    alt="Student Learning"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 z-10">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Play size={20} className="text-primary fill-current ml-1" />
                                            </div>
                                        </div>
                                        {/* Ripple Animation */}
                                        <div className="absolute top-0 left-0 w-20 h-20 bg-white/30 rounded-full animate-ping"></div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Side - FAQ Content */}
                    <div className="col-lg-6 pl-lg-5">
                        <div className="faq-content">
                            <Reveal y={-20} delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                                    <Zap size={16} className="fill-current" />
                                    <span className="text-sm font-semibold">Common Questions</span>
                                </div>
                            </Reveal>

                            <Reveal y={20} delay={0.2}>
                                <h2 className="text-4xl font-bold text-foreground mb-8">
                                    How to learn with <span className="text-primary">NCA LMS?</span>
                                </h2>
                            </Reveal>

                            <Reveal y={30} delay={0.3}>
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div
                                            key={index}
                                            className={`border-b border-border/60 ${openIndex === index ? 'pb-6' : 'pb-4'}`}
                                        >
                                            <button
                                                className="w-full flex items-center justify-between py-2 text-left bg-transparent border-0 focus:outline-none group"
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                <span className={`text-lg font-bold transition-colors duration-300 ${openIndex === index ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                                    {faq.question}
                                                </span>
                                                <span className={`ml-4 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}>
                                                    <ChevronDown size={20} />
                                                </span>
                                            </button>

                                            <div
                                                className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}
                                            >
                                                <div className="overflow-hidden">
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {isVideoPlaying && (
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={() => setIsVideoPlaying(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(false); }}
                            className="absolute top-4 right-4 text-white hover:text-primary z-50 bg-black/50 rounded-full p-2 transition-colors"
                        >
                            ✕
                        </button>
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="FAQ Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
}
