import type { Metadata } from "next";

const TITLE = "Para falar do Brasil, precisamos ir para Nova Iorque?";
const DESCRIPTION =
  "Pela quarta vez na Brazil Week em Nova York: por que o Brasil produz um tipo de troca quando sai de si mesmo que não consegue gerar em casa.";
const OG_IMAGE = "/articles/images/brazil-week-nova-iorque/cover.jpeg";
const URL = "https://pedroripper.com/insights/brazil-week-nova-iorque";

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
    images: [{ url: OG_IMAGE, width: 1400, height: 1050, alt: TITLE }],
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
 * The HTML file lives at /articles/brazil-week-nova-iorque.html in public/.
 */
export default function BrazilWeekNovaIorquePage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/brazil-week-nova-iorque.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Para falar do Brasil, precisamos ir para Nova Iorque?"
      />
    </div>
  );
}
