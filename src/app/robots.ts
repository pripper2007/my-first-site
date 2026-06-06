import type { MetadataRoute } from "next";

/**
 * Indexing policy: everything public is crawlable (admin/API excluded).
 * AI crawlers are explicitly welcomed — the goal is for this site to be
 * the canonical, retrievable source about Pedro Ripper in AI assistants
 * and answer engines. See also /llms.txt and /llms-full.txt.
 */
const DISALLOW = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "GPTBot", allow: "/", disallow: DISALLOW },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: DISALLOW },
      { userAgent: "ChatGPT-User", allow: "/", disallow: DISALLOW },
      { userAgent: "ClaudeBot", allow: "/", disallow: DISALLOW },
      { userAgent: "Claude-User", allow: "/", disallow: DISALLOW },
      { userAgent: "PerplexityBot", allow: "/", disallow: DISALLOW },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW },
      { userAgent: "Bingbot", allow: "/", disallow: DISALLOW },
    ],
    sitemap: "https://pedroripper.com/sitemap.xml",
  };
}
