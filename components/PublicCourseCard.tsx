/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import React, { useState } from "react";
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

export function PublicCourseCard({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (demoVideoUrl) setIsModalOpen(true);
  };

  return (
    <>
      <Link href={href} className="text-decoration-none h-100 d-block">
        <div className="card h-100 shadow-sm border-0 course-card">
          {/* Thumbnail */}
          <div
            className="position-relative overflow-hidden"
            style={{ aspectRatio: "16 / 10", background: "#f1f3f5" }}
          >
            {thumbnail && !imageError ? (
              <img
                src={thumbnail}
                alt={title}
                loading="lazy"
                onError={() => setImageError(true)}
                className="w-100 h-100 object-fit-cover"
                style={{ transition: "transform 0.6s ease" }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <span className="display-3 fw-bold text-primary opacity-25">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {/* Demo Overlay */}
            {demoVideoUrl && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                onClick={handlePlayClick}
              >
                <button
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: 56, height: 56 }}
                  onClick={handlePlayClick}
                >
                  <Play size={24} />
                </button>
              </div>
            )}

            {/* Badges */}
            {showInactiveBadge && !isActive && (
              <span className="badge bg-secondary position-absolute top-0 start-0 m-3">
                Inactive
              </span>
            )}

            {isBundleEnabled && bundlePrice && (
              <span className="badge bg-success position-absolute top-0 end-0 m-3">
                Bundle ${bundlePrice}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="card-body d-flex flex-column p-4">
            {/* Tags */}
            <div className="mb-3 d-flex gap-2 flex-wrap">
              {streamName && (
                <span className="badge bg-primary-subtle text-primary fw-semibold">
                  {streamName}
                </span>
              )}
              {examTypeName && (
                <span className="badge border border-success text-success fw-semibold">
                  {examTypeName}
                </span>
              )}
            </div>

            {/* Title */}
            <h5 className="fw-bold mb-3 text-dark">{title}</h5>

            {/* Description */}
            {description && (
              <p className="text-muted small mb-4">{description}</p>
            )}

            {/* Footer */}
            <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-3">
              {customActions ? (
                customActions
              ) : (
                <>
                  <div>
                    {isBundleEnabled && bundlePrice ? (
                      <div>
                        <span className="fs-4 fw-bold text-primary">
                          ${bundlePrice}
                        </span>
                        <span className="text-muted small ms-2">Bundle</span>
                      </div>
                    ) : null}
                  </div>

                  <button className="btn btn-primary fw-semibold px-4">
                    View Course
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Video Modal */}
      {demoVideoUrl && (
        <YouTubeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={demoVideoUrl}
          title={title}
        />
      )}

      {/* Hover Effect */}
      <style jsx>{`
        .course-card:hover img {
          transform: scale(1.08);
        }
        .course-card:hover .position-absolute {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
