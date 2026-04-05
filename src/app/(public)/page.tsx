import { getFeaturedNews, getFeaturedVideos, getFeaturedBooks, getFeaturedPicks, getNews, getVideos, getBooks, getPicks } from "@/lib/content";
import Hero from "@/components/public/Hero";
import PicksSection from "@/components/public/PicksSection";
import BooksSection from "@/components/public/BooksSection";
import VideosSection from "@/components/public/VideosSection";
import NewsSection from "@/components/public/NewsSection";
import ContentMapSection from "@/components/public/ContentMapSection";

/**
 * Homepage — curated content first, bio lives on /about.
 * Order: Hero → Picks → Books → Talks → News
 * Shows ALL featured items (no limit — CMS controls what's featured).
 */
export default async function HomePage() {
  const [news, videos, books, picks, allNews, allVideos, allBooks, allPicks] = await Promise.all([
    getFeaturedNews(),
    getFeaturedVideos(),
    getFeaturedBooks(),
    getFeaturedPicks(),
    getNews(),
    getVideos(),
    getBooks(),
    getPicks(),
  ]);

  return (
    <>
      <Hero />
      <PicksSection items={picks} />
      <BooksSection items={books} />
      <VideosSection items={videos} />
      <NewsSection items={news} />
      <ContentMapSection
        signals={allNews.length}
        talks={allVideos.length}
        bookshelf={allBooks.length}
        picks={allPicks.length}
      />
    </>
  );
}
