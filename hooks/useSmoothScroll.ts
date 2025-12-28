/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback } from 'react'

/**
 * Hook to scroll smoothly to an element or position using Lenis
 */
export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | number | HTMLElement, options?: {
    offset?: number
    duration?: number
    easing?: (t: number) => number
  }) => {
    const lenis = (window as any).lenis

    if (!lenis) {
      console.warn('Lenis instance not found. Make sure SmoothScroll component is mounted.')
      return
    }

    if (typeof target === 'string') {
      // Scroll to element by selector
      const element = document.querySelector(target)
      if (element) {
        lenis.scrollTo(element, {
          offset: options?.offset ?? 0,
          duration: options?.duration,
          easing: options?.easing,
        })
      }
    } else {
      // Scroll to position or element
      lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration,
        easing: options?.easing,
      })
    }
  }, [])

  const scrollToTop = useCallback((options?: {
    duration?: number
    easing?: (t: number) => number
  }) => {
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.scrollTo(0, {
        duration: options?.duration,
        easing: options?.easing,
      })
    }
  }, [])

  const stop = useCallback(() => {
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.stop()
    }
  }, [])

  const start = useCallback(() => {
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.start()
    }
  }, [])

  return {
    scrollTo,
    scrollToTop,
    stop,
    start,
  }
}
