import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conselhos de administração: distração ou oxigenação para um CEO empreendedor?",
  description:
    "Por que, sendo CEO e co-fundador de uma empresa listada, invisto tempo em conselhos de administração de outras empresas — os critérios que aplico e o que aprendi.",
  alternates: { canonical: "https://pedroripper.com/insights/conselhos-administracao-ceo" },
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
