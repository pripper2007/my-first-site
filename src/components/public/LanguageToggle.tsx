"use client";

import { useState } from "react";

/**
 * EN | PT toggle pill — only shown when both languages are available.
 * Returns the active language via onChange callback.
 */
interface LanguageToggleProps {
  defaultLang: "en" | "pt";
  onChange: (lang: "en" | "pt") => void;
}

export default function LanguageToggle({ defaultLang, onChange }: LanguageToggleProps) {
  const [active, setActive] = useState(defaultLang);

  const toggle = (lang: "en" | "pt") => {
    setActive(lang);
    onChange(lang);
  };

  return (
    <div className="inline-flex items-center border border-[var(--color-border)] rounded-full overflow-hidden text-[0.78rem] font-medium">
      <button
        onClick={() => toggle("en")}
        className={`px-4 py-1.5 transition-all duration-300 ${
          active === "en"
            ? "bg-[var(--color-text)] text-white"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggle("pt")}
        className={`px-4 py-1.5 transition-all duration-300 ${
          active === "pt"
            ? "bg-[var(--color-text)] text-white"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        }`}
      >
        PT
      </button>
    </div>
  );
}
