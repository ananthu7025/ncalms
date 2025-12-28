'use client'

import { useEffect } from 'react'

interface PublicStyleLoaderProps {
  onLoaded?: () => void
}

export default function PublicStyleLoader({ onLoaded }: PublicStyleLoaderProps) {
  useEffect(() => {
    // Create and append stylesheets for public routes
    const stylesheets = [
      '/assets/css/vendors/swiper-bundle.min.css',
      '/assets/css/vendors/jos.css',
      '/assets/css/vendors/menu.css',
      '/assets/css/style.css',
      '/assets/css/custom.css',
    ]

    const linkElements: HTMLLinkElement[] = []
    let loadedCount = 0

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === stylesheets.length && onLoaded) {
        // Add a small delay to ensure styles are fully applied
        setTimeout(() => {
          onLoaded()
        }, 100)
      }
    }

    stylesheets.forEach((href) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.setAttribute('data-public-style', 'true')

      // Track when each stylesheet is loaded
      link.onload = checkAllLoaded
      link.onerror = checkAllLoaded // Also count errors to prevent infinite loading

      document.head.appendChild(link)
      linkElements.push(link)
    })

    // Cleanup function to remove stylesheets when leaving public routes
    return () => {
      linkElements.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
    }
  }, [onLoaded])

  return null
}
