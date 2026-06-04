import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O caminho seguro, confortável e ERRADO",
  description:
    "Reflexões de uma semana entre o LATAM Tech Forum e a Brazil Week sobre o ruído, as distorções e as perguntas sobre IA que todo CEO deveria estar se fazendo em 2026.",
  alternates: { canonical: "https://pedroripper.com/insights/caminho-seguro-confortavel-errado" },
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
