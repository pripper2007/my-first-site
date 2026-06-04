import type { Metadata } from "next";

const TITLE = "Dá pra terceirizar o IRPF pra um agente de AI?";
const DESCRIPTION =
  "Um desafio de fim de semana: usar Claude Code (ou Codex com computer use) para fazer e revisar o imposto de renda, da extração dos informes à transmissão.";
const OG_IMAGE = "/articles/images/irpf-agente-ia-desafio/hero.png";
const URL = "https://pedroripper.com/insights/irpf-agente-ia-desafio";

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
    images: [{ url: OG_IMAGE, width: 1280, height: 778, alt: TITLE }],
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
 * The HTML file lives at /articles/irpf-agente-ia-desafio.html in public/.
 */
export default function IrpfAgenteIaDesafioPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/irpf-agente-ia-desafio.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Dá pra terceirizar o IRPF pra um agente de AI?"
      />
    </div>
  );
}
