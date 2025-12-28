/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import toaster from "@/lib/toaster";
import { getActiveSessionTypes, createPublicBooking } from "@/lib/actions/sessions";
import { createPublicSessionCheckout } from "@/lib/actions/checkout";
import type { SessionType } from "@/lib/db/schema";

const BookACallForm = () => {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gmail: "",
    province: "",
    country: "",
    whatsapp: "",
  });

  // Load session types on mount
  useEffect(() => {
    loadSessionTypes();
  }, []);

  const loadSessionTypes = async () => {
    setIsLoading(true);
    try {
      const result = await getActiveSessionTypes();

      if (result.success && result.data) {
        setSessionTypes(result.data);
        // Auto-select first session type if available
        if (result.data.length > 0) {
          setSelectedSession(result.data[0].id);
        }
      } else {
        toaster.error("Failed to load session types");
      }
    } catch (error) {
      toaster.error("Failed to load session types");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) {
      toaster.error("Please select a session type");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking using public action (no auth required)
      const bookingResult = await createPublicBooking({
        sessionTypeId: selectedSession,
        fullName: formData.fullName,
        email: formData.email,
        gmail: formData.gmail || "",
        whatsapp: formData.whatsapp || "",
        province: formData.province || "",
        country: formData.country || "",
      });

      if (!bookingResult.success || !bookingResult.data) {
        toaster.error(bookingResult.error || "Failed to create booking");
        setIsSubmitting(false);
        return;
      }

      // Create Stripe checkout session using public action
      const checkoutResult = await createPublicSessionCheckout(bookingResult.data.id);

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-colorBlackPearl/65">Loading session types...</p>
        </div>
      </div>
    );
  }

  if (sessionTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-colorBlackPearl/65">No session types available at the moment. Please check back later.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-10">
        {/* Session Type Dropdown */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <select
              name="sessionType"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all text-colorBlackPearl focus-visible:border-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select Session Type
              </option>
              {sessionTypes.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} ({session.duration} mins - ${session.price} CAD)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Full Name */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="text"
              placeholder="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Email ID */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="email"
              placeholder="Email ID (for materials)"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Gmail ID */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="email"
              placeholder="Gmail ID (for YouTube recordings - optional)"
              name="gmail"
              value={formData.gmail}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Province/State and Country */}
        <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
          <div className="w-full">
            <input
              type="text"
              placeholder="Province/State (optional)"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Country (optional)"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="tel"
              placeholder="WhatsApp Number (optional)"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Info Message */}
      <p className="mt-6 text-sm text-[#8D8D8D]">
        We&apos;ll contact you via WhatsApp to confirm timing and share the Zoom meeting link.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary is-icon group mt-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Submit Booking Request"}
        {!isSubmitting && (
          <>
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
          </>
        )}
      </button>
    </form>
  );
};

export default BookACallForm;
