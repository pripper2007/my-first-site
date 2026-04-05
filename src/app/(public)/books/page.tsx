import { getBooks } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import BooksPageGrid from "@/components/public/BooksPageGrid";

export const metadata = {
  title: "Books",
  description: "201 books on technology, business, leadership, and science fiction that shaped Pedro Ripper's thinking as a CEO and entrepreneur.",
  alternates: { canonical: "https://pedroripper.com/books" },
};

export default async function BooksPage() {
  const books = await getBooks();

  /* Extract unique tags for the filter */
  const tags = Array.from(new Set(books.map((b) => b.tag).filter(Boolean))).sort();

  return (
    <section className="pt-[120px] pb-[120px]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <BackToHome />
        <SectionHeader
          label="Reading List"
          title="All Books"
          subtitle="Books that have shaped my thinking on technology, business, and leadership."
        />
        <BooksPageGrid items={books} tags={tags} />
      </div>
    </section>
  );
}
