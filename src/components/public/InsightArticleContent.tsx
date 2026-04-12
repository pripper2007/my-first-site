"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import LanguageToggle from "./LanguageToggle";
import type { Insight } from "@/lib/types";

/**
 * Client component that renders an insight article with optional
 * EN/PT language toggle. The toggle only appears when both
 * languages are available (contentPt exists).
 */
interface InsightArticleContentProps {
  insight: Insight;
}

/* Shared Markdown component config */
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="font-display font-bold text-[2rem] tracking-[-0.03em] leading-[1.2] text-[var(--color-text)] mt-12 mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-display font-bold text-[1.5rem] tracking-[-0.02em] leading-[1.25] text-[var(--color-text)] mt-10 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="font-display font-semibold text-[1.25rem] tracking-[-0.01em] leading-[1.3] text-[var(--color-text)] mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="font-body text-[1.05rem] text-[var(--color-text-secondary)] leading-[1.8] mb-6 max-w-[680px]">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[var(--color-text)]">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2 max-w-[680px]">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2 max-w-[680px]">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="font-body text-[1.05rem] text-[var(--color-text-secondary)] leading-[1.8]">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-[3px] border-[var(--color-accent)] pl-5 my-6 italic text-[var(--color-text-secondary)]">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-[var(--color-accent)] hover:underline transition-colors duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="font-mono text-[0.9em] bg-[var(--color-text)]/5 px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),
  hr: () => <hr className="my-10 border-[var(--color-border)]" />,
};

export default function InsightArticleContent({ insight }: InsightArticleContentProps) {
  const hasPt = !!insight.contentPt;
  const [lang, setLang] = useState<"en" | "pt">(insight.language || "en");

  const title = lang === "pt" && insight.titlePt ? insight.titlePt : insight.title;
  const excerpt = lang === "pt" && insight.excerptPt ? insight.excerptPt : insight.excerpt;
  const content = lang === "pt" && insight.contentPt ? insight.contentPt : insight.content;

  return (
    <>
      {/* Article header */}
      <header className="mb-12">
        {/* Date, reading time, tags, language toggle */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
            {new Date(insight.date + "T00:00:00").toLocaleDateString(
              lang === "pt" ? "pt-BR" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </span>
          {insight.readingTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-40" />
              <span className="text-[0.8rem] text-[var(--color-text-secondary)]">
                {insight.readingTime}
              </span>
            </>
          )}
          {insight.tags.length > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-40" />
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.72rem] font-medium tracking-[0.06em] uppercase text-[var(--color-accent)] bg-[var(--color-accent)]/8 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Language toggle — only when Portuguese version exists */}
          {hasPt && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-secondary)] opacity-40" />
              <LanguageToggle defaultLang={insight.language || "en"} onChange={setLang} />
            </>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-display font-bold tracking-[-0.03em] leading-[1.15] text-[var(--color-text)] mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          {title}
        </h1>

        {/* Excerpt as lead paragraph */}
        <p className="text-[1.15rem] text-[var(--color-text-secondary)] leading-[1.8] font-light">
          {excerpt}
        </p>
      </header>

      {/* Divider */}
      <div className="w-12 h-[1.5px] bg-[var(--color-accent)] mb-12" />

      {/* Markdown content */}
      <div className="insight-prose">
        <ReactMarkdown components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}
