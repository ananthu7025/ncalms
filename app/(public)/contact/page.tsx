/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/public/Breadcrumb';
import { createPublicContactTicket } from '@/lib/actions/support';
import { toast } from 'sonner';
import InputText from '@/components/InputComponents/InputText';
import InputTextarea from '@/components/InputComponents/InputTextarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  // Initialize react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    if (!agreeToPolicy) {
      toast.error('Please agree to the Privacy Policy');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPublicContactTicket({
        name: data.name,
        email: data.email,
        subject: data.subject || 'General Inquiry',
        message: data.message,
        category: 'question'
      });

      if (result.success) {
        toast.success('Your message has been sent! We will get back to you soon.');
        form.reset();
        setAgreeToPolicy(false);
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <Breadcrumb
        title="Contact With Us"
        items={[
          { label: 'HOME', href: '/' },
          { label: 'Contact With Us' }
        ]}
      />
      <section className="section-contact">
        <div className="bg-white pb-44">
          <div className="section-space-bottom">
            <div className="container">
              <div className="grid grid-cols-1 items-center gap-10 md:gap-[60px] lg:grid-cols-2 xl:grid-cols-[1fr_minmax(0,0.7fr)] xl:gap-[90px]">
                <div data-aos="fade-left">
                  <img
                    src="/assets/img/images/th-1/contact-form-img.jpg"
                    alt="contact-form-img"
                    width="619"
                    height="620"
                    className="mx-auto max-w-full rounded-lg"
                  />
                </div>
                <div data-aos="fade-right">
                  <div className="mb-10 lg:mb-[60px]">
                    <div className="mx-auto max-w-2xl">
                      <span className="mb-5 block uppercase">CONTACT US</span>
                      <h2>Have questions? Contact with us today</h2>
                    </div>
                  </div>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Full Name */}
                    <InputText
                      hookForm={form}
                      field="name"
                      label="Full Name"
                      labelMandatory
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                    />

                    {/* Email */}
                    <InputText
                      hookForm={form}
                      field="email"
                      label="Email Address"
                      labelMandatory
                      type="email"
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />

                    {/* Subject */}
                    <InputText
                      hookForm={form}
                      field="subject"
                      label="Subject"
                      placeholder="What is this about? (Optional)"
                      disabled={isSubmitting}
                    />

                    {/* Message */}
                    <InputTextarea
                      hookForm={form}
                      field="message"
                      label="Message"
                      labelMandatory
                      placeholder="How can we help you? Feel free to get in touch!"
                      rows={5}
                      disabled={isSubmitting}
                    />

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy-policy"
                        checked={agreeToPolicy}
                        onCheckedChange={(checked) => setAgreeToPolicy(checked as boolean)}
                        disabled={isSubmitting}
                      />
                      <Label
                        htmlFor="privacy-policy"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        I agree to the Privacy Policy <span className="text-destructive">*</span>
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary is-icon group mt-[10px]"
                      disabled={isSubmitting || !agreeToPolicy}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Your Message'}
                      <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                        <img
                          src="/assets/img/icons/icon-purple-arrow-right.svg"
                          alt="icon-purple-arrow-right.svg"
                          width="13"
                          height="12"
                        />
                      </span>
                      <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                        <img
                          src="/assets/img/icons/icon-purple-arrow-right.svg"
                          alt="icon-purple-arrow-right.svg"
                          width="13"
                          height="12"
                        />
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
