import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostContent } from "@/components/blog-post-content";
import { LudgiAttributionCard } from "@/components/ludgi-attribution-card";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog/db";
import { company, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "블로그 글을 찾을 수 없습니다 | SpaceTomato Cinema",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1600,
          height: 1000,
          alt: post.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: [post.coverImage],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-page blog-detail-page">
      <article>
        <header className="blog-detail-hero">
          <nav className="blog-topline" aria-label="블로그 상세 상단 이동">
            <Link href="/blog">Signal Archive</Link>
            <Link href="/">Main Interface</Link>
            <Link href="/company">LUDGI Inc.</Link>
          </nav>

          <div className="blog-detail-grid">
            <div className="blog-detail-copy">
              <p>{post.category}</p>
              <h1>{post.title}</h1>
              <span>{post.subtitle}</span>
              <div className="blog-detail-meta">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <strong>주식회사럿지 / LUDGI Inc.</strong>
              </div>
            </div>

            <div className="blog-detail-cover">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
                width={1600}
                height={1000}
                priority
                sizes="(max-width: 960px) 100vw, 48vw"
              />
            </div>
          </div>
        </header>

        <section className="blog-detail-body">
          <BlogPostContent blocks={post.content} />
          <LudgiAttributionCard />
        </section>
      </article>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: `${siteUrl}${post.coverImage}`,
            url: `${siteUrl}/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            inLanguage: "ko-KR",
            keywords: post.seo.keywords,
            author: {
              "@type": "Organization",
              name: company.legalName,
              alternateName: company.englishName,
              url: "https://info.ludgi.ai",
            },
            publisher: {
              "@type": "Organization",
              name: company.legalName,
              alternateName: company.englishName,
              url: "https://info.ludgi.ai",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
              },
            },
          }),
        }}
      />
    </main>
  );
}
