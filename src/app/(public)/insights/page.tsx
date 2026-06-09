import { getInsights } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import InsightListRow from "@/components/public/InsightListRow";

export const metadata = {
  title: "Insights",
  description:
    "Pensamentos originais sobre IA, pagamentos, tecnologia e liderança, por Pedro Ripper.",
  alternates: { canonical: "https://pedroripper.com/insights" },
  openGraph: {
    title: "Insights | Pedro Ripper",
    description: "Pensamentos originais sobre IA, pagamentos, tecnologia e liderança, por Pedro Ripper.",
    url: "https://pedroripper.com/insights",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Insights | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Pedro Ripper",
    description: "Pensamentos originais sobre IA, pagamentos, tecnologia e liderança, por Pedro Ripper.",
    images: ["/images/og-preview.png"],
  },
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
          title="Artigos"
          subtitle="Pensamentos originais sobre IA, pagamentos, tecnologia e liderança."
        />

        <div className="flex flex-col">
          {insights.map((item, i) => (
            <InsightListRow key={item.id} item={item} topBorder={i > 0} />
          ))}
        </div>

        {insights.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            Nada por aqui ainda.
          </p>
        )}
      </div>
    </section>
  );
}
