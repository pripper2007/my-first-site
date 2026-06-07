import type { Metadata } from "next";
import { getInsights, getPicks } from "@/lib/content";
import TopicPage from "@/components/public/TopicPage";

const TITLE = "IA & Agentes — Pedro Ripper";
const DESCRIPTION =
  "Como Pedro Ripper pensa inteligência artificial e agentes: sistemas pessoais de IA, bases de conhecimento e uso prático no dia a dia e na Bemobi (BMOB3).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/topics/ai-agents" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/topics/ai-agents",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

const INSIGHT_TAGS = ["AI", "Agents", "OpenClaw", "Knowledge Base", "Health", "Productivity", "Mobility"];
const PICK_CATEGORIES = ["artificial-intelligence", "agentic-AI", "AGI", "LLMs", "RAG"];

export default async function AiAgentsTopicPage() {
  const [allInsights, allPicks] = await Promise.all([getInsights(), getPicks()]);
  const insights = allInsights.filter((i) => i.tags?.some((t) => INSIGHT_TAGS.includes(t)));
  const picks = allPicks
    .filter((p) => p.categories?.some((c) => PICK_CATEGORIES.includes(c)))
    .slice(0, 8);

  return (
    <TopicPage
      slug="ai-agents"
      title={TITLE}
      metaDescription={DESCRIPTION}
      eyebrow="Tópico"
      heading="IA & Agentes"
      insights={insights}
      picks={picks}
      intro={
        <>
          <p>
            Pedro Ripper trata inteligência artificial e agentes como ferramenta
            de trabalho, não como hype. O foco é prático: construir sistemas
            pessoais de IA e bases de conhecimento que correlacionam informação
            ao longo do tempo — da própria saúde à estratégia da{" "}
            <b>Bemobi (BMOB3)</b>.
          </p>
          <p>
            A tese recorrente é que o valor não está no modelo isolado, mas no
            contexto que você dá a ele: dados organizados, prompts reutilizáveis
            e agentes que executam tarefas reais. Os artigos abaixo mostram esse
            padrão aplicado, e as recomendações reúnem o que ele acompanha sobre
            o assunto.
          </p>
        </>
      }
    />
  );
}
