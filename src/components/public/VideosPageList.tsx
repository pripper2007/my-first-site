"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoItem } from "@/lib/types";
import { extractYouTubeId } from "@/lib/youtube";
import ScrollReveal from "@/components/shared/ScrollReveal";
import VideoModal from "./VideoModal";

/**
 * Client component for the /videos listing page.
 * Shows all videos in a 3-column grid with modal playback.
 */
interface VideosPageListProps {
  items: VideoItem[];
}

export default function VideosPageList({ items }: VideosPageListProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {items.map((item, i) => {
          const youtubeId = extractYouTubeId(item.youtubeUrl);
          const thumbSrc = item.customThumbnail || item.thumbnailUrl;

          return (
            <ScrollReveal key={item.id} delay={i * 80}>
              <div
                className="block group cursor-pointer"
                onClick={() => youtubeId && setActiveVideoId(youtubeId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && youtubeId) setActiveVideoId(youtubeId);
                }}
              >
                <div
                  className="border border-[var(--color-border)] overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <div className="aspect-video relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
                    {thumbSrc ? (
                      <>
                        <Image
                          src={thumbSrc}
                          alt={item.title}
                          fill
                          className="object-cover md:[filter:saturate(0.65)_brightness(1.08)_contrast(0.92)] transition-all duration-[500ms] md:group-hover:[filter:none]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 md:bg-[rgba(248,243,230,0.45)] bg-transparent transition-opacity duration-[500ms] md:group-hover:opacity-0" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-secondary)]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20">
                          <rect x="2" y="2" width="20" height="20" rx="2" />
                          <polygon points="10 8 16 12 10 16 10 8" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-[400ms] group-hover:scale-110 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-[2px]">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <span className="absolute bottom-3 right-3 z-[2] bg-black/70 text-white text-[0.72rem] font-semibold px-2.5 py-1 rounded-md">
                      {item.duration}
                    </span>
                  </div>
                  <div className="px-6 py-5 bg-[var(--color-bg-alt)]">
                    <div className="text-[0.72rem] font-medium text-[var(--color-accent)] uppercase tracking-[0.1em] mb-2">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} &middot; {item.event}
                    </div>
                    <div className="font-display text-[1rem] font-semibold leading-[1.35]">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-[0.82rem] text-[var(--color-text-secondary)] mt-1.5 leading-[1.5] font-light">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {activeVideoId && (
        <VideoModal
          youtubeId={activeVideoId}
          onClose={() => setActiveVideoId(null)}
        />
      )}
    </>
  );
}
