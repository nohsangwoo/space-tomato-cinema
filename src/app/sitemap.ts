import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const lastModified = new Date("2026-05-05T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/media/hero_image.png`, `${siteUrl}/media/inquiry_end_frame.png`],
    },
    {
      url: `${siteUrl}/company`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.82,
      images: [`${siteUrl}/media/inquiry_end_frame.png`],
    },
  ];
}
