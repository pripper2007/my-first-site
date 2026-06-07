import type { Metadata } from "next";
import Link from "next/link";
import CopyTextButton from "@/components/public/CopyTextButton";
import { PERSON_ID, WEBSITE_ID } from "@/lib/jsonld";

const TITLE = "Press kit — Pedro Ripper";
const DESCRIPTION =
  "Bios oficiais (curta, média e longa, em PT e EN), fotos, links e temas para imprensa, eventos e podcasts sobre Pedro Ripper, co-fundador e CEO da Bemobi (BMOB3).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/press-kit" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/press-kit",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/og-preview.png"] },
};

/* Bios — all facts sourced from the site's bio content. */
const BIOS = {
  curtaPt:
    "Pedro Ripper é co-fundador e CEO da Bemobi (BMOB3), empresa brasileira de tecnologia listada na B3, focada em pagamentos digitais e plataformas de software, com operação em mais de 50 países.",
  curtaEn:
    "Pedro Ripper is the co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company focused on digital payments and software platforms, operating in 50+ countries.",
  mediaPt:
    "Pedro Ripper é um executivo de tecnologia brasileiro, co-fundador e CEO da Bemobi (BMOB3), empresa de tecnologia listada na B3 com operação em mais de 50 países. Antes da Bemobi, ocupou posições executivas sêniores na Promon, na Cisco do Brasil e na Oi. É conselheiro do Iguatemi e da Smart Fit (anteriormente, da Positivo Tecnologia e da Vibra Energia) e co-fundador e conselheiro da Akross. Escreve sobre IA, pagamentos digitais, software, liderança, livros e construção de empresas.",
  mediaEn:
    "Pedro Ripper is a Brazilian technology executive, co-founder and CEO of Bemobi (BMOB3), a publicly listed technology company on B3 with operations in more than 50 countries. He has held senior executive roles at Cisco Brazil, Oi and Promon, serves on the boards of Iguatemi and Smart Fit (previously Positivo Tecnologia and Vibra Energia), and is co-founder and board member of Akross. He writes about AI, digital payments, software, leadership, books and company building.",
  longaPt:
    "Pedro Ripper é co-fundador e CEO da Bemobi (BMOB3), empresa brasileira de tecnologia de capital aberto com operação em mais de 50 países. Liderou a evolução da companhia de serviços móveis para uma plataforma de pagamentos digitais e software para grandes empresas. Antes da Bemobi, ocupou posições executivas sêniores na Promon, na Cisco e na Oi. É engenheiro de computação com mestrado em engenharia de software pela PUC-Rio, com programas executivos na Harvard Business School e na Singularity University. Atualmente é conselheiro do Iguatemi e da Smart Fit, tendo integrado os conselhos da Positivo Tecnologia e da Vibra Energia, e é co-fundador, conselheiro e acionista da Akross, empresa especializada de software. Vive no Rio de Janeiro e escreve sobre inteligência artificial, agentes de IA, pagamentos digitais, fintech, software, liderança, construção de empresas, livros e aprendizado.",
  longaEn:
    "Pedro Ripper is co-founder and CEO of Bemobi (BMOB3), a Brazilian public technology company with operations in more than 50 countries. He has led the company's evolution from mobile services into a digital payments and software platform serving large enterprises. Before Bemobi, Pedro held senior executive roles at Promon, Cisco Systems and Oi. He earned his degree in Computer Engineering and his Master's in Software Engineering from PUC-Rio, and later completed executive education programs at Harvard Business School and Singularity University. Pedro currently serves on the boards of Iguatemi and Smart Fit, previously served on the boards of Positivo Tecnologia and Vibra Energia, and is co-founder, board member and shareholder of Akross, a specialized software company. He is based in Rio de Janeiro and writes about artificial intelligence, AI agents, digital payments, fintech, enterprise software, leadership, company building, books and learning.",
};

