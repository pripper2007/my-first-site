import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastei tempo demais no projeto de IA errado. E faria de novo.",
  description:
    "Comecei um projeto de IA que achei que levaria duas horas e terminei com uma plataforma inteira. Furou o escopo — e ainda assim faria de novo.",
  alternates: { canonical: "https://pedroripper.com/insights/projeto-ia-errado" },
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
