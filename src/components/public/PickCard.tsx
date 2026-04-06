import type { Pick } from "@/lib/types";

/**
 * Card for a curated pick. Videos/podcasts trigger onPlay callback
 * (for modal playback), articles/channels link externally.
 */
interface PickCardProps {
  item: Pick;
  onPlay?: (youtubeId: string, youtubeUrl: string) => void;
}

function MediaIcon({ type }: { type: Pick["mediaType"] }) {
  if (type === "video") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }
  if (type === "podcast") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    );
  }
  if (type === "channel") {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function mediaLabel(type: Pick["mediaType"]): string {
  if (type === "video") return "Video";
  if (type === "podcast") return "Podcast";
  if (type === "channel") return "Channel";
  return "Article";
}

function ctaLabel(type: Pick["mediaType"]): string {
  if (type === "video") return "Watch";
  if (type === "podcast") return "Listen";
  if (type === "channel") return "Subscribe";
  return "Read";
}

/** Extract YouTube video ID from URL */
function extractYtId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function PickCard({ item, onPlay }: PickCardProps) {
  const isPlayable = (item.mediaType === "video" || item.mediaType === "podcast");
  const ytId = extractYtId(item.url);
  const canPlayInModal = isPlayable && ytId && onPlay;

  const handleClick = (e: React.MouseEvent) => {
    if (canPlayInModal) {
      e.preventDefault();
      onPlay(ytId, item.url);
    }
  };

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      onClick={handleClick}
    >
      <div
        className="border border-[var(--color-border)] overflow-hidden bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col h-full"
        style={{ borderRadius: "16px" }}
      >
        {/* Thumbnail */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            background: item.thumbnailGradient,
            minHeight: "200px",
          }}
        >
          {item.thumbnailUrl && (
            <>
              <img
                src={item.thumbnailUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover md:[filter:saturate(0.65)_brightness(1.08)_contrast(0.92)] transition-all duration-[500ms] md:group-hover:[filter:none]"
              />
              <div className="absolute inset-0 md:bg-[rgba(248,243,230,0.45)] bg-transparent transition-opacity duration-[500ms] md:group-hover:opacity-0" />
            </>
          )}

          {/* Media type badge */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-semibold tracking-[0.04em] text-white bg-white/15 backdrop-blur-md z-[2]">
            <MediaIcon type={item.mediaType} />
            {mediaLabel(item.mediaType)}
          </span>

          {/* Play button — video/podcast only */}
          {isPlayable && (
            <div className="z-[2] w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-[400ms] group-hover:scale-110 group-hover:bg-[var(--color-accent)] group-hover:text-white text-[var(--color-text)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-[2px]">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          )}

          {/* Duration badge */}
          {item.duration && isPlayable && (
            <span className="absolute bottom-3 right-3 z-[2] bg-black/70 text-white text-[0.72rem] font-semibold px-2.5 py-1 rounded-md tracking-[0.04em]">
              {item.duration}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-[0.72rem] font-semibold text-[var(--color-accent)] uppercase tracking-[0.1em] mb-2">
            {item.source}
          </div>
          <h3 className="font-display text-[1.125rem] font-semibold leading-[1.35] tracking-[-0.01em] mb-2">
            {item.title}
          </h3>
          <p className="text-[0.85rem] text-[var(--color-text-secondary)] leading-[1.6] font-light mb-3 line-clamp-3">
            {item.excerpt}
          </p>
          {item.note && (
            <p className="text-[0.78rem] text-[var(--color-text-secondary)] leading-[1.5] italic mb-4 opacity-70">
              &ldquo;{item.note}&rdquo; <span className="not-italic font-medium">&mdash; Pedro</span>
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--color-accent)] group-hover:gap-2.5 transition-all duration-[400ms] mt-auto">
            {ctaLabel(item.mediaType)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
