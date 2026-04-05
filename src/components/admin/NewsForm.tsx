"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsItem } from "@/lib/types";

/**
 * News create/edit form — follows the same pattern as BookForm.
 */
interface NewsFormProps {
  news?: NewsItem;
}

export default function NewsForm({ news }: NewsFormProps) {
  const router = useRouter();
  const isEditing = !!news;

  const [form, setForm] = useState({
    title: news?.title ?? "",
    source: news?.source ?? "",
    date: news?.date ?? "",
    url: news?.url ?? "",
    excerpt: news?.excerpt ?? "",
    imageGradient: news?.imageGradient ?? "linear-gradient(135deg, #1a1a2e, #16213e)",
    imageUrl: news?.imageUrl ?? "",
    thumbnailUrl: news?.thumbnailUrl ?? "",
    categories: news?.categories?.join(", ") ?? "",
    tags: news?.tags?.join(", ") ?? "",
    language: news?.language ?? "pt-BR",
    visible: news?.visible ?? true,
    featured: news?.featured ?? true,
    order: news?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchMetadata = async () => {
    if (!form.url) return;
    setFetching(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/news/fetch-meta?url=${encodeURIComponent(form.url)}`);
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          excerpt: data.excerpt || prev.excerpt,
          imageUrl: data.imageUrl || prev.imageUrl,
          source: data.source || prev.source,
          date: data.date || prev.date,
          language: data.language || prev.language,
        }));
      } else {
        setError("Could not fetch metadata from this URL.");
      }
    } catch {
      setError("Failed to fetch metadata.");
    }
    setFetching(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Convert comma-separated strings to arrays for categories and tags
    const payload = {
      ...form,
      categories: form.categories
        ? form.categories.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      tags: form.tags
        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      // Only include optional URL fields if they have values
      imageUrl: form.imageUrl || undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
    };

    const url = isEditing ? `/api/admin/news/${news.id}` : "/api/admin/news";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!news || !confirm("Delete this article? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/news/${news.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/news");
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

        <Field label="Source Name" required hint="e.g. Bloomberg, Valor Econômico">
          <input
            type="text"
            value={form.source}
            onChange={(e) => update("source", e.target.value)}
            className="input"
            required
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

        <Field label="URL" required hint="Paste the article URL and click Fetch Metadata to auto-fill all fields">
          <div className="flex gap-2">
            <input
              type="url"
              value={form.url}
              onChange={(e) => update("url", e.target.value)}
              className="input flex-1"
              placeholder="https://..."
              required
            />
            <button
              type="button"
              onClick={fetchMetadata}
              disabled={fetching || !form.url}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              {fetching ? "Fetching..." : "Fetch Metadata"}
            </button>
          </div>
        </Field>

        <Field label="Excerpt" hint="Short summary of the article">
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="input min-h-[100px] resize-y"
            rows={3}
          />
        </Field>

        <Field label="Image URL" hint="Full-size article image (auto-filled from metadata)">
          <div className="flex gap-3 items-start">
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="input flex-1"
              placeholder="https://..."
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-16 h-10 object-cover rounded border border-gray-200 shrink-0"
              />
            )}
          </div>
        </Field>

        <Field label="Thumbnail URL" hint="Smaller thumbnail image">
          <input
            type="url"
            value={form.thumbnailUrl}
            onChange={(e) => update("thumbnailUrl", e.target.value)}
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Categories" hint="Comma-separated, e.g. earnings, financials">
          <input
            type="text"
            value={form.categories}
            onChange={(e) => update("categories", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Tags" hint="Comma-separated, e.g. receita, crescimento">
          <input
            type="text"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Language">
          <select
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
            className="input w-40"
          >
            <option value="pt-BR">pt-BR</option>
            <option value="en">en</option>
          </select>
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
              {deleting ? "Deleting..." : "Delete article"}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/news")}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create article"}
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
