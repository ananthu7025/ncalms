/* eslint-disable @next/next/no-img-element */

import type { Metadata } from 'next';
import FAQ from "@/components/public/FAQ";
import Categories from "@/components/public/Catogories";
import Breadcrumb from "@/components/public/Breadcrumb";
import VideoSection from "@/components/public/VideoSection";
import WhyChooseUs from "@/components/public/WhyChooseSection";
import TestimonialSection from "@/components/public/Testimonial";
import WhyChooseUsContent from "@/components/public/WhyChooseUsContent";
import BlogSection from "@/components/public/BlogSection";
import AboutInstructors from "@/components/public/AboutInstructors";

export const metadata: Metadata = {
  title: 'About Us - NCA Made Easy | Expert NCA Exam Preparation',
  description: 'Learn about NCA Made Easy and our mission to help law students succeed in their NCA exams with expert guidance from Vidya and comprehensive study resources.',
  keywords: ['NCA Made Easy', 'about NCA courses', 'Vidya NCA', 'Canadian law education', 'NCA exam coaching'],
  openGraph: {
    title: 'About NCA Made Easy - Your Partner in NCA Success',
    description: 'Expert-led NCA exam preparation with personalized coaching and comprehensive resources',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ncamadeeasy.com'}/about`,
    siteName: 'NCA Made Easy',
    images: ['/assets/img/logo.jpeg'],
    locale: 'en_CA',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        title="About Us"
        items={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />
      <WhyChooseUsContent />
      <AboutInstructors />
      <Categories />
      <VideoSection />
      <WhyChooseUs/>
      <TestimonialSection />
      <FAQ />
      <BlogSection />
    </>
  );
}