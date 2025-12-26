"use client";

import Modal from "react-modal";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

// Set app element for accessibility
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

export function YouTubeModal({
  isOpen,
  onClose,
  videoUrl,
  title,
}: YouTubeModalProps) {
  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return "";

    // Handle different YouTube URL formats
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11 ? match[7] : null;

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // If already an embed URL, return as is
    if (url.includes("embed")) {
      return url;
    }

    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-background rounded-lg shadow-2xl max-w-5xl w-full mx-auto my-8 outline-none"
      overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      closeTimeoutMS={200}
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {title || "Course Preview"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Video Container */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </Modal>
  );
}
