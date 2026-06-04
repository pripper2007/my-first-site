import Link from "next/link";
import type { Insight } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import InsightListRow from "@/components/public/InsightListRow";

/**
 * InsightsSection — homepage component showing the BASE kit CTA followed by
 * the featured insights as a compact editorial list (small cover left —
 * animated looping video when available — content right).
 * Full archive at /insights via "See More".
 */
interface InsightsSectionProps {
  items: Insight[];
}

export default function InsightsSection({ items }: InsightsSectionProps) {
  const featured = items.slice(0, 5);
  if (featured.length === 0) return null;

  return (
    <section id="insights" className="py-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        {/* BASE kit CTA — health knowledge-base playbook + prompt */}
        <ScrollReveal>
          <Link
            href="/base"
            className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-5 hover:border-[var(--color-accent)] transition-colors duration-[400ms]"
          >
            <div>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full">
                O kit BASE
              </span>
              <p className="mt-3 text-[1.05rem] font-medium text-[var(--color-text)]">
                Base de conhecimento de saúde
              </p>
              <p className="text-[0.92rem] text-[var(--color-text-secondary)] font-light">
                O playbook (PDF) + o prompt para montar a sua, com IA, em ~20
                minutos.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all duration-[400ms] whitespace-nowrap shrink-0">
              Acessar o kit
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal>
          <SectionHeader
            label="Insights"
            title="Writing"
            subtitle="Original thoughts on AI, payments, technology, and leadership."
            seeMoreHref="/insights"
          />
        </ScrollReveal>

        {/* Featured list — small cover left, content right */}
        <div className="flex flex-col">
          {featured.map((item, i) => (
            <ScrollReveal key={item.id}>
              <InsightListRow item={item} topBorder={i > 0} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
