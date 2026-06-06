import type { Metadata } from "next";
import CopyCommandButton from "./CopyCommandButton";
import NewsletterSignup from "@/components/public/NewsletterSignup";

const TITLE = "IRPF Anual — Skill para Claude";
const DESCRIPTION =
  "A skill que conduz a sua Declaração de Ajuste Anual do IRPF em 5 rounds com Claude — do perfil simples ao complexo. GitHub, download ZIP ou instalação via terminal.";
const OG_IMAGE = "/articles/images/irpf-agente-ia-10x/hero.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/irpf-skill" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/irpf-skill",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: OG_IMAGE, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const GITHUB = "https://github.com/pripper2007/irpf-anual-skill";
const ZIP = "https://github.com/pripper2007/irpf-anual-skill/releases/latest";
const CLONE_CMD =
  "git clone https://github.com/pripper2007/irpf-anual-skill.git ~/.claude/skills/irpf-anual";

/**
 * IRPF Anual skill landing page — distribution page for the Claude Skill,
 * analogous to /base. Content derives from the repo README plus Pedro's
 * three caveats. GitHub stays canonical; this page is the friendly layer.
 */
export default function IrpfSkillPage() {
  return (
    <article className="pt-[120px] pb-[120px]">
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        {/* Hero */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            Skill IRPF Anual
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.02] text-[var(--color-text)] text-[clamp(2.6rem,7vw,4.2rem)]">
          IRPF Anual
        </h1>
        <p className="font-display text-[var(--color-accent)] text-[1.35rem] font-semibold mt-2 mb-5">
          Uma Skill de Claude para a sua Declaração de Ajuste Anual.
        </p>
        <p className="text-[1.1rem] text-[var(--color-text)] leading-[1.7] font-light">
          A skill conduz a declaração em um fluxo de <b>5 rounds</b> — triagem,
          coleta dos arquivos-âncora, análise automática, checklist customizado
          e execução do plano em 10 fases. Parte do simples (CLT, dependentes)
          e só ativa os módulos avançados (exterior, fundos, stock grants)
          quando o seu perfil exige.
        </p>

        {/* Ressalvas — Pedro's three caveats, verbatim */}
        <div className="mt-7 bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] rounded-[var(--radius-sm)] px-5 py-4 text-[0.95rem] leading-[1.65] text-[var(--color-text)]">
          <p className="font-semibold mb-2">⚠️ Ressalvas importantes</p>
          <ol className="list-decimal pl-5 flex flex-col gap-2 m-0">
            <li>
              O plano/prompt está longe de ser perfeito e não testei com
              situações diferentes das minhas — então não sei o quão
              generalizado ele realmente ficou.
            </li>
            <li>
              Isso é para quem já tem uma certa familiaridade com IA, quer se
              aventurar, e topa aprender no processo — e não necessariamente
              &ldquo;só&rdquo; ganhar tempo.
            </li>
            <li>
              Use um plano pago e configure as opções de privacidade para
              reduzir a chance dos seus dados serem usados em treinamento de
              novos modelos.
            </li>
          </ol>
        </div>

        {/* How to get it */}
        <div className="flex flex-wrap gap-3 mt-8">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 transition-all duration-300"
          >
            <span aria-hidden>↗</span> Ver no GitHub
          </a>
          <a
            href={ZIP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-300"
          >
            <span aria-hidden>⬇</span> Baixar o ZIP
          </a>
        </div>

        {/* Terminal install */}
        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-[0.88rem] text-[var(--color-text-secondary)]">
              Ou instale direto pelo terminal (quem é de Git):
            </span>
            <CopyCommandButton command={CLONE_CMD} />
          </div>
          <pre className="m-0 bg-[#0f1720] text-[#e6edf3] rounded-[var(--radius-md)] px-4 py-3.5 overflow-x-auto text-[12.5px] leading-[1.6] font-mono whitespace-pre">
            {CLONE_CMD}
          </pre>
          <p className="text-[0.88rem] text-[var(--color-text-secondary)] mt-3 leading-[1.6]">
            Depois, no app desktop do Claude (modo <b>Cowork</b> ou{" "}
            <b>Code</b>), abra a pasta do seu ano fiscal e peça para usar a
            skill <code className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-[0.85em]">irpf-anual</code>.
            Instruções completas no{" "}
            <a
              href={`${GITHUB}/blob/main/INSTALL.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] hover:underline"
            >
              INSTALL.txt
            </a>
            .
          </p>
        </div>

        {/* What it does */}
        <section className="mt-14 pt-12 border-t border-[var(--color-border)]">
          <h2 className="text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-7">
            O que a skill faz — 5 rounds
          </h2>
          <div className="flex flex-col gap-4">
            {[
              <><b>Triagem</b> — 5 perguntas curtas que detectam o tipo do seu perfil.</>,
              <><b>Coleta dos 2 arquivos-âncora</b> — declaração anterior + pré-preenchida.</>,
              <><b>Análise automática</b> — Claude extrai seu perfil patrimonial e fiscal.</>,
              <><b>Checklist customizado</b> + perguntas cirúrgicas — apenas o que mudou ou não dá pra deduzir.</>,
              <><b>Execução do plano</b> — 10 fases: coleta, parse, reconciliação, simulação, preenchimento e entrega.</>,
            ].map((body, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold flex items-center justify-center text-[0.9rem]">
                  {i + 1}
                </div>
                <p className="text-[1.02rem] leading-[1.65] text-[var(--color-text)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[0.95rem] text-[var(--color-text-secondary)] leading-[1.65]">
            Cobertura por perfil: <b>Tipo S</b> (simples: CLT, poucos bens —
            1-3 dias), <b>Tipo M</b> (múltiplas fontes, renda variável — 3-7
            dias) e <b>Tipo C</b> (exterior, fundos exclusivos, stock grants —
            7-14 dias). A maioria das pessoas é Tipo S, e a skill foi desenhada
            para essa maioria.
          </p>
        </section>

        {/* Who it's for */}
        <section className="mt-14 pt-12 border-t border-[var(--color-border)]">
          <h2 className="text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-7">
            Para quem é (e para quem não é)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
              <p className="font-semibold mb-3 text-[0.95rem]">✓ É para você se…</p>
              <ul className="flex flex-col gap-2 text-[0.92rem] leading-[1.6] text-[var(--color-text)] list-disc pl-4 m-0">
                <li>Já entregou pelo menos uma declaração IRPF antes</li>
                <li>Tem familiaridade básica com IA conversacional</li>
                <li>Quer ganhar precisão e eficiência com auxílio de IA</li>
                <li>Aceita que é uma ferramenta de assistência, não substituto de contador</li>
              </ul>
            </div>
            <div className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
              <p className="font-semibold mb-3 text-[0.95rem]">✗ Não é para você se…</p>
              <ul className="flex flex-col gap-2 text-[0.92rem] leading-[1.6] text-[var(--color-text)] list-disc pl-4 m-0">
                <li>É a sua primeira declaração (comece pelo Manual oficial da RFB)</li>
                <li>Casos muito específicos: espólio, atividade rural extensiva, múltiplos ganhos de capital imobiliários</li>
                <li>Busca substituto de contador profissional</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <div className="mt-14">
          <NewsletterSignup />
        </div>

        {/* Credit */}
        <p className="mt-14 pt-8 border-t border-[var(--color-border)] text-[0.85rem] text-[var(--color-text-secondary)] leading-[1.6]">
          Código aberto no{" "}
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline"
          >
            GitHub
          </a>
          . Nasceu do experimento contado nos artigos{" "}
          <a href="/insights/irpf-agente-ia-desafio" className="text-[var(--color-accent)] hover:underline">
            &ldquo;Dá pra terceirizar o IRPF?&rdquo;
          </a>{" "}
          e{" "}
          <a href="/insights/irpf-agente-ia-10x" className="text-[var(--color-accent)] hover:underline">
            &ldquo;10x de produtividade&rdquo;
          </a>
          . Boa sorte — espero que seja útil.
        </p>
      </div>
    </article>
  );
}
