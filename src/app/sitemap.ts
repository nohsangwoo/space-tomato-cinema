import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/db";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const lastModified = new Date("2026-05-05T00:00:00+09:00");

function toAbsoluteAssetUrl(src: string) {
  return src.startsWith("http") ? src : `${siteUrl}${src}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsResult = await getPublishedPosts();
  const posts = postsResult.ok ? postsResult.posts : [];
  const blogRoutes: MetadataRoute.Sitemap = postsResult.ok
    ? [
        {
          url: `${siteUrl}/blog`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.86,
          images: [`${siteUrl}/og-image.png`],
        },
        ...posts.map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.78,
          images: [toAbsoluteAssetUrl(post.coverImage)],
        })),
      ]
    : [];

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
    ...blogRoutes,
  ];
}
