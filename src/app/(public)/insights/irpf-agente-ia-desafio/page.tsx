import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dá pra terceirizar o IRPF pra um agente de AI?",
  description:
    "Um desafio de fim de semana: usar Claude Code (ou Codex com computer use) para fazer e revisar o imposto de renda, da extração dos informes à transmissão.",
  alternates: { canonical: "https://pedroripper.com/insights/irpf-agente-ia-desafio" },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/irpf-agente-ia-desafio.html in public/.
 */
export default function IrpfAgenteIaDesafioPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/irpf-agente-ia-desafio.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Dá pra terceirizar o IRPF pra um agente de AI?"
      />
    </div>
  );
}
