import { getPicks } from "@/lib/content";
import BackToHome from "@/components/shared/BackToHome";
import SectionHeader from "@/components/shared/SectionHeader";
import PicksPageGrid from "@/components/public/PicksPageGrid";

export const metadata = {
  title: "Picks",
  description:
    "Curated videos, podcasts, articles, and channels on AI, fintech, and technology — selected by Pedro Ripper.",
  alternates: { canonical: "https://pedroripper.com/picks" },
  openGraph: {
    title: "Picks | Pedro Ripper",
    description: "Curated videos, podcasts, articles, and channels on AI, fintech, and technology — selected by Pedro Ripper.",
    url: "https://pedroripper.com/picks",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Picks | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Picks | Pedro Ripper",
    description: "Curated videos, podcasts, articles, and channels on AI, fintech, and technology — selected by Pedro Ripper.",
    images: ["/images/og-preview.png"],
  },
};

/**
 * Full picks listing page — server component that fetches all
 * picks and passes them to the client component for filtering.
 */
export default async function PicksPage() {
  const picks = await getPicks();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="Curated by Pedro"
          title="Picks"
        />
        <PicksPageGrid items={picks} />
        {picks.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            No picks yet.
          </p>
        )}
      </div>
    </section>
  );
}
