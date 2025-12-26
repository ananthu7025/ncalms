/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ContactForm from "@/components/home/ContactForm";
import { Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <section className="contact-section py-5 bg-gradient-to-br from-blue-600/10 via-teal-500/5 to-transparent">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="h2 fw-bold text-dark mb-2">Get In Touch</h1>
            <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Have a question or need assistance? We're here to help! Send us a
              message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="row g-4">
            {/* Contact Form */}
            <div className="col-lg-7">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="h-100  p-4 rounded-4 shadow-lg position-relative overflow-hidden">
                {/* Decorative Background Elements */}

                <div className="position-relative" style={{ zIndex: 10 }}>
                  <div className="mb-4">
                    <h3 className="h4 fw-bold mb-2">Contact Information</h3>
                    <p className="" style={{ lineHeight: "1.6" }}>
                      We're available during business hours to assist you with
                      any questions or concerns.
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {/* Phone & Email */}
                    <div className="d-flex gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Phone size={18} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Phone & Email</h6>
                        <div className="d-flex flex-column gap-1">
                          <a
                            href="tel:+16478012345"
                            className="text-decoration-none"
                          >
                            (647) 801-2345
                          </a>
                          <a
                            href="mailto:support@ncalms.com"
                            className=" text-decoration-none"
                          >
                            support@ncalms.com
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="d-flex gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Office Address</h6>
                        <p
                          className="opacity-75 mb-0 small"
                          style={{ lineHeight: "1.6" }}
                        >
                          123 Legal Education Blvd
                          <br />
                          Toronto, ON M5H 2N2
                          <br />
                          Canada
                        </p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="d-flex gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Clock size={18} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">Business Hours</h6>
                        <div className="d-flex flex-column gap-1 opacity-75 small">
                          <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
                          <span>Saturday: 10:00 AM - 4:00 PM</span>
                          <span>Sunday: Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       
        </div>
      </section>
      <Footer />
    </>
  );
}
