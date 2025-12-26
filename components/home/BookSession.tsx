"use client";

import React, { useState } from "react";
import {
    Calendar,
    Clock,
    CreditCard,
    User,
    Mail,
    MapPin,
    Globe,
    Zap,
    CheckCircle2
} from "lucide-react";
import Reveal from "@/components/animations/Reveal";

export default function PromoSection() {
    const [selectedSession, setSelectedSession] = useState<string>('nca-assessment');

    const sessionTypes = [
        {
            id: 'nca-assessment',
            title: "NCA Assessment Process Guidance",
            desc: "Get expert guidance on the NCA assessment process",
            duration: "30 mins",
            price: "10 CAD"
        },
        {
            id: 'nca-exam-prep',
            title: "NCA Exam Preparation Guidance",
            desc: "Personalized exam preparation strategies",
            duration: "30 mins",
            price: "10 CAD"
        },
        {
            id: 'teaching',
            title: "Teaching / Answer Writing",
            desc: "One-on-one teaching session on any topic or answer writing guidance",
            duration: "1 hour",
            price: "50 CAD"
        }
    ];

    return (
        <section className="promo-section pt-120 pb-120 overflow-hidden bg-primary relative">
            <div className="bg-item">
                <div className="bg-shape-1"></div>
                <div className="bg-shape-2"></div>
            </div>
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <Reveal y={-20} delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider mb-4 backdrop-blur-sm border border-white/20">
                            <Zap size={14} className="fill-current" />
                            <span>1:1 Sessions</span>
                        </div>
                    </Reveal>
                    <Reveal scale={0.9} delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Book a Personal Session
                        </h2>
                    </Reveal>
                    <Reveal y={20} delay={0.3}>
                        <p className="text-white/80 max-w-2xl mx-auto text-lg">
                            Get personalized guidance from our experts. Select your preferred session type and fill in your details.
                        </p>
                    </Reveal>
                </div>

                <div className="row gy-5">
                    {/* Left Column - Session Selection */}
                    <div className="col-lg-5">
                        <Reveal x={-30} delay={0.2}>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                                <Calendar className="text-white" /> Select Session Type
                            </h3>
                            <div className="space-y-4">
                                {sessionTypes.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => setSelectedSession(session.id)}
                                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative ${selectedSession === session.id
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                            : 'bg-white border-transparent hover:border-blue-300 text-foreground'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-bold text-lg pr-8 ${selectedSession === session.id ? 'text-white' : 'text-foreground'}`}>
                                                {session.title}
                                            </h4>
                                            {selectedSession === session.id && (
                                                <CheckCircle2 className="text-white absolute top-6 right-6" size={24} />
                                            )}
                                        </div>
                                        <p className={`text-sm mb-4 ${selectedSession === session.id ? 'text-white/90' : 'text-muted-foreground'}`}>
                                            {session.desc}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm font-medium">
                                            <div className={`flex items-center gap-1.5 ${selectedSession === session.id ? 'text-white' : 'text-primary'}`}>
                                                <Clock size={16} />
                                                {session.duration}
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${selectedSession === session.id ? 'text-white' : 'text-foreground'}`}>
                                                <CreditCard size={16} />
                                                {session.price}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="col-lg-7 pl-lg-5">
                        <Reveal x={30} delay={0.4}>
                            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-white/20">
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-primary">
                                    <User className="text-primary" /> Your Details
                                </h3>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Full Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="text" placeholder="Enter your full name" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">WhatsApp Number <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="tel" placeholder="+1 234 567 8900" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Email ID <span className="text-xs text-muted-foreground">(for materials)</span> <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Gmail ID <span className="text-xs text-muted-foreground">(for videos)</span> <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="email" placeholder="your@gmail.com" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Province/State <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="text" placeholder="Ontario" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Country <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input type="text" placeholder="Canada" className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-primary/25 text-lg">
                                            Submit Booking Request
                                        </button>
                                        <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                                            <Zap size={14} className="text-primary fill-current" />
                                            We'll contact you via WhatsApp to confirm timing.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
