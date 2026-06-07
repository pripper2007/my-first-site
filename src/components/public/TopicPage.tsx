import Link from "next/link";
import InsightListRow from "@/components/public/InsightListRow";
import type { Insight, VideoItem, Pick, BookItem } from "@/lib/types";
import { PERSON_ID, WEBSITE_ID, SITE_URL } from "@/lib/jsonld";

/**
 * Shared layout for the static /topics/* pages. Each topic page builds its
 * own metadata + content selection and hands the rendered pieces here so the
 * page shell (eyebrow, intro, JSON-LD, closing links) stays consistent with
 * /press-kit and /sources. JSON-LD = WebPage (about Pedro) + BreadcrumbList.
 */
export default function TopicPage({
  slug,
  title,
  eyebrow,
  heading,
  metaDescription,
  intro,
  insights,
  videos,
  picks,
  books,
}: {
  slug: string;
  title: string;
  eyebrow: string;
  heading: string;
  metaDescription: string;
  intro: React.ReactNode;
  insights: Insight[];
  videos?: VideoItem[];
  picks?: Pick[];
  books?: BookItem[];
}) {
  const url = `${SITE_URL}/topics/${slug}`;
  const section = "mt-12 pt-10 border-t border-[var(--color-border)]";
  const h2 =
    "text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-6";
  const li = "leading-[1.7] text-[var(--color-text)]";
  const a = "text-[var(--color-accent)] hover:underline";

  const LD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: title,
        description: metaDescription,
        inLanguage: "pt-BR",
        about: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tópicos", item: `${SITE_URL}/topics` },
          { "@type": "ListItem", position: 3, name: heading, item: url },
        ],
      },
    ],
  };

  return (
    <article className="pt-[120px] pb-[120px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          {heading}
        </h1>
        <div className="mt-5 text-[1.05rem] leading-[1.75] font-light text-[var(--color-text)] flex flex-col gap-4">
          {intro}
        </div>

        {insights.length > 0 && (
          <section className={section}>
            <h2 className={h2}>Artigos</h2>
            <div className="flex flex-col">
              {insights.map((item, idx) => (
                <InsightListRow key={item.id} item={item} topBorder={idx > 0} />
              ))}
            </div>
            <p className="mt-3 text-[0.9rem]">
              <Link href="/insights" className={a}>
                Todos os artigos →
              </Link>
            </p>
          </section>
        )}

        {videos && videos.length > 0 && (
          <section className={section}>
            <h2 className={h2}>Palestras e entrevistas</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              {videos.map((v) => (
                <li key={v.id} className={li}>
                  <a className={a} href={v.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    {v.title}
                  </a>{" "}
                  <span className="text-[var(--color-text-secondary)] text-[0.9rem]">
                    ({v.event || v.channelName}
                    {v.date ? `, ${v.date.slice(0, 4)}` : ""})
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.9rem]">
              <Link href="/talks" className={a}>
                Todas as palestras e entrevistas →
              </Link>
            </p>
          </section>
        )}

        {picks && picks.length > 0 && (
          <section className={section}>
            <h2 className={h2}>Recomendações</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              {picks.map((p) => (
                <li key={p.id} className={li}>
                  <a className={a} href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </a>{" "}
                  <span className="text-[var(--color-text-secondary)] text-[0.9rem]">
                    ({p.source || p.channelName})
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.9rem]">
              <Link href="/picks" className={a}>
                Todas as recomendações →
              </Link>
            </p>
          </section>
        )}

        {books && books.length > 0 && (
          <section className={section}>
            <h2 className={h2}>Livros</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              {books.map((b) => (
                <li key={b.id} className={li}>
                  {b.amazonUrl ? (
                    <a className={a} href={b.amazonUrl} target="_blank" rel="noopener noreferrer">
                      {b.title}
                    </a>
                  ) : (
                    <b>{b.title}</b>
                  )}{" "}
                  <span className="text-[var(--color-text-secondary)] text-[0.9rem]">
                    — {b.author}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.9rem]">
              <Link href="/books" className={a}>
                Biblioteca completa →
              </Link>
            </p>
          </section>
        )}

        <p className="mt-12 pt-8 border-t border-[var(--color-border)] text-[0.9rem] text-[var(--color-text-secondary)] leading-[1.7]">
          Para o panorama completo, veja o{" "}
          <Link href="/pedro-ripper" className={a}>
            perfil canônico de Pedro Ripper
          </Link>{" "}
          e os{" "}
          <Link href="/insights" className={a}>
            artigos em Insights
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
