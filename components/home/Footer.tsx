"use client";
import React from "react";
import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, Youtube, ArrowRight, Calendar, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-area bg-dark-1 pt-100 pb-70" style={{ paddingTop: '100px', paddingBottom: '70px' }}>
      <div className="container">
        <div className="row">
          {/* Column 1: Get In Touch */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget mb-40">
              <h3 className="footer-title text-white mb-30" style={{ position: 'relative', display: 'inline-block', paddingBottom: '10px' }}>
                GET IN TOUCH!
                <span style={{ content: '""', position: 'absolute', left: 0, bottom: 0, width: '40px', height: '2px', backgroundColor: '#fff' }}></span>
              </h3>
              <p className="text-white opacity-75 mt-3" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Bangalore, India
              </p>
              <div className="footer-contact mt-30">
                <div className="single-contact d-flex align-items-center mb-2">
                  <div className="icon" style={{ color: 'var(--ed-color-theme-primary)', marginRight: '10px' }}>
                    <Phone size={18} />
                  </div>
                  <div className="text text-white">
                    <span>+91 81232 83217</span>
                  </div>
                </div>
                <div className="single-contact d-flex align-items-center mb-2">
                  <div className="icon" style={{ color: 'var(--ed-color-theme-primary)', marginRight: '10px' }}>
                    <Mail size={18} />
                  </div>
                  <div className="text text-white">
                    <span>vidyahej999@gmail.com</span>
                  </div>
                </div>
              </div>
              <div className="footer-social mt-4 d-flex gap-3">
                <Link href="#" className="text-white hover-theme"><Facebook size={20} /></Link>
                <Link href="#" className="text-white hover-theme"><Instagram size={20} /></Link>
                <Link href="#" className="text-white hover-theme"><Linkedin size={20} /></Link>
                <Link href="#" className="text-white hover-theme"><Youtube size={20} /></Link>
              </div>
            </div>
          </div>

          {/* Column 2: Company Info */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget mb-40">
              <h3 className="footer-title text-white mb-30" style={{ position: 'relative', display: 'inline-block', paddingBottom: '10px' }}>
                COMPANY INFO
                <span style={{ content: '""', position: 'absolute', left: 0, bottom: 0, width: '40px', height: '2px', backgroundColor: '#fff' }}></span>
              </h3>
              <ul className="footer-link list-unstyled mt-3">
                {['About Us', 'Resource Center', 'Careers', 'Instructor', 'Become A Teacher'].map((item) => (
                  <li key={item} className="mb-2">
                    <Link href="#" className="text-white opacity-75 d-flex align-items-center text-decoration-none" style={{ transition: '0.3s' }}>
                      <ArrowRight size={14} className="me-2" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Useful Links */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget mb-40">
              <h3 className="footer-title text-white mb-30" style={{ position: 'relative', display: 'inline-block', paddingBottom: '10px' }}>
                USEFUL LINKS
                <span style={{ content: '""', position: 'absolute', left: 0, bottom: 0, width: '40px', height: '2px', backgroundColor: '#fff' }}></span>
              </h3>
              <ul className="footer-link list-unstyled mt-3">
                {['All Courses', 'Digital Marketing', 'Design & Branding', 'Storytelling & Voice Over', 'News & Blogs'].map((item) => (
                  <li key={item} className="mb-2">
                    <Link href="#" className="text-white opacity-75 text-decoration-none" style={{ display: 'block', transition: '0.3s' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Recent Post */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-widget mb-40">
              <h3 className="footer-title text-white mb-30" style={{ position: 'relative', display: 'inline-block', paddingBottom: '10px' }}>
                RECENT POST
                <span style={{ content: '""', position: 'absolute', left: 0, bottom: 0, width: '40px', height: '2px', backgroundColor: '#fff' }}></span>
              </h3>
              <div className="recent-post-widget mt-3">
                <div className="single-post d-flex align-items-center mb-3">
                  <div className="post-thumb me-3" style={{ width: '70px', height: '70px', flexShrink: 0, backgroundColor: '#333', borderRadius: '6px', overflow: 'hidden' }}>
                    {/* Placeholder for image */}
                    <img src="/assets/img/blog/post-1.jpg" alt="blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.backgroundColor = '#2d3a39' }} />
                  </div>
                  <div className="post-content">
                    <h4 className="title text-white mb-1" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                      <Link href="#" className="text-white text-decoration-none">Where Dreams Find A Home</Link>
                    </h4>
                    <span className="date text-white opacity-50 d-flex align-items-center" style={{ fontSize: '13px' }}>
                      <Calendar size={12} className="me-2" />
                      20 April, 2025
                    </span>
                  </div>
                </div>
                <div className="single-post d-flex align-items-center mb-3">
                  <div className="post-thumb me-3" style={{ width: '70px', height: '70px', flexShrink: 0, backgroundColor: '#333', borderRadius: '6px', overflow: 'hidden' }}>
                    {/* Placeholder for image */}
                    <img src="/assets/img/blog/post-2.jpg" alt="blog" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.style.backgroundColor = '#2d3a39' }} />
                  </div>
                  <div className="post-content">
                    <h4 className="title text-white mb-1" style={{ fontSize: '15px', lineHeight: '1.4' }}>
                      <Link href="#" className="text-white text-decoration-none">Where Dreams Find A Home</Link>
                    </h4>
                    <span className="date text-white opacity-50 d-flex align-items-center" style={{ fontSize: '13px' }}>
                      <Calendar size={12} className="me-2" />
                      20 April, 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
