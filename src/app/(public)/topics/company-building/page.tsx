import type { Metadata } from "next";
import { getInsights, getVideos } from "@/lib/content";
import TopicPage from "@/components/public/TopicPage";

const TITLE = "Liderança & construção de empresas — Pedro Ripper";
const DESCRIPTION =
  "Como Pedro Ripper pensa liderança, governança e construção de empresas: a experiência como CEO da Bemobi (BMOB3) e conselheiro de companhias de capital aberto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/topics/company-building" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/topics/company-building",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

const INSIGHT_TAGS = ["Leadership", "Governance", "Strategy", "Business", "Brazil"];
const VIDEO_CATEGORIES = ["leadership", "strategy", "company_history", "business", "entrepreneurship", "growth"];

export default async function CompanyBuildingTopicPage() {
  const [allInsights, allVideos] = await Promise.all([getInsights(), getVideos()]);
  const insights = allInsights.filter((i) => i.tags?.some((t) => INSIGHT_TAGS.includes(t)));
  const videos = allVideos.filter((v) => v.categories?.some((c) => VIDEO_CATEGORIES.includes(c)));

  return (
    <TopicPage
      slug="company-building"
      title={TITLE}
      metaDescription={DESCRIPTION}
      eyebrow="Tópico"
      heading="Liderança & construção de empresas"
      insights={insights}
      videos={videos}
      intro={
        <>
          <p>
            Pedro Ripper escreve sobre liderança a partir da cadeira de quem
            executa: co-fundador e CEO da <b>Bemobi (BMOB3)</b>, com passagens
            executivas por Promon, Cisco e Oi, e assentos em conselhos de
            companhias de capital aberto como Iguatemi e Smart Fit.
          </p>
          <p>
            Os temas voltam sempre ao mesmo lugar — decisões difíceis,
            governança, e a diferença entre o caminho seguro e o caminho certo.
            É liderança vista de dentro de uma empresa listada, com foco em
            estratégia de longo prazo e no contexto brasileiro.
          </p>
        </>
      }
    />
  );
}
