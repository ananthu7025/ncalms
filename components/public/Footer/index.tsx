"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="section-footer">
      <div className="relative z-10 overflow-hidden">
        <div className="section-space">
          <div className="container">
            <div className="grid grid-cols-1 flex-wrap justify-between gap-10 sm:grid-cols-2 lg:flex">
              
              {/* Brand */}
              <div className="max-w-[298px]">
                <Link href="/">
                  <Image src="/assets/img/logo.jpeg" alt="logo" width={137} height={33} />
                </Link>
                <p className="mb-8 mt-8">
                  We value your feedback, questions, and inquiries. Feel free to
                  reach out to us anytime.
                </p>
                <div className="flex items-center gap-x-6">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="facebook">
                    <Image src="/assets/img/icons/icon-dark-facebook.svg" alt="facebook" width={20} height={20} />
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="instagram">
                    <Image src="/assets/img/icons/icon-dark-instagram.svg" alt="instagram" width={21} height={20} />
                  </a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="youtube">
                    <Image src="/assets/img/icons/icon-dark-youtube.svg" alt="youtube" width={21} height={20} />
                  </a>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="linkedin">
                    <Image src="/assets/img/icons/icon-dark-linkedin.svg" alt="linkedin" width={21} height={20} />
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <span className="mb-8 block font-title text-xl font-bold text-colorBlackPearl">
                  Links
                </span>
                <ul className="flex flex-col gap-y-3">
                  <li><a className="hover:text-colorBlackPearl hover:underline" href="#">About Us</a></li>
                  <li><a className="hover:text-colorBlackPearl hover:underline" href="#">Courses</a></li>
                  <li><a className="hover:text-colorBlackPearl hover:underline" href="#">Pricing</a></li>
                  <li><a className="hover:text-colorBlackPearl hover:underline" href="#">Contact</a></li>
                  <li><a className="hover:text-colorBlackPearl hover:underline" href="#">FAQ</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <span className="mb-8 block font-title text-xl font-bold text-colorBlackPearl">
                  Contact
                </span>
                <ul className="flex flex-col gap-y-3">
                  <li className="inline-flex gap-x-6">
                    <div className="h-7 w-auto">
                      <Image src="/assets/img/icons/icon-purple-phone-ring.svg" alt="phone" width={28} height={28} />
                    </div>
                    <div className="flex-1">
                      <span className="block">Phone</span>
                      <a href="tel:+918123283217" className="font-title text-lg text-colorBlackPearl hover:underline md:text-xl">
                        +91 81232 83217
                      </a>
                    </div>
                  </li>

                  <li className="inline-flex gap-x-6">
                    <div className="h-7 w-auto">
                      <Image src="/assets/img/icons/icon-purple-mail-open.svg" alt="email" width={28} height={28} />
                    </div>
                    <div className="flex-1">
                      <span className="block">Email</span>
                      <a href="mailto:vidyahej999@gmail.com" className="font-title text-lg text-colorBlackPearl hover:underline md:text-xl">
                        vidyahej999@gmail.com
                      </a>
                    </div>
                  </li>

                  <li className="inline-flex gap-x-6">
                    <div className="h-7 w-auto">
                      <Image src="/assets/img/icons/icon-purple-location.svg" alt="location" width={28} height={28} />
                    </div>
                    <div className="flex-1">
                      <span className="block">Address</span>
                      <address className="font-title text-xl not-italic text-colorBlackPearl">
                        Bangalore, India
                      </address>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Subscribe */}
              <div className="md:max-w-80">
                <span className="mb-8 block font-title text-xl font-bold text-colorBlackPearl">
                  Subscribe
                </span>
                <p>Get updates, offers, and NCA prep resources.</p>
                <form className="mt-4 text-sm font-medium">
                  <input
                    type="email"
                    className="w-full rounded-[50px] border border-[#EBEBEB] bg-white px-7 py-3.5 outline-none"
                    placeholder="Enter email"
                  />
                  <button type="submit" className="btn btn-primary is-icon group mt-[10px]">
                    Subscribe Now
                    <span className="btn-icon bg-white group-hover:right-0 group-hover:translate-x-full">
                      <Image src="/assets/img/icons/icon-purple-arrow-right.svg" alt="arrow" width={13} height={12} />
                    </span>
                    <span className="btn-icon bg-white group-hover:left-[5px] group-hover:translate-x-0">
                      <Image src="/assets/img/icons/icon-purple-arrow-right.svg" alt="arrow" width={13} height={12} />
                    </span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* Background Elements */}
        <Image src="/assets/img/abstracts/footer-element-1.svg" alt="decor" width={119} height={121} className="absolute bottom-40 left-0 -z-10 hidden lg:inline-block" />
        <Image src="/assets/img/abstracts/footer-element-2.svg" alt="decor" width={101} height={92} className="absolute right-64 top-72 -z-10 hidden lg:inline-block" />
        <Image src="/assets/img/abstracts/abstract-element-regular.svg" alt="decor" width={133} height={154} className="absolute -right-9 bottom-0 -z-10 hidden lg:inline-block" />
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#F5F5F5] py-6 text-center text-sm">
        © {year} NCA Made Easy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
