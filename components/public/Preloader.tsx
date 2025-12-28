'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate preloader exit with GSAP
    const timer = setTimeout(() => {
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            if (loaderRef.current) {
              loaderRef.current.style.display = 'none'
            }
          },
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap');

        .loader-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .brand-text {
          font-family: 'Black Ops One', cursive;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .top-text {
          font-size: 32px;
          margin-bottom: 5px;
        }

        .bottom-text {
          font-size: 24px;
          margin-top: 15px;
        }

        .book-loader {
          position: relative;
          width: 80px;
          height: 50px;
          margin: 10px 0;
          perspective: 1000px;
        }

        .book-stack {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 15px;
          background: #fff;
          border: 3px solid #000;
          border-radius: 2px 5px 5px 2px;
          box-shadow: 0 18px 0 -3px #fff, 0 18px 0 0 #000;
        }

        .book-top {
          position: absolute;
          top: -15px;
          left: 0;
          width: 100%;
          height: 40px;
        }

        .page {
          position: absolute;
          right: 0;
          top: 0;
          width: 50%;
          height: 100%;
          background: #fff;
          border: 2px solid #000;
          border-left: none;
          transform-origin: 0% 100%;
          border-radius: 0 10px 0 0;
        }

        .page:nth-child(1) {
          animation: flip 1.8s infinite ease-in-out;
          animation-delay: 0s;
        }

        .page:nth-child(2) {
          animation: flip 1.8s infinite ease-in-out;
          animation-delay: 0.3s;
        }

        .page:nth-child(3) {
          animation: flip 1.8s infinite ease-in-out;
          animation-delay: 0.6s;
        }

        .page-static {
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          height: 100%;
          background: #fff;
          border: 2px solid #000;
          border-right: none;
          border-radius: 10px 0 0 0;
          transform: skewY(5deg);
        }

        @keyframes flip {
          0% {
            transform: rotateZ(0deg);
          }
          50% {
            transform: rotateZ(-160deg);
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
          }
          100% {
            transform: rotateZ(0deg);
          }
        }
      `}</style>

      <div ref={loaderRef} className="loader-wrapper">
        <div className="brand-text top-text">NCA</div>
        <div className="book-loader">
          <div className="page-static"></div>
          <div className="book-top">
            <div className="page"></div>
            <div className="page"></div>
            <div className="page"></div>
          </div>
          <div className="book-stack"></div>
        </div>
        <div className="brand-text bottom-text">Made Easy</div>
      </div>
    </>
  )
}
