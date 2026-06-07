import type { Metadata } from "next";
import { getInsights, getVideos } from "@/lib/content";
import TopicPage from "@/components/public/TopicPage";

const TITLE = "Pagamentos digitais & fintech — Pedro Ripper";
const DESCRIPTION =
  "Como Pedro Ripper, CEO da Bemobi (BMOB3), pensa pagamentos digitais e fintech: Pix, infraestrutura de cobrança e software de pagamentos para grandes empresas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/topics/digital-payments" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/topics/digital-payments",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

const INSIGHT_TAGS = ["Payments", "Fintech"];
const VIDEO_CATEGORIES = ["payments", "pix", "financials", "fintech"];

export default async function DigitalPaymentsTopicPage() {
  const [allInsights, allVideos] = await Promise.all([getInsights(), getVideos()]);
  const insights = allInsights.filter((i) => i.tags?.some((t) => INSIGHT_TAGS.includes(t)));
  const videos = allVideos.filter((v) => v.categories?.some((c) => VIDEO_CATEGORIES.includes(c)));

  return (
    <TopicPage
      slug="digital-payments"
      title={TITLE}
      metaDescription={DESCRIPTION}
      eyebrow="Tópico"
      heading="Pagamentos digitais & fintech"
      insights={insights}
      videos={videos}
      intro={
        <>
          <p>
            Pagamentos são o núcleo do trabalho de Pedro Ripper. À frente da{" "}
            <b>Bemobi (BMOB3)</b>, liderou a evolução da empresa de serviços
            móveis para uma plataforma de pagamentos digitais e software que
            atende grandes empresas em mais de 50 países.
          </p>
          <p>
            O olhar dele é de infraestrutura: como cobrar, conciliar e reduzir
            atrito em escala — do Pix a meios de pagamento recorrentes. As
            entrevistas e palestras abaixo trazem esse contexto direto, sem
            jargão, normalmente ligado a resultados e estratégia da companhia.
          </p>
        </>
      }
    />
  );
}
