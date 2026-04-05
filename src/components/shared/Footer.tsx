/**
 * Footer — light background, brand name + tagline on the left,
 * social icon circles on the right, bottom bar with copyright.
 * Matches the new HTML reference.
 */
export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[var(--color-border)] pt-20 pb-12">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12">
        {/* Top row: brand + socials */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
          <div>
            <div className="font-display text-[1.5rem] font-bold mb-3">
              Pedro Ripper<span className="text-[var(--color-accent)]">.</span>
            </div>
            <p className="text-[0.9rem] text-[var(--color-text-secondary)] max-w-xs leading-relaxed font-light">
              Co-founder &amp; CEO of Bemobi. Building the future of digital
              payments and software platforms across 50+ countries.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com/in/pedroripper"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-[400ms]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-[400ms]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap gap-7 mb-16">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/#picks", label: "Picks" },
            { href: "/#books", label: "Books" },
            { href: "/#talks", label: "Talks" },
            { href: "/#news", label: "News" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.85rem] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[400ms]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[var(--color-border)] gap-4">
          <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} Pedro Ripper. All rights reserved.
          </span>
          <div className="flex gap-7">
            <a href="#" className="text-[0.8rem] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[400ms]">
              Privacy
            </a>
            <a href="#" className="text-[0.8rem] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-[400ms]">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
