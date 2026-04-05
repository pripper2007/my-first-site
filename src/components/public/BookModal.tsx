"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { BookItem } from "@/lib/types";

/**
 * Book detail modal — two-column: cover left, info right.
 * Wider layout (960px) to fit longer descriptions. Subtle custom
 * scrollbar if content overflows.
 */
interface BookModalProps {
  book: BookItem;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-[210] w-11 h-11 rounded-full bg-white/15 hover:bg-[var(--color-accent)] flex items-center justify-center text-white backdrop-blur-sm transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        aria-label="Close"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Modal card */}
      <div
        className="relative z-[205] bg-[var(--color-bg-alt)] w-full max-w-[960px] max-h-[88vh] shadow-[0_40px_120px_rgba(0,0,0,0.3)] grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left — cover image, fixed height, centered */}
        <div
          className="flex items-center justify-center p-10 md:p-10 md:min-h-[480px]"
          style={{ background: "var(--color-surface)" }}
        >
          <div
            className="w-[200px] md:w-[240px] aspect-[2/3] overflow-hidden relative flex items-center justify-center shrink-0"
            style={{
              borderRadius: "var(--radius-sm)",
              boxShadow:
                "0 16px 48px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)",
              background: "var(--color-bg-alt)",
            }}
          >
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`${book.title} by ${book.author}`}
                fill
                className="object-cover"
                sizes="240px"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-2 px-4">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[var(--color-border)] opacity-50"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span className="text-[0.7rem] text-[var(--color-text-secondary)] font-medium leading-tight">
                  {book.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right — info + notes with subtle scrollbar */}
        <div className="px-8 md:px-10 py-10 flex flex-col justify-center overflow-y-auto book-modal-scroll">
          {/* Tag */}
          <span className="inline-block w-fit text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full mb-5">
            {book.tag}
          </span>

          {/* Title & author */}
          <h3 className="font-display text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] mb-2">
            {book.title}
          </h3>
          <p className="text-[1.05rem] text-[var(--color-text-secondary)] mb-8">
            by {book.author}
          </p>

          {/* Notes / personal comments */}
          {book.notes && (
            <div className="border-t border-[var(--color-border)] pt-7">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--color-accent)]"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-[0.78rem] font-semibold tracking-[0.06em] uppercase text-[var(--color-accent)]">
                  My Take
                </span>
              </div>
              <p className="text-[0.95rem] text-[var(--color-text-secondary)] leading-[1.8] font-light italic">
                &ldquo;{book.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Amazon link */}
          {book.amazonUrl && book.amazonUrl !== "#" && (
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-[0.85rem] font-semibold text-[var(--color-accent)] hover:gap-3 transition-all duration-[400ms]"
            >
              View on Amazon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
