import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terceirizando o IRPF para um agente de AI: 10x de produtividade (mas só na segunda rodada)",
  description:
    "Deleguei meu IRPF a agentes de IA. A primeira rodada deu trabalho e ganho marginal; a segunda fez o processo em 10% do tempo, com mais qualidade.",
  alternates: { canonical: "https://pedroripper.com/insights/irpf-agente-ia-10x" },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/irpf-agente-ia-10x.html in public/.
 */
export default function IrpfAgenteIa10xPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/irpf-agente-ia-10x.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Terceirizando o IRPF para um agente de AI: 10x de produtividade (mas só na segunda rodada)"
      />
    </div>
  );
}
