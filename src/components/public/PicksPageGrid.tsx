"use client";

import { useState } from "react";
import type { Pick } from "@/lib/types";
import PickCard from "./PickCard";
import PickVideoModal from "./PickVideoModal";

/**
 * /picks listing page — filter tabs + uniform grid + modal playback.
 */
interface PicksPageGridProps {
  items: Pick[];
}

type FilterTab = "all" | "video" | "podcast" | "article" | "channel";

export default function PicksPageGrid({ items }: PicksPageGridProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [activeVideo, setActiveVideo] = useState<{ id: string; url: string } | null>(null);

  const counts = {
    all: items.length,
    video: items.filter((p) => p.mediaType === "video").length,
    podcast: items.filter((p) => p.mediaType === "podcast").length,
    article: items.filter((p) => p.mediaType === "article").length,
    channel: items.filter((p) => p.mediaType === "channel").length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "video", label: "Videos" },
    { key: "podcast", label: "Podcasts" },
    { key: "article", label: "Articles" },
    { key: "channel", label: "Channels" },
  ];

  const filtered =
    activeTab === "all"
      ? items
      : items.filter((p) => p.mediaType === activeTab);

  const handlePlay = (youtubeId: string, youtubeUrl: string) => {
    setActiveVideo({ id: youtubeId, url: youtubeUrl });
  };

  return (
    <>
      <div>
        {/* Filter tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.85rem] font-medium
                  whitespace-nowrap transition-all duration-300 border shrink-0
                  ${
                    isActive
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`text-[0.72rem] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Uniform grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((item) => (
            <div key={item.id} className="transition-opacity duration-300">
              <PickCard item={item} onPlay={handlePlay} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            No picks in this category.
          </p>
        )}
      </div>

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
