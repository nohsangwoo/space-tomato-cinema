import type { Metadata } from "next";
import Link from "next/link";
import { company, companyUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "주식회사 럿지 소개",
  description:
    "주식회사 럿지(LUDGI Inc.)는 공공기관 SI 수주와 30여 개 이상의 민간 프로젝트를 수행한 소프트웨어 개발 전문 기업입니다.",
  alternates: {
    canonical: "/company",
  },
  openGraph: {
    title: "주식회사 럿지 | LUDGI Inc.",
    description:
      "공공기관 SI, AI 솔루션, 풀스택 개발, 클라우드 인프라를 수행하는 소프트웨어 개발 파트너입니다.",
    url: "/company",
    type: "profile",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "주식회사 럿지와 우주토마토 프로젝트 소개",
      },
    ],
  },
};

const capabilities = [
  ["01", "Full-stack Engineering", "React, Next.js, Flutter, Node.js, Python 기반 웹/앱 전 영역 개발"],
  ["02", "AI · ML Solutions", "LLM, RAG, Vector Search, Computer Vision 등 AI 기반 비즈니스 솔루션"],
  ["03", "Cloud & DevOps", "AWS, GCP, Firebase, Docker, Kubernetes 기반 인프라 설계 및 운영"],
  ["04", "Public Sector SI", "나라장터 입찰, 조달 수주, 보안 요구사항 대응, 법규 준수"],
  ["05", "Startup MVP", "기획부터 설계, 개발, 출시까지 원스톱 MVP 개발"],
  ["06", "Technical Consulting", "아키텍처 설계, 기술 스택 선정, 코드 리뷰, 인프라 진단"],
];

const companyRows = [
  ["법인명", `${company.legalName} (${company.englishName})`],
  ["대표이사", company.representative],
  ["설립", `${company.founded}년`],
  ["사업자등록번호", company.businessNumber],
  ["DUNS Number", company.duns],
  ["주소", company.address],
  ["대표전화", company.phone],
  ["이메일", company.email],
];

const techStacks = [
  ["Frontend", ["React", "Next.js", "TypeScript", "Flutter", "React Native", "Tailwind CSS"]],
  ["Backend", ["Node.js", "Python", "Django", "FastAPI", "Go", "Spring Boot"]],
  ["Cloud", ["AWS", "GCP", "Firebase", "Docker", "Kubernetes", "Vercel"]],
  ["AI & Data", ["LLM / RAG", "Computer Vision", "NLP", "TensorFlow", "PostgreSQL", "MongoDB"]],
];

export default function CompanyPage() {
  return (
    <main className="company-page min-h-screen bg-[#020507] text-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.legalName,
            alternateName: company.englishName,
            url: companyUrl,
            email: company.email,
            telephone: company.phone,
            foundingDate: company.founded,
            identifier: [
              {
                "@type": "PropertyValue",
                propertyID: "Business Registration Number",
                value: company.businessNumber,
              },
              {
                "@type": "PropertyValue",
                propertyID: "DUNS",
                value: company.duns,
              },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "인천타워대로 323, 에이동 20층",
              addressLocality: "연수구",
              addressRegion: "인천광역시",
              addressCountry: "KR",
            },
            makesOffer: capabilities.map(([, name, description]) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name,
                description,
              },
            })),
          }),
        }}
      />

      <header className="company-hero px-6 py-6 sm:px-10 lg:px-16">
        <nav className="mx-auto flex max-w-7xl items-center justify-between text-xs font-bold uppercase tracking-[0.28em] text-white/56">
          <Link href="/" className="company-wordmark">
            SpaceTomato
          </Link>
          <div className="flex items-center gap-5">
            <a href={companyUrl} target="_blank" rel="noreferrer">
              LUDGI Main
            </a>
            <Link href="/">Back</Link>
          </div>
        </nav>

        <section className="mx-auto grid max-w-7xl gap-12 pb-20 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.44em] text-cyan-100/70">
              About — 주식회사 럿지
            </p>
            <h1 className="korean-title text-5xl font-black leading-[0.94] sm:text-7xl lg:text-8xl">
              주식회사 럿지.
            </h1>
            <p className="mt-5 text-2xl font-semibold text-white/80">
              LUDGI Inc. — Software Development Partner
            </p>
            <p className="korean-copy mt-8 max-w-3xl text-lg leading-9 text-white/68">
              주식회사 럿지는 공공기관 SI 수주와 30여 개 이상의 민간 프로젝트를
              성공적으로 수행한 소프트웨어 개발 전문 기업입니다. 나라장터 조달,
              한국전력공사, 한전KDN 등 신뢰가 요구되는 프로젝트에서 검증된 기술
              역량을 보유하고 있습니다.
            </p>
          </div>

          <div className="company-signal">
            <p>TRUST</p>
            <p>TECHNOLOGY</p>
            <p>PARTNERSHIP</p>
            <p>QUALITY</p>
            <p>LUDGI</p>
          </div>
        </section>
      </header>

      <section className="company-band px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["30+", "Projects"],
            ["98%", "Satisfaction"],
            ["100%", "On-time"],
            ["3+", "Public Sector"],
          ].map(([value, label]) => (
            <div key={label} className="company-metric">
              <p>{value}</p>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionLabel index="002" title="Company" />
          <div className="company-info-grid">
            {companyRows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="company-band px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionLabel index="003" title="Capabilities" />
          <div>
            <h2 className="mb-8 text-4xl font-black sm:text-6xl">What we do.</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {capabilities.map(([code, title, body]) => (
                <article className="company-capability" key={title}>
                  <span>{code}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionLabel index="004" title="Track Record" />
          <div className="grid gap-8 md:grid-cols-2">
            <Track title="Public Sector" items={["나라장터 조달 수주", "한국전력공사 (KEPCO)", "한전KDN"]} />
            <Track
              title="Private · 30+ Projects"
              items={[
                "이커머스 · 쇼핑몰",
                "SaaS · B2B 대시보드",
                "헬스케어 · 의료 AI",
                "교육 · 에듀테크",
                "물류 · TMS",
                "부동산 · 핀테크",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="company-band px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionLabel index="005" title="Technology" />
          <div>
            <h2 className="mb-8 text-4xl font-black sm:text-6xl">Our stack.</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {techStacks.map(([group, items]) => (
                <div className="company-stack" key={group as string}>
                  <h3>{group}</h3>
                  <div>
                    {(items as string[]).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 border-t border-white/10 pt-12 md:grid-cols-[1fr_1fr_1fr]">
          <div>
            <p className="text-4xl font-black">LUDGI.</p>
            <p className="mt-5 max-w-sm text-lg leading-8 text-white/58">
              기술은 단순히 기능이 아닙니다. 신뢰를 코드로 번역하는 일.
            </p>
          </div>
          <div className="company-footer-list">
            <h2>Contact</h2>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a href={`tel:${company.phone}`}>{company.phone}</a>
          </div>
          <div className="company-footer-list">
            <h2>Office</h2>
            <p>인천광역시 연수구</p>
            <p>인천타워대로 323</p>
            <p>에이동 20층</p>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 text-xs uppercase tracking-[0.18em] text-white/36 md:flex-row md:items-center md:justify-between">
          <p>© 2026 주식회사 럿지 · LUDGI Inc.</p>
          <p>사업자등록번호 · {company.businessNumber} · DUNS · {company.duns}</p>
        </div>
      </footer>
    </main>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="company-section-label">
      <p>[ {index} — {title} ]</p>
    </div>
  );
}

function Track({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="company-track">
      <h3>{title}</h3>
      <ol>
        {items.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ol>
    </article>
  );
}
