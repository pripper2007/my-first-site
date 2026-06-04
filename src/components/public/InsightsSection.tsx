import type { Insight } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import InsightListRow from "@/components/public/InsightListRow";

/**
 * InsightsSection — homepage component showing the featured insights as a compact editorial list (small cover left —
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