const TOPICS = [
  "Inteligência artificial e agentes de IA aplicados a negócios",
  "Sistemas pessoais de IA e bases de conhecimento",
  "Pagamentos digitais e fintech no Brasil e no mundo",
  "Software enterprise e plataformas",
  "Empresas de tecnologia de capital aberto no Brasil",
  "Liderança, governança e construção de empresas",
  "Livros, aprendizado contínuo e produtividade",
];

const PRESS_KIT_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pedroripper.com/press-kit",
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "pt-BR",
  about: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
};

function Bio({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="font-semibold text-[0.95rem]">{title}</p>
        <CopyTextButton text={text} />
      </div>
      <p className="text-[0.95rem] leading-[1.7] text-[var(--color-text-secondary)]">{text}</p>
    </div>
  );
}

export default function PressKitPage() {
  const section = "mt-12 pt-10 border-t border-[var(--color-border)]";
  const h2 = "text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-6";

  return (
    <article className="pt-[120px] pb-[120px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRESS_KIT_LD) }} />
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            Imprensa & eventos
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          Press kit
        </h1>
        <p className="mt-5 text-[1.05rem] leading-[1.75] font-light text-[var(--color-text)]">
          Material oficial sobre <b>Pedro Ripper</b> para jornalistas,
          organizadores de eventos e podcasts: bios prontas para uso (em
          português e inglês), foto, temas e links oficiais.
        </p>

        <section className={section}>
          <h2 className={h2}>Bios — português</h2>
          <div className="flex flex-col gap-4">
            <Bio title="Curta (1 frase)" text={BIOS.curtaPt} />
            <Bio title="Média (1 parágrafo)" text={BIOS.mediaPt} />
            <Bio title="Longa" text={BIOS.longaPt} />
          </div>
        </section>

        <section className={section}>
          <h2 className={h2}>Bios — English</h2>
          <div className="flex flex-col gap-4">
            <Bio title="Short" text={BIOS.curtaEn} />
            <Bio title="Medium" text={BIOS.mediaEn} />
            <Bio title="Long" text={BIOS.longaEn} />
          </div>
        </section>

        <section className={section}>
          <h2 className={h2}>Foto oficial</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/pedro-ripper.png"
            alt="Pedro Ripper — foto oficial"
            className="w-56 rounded-[var(--radius-md)] border border-[var(--color-border)]"
          />
          <p className="mt-3 text-[0.88rem] text-[var(--color-text-secondary)]">
            <a href="/images/pedro-ripper.png" download className="text-[var(--color-accent)] hover:underline">
              Baixar em alta resolução →
            </a>
          </p>
        </section>

        <section className={section}>
          <h2 className={h2}>Temas que Pedro pode comentar</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            {TOPICS.map((t) => (
              <li key={t} className="leading-[1.7] text-[var(--color-text)]">{t}</li>
            ))}
          </ul>
        </section>

        <section className={section}>
          <h2 className={h2}>Links oficiais</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-[var(--color-text)]">
            <li><Link href="/pedro-ripper" className="text-[var(--color-accent)] hover:underline">Perfil canônico (EN)</Link></li>
            <li><Link href="/talks" className="text-[var(--color-accent)] hover:underline">Palestras &amp; entrevistas em vídeo</Link></li>
            <li><Link href="/news" className="text-[var(--color-accent)] hover:underline">Cobertura de imprensa</Link></li>
            <li><a href="https://linkedin.com/in/pedroripper" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">LinkedIn</a></li>
            <li><a href="https://x.com/ripper_pedro" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">X (Twitter)</a></li>
            <li><a href="https://bemobi.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">Bemobi</a></li>
          </ul>
          <p className="mt-5 text-[0.9rem] text-[var(--color-text-secondary)]">
            Para fontes externas que validam a identidade e a trajetória, veja{" "}
            <Link href="/sources" className="text-[var(--color-accent)] hover:underline">/sources</Link>.
          </p>
        </section>
      </div>
    </article>
  );
}
