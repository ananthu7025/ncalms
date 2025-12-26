"use client";

import React, { useState, useEffect } from "react";
import {
    Clock,
    CreditCard,
    Zap,
    CheckCircle2,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toaster from "@/lib/toaster";
import { getActiveSessionTypes, createBooking } from "@/lib/actions/sessions";
import { createSessionCheckout } from "@/lib/actions/checkout";
import { useSession } from "next-auth/react";
import type { SessionType } from "@/lib/db/schema";

// Form validation schema
const bookingFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    gmail: z.union([z.string().email("Invalid email address"), z.literal("")]).optional(),
    whatsapp: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingModalContent() {
    const { data: session } = useSession();
    const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
    const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        setValue,
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            gmail: "",
            whatsapp: "",
            province: "",
            country: "",
        },
    });

    useEffect(() => {
        loadSessionTypes();
    }, []);

    useEffect(() => {
        // Pre-fill form with user data
        if (session?.user) {
            setValue("fullName", session.user.name || "");
            setValue("email", session.user.email || "");
        }
    }, [session, setValue]);

    const loadSessionTypes = async () => {
        setIsLoading(true);
        try {
            const result = await getActiveSessionTypes();
            if (result.success && result.data) {
                setSessionTypes(result.data);
                // Auto-select first session type if available
                if (result.data.length > 0 && !selectedSessionType) {
                    setSelectedSessionType(result.data[0]);
                }
            }
        } catch (error) {
            toaster.error("Failed to load session types");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: BookingFormData) => {
        if (!selectedSessionType) {
            toaster.error("Please select a session type");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create booking
            const bookingResult = await createBooking({
                sessionTypeId: selectedSessionType.id,
                fullName: data.fullName,
                email: data.email,
                gmail: data.gmail || "",
                whatsapp: data.whatsapp || "",
                province: data.province || "",
                country: data.country || "",
            });

            if (!bookingResult.success || !bookingResult.data) {
                toaster.error(bookingResult.error || "Failed to create booking");
                setIsSubmitting(false);
                return;
            }

            // Create Stripe checkout session
            const checkoutResult = await createSessionCheckout(bookingResult.data.id);

            if (!checkoutResult.success || !checkoutResult.checkoutUrl) {
                toaster.error(checkoutResult.error || "Failed to create checkout session");
                setIsSubmitting(false);
                return;
            }

            // Redirect to Stripe checkout
            window.location.href = checkoutResult.checkoutUrl;
        } catch (error) {
            toaster.error("An error occurred while booking");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{
                background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
                padding: '32px',
                borderRadius: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
                    <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#2563eb' }} />
                </div>
            </div>
        );
    }

    if (sessionTypes.length === 0) {
        return (
            <div style={{
                background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
                padding: '32px',
                borderRadius: '16px'
            }}>
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <p style={{ color: '#4b5563' }}>No session types available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
            padding: '16px',
            borderRadius: '16px'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px',
                    border: '1px solid #bfdbfe'
                }}>
                    <Zap size={14} style={{ fill: 'currentColor' }} />
                    <span>1:1 Sessions</span>
                </div>
                <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                    Book a Personal Session
                </h2>
                <p style={{ color: '#4b5563', maxWidth: '672px', margin: '0 auto', fontSize: '15px' }}>
                    Get personalized guidance from our experts. Select your preferred session type and fill in your details.
                </p>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-2">
                {/* Session Selection - Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sessionTypes.map((sessionType) => (
                        <div
                            key={sessionType.id}
                            onClick={() => setSelectedSessionType(sessionType)}
                            style={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: selectedSessionType?.id === sessionType.id
                                    ? '2px solid #2563eb'
                                    : '2px solid #e5e7eb',
                                background: selectedSessionType?.id === sessionType.id
                                    ? '#ffffff'
                                    : 'rgba(255, 255, 255, 0.8)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: selectedSessionType?.id === sessionType.id
                                    ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                                    : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                transform: selectedSessionType?.id === sessionType.id ? 'scale(1.02)' : 'scale(1)',
                            }}
                            onMouseEnter={(e) => {
                                if (selectedSessionType?.id !== sessionType.id) {
                                    e.currentTarget.style.borderColor = '#93c5fd';
                                    e.currentTarget.style.transform = 'scale(1.01)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedSessionType?.id !== sessionType.id) {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '18px', lineHeight: 1.4, flex: 1 }}>
                                    {sessionType.title}
                                </h3>
                                {selectedSessionType?.id === sessionType.id && (
                                    <div style={{
                                        padding: '4px',
                                        background: '#2563eb',
                                        borderRadius: '9999px',
                                        flexShrink: 0
                                    }}>
                                        <CheckCircle2 style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                                    </div>
                                )}
                            </div>
                            {sessionType.description && (
                                <p style={{
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    marginBottom: '12px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {sessionType.description}
                                </p>
                            )}

                            <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '12px' }}></div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                                    <Clock style={{ width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{sessionType.duration} mins</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#2563eb' }}>${sessionType.price}</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>CAD</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking Form - Right Column */}
                <div style={{
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    background: '#ffffff',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: '24px'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                            Contact Information
                        </h3>
                        <p style={{ fontSize: '14px', color: '#4b5563' }}>
                            Please provide your details so we can get in touch with you
                        </p>
                    </div>

                    <form onSubmit={handleFormSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }} className="md:grid-cols-2">
                            {/* Full Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("fullName")}
                                    placeholder="Enter your full name"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: errors.fullName ? '1px solid #ef4444' : '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = errors.fullName ? '#ef4444' : '#d1d5db'}
                                />
                                {errors.fullName && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="your.email@example.com"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db'}
                                />
                                {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
                            </div>

                            {/* Gmail */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Gmail
                                </label>
                                <input
                                    type="email"
                                    {...register("gmail")}
                                    placeholder="your.name@gmail.com"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    {...register("whatsapp")}
                                    placeholder="+1 (234) 567-8900"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            {/* Province */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Province/State
                                </label>
                                <input
                                    type="text"
                                    {...register("province")}
                                    placeholder="e.g., Ontario"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Country
                                </label>
                                <input
                                    type="text"
                                    {...register("country")}
                                    placeholder="e.g., Canada"
                                    style={{
                                        width: '100%',
                                        height: '44px',
                                        padding: '0 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>
                        </div>

                        {/* Selected Session Summary */}
                        {selectedSessionType && (
                            <div style={{
                                background: '#eff6ff',
                                borderRadius: '8px',
                                padding: '16px',
                                border: '1px solid #bfdbfe'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            Selected Session
                                        </p>
                                        <p style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                                            {selectedSessionType.title}
                                        </p>
                                        <p style={{ fontSize: '14px', color: '#4b5563' }}>
                                            {selectedSessionType.duration} minutes
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            Total Amount
                                        </p>
                                        <p style={{ fontSize: '30px', fontWeight: 700, color: '#2563eb', lineHeight: 1 }}>
                                            ${selectedSessionType.price}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>CAD</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedSessionType}
                                style={{
                                    width: '100%',
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    background: isSubmitting || !selectedSessionType ? '#9ca3af' : '#2563eb',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: isSubmitting || !selectedSessionType ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSubmitting && selectedSessionType) {
                                        e.currentTarget.style.background = '#1d4ed8';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSubmitting && selectedSessionType) {
                                        e.currentTarget.style.background = '#2563eb';
                                    }
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard style={{ width: '20px', height: '20px' }} />
                                        Proceed to Secure Payment
                                        <ArrowRight style={{ width: '20px', height: '20px' }} />
                                    </>
                                )}
                            </button>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: '#4b5563',
                                marginTop: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '9999px' }}></div>
                                    <span>Secure Payment</span>
                                </div>
                                <span>•</span>
                                <span>Powered by Stripe</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                @media (min-width: 1024px) {
                    .lg\\:grid-cols-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }
                @media (min-width: 768px) {
                    .md\\:grid-cols-2 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }
            `}</style>
        </div>
    );
}
