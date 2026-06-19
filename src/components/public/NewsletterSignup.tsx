"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/**
 * "Diário de Bordo" signup — collects an email and triggers the
 * double opt-in flow (POST /api/newsletter/subscribe sends a
 * confirmation email; the contact only joins the list after clicking it).
 *
 * variant "card": framed block for kit pages / article ends / /newsletter.
 * variant "compact": slim row for the footer.
 * variant "bare": just the form + feedback (no chrome/heading) — for the
 *   home band, which provides its own heading and framing.
 */
export default function NewsletterSignup({
  variant = "card",
}: {
  variant?: "card" | "compact" | "bare";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        track("newsletter_subscribe", { variant });
        setState("sent");
        setMessage(
          "Quase lá! Te mandei um e-mail de confirmação — clica no link pra entrar a bordo."
        );
      } else {
        setState("error");
        setMessage(data.error || "Não rolou. Tenta de novo em instantes?");
      }
    } catch {
      setState("error");
      setMessage("Não rolou. Tenta de novo em instantes?");
    }
  }

  const form = (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        aria-label="Seu e-mail"
        className="flex-1 min-w-0 px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] text-[0.95rem] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 inline-flex items-center justify-center gap-2 font-semibold text-[0.92rem] px-5 py-3 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 active:translate-y-px transition-all duration-300 disabled:opacity-60 cursor-pointer"
      >
        {state === "loading" ? "Enviando…" : "Quero receber"}
      </button>
    </form>
  );

  const feedback =
    state === "sent" || state === "error" ? (
      <p
        className={`mt-3 text-[0.88rem] leading-[1.5] ${
          state === "sent" ? "text-[var(--color-accent)]" : "text-red-600"
        }`}
        role="status"
      >
        {message}
      </p>
    ) : null;

  if (variant === "bare") {
    return state === "sent" ? (
      feedback
    ) : (
      <>
        {form}
        {feedback}
      </>
    );
  }

  if (variant === "compact") {
    return (
      <div className="max-w-md">
        <p className="text-[0.95rem] font-medium text-[var(--color-text)] mb-1">
          Diário de Bordo
        </p>
        <p className="text-[0.85rem] text-[var(--color-text-secondary)] font-light mb-3">
          Os projetos e artigos do mês — no máximo 1 e-mail por mês.
        </p>
        {state === "sent" ? feedback : (
          <>
            {form}
            {feedback}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-6">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full">
        Diário de Bordo
      </span>
      <p className="mt-3 text-[1.05rem] font-medium text-[var(--color-text)]">
        Os próximos kits e artigos, direto na sua inbox.
      </p>
      <p className="text-[0.9rem] text-[var(--color-text-secondary)] font-light mb-4">
        No máximo 1 e-mail por mês. Sem spam, descadastro em 1 clique.
      </p>
      {state === "sent" ? feedback : (
        <>
          {form}
          {feedback}
        </>
      )}
    </div>
  );
}
