import type { Metadata } from "next";

const TITLE = "Gastei tempo demais no projeto de IA errado. E faria de novo.";
const DESCRIPTION =
  "Comecei um projeto de IA que achei que levaria duas horas e terminei com uma plataforma inteira. Furou o escopo — e ainda assim faria de novo.";
const OG_IMAGE = "/articles/images/projeto-ia-errado/hero.png";
const URL = "https://pedroripper.com/insights/projeto-ia-errado";

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
    images: [{ url: OG_IMAGE, width: 1280, height: 720, alt: TITLE }],
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
 * The HTML file lives at /articles/projeto-ia-errado.html in public/.
 */
export default function ProjetoIaErradoPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/projeto-ia-errado.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Gastei tempo demais no projeto de IA errado. E faria de novo."
      />
    </div>
  );
}
