"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeModal } from "@/components/modals/YouTubeModal";

interface VideoPlayerButtonProps {
  videoUrl: string;
  title: string;
  variant?: "ghost" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function VideoPlayerButton({
  videoUrl,
  title,
  variant = "ghost",
  size = "icon",
  className
}: VideoPlayerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <Play className="w-4 h-4" />
      </Button>

      <YouTubeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
        title={title}
      />
    </>
  );
}
