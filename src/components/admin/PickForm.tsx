"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Pick } from "@/lib/types";

interface PickFormProps {
  pick?: Pick;
}

export default function PickForm({ pick }: PickFormProps) {
  const router = useRouter();
  const isEdit = !!pick;

  const [title, setTitle] = useState(pick?.title ?? "");
  const [source, setSource] = useState(pick?.source ?? "");
  const [mediaType, setMediaType] = useState<Pick["mediaType"]>(pick?.mediaType ?? "article");
  const [tags, setTags] = useState(pick?.tags.join(", ") ?? "");
  const [date, setDate] = useState(pick?.date ?? "");
  const [duration, setDuration] = useState(pick?.duration ?? "");
  const [excerpt, setExcerpt] = useState(pick?.excerpt ?? "");
  const [url, setUrl] = useState(pick?.url ?? "");
  const [thumbnailGradient, setThumbnailGradient] = useState(
    pick?.thumbnailGradient ?? "linear-gradient(135deg, #1a1a2e, #16213e)"
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(pick?.thumbnailUrl ?? "");
  const [note, setNote] = useState(pick?.note ?? "");
  const [channelName, setChannelName] = useState(pick?.channelName ?? "");
  const [channelUrl, setChannelUrl] = useState(pick?.channelUrl ?? "");
  const [feedUrl, setFeedUrl] = useState(pick?.feedUrl ?? "");
  const [visible, setVisible] = useState(pick?.visible ?? true);
  const [featured, setFeatured] = useState(pick?.featured ?? true);
  const [order, setOrder] = useState(pick?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /* Fetch all metadata from the URL */
  const fetchMetadata = async () => {
    if (!url) return;
    setFetching(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/admin/picks/fetch-meta?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) setTitle(data.title);
        if (data.source) setSource(data.source);
        if (data.excerpt) setExcerpt(data.excerpt);
        if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl);
        if (data.mediaType) setMediaType(data.mediaType as Pick["mediaType"]);
        if (data.date) setDate(data.date);
        if (data.channelName) setChannelName(data.channelName);
        if (data.channelUrl) setChannelUrl(data.channelUrl);
        if (data.duration) setDuration(data.duration);
      } else {
        setFetchError("Could not fetch metadata from this URL.");
      }
    } catch {
      setFetchError("Failed to fetch metadata.");
    }
    setFetching(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      title,
      source,
      mediaType,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      date,
      duration: duration || undefined,
      excerpt,
      url,
      thumbnailGradient,
      thumbnailUrl: thumbnailUrl || undefined,
      note: note || undefined,
      channelName: channelName || undefined,
      channelUrl: channelUrl || undefined,
      feedUrl: feedUrl || undefined,
      visible,
      featured,
      order,
    };

    const res = isEdit
      ? await fetch(`/api/admin/picks/${pick.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/picks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (res.ok) {
      router.push("/admin/picks");
      router.refresh();
    } else {
      setSaving(false);
      const err = await res.json().catch(() => null);
      alert(err?.error || `Failed to save pick (${res.status})`);
    }
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {/* URL first — paste and fetch metadata to auto-fill everything */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <label className="block text-sm font-medium text-blue-900 mb-2">URL — paste and fetch to auto-fill</label>
        <div className="flex gap-2">
          <input className={inputClass} type="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://..." autoFocus />
          <button
            type="button"
            onClick={fetchMetadata}
            disabled={fetching || !url}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            {fetching ? "Fetching..." : "Fetch Metadata"}
          </button>
        </div>
        {fetchError && <p className="text-xs text-red-500 mt-1.5">{fetchError}</p>}
        <p className="text-xs text-blue-600/60 mt-1.5">Paste a URL and click to auto-fill title, source, thumbnail, and type.</p>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Source</label>
        <input className={inputClass} value={source} onChange={(e) => setSource(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Media Type</label>
        <select className={inputClass} value={mediaType} onChange={(e) => setMediaType(e.target.value as Pick["mediaType"])}>
          <option value="video">Video</option>
          <option value="podcast">Podcast</option>
          <option value="article">Article</option>
          <option value="channel">Channel</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, Payments, Fintech" />
      </div>

      <div>
        <label className={labelClass}>Date</label>
        <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Duration (optional, e.g. 1:42:08)</label>
        <input className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Excerpt</label>
        <textarea className={inputClass} rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Note (Pedro&apos;s personal commentary)</label>
        <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional personal comment about this pick" />
      </div>

      <div>
        <label className={labelClass}>Channel Name</label>
        <input className={inputClass} value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="e.g. Lex Fridman" />
      </div>

      <div>
        <label className={labelClass}>Channel URL</label>
        <input className={inputClass} type="url" value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="https://www.youtube.com/@channel" />
      </div>

      <div>
        <label className={labelClass}>Feed URL (RSS)</label>
        <input className={inputClass} type="url" value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https://example.com/feed.rss" />
      </div>


      <div>
        <label className={labelClass}>Thumbnail Image URL</label>
        <div className="flex gap-3 items-start">
          <input
            className={inputClass}
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://... (auto-filled for YouTube URLs)"
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Preview"
              className="w-16 h-10 object-cover rounded border border-gray-200 shrink-0"
            />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Real image shown on the card. Falls back to gradient if empty.</p>
      </div>

      <div>
        <label className={labelClass}>Thumbnail Gradient (CSS fallback)</label>
        <input className={inputClass} value={thumbnailGradient} onChange={(e) => setThumbnailGradient(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Order</label>
        <input className={inputClass} type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="visible" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="rounded" />
        <label htmlFor="visible" className="text-sm text-gray-700">Visible on site</label>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
        <label htmlFor="featured" className="text-sm text-gray-700">Featured</label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Update Pick" : "Create Pick"}
      </button>
    </form>
  );
}
