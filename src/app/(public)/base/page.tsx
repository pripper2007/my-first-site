import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import CopyPromptButton from "./CopyPromptButton";
import NewsletterSignup from "@/components/public/NewsletterSignup";
import TrackedLink from "@/components/public/TrackedLink";

const TITLE = "BASE — uma base de conhecimento viva para a sua saúde";
const DESCRIPTION =
  "O playbook e o prompt para montar, com IA, uma base de conhecimento viva sobre a sua saúde. Inspirado no padrão LLM Wiki de Andrej Karpathy.";
const OG_IMAGE = "/articles/images/base-de-conhecimento/vault-graph.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://pedroripper.com/base" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pedroripper.com/base",
    siteName: "Pedro Ripper",
    type: "website",
    images: [{ url: OG_IMAGE, width: 2000, height: 1358, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const PDF = "/base/playbook-base-de-conhecimento.pdf";
const PROMPT_MD = "/base/health-vault-bootstrap-prompt.md";

function getPrompt(): string {
  return fs.readFileSync(
    path.join(process.cwd(), "src/content/base/health-vault-prompt.md"),
    "utf-8"
  );
}

/**
 * BASE — the "kit" landing page (the Health Vault prompt + playbook).
 * Rebuilt from the standalone Dropbox base.html into the site theme:
 * same content and structure, restyled. Lives inside the (public) layout,
 * so the site Navbar/Footer wrap it (direct URL + navigation back).
 */
export default function BasePage() {
  const prompt = getPrompt();

  const steps = [
    <>
      Abra um agente com acesso a arquivos (<b>Claude Cowork</b> é o mais fácil)
      numa pasta <b>vazia</b> — de preferência no Dropbox/Drive/iCloud.
    </>,
    <>
      <b>Copie o prompt</b> aqui do lado e cole no agente. Ele te entrevista como
      num primeiro atendimento e monta a estrutura, as regras e o seu perfil.
    </>,
    <>
      Jogue <b>um exame</b> (um painel de sangue é ótimo) na pasta{" "}
      <code className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-[0.85em]">
        raw/inbox/
      </code>{" "}
      e diga <em>&ldquo;ingere&rdquo;</em>. Pronto — a base começa a compor.
    </>,
  ];

  return (
    <article className="pt-[120px] pb-[120px]">
      <div className="max-w-[760px] mx-auto px-5 md:px-12">
        {/* Hero */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
          <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
            O kit BASE
          </span>
        </div>
        <h1 className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[var(--color-text)] text-[clamp(3.5rem,9vw,5.5rem)]">
          BASE
        </h1>
        <p className="font-display text-[var(--color-accent)] text-[1.35rem] font-semibold mt-2 mb-5">
          Uma base de conhecimento viva para a sua saúde.
        </p>
        <p className="text-[1.1rem] text-[var(--color-text)] leading-[1.7] font-light">
          A forma mais concreta que encontrei de dar contexto real à IA: em vez
          de recomeçar do zero a cada conversa, você mantém uma base viva onde o
          modelo escreve resumos, conecta exames e cruza tudo ao longo do tempo.
          Apliquei à minha saúde — e virou um motor de correlação que me faz
          chegar muito mais preparado ao médico.
        </p>
        <p className="text-[0.9rem] text-[var(--color-text-secondary)] mt-4">
          Inspirado no padrão <em>LLM Wiki</em> de Andrej Karpathy,
          especializado para saúde pessoal.
        </p>

        {/* Intro — what's inside the playbook (3 parts) */}
        <div className="mt-7 text-[0.98rem] leading-[1.7] text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-5">
          Este playbook tem três partes. A <b>Parte I</b> explica o padrão — de
          onde veio, por que funciona e como ele transforma uma pilha de exames
          soltos numa base que pensa com você. A <b>Parte II</b>, o coração,
          mostra como aplicá-lo à sua saúde: o que subir e como a base te
          entrevista como um médico. A <b>Parte III</b> é mão na massa — o passo
          a passo de ~20 minutos, como tirar seus dados dos laboratórios e
          wearables, e o que perguntar. Este documento (o PDF) é o guia humano;
          o <b>prompt</b> exato que você cola no agente vem no botão{" "}
          <i>Copiar</i> (ou no arquivo <code className="bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[0.85em]">.md</code>).
        </div>

        {/* CTA — read the playbook first, then grab the prompt */}
        <div className="flex flex-wrap gap-3 mt-7">
          <TrackedLink
            href={PDF}
            event="base_pdf_download"
            download
            className="inline-flex items-center gap-2 font-semibold text-[0.95rem] px-5 py-3.5 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 transition-all duration-300"
          >
            <span aria-hidden>📄</span> Baixar o playbook (PDF)
          </TrackedLink>
          <CopyPromptButton
            prompt={prompt}
            label="Copiar o prompt"
            variant="secondary"
          />
        </div>

        {/* How it works */}
        <section className="mt-14 pt-12 border-t border-[var(--color-border)]">
          <h2 className="text-[0.82rem] font-semibold tracking-[0.14em] uppercase text-[var(--color-accent)] mb-7">
            Como funciona, em 3 passos
          </h2>
          <div className="flex flex-col gap-5">
            {steps.map((body, i) => (
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
          <div className="mt-7 bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] rounded-[var(--radius-sm)] px-5 py-4 text-[0.95rem] leading-[1.6] text-[var(--color-text)]">
            🔒 <b>Seus dados ficam com você.</b> Tudo vive na sua pasta, no seu
            computador ou nuvem. As regras embutidas proíbem o agente de enviar
            seu conteúdo de saúde a qualquer serviço externo sem te perguntar
            antes.
          </div>
        </section>

        {/* The prompt */}
        <section className="mt-14 pt-12 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-[0.88rem] text-[var(--color-text-secondary)]">
              O prompt (em inglês — é o que você cola no agente)
            </span>
            <CopyPromptButton prompt={prompt} label="Copiar" variant="small" />
          </div>
          <pre className="m-0 bg-[#0f1720] text-[#e6edf3] rounded-[var(--radius-md)] p-4 max-h-[420px] overflow-auto text-[12.5px] leading-[1.55] whitespace-pre-wrap break-words font-mono">
            {prompt}
          </pre>
          <p className="text-[0.88rem] text-[var(--color-text-secondary)] mt-4 leading-[1.6]">
            Prefere o arquivo?{" "}
            <TrackedLink
              href={PROMPT_MD}
              event="base_prompt_md_download"
              download
              className="text-[var(--color-accent)] hover:underline"
            >
              Baixar o prompt (.md)
            </TrackedLink>{" "}
            · Para entender tudo antes, comece pelo{" "}
            <TrackedLink
              href={PDF}
              event="base_pdf_download"
              download
              className="text-[var(--color-accent)] hover:underline"
            >
              playbook (PDF)
            </TrackedLink>
            .
          </p>
        </section>

        {/* Newsletter */}
        <div className="mt-14">
          <NewsletterSignup />
        </div>

        {/* Credit */}
        <p className="mt-14 pt-8 border-t border-[var(--color-border)] text-[0.85rem] text-[var(--color-text-secondary)] leading-[1.6]">
          Crédito ao padrão <em>LLM Wiki</em> de Andrej Karpathy (gist público,
          abril/2026). Use à vontade.
        </p>
      </div>
    </article>
  );
}
