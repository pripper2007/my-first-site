import Link from "next/link";

/**
 * "Back to Home" link shown at the top of section listing pages.
 * Uses the gold accent arrow matching the design language.
 */
export default function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[400ms] mb-12"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Home
    </Link>
  );
}
