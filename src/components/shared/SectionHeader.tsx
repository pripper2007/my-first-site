import Link from "next/link";

/**
 * Section header — gold label with line prefix, large title,
 * optional subtitle, and optional "See More..." link.
 */
interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  seeMoreHref?: string;
}

export default function SectionHeader({ label, title, subtitle, seeMoreHref }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-16">
      <div>
        {/* Gold label with line prefix */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            {label}
          </span>
        </div>
        <h2
          className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-[var(--color-text)]"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle && (
          <p className="text-[1.05rem] text-[var(--color-text-secondary)] mt-4 max-w-[560px] leading-[1.7] font-light">
            {subtitle}
          </p>
        )}
      </div>

      {seeMoreHref && (
        <Link
          href={seeMoreHref}
          className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-accent)] hover:gap-3 transition-all duration-[400ms] whitespace-nowrap shrink-0 pb-1"
        >
          See More...
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-[1px]"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
