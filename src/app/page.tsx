"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type SceneId = "origin" | "new-start" | "archive" | "signal" | "settings";

type Scene = {
  id: SceneId;
  code: string;
  menuLabel: string;
  menuHint: string;
  eyebrow: string;
  title: string;
  deck: string;
  objective: string;
  loopVideo: string;
  poster: string;
  channel: string;
  panelKicker: string;
  panelTitle: string;
  panelStatus: string;
  panelItems: {
    label: string;
    title: string;
    text: string;
  }[];
};

const heroLoop = "/media/hero_video.mp4";
const heroPoster = "/media/hero_image.png";
const commandLoop = "/media/inquiry_background.mp4";
const commandPoster = "/media/inquiry_end_frame.png";
const commandTransitionVideo = "/media/move_inquiry.mp4";

const scenes: Scene[] = [
  {
    id: "origin",
    code: "00",
    menuLabel: "메인 화면",
    menuHint: "Standby",
    eyebrow: "SPACETOMATO CINEMA",
    title: "우주 토마토가 깨어나는 밤",
    deck: "행성 궤도 위에서 시작되는 시네마틱 랜딩 인터페이스.",
    objective: "토마토 중심부의 신호를 추적 중",
    loopVideo: heroLoop,
    poster: heroPoster,
    channel: "Channel 00",
    panelKicker: "Orbital Feed",
    panelTitle: "Bio Signal Stable",
    panelStatus: "Cinematic interface ready",
    panelItems: [],
  },
  {
    id: "new-start",
    code: "01",
    menuLabel: "새로운 시작",
    menuHint: "New Start",
    eyebrow: "LAUNCH PROTOCOL",
    title: "첫 접속 시퀀스",
    deck: "처음 들어온 방문자를 우주 토마토 관측 임무로 끌어들이는 시작 화면.",
    objective: "브랜드 진입 동선 가동",
    loopVideo: commandLoop,
    poster: commandPoster,
    channel: "Channel 01",
    panelKicker: "New Operation",
    panelTitle: "브랜드 착륙 프로토콜",
    panelStatus: "Opening route online",
    panelItems: [
      {
        label: "Phase 01",
        title: "첫 프레임 각인",
        text: "시네마틱 영상과 대형 타이틀로 일반 랜딩이 아닌 게임 진입 화면의 감각을 먼저 전달합니다.",
      },
      {
        label: "Phase 02",
        title: "메뉴형 탐색",
        text: "방문자가 스크롤을 읽기 전에 직접 항목을 선택하며 세계관과 서비스 흐름을 파악하게 만듭니다.",
      },
      {
        label: "Phase 03",
        title: "전환 몰입감",
        text: "각 메뉴 진입마다 영상 시퀀스를 거쳐 다른 관제 화면으로 들어가는 듯한 인상을 만듭니다.",
      },
    ],
  },
  {
    id: "archive",
    code: "02",
    menuLabel: "불러오기",
    menuHint: "Load Archive",
    eyebrow: "SIGNAL ARCHIVE",
    title: "저장된 기록 호출",
    deck: "블로그, 제작 로그, 프로젝트 히스토리를 함선 기록 보관소처럼 불러오는 구간.",
    objective: "아카이브 슬롯 동기화",
    loopVideo: commandLoop,
    poster: commandPoster,
    channel: "Channel 02",
    panelKicker: "Load Archive",
    panelTitle: "관측 기록 보관소",
    panelStatus: "Archive slots indexed",
    panelItems: [
      {
        label: "Slot A",
        title: "시네마틱 랜딩 제작기",
        text: "우주 토마토 세계관, 영상 루프, 게임형 메뉴 UX를 어떻게 홈페이지 구조로 바꿨는지 기록합니다.",
      },
      {
        label: "Slot B",
        title: "AI 개발 도구 리서치",
        text: "Understand Anything 같은 개발 생산성 프로젝트를 분석하고 SpaceTomato 블로그 콘텐츠로 정리합니다.",
      },
      {
        label: "Slot C",
        title: "SEO 배포 로그",
        text: "Neon DB, Vercel Blob, sitemap, robots, GTM까지 검색 노출에 필요한 운영 기록을 보관합니다.",
      },
    ],
  },
  {
    id: "signal",
    code: "03",
    menuLabel: "문의하기",
    menuHint: "Inquiry",
    eyebrow: "COMMAND CHANNEL",
    title: "관제실 호출",
    deck: "프로젝트, 예약, 협업 요청을 우주 관제 채널로 전송합니다.",
    objective: "문의 전문 수신 대기",
    loopVideo: commandLoop,
    poster: commandPoster,
    channel: "Channel 03",
    panelKicker: "Command Transmission",
    panelTitle: "관제 전문 작성",
    panelStatus: "Secure relay ready",
    panelItems: [],
  },
  {
    id: "settings",
    code: "04",
    menuLabel: "설정",
    menuHint: "Settings",
    eyebrow: "SYSTEM CALIBRATION",
    title: "항해 값 조정",
    deck: "영상, 접근성, 검색 노출, 문의 흐름을 안정적으로 유지하는 시스템 설정 구간.",
    objective: "인터페이스 안정화",
    loopVideo: commandLoop,
    poster: commandPoster,
    channel: "Channel 04",
    panelKicker: "System Settings",
    panelTitle: "운영 파라미터",
    panelStatus: "Calibration active",
    panelItems: [
      {
        label: "Visual",
        title: "영상 루프 안정화",
        text: "모바일에서도 배경 영상이 가능한 한 즉시 재생되도록 명시적으로 재생을 요청하고 포스터 프레임을 유지합니다.",
      },
      {
        label: "Access",
        title: "가독성 우선 HUD",
        text: "게임 메뉴의 분위기는 유지하면서 제목, 설명, 버튼의 대비와 크기를 화면에 맞춰 조정합니다.",
      },
      {
        label: "Growth",
        title: "검색 신호 연결",
        text: "블로그, 회사 정보, GTM, 사이트맵을 함께 묶어 SpaceTomato Cinema의 운영 데이터를 추적합니다.",
      },
    ],
  },
];

