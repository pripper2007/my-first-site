"use client";

import { useState } from "react";

/** Small "copy to clipboard" button with a transient toast — used for bios on /press-kit. */
export default function CopyTextButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [toast, setToast] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setToast(true);
    setTimeout(() => setToast(false), 1600);
  }

  return (
    <>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 cursor-pointer"
      >
        {label}
      </button>
      {toast && (
        <div className="fixed left-1/2 bottom-7 -translate-x-1/2 z-[200] bg-[var(--color-text)] text-white px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.9rem] shadow-lg">
          Copiado!
        </div>
      )}
    </>
  );
}
