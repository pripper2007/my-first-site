import type { Metadata } from "next";
import Link from "next/link";
import CopyTextButton from "@/components/public/CopyTextButton";
import { PERSON_ID, WEBSITE_ID } from "@/lib/jsonld";

const TITLE = "LinkedIn Analytics Command Center — seus dados, seu painel";
const DESCRIPTION =
  "Um painel de analytics de LinkedIn self-hosted: em vez de alugar de Shield, Taplio ou Kleo, você é dono dos próprios dados. Next.js + Supabase + extensão de navegador. Código aberto.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/linkedin-analytics" },
  robots: { index: false, follow: false }, // draft until launch
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/linkedin-analytics",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/articles/images/linkedin-analytics/og-cover.jpg", width: 1200, height: 628, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/articles/images/linkedin-analytics/og-cover.jpg"] },
};

const GITHUB = "https://github.com/pripper2007/linkedin-analytics-dashboard";
const DOCS = `${GITHUB}#readme`;
const ARCH = `${GITHUB}/blob/main/docs/ARCHITECTURE.md`;
const SHORTCOMINGS = `${GITHUB}/blob/main/SHORTCOMINGS.md`;
const CLONE_CMD = "git clone https://github.com/pripper2007/linkedin-analytics-dashboard.git";

const LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pedroripper.com/linkedin-analytics",
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "pt-BR",
  about: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
};

/**
 * LinkedIn Analytics project landing page — distribution page for the
 * open-source self-hosted dashboard, in the same mold as /base and
 * /irpf-skill. Content derives from the repo README + SHORTCOMINGS and
 * Pedro's own post caveats. DRAFT: noindex + not linked from home until launch.
 */
export default function LinkedInAnalyticsPage() {
  const section = "mt-12 pt-10 border-t border-[var(--color-border)]";
  const h2 = "text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-6";
  const li = "leading-[1.7] text-[var(--color-text)]";

  return (
    <article className="pt-[120px] pb-[120px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            Projeto · Analytics de LinkedIn
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.04] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          Seu próprio painel de analytics de LinkedIn
        </h1>
        <p className="mt-5 text-[1.1rem] leading-[1.75] font-light text-[var(--color-text)]">
          Ferramentas de analytics de LinkedIn cobram de US$ 8 a 149 por mês por
          algo que é, no fundo, <b>o seu próprio dado</b>. Este projeto é uma
          alternativa gratuita e <b>self-hosted</b>: roda no plano grátis da
          Vercel, guarda cada byte num banco que é seu, e vai mais fundo que as
          pagas — drill-down demográfico por post, comparação por cohort, valor
          de mídia espontânea, checklist de conteúdo e uma crítica de escrita por
          IA em cada post. Nasceu do experimento que contei no artigo{" "}
          <Link href="/insights/linkedin-analytics" className="text-[var(--color-accent)] hover:underline">
            sobre o projeto que furou o escopo
          </Link>
          .
        </p>

        {/* Caveats — from the repo WARNING + the post's own ressalva */}
        <div className="mt-7 bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] rounded-[var(--radius-sm)] px-5 py-4 text-[0.95rem] leading-[1.65] text-[var(--color-text)]">
          <p className="font-semibold mb-2">⚠️ Leia antes de usar</p>
          <ul className="list-disc pl-5 flex flex-col gap-2 m-0">
            <li>
              Automatiza a extração do <b>seu próprio</b> analytics, a partir da
              sua sessão autenticada do LinkedIn. Não raspa dados de terceiros, e
              é para uso pessoal e não comercial.
            </li>
            <li>
              Vive numa zona cinzenta dos Termos de Serviço e pode quebrar quando
              o LinkedIn muda suas entranhas. A extensão de navegador é a parte
              mais frágil — veja{" "}
              <a href={SHORTCOMINGS} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
                SHORTCOMINGS.md
              </a>
              .
            </li>
            <li>
              Não tem a maturidade de um produto profissional: ainda tem bugs.
              Funcionalmente, porém, não está longe.
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mt-8">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 transition-all duration-300">
            <span aria-hidden>↗</span> Ver no GitHub
          </a>
          <a href={ARCH} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-300">
            <span aria-hidden>📐</span> Documentação
          </a>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-[0.88rem] text-[var(--color-text-secondary)]">
              Ou clone e siga o README:
            </span>
            <CopyTextButton text={CLONE_CMD} />
          </div>
          <pre className="m-0 bg-[#0f1720] text-[#e6edf3] rounded-[var(--radius-md)] px-4 py-3.5 overflow-x-auto text-[12.5px] leading-[1.6] font-mono whitespace-pre">
            {CLONE_CMD}
          </pre>
        </div>

        {/* What it does */}
        <section className={section}>
          <h2 className={h2}>O que faz</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}>
              <b>Analytics por post</b> — impressões, alcance, taxa de engajamento,
              seguidores ganhos e o breakdown de reações, com <b>ranking por
              percentil</b> e <b>comparação por cohort</b> (mesmo tema + formato).
            </li>
            <li className={li}>
              <b>Audiência e demografia</b> — drill-down por post (localização,
              senioridade, cargo, empresa, setor) e uma visão agregada.
            </li>
            <li className={li}>
              <b>Camada de IA</b> (opcional) — nuvem de ideias por clusterização de
              temas e uma <b>crítica de escrita por post</b>, com rubrica que você
              controla.
            </li>
            <li className={li}>
              <b>Mais</b> — valor de mídia espontânea, log de atividade, visão de
              network e uma página de <i>data-health</i> com import manual.
            </li>
          </ul>
        </section>

        {/* Stack */}
        <section className={section}>
          <h2 className={h2}>Arquitetura, em uma linha</h2>
          <p className="leading-[1.75] text-[var(--color-text)]">
            Três camadas alimentam um banco: uma <b>extensão de Chrome</b> que lê
            a API interna do LinkedIn na sua sessão e envia pro seu servidor;
            <b> funções na Vercel</b> (Next.js 14) para ingestão, importação e a
            análise por IA; e <b>Postgres no Supabase</b> com schema versionado
            (Drizzle). Stack: Next.js · TypeScript · Tailwind · Recharts ·
            Supabase · Drizzle · Vercel Blob · Anthropic SDK.
          </p>
        </section>

        <p className="mt-12 pt-8 border-t border-[var(--color-border)] text-[0.9rem] text-[var(--color-text-secondary)] leading-[1.7]">
          Código aberto (MIT) no{" "}
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">GitHub</a>.
          Um projeto pessoal: use por sua conta, para estudo e uso pessoal.
        </p>
      </div>
    </article>
  );
}
