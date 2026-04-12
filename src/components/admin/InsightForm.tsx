"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Insight } from "@/lib/types";

/**
 * Insight create/edit form — follows the same pattern as NewsForm.
 * Includes a large textarea for Markdown content.
 */
interface InsightFormProps {
  insight?: Insight;
}

export default function InsightForm({ insight }: InsightFormProps) {
  const router = useRouter();
  const isEditing = !!insight;

  const [form, setForm] = useState({
    title: insight?.title ?? "",
    titlePt: insight?.titlePt ?? "",
    slug: insight?.slug ?? "",
    date: insight?.date ?? "",
    readingTime: insight?.readingTime ?? "",
    excerpt: insight?.excerpt ?? "",
    excerptPt: insight?.excerptPt ?? "",
    content: insight?.content ?? "",
    contentPt: insight?.contentPt ?? "",
    language: insight?.language ?? "en" as "en" | "pt",
    coverImage: insight?.coverImage ?? "",
    tags: insight?.tags?.join(", ") ?? "",
    visible: insight?.visible ?? true,
    featured: insight?.featured ?? true,
    order: insight?.order ?? 0,
  });

  const [showPt, setShowPt] = useState(!!(insight?.contentPt));

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Auto-generate a URL-friendly slug from the title.
   * Only auto-generates when the slug field is empty or hasn't been manually edited.
   */
  const handleTitleChange = (value: string) => {
    update("title", value);
    // Auto-generate slug from title if slug is empty or matches the previous auto-generated slug
    if (!form.slug || form.slug === slugify(form.title)) {
      update("slug", slugify(value));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      coverImage: form.coverImage || undefined,
      titlePt: form.titlePt || undefined,
      excerptPt: form.excerptPt || undefined,
      contentPt: form.contentPt || undefined,
    };

    const url = isEditing ? `/api/admin/insights/${insight.id}` : "/api/admin/insights";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/insights");
      router.refresh();
    } else {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!insight || !confirm("Delete this insight? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/insights/${insight.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/insights");
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
            onChange={(e) => handleTitleChange(e.target.value)}
            className="input"
            required
          />
        </Field>

        <Field label="Slug" required hint="URL-friendly identifier, auto-generated from title">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="input"
            required
          />
        </Field>

        <Field label="Date" required hint="YYYY-MM-DD">
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="input w-48"
            required
          />
        </Field>

        <Field label="Reading Time" hint='e.g. "5 min read"'>
          <input
            type="text"
            value={form.readingTime}
            onChange={(e) => update("readingTime", e.target.value)}
            className="input w-48"
            placeholder="5 min read"
          />
        </Field>

        <Field label="Excerpt" required hint="Short summary shown in listings">
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="input min-h-[100px] resize-y"
            rows={3}
            required
          />
        </Field>

        <Field label="Content" required hint="Supports Markdown formatting">
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="input min-h-[320px] resize-y font-mono text-sm"
            rows={16}
            required
          />
        </Field>

        <Field label="Primary Language">
          <select
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
            className="input w-32"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </Field>

        {/* Portuguese version — collapsible section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPt(!showPt)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>🇧🇷 Versão em Português {form.contentPt ? "(filled)" : "(empty)"}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showPt ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {showPt && (
            <div className="p-4 space-y-4 border-t border-gray-200">
              <Field label="Título (PT)" hint="Portuguese title — leave empty if no translation">
                <input
                  type="text"
                  value={form.titlePt}
                  onChange={(e) => update("titlePt", e.target.value)}
                  className="input"
                  placeholder="Título em português..."
                />
              </Field>
              <Field label="Resumo (PT)" hint="Portuguese excerpt">
                <textarea
                  value={form.excerptPt}
                  onChange={(e) => update("excerptPt", e.target.value)}
                  className="input min-h-[80px] resize-y"
                  rows={2}
                  placeholder="Resumo em português..."
                />
              </Field>
              <Field label="Conteúdo (PT)" hint="Portuguese Markdown content">
                <textarea
                  value={form.contentPt}
                  onChange={(e) => update("contentPt", e.target.value)}
                  className="input min-h-[240px] resize-y font-mono text-sm"
                  rows={12}
                  placeholder="# Título do artigo em português..."
                />
              </Field>
            </div>
          )}
        </div>

        <Field label="Cover Image URL" hint="Optional hero image for the article">
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Tags" hint="Comma-separated, e.g. AI, Payments, Leadership">
          <input
            type="text"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
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
              {deleting ? "Deleting..." : "Delete insight"}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/insights")}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create insight"}
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

/**
 * Converts a string to a URL-friendly slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
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
