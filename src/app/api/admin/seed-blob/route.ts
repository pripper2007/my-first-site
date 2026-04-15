/**
 * One-time seed endpoint — reads the local JSON files bundled in the deploy
 * and uploads them to the Vercel Blob store so the CMS can work in production.
 *
 * POST /api/admin/seed-blob   (requires admin auth)
 */
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

const FILES = [
  "news.json",
  "videos.json",
  "books.json",
  "picks.json",
  "insights.json",
  "bio.json",
  "settings.json",
];

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set — cannot seed blob store." },
      { status: 500 }
    );
  }

  /* Check which blobs already exist so we can report skips */
  const { blobs: existing } = await list({ prefix: "content/" });
  const existingPaths = new Set(existing.map((b) => b.pathname));

  const results: { file: string; status: string; url?: string }[] = [];

  for (const file of FILES) {
    const blobPath = `content/${file}`;

    if (existingPaths.has(blobPath)) {
      results.push({ file, status: "skipped (already exists)" });
      continue;
    }

    try {
      const content = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
      /* Validate that the file is valid JSON before uploading */
      JSON.parse(content);
      const blob = await put(blobPath, content, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
      results.push({ file, status: "uploaded", url: blob.url });
    } catch (error) {
      results.push({ file, status: `error: ${String(error)}` });
    }
  }

  return NextResponse.json({ results });
}
