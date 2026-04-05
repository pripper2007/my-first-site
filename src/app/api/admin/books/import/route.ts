import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getBooks } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

/**
 * Bulk-imports books from an array of {title, author, ...} objects.
 * Skips books that already exist (matched by title, case-insensitive).
 * Used by the Audible import feature.
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incoming = await request.json();

  if (!Array.isArray(incoming)) {
    return NextResponse.json({ error: "Expected an array of books" }, { status: 400 });
  }

  const existing = await getBooks();
  const existingTitles = new Set(existing.map((b) => b.title.toLowerCase()));

  let imported = 0;
  const now = new Date().toISOString();

  for (const item of incoming) {
    if (!item.title) continue;
    if (existingTitles.has(item.title.toLowerCase())) continue;

    const newBook = {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: item.title || "",
      author: item.author || "",
      tag: item.tag || "",
      description: item.description || "",
      coverImage: item.coverImage || "",
      amazonUrl: item.amazonUrl || "",
      notes: "",
      publishedDate: item.publishedDate || "",
      featured: false,
      order: existing.length + imported,
      createdAt: now,
      updatedAt: now,
    };

    existing.push(newBook);
    existingTitles.add(newBook.title.toLowerCase());
    imported++;
  }

  const filepath = path.join(process.cwd(), "src", "content", "books.json");
  await fs.writeFile(filepath, JSON.stringify(existing, null, 2), "utf-8");

  return NextResponse.json({ imported, total: existing.length });
}
