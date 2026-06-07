import type { Metadata } from "next";
import { getInsights, getFeaturedBooks, getPicks } from "@/lib/content";
import TopicPage from "@/components/public/TopicPage";

const TITLE = "Livros & aprendizado — Pedro Ripper";
const DESCRIPTION =
  "Como Pedro Ripper aborda livros e aprendizado contínuo: leituras que moldam decisões, produtividade e a biblioteca pessoal com notas, do trabalho à vida.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/topics/books-and-learning" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/topics/books-and-learning",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

const INSIGHT_TAGS = ["Learning", "Productivity"];

export default async function BooksAndLearningTopicPage() {
  const [allInsights, featuredBooks, allPicks] = await Promise.all([
    getInsights(),
    getFeaturedBooks(8),
    getPicks(),
  ]);
  const insights = allInsights.filter((i) => i.tags?.some((t) => INSIGHT_TAGS.includes(t)));
  const books = featuredBooks.slice(0, 8);
  const picks = allPicks
    .filter((p) => p.categories?.some((c) => ["education", "engineering", "mathematics"].includes(c)))
    .slice(0, 6);

  return (
    <TopicPage
      slug="books-and-learning"
      title={TITLE}
      metaDescription={DESCRIPTION}
      eyebrow="Tópico"
      heading="Livros & aprendizado"
      insights={insights}
      books={books}
      picks={picks}
      intro={
        <>
          <p>
            Pedro Ripper lê para decidir melhor. A biblioteca dele é ampla — de
            história e ciência a negócios, psicologia e ficção científica — e
            cada livro vem com notas pessoais sobre o que ficou e por quê.
          </p>
          <p>
            Aprendizado contínuo é parte do método: ler, anotar e correlacionar
            ideias entre áreas. Abaixo estão alguns livros em destaque na
            estante, escritos sobre o tema e recomendações de conteúdo
            educacional que ele acompanha.
          </p>
        </>
      }
    />
  );
}
