import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O projeto de IA que mudou o meu jogo: da minha saúde ao futuro da Bemobi",
  description:
    "Como o padrão de base de conhecimento (LLM Wiki, de Andrej Karpathy) virou um motor de correlação para a minha saúde — e estratégia na Bemobi.",
  alternates: {
    canonical: "https://pedroripper.com/insights/base-de-conhecimento",
  },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/base-de-conhecimento.html in public/.
 */
export default function BaseDeConhecimentoPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/base-de-conhecimento.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="O projeto de IA que mudou o meu jogo: da minha saúde ao futuro da Bemobi"
      />
    </div>
  );
}
