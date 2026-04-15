"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlaylistImportProps {
  defaultPlaylistUrl?: string;
}

/**
 * "Import from Playlist" panel for the admin picks page.
 * Pre-fills with the saved playlist URL from site settings.
 * On first use, saves the URL to settings for future imports.
 */
export default function PlaylistImport({ defaultPlaylistUrl }: PlaylistImportProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [playlistInput, setPlaylistInput] = useState(defaultPlaylistUrl ?? "");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
    titles?: string[];
    message: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!playlistInput.trim()) return;
    setImporting(true);
    setError("");
    setResult(null);

    try {
      /* Save playlist URL to settings if it changed */
      if (playlistInput.trim() !== defaultPlaylistUrl) {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ youtubePlaylistUrl: playlistInput.trim() }),
        });
      }

      const res = await fetch("/api/admin/picks/import-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId: playlistInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Import failed (${res.status})`);
      } else {
        setResult(data);
        if (data.imported > 0) {
          router.refresh();
        }
      }
    } catch {
      setError("Network error — could not reach the server.");
    }

    setImporting(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Import from Playlist
      </button>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-amber-900">
          Import from YouTube Playlist
        </h3>
        <button
          onClick={() => {
            setOpen(false);
            setResult(null);
            setError("");
          }}
          className="text-amber-600 hover:text-amber-800 text-sm"
        >
          Close
        </button>
      </div>

      <p className="text-xs text-amber-700 mb-3">
        {defaultPlaylistUrl
          ? "Your playlist is saved. Click Import to pull new videos."
          : "Paste a playlist URL. It will be saved for future imports."}
      </p>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          type="text"
          value={playlistInput}
          onChange={(e) => setPlaylistInput(e.target.value)}
          placeholder="https://www.youtube.com/playlist?list=PLxxxxx"
          disabled={importing}
        />
        <button
          onClick={handleImport}
          disabled={importing || !playlistInput.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          {importing ? "Importing..." : "Import"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}

      {result && (
        <div className="mt-3 text-sm">
          <p className="font-medium text-amber-900">{result.message}</p>
          {result.titles && result.titles.length > 0 && (
            <ul className="mt-2 space-y-1 text-amber-800">
              {result.titles.map((title, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-green-600 mt-0.5">+</span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
