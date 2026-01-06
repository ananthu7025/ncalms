/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import React, { useState, useEffect } from "react";
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
  isFeatured?: boolean;
  isMandatory?: boolean;
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
  isFeatured = false,
  isMandatory = false,
  isActive = true,
  href,
  showInactiveBadge = false,
  customActions,
}: CourseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (demoVideoUrl) {
      setIsModalOpen(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', thumbnail, e);
    setImageError(true);
  };

  // Debug logging
  useEffect(() => {
    console.log('CourseCard render:', { title, thumbnail, imageError });
  }, [title, thumbnail, imageError]);

  return (
    <>
      <Link href={href} className="block h-full group">
        <Card className="h-full hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border-gray-200">
          {/* Thumbnail Section */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
            {thumbnail && !imageError ? (
              <img
                src={thumbnail}
                alt={title}
                loading="lazy"
                onLoad={() => console.log('Image loaded successfully:', thumbnail)}
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                style={{ display: 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-teal-500/20 flex items-center justify-center">
                <span className="text-7xl font-bold text-blue-600/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {/* Demo Video Overlay */}
            {demoVideoUrl && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={handlePlayClick}
              >
                <Button
                  size="lg"
                  className="rounded-full w-14 h-14 bg-white/90 hover:bg-white text-blue-600 shadow-xl hover:scale-110 transition-transform"
                  onClick={handlePlayClick}
                >
                  <Play className="w-6 h-6 fill-current" />
                </Button>
              </div>
            )}

            {/* Status Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {showInactiveBadge && !isActive && (
                <Badge className="bg-gray-800 text-white shadow-md">
                  Inactive
                </Badge>
              )}
              {isFeatured && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-md font-semibold">
                  Featured
                </Badge>
              )}
              {isMandatory && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-md font-semibold">
                  Mandatory
                </Badge>
              )}
            </div>

            {isBundleEnabled && bundlePrice && (
              <Badge className="absolute top-3 right-3 bg-teal-500 hover:bg-teal-600 text-white shadow-md font-semibold">
                Bundle ${bundlePrice}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <CardContent className="p-6 flex-1 flex flex-col min-h-0">
            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {streamName && (
                <Badge variant="secondary" className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                  {streamName}
                </Badge>
              )}
              {examTypeName && (
                <Badge variant="outline" className="text-xs font-semibold border-teal-300 text-teal-700 px-3 py-1">
                  {examTypeName}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-xl line-clamp-2 group-hover:text-blue-600 transition-colors mb-3 leading-tight">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-auto leading-relaxed">
                {description}
              </p>
            )}

            {/* Footer with Price and Button */}
            <div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-200 gap-4">
              {customActions ? (
                <>
                  <div className="flex-1"></div>
                  {customActions}
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    {isBundleEnabled && bundlePrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${bundlePrice}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">Bundle</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600 font-medium">
                        Individual pricing
                      </span>
                    )}
                  </div>
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all font-semibold shrink-0 px-6"
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
