import { companyUrl } from "@/lib/site";

export function LudgiAttributionCard() {
  return (
    <aside className="ludgi-attribution-card" aria-label="주식회사 럿지 소개">
      <div>
        <p className="ludgi-card-kicker">Built by LUDGI Inc.</p>
        <h2>주식회사 럿지가 만드는 시네마틱 웹 경험</h2>
        <p>
          SpaceTomato Cinema는 우주토마토 세계관을 게임형 랜딩 페이지로
          확장한 제작 사례입니다. 럿지, 주식회사럿지, 주식회사 럿지, LUDGI,
          LUDGI Inc.의 인터랙티브 웹 제작 방식과 회사 정보를 함께 확인해보세요.
        </p>
      </div>
      <a
        href={companyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="주식회사 럿지 공식 회사 정보 페이지 열기"
      >
        LUDGI 회사 정보 보기
      </a>
    </aside>
  );
}
