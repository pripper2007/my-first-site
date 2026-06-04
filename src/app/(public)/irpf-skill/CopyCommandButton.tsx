"use client";

import { useState } from "react";

/**
 * Copies a terminal command to the clipboard and shows a transient toast.
 * Same pattern as the BASE page's CopyPromptButton, adapted for commands.
 */
export default function CopyCommandButton({ command }: { command: string }) {
  const [toast, setToast] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      flash("Comando copiado! Cole no seu terminal.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = command;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        flash("Comando copiado! Cole no seu terminal.");
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

  return (
    <>
      <button
        onClick={copy}
        className="inline-flex items-center gap-2 font-semibold text-[0.82rem] px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-white hover:brightness-95 active:translate-y-px transition-all duration-300 cursor-pointer"
      >
        Copiar
      </button>
      {toast && (
        <div className="fixed left-1/2 bottom-7 -translate-x-1/2 z-[200] bg-[var(--color-text)] text-white px-4.5 py-2.5 rounded-[var(--radius-sm)] text-[0.9rem] shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
