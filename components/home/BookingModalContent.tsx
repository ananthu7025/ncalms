"use client";

import React, { useState } from "react";
import {
    Calendar,
    Clock,
    CreditCard,
    User,
    Zap,
    CheckCircle2
} from "lucide-react";
import Reveal from "@/components/animations/Reveal";

export default function BookingModalContent() {
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
        <div className="booking-modal-content bg-primary/5 p-4 md:p-6 rounded-lg overflow-hidden">

            <div className="container-fluid px-0">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/10 text-blue-600 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-200">
                        <Zap size={14} className="fill-current" />
                        <span>1:1 Sessions</span>
                    </div>
                    <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-2">
                        Book a Personal Session
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
                        Get personalized guidance from our experts. Select your preferred session type and fill in your details.
                    </p>
                </div>

                <div className="row gy-4">
                    {/* Left Column - Session Selection */}
                    <div className="col-lg-5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <Calendar className="text-blue-600" size={20} /> Select Session Type
                        </h3>
                        <div className="space-y-3">
                            {sessionTypes.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => setSelectedSession(session.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${selectedSession === session.id
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                        : 'bg-white border-gray-100 hover:border-blue-300 text-gray-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-base pr-6 ${selectedSession === session.id ? 'text-white' : 'text-gray-900'}`}>
                                            {session.title}
                                        </h4>
                                        {selectedSession === session.id && (
                                            <CheckCircle2 className="text-white absolute top-4 right-4" size={18} />
                                        )}
                                    </div>
                                    <p className={`text-xs mb-3 ${selectedSession === session.id ? 'text-white/90' : 'text-gray-500'}`}>
                                        {session.desc}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <div className={`flex items-center gap-1 ${selectedSession === session.id ? 'text-white' : 'text-blue-600'}`}>
                                            <Clock size={14} />
                                            {session.duration}
                                        </div>
                                        <div className={`flex items-center gap-1 ${selectedSession === session.id ? 'text-white' : 'text-gray-700'}`}>
                                            <CreditCard size={14} />
                                            {session.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="col-lg-7">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-600">
                                <User className="text-blue-600" size={20} /> Your Details
                            </h3>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Enter your full name" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">WhatsApp Number <span className="text-red-500">*</span></label>
                                        <input type="tel" placeholder="+1 234 567 8900" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Email ID <span className="text-[10px] text-gray-400 font-normal">(materials)</span> <span className="text-red-500">*</span></label>
                                        <input type="email" placeholder="your@email.com" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Gmail ID <span className="text-[10px] text-gray-400 font-normal">(videos)</span> <span className="text-red-500">*</span></label>
                                        <input type="email" placeholder="your@gmail.com" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Province/State <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Ontario" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="Canada" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-sm" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 text-base">
                                        Submit Booking Request
                                    </button>
                                    <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5">
                                        <Zap size={12} className="text-blue-600 fill-current" />
                                        We'll contact you via WhatsApp to confirm timing.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
