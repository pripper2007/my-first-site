import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pedroripper.com";
  const now = new Date().toISOString();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/picks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/books`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/talks`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
