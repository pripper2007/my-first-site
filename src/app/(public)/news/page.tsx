import { getNews } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import NewsCard from "@/components/public/NewsCard";

export const metadata = {
  title: "Notícias",
  description:
    "Cobertura da imprensa e notícias sobre a Bemobi e Pedro Ripper nos principais veículos de negócios e tecnologia.",
  alternates: { canonical: "https://pedroripper.com/news" },
  openGraph: {
    title: "Notícias | Pedro Ripper",
    description: "Cobertura da imprensa e notícias sobre a Bemobi e Pedro Ripper nos principais veículos de negócios e tecnologia.",
    url: "https://pedroripper.com/news",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Notícias | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Notícias | Pedro Ripper",
    description: "Cobertura da imprensa e notícias sobre a Bemobi e Pedro Ripper nos principais veículos de negócios e tecnologia.",
    images: ["/images/og-preview.png"],
  },
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="Na Imprensa"
          title="Todas as Notícias"
          subtitle="Cobertura e menções nos principais veículos de negócios e tecnologia."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {news.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
        {news.length === 0 && (
          <p className="text-[var(--color-text-secondary)] text-center py-12">
            Nada por aqui ainda.
          </p>
        )}
      </div>
    </section>
  );
}
