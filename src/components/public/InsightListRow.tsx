import Link from "next/link";
import Image from "next/image";
import type { Insight } from "@/lib/types";

/**
 * One insight rendered as an editorial list row: compact cover on the left
 * (looping muted video when `coverVideo` is set, image otherwise), with
 * date/reading-time, title, excerpt and a Read link on the right.
 * Shared by the homepage Insights section and the /insights listing.
 */
export default function InsightListRow({
  item,
  topBorder = false,
}: {
  item: Insight;
  topBorder?: boolean;
}) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      className={`group flex flex-col sm:flex-row gap-5 sm:gap-9 py-8 ${
        topBorder ? "border-t border-[var(--color-border)]" : ""
      }`}
    >
      {/* Compact cover — looping video when available */}
      <div
        className="relative overflow-hidden shrink-0 w-full sm:w-[280px] aspect-[16/10]"
        style={{
          borderRadius: "var(--radius-md)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
        }}
      >
        {item.coverVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={item.coverImage}
            aria-label={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          >
            <source src={item.coverVideo} type="video/mp4" />
          </video>
        ) : item.coverImage ? (
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 280px"
          />
        ) : null}
        <div className="absolute inset-0 bg-[rgba(248,243,230,0.15)] transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
            {new Date(item.date + "T00:00:00").toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {item.readingTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-40" />
              <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
                {item.readingTime}
              </span>
            </>
          )}
        </div>

        <h3 className="font-display font-bold text-[1.35rem] md:text-[1.5rem] leading-[1.25] tracking-[-0.02em] text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-[400ms]">
          {item.title}
        </h3>

        <p className="text-[0.95rem] text-[var(--color-text-secondary)] leading-[1.6] font-light line-clamp-2">
          {item.excerpt}
        </p>

        <span className="mt-3 inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all duration-[400ms]">
          Ler
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
