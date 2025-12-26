'use client';

import { Zap, CheckCircle } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export default function WhyChooseUsSection() {
    const features = [
        {
            title: "Comprehensive Content",
            desc: "Access hundreds of NCA and Bar exam specific modules designed for your success.",
            delay: 0.1
        },
        {
            title: "Expert Mentorship",
            desc: "Learn from qualified lawyers who have successfully navigated the NCA process themselves.",
            delay: 0.3
        },
        {
            title: "Lifetime Access",
            desc: "Study at your own pace with unlimited access to course materials and updates.",
            delay: 0.5
        }
    ];

    return (
        <section className="why-choose-us-section pt-120 pb-140 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-28 relative z-10">
                    <Reveal y={-20} delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border text-primary font-medium text-sm mb-6">
                            <Zap size={16} className="fill-current" />
                            <span>Reason to Choose</span>
                        </div>
                    </Reveal>
                    <Reveal scale={0.9} delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                            Why Choose Us!
                        </h2>
                    </Reveal>
                </div>

                {/* Timeline & Cards Layout */}
                <div className="relative">
                    {/* Horizontal Connecting Line (Desktop only) */}
                    <div className="hidden lg:block absolute top-2 left-[16.66%] right-[16.66%] h-0.5 bg-primary/30 z-0"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        {features.map((item, index) => (
                            <div key={index} className={`flex flex-col items-center ${index === 1 ? 'lg:mt-24' : ''}`}>
                                {/* Timeline Dot & Line (Desktop) */}
                                <div className="hidden lg:flex flex-col items-center w-full mb-12 relative">
                                    <div className="w-5 h-5 rounded-full border-4 border-white bg-primary shadow-sm z-10 relative"></div>
                                    <div className={`w-0.5 bg-primary/30 ${index === 1 ? 'h-24' : 'h-12'}`}></div>
                                </div>

                                {/* Card */}
                                <Reveal y={30} delay={item.delay} className="w-full">
                                    <div className="bg-white p-10 rounded-2xl shadow-lg border border-border/40 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm mx-auto h-full min-h-[200px] flex flex-col justify-center">
                                        <div className="flex gap-4">
                                            <div className="shrink-0 text-primary p-3">
                                                <CheckCircle size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
