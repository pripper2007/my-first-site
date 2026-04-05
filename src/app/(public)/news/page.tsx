import { getNews } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import NewsCard from "@/components/public/NewsCard";

export const metadata = {
  title: "News",
  description: "Press coverage and news about Bemobi and Pedro Ripper from leading business and technology publications.",
  alternates: { canonical: "https://pedroripper.com/news" },
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="In the Press"
          title="All News"
          subtitle="Coverage and mentions from leading business and technology publications."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {news.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
        {news.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            No news articles yet.
          </p>
        )}
      </div>
    </section>
  );
}
