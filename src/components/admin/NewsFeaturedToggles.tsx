"use client";

import { useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";

/**
 * News table with inline featured toggle.
 * Follows the same pattern as BooksFeaturedToggles.
 */
interface Props {
  initialNews: NewsItem[];
}

export default function NewsFeaturedToggles({ initialNews }: Props) {
  const [news, setNews] = useState(initialNews);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleFeatured = async (item: NewsItem) => {
    setTogglingId(item.id);

    const res = await fetch(`/api/admin/news/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });

    if (res.ok) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === item.id ? { ...n, featured: !n.featured } : n
        )
      );
    }

    setTogglingId(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {news.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No news yet. Add your first article.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[300px] truncate">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.source}</td>
                <td className="px-4 py-3 text-gray-600">{item.date}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(item)}
                    disabled={togglingId === item.id}
                    className={`relative w-9 h-5 rounded-full transition-colors inline-block ${
                      item.featured ? "bg-green-500" : "bg-gray-300"
                    } ${togglingId === item.id ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        item.featured ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/news/${item.id}`}
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
