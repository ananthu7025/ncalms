"use client";

import React from "react";
import Image from "next/image";

const VideoSection = () => {
  return (
    <section className="section-video">
      <div className="section-space">
        <div className="container">
          <div className="relative overflow-hidden rounded-lg" data-aos="zoom-in">
            <Image
              src="/assets/img/images/th-2/video-img.jpg"
              alt="video thumbnail"
              width={1170}
              height={500}
              className="h-auto w-full"
            />

            {/* Play Button Overlay */}
            <a
              href="https://www.youtube.com/playlist?list=PLk-9Hiidr8C7jltqeKH_KYY_K9WsBdGMJ"
              className="glightbox absolute left-1/2 top-1/2 z-10 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[50%] border-4 border-[#F1C93B] bg-white transition-all duration-300 hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/assets/img/icons/icon-golden-yellow-play.svg"
                alt="play"
                width={24}
                height={24}
              />
            </a>

            {/* Decorative Elements */}
            <div className="absolute -left-20 top-1/2 -z-10 h-[200px] w-[200px] -translate-y-1/2 rounded-[50%] bg-[#BFC06F] blur-[150px]"></div>
            <div className="absolute -right-20 bottom-0 -z-10 h-[200px] w-[200px] rounded-[50%] bg-[#6FC081] blur-[150px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
