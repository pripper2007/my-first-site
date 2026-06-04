import type { Metadata } from "next";

const TITLE = "Waymo vs Tesla: duas filosofias para chegar ao mesmo destino";
const DESCRIPTION =
  "Andei de Waymo e de Tesla com FSD na mesma viagem: duas filosofias radicalmente diferentes de direção autônoma e as perguntas que definirão o futuro da mobilidade.";
const OG_IMAGE = "/articles/images/waymo-vs-tesla/cover.png";
const URL = "https://pedroripper.com/insights/waymo-vs-tesla";

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
    images: [{ url: OG_IMAGE, width: 1400, height: 788, alt: TITLE }],
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
 * The HTML file lives at /articles/waymo-vs-tesla.html in public/.
 */
export default function WaymoVsTeslaPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/waymo-vs-tesla.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Waymo vs Tesla: duas filosofias para chegar ao mesmo destino"
      />
    </div>
  );
}
