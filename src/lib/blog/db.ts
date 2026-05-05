import { neon } from "@neondatabase/serverless";
import type { BlogContentBlock, BlogPost, BlogPostStatus } from "./types";

type BlogPostRow = {
  slug: string;
  status: BlogPostStatus;
  title: string;
  subtitle: string | null;
  excerpt: string;
  category: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  published_at: Date | string;
  updated_at: Date | string | null;
  tags: unknown;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: unknown;
  content_blocks: unknown;
};

export type BlogDataReason =
  | "missing-database"
  | "database-error"
  | "empty"
  | "not-found";

export type BlogListResult =
  | {
      ok: true;
      posts: BlogPost[];
    }
  | {
      ok: false;
      posts: [];
      reason: Exclude<BlogDataReason, "not-found">;
    };

export type BlogPostResult =
  | {
      ok: true;
      post: BlogPost;
    }
  | {
      ok: false;
      post: null;
      reason: BlogDataReason;
    };

function getBlogDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL
  );
}

export function hasBlogDatabaseConnection() {
  return Boolean(getBlogDatabaseUrl());
}

function getSql() {
  const blogDatabaseUrl = getBlogDatabaseUrl();

  if (!blogDatabaseUrl) {
    return null;
  }

  return neon(blogDatabaseUrl);
}

function parseArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function toIsoDate(value: Date | string | null | undefined): string {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapRowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    status: row.status,
    title: row.title,
    subtitle: row.subtitle ?? "",
    excerpt: row.excerpt,
    category: row.category ?? "Signal Archive",
    publishedAt: toIsoDate(row.published_at),
    updatedAt: toIsoDate(row.updated_at ?? row.published_at),
    coverImage: row.cover_image ?? "/og-image.png",
    coverAlt: row.cover_alt ?? row.title,
    tags: parseArray<string>(row.tags),
    seo: {
      title: row.seo_title ?? row.title,
      description: row.seo_description ?? row.excerpt,
      keywords: parseArray<string>(row.seo_keywords),
    },
    content: parseArray<BlogContentBlock>(row.content_blocks),
  };
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPublishedPosts(): Promise<BlogListResult> {
  const sql = getSql();

  if (!sql) {
    return {
      ok: false,
      posts: [],
      reason: "missing-database",
    };
  }

  try {
    const rows = (await sql`
      SELECT
        slug,
        status,
        title,
        subtitle,
        excerpt,
        category,
        cover_image,
        cover_alt,
        published_at,
        updated_at,
        tags,
        seo_title,
        seo_description,
        seo_keywords,
        content_blocks
      FROM blog_posts
      WHERE status = 'published'
        AND published_at <= now()
      ORDER BY published_at DESC
    `) as BlogPostRow[];

    const posts = sortPosts(rows.map(mapRowToPost));

    if (posts.length === 0) {
      return {
        ok: false,
        posts: [],
        reason: "empty",
      };
    }

    return {
      ok: true,
      posts,
    };
  } catch (error) {
    console.error("Failed to read blog posts from Neon.", error);
    return {
      ok: false,
      posts: [],
      reason: "database-error",
    };
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostResult> {
  const sql = getSql();

  if (!sql) {
    return {
      ok: false,
      post: null,
      reason: "missing-database",
    };
  }

  try {
    const rows = (await sql`
      SELECT
        slug,
        status,
        title,
        subtitle,
        excerpt,
        category,
        cover_image,
        cover_alt,
        published_at,
        updated_at,
        tags,
        seo_title,
        seo_description,
        seo_keywords,
        content_blocks
      FROM blog_posts
      WHERE slug = ${slug}
        AND status = 'published'
        AND published_at <= now()
      LIMIT 1
    `) as BlogPostRow[];

    if (!rows[0]) {
      return {
        ok: false,
        post: null,
        reason: "not-found",
      };
    }

    return {
      ok: true,
      post: mapRowToPost(rows[0]),
    };
  } catch (error) {
    console.error(`Failed to read blog post "${slug}" from Neon.`, error);
    return {
      ok: false,
      post: null,
      reason: "database-error",
    };
  }
}
