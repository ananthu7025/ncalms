/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { YouTubeModal } from "@/components/modals/YouTubeModal";

interface CourseHeroImageProps {
  thumbnailUrl: string;
  courseTitle: string;
  videoUrl?: string | null;
}

export default function CourseHeroImage({
  thumbnailUrl,
  courseTitle,
  videoUrl,
}: CourseHeroImageProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {videoUrl ? (
        <div className="relative cursor-pointer group" onClick={() => setIsVideoOpen(true)}>
          <Image
            src={thumbnailUrl}
            alt={courseTitle}
            width={783}
            height={440}
            className="w-full h-[110px] md:h-[100px] object-cover rounded-lg"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg transition-all duration-300 group-hover:bg-black/40">
            <div className="relative">
              {/* Pulsing effect */}
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              {/* Play button */}
              <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 ml-1 text-colorPurpleBlue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={thumbnailUrl}
          alt={courseTitle}
          width={783}
          height={440}
          className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
        />
      )}

      {videoUrl && isMounted && (
        <YouTubeModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={videoUrl}
          title={courseTitle}
        />
      )}
    </>
  );
}
