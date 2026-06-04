import type { Metadata } from "next";

const TITLE =
  "Terceirizando o IRPF para um agente de AI: 10x de produtividade (mas só na segunda rodada)";
const DESCRIPTION =
  "Deleguei meu IRPF a agentes de IA. A primeira rodada deu trabalho e ganho marginal; a segunda fez o processo em 10% do tempo, com mais qualidade.";
const OG_IMAGE = "/articles/images/irpf-agente-ia-10x/hero.png";
const URL = "https://pedroripper.com/insights/irpf-agente-ia-10x";

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
    images: [{ url: OG_IMAGE, width: 1280, height: 700, alt: TITLE }],
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
 * The HTML file lives at /articles/irpf-agente-ia-10x.html in public/.
 */
export default function IrpfAgenteIa10xPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/irpf-agente-ia-10x.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Terceirizando o IRPF para um agente de AI: 10x de produtividade (mas só na segunda rodada)"
      />
    </div>
  );
}
