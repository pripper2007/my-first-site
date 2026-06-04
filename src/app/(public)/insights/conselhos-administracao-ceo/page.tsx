import type { Metadata } from "next";

const TITLE =
  "Conselhos de administração: distração ou oxigenação para um CEO empreendedor?";
const DESCRIPTION =
  "Por que, sendo CEO e co-fundador de uma empresa listada, invisto tempo em conselhos de administração de outras empresas — os critérios que aplico e o que aprendi.";
const OG_IMAGE = "/articles/images/conselhos-administracao-ceo/hero.png";
const URL = "https://pedroripper.com/insights/conselhos-administracao-ceo";

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
    images: [{ url: OG_IMAGE, width: 853, height: 1280, alt: TITLE }],
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
 * The HTML file lives at /articles/conselhos-administracao-ceo.html in public/.
 */
export default function ConselhosAdministracaoCeoPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/conselhos-administracao-ceo.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Conselhos de administração: distração ou oxigenação para um CEO empreendedor?"
      />
    </div>
  );
}
