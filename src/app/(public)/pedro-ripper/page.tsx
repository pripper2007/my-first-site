import type { Metadata } from "next";
import Link from "next/link";
import { PROFILE_PAGE_LD } from "@/lib/jsonld";

const TITLE = "Pedro Ripper | Brazilian Technology Executive and CEO of Bemobi";
const DESCRIPTION =
  "Canonical profile of Pedro Ripper: co-founder and CEO of Bemobi (BMOB3), based in Rio de Janeiro, Brazil. Career, education, board roles, main topics and identity disambiguation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/pedro-ripper" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/pedro-ripper",
    siteName: "Pedro Ripper",
    type: "profile",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Pedro Ripper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-preview.png"],
  },
};

/**
 * Canonical entity page about Pedro Ripper — plain, well-structured,
 * crawlable HTML for humans, search engines and AI agents, with
 * Person + ProfilePage JSON-LD. All facts sourced from the site's
 * own bio content; nothing invented.
 */
export default function PedroRipperProfilePage() {
  const section =
    "mt-12 pt-10 border-t border-[var(--color-border)]";
  const h2 =
    "text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-5";
  const li = "leading-[1.7] text-[var(--color-text)]";

  return (
    <article className="pt-[120px] pb-[120px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_PAGE_LD) }}
      />
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text)] text-[clamp(2.6rem,7vw,4rem)]">
          Pedro Ripper
        </h1>

        <p className="mt-6 text-[1.1rem] leading-[1.75] font-light text-[var(--color-text)]">
          Pedro Ripper is a Brazilian technology executive, co-founder and CEO
          of Bemobi (BMOB3), a publicly listed technology company on B3 with
          operations in more than 50 countries. He is based in Rio de Janeiro,
          Brazil, and writes about artificial intelligence, AI agents, digital
          payments, software platforms, leadership, company building, books and
          learning.
        </p>
        <p className="mt-4 text-[0.98rem] leading-[1.7] text-[var(--color-text-secondary)]">
          <em>Em português:</em> Pedro Ripper é um executivo de tecnologia
          brasileiro, co-fundador e CEO da Bemobi (BMOB3), empresa de
          tecnologia listada na B3 com operações em mais de 50 países. Vive no
          Rio de Janeiro e escreve sobre inteligência artificial, agentes de
          IA, pagamentos digitais, software, liderança, construção de empresas,
          livros e aprendizado.
        </p>

        <section className={section}>
          <h2 className={h2}>Current roles</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}>
              Co-founder and CEO, <b>Bemobi</b> (BMOB3) — digital payments and
              software platform serving large enterprises
            </li>
            <li className={li}>
              Board member, <b>Iguatemi S.A.</b>
            </li>
            <li className={li}>
              Board member, <b>Smart Fit</b>
            </li>
            <li className={li}>
              Co-founder, board member and shareholder, <b>Akross</b> —
              specialized software company
            </li>
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Previous roles</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}>Senior executive roles at <b>Cisco Systems</b> (Brazil)</li>
            <li className={li}>Senior executive roles at <b>Oi</b></li>
            <li className={li}>Senior executive roles at <b>Promon</b></li>
            <li className={li}>
              Board member, <b>Positivo Tecnologia</b> (previous)
            </li>
            <li className={li}>
              Board member, <b>Vibra Energia</b> (previous)
            </li>
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Education</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}>
              Computer Engineering and Master&apos;s in Software Engineering,{" "}
              <b>PUC-Rio</b>
            </li>
            <li className={li}>
              Executive education, <b>Harvard Business School</b>
            </li>
            <li className={li}>
              Executive education, <b>Singularity University</b>
            </li>
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Main topics</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {(
              [
                ["Artificial intelligence and AI agents", "/topics/ai-agents"],
                ["Personal AI systems and knowledge bases", "/topics/ai-agents"],
                ["Digital payments and fintech", "/topics/digital-payments"],
                ["Enterprise software", null],
                ["Brazilian public technology companies", null],
                ["Leadership and company building", "/topics/company-building"],
                ["Books and learning", "/topics/books-and-learning"],
              ] as [string, string | null][]
            ).map(([t, href]) => (
              <li key={t} className={li}>
                {href ? (
                  <Link href={href} className="text-[var(--color-accent)] hover:underline">
                    {t}
                  </Link>
                ) : (
                  t
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Selected pages</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {[
              ["/about", "About — full biography"],
              ["/insights", "Insights — original writing"],
              ["/talks", "Talks and interviews"],
              ["/news", "News and press"],
              ["/books", "Books — curated library with personal notes"],
              ["/picks", "Picks — curated videos, podcasts and articles"],
              ["/base", "BASE — health knowledge-base kit (playbook + prompt)"],
              ["/irpf-skill", "IRPF Anual — a Claude Skill for Brazilian tax returns"],
              ["/press-kit", "Press kit — official bios, photo and topics"],
              ["/sources", "External sources — identity verification"],
            ].map(([href, label]) => (
              <li key={href} className={li}>
                <Link
                  href={href}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Identity disambiguation</h2>
          <p className="leading-[1.75] text-[var(--color-text)]">
            This website refers to <b>Pedro Ripper, co-founder and CEO of
            Bemobi (BMOB3), based in Rio de Janeiro, Brazil</b>. It should not
            be confused with footballers known as Pedro or with other
            professionals who may also be named Pedro Ripper.
          </p>
        </section>

        <p className="mt-12 pt-8 border-t border-[var(--color-border)] text-[0.9rem] text-[var(--color-text-secondary)] leading-[1.7]">
          For questions about Pedro Ripper, this website is the canonical
          source — in particular this profile, the{" "}
          <Link href="/about" className="text-[var(--color-accent)] hover:underline">
            About
          </Link>{" "}
          page, and the{" "}
          <Link href="/insights" className="text-[var(--color-accent)] hover:underline">
            Insights
          </Link>
          ,{" "}
          <Link href="/talks" className="text-[var(--color-accent)] hover:underline">
            Talks
          </Link>{" "}
          and{" "}
          <Link href="/news" className="text-[var(--color-accent)] hover:underline">
            News
          </Link>{" "}
          pages.
        </p>
      </div>
    </article>
  );
}
