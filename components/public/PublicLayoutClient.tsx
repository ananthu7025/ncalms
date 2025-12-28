'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import HeaderPublic from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import OfferBanner from '@/components/public/OfferBanner'
import PublicStyleLoader from '@/components/public/PublicStyleLoader'
import Preloader from '@/components/public/Preloader'
import SmoothScroll from '@/components/public/SmoothScroll'
import ScrollToTop from '@/components/public/ScrollToTop'
import AOSInit from '@/components/public/AOSInit'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  const handleStylesLoaded = () => {
    setIsLoading(false)
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <PublicStyleLoader onLoaded={handleStylesLoaded} />
      <AOSInit />

      {/* Show preloader while loading */}
      {isLoading && <Preloader />}

      {/* Main content with smooth scroll - enabled after loading */}
      <SmoothScroll enabled={!isLoading}>
        <div
          className="element-wrapper bg-[#FAF9F6]"
          style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
        >
          <div className="page-wrapper relative">
            <HeaderPublic />
            <main className="main-wrapper relative">
              {children}
            </main>
            <OfferBanner />
            <Footer />
          </div>
        </div>
        <ScrollToTop />
      </SmoothScroll>

      {/* JOS Animation Library */}
      <Script
        src="/assets/js/vendors/jos.min.js"
        strategy="afterInteractive"
      />

      {/* Initialize JOS Animations */}
      <Script
        id="jos-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof JOS !== 'undefined') {
              JOS.init({
                passive: false,
                once: true,
                animation: "fade-up",
                timingFunction: "ease",
                threshold: 0,
                delay: 0.5,
                duration: 0.7,
                scrollDirection: "down",
                rootMargin: "0% 0% 15% 0%"
              });
            }
          `
        }}
      />
    </>
  )
}
