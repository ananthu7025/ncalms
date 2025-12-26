"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YouTubeModal } from "@/components/modals/YouTubeModal";

interface DemoVideoButtonProps {
  videoUrl: string;
  courseTitle: string;
}

export function DemoVideoButton({ videoUrl, courseTitle }: DemoVideoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0 bg-foreground/40 flex items-center justify-center cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Button
          type="button"
          className="rounded-full w-14 h-14 gradient-primary"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <Play className="w-6 h-6" />
        </Button>
      </div>

      <YouTubeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
        title={courseTitle}
      />
    </>
  );
}
