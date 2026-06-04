import type { Metadata } from "next";

const TITLE = "O caminho seguro, confortável e ERRADO";
const DESCRIPTION =
  "Reflexões de uma semana entre o LATAM Tech Forum e a Brazil Week sobre o ruído, as distorções e as perguntas sobre IA que todo CEO deveria estar se fazendo em 2026.";
const OG_IMAGE = "/articles/images/caminho-seguro-confortavel-errado/hero.png";
const URL =
  "https://pedroripper.com/insights/caminho-seguro-confortavel-errado";

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
    images: [{ url: OG_IMAGE, width: 1400, height: 786, alt: TITLE }],
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
 * The HTML file lives at /articles/caminho-seguro-confortavel-errado.html in public/.
 */
export default function CaminhoSeguroConfortavelErradoPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/caminho-seguro-confortavel-errado.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="O caminho seguro, confortável e ERRADO"
      />
    </div>
  );
}
