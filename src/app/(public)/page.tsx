import { getFeaturedNews, getFeaturedVideos, getFeaturedBooks, getFeaturedPicks, getFeaturedInsights, getNews, getVideos, getBooks, getPicks, getInsights } from "@/lib/content";
import Hero from "@/components/public/Hero";
import InsightsSection from "@/components/public/InsightsSection";
import PicksSection from "@/components/public/PicksSection";
import BooksSection from "@/components/public/BooksSection";
import VideosSection from "@/components/public/VideosSection";
import NewsSection from "@/components/public/NewsSection";
import ContentMapSection from "@/components/public/ContentMapSection";

/**
 * Homepage — Hero → Insights → Picks → Books → Talks → News → Content Atlas
 */
export default async function HomePage() {
  const [news, videos, books, picks, insights, allNews, allVideos, allBooks, allPicks, allInsights] = await Promise.all([
    getFeaturedNews(),
    getFeaturedVideos(),
    getFeaturedBooks(),
    getFeaturedPicks(),
    getFeaturedInsights(1),
    getNews(),
    getVideos(),
    getBooks(),
    getPicks(),
    getInsights(),
  ]);

  return (
    <>
      <Hero />
      <InsightsSection items={insights} />
      <PicksSection items={picks} />
      <BooksSection items={books} />
      <VideosSection items={videos} />
      <NewsSection items={news} />
      <ContentMapSection
        signals={allNews.length}
        talks={allVideos.length}
        bookshelf={allBooks.length}
        picks={allPicks.length}
        insights={allInsights.length}
      />
    </>
  );
}
