import type { BlogDataReason } from "@/lib/blog/db";

type BlogUnavailableCardProps = {
  reason: BlogDataReason;
  slug?: string;
};

const unavailableCopy: Record<
  BlogDataReason,
  {
    title: string;
    description: string;
  }
> = {
  "missing-database": {
    title: "콘텐츠 DB 연결이 필요합니다",
    description:
      "현재 블로그는 Neon DB를 기준으로만 콘텐츠를 불러옵니다. Vercel 환경변수에 DATABASE_URL 또는 POSTGRES_URL을 연결한 뒤 콘텐츠를 업로드해주세요.",
  },
  "database-error": {
    title: "콘텐츠를 불러올 수 없습니다",
    description:
      "Neon DB 연결은 감지됐지만 쿼리 중 문제가 발생했습니다. DB URL, blog_posts 테이블, 배포 환경변수를 확인해주세요.",
  },
  empty: {
    title: "게시된 콘텐츠가 없습니다",
    description:
      "DB 연결은 되어 있지만 published 상태의 블로그 글이 없습니다. CRM 또는 업로드 스크립트로 첫 콘텐츠를 등록해주세요.",
  },
  "not-found": {
    title: "콘텐츠를 찾을 수 없습니다",
    description:
      "요청한 slug와 일치하는 게시글이 Neon DB에 없습니다. 글 주소 또는 DB 업로드 상태를 확인해주세요.",
  },
};

export function BlogUnavailableCard({
  reason,
  slug,
}: BlogUnavailableCardProps) {
  const copy = unavailableCopy[reason];

  return (
    <div className="blog-unavailable-card" role="status">
      <p>Content Relay Offline</p>
      <h2>{copy.title}</h2>
      <span>{copy.description}</span>
      {slug ? <code>slug: {slug}</code> : null}
    </div>
  );
}
