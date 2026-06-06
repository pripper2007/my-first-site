import type { Metadata } from "next";
import NewsletterSignup from "@/components/public/NewsletterSignup";

const TITLE = "Diário de Bordo — a newsletter de Pedro Ripper";
const DESCRIPTION =
  "Os projetos pessoais de IA e os artigos do mês de pedroripper.com, direto na sua inbox. No máximo 1 e-mail por mês.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/newsletter" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/newsletter",
    siteName: "Pedro Ripper",
    type: "website",
    images: [
      { url: "/images/og-preview.png", width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-preview.png"],
  },
};

const STATUS_BANNERS: Record<string, { tone: "ok" | "err"; text: string }> = {
  confirmado: {
    tone: "ok",
    text: "✅ Inscrição confirmada — bem-vindo a bordo! O próximo Diário chega na virada do mês.",
  },
  invalido: {
    tone: "err",
    text: "Esse link de confirmação não é válido (ou expirou). Inscreva-se de novo abaixo.",
  },
  erro: {
    tone: "err",
    text: "Algo deu errado na confirmação. Tenta de novo abaixo?",
  },
};

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const banner = status ? STATUS_BANNERS[status] : undefined;

  return (
    <article className="pt-[120px] pb-[120px]">
      <div className="max-w-[680px] mx-auto px-5 md:px-12">
        {banner && (
          <div
            className={`mb-8 rounded-[var(--radius-sm)] border px-5 py-4 text-[0.95rem] leading-[1.6] ${
              banner.tone === "ok"
                ? "border-[var(--color-accent)] bg-[var(--color-accent-light)] text-[var(--color-text)]"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            Newsletter
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text)] text-[clamp(2.4rem,6vw,3.6rem)]">
          Diário de Bordo
        </h1>
        <p className="mt-5 text-[1.1rem] leading-[1.75] font-light text-[var(--color-text)]">
          Construo projetos pessoais de IA — uma base de conhecimento de saúde,
          uma skill pra declarar o IRPF, o que vier a seguir — e escrevo sobre o
          que aprendo aplicando IA na vida e na Bemobi. O <b>Diário de Bordo</b>{" "}
          é o registro mensal dessa jornada: os kits novos, os artigos do mês e
          2-3 indicações com as minhas notas.
        </p>
        <ul className="mt-5 mb-8 flex flex-col gap-2 text-[0.98rem] text-[var(--color-text-secondary)] font-light list-disc pl-5">
          <li>No máximo 1 e-mail por mês (kit novo pode ter um aviso extra)</li>
          <li>Sem spam, sem repasse do seu e-mail, descadastro em 1 clique</li>
          <li>Mesmo tom do site: direto, honesto, mão na massa</li>
        </ul>

        <NewsletterSignup />
      </div>
    </article>
  );
}
