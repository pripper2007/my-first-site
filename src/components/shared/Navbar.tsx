"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Fixed top nav — 72px tall, frosted glass, uppercase links with
 * underline-on-hover, social icon buttons on the right.
 * Gains shadow on scroll. Matches the new HTML reference.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/#picks", label: "Picks", badge: true },
    { href: "/#books", label: "Books" },
    { href: "/#talks", label: "Talks" },
    { href: "/#news", label: "News" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center justify-between px-5 md:px-12 transition-all duration-300"
      style={{
        background: "rgba(250, 250, 250, 0.82)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Logo */}
      <Link href="/" className="font-display text-[1.25rem] font-bold tracking-[-0.02em]">
        Pedro<span className="text-[var(--color-accent)]">.</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex gap-9 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[0.82rem] font-medium tracking-[0.06em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors duration-[400ms] relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[var(--color-accent)] after:transition-[width] after:duration-[400ms] hover:after:w-full"
          >
            {link.label}
            {link.badge && (
              <span
                className="absolute -top-0.5 -right-2.5 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Social icons — desktop */}
      <div className="hidden md:flex gap-4 items-center">
        <a
          href="https://linkedin.com/in/pedroripper"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-[400ms]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href="https://x.com/ripper_pedro"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-[400ms]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-[5px] p-2"
        aria-label="Menu"
      >
        <span className="w-6 h-0.5 bg-[var(--color-text)] rounded-sm transition-all" />
        <span className="w-6 h-0.5 bg-[var(--color-text)] rounded-sm transition-all" />
        <span className="w-6 h-0.5 bg-[var(--color-text)] rounded-sm transition-all" />
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] px-5 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[0.82rem] font-medium tracking-[0.06em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
