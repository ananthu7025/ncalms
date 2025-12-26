"use client";

import React, { useState, useEffect } from "react";
import Reveal from "@/components/animations/Reveal";
import { ArrowRight, UserCheck, X } from "lucide-react";
import Modal from "react-modal";
import BookingModalContent from "./BookingModalContent";

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto" as const,
        padding: "20px",
    },
    content: {
        position: "relative" as const,
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        margin: "auto",
        transform: "none",
        border: "none",
        background: "transparent",
        padding: "0",
        maxWidth: "1200px",
        width: "100%",
        maxHeight: "none",
        overflow: "visible" as const,
        borderRadius: "16px",
        inset: "0",
    },
};

export default function CoachingSection() {
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Set the app element for accessibility
        // This assumes your root element has id 'root' or similar, standard in Next.js/React
        // If using Next.js App Router, body is often the root, or a specific div.
        // We'll try to set it to body to be safe or ignore if not found (warning only)
        if (typeof document !== 'undefined') {
            Modal.setAppElement('body');
        }
    }, []);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <section className="coaching-section pt-5 py-24 mt-4 mb-4 lg:py-32 overflow-hidden bg-white">
            <div className="container mx-auto px-4">
                <div className="row items-center gy-5">
                    {/* Content Column */}
                    <div className="col-lg-6 order-2 order-lg-1">
                        <div className="coaching-content pr-lg-5">
                            <Reveal x={-30} delay={0.1}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-8 border border-blue-100">
                                    <UserCheck size={14} />
                                    <span>Personalized Mentorship</span>
                                </div>
                            </Reveal>

                            <Reveal scale={0.9} delay={0.2}>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                                    1-1 Coaching <br />
                                    <span className="text-blue-600">Tailored to You</span>
                                </h2>
                            </Reveal>

                            <Reveal y={20} delay={0.3}>
                                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                    At NCA MADE EASY, we understand that each student’s journey is
                                    unique. To support your individual learning goals, we offer
                                    private tutoring on Demand.
                                </p>
                                <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                                    You can book Private Tutoring for a particular NCA Subject and
                                    get started with 1-1 Lectures, paper solving, doubt clearing
                                    etc., providing you an overall preparation to ace your NCA
                                    Exam.
                                </p>

                                <div className="alert bg-blue-50 border-l-4 border-blue-600 p-6 mb-12 rounded-r-lg">
                                    <p className="text-blue-800 font-medium text-lg">Limited Slots only - Filling Fast!</p>
                                </div>
                            </Reveal>

                            <Reveal y={20} delay={0.4}>
                                <button
                                    onClick={openModal}
                                    className="ed-primary-btn group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl py-4 px-8 text-lg"
                                >
                                    Request a Slot Now
                                    <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                            </Reveal>

                            <Modal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Booking Modal"
                            >
                                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                    <BookingModalContent />
                                </div>
                            </Modal>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="col-lg-6 order-1 order-lg-2">
                        <Reveal x={30} delay={0.2} duration={1}>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-600/10 border-8 border-white">
                                <img
                                    src="/assets/img/images/request-img-1.png"
                                    alt="Coaching"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
