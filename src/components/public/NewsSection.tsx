import type { NewsItem } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import NewsCard from "./NewsCard";

/**
 * News section — header with subtitle, 3-column card grid.
 */
interface NewsSectionProps {
  items: NewsItem[];
}

export default function NewsSection({ items }: NewsSectionProps) {
  return (
    <section id="news" className="py-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <ScrollReveal>
          <SectionHeader
            label="In the Press"
            title="Recent News"
            subtitle="Latest coverage and mentions from leading business and technology publications."
            seeMoreHref="/news"
          />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
