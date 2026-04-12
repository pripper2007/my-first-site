import Link from "next/link";
import { getInsights } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";

export const metadata = {
  title: "Insights",
  description: "Original thoughts on AI, payments, technology, and leadership by Pedro Ripper.",
  alternates: { canonical: "https://pedroripper.com/insights" },
};

/**
 * Insights listing page — shows all visible insights in a
 * single-column blog-style layout (not a grid).
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

        <div className="flex flex-col gap-14 max-w-[720px]">
          {insights.map((item) => (
            <article key={item.id} className="group">
              {/* Date + Reading time */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
                  {new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
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

              {/* Title */}
              <h3 className="font-display font-bold text-[1.5rem] md:text-[1.75rem] leading-[1.25] tracking-[-0.02em] text-[var(--color-text)] mb-3">
                <Link
                  href={`/insights/${item.slug}`}
                  className="hover:text-[var(--color-accent)] transition-colors duration-[400ms]"
                >
                  {item.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-[1rem] text-[var(--color-text-secondary)] leading-[1.7] font-light mb-3">
                {item.excerpt}
              </p>

              {/* Read link */}
              <Link
                href={`/insights/${item.slug}`}
                className="inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-[var(--color-accent)] hover:gap-2.5 transition-all duration-[400ms]"
              >
                Read
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </article>
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
