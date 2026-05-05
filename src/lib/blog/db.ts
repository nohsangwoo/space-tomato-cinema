import { neon } from "@neondatabase/serverless";
import { fallbackPosts } from "./fallback-posts";
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

const blogDatabaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;

function getSql() {
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

async function readPostsFromDatabase() {
  const sql = getSql();

  if (!sql) {
    return null;
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

    return rows.map(mapRowToPost);
  } catch (error) {
    console.error("Failed to read blog posts from Neon.", error);
    return null;
  }
}

async function readPostFromDatabase(slug: string) {
  const sql = getSql();

  if (!sql) {
    return null;
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

    return rows[0] ? mapRowToPost(rows[0]) : null;
  } catch (error) {
    console.error(`Failed to read blog post "${slug}" from Neon.`, error);
    return null;
  }
}

export async function getPublishedPosts() {
  const databasePosts = await readPostsFromDatabase();

  if (databasePosts) {
    return sortPosts(databasePosts.length > 0 ? databasePosts : fallbackPosts);
  }

  return sortPosts(fallbackPosts);
}

export async function getPostBySlug(slug: string) {
  const databasePost = await readPostFromDatabase(slug);

  if (databasePost) {
    return databasePost;
  }

  return fallbackPosts.find((post) => post.slug === slug) ?? null;
}
