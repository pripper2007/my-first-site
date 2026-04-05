"use client";

import { useState } from "react";
import Link from "next/link";
import type { BookItem } from "@/lib/types";

/**
 * Books table with inline featured toggle.
 * One click flips featured status via API — no page reload needed.
 */
interface Props {
  initialBooks: BookItem[];
}

export default function BooksFeaturedToggles({ initialBooks }: Props) {
  const [books, setBooks] = useState(initialBooks);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleFeatured = async (book: BookItem) => {
    setTogglingId(book.id);

    const res = await fetch(`/api/admin/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !book.featured }),
    });

    if (res.ok) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, featured: !b.featured } : b
        )
      );
    }

    setTogglingId(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {books.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No books yet. Add your first one.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Author</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tag</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                <td className="px-4 py-3 text-gray-600">{book.author}</td>
                <td className="px-4 py-3">
                  <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {book.tag || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(book)}
                    disabled={togglingId === book.id}
                    className={`relative w-9 h-5 rounded-full transition-colors inline-block ${
                      book.featured ? "bg-green-500" : "bg-gray-300"
                    } ${togglingId === book.id ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        book.featured ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/books/${book.id}`}
                    className="text-xs font-medium text-gray-900 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
