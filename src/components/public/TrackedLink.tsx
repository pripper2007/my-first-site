"use client";

import { track } from "@vercel/analytics";

/**
 * An <a> that fires a Vercel Analytics custom event on click, then lets the
 * navigation/download proceed normally (no preventDefault). Use to instrument
 * conversion points (downloads, outbound links) without changing behavior.
 */
export default function TrackedLink({
  href,
  event,
  data,
  download,
  target,
  rel,
  className,
  children,
}: {
  href: string;
  event: string;
  data?: Record<string, string | number | boolean | null>;
  download?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download={download}
      target={target}
      rel={rel}
      className={className}
      onClick={() => track(event, data)}
    >
      {children}
    </a>
  );
}
