import { getPicks } from "@/lib/content";
import BackToHome from "@/components/shared/BackToHome";
import SectionHeader from "@/components/shared/SectionHeader";
import PicksPageGrid from "@/components/public/PicksPageGrid";

export const metadata = {
  title: "Picks",
  description: "Curated videos, podcasts, articles, and channels on AI, fintech, and technology — selected by Pedro Ripper.",
  alternates: { canonical: "https://pedroripper.com/picks" },
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
