"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/**
 * Copies the Health Vault setup prompt to the clipboard and shows a
 * transient toast. Mirrors the copyPrompt() behavior of the original
 * standalone base.html, restyled to the site theme.
 */
export default function CopyPromptButton({
  prompt,
  label,
  variant = "primary",
}: {
  prompt: string;
  label: string;
  variant?: "primary" | "secondary" | "small";
}) {
  const [toast, setToast] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      track("base_copy_prompt");
      flash("Prompt copiado! Cole no seu agente.");
    } catch {
      // Fallback for browsers without the async clipboard API
      const ta = document.createElement("textarea");
      ta.value = prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        track("base_copy_prompt");
        flash("Prompt copiado! Cole no seu agente.");
      } catch {
        flash("Selecione e copie manualmente.");
      }
      document.body.removeChild(ta);
    }
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  }

  const shape =
    "inline-flex items-center gap-2 font-semibold rounded-[var(--radius-sm)] cursor-pointer transition-all duration-300 active:translate-y-px";
  const tone =
    variant === "secondary"
      ? "border-[1.5px] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"
      : "bg-[var(--color-accent)] text-white hover:brightness-95";
  const size =
    variant === "small"
      ? "text-[0.82rem] px-3.5 py-2"
      : "text-[0.95rem] px-5 py-3.5";

  return (
    <>
      <button onClick={copy} className={`${shape} ${tone} ${size}`}>
        <span aria-hidden>📋</span>
        {label}
      </button>
      {toast && (
        <div className="fixed left-1/2 bottom-7 -translate-x-1/2 z-[200] bg-[var(--color-text)] text-white px-4.5 py-2.5 rounded-[var(--radius-sm)] text-[0.9rem] shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
