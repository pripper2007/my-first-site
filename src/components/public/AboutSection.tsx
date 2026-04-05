import type { Bio } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * Bio/About section — section header with subtitle, two-column grid
 * with drop-cap bio text and highlight cards using SVG icons.
 * Matches the new HTML reference.
 */

/* SVG icons matching the new reference */
const highlightIcons: Record<string, React.ReactNode> = {
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  globe: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  book: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  rocket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M20 8v6M23 11h-6" />
    </svg>
  ),
};

interface AboutSectionProps {
  bio: Bio;
}

export default function AboutSection({ bio }: AboutSectionProps) {
  return (
    <section id="about" className="py-[120px] bg-[var(--color-bg-alt)]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <ScrollReveal>
          <SectionHeader
            label="About"
            title="Building digital payments<br>and AI at scale"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Bio text with drop cap */}
          <ScrollReveal>
            <div>
              {bio.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-[1.05rem] leading-[1.85] text-[var(--color-text-secondary)] mb-6 font-light ${
                    i === 0
                      ? "[&::first-letter]:font-display [&::first-letter]:text-[3.5rem] [&::first-letter]:font-bold [&::first-letter]:text-[var(--color-accent)] [&::first-letter]:float-left [&::first-letter]:leading-none [&::first-letter]:mr-3 [&::first-letter]:mt-1"
                      : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              {/* Stats — right after the bio text */}
              <div className="flex flex-wrap gap-12 mt-10 pt-10 border-t border-[var(--color-border)] max-[768px]:flex-col max-[768px]:gap-5">
                {bio.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-[2.4rem] font-bold tracking-[-0.03em] text-[var(--color-text)]">
                      {stat.value}
                    </div>
                    <div className="text-[0.78rem] text-[var(--color-text-secondary)] mt-1 uppercase tracking-[0.08em] font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Highlight cards with SVG icons */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col gap-6">
              {bio.highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="px-8 py-7 bg-[var(--color-bg)] border border-[var(--color-border)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--color-accent)] hover:shadow-[0_8px_32px_rgba(200,162,81,0.08)] hover:-translate-y-0.5"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-[10px] bg-[var(--color-accent-light)] flex items-center justify-center mb-4 text-[var(--color-accent)]">
                    {highlightIcons[highlight.icon] ?? highlightIcons.star}
                  </div>
                  <div className="font-display text-[1.15rem] font-semibold mb-1.5">
                    {highlight.title}
                  </div>
                  <div className="text-[0.88rem] text-[var(--color-text-secondary)] leading-relaxed font-light">
                    {highlight.description}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
