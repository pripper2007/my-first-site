import NewsletterSignup from "@/components/public/NewsletterSignup";
import ScrollReveal from "@/components/shared/ScrollReveal";

/**
 * NewsletterSection — dedicated "Diário de Bordo" band on the home, placed
 * after Projects (highest-intent moment: the visitor has seen the articles
 * and the projects). A calm full-width tinted band with its own heading;
 * the form uses the chrome-less "bare" variant so it doesn't double-frame.
 * Prominent but inline — no popups or sticky bars.
 */
export default function NewsletterSection() {
  return (
    <section id="newsletter" className="pt-[120px] pb-0">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        <ScrollReveal>
          <div className="rounded-[var(--radius-md)] bg-[var(--color-accent-light)] border border-[var(--color-border)] px-6 py-12 md:px-16 md:py-14">
            <div className="max-w-[600px] mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
                <span className="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-accent)] uppercase">
                  Diário de Bordo
                </span>
                <span className="w-7 h-[1.5px] bg-[var(--color-accent)]" />
              </div>
              <h2 className="font-display font-bold tracking-[-0.02em] leading-[1.15] text-[var(--color-text)] text-[clamp(1.7rem,3vw,2.4rem)]">
                Os próximos kits e artigos, direto na sua inbox.
              </h2>
              <p className="mt-4 text-[1rem] text-[var(--color-text-secondary)] font-light leading-[1.7]">
                Quando lanço um projeto novo ou escrevo algo que vale a pena,
                você fica sabendo. No máximo 1 e-mail por mês, sem spam,
                descadastro em 1 clique.
              </p>
              <div className="mt-7 max-w-[460px] mx-auto text-left">
                <NewsletterSignup variant="bare" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
