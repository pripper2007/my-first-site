import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Fetches metadata from a URL for auto-filling pick fields.
 * Handles YouTube videos, podcast pages, articles — extracts
 * title, description, thumbnail, source, duration, etc.
 */
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

    if (ytMatch) {
      /* YouTube video — use oEmbed API for metadata */
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
