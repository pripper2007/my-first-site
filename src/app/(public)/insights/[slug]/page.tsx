import { notFound } from "next/navigation";
import Link from "next/link";
import { getInsightBySlug } from "@/lib/content";
import InsightArticleContent from "@/components/public/InsightArticleContent";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return { title: "Not Found" };

  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `https://pedroripper.com/insights/${insight.slug}` },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  if (!insight) notFound();

  return (
    <article className="pt-[120px] pb-[120px]">
      <div className="max-w-[720px] mx-auto px-5 md:px-12">
        {/* Back link */}
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[400ms] mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Insights
        </Link>

        {/* Article content with language toggle */}
        <InsightArticleContent insight={insight} />
      </div>
    </article>
  );
}
