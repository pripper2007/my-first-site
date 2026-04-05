"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VideoItem } from "@/lib/types";

/**
 * Video create/edit form — follows the same pattern as BookForm.
 * Auto-fills the thumbnail URL from the YouTube URL.
 */
interface VideoFormProps {
  video?: VideoItem;
}

export default function VideoForm({ video }: VideoFormProps) {
  const router = useRouter();
  const isEditing = !!video;

  const [form, setForm] = useState({
    title: video?.title ?? "",
    youtubeUrl: video?.youtubeUrl ?? "",
    embedUrl: video?.embedUrl ?? "",
    channelName: video?.channelName ?? video?.event ?? "",
    event: video?.event ?? "",
    date: video?.date ?? "",
    duration: video?.duration ?? "",
    description: video?.description ?? "",
    type: video?.type ?? "interview",
    thumbnailUrl: video?.thumbnailUrl ?? "",
    customThumbnail: video?.customThumbnail ?? "",
    categories: video?.categories?.join(", ") ?? "",
    contentType: video?.contentType ?? "interview",
    visible: video?.visible ?? true,
    featured: video?.featured ?? true,
    order: video?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * When the YouTube URL changes, auto-fill the embed URL and thumbnail.
   * Extracts the video ID from various YouTube URL formats.
   */
  const handleYouTubeUrlChange = (url: string) => {
    update("youtubeUrl", url);

    // Extract video ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const videoId = match[1];
        update("embedUrl", `https://www.youtube.com/embed/${videoId}`);
        // Only auto-fill thumbnail if it's currently empty
        if (!form.thumbnailUrl) {
          update("thumbnailUrl", `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
        }
        break;
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      categories: form.categories
        ? form.categories.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      // Use channelName as event if event is empty
      event: form.event || form.channelName,
      thumbnailUrl: form.thumbnailUrl || undefined,
      customThumbnail: form.customThumbnail || undefined,
      embedUrl: form.embedUrl || undefined,
    };

    const url = isEditing ? `/api/admin/videos/${video.id}` : "/api/admin/videos";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/videos");
      router.refresh();
    } else {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!video || !confirm("Delete this video? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/videos");
      router.refresh();
    } else {
      setError("Failed to delete.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Main form fields */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <Field label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="input"
            required
          />
        </Field>

        <Field label="YouTube URL" required hint="Paste the full YouTube URL — embed URL and thumbnail auto-fill">
          <input
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => handleYouTubeUrlChange(e.target.value)}
            className="input"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </Field>

        <Field label="Embed URL" hint="Auto-filled from YouTube URL">
          <input
            type="url"
            value={form.embedUrl}
            onChange={(e) => update("embedUrl", e.target.value)}
            className="input"
            placeholder="https://www.youtube.com/embed/..."
          />
        </Field>

        <Field label="Channel Name" hint="YouTube channel that published the video">
          <input
            type="text"
            value={form.channelName}
            onChange={(e) => { update("channelName", e.target.value); update("event", e.target.value); }}
            className="input"
          />
        </Field>

        <Field label="Published Date" required hint="YYYY-MM-DD">
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="input w-48"
            required
          />
        </Field>

        <Field label="Duration" hint="e.g. 32min, 1h 28min">
          <input
            type="text"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            className="input w-40"
          />
        </Field>

        <Field label="Description" hint="Brief description of the video content">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="input min-h-[100px] resize-y"
            rows={3}
          />
        </Field>

        <Field label="Thumbnail URL" hint="Auto-filled from YouTube URL — high-res thumbnail">
          <div className="flex gap-3 items-start">
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) => update("thumbnailUrl", e.target.value)}
              className="input flex-1"
              placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg"
            />
            {form.thumbnailUrl && (
              <img
                src={form.thumbnailUrl}
                alt="Preview"
                className="w-24 h-14 object-cover rounded border border-gray-200 shrink-0"
              />
            )}
          </div>
        </Field>

        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className="input w-48"
          >
            <option value="interview">Interview</option>
            <option value="keynote">Keynote</option>
            <option value="panel">Panel</option>
            <option value="podcast">Podcast</option>
          </select>
        </Field>

        <Field label="Content Type" hint="More specific type, e.g. tv_interview, news_interview">
          <select
            value={form.contentType}
            onChange={(e) => update("contentType", e.target.value)}
            className="input w-56"
          >
            <option value="interview">Interview</option>
            <option value="tv_interview">TV Interview</option>
            <option value="news_interview">News Interview</option>
            <option value="magazine_interview">Magazine Interview</option>
            <option value="podcast">Podcast</option>
            <option value="panel">Panel</option>
            <option value="keynote">Keynote</option>
          </select>
        </Field>

        <Field label="Categories" hint="Comma-separated, e.g. interview, payments, technology">
          <input
            type="text"
            value={form.categories}
            onChange={(e) => update("categories", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Sort Order" hint="Lower numbers appear first">
          <input
            type="number"
            value={form.order}
            onChange={(e) => update("order", parseInt(e.target.value) || 0)}
            className="input w-24"
          />
        </Field>

        {/* Visible checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={form.visible}
            onChange={(e) => update("visible", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="visible" className="text-sm text-gray-700">
            Visible on site
          </label>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => update("featured", !form.featured)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              form.featured ? "bg-gray-900" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.featured ? "translate-x-4" : ""
              }`}
            />
          </button>
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </div>
      </div>

      {/* Actions */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <div>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete video"}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/videos")}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create video"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 1px #111827;
        }
        .input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}
