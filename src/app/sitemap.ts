import type { MetadataRoute } from "next";
import { getInsights } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pedroripper.com";
  const now = new Date().toISOString();

  const insights = await getInsights();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pedro-ripper`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/picks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/books`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/talks`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/base`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/irpf-skill`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...insights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: i.updatedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
