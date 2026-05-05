import { getSql } from "./env.mjs";

const statements = [
  "CREATE EXTENSION IF NOT EXISTS pgcrypto",
  `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text NOT NULL UNIQUE,
      status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      title text NOT NULL,
      subtitle text,
      excerpt text NOT NULL,
      category text,
      cover_image text,
      cover_alt text,
      published_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      tags jsonb NOT NULL DEFAULT '[]'::jsonb,
      seo_title text,
      seo_description text,
      seo_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      content_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `,
  "CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON blog_posts (status, published_at DESC)",
  "CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx ON blog_posts USING gin (tags)",
  "CREATE INDEX IF NOT EXISTS blog_posts_seo_keywords_gin_idx ON blog_posts USING gin (seo_keywords)",
  `
    CREATE OR REPLACE FUNCTION set_blog_posts_updated_at()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `,
  "DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts",
  `
    CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_blog_posts_updated_at()
  `,
];

const sql = getSql();

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Blog database migration completed.");
