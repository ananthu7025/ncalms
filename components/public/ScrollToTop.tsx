'use client'

import { useEffect, useState } from 'react'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

/**
 * Scroll to top button that appears when user scrolls down
 * Example usage of the useSmoothScroll hook
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollToTop } = useSmoothScroll()

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={() => scrollToTop({ duration: 1.2 })}
      className="fixed bottom-8 right-8 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  )
}
