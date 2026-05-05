import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getSql } from "./env.mjs";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: npm run blog:upsert -- content/blog/post-file.json");
  process.exit(1);
}

const requiredFields = ["slug", "title", "excerpt", "publishedAt", "content"];
const raw = await readFile(resolve(process.cwd(), filePath), "utf8");
const post = JSON.parse(raw);

for (const field of requiredFields) {
  if (!post[field]) {
    throw new Error(`Missing required blog field: ${field}`);
  }
}

if (!Array.isArray(post.content)) {
  throw new Error("Blog field 'content' must be an array of content blocks.");
}

const seo = post.seo ?? {};
const tags = Array.isArray(post.tags) ? post.tags : [];
const seoKeywords = Array.isArray(seo.keywords) ? seo.keywords : tags;
const sql = getSql();

await sql.query(
  `
    INSERT INTO blog_posts (
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
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11::jsonb,
      $12,
      $13,
      $14::jsonb,
      $15::jsonb
    )
    ON CONFLICT (slug)
    DO UPDATE SET
      status = EXCLUDED.status,
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      excerpt = EXCLUDED.excerpt,
      category = EXCLUDED.category,
      cover_image = EXCLUDED.cover_image,
      cover_alt = EXCLUDED.cover_alt,
      published_at = EXCLUDED.published_at,
      tags = EXCLUDED.tags,
      seo_title = EXCLUDED.seo_title,
      seo_description = EXCLUDED.seo_description,
      seo_keywords = EXCLUDED.seo_keywords,
      content_blocks = EXCLUDED.content_blocks
  `,
  [
    post.slug,
    post.status ?? "published",
    post.title,
    post.subtitle ?? "",
    post.excerpt,
    post.category ?? "Signal Archive",
    post.coverImage ?? "/og-image.png",
    post.coverAlt ?? post.title,
    post.publishedAt,
    post.updatedAt ?? post.publishedAt,
    JSON.stringify(tags),
    seo.title ?? post.title,
    seo.description ?? post.excerpt,
    JSON.stringify(seoKeywords),
    JSON.stringify(post.content),
  ],
);

console.log(`Blog post upserted: ${post.slug}`);
