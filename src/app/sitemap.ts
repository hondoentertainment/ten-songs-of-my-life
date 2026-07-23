import type { MetadataRoute } from "next";
import { chapters } from "@/data/chapters";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");

  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/all`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...chapters.map((chapter) => ({
      url: `${base}/songs/${chapter.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
