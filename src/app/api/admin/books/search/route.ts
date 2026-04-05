import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Searches Google Books API by title and returns enriched metadata.
 * Used by the CMS auto-fill feature.
 */
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&printType=books`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Google Books API error" }, { status: 502 });
  }

  const data = await res.json();

  const results = (data.items ?? []).map((item: Record<string, unknown>) => {
    const info = item.volumeInfo as Record<string, unknown>;
    const imageLinks = (info.imageLinks ?? {}) as Record<string, string>;

    /* Get the highest resolution cover available.
       Google Books provides thumbnail, smallThumbnail, etc.
       We request a larger zoom via URL parameter. */
    let coverImage = "";
    if (imageLinks.extraLarge) coverImage = imageLinks.extraLarge;
    else if (imageLinks.large) coverImage = imageLinks.large;
    else if (imageLinks.medium) coverImage = imageLinks.medium;
    else if (imageLinks.thumbnail) {
      /* Upgrade thumbnail to higher res by changing zoom parameter */
      coverImage = imageLinks.thumbnail
        .replace("zoom=1", "zoom=3")
        .replace("&edge=curl", "");
    }
    /* Force HTTPS */
    coverImage = coverImage.replace("http://", "https://");

    return {
      title: info.title ?? "",
      author: ((info.authors as string[]) ?? []).join(", "),
      description: info.description ?? "",
      tag: ((info.categories as string[]) ?? []).join(", "),
      coverImage,
      publishedDate: info.publishedDate ?? "",
    };
  });

  return NextResponse.json(results);
}
