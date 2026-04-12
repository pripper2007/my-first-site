import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenClaw, PRIP e o futuro dos agentes pessoais",
  description:
    "O que eu aprendi construindo o PRIP, meu agente pessoal baseado no OpenClaw, e para onde os agentes de IA estão caminhando.",
  alternates: { canonical: "https://pedroripper.com/insights/openclaw-prip" },
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
