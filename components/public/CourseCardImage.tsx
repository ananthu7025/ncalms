"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { YouTubeModal } from "@/components/modals/YouTubeModal";

interface CourseCardImageProps {
  thumbnailUrl: string;
  courseTitle: string;
  courseId: string;
  streamName: string;
  videoUrl?: string | null;
}

export default function CourseCardImage({
  thumbnailUrl,
  courseTitle,
  courseId,
  streamName,
  videoUrl,
}: CourseCardImageProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
    if (videoUrl) {
      e.preventDefault();
      e.stopPropagation();
      setIsVideoOpen(true);
    }
  };

  return (
    <>
      <div className="absolute block h-[222px] w-[227px] overflow-hidden rounded-lg">
        <Image
          src={thumbnailUrl}
          alt={courseTitle}
          width={227}
          height={222}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />

        {/* Stream Badge */}
        <Link
          href={`/courses/${courseId}`}
          className="absolute left-3 top-3 inline-block rounded-[40px] bg-colorBrightGold px-3.5 py-1.5 text-sm leading-none text-colorBlackPearl hover:bg-colorBlackPearl hover:text-colorBrightGold z-10"
        >
          {streamName}
        </Link>

        {/* Play Button Overlay - Only show if video exists */}
        {videoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg transition-all duration-300 hover:bg-black/30 cursor-pointer z-[5]"
            onClick={handlePlayClick}
          >
            <div className="relative">
              {/* Play button */}
              <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl transition-transform duration-300 hover:scale-110">
                <svg
                  className="w-5 h-5 ml-0.5 text-colorPurpleBlue"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

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
