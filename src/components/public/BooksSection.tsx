"use client";

import { useState } from "react";
import Image from "next/image";
import type { BookItem } from "@/lib/types";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollReveal from "@/components/shared/ScrollReveal";
import BookModal from "./BookModal";

/**
 * Books section — 4-column grid. Neutral light covers with book image
 * or placeholder. Clicking a book opens a detail modal.
 */
interface BooksSectionProps {
  items: BookItem[];
}

export default function BooksSection({ items }: BooksSectionProps) {
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);

  return (
    <>
      <section id="books" className="py-[120px]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <ScrollReveal>
            <SectionHeader
              label="Reading List"
              title="Books I've Read"
              subtitle="A curated selection of books that have shaped my thinking on technology, business, and leadership."
              seeMoreHref="/books"
            />
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-[768px]:gap-5">
              {items.map((book) => (
                <div
                  key={book.id}
                  className="block cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 group"
                  onClick={() => setActiveBook(book)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") setActiveBook(book); }}
                >
                  {/* Cover — desaturated, full color on hover */}
                  <div
                    className="aspect-[2/3] overflow-hidden relative mb-5 flex items-center justify-center p-6 transition-all duration-[500ms] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] md:saturate-0 md:brightness-[1.35] md:group-hover:saturate-100 md:group-hover:brightness-100"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
                    }}
                  >
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        alt={`${book.title} by ${book.author}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center gap-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-border)] opacity-60">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <span className="text-[0.75rem] text-[var(--color-text-secondary)] font-medium leading-tight">
                          {book.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="font-display text-[1rem] font-semibold leading-[1.35] mb-1">
                    {book.title}
                  </div>
                  <div className="text-[0.82rem] text-[var(--color-text-secondary)]">
                    {book.author}
                  </div>
                  <span className="inline-block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-full mt-2.5">
                    {book.tag}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {activeBook && (
        <BookModal book={activeBook} onClose={() => setActiveBook(null)} />
      )}
    </>
  );
}
