import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Fetches metadata from a URL for auto-filling pick fields.
 * Handles YouTube videos (via Data API v3), podcast pages, articles —
 * extracts title, description, thumbnail, date, duration, etc.
 */

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Converts an ISO 8601 duration (e.g. "PT1H42M8S") to a human-readable
 * string like "1:42:08".
 */
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

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    /* Detect YouTube video */
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    /* Detect YouTube channel */
    const ytChannelMatch = url.match(/youtube\.com\/(@[\w-]+|channel\/[\w-]+)/);

    if (ytMatch && YT_API_KEY) {
      /* YouTube video — use Data API v3 for full metadata */
      const videoId = ytMatch[1];
      const apiUrl =
        `https://www.googleapis.com/youtube/v3/videos` +
        `?part=snippet,contentDetails,statistics` +
        `&id=${videoId}&key=${YT_API_KEY}`;

      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          const snippet = item.snippet;
          const details = item.contentDetails;
          const stats = item.statistics;
          return NextResponse.json({
            title: snippet.title || "",
            source: snippet.channelTitle || "",
            excerpt: snippet.description?.split("\n").slice(0, 3).join(" ").slice(0, 300) || "",
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
            mediaType: "video",
            date: snippet.publishedAt?.slice(0, 10) || "",
            duration: formatIsoDuration(details.duration || ""),
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            channelName: snippet.channelTitle || "",
            channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`,
            viewCount: parseInt(stats.viewCount || "0", 10),
          });
        }
      }
    }

    if (ytMatch && !YT_API_KEY) {
      /* Fallback: oEmbed (no date/duration, but better than nothing) */
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          title: data.title || "",
          source: data.author_name || "",
          thumbnailUrl: `https://i.ytimg.com/vi/${ytMatch[1]}/maxresdefault.jpg`,
          excerpt: "",
          mediaType: "video",
          embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
          channelName: data.author_name || "",
          channelUrl: data.author_url || "",
        });
      }
    }

    if (ytChannelMatch) {
      /* YouTube channel */
      return NextResponse.json({
        mediaType: "channel",
        thumbnailUrl: "",
        source: "",
        title: "",
        excerpt: "",
      });
    }

    /* Generic URL — fetch OG metadata */
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    const getMeta = (property: string): string => {
      const m1 = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, "i"));
      if (m1) return m1[1];
      const m2 = html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, "i"));
      if (m2) return m2[1];
      return "";
    };

    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const domain = new URL(url).hostname.replace("www.", "");

    let thumbnailUrl = getMeta("og:image") || getMeta("twitter:image");
    if (thumbnailUrl?.startsWith("//")) thumbnailUrl = "https:" + thumbnailUrl;

    /* Try to detect media type from URL/content */
    let mediaType = "article";
    if (url.includes("spotify.com") || url.includes("podcast") || url.includes("apple.com/podcast")) {
      mediaType = "podcast";
    }

    return NextResponse.json({
      title: getMeta("og:title") || (titleTag ? titleTag[1].trim() : ""),
      excerpt: getMeta("og:description") || getMeta("description"),
      thumbnailUrl,
      source: getMeta("og:site_name") || domain,
      date: getMeta("article:published_time")?.slice(0, 10) || "",
      mediaType,
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Failed: ${e instanceof Error ? e.message : "Unknown error"}` },
      { status: 502 }
    );
  }
}
