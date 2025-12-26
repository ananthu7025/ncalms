"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
  threshold?: number; // 0 to 1, how much of element visible to trigger
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  x = 0,
  y = 30, // Default fade up
  scale = 1,
  threshold = 0.1,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state
    gsap.set(element, {
      autoAlpha: 0,
      x: x,
      y: y,
      scale: scale,
    });

    const anim = gsap.to(element, {
      duration: duration,
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      delay: delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`, // e.g. "top 90%"
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      anim.kill();
    };
  }, [delay, duration, x, y, scale, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
