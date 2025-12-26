'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
    const contentRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 30, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
            )
        }
    }, [pathname])

    return (
        <div ref={contentRef} className="w-full">
            {children}
        </div>
    )
}
