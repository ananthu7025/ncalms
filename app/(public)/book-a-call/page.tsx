/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/public/Breadcrumb";
import BookACallForm from "@/components/public/BookACallForm";
import toaster from "@/lib/toaster";

export default function BookACallPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if booking was cancelled
    if (searchParams?.get('cancelled') === 'true') {
      toaster.error("Booking payment was cancelled. Please try again.");
    }
  }, [searchParams]);

  return (
    <>
      <Breadcrumb
        title="Book a Personal Session"
        items={[
          { label: "Home", href: "/" },
          { label: "1:1 Sessions" },
        ]}
      />

      <section className="section-booking">
        <div className="bg-white pb-44">
          <div className="section-space-bottom">
            <div className="container">
              <div className="grid grid-cols-1 items-center gap-10 md:gap-[60px] lg:grid-cols-2 xl:grid-cols-[1fr_minmax(0,0.7fr)] xl:gap-[90px]">
                <div data-aos="fade-left">
                  <img
                    src="/assets/img/images/th-1/contact-form-img.jpg"
                    alt="booking-form-img"
                    width="619"
                    height="620"
                    className="mx-auto max-w-full rounded-lg"
                  />
                </div>
                <div data-aos="fade-right">
                  <div className="mb-10 lg:mb-[60px]">
                    <div className="mx-auto max-w-2xl">
                      <span className="mb-5 block uppercase">1:1 SESSIONS</span>
                      <h2>Book a Personal Session</h2>
                      <p className="mt-4 text-colorBlackPearl/65">
                        Get personalized guidance from our experts. Select your preferred session type and fill in your details.
                      </p>
                    </div>
                  </div>
                  <BookACallForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}