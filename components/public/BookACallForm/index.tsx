/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
}

const sessionTypes: SessionType[] = [
  {
    id: "nca-assessment",
    title: "NCA Assessment Process Guidance (30 mins - 10 CAD)",
    description: "Get expert guidance on the NCA assessment process",
    duration: "30 mins",
    price: "10 CAD",
  },
  {
    id: "nca-exam",
    title: "NCA Exam Preparation Guidance (30 mins - 10 CAD)",
    description: "Personalized exam preparation strategies",
    duration: "30 mins",
    price: "10 CAD",
  },
  {
    id: "teaching",
    title: "Teaching / Answer Writing (1 hour - 50 CAD)",
    description: "One-on-one teaching session on any topic or answer writing guidance",
    duration: "1 hour",
    price: "50 CAD",
  },
];

const BookACallForm = () => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gmail: "",
    province: "",
    country: "",
    whatsapp: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", { selectedSession, ...formData });
  };

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
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all text-colorBlackPearl focus-visible:border-colorBlackPearl"
              required
            >
              <option value="" disabled>
                Select Session Type
              </option>
              {sessionTypes.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title}
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
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
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
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
            />
          </div>
        </div>

        {/* Gmail ID */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="email"
              placeholder="Gmail ID (for YouTube recordings)"
              name="gmail"
              value={formData.gmail}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
            />
          </div>
        </div>

        {/* Province/State and Country */}
        <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
          <div className="w-full">
            <input
              type="text"
              placeholder="Province/State"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="grid grid-cols-1 gap-9">
          <div className="w-full">
            <input
              type="tel"
              placeholder="WhatsApp Number"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full border-b border-colorBlackPearl/25 pb-3 outline-none transition-all placeholder:text-[#5F5D5D] focus-visible:border-colorBlackPearl focus-visible:text-colorBlackPearl"
              required
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
        className="btn btn-primary is-icon group mt-[10px]"
      >
        Submit Booking Request
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
  );
};

export default BookACallForm;
