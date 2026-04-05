"use client";

import { useState } from "react";
import Link from "next/link";
import type { VideoItem } from "@/lib/types";

/**
 * Videos table with inline featured toggle.
 * Follows the same pattern as BooksFeaturedToggles.
 */
interface Props {
  initialVideos: VideoItem[];
}

export default function VideosFeaturedToggles({ initialVideos }: Props) {
  const [videos, setVideos] = useState(initialVideos);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleFeatured = async (item: VideoItem) => {
    setTogglingId(item.id);

    const res = await fetch(`/api/admin/videos/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });

    if (res.ok) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === item.id ? { ...v, featured: !v.featured } : v
        )
      );
    }

    setTogglingId(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {videos.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-gray-500">
          No videos yet. Add your first one.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Duration</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 max-w-[300px] truncate">
                  {item.title}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.duration}</td>
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
                    href={`/admin/videos/${item.id}`}
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
