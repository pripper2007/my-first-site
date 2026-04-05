/* ──────────────────────────────────────────────
 * Shared TypeScript interfaces for the JSON CMS.
 * Every content type has id, timestamps, featured
 * flag, and an order field for manual sorting.
 * ────────────────────────────────────────────── */

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  url: string;
  imageGradient: string; // CSS gradient string — used as fallback when no real image
  imageUrl?: string; // full-size article image from the source
  thumbnailUrl?: string; // smaller thumbnail image from the source
  categories?: string[]; // e.g. ["earnings", "financials"]
  tags?: string[]; // e.g. ["receita", "crescimento"]
  language?: string; // e.g. "pt-BR", "en"
  visible?: boolean; // whether the item is shown on public pages (default true)
  featured: boolean;
  order: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  type: "keynote" | "panel" | "interview" | "podcast";
  event: string;
  date: string; // YYYY-MM-DD
  duration: string; // e.g. "32:14"
  youtubeUrl: string; // full YouTube URL (e.g. https://www.youtube.com/watch?v=abc123)
  embedUrl?: string; // YouTube embed URL (e.g. https://www.youtube.com/embed/abc123)
  customThumbnail?: string; // optional CMS-uploaded image; falls back to YouTube default
  thumbnailUrl?: string; // high-res YouTube thumbnail URL
  categories?: string[]; // e.g. ["interview", "payments"]
  contentType?: string; // e.g. "interview", "podcast", "panel"
  channelName?: string; // YouTube channel name
  visible?: boolean; // whether the item is shown on public pages (default true)
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  tag: string; // e.g. Innovation, Leadership, Psychology
  description?: string; // publisher description / synopsis
  coverImage?: string; // URL or path to the book cover image
  amazonUrl?: string;
  notes?: string; // personal comments
  publishedDate?: string; // YYYY or YYYY-MM-DD
  visible?: boolean; // whether the item is shown on public pages (default true)
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pick {
  id: string;
  title: string;
  source: string;
  mediaType: 'video' | 'podcast' | 'article' | 'channel';
  tags: string[];
  date: string;
  duration?: string;
  excerpt: string;
  url: string;
  thumbnailGradient: string;
  thumbnailUrl?: string; // real image URL (OG image, YouTube thumbnail)
  note?: string; // Pedro's personal commentary
  embedUrl?: string; // embed URL (e.g. YouTube embed)
  channelName?: string; // channel or show name
  channelUrl?: string; // channel or show URL
  feedUrl?: string; // RSS feed URL
  viewCount?: number; // view count (YouTube)
  categories?: string[]; // e.g. ["artificial-intelligence", "fintech"]
  language?: string; // e.g. "en", "pt-BR"
  visible?: boolean; // whether the item is shown on public pages (default true)
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BioHighlight {
  icon: "chart" | "globe" | "book" | "star" | "rocket" | "users";
  title: string;
  description: string;
}

export interface BioStat {
  value: string;
  label: string;
}

export interface Bio {
  paragraphs: string[];
  highlights: BioHighlight[];
  stats: BioStat[];
}

export interface Settings {
  name: string;
  role: string;
  tagline: string;
  social: {
    linkedin: string;
    x: string;
  };
  meta: {
    title: string;
    description: string;
  };
}
