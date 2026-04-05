"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Audible library import page.
 *
 * Step 1: User goes to https://www.audible.com/library/titles while logged in
 * Step 2: Opens browser console (Cmd+Option+J on Mac, Ctrl+Shift+J on Windows)
 * Step 3: Pastes the extraction snippet and runs it
 * Step 4: Copies the JSON output and pastes it here
 * Step 5: We enrich each book with Google Books data and import
 */

const EXTRACTION_SNIPPET = `
// Paste this in your browser console on audible.com/library/titles
// Scroll to the bottom first to load all books, then run this.
(function() {
  const books = [];
  const seen = new Set();

  // Find all title links — they point to /pd/...
  document.querySelectorAll('a[href*="/pd/"]').forEach(link => {
    const title = link.textContent.trim();
    if (!title || seen.has(title)) return;
    seen.add(title);

    // Walk up the DOM to find the full book row
    let row = link.closest('div[class*="col"], li, tr');
    let attempts = 0;
    while (row && !row.querySelector('img') && attempts < 8) {
      row = row.parentElement;
      attempts++;
    }

    let author = '';
    let coverImage = '';

    if (row) {
      // Author — look for "By:" in the text
      const byMatch = row.textContent.match(/By:\\s*([^\\n]+?)(?:\\s*Narrated|\\s*Length|$)/);
      if (byMatch) author = byMatch[1].trim().replace(/,$/, '');

      // Cover image — get the highest resolution
      const img = row.querySelector('img[src*="media-amazon"]');
      if (img) {
        coverImage = img.src
          .replace(/_SL\\d+_/, '_SL500_')
          .replace(/_SS\\d+_/, '_SL500_');
      }
    }

    books.push({ title, author, coverImage });
  });

  const json = JSON.stringify(books, null, 2);
  copy(json);
  console.log(json);
  alert(books.length + ' books extracted and copied to clipboard!');
})();
`.trim();

export default function AudibleImportPage() {
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<"idle" | "enriching" | "importing" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ imported: number; total: number } | null>(null);

  const handleImport = async () => {
    let parsed: Array<{ title: string; author?: string; coverImage?: string }>;
    try {
      parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Not an array");
    } catch {
      setStatus("error");
      setProgress("Invalid JSON. Make sure you copied the full output from the console.");
      return;
    }

    setStatus("enriching");
    setProgress(`Enriching ${parsed.length} books with Google Books data...`);

    /* Enrich each book with Google Books metadata */
    const enriched = [];
    for (let i = 0; i < parsed.length; i++) {
      const book = parsed[i];
      setProgress(`Enriching ${i + 1} of ${parsed.length}: ${book.title}`);

      try {
        const res = await fetch(
          `/api/admin/books/search?q=${encodeURIComponent(book.title + (book.author ? " " + book.author : ""))}`
        );
        if (res.ok) {
          const results = await res.json();
          if (results.length > 0) {
            const match = results[0];
            enriched.push({
              title: book.title,
              author: book.author || match.author || "",
              tag: match.tag || "",
              description: match.description || "",
              coverImage: book.coverImage || match.coverImage || "",
              publishedDate: match.publishedDate || "",
            });
            continue;
          }
        }
      } catch {
        /* Enrichment failed for this book, use raw data */
      }

      enriched.push({
        title: book.title,
        author: book.author || "",
        tag: "",
        description: "",
        coverImage: book.coverImage || "",
        publishedDate: "",
      });
    }

    /* Import all books */
    setStatus("importing");
    setProgress("Importing books...");

    const importRes = await fetch("/api/admin/books/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
    });

    if (importRes.ok) {
      const data = await importRes.json();
      setResult(data);
      setStatus("done");
      setProgress(`Done! Imported ${data.imported} new books (${data.total} total).`);
    } else {
      setStatus("error");
      setProgress("Import failed. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        Import from Audible
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Extract your Audible library and import books with metadata auto-filled.
      </p>

      {/* Step 1: Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Step 1 — Extract from Audible
        </h2>
        <ol className="text-sm text-gray-600 space-y-3 list-decimal list-inside mb-5">
          <li>
            Go to{" "}
            <a
              href="https://www.audible.com/library/titles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              audible.com/library/titles
            </a>{" "}
            and make sure you&apos;re logged in.
          </li>
          <li>
            Scroll down to load all your books (or set the page to show all).
          </li>
          <li>
            Open the browser console:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              Cmd+Option+J
            </code>{" "}
            (Mac) or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              Ctrl+Shift+J
            </code>{" "}
            (Windows).
          </li>
          <li>Paste the snippet below and press Enter.</li>
          <li>The extracted data is automatically copied to your clipboard.</li>
        </ol>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-300 text-xs p-4 rounded-lg overflow-x-auto max-h-48">
            {EXTRACTION_SNIPPET}
          </pre>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(EXTRACTION_SNIPPET)}
            className="absolute top-2 right-2 px-2.5 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Step 2: Paste JSON */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Step 2 — Paste and import
        </h2>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-48 px-3 py-2.5 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
          placeholder='Paste the JSON output here (starts with [ and ends with ])'
          disabled={status === "enriching" || status === "importing"}
        />
      </div>

      {/* Progress */}
      {progress && (
        <div
          className={`text-sm mb-4 p-3 rounded-lg ${
            status === "error"
              ? "bg-red-50 text-red-700"
              : status === "done"
              ? "bg-green-50 text-green-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {progress}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/books")}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {status === "done" ? "Back to books" : "Cancel"}
        </button>

        {status !== "done" && (
          <button
            type="button"
            onClick={handleImport}
            disabled={!jsonInput.trim() || status === "enriching" || status === "importing"}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {status === "enriching" || status === "importing"
              ? "Processing..."
              : "Import books"}
          </button>
        )}

        {status === "done" && (
          <button
            type="button"
            onClick={() => { window.location.href = "/admin/books"; }}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            View all books
          </button>
        )}
      </div>
    </div>
  );
}
