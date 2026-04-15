/**
 * Import picks from a YouTube playlist.
 *
 * POST /api/admin/picks/import-playlist
 * Body: { playlistId: string }
 *
 * Fetches all videos from the playlist via YouTube Data API v3,
 * extracts full metadata, skips URLs that already exist in picks,
 * and inserts new picks at the top of the list (shifting existing
 * picks down).
 */
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAllPicks, createPick } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import type { Pick } from "@/lib/types";

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

/** Convert ISO 8601 duration (PT1H42M8S) to "1:42:08" */
function formatIsoDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = m[1] ? parseInt(m[1]) : 0;
  const min = m[2] ? parseInt(m[2]) : 0;
  const sec = m[3] ? parseInt(m[3]) : 0;
  if (h > 0) {
    return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${min}:${String(sec).padStart(2, "0")}`;
}

/** Extract a playlist ID from a URL or return the raw string if it's already an ID */
function extractPlaylistId(input: string): string {
  /* Full URL: https://www.youtube.com/playlist?list=PLxxxxxx */
  const urlMatch = input.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];
  /* Already a bare playlist ID */
  return input.trim();
}

interface PlaylistItem {
  snippet: {
    resourceId: { videoId: string };
    position: number;
  };
}

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    channelId: string;
    defaultLanguage?: string;
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string };
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!YT_API_KEY) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const { playlistId: rawInput } = await request.json();
  if (!rawInput) {
    return NextResponse.json(
      { error: "Missing playlistId in request body." },
      { status: 400 }
    );
  }

  const playlistId = extractPlaylistId(rawInput);

  try {
    /* ── Step 1: Fetch all video IDs from the playlist (paginated) ── */
    const videoIds: string[] = [];
    let pageToken: string | undefined;

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", YT_API_KEY);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        return NextResponse.json(
          { error: `YouTube API error: ${err?.error?.message || res.status}` },
          { status: 502 }
        );
      }

      const data = await res.json();
      for (const item of data.items as PlaylistItem[]) {
        videoIds.push(item.snippet.resourceId.videoId);
      }
      pageToken = data.nextPageToken;
    } while (pageToken);

    if (videoIds.length === 0) {
      return NextResponse.json({
        imported: 0,
        skipped: 0,
        total: 0,
        message: "Playlist is empty.",
      });
    }

    /* ── Step 2: Deduplicate against existing picks ── */
    const existingPicks = await getAllPicks();
    const existingUrls = new Set(existingPicks.map((p) => p.url));

    const newVideoIds = videoIds.filter((id) => {
      const watchUrl = `https://www.youtube.com/watch?v=${id}`;
      const shortUrl = `https://youtu.be/${id}`;
      return !existingUrls.has(watchUrl) && !existingUrls.has(shortUrl);
    });

    const skippedCount = videoIds.length - newVideoIds.length;

    if (newVideoIds.length === 0) {
      return NextResponse.json({
        imported: 0,
        skipped: skippedCount,
        total: videoIds.length,
        message: "All videos already exist in picks.",
      });
    }

    /* ── Step 3: Fetch full metadata in batches of 50 ── */
    const videoMap = new Map<string, VideoItem>();

    for (let i = 0; i < newVideoIds.length; i += 50) {
      const batch = newVideoIds.slice(i, i + 50);
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("part", "snippet,contentDetails,statistics");
      url.searchParams.set("id", batch.join(","));
      url.searchParams.set("key", YT_API_KEY);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        for (const item of data.items as VideoItem[]) {
          videoMap.set(item.id, item);
        }
      }
    }

    /* ── Step 4: Shift existing picks down to make room at the top ── */
    /* We'll create new picks with order 0, 1, 2... and shift existing ones */
    const shiftAmount = newVideoIds.length;

    /* Update existing picks' order values via reorder */
    const { reorderPicks } = await import("@/lib/content");
    const shiftedOrders = existingPicks.map((p) => ({
      id: p.id,
      order: p.order + shiftAmount,
    }));
    await reorderPicks(shiftedOrders);

    /* ── Step 5: Create new picks in playlist order ── */
    const imported: string[] = [];

    for (let i = 0; i < newVideoIds.length; i++) {
      const videoId = newVideoIds[i];
      const video = videoMap.get(videoId);
      if (!video) continue;

      const snippet = video.snippet;
      const details = video.contentDetails;
      const stats = video.statistics;

      const newPick: Omit<Pick, "id" | "createdAt" | "updatedAt"> = {
        title: snippet.title,
        source: snippet.channelTitle,
        mediaType: "video",
        tags: [],
        date: snippet.publishedAt?.slice(0, 10) || "",
        duration: formatIsoDuration(details.duration || ""),
        excerpt:
          snippet.description
            ?.split("\n")
            .slice(0, 3)
            .join(" ")
            .slice(0, 300) || "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailGradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        channelName: snippet.channelTitle,
        channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`,
        viewCount: parseInt(stats.viewCount || "0", 10),
        language: snippet.defaultLanguage || undefined,
        visible: true,
        featured: true,
        order: i,
      };

      await createPick(newPick);
      imported.push(snippet.title);
    }

    revalidatePath("/");
    revalidatePath("/picks");

    return NextResponse.json({
      imported: imported.length,
      skipped: skippedCount,
      total: videoIds.length,
      titles: imported,
      message: `Imported ${imported.length} picks, skipped ${skippedCount} duplicates.`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 500 }
    );
  }
}
