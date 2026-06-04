import { getInsights } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import InsightListRow from "@/components/public/InsightListRow";

export const metadata = {
  title: "Insights",
  description: "Original thoughts on AI, payments, technology, and leadership by Pedro Ripper.",
  alternates: { canonical: "https://pedroripper.com/insights" },
};

/**
 * Insights listing page — all visible insights as an editorial list:
 * compact cover left (animated looping video when available),
 * title/excerpt/meta right.
 */
export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="INSIGHTS"
          title="Writing"
          subtitle="Original thoughts on AI, payments, technology, and leadership."
        />

        <div className="flex flex-col">
          {insights.map((item, i) => (
            <InsightListRow key={item.id} item={item} topBorder={i > 0} />
          ))}
        </div>

        {insights.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            No insights yet.
          </p>
        )}
      </div>
    </section>
  );
}
