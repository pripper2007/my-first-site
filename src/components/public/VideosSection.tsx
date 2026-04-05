"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoItem } from "@/lib/types";
import { extractYouTubeId } from "@/lib/youtube";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import VideoModal from "./VideoModal";

/**
 * Videos section — 1 large featured + 2 smaller in a column.
 * Clicking play opens the video in a modal overlay.
 * Shows custom thumbnail if set in the CMS, otherwise a neutral placeholder.
 */
interface VideosSectionProps {
  items: VideoItem[];
}

function VideoCard({
  item,
  showDesc,
  onPlay,
}: {
  item: VideoItem;
  showDesc?: boolean;
  onPlay: (youtubeId: string) => void;
}) {
  const youtubeId = extractYouTubeId(item.youtubeUrl);
  // Prefer custom thumbnail, then thumbnailUrl (from YouTube), then fallback
  const thumbnailSrc = item.customThumbnail || item.thumbnailUrl;
  const hasThumbnail = !!thumbnailSrc;

  const handleClick = () => {
    if (youtubeId) onPlay(youtubeId);
  };

  return (
    <div
      className="block group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
    >
      <div
        className="border border-[var(--color-border)] overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
          {hasThumbnail ? (
            <>
              <Image
                src={thumbnailSrc!}
                alt={item.title}
                fill
                className="object-cover [filter:saturate(0.65)_brightness(1.08)_contrast(0.92)] transition-all duration-[500ms] group-hover:[filter:none]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-[rgba(248,243,230,0.45)] transition-opacity duration-[500ms] group-hover:opacity-0" />
            </>
          ) : (
            /* Neutral placeholder */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-20">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
            </div>
          )}

          {/* Play button — white, turns gold on hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-[400ms] group-hover:scale-110 group-hover:bg-[var(--color-accent)] group-hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-[3px]">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>

          {/* Duration badge */}
          <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[0.72rem] font-semibold px-2.5 py-1 rounded-md tracking-[0.04em]">
            {item.duration}
          </span>
        </div>

        {/* Info */}
        <div className="px-7 py-6 bg-[var(--color-bg-alt)]">
          <div className="text-[0.72rem] font-medium text-[var(--color-accent)] uppercase tracking-[0.1em] mb-2">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} &middot; {item.event}
          </div>
          <div className="font-display text-[1.1rem] font-semibold leading-[1.35]">
            {item.title}
          </div>
          {showDesc && item.description && (
            <div className="text-[0.85rem] text-[var(--color-text-secondary)] mt-2 leading-[1.55] font-light">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideosSection({ items }: VideosSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <>
      <section id="talks" className="py-[120px] bg-[var(--color-bg-alt)]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <ScrollReveal>
            <SectionHeader
              label="Talks"
              title="Talks &amp; Interviews"
              subtitle="Selected keynotes, panel discussions, and interviews on technology, fintech, and leadership."
              seeMoreHref="/talks"
            />
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {items.map((item) => (
                <VideoCard key={item.id} item={item} onPlay={setActiveVideoId} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {activeVideoId && (
        <VideoModal
          youtubeId={activeVideoId}
          onClose={() => setActiveVideoId(null)}
        />
      )}
    </>
  );
}
