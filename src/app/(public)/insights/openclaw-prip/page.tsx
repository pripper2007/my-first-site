import type { Metadata } from "next";

const TITLE = "OpenClaw, PRIP e o futuro dos agentes pessoais";
const DESCRIPTION =
  "O que eu aprendi construindo o PRIP, meu agente pessoal baseado no OpenClaw, e para onde os agentes de IA estão caminhando.";
const OG_IMAGE = "/images/insights/openclaw-prip-cover.jpg";
const URL = "https://pedroripper.com/insights/openclaw-prip";

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
    images: [{ url: OG_IMAGE, width: 1400, height: 781, alt: TITLE }],
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
 * self-contained CSS, fonts, and base64 images without conflicts.
 * The HTML file lives at /articles/openclaw-prip.html in public/.
 */
export default function OpenClawArticlePage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/openclaw-prip.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="OpenClaw, PRIP e o futuro dos agentes pessoais"
      />
    </div>
  );
}
