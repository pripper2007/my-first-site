import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dirigi Teslas por 12 anos. Essa semana, o carro finalmente dirigiu por mim.",
  description:
    "Aluguei um Cybertruck com FSD v14.3 e Grok mode e, pela primeira vez em mais de uma década, não toquei no volante. A virada das redes neurais end-to-end e os world models.",
  alternates: { canonical: "https://pedroripper.com/insights/tesla-fsd-12-anos" },
};

/**
 * Standalone HTML article — served as an iframe to preserve its
 * self-contained CSS and fonts (same mechanism as openclaw-prip).
 * The HTML file lives at /articles/tesla-fsd-12-anos.html in public/.
 */
export default function TeslaFsd12AnosPage() {
  return (
    <div className="w-full" style={{ minHeight: "100vh" }}>
      <iframe
        src="/articles/tesla-fsd-12-anos.html"
        className="w-full border-0"
        style={{ minHeight: "100vh", height: "100vh" }}
        title="Dirigi Teslas por 12 anos. Essa semana, o carro finalmente dirigiu por mim."
      />
    </div>
  );
}
