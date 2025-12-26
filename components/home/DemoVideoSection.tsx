'use client';

import { Play, Phone, Zap, Users, BookOpen } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';
import { useState } from 'react';
import Link from 'next/link';

export default function DemoVideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="demo-video-section pt-120 pb-120 relative overflow-hidden bg-background">
            <div className="container">
                <div className="row align-items-center gy-5">
                    {/* Left Side - Images & Support Badge */}
                    <div className="col-lg-6 relative">
                        <div className="relative z-10">
                            <div className="row g-4">
                                <div className="col-8">
                                    <Reveal x={-30} delay={0.1}>
                                        <div className="relative rounded-[40px_0_40px_0] overflow-hidden border-4 border-white shadow-xl h-full">
                                            <img
                                                src="/assets/img/images/content-img-1.png"
                                                alt="NCA Student"
                                                className="w-full h-[400px] object-cover"
                                            />
                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110">
                                                    <Play size={24} className="text-primary fill-current ml-1" />
                                                </div>
                                                <div className="absolute w-16 h-16 bg-white/30 rounded-full animate-ping pointer-events-none"></div>
                                            </div>
                                        </div>
                                    </Reveal>
                                </div>
                                <div className="col-4 self-end">
                                    <Reveal y={30} delay={0.2}>
                                        <div className="rounded-[0_40px_0_40px] overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src="/assets/img/images/content-img-2.png"
                                                alt="Library"
                                                className="w-full h-[250px] object-cover"
                                            />
                                        </div>
                                    </Reveal>
                                </div>
                            </div>

                            {/* Online Support Badge */}
                            <Reveal y={20} delay={0.3}>
                                <div className="absolute -bottom-6 left-0 sm:left-10 bg-primary text-white p-4 rounded-[20px_20px_20px_0] shadow-xl flex items-center gap-3 max-w-[250px] z-20">
                                    <div className="bg-white/20 p-2.5 rounded-full">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-90 font-medium uppercase tracking-wide">Online Support</div>
                                        <div className="font-bold text-lg">+01 569 896 654</div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="col-lg-6 pl-lg-5">
                        <div className="content-wrapper">
                            <Reveal y={-20} delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                                    <Zap size={16} />
                                    <span className="text-sm font-semibold">Get More About Us</span>
                                </div>
                            </Reveal>

                            <Reveal y={20} delay={0.2}>
                                <h2 className="section-title text-4xl font-bold mb-6 text-foreground leading-tight">
                                    Over 10 Years in <br />
                                    <span className="text-primary">Distance Learning</span> for <br />
                                    NCA Skill Development
                                </h2>
                            </Reveal>

                            <Reveal y={20} delay={0.3}>
                                <p className="text-muted-foreground mb-8 text-lg">
                                    Compellingly procrastinate equity invested markets with efficient process improvements. Actualize mission-critical partnerships with integrated portals.
                                </p>
                            </Reveal>

                            <Reveal y={20} delay={0.4}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Users size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground">9.5k+</h3>
                                            <p className="text-sm text-muted-foreground">Total active students taking gifted courses</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <BookOpen size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground">6.7k+</h3>
                                            <p className="text-sm text-muted-foreground">Total active students taking gifted courses</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>


                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {isPlaying && (
                <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 overflow-hidden" onClick={() => setIsPlaying(false)}>
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                            className="absolute top-4 right-4 text-white hover:text-primary z-50 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
                        >
                            <span className="text-2xl font-bold px-1">✕</span>
                        </button>
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="Demo Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
}
