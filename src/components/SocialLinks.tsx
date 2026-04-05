/**
 * Row of text-based social links — LinkedIn, X (Twitter), and Email.
 * Uses the yellow accent color on hover, inspired by seths.blog.
 * Replace placeholder URLs with real ones when ready.
 */

/* Each link's label, URL, and whether it opens in a new tab */
const links = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/pedroripper",
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/pedroripper",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:pedro@example.com",
    external: false,
  },
];

export default function SocialLinks() {
  return (
    <nav aria-label="Social links" className="flex flex-wrap gap-4 md:gap-6">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-gray-500 hover:text-accent-hover font-medium transition-colors"
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