function getTransitionVideo(nextId: SceneId) {
  return nextId === "origin" ? null : commandTransitionVideo;
}

export default function Home() {
  const [activeId, setActiveId] = useState<SceneId>("origin");
  const [pendingId, setPendingId] = useState<SceneId | null>(null);
  const [transitionVideo, setTransitionVideo] = useState<string | null>(null);
  const [isTransitionReady, setIsTransitionReady] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [menuAwake, setMenuAwake] = useState(true);
  const [transmissionState, setTransmissionState] = useState("대기 중");
  const loopVideoRef = useRef<HTMLVideoElement | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeScene = scenes.find((scene) => scene.id === activeId) ?? scenes[0];
  const isHome = activeScene.id === "origin";
  const isInquiry = activeScene.id === "signal";
  const isMenuBright = isHome || menuAwake;

  useEffect(() => {
    return () => {
      if (fadeTimer.current) {
        clearTimeout(fadeTimer.current);
      }

      if (menuTimer.current) {
        clearTimeout(menuTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = loopVideoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.playsInline = true;
    video.load();

    const playPromise = video.play();

    if (playPromise) {
      void playPromise.catch(() => undefined);
    }
  }, [activeId, activeScene.loopVideo]);

  function wakeMenu() {
    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
    }

    setMenuAwake(true);
  }

  function restMenu() {
    if (isHome) {
      return;
    }

    if (menuTimer.current) {
      clearTimeout(menuTimer.current);
    }

    menuTimer.current = setTimeout(() => {
      setMenuAwake(false);
    }, 2000);
  }

  function selectScene(nextId: SceneId) {
    wakeMenu();

    if (nextId === activeId || transitionVideo) {
      restMenu();
      return;
    }

    const keyedTransition = getTransitionVideo(nextId);
    setPendingId(nextId);

    if (keyedTransition) {
      setIsTransitionReady(false);
      setTransitionVideo(keyedTransition);
      return;
    }

    setIsFading(true);

    fadeTimer.current = setTimeout(() => {
      setActiveId(nextId);
      setPendingId(null);
      setIsFading(false);

      if (nextId !== "origin") {
        restMenu();
      }
    }, 520);
  }

  function finishTransition() {
    if (pendingId) {
      setActiveId(pendingId);
    }

    setPendingId(null);
    setTransitionVideo(null);
    setIsTransitionReady(false);

    if (pendingId !== "origin") {
      restMenu();
    }
  }

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTransmissionState("전문 저장 완료");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-black text-white lg:overflow-hidden">
      <video
        ref={loopVideoRef}
        key={`${activeScene.id}-${activeScene.loopVideo}`}
        className="absolute inset-0 h-full w-full object-cover"
        src={activeScene.loopVideo}
        poster={activeScene.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onCanPlay={(event) => {
          event.currentTarget.muted = true;
          void event.currentTarget.play().catch(() => undefined);
        }}
      />

      {transitionVideo ? (
        <video
          key={transitionVideo}
          className={`absolute inset-0 z-30 h-full w-full object-cover transition-opacity duration-75 ${
            isTransitionReady ? "opacity-100" : "opacity-0"
          }`}
          src={transitionVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedData={(event) => {
            event.currentTarget.currentTime = 0;
            setIsTransitionReady(true);
            void event.currentTarget.play().catch(() => undefined);
          }}
          onCanPlay={(event) => {
            event.currentTarget.muted = true;
            void event.currentTarget.play().catch(() => undefined);
          }}
          onEnded={finishTransition}
          onError={finishTransition}
        />
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-black transition-opacity duration-500 ${
          isFading ? "opacity-70" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-0 ${
          !isHome
            ? "bg-[radial-gradient(circle_at_77%_30%,rgba(109,205,255,0.2),transparent_20%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.56)_34%,rgba(0,0,0,0.12)_68%),linear-gradient(0deg,rgba(0,0,0,0.84),transparent_42%,rgba(0,0,0,0.26))]"
            : "bg-[radial-gradient(circle_at_62%_38%,rgba(255,48,35,0.18),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42)_32%,rgba(0,0,0,0.06)_62%),linear-gradient(0deg,rgba(0,0,0,0.8),transparent_38%,rgba(0,0,0,0.34))]"
        }`}
      />
      <div className="scanline-layer pointer-events-none absolute inset-0" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(340px,480px)_1fr] lg:px-12 lg:py-10 xl:grid-cols-[minmax(420px,560px)_1fr] xl:px-16 2xl:grid-cols-[minmax(500px,680px)_1fr] 2xl:px-20 2xl:py-14">
        <aside
          className={`game-menu flex min-h-[calc(100vh-48px)] flex-col justify-between transition-all duration-700 lg:min-h-[calc(100vh-80px)] ${
            isMenuBright
              ? "opacity-100 blur-0"
              : "opacity-35 blur-[0.2px] hover:opacity-100"
          }`}
          onMouseEnter={wakeMenu}
          onMouseLeave={restMenu}
          onFocus={wakeMenu}
          onBlur={restMenu}
        >
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-red-100/80 2xl:mb-10 2xl:text-xs">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 bg-red-500 shadow-[0_0_22px_rgba(255,59,48,0.9)]" />
                SpaceTomato Cinema
              </div>
              <Link
                className="publisher-link"
                href="/company"
                aria-label="주식회사 럿지 회사 소개 페이지로 이동"
              >
                LUDGI Inc.
              </Link>
              <Link
                className="publisher-link"
                href="/blog"
                aria-label="SpaceTomato Cinema 블로그로 이동"
              >
                Blog
              </Link>
            </div>

            <div className="scene-copy-panel mb-6 max-w-[430px] xl:max-w-[560px] 2xl:mb-9 2xl:max-w-[660px]">
              <p className="scene-eyebrow mb-3 text-xs font-semibold uppercase tracking-[0.42em] text-cyan-100/70">
                {activeScene.eyebrow}
              </p>
              <h1 className="scene-title korean-title text-4xl font-black leading-[0.96] sm:text-5xl lg:text-6xl 2xl:text-7xl">
                {activeScene.title}
              </h1>
              <p className="scene-deck korean-copy mt-4 max-w-[32rem] text-base leading-7 text-slate-100/78 2xl:max-w-[38rem] 2xl:text-lg">
                {activeScene.deck}
              </p>
            </div>

            <nav aria-label="Main sequence" className="main-sequence-nav flex flex-col gap-2">
              {scenes.map((scene) => {
                const isActive = scene.id === activeScene.id;

                return (
                  <button
                    key={scene.id}
                    type="button"
                    className={`game-menu-button group grid min-h-14 w-full grid-cols-[44px_1fr] items-center border-l-2 px-0 py-2 text-left transition-all duration-300 2xl:min-h-16 2xl:grid-cols-[52px_1fr] 2xl:py-3 ${
                      isActive
                        ? "border-red-400 text-white"
                        : "border-white/16 text-white/58 hover:border-cyan-200 hover:text-white"
                    }`}
                    onClick={() => selectScene(scene.id)}
                  >
                    <span
                      className={`game-menu-index text-xs font-bold tracking-[0.28em] transition-colors ${
                        isActive ? "text-red-200" : "text-white/32 group-hover:text-cyan-100"
                      }`}
                    >
                      {scene.code}
                    </span>
                    <span>
                      <span className="game-menu-label block text-xl font-extrabold uppercase leading-none 2xl:text-2xl">
                        {scene.menuLabel}
                      </span>
                      <span className="game-menu-hint mt-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36 group-hover:text-cyan-100/68">
                        {scene.menuHint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-8 grid gap-3 border-l-2 border-cyan-100/28 pl-5 text-xs uppercase tracking-[0.22em] text-white/58 sm:max-w-[380px]">
            <div>
              <p className="mb-2 text-white/30">Current Objective</p>
              <p className="text-sm font-bold tracking-[0.16em] text-cyan-50/88">
                {activeScene.objective}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/38">
              <span>Feed Online</span>
              <span>Loop Armed</span>
              <span>{pendingId ? "Switching" : transmissionState}</span>
            </div>
            <p className="max-w-[340px] text-[10px] leading-5 tracking-[0.16em] text-white/34">
              Produced by 럿지 · 주식회사 럿지 · 주식회사럿지 · LUDGI · LUDGI
              Inc.
            </p>
          </div>
        </aside>

        <div
          className={`mt-8 flex items-end justify-end lg:mt-0 lg:pb-4 lg:pr-2 ${
            !isHome ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {isInquiry ? (
            <InquiryConsole scene={activeScene} status={transmissionState} onSubmit={submitInquiry} />
          ) : isHome ? (
            <div className="hud-panel hidden w-[320px] border border-white/14 bg-black/16 p-5 text-right backdrop-blur-[2px] lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/44">
                {activeScene.panelKicker}
              </p>
              <p className="mt-3 text-3xl font-black tracking-[0.08em] text-white/86">
                {activeScene.code}
              </p>
              <p className="mt-3 text-xs uppercase leading-6 tracking-[0.2em] text-cyan-50/56">
                Bio signal stable
                <br />
                Cinematic interface ready
              </p>
            </div>
          ) : (
            <SceneConsole scene={activeScene} />
          )}
        </div>
      </section>
    </main>
  );
}

function SceneConsole({ scene }: { scene: Scene }) {
  return (
    <section className="mission-console w-full max-w-[560px] p-5 sm:p-6 2xl:max-w-[680px] 2xl:p-8">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-cyan-100/62">
            {scene.panelKicker}
          </p>
          <h2 className="korean-title mt-3 text-3xl font-black leading-none text-white sm:text-4xl 2xl:text-5xl">
            {scene.panelTitle}
          </h2>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-[0.24em] text-red-100/54">
          {scene.channel}
          <span className="mt-2 block text-cyan-100/80">{scene.panelStatus}</span>
        </div>
      </div>

      <div className="mission-grid">
        {scene.panelItems.map((item) => (
          <article key={item.label} className="mission-card">
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-50/42">
          Deck loop armed
        </p>
        <Link className="mission-link" href={scene.id === "archive" ? "/blog" : "/company"}>
          {scene.id === "archive" ? "기록 열람" : "럿지 호출"}
        </Link>
      </div>
    </section>
  );
}

function InquiryConsole({
  scene,
  status,
  onSubmit,
}: {
  scene: Scene;
  status: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="inquiry-console w-full max-w-[560px] p-5 sm:p-6 2xl:max-w-[680px] 2xl:p-8"
      onSubmit={onSubmit}
    >
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-cyan-100/62">
            {scene.panelKicker}
          </p>
          <h2 className="korean-title mt-3 text-3xl font-black leading-none text-white sm:text-4xl 2xl:text-5xl">
            {scene.panelTitle}
          </h2>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-[0.24em] text-red-100/54">
          {scene.channel}
          <span className="mt-2 block text-cyan-100/80">{status}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="inquiry-field">
          <span>호출명</span>
          <input className="inquiry-input" name="name" placeholder="함장명 또는 브랜드명" />
        </label>
        <label className="inquiry-field">
          <span>응답 채널</span>
          <input
            className="inquiry-input"
            name="email"
            type="email"
            placeholder="contact@domain.com"
          />
        </label>
      </div>

      <label className="inquiry-field mt-4">
        <span>작전 제목</span>
        <input className="inquiry-input" name="subject" placeholder="프로젝트명 또는 요청 제목" />
      </label>

      <label className="inquiry-field mt-4">
        <span>전문 내용</span>
        <textarea
          className="inquiry-input min-h-36 resize-none 2xl:min-h-44"
          name="message"
          placeholder="필요한 영상, 일정, 예산, 참고 자료를 남겨주세요."
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-50/42">
          Secure relay ready
        </p>
        <button className="transmission-button" type="submit">
          전문 송신
        </button>
      </div>
    </form>
  );
}
