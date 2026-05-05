import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/db";
import { company, siteKeywords, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "블로그 | SpaceTomato Cinema",
  description:
    "우주토마토, 우주정복, 우주산업, 게임형 홈페이지 제작 과정을 기록하는 SpaceTomato Cinema 블로그입니다. 럿지, 주식회사럿지, LUDGI, LUDGI Inc. 제작 노트를 함께 제공합니다.",
  keywords: [
    ...siteKeywords,
    "블로그",
    "게임형 홈페이지",
    "코즈믹 호러",
    "주식회사럿지",
    "LUDGI Inc.",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "SpaceTomato Cinema 블로그",
    description:
      "우주토마토 세계관과 게임형 홈페이지 제작 과정을 기록하는 LUDGI 콘텐츠 허브입니다.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceTomato Cinema 블로그",
    description:
      "우주토마토 세계관과 게임형 홈페이지 제작 과정을 기록하는 LUDGI 콘텐츠 허브입니다.",
    images: ["/og-image.png"],
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="blog-page">
      <section className="blog-index-hero">
        <nav className="blog-topline" aria-label="블로그 상단 이동">
          <Link href="/">SpaceTomato Cinema</Link>
          <Link href="/company">LUDGI Inc.</Link>
        </nav>

        <div className="blog-index-copy">
          <p>Signal Archive</p>
          <h1>우주 토마토 관측 기록</h1>
          <span>
            우주정복, 우주토마토, 토마토, 우주산업, 게임형 홈페이지 제작
            과정을 하나의 시네마틱 기록으로 쌓아가는 블로그입니다.
          </span>
        </div>

        <div className="blog-index-seo-card">
          <span>Publisher</span>
          <strong>{company.legalName} / LUDGI Inc.</strong>
          <p>
            모든 상세 콘텐츠는 럿지, 주식회사럿지, 주식회사 럿지, LUDGI,
            LUDGI Inc. 키워드와 공식 회사 정보 링크를 포함합니다.
          </p>
        </div>
      </section>

      <section className="blog-index-list" aria-label="블로그 글 목록">
        <div className="blog-section-heading">
          <p>[ 001 - Transmission List ]</p>
          <h2>Published Signals</h2>
        </div>

        <div className="blog-card-grid">
          {posts.map((post, index) => (
            <article className="blog-card" key={post.slug}>
              <Link href={`/blog/${post.slug}`} aria-label={`${post.title} 읽기`}>
                <div className="blog-card-image">
                  <Image
                    src={post.coverImage}
                    alt={post.coverAlt}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{post.category}</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-tags">
                    {post.tags.slice(0, 5).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "SpaceTomato Cinema Blog",
            url: `${siteUrl}/blog`,
            inLanguage: "ko-KR",
            publisher: {
              "@type": "Organization",
              name: company.legalName,
              alternateName: company.englishName,
              url: "https://info.ludgi.ai",
            },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${siteUrl}/blog/${post.slug}`,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
            })),
          }),
        }}
      />
    </main>
  );
}
