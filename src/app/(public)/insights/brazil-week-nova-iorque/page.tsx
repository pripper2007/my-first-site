import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para falar do Brasil, precisamos ir para Nova Iorque?",
  description:
    "Pela quarta vez na Brazil Week em Nova York: por que o Brasil produz um tipo de troca quando sai de si mesmo que não consegue gerar em casa.",
  alternates: { canonical: "https://pedroripper.com/insights/brazil-week-nova-iorque" },
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
