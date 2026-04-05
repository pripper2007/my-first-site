import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Fetches OG metadata from a URL for auto-filling news article fields.
 * Extracts: title, description, image, site name, published date.
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
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    /* Extract meta tags */
    const getMeta = (property: string): string => {
      // Try property="..." content="..."
      const m1 = html.match(
        new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
      );
      if (m1) return m1[1];
      // Try content="..." property="..."
      const m2 = html.match(
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, "i")
      );
      if (m2) return m2[1];
      return "";
    };

    /* Extract <title> as fallback */
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    /* Extract domain for source name */
    const domain = new URL(url).hostname.replace("www.", "");

    /* Try to get a readable source name from og:site_name */
    const siteName = getMeta("og:site_name");

    const result = {
      title: getMeta("og:title") || (titleTag ? titleTag[1].trim() : ""),
      excerpt: getMeta("og:description") || getMeta("description"),
      imageUrl: getMeta("og:image") || getMeta("twitter:image"),
      source: siteName || domain,
      date: getMeta("article:published_time")?.slice(0, 10) || "",
      language: getMeta("og:locale")?.replace("_", "-") || "",
    };

    /* Fix relative/protocol-relative image URLs */
    if (result.imageUrl) {
      if (result.imageUrl.startsWith("//")) {
        result.imageUrl = "https:" + result.imageUrl;
      } else if (result.imageUrl.startsWith("/")) {
        const origin = new URL(url).origin;
        result.imageUrl = origin + result.imageUrl;
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to fetch: ${e instanceof Error ? e.message : "Unknown error"}` },
      { status: 502 }
    );
  }
}
