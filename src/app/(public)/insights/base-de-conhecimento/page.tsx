import type { Metadata } from "next";

const TITLE =
  "O projeto de IA que mudou o meu jogo: da minha saúde ao futuro da Bemobi";
const DESCRIPTION =
  "Como o padrão de base de conhecimento (LLM Wiki, de Andrej Karpathy) virou um motor de correlação para a minha saúde — e estratégia na Bemobi.";
const OG_IMAGE = "/articles/images/base-de-conhecimento/cover-hd.png";
const URL = "https://pedroripper.com/insights/base-de-conhecimento";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "Pedro Ripper",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1888, height: 1280, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/base-de-conhecimento.html in public/.
 */
export default function BaseDeConhecimentoPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/base-de-conhecimento.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="O projeto de IA que mudou o meu jogo: da minha saúde ao futuro da Bemobi"
      />
    </div>
  );
}
