"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pick } from "@/lib/types";

/**
 * Admin picks list with featured toggle and delete action.
 * Mirrors the BooksFeaturedToggles pattern.
 */
interface PicksFeaturedTogglesProps {
  initialPicks: Pick[];
}

export default function PicksFeaturedToggles({ initialPicks }: PicksFeaturedTogglesProps) {
  const [picks, setPicks] = useState(initialPicks);

  async function toggleFeatured(id: string, featured: boolean) {
    const res = await fetch(`/api/admin/picks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    if (res.ok) {
      setPicks((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured } : p))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this pick?")) return;
    const res = await fetch(`/api/admin/picks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPicks((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 font-medium text-gray-600">Type</th>
            <th className="px-4 py-3 font-medium text-gray-600">Source</th>
            <th className="px-4 py-3 font-medium text-gray-600 text-center">Featured</th>
            <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {picks.map((pick) => (
            <tr key={pick.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                {pick.title}
              </td>
              <td className="px-4 py-3 text-gray-500 capitalize">{pick.mediaType}</td>
              <td className="px-4 py-3 text-gray-500">{pick.source}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => toggleFeatured(pick.id, !pick.featured)}
                  className={`w-8 h-5 rounded-full relative transition-colors ${
                    pick.featured ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      pick.featured ? "left-3.5" : "left-0.5"
                    }`}
                  />
                </button>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Link
                  href={`/admin/picks/${pick.id}`}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(pick.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
