/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { YouTubeModal } from "@/components/modals/YouTubeModal";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  demoVideoUrl?: string | null;
  streamName?: string | null;
  examTypeName?: string | null;
  bundlePrice?: string | null;
  isBundleEnabled?: boolean;
  isActive?: boolean;
  href: string;
  showInactiveBadge?: boolean;
  customActions?: React.ReactNode;
}

export function CourseCard({
  title,
  description,
  thumbnail,
  demoVideoUrl,
  streamName,
  examTypeName,
  bundlePrice,
  isBundleEnabled,
  isActive = true,
  href,
  showInactiveBadge = false,
  customActions,
}: CourseCardProps) {
  console.log(demoVideoUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (demoVideoUrl) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Link href={href} className="block">
        <Card className="group h-full hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer">
          <div className="relative aspect-video overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-teal-500/20 flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-600/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {demoVideoUrl && (
              <div
                className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                onClick={handlePlayClick}
              >
                <Button
                  size="lg"
                  className="rounded-full w-12 h-12 gradient-primary"
                  onClick={handlePlayClick}
                >
                  <Play className="w-5 h-5" />
                </Button>
              </div>
            )}

            {showInactiveBadge && !isActive && (
              <Badge className="absolute top-3 left-3 bg-muted text-muted-foreground">
                Inactive
              </Badge>
            )}

            {isBundleEnabled && bundlePrice && (
              <Badge className="absolute top-3 right-3 bg-teal-500 text-white">
                Bundle ${bundlePrice}
              </Badge>
            )}
          </div>

          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {streamName && (
                <Badge variant="secondary" className="text-xs">
                  {streamName}
                </Badge>
              )}
              {examTypeName && (
                <Badge variant="outline" className="text-xs">
                  {examTypeName}
                </Badge>
              )}
            </div>

            <h3 className="font-bold text-xl line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {description}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {customActions ? (
                <>
                  <div></div>
                  {customActions}
                </>
              ) : (
                <>
                  {isBundleEnabled && bundlePrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ${bundlePrice}
                      </span>
                      <span className="text-sm text-gray-500">Bundle</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Individual pricing
                    </span>
                  )}
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600"
                  >
                    View Course
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
      {demoVideoUrl && (
        <YouTubeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={demoVideoUrl}
          title={title}
        />
      )}
    </>
  );
}
