"use client";

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
};

const heroLoop = "/media/hero_video.mp4";
const heroPoster = "/media/hero_image.png";

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
  },
  {
    id: "new-start",
    code: "01",
    menuLabel: "새로운 시작",
    menuHint: "New Start",
    eyebrow: "CHAPTER 01",
    title: "첫 번째 진입",
    deck: "브랜드의 첫 인상을 게임 시작 화면처럼 강하게 여는 구간.",
    objective: "오프닝 시퀀스 준비",
    loopVideo: heroLoop,
    poster: heroPoster,
  },
  {
    id: "archive",
    code: "02",
    menuLabel: "불러오기",
    menuHint: "Load Archive",
    eyebrow: "ARCHIVE",
    title: "기록된 장면들",
    deck: "프로젝트, 이미지, 영상 클립을 저장 슬롯처럼 탐색하는 구간.",
    objective: "보관된 릴 스캔",
    loopVideo: heroLoop,
    poster: heroPoster,
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
    loopVideo: "/media/inquiry_background.mp4",
    poster: "/media/inquiry_end_frame.png",
  },
  {
    id: "settings",
    code: "04",
    menuLabel: "설정",
    menuHint: "Settings",
    eyebrow: "SYSTEM",
    title: "감도 조정",
    deck: "사운드, 자막, 접근성, 테마 옵션을 담을 수 있는 설정 구간.",
    objective: "사용자 환경 조율",
    loopVideo: heroLoop,
    poster: heroPoster,
  },
];

const transitionVideos: Partial<Record<`${SceneId}:${SceneId}`, string>> = {
  "origin:signal": "/media/move_inquiry.mp4",
  "new-start:signal": "/media/move_inquiry.mp4",
  "archive:signal": "/media/move_inquiry.mp4",
  "settings:signal": "/media/move_inquiry.mp4",
};

export default function Home() {
  const [activeId, setActiveId] = useState<SceneId>("origin");
  const [pendingId, setPendingId] = useState<SceneId | null>(null);
  const [transitionVideo, setTransitionVideo] = useState<string | null>(null);
  const [isTransitionReady, setIsTransitionReady] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [menuAwake, setMenuAwake] = useState(true);
  const [transmissionState, setTransmissionState] = useState("대기 중");
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

    const keyedTransition = transitionVideos[`${activeId}:${nextId}`];
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
        key={`${activeScene.id}-${activeScene.loopVideo}`}
        className="absolute inset-0 h-full w-full object-cover"
        src={activeScene.loopVideo}
        poster={activeScene.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {transitionVideo ? (
        <video
          key={transitionVideo}
          className={`absolute inset-0 z-30 h-full w-full object-cover transition-opacity duration-75 ${
            isTransitionReady ? "opacity-100" : "opacity-0"
          }`}
          src={transitionVideo}
          muted
          playsInline
          preload="auto"
          onLoadedData={(event) => {
            event.currentTarget.currentTime = 0;
            setIsTransitionReady(true);
            void event.currentTarget.play();
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
          isInquiry
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
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-red-100/80 2xl:mb-10 2xl:text-xs">
              <span className="h-2 w-2 bg-red-500 shadow-[0_0_22px_rgba(255,59,48,0.9)]" />
              SpaceTomato Cinema
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
          </div>
        </aside>

        <div
          className={`mt-8 flex items-end justify-end lg:mt-0 lg:pb-4 lg:pr-2 ${
            isInquiry ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {isInquiry ? (
            <InquiryConsole status={transmissionState} onSubmit={submitInquiry} />
          ) : (
            <div className="hud-panel hidden w-[320px] border border-white/14 bg-black/16 p-5 text-right backdrop-blur-[2px] lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-white/44">
                Orbital Feed
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
          )}
        </div>
      </section>
    </main>
  );
}

function InquiryConsole({
  status,
  onSubmit,
}: {
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
            Command Transmission
          </p>
          <h2 className="korean-title mt-3 text-3xl font-black leading-none text-white sm:text-4xl 2xl:text-5xl">
            관제 전문 작성
          </h2>
        </div>
        <div className="text-right text-[10px] font-bold uppercase tracking-[0.24em] text-red-100/54">
          Channel 03
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
