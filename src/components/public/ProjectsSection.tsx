import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * ProjectsSection — quick access to Pedro's AI project kits, right below
 * the hero. Compact cards side by side (newest first, dated), each linking
 * to the project's distribution page. Scales by adding entries to PROJECTS.
 */
const PROJECTS = [
  {
    href: "/base",
    kicker: "O kit BASE",
    date: "jun 2026",
    title: "Base de conhecimento de saúde",
    desc: "O playbook (PDF) + o prompt para montar a sua, com IA, em ~20 minutos.",
  },
  {
    href: "/irpf-skill",
    kicker: "Skill IRPF Anual",
    date: "mai 2026",
    title: "IRPF Anual — Skill para Claude",
    desc: "A declaração conduzida em 5 rounds — GitHub, ZIP ou instalação via terminal.",
  },
  {
    href: "/linkedin-analytics",
    kicker: "Analytics de LinkedIn",
    date: "jun 2026",
    title: "Seu próprio painel de LinkedIn",
    desc: "Analytics self-hosted, dono dos seus dados. Open-source: repositório + documentação.",
    cta: "Acessar o projeto",
  },
  {
    href: "/album-figurinhas",
    kicker: "Álbum de figurinhas",
    date: "jun 2026",
    title: "Crie o seu álbum digital",
    desc: "Álbum da Copa local-first: marque, troque e acompanhe. App ao vivo ou o projeto aberto.",
    cta: "Acessar o projeto",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="pt-[120px] pb-0">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-7">
            <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
            <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
              Projetos pessoais de IA
            </span>
            <span className="text-[0.8rem] text-[var(--color-text-secondary)] font-light">
              coisas que construo para o meu próprio uso — e compartilho prontas pra quem quiser testar
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((p) => (
            <ScrollReveal key={p.href}>
              <Link
                href={p.href}
                className="group flex flex-col h-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-5 hover:border-[var(--color-accent)] transition-colors duration-[400ms]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full">
                    {p.kicker}
                  </span>
                  <span className="text-[0.75rem] text-[var(--color-text-secondary)] uppercase tracking-[0.06em]">
                    {p.date}
                  </span>
                </div>
                <p className="mt-3 text-[1.05rem] font-medium text-[var(--color-text)]">
                  {p.title}
                </p>
                <p className="text-[0.92rem] text-[var(--color-text-secondary)] font-light leading-[1.6]">
                  {p.desc}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-accent)] group-hover:gap-3 transition-all duration-[400ms]">
                  {p.cta ?? "Acessar o kit"}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
