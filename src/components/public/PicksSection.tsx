"use client";

import { useState } from "react";
import type { Pick } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import PickCard from "./PickCard";
import PickVideoModal from "./PickVideoModal";

/**
 * Homepage picks section — uniform 3-column grid (all cards same size).
 * Videos/podcasts open in a modal overlay instead of redirecting to YouTube.
 */
interface PicksSectionProps {
  items: Pick[];
}

export default function PicksSection({ items }: PicksSectionProps) {
  const [activeVideo, setActiveVideo] = useState<{ id: string; url: string } | null>(null);

  const handlePlay = (youtubeId: string, youtubeUrl: string) => {
    setActiveVideo({ id: youtubeId, url: youtubeUrl });
  };

  return (
    <>
      <section id="picks" className="py-[120px]" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <ScrollReveal>
            <SectionHeader
              label="Curated by Pedro"
              title="Picks"
              subtitle="Podcasts, videos, and articles on AI, payments, and technology that I find worth sharing."
              seeMoreHref="/picks"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <PickCard key={item.id} item={item} onPlay={handlePlay} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {activeVideo && (
        <PickVideoModal
          youtubeId={activeVideo.id}
          youtubeUrl={activeVideo.url}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
