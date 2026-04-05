"use client";

import { useEffect, useCallback } from "react";

/**
 * Full-screen modal overlay that plays a YouTube video.
 * Large visible close button top-right.
 */
interface VideoModalProps {
  youtubeId: string;
  onClose: () => void;
}

export default function VideoModal({ youtubeId, onClose }: VideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Close button — solid white background, always visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-[210] w-11 h-11 rounded-full bg-white/15 hover:bg-[var(--color-accent)] flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        aria-label="Close video"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* "Press Esc to close" hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[210] text-white/40 text-[0.75rem] font-medium tracking-wide">
        Press Esc or click outside to close
      </div>

      {/* Video player */}
      <div
        className="relative z-[205] w-full max-w-[960px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
