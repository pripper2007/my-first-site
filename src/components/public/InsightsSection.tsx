import Link from "next/link";
import Image from "next/image";
import type { Insight } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * InsightsSection — homepage component showing ONE featured insight
 * with a cover image and "Featured" badge. Two-column layout on desktop:
 * image left, text right. Stacks on mobile.
 */
interface InsightsSectionProps {
  items: Insight[];
}

export default function InsightsSection({ items }: InsightsSectionProps) {
  const featured = items[0];
  if (!featured) return null;

  return (
    <section id="insights" className="py-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <ScrollReveal>
          <SectionHeader
            label="Insights"
            title="Writing"
            subtitle="Original thoughts on AI, payments, technology, and leadership."
            seeMoreHref="/insights"
          />
        </ScrollReveal>

        <ScrollReveal>
          <Link href={`/insights/${featured.slug}`} className="block group">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
              {/* Cover image */}
              {featured.coverImage && (
                <div
                  className="relative overflow-hidden aspect-[16/9]"
                  style={{
                    borderRadius: "var(--radius-md)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
                  }}
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  {/* Subtle warm overlay */}
                  <div className="absolute inset-0 bg-[rgba(248,243,230,0.15)] transition-opacity duration-500 group-hover:opacity-0" />
                </div>
              )}

              {/* Text content */}
              <div className={featured.coverImage ? "" : "max-w-[720px]"}>
                {/* Featured badge + Date + Reading time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                  <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
                    {new Date(featured.date + "T00:00:00").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {featured.readingTime && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-40" />
                      <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
                        {featured.readingTime}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-[1.75rem] md:text-[2rem] leading-[1.2] tracking-[-0.02em] text-[var(--color-text)] mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-[400ms]">
                  {featured.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[1.05rem] text-[var(--color-text-secondary)] leading-[1.75] font-light mb-5">
                  {featured.excerpt}
                </p>

                {/* Read link */}
                <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all duration-[400ms]">
                  Read
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
