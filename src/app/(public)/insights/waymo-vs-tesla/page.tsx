import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waymo vs Tesla: duas filosofias para chegar ao mesmo destino",
  description:
    "Andei de Waymo e de Tesla com FSD na mesma viagem: duas filosofias radicalmente diferentes de direção autônoma e as perguntas que definirão o futuro da mobilidade.",
  alternates: { canonical: "https://pedroripper.com/insights/waymo-vs-tesla" },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/waymo-vs-tesla.html in public/.
 */
export default function WaymoVsTeslaPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/waymo-vs-tesla.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Waymo vs Tesla: duas filosofias para chegar ao mesmo destino"
      />
    </div>
  );
}
