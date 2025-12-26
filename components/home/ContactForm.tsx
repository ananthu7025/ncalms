/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { createPublicContactTicket } from '@/lib/actions/support';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputText from '@/components/InputComponents/InputText';
import InputSelect from '@/components/InputComponents/InputSelect';
import InputTextarea from '@/components/InputComponents/InputTextarea';

interface ContactFormValues {
    fullname: string;
    email: string;
    subject: string;
    message: string;
}

const contactFormSchema = yup.object().shape({
    fullname: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required'),
});

const subjectOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Course Information', label: 'Course Information' },
    { value: 'Technical Issue', label: 'Technical Issue' },
    { value: 'Feedback', label: 'Feedback' },
    { value: 'Refund Request', label: 'Refund Request' },
    { value: 'Other', label: 'Other' },
];

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const hookForm = useForm<ContactFormValues>({
        resolver: yupResolver(contactFormSchema),
        defaultValues: {
            fullname: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const { handleSubmit, reset } = hookForm;

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);

        try {
            const result = await createPublicContactTicket({
                name: data.fullname,
                email: data.email,
                subject: data.subject,
                message: data.message,
                category: data.subject === 'Technical Issue' ? 'issue'
                    : data.subject === 'Feedback' ? 'feedback'
                    : data.subject === 'Refund Request' ? 'refund'
                    : 'question'
            });

            if (result.success) {
                setIsSubmitted(true);
                toast.success('Message sent successfully! We\'ll get back to you soon.');
                reset();

                // Reset success message after 5 seconds
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                toast.error(result.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="blog-contact-form contact-form bg-white p-4 p-md-5 rounded-4 shadow-lg border">
            {isSubmitted && (
                <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                    <CheckCircle className="me-2" size={18} />
                    <div className="small">Your message has been sent successfully!</div>
                </div>
            )}

            <h2 className="h3 fw-bold text-dark mb-2">Send Us a Message</h2>
            <p className="text-muted mb-3 small">Fill out the form below and we'll get back to you within 24 hours</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-2 mb-3">
                    {/* Name Field */}
                    <div className="col-md-6">
                        <InputText
                            hookForm={hookForm}
                            field="fullname"
                            label="Name"
                            placeholder="Your Name"
                            labelMandatory
                        />
                    </div>

                    {/* Email Field */}
                    <div className="col-md-6">
                        <InputText
                            hookForm={hookForm}
                            field="email"
                            label="Email"
                            type="email"
                            placeholder="Your Email"
                            labelMandatory
                        />
                    </div>
                </div>

                {/* Subject Field */}
                <div className="mb-3">
                    <InputSelect
                        hookForm={hookForm}
                        field="subject"
                        label="Subject"
                        options={subjectOptions}
                        placeholder="Select Subject"
                        labelMandatory
                    />
                </div>

                {/* Message Field */}
                <div className="mb-3">
                    <InputTextarea
                        hookForm={hookForm}
                        field="message"
                        label="Message"
                        rows={5}
                        placeholder="Your message here..."
                        labelMandatory
                        style={{ resize: 'none' }}
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary px-4 py-2 rounded-3 text-white fw-semibold shadow"
                        style={{ backgroundColor: '#2490eb', borderColor: '#2490eb' }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send size={16} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                                Submit Message
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
