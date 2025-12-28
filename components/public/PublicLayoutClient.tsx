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
import { Toaster } from 'sonner'

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
      <Toaster position="bottom-right" richColors />
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

      {/* Vendor Scripts */}
      <Script
        src="/assets/js/vendors/counterup.js"
        strategy="afterInteractive"
        type="module"
      />
      <Script
        src="/assets/js/vendors/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/vendors/fslightbox.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/vendors/jos.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/vendors/menu.js"
        strategy="afterInteractive"
      />

      {/* Main Script */}
      <Script
        src="/assets/js/main.js"
        strategy="afterInteractive"
      />
    </>
  )
}
