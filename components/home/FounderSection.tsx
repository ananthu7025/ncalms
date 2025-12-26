'use client';

import React from 'react';
import Reveal from '@/components/animations/Reveal';
import { Quote } from 'lucide-react';

export default function FounderSection() {
    return (
        <section className="founder-section py-20 bg-blue-50/50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Reveal y={-20}>
                        <div className="flex justify-center mb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <Quote size={40} className="text-blue-600" />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal y={20} delay={0.1}>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                            Founder's Spotlight
                        </h2>
                    </Reveal>

                    <Reveal y={20} delay={0.2}>
                        <div className="relative">
                            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                                "Ms. Vidya Puthran, founder of NCA MADE EASY, exemplifies our commitment to excellence. Having successfully passed all core NCA subjects on her first attempt, Vidya brings unparalleled expertise in Canadian legal studies and a passion for mentoring aspiring lawyers to achieve their goals."
                            </p>
                        </div>
                    </Reveal>

                    <Reveal y={20} delay={0.3}>
                        <div className="border-t border-gray-200 w-24 mx-auto my-6"></div>
                        <div className="text-gray-900 font-bold text-lg">
                            Ms. Vidya Puthran
                        </div>
                        <div className="text-blue-600 font-medium text-sm tracking-wide mt-1">
                            FOUNDER, NCA MADE EASY
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
