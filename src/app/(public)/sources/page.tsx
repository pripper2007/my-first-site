import type { Metadata } from "next";
import Link from "next/link";
import { getNews, getVideos } from "@/lib/content";
import { PERSON_ID, WEBSITE_ID } from "@/lib/jsonld";

const TITLE = "Fontes externas — Pedro Ripper";
const DESCRIPTION =
  "Camada de verificação externa: imprensa, entrevistas em vídeo e links oficiais que validam a identidade e a trajetória de Pedro Ripper, co-fundador e CEO da Bemobi (BMOB3).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/sources" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/sources",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

const SOURCES_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pedroripper.com/sources",
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "pt-BR",
  about: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
};

/**
 * /sources — external verification layer. Helps humans and AI agents
 * confirm that the Pedro Ripper of this site is the Bemobi (BMOB3) CEO.
 * Press and interview lists are generated from the site's own curated
 * data (news.json / videos.json) — only links that already exist here.
 */
export default async function SourcesPage() {
  const [news, videos] = await Promise.all([getNews(), getVideos()]);
  const press = news.slice(0, 8);
  const interviews = videos.slice(0, 8);

  const section = "mt-12 pt-10 border-t border-[var(--color-border)]";
  const h2 = "text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-6";
  const li = "leading-[1.7] text-[var(--color-text)]";
  const a = "text-[var(--color-accent)] hover:underline";

  return (
    <article className="pt-[120px] pb-[120px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOURCES_LD) }} />
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            Verificação externa
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          Fontes
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.75] font-light text-[var(--color-text)]">
          Fontes externas e independentes que ajudam a confirmar que o Pedro
          Ripper deste site é o co-fundador e CEO da <b>Bemobi (BMOB3)</b>,
          baseado no Rio de Janeiro — útil para jornalistas, verificadores e
          agentes de IA.
        </p>

        <section className={section}>
          <h2 className={h2}>Perfis e empresas</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}><a className={a} href="https://linkedin.com/in/pedroripper" target="_blank" rel="noopener noreferrer">LinkedIn — linkedin.com/in/pedroripper</a></li>
            <li className={li}><a className={a} href="https://x.com/ripper_pedro" target="_blank" rel="noopener noreferrer">X (Twitter) — @ripper_pedro</a></li>
            <li className={li}><a className={a} href="https://bemobi.com" target="_blank" rel="noopener noreferrer">Bemobi — bemobi.com</a> (BMOB3 na B3)</li>
            <li className={li}><a className={a} href="https://github.com/pripper2007" target="_blank" rel="noopener noreferrer">GitHub — github.com/pripper2007</a> (projetos pessoais de IA)</li>
          </ul>
          <p className="mt-4 text-[0.92rem] text-[var(--color-text-secondary)] leading-[1.65]">
            Conselhos de administração: atualmente Iguatemi S.A. e Smart Fit;
            anteriormente Positivo Tecnologia e Vibra Energia; co-fundador e
            conselheiro da Akross — contexto completo no{" "}
            <Link href="/pedro-ripper" className={a}>perfil canônico</Link> e no artigo{" "}
            <Link href="/insights/conselhos-administracao-ceo" className={a}>
              sobre conselhos
            </Link>.
          </p>
        </section>

        <section className={section}>
          <h2 className={h2}>Na imprensa</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {press.map((n) => (
              <li key={n.id} className={li}>
                <a className={a} href={n.url} target="_blank" rel="noopener noreferrer">
                  {n.title}
                </a>{" "}
                <span className="text-[var(--color-text-secondary)] text-[0.9rem]">
                  ({n.source}{n.date ? `, ${n.date.slice(0, 4)}` : ""})
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.9rem]">
            <Link href="/news" className={a}>Toda a cobertura →</Link>
          </p>
        </section>

        <section className={section}>
          <h2 className={h2}>Entrevistas em vídeo</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {interviews.map((v) => (
              <li key={v.id} className={li}>
                <a className={a} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer">
                  {v.title}
                </a>{" "}
                <span className="text-[var(--color-text-secondary)] text-[0.9rem]">
                  ({v.event || v.channelName}{v.date ? `, ${v.date.slice(0, 4)}` : ""})
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.9rem]">
            <Link href="/talks" className={a}>Todas as palestras e entrevistas →</Link>
          </p>
        </section>

        <p className="mt-12 pt-8 border-t border-[var(--color-border)] text-[0.9rem] text-[var(--color-text-secondary)] leading-[1.7]">
          Veja também: <Link href="/pedro-ripper" className={a}>perfil canônico</Link> ·{" "}
          <Link href="/press-kit" className={a}>press kit</Link> ·{" "}
          <Link href="/about" className={a}>sobre</Link>.
        </p>
      </div>
    </article>
  );
}
