import type { NewsItem } from "@/lib/types";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * News card — image area with source badge overlay, card body with
 * date, title, excerpt, and "Read article" link with arrow.
 * Matches the new HTML reference.
 */
interface NewsCardProps {
  item: NewsItem;
  index: number;
}

export default function NewsCard({ item, index }: NewsCardProps) {
  return (
    <ScrollReveal delay={index * 80}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        <div
          className="group border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-alt)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex flex-col hover:border-[var(--color-border-hover)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] hover:-translate-y-1"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {/* Image with source badge */}
          <div
            className="h-[200px] relative overflow-hidden"
            style={{ background: item.imageGradient }}
          >
            {/* Show real image if available, with warm gold overlay */}
            {(item.imageUrl || item.thumbnailUrl) ? (
              <>
                <img
                  src={item.imageUrl || item.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover [filter:saturate(0.65)_brightness(1.08)_contrast(0.92)] transition-all duration-[500ms] group-hover:[filter:none]"
                />
                <div className="absolute inset-0 bg-[rgba(248,243,230,0.45)] transition-opacity duration-[500ms] group-hover:opacity-0" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.03] to-transparent" />
            )}
            <span className="absolute top-4 left-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 bg-white/[0.92] backdrop-blur-[8px] rounded-full text-[var(--color-text-secondary)] z-[1]">
              {item.source}
            </span>
          </div>

          {/* Body */}
          <div className="p-7 flex-1 flex flex-col">
            <div className="text-[0.75rem] text-[var(--color-text-secondary)] font-medium tracking-[0.04em] mb-2.5">
              {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
            <h3 className="font-display text-[1.15rem] font-semibold leading-[1.35] mb-3 tracking-[-0.01em]">
              {item.title}
            </h3>
            <p className="text-[0.88rem] text-[var(--color-text-secondary)] leading-relaxed flex-1 font-light">
              {item.excerpt}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--color-accent)] mt-5 group-hover:gap-2.5 transition-[gap] duration-[400ms]">
              Read article
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </ScrollReveal>
  );
}
