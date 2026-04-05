/**
 * Content layer — reads/writes JSON files from src/content/.
 * Used by both public pages (read-only) and admin API routes (read/write).
 */
import { promises as fs } from "fs";
import path from "path";
import type {
  NewsItem,
  VideoItem,
  BookItem,
  Pick,
  Bio,
  Settings,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/* Simple per-file write lock to prevent concurrent writes from corrupting JSON */
const writeLocks = new Map<string, Promise<void>>();

async function readJsonFile<T>(filename: string): Promise<T> {
  const filepath = path.join(CONTENT_DIR, filename);
  const data = await fs.readFile(filepath, "utf-8");
  return JSON.parse(data);
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filepath = path.join(CONTENT_DIR, filename);
  const json = JSON.stringify(data, null, 2);

  /* Wait for any in-flight write to the same file */
  const existing = writeLocks.get(filename);
  if (existing) await existing;

  /* Write atomically: write to temp file, then rename */
  const tempPath = filepath + ".tmp";
  const writeOp = fs.writeFile(tempPath, json, "utf-8")
    .then(() => fs.rename(tempPath, filepath));

  writeLocks.set(filename, writeOp);
  await writeOp;
  writeLocks.delete(filename);
}

/* ── News ────────────────────────────────────── */

/**
 * Returns ALL news items (including hidden) — used by admin pages.
 */
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const data = await readJsonFile<NewsItem[]>("news.json");
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

/**
 * Returns only visible news items — used by public-facing pages.
 * Items without a `visible` field default to showing (visible !== false).
 */
export async function getNews(): Promise<NewsItem[]> {
  const all = await getAllNews();
  return all.filter((n) => n.visible !== false);
}

export async function getFeaturedNews(limit = 6): Promise<NewsItem[]> {
  const news = await getNews();
  return news.filter((n) => n.featured).slice(0, limit || undefined);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const news = await getAllNews();
  return news.find((n) => n.id === id) ?? null;
}

export async function createNews(
  item: Omit<NewsItem, "id" | "createdAt" | "updatedAt">
): Promise<NewsItem> {
  const { v4: uuidv4 } = await import("uuid");
  const news = await getAllNews();
  const newItem: NewsItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  news.push(newItem);
  await writeJsonFile("news.json", news);
  return newItem;
}

export async function updateNews(
  id: string,
  updates: Partial<Omit<NewsItem, "id" | "createdAt">>
): Promise<NewsItem | null> {
  const news = await getAllNews();
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) return null;
  news[index] = { ...news[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("news.json", news);
  return news[index];
}

export async function deleteNews(id: string): Promise<boolean> {
  const news = await getAllNews();
  const filtered = news.filter((n) => n.id !== id);
  if (filtered.length === news.length) return false;
  await writeJsonFile("news.json", filtered);
  return true;
}

/* ── Videos ───────────────────────────────────── */

/**
 * Returns ALL video items (including hidden) — used by admin pages.
 */
export async function getAllVideos(): Promise<VideoItem[]> {
  try {
    const data = await readJsonFile<VideoItem[]>("videos.json");
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

/**
 * Returns only visible video items — used by public-facing pages.
 */
export async function getVideos(): Promise<VideoItem[]> {
  const all = await getAllVideos();
  return all.filter((v) => v.visible !== false);
}

export async function getFeaturedVideos(limit = 6): Promise<VideoItem[]> {
  const videos = await getVideos();
  return videos.filter((v) => v.featured).slice(0, limit || undefined);
}

export async function getVideoById(id: string): Promise<VideoItem | null> {
  const videos = await getAllVideos();
  return videos.find((v) => v.id === id) ?? null;
}

export async function createVideo(
  item: Omit<VideoItem, "id" | "createdAt" | "updatedAt">
): Promise<VideoItem> {
  const { v4: uuidv4 } = await import("uuid");
  const videos = await getAllVideos();
  const newItem: VideoItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  videos.push(newItem);
  await writeJsonFile("videos.json", videos);
  return newItem;
}

export async function updateVideo(
  id: string,
  updates: Partial<Omit<VideoItem, "id" | "createdAt">>
): Promise<VideoItem | null> {
  const videos = await getAllVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;
  videos[index] = { ...videos[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("videos.json", videos);
  return videos[index];
}

export async function deleteVideo(id: string): Promise<boolean> {
  const videos = await getAllVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;
  await writeJsonFile("videos.json", filtered);
  return true;
}

/* ── Books ────────────────────────────────────── */

/**
 * Returns ALL book items (including hidden) — used by admin pages.
 */
export async function getAllBooks(): Promise<BookItem[]> {
  try {
    const data = await readJsonFile<BookItem[]>("books.json");
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

/**
 * Returns only visible book items — used by public-facing pages.
 */
export async function getBooks(): Promise<BookItem[]> {
  const all = await getAllBooks();
  return all.filter((b) => b.visible !== false);
}

export async function getFeaturedBooks(limit = 8): Promise<BookItem[]> {
  const books = await getBooks();
  return books.filter((b) => b.featured).slice(0, limit || undefined);
}

export async function getBookById(id: string): Promise<BookItem | null> {
  const books = await getAllBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function createBook(
  item: Omit<BookItem, "id" | "createdAt" | "updatedAt">
): Promise<BookItem> {
  const { v4: uuidv4 } = await import("uuid");
  const books = await getAllBooks();
  const newItem: BookItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  books.push(newItem);
  await writeJsonFile("books.json", books);
  return newItem;
}

export async function updateBook(
  id: string,
  updates: Partial<Omit<BookItem, "id" | "createdAt">>
): Promise<BookItem | null> {
  const books = await getAllBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("books.json", books);
  return books[index];
}

export async function deleteBook(id: string): Promise<boolean> {
  const books = await getAllBooks();
  const filtered = books.filter((b) => b.id !== id);
  if (filtered.length === books.length) return false;
  await writeJsonFile("books.json", filtered);
  return true;
}

/* ── Picks ────────────────────────────────────── */

/**
 * Returns ALL pick items (including hidden) — used by admin pages.
 */
export async function getAllPicks(): Promise<Pick[]> {
  try {
    const data = await readJsonFile<Pick[]>("picks.json");
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

/**
 * Returns only visible pick items — used by public-facing pages.
 */
export async function getPicks(): Promise<Pick[]> {
  const all = await getAllPicks();
  return all.filter((p) => p.visible !== false);
}

export async function getFeaturedPicks(limit = 6): Promise<Pick[]> {
  const picks = await getPicks();
  return picks.filter((p) => p.featured).slice(0, limit || undefined);
}

export async function getPickById(id: string): Promise<Pick | null> {
  const picks = await getAllPicks();
  return picks.find((p) => p.id === id) ?? null;
}

export async function createPick(
  item: Omit<Pick, "id" | "createdAt" | "updatedAt">
): Promise<Pick> {
  const { v4: uuidv4 } = await import("uuid");
  const picks = await getAllPicks();
  const newItem: Pick = {
    ...item,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  picks.push(newItem);
  await writeJsonFile("picks.json", picks);
  return newItem;
}

export async function updatePick(
  id: string,
  updates: Partial<Omit<Pick, "id" | "createdAt">>
): Promise<Pick | null> {
  const picks = await getAllPicks();
  const index = picks.findIndex((p) => p.id === id);
  if (index === -1) return null;
  picks[index] = { ...picks[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJsonFile("picks.json", picks);
  return picks[index];
}

export async function deletePick(id: string): Promise<boolean> {
  const picks = await getAllPicks();
  const filtered = picks.filter((p) => p.id !== id);
  if (filtered.length === picks.length) return false;
  await writeJsonFile("picks.json", filtered);
  return true;
}

/* ── Bio ──────────────────────────────────────── */

export async function getBio(): Promise<Bio> {
  try {
    return await readJsonFile<Bio>("bio.json");
  } catch {
    return { paragraphs: [], highlights: [], stats: [] };
  }
}

export async function updateBio(bio: Bio): Promise<Bio> {
  await writeJsonFile("bio.json", bio);
  return bio;
}

/* ── Settings ─────────────────────────────────── */

export async function getSettings(): Promise<Settings> {
  try {
    return await readJsonFile<Settings>("settings.json");
  } catch {
    return {
      name: "Pedro Ripper",
      role: "Co-founder & CEO",
      tagline: "",
      social: { linkedin: "", x: "" },
      meta: { title: "", description: "" },
    };
  }
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  await writeJsonFile("settings.json", settings);
  return settings;
}
