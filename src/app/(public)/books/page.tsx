import { getBooks } from "@/lib/content";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";
import BooksPageGrid from "@/components/public/BooksPageGrid";

export const metadata = {
  title: "Livros",
  description:
    "201 livros sobre tecnologia, negócios, liderança e ficção científica que moldaram o modo de pensar de Pedro Ripper como CEO e empreendedor.",
  alternates: { canonical: "https://pedroripper.com/books" },
  openGraph: {
    title: "Livros | Pedro Ripper",
    description: "201 livros sobre tecnologia, negócios, liderança e ficção científica que moldaram o modo de pensar de Pedro Ripper como CEO e empreendedor.",
    url: "https://pedroripper.com/books",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: "Livros | Pedro Ripper" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livros | Pedro Ripper",
    description: "201 livros sobre tecnologia, negócios, liderança e ficção científica que moldaram o modo de pensar de Pedro Ripper como CEO e empreendedor.",
    images: ["/images/og-preview.png"],
  },
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
          label="Lista de Leitura"
          title="Todos os Livros"
          subtitle="Livros que moldaram meu modo de pensar sobre tecnologia, negócios e liderança."
        />
        <BooksPageGrid items={books} tags={tags} />
      </div>
    </section>
  );
}
