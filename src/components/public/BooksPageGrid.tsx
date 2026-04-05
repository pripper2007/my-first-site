"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { BookItem } from "@/lib/types";
import ScrollReveal from "@/components/shared/ScrollReveal";
import BookModal from "./BookModal";

/**
 * Books listing with sort and filter controls.
 * Sort: A-Z, Published Date, Manual Order
 * Filter: by tag/subject
 *
 * Pagination: shows PAGE_SIZE books initially, with a "Load more" button
 * to reveal the next batch. Resets when sort or filter changes.
 */
interface BooksPageGridProps {
  items: BookItem[];
  tags: string[];
}

type SortMode = "order" | "alpha" | "date";

/** Number of books to show per page / per "Load more" click */
const PAGE_SIZE = 24;

export default function BooksPageGrid({ items, tags }: BooksPageGridProps) {
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [sort, setSort] = useState<SortMode>("order");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = [...items];

    /* Filter by tag */
    if (tagFilter !== "all") {
      list = list.filter((b) => b.tag === tagFilter);
    }

    /* Sort */
    switch (sort) {
      case "alpha":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        list.sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""));
        break;
      case "order":
      default:
        list.sort((a, b) => a.order - b.order);
        break;
    }

    /* Reset pagination whenever sort or filter changes */
    setVisibleCount(PAGE_SIZE);

    return list;
  }, [items, sort, tagFilter]);

  return (
    <>
      {/* Controls bar */}
      <div className="flex flex-wrap gap-3 items-center mb-10">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[0.75rem] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Sort
          </span>
          <div className="flex border border-[var(--color-border)] rounded-lg overflow-hidden">
            {([
              ["order", "Manual"],
              ["alpha", "A–Z"],
              ["date", "Date"],
            ] as [SortMode, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSort(value)}
                className={`px-3 py-1.5 text-[0.78rem] font-medium transition-colors ${
                  sort === value
                    ? "bg-[var(--color-text)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[0.75rem] font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Subject
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTagFilter("all")}
                className={`px-3 py-1.5 text-[0.75rem] font-medium rounded-full border transition-colors ${
                  tagFilter === "all"
                    ? "bg-[var(--color-text)] text-white border-[var(--color-text)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={`px-3 py-1.5 text-[0.75rem] font-medium rounded-full border transition-colors ${
                    tagFilter === tag
                      ? "bg-[var(--color-text)] text-white border-[var(--color-text)]"
                      : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Count */}
        <span className="ml-auto text-[0.78rem] text-[var(--color-text-secondary)]">
          {filtered.length} book{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid — only render the first `visibleCount` books */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-[768px]:gap-5">
        {filtered.slice(0, visibleCount).map((book, i) => (
          <ScrollReveal key={book.id} delay={i * 50}>
            <div
              className="block cursor-pointer transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 group"
              onClick={() => setActiveBook(book)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setActiveBook(book);
              }}
            >
              <div
                className="aspect-[2/3] overflow-hidden relative mb-5 flex items-center justify-center p-6 transition-all duration-[500ms] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] saturate-0 brightness-[1.35] group-hover:saturate-100 group-hover:brightness-100"
                style={{
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
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
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-[var(--color-border)] opacity-60"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span className="text-[0.75rem] text-[var(--color-text-secondary)] font-medium leading-tight">
                      {book.title}
                    </span>
                  </div>
                )}
              </div>
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
          </ScrollReveal>
        ))}
      </div>

      {/* "Load more" button — shown when there are more books to display */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-8 py-3 text-[0.88rem] font-medium border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            Load more ({Math.min(PAGE_SIZE, filtered.length - visibleCount)} of{" "}
            {filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-[var(--color-text-secondary)] text-center py-12">
          No books match this filter.
        </p>
      )}

      {activeBook && (
        <BookModal book={activeBook} onClose={() => setActiveBook(null)} />
      )}
    </>
  );
}
