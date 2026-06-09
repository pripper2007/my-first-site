import type { Metadata } from "next";
import Link from "next/link";
import CopyTextButton from "@/components/public/CopyTextButton";
import { PERSON_ID, WEBSITE_ID } from "@/lib/jsonld";

const TITLE = "Álbum digital de figurinhas — crie o seu";
const DESCRIPTION =
  "Um álbum de figurinhas da Copa 2026 local-first, criado com IA para a minha filha: marque o que tem, falta e repetiu, com trocas e sync opcional. Crie o seu — app ao vivo ou o projeto aberto no GitHub.";
const OG_IMAGE = "/articles/images/album-da-manu/careta-montagem.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/album-figurinhas" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/album-figurinhas",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1412, height: 760, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const APP = "https://album.pedroripper.com";
const GITHUB = "https://github.com/pripper2007/album-figurinhas";
const SETUP = `${GITHUB}/blob/main/SETUP.md`;
const DISCLAIMER = `${GITHUB}/blob/main/DISCLAIMER.md`;
const CLONE_CMD = "git clone https://github.com/pripper2007/album-figurinhas.git";

const LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pedroripper.com/album-figurinhas",
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "pt-BR",
  about: { "@id": PERSON_ID },
  isPartOf: { "@id": WEBSITE_ID },
};

/**
 * Álbum de figurinhas project landing page — distribution page in the
 * /base + /irpf-skill + /linkedin-analytics mold. Two paths: use the live
 * app or build your own from the open repo. Content from the repo README.
 * DRAFT: noindex + not linked from home until the album article launches.
 */
export default function AlbumFigurinhasPage() {
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
            Projeto · Álbum de figurinhas
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.04] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          Crie o seu álbum digital de figurinhas
        </h1>
        <p className="mt-5 text-[1.1rem] leading-[1.75] font-light text-[var(--color-text)]">
          Um álbum de figurinhas da Copa 2026 <b>local-first</b>: marque o que
          você tem, o que falta e o que repetiu, gere a lista de trocas pronta
          pra compartilhar, e acompanhe o progresso. Funciona offline, sem
          cadastro, bonito no celular, tablet e desktop, com sync opcional entre
          aparelhos. Construí com a minha filha, usando IA — a história está no
          artigo{" "}
          <Link href="/insights/album-da-manu" className="text-[var(--color-accent)] hover:underline">
            Copa do Mundo, minha filha de 11 anos e a IA
          </Link>
          .
        </p>

        {/* Dois caminhos */}
        <div className="flex flex-wrap gap-3 mt-8">
          <a href={APP} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 transition-all duration-300">
            <span aria-hidden>⚽</span> Criar o meu álbum
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-300">
            <span aria-hidden>↗</span> Ver no GitHub
          </a>
        </div>
        <p className="text-[0.88rem] text-[var(--color-text-secondary)] mt-3 leading-[1.6]">
          <b>Criar o álbum</b> leva segundos, sem login (a coleção fica no seu
          aparelho). <b>Criar o projeto</b> é pra quem quer publicar a própria
          versão: clone o repo e siga o{" "}
          <a href={SETUP} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">SETUP.md</a>.
        </p>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-[0.88rem] text-[var(--color-text-secondary)]">Ou clone e rode local:</span>
            <CopyTextButton text={CLONE_CMD} />
          </div>
          <pre className="m-0 bg-[#0f1720] text-[#e6edf3] rounded-[var(--radius-md)] px-4 py-3.5 overflow-x-auto text-[12.5px] leading-[1.6] font-mono whitespace-pre">
            {CLONE_CMD}
          </pre>
        </div>

        {/* O que faz */}
        <section className={section}>
          <h2 className={h2}>O que faz</h2>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li className={li}>📚 Álbum completo por seleções, com busca e filtros (tenho / faltam / repetidas).</li>
            <li className={li}>➕ Contagem por toque; segurar abre os detalhes da carta.</li>
            <li className={li}>📊 Estatísticas de progresso e repetidas.</li>
            <li className={li}>🔁 Trocas: gera a lista de faltantes/repetidas e uma imagem pronta pra compartilhar.</li>
            <li className={li}>👥 Grupos por convite (opcional) pra trocar com amigos.</li>
            <li className={li}>📱 Local-first e offline; ☁️ sync opcional pelo código do álbum.</li>
            <li className={li}>🙅 Sem anúncios, sem paywall, sem chat, sem localização.</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <div className="mt-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-5 py-4 text-[0.92rem] leading-[1.65] text-[var(--color-text-secondary)]">
          <b>Projeto pessoal, sem fim comercial.</b> Não é afiliado à FIFA nem a
          fabricantes de figurinhas. As imagens, fotos, nomes e marcas das
          figurinhas são dos respectivos donos e <b>não acompanham o
          repositório</b> (veja o{" "}
          <a href={DISCLAIMER} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">DISCLAIMER</a>).
          Código sob licença MIT. Stack: Next.js · React · TypeScript · Tailwind
          · Dexie (IndexedDB) · Supabase (opcional).
        </div>
      </div>
    </article>
  );
}
