"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookItem } from "@/lib/types";

/**
 * Book create/edit form with Google Books auto-fill.
 * Type a title, click "Search", pick a result, and all fields populate.
 */
interface BookFormProps {
  book?: BookItem;
}

interface SearchResult {
  title: string;
  author: string;
  description: string;
  tag: string;
  coverImage: string;
  publishedDate: string;
}

export default function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const isEditing = !!book;

  const [form, setForm] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    tag: book?.tag ?? "",
    description: book?.description ?? "",
    coverImage: book?.coverImage ?? "",
    amazonUrl: book?.amazonUrl ?? "",
    notes: book?.notes ?? "",
    publishedDate: book?.publishedDate ?? "",
    visible: book?.visible ?? true,
    featured: book?.featured ?? true,
    order: book?.order ?? 0,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /* Auto-fill state */
  const [searchQuery, setSearchQuery] = useState(form.title);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const update = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* Search Google Books and show results */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);

    const res = await fetch(`/api/admin/books/search?q=${encodeURIComponent(searchQuery)}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data);
    }
    setSearching(false);
  };

  /* Pick a search result and fill the form */
  const pickResult = (result: SearchResult) => {
    setForm((prev) => ({
      ...prev,
      title: result.title || prev.title,
      author: result.author || prev.author,
      tag: result.tag || prev.tag,
      description: result.description || prev.description,
      coverImage: result.coverImage || prev.coverImage,
      publishedDate: result.publishedDate || prev.publishedDate,
    }));
    setSearchResults([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = isEditing ? `/api/admin/books/${book.id}` : "/api/admin/books";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/books");
      router.refresh();
    } else {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!book || !confirm("Delete this book? This cannot be undone.")) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/books/${book.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/books");
      router.refresh();
    } else {
      setError("Failed to delete.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Auto-fill from Google Books */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="text-sm font-medium text-blue-900 mb-3">
          Auto-fill from Google Books
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }}
            className="input flex-1"
            placeholder="Type a book title and search..."
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((result, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickResult(result)}
                className="w-full text-left flex gap-3 items-start p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
              >
                {result.coverImage && (
                  <img
                    src={result.coverImage}
                    alt=""
                    className="w-10 h-14 object-cover rounded shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.author} {result.publishedDate && `· ${result.publishedDate}`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main form fields */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <Field label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => { update("title", e.target.value); setSearchQuery(e.target.value); }}
            className="input"
            required
          />
        </Field>

        <Field label="Author" required>
          <input
            type="text"
            value={form.author}
            onChange={(e) => update("author", e.target.value)}
            className="input"
            required
          />
        </Field>

        <Field label="Tag / Genre" hint="e.g. Innovation, Leadership, Psychology">
          <input
            type="text"
            value={form.tag}
            onChange={(e) => update("tag", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Published Date" hint="e.g. 2014 or 2014-09-16">
          <input
            type="text"
            value={form.publishedDate}
            onChange={(e) => update("publishedDate", e.target.value)}
            className="input w-40"
          />
        </Field>

        <Field label="Description" hint="Publisher description or synopsis">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="input min-h-[100px] resize-y"
            rows={3}
          />
        </Field>

        <Field label="Cover Image URL" hint="Full URL to the book cover image">
          <div className="flex gap-3 items-start">
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              className="input flex-1"
              placeholder="https://..."
            />
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Preview"
                className="w-12 h-16 object-cover rounded border border-gray-200 shrink-0"
              />
            )}
          </div>
        </Field>

        <Field label="Amazon URL" hint="Link to the book on Amazon">
          <input
            type="url"
            value={form.amazonUrl}
            onChange={(e) => update("amazonUrl", e.target.value)}
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Your Notes" hint="Personal comments about the book (shown in the modal)">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="input min-h-[120px] resize-y"
            rows={4}
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
              {deleting ? "Deleting..." : "Delete book"}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/books")}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create book"}
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
