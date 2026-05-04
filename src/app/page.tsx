"use client";

import { useEffect, useRef, useState } from "react";

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
    loopVideo: "/media/hero_video.mp4",
    poster: "/media/hero_image.png",
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
    loopVideo: "/media/hero_video.mp4",
    poster: "/media/hero_image.png",
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
    loopVideo: "/media/hero_video.mp4",
    poster: "/media/hero_image.png",
  },
  {
    id: "signal",
    code: "03",
    menuLabel: "송신하기",
    menuHint: "Contact",
    eyebrow: "TRANSMISSION",
    title: "관제실 연결",
    deck: "문의, 예약, 협업 요청을 하나의 송신 콘솔처럼 다루는 구간.",
    objective: "외부 채널 동기화",
    loopVideo: "/media/hero_video.mp4",
    poster: "/media/hero_image.png",
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
    loopVideo: "/media/hero_video.mp4",
    poster: "/media/hero_image.png",
  },
];

const transitionVideos: Partial<Record<`${SceneId}:${SceneId}`, string>> = {};

export default function Home() {
  const [activeId, setActiveId] = useState<SceneId>("origin");
  const [pendingId, setPendingId] = useState<SceneId | null>(null);
  const [transitionVideo, setTransitionVideo] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [menuAwake, setMenuAwake] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeScene = scenes.find((scene) => scene.id === activeId) ?? scenes[0];
  const isHome = activeScene.id === "origin";
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

    if (nextId === activeId) {
      restMenu();
      return;
    }

    const keyedTransition = transitionVideos[`${activeId}:${nextId}`];
    setPendingId(nextId);

    if (keyedTransition) {
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

    if (pendingId !== "origin") {
      restMenu();
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        key={activeScene.loopVideo}
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
          className="absolute inset-0 z-20 h-full w-full object-cover"
          src={transitionVideo}
          autoPlay
          muted
          playsInline
          onEnded={finishTransition}
        />
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-black transition-opacity duration-500 ${
          isFading ? "opacity-70" : "opacity-0"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_62%_38%,rgba(255,48,35,0.18),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42)_32%,rgba(0,0,0,0.06)_62%),linear-gradient(0deg,rgba(0,0,0,0.8),transparent_38%,rgba(0,0,0,0.34))]" />
      <div className="scanline-layer pointer-events-none absolute inset-0" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(300px,440px)_1fr] lg:px-12 lg:py-10">
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
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-red-100/80">
              <span className="h-2 w-2 bg-red-500 shadow-[0_0_22px_rgba(255,59,48,0.9)]" />
              SpaceTomato Cinema
            </div>

            <div className="mb-7 max-w-[430px]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.42em] text-cyan-100/70">
                {activeScene.eyebrow}
              </p>
              <h1 className="korean-title text-4xl font-black leading-[0.96] sm:text-5xl 2xl:text-7xl">
                {activeScene.title}
              </h1>
              <p className="korean-copy mt-4 max-w-[32rem] text-base leading-7 text-slate-100/78 2xl:text-lg">
                {activeScene.deck}
              </p>
            </div>

            <nav aria-label="Main sequence" className="flex flex-col gap-2">
              {scenes.map((scene) => {
                const isActive = scene.id === activeScene.id;

                return (
                  <button
                    key={scene.id}
                    type="button"
                    className={`group grid min-h-14 w-full grid-cols-[44px_1fr] items-center border-l-2 px-0 py-2 text-left transition-all duration-300 2xl:min-h-16 2xl:py-3 ${
                      isActive
                        ? "border-red-400 text-white"
                        : "border-white/16 text-white/58 hover:border-cyan-200 hover:text-white"
                    }`}
                    onClick={() => selectScene(scene.id)}
                  >
                    <span
                      className={`text-xs font-bold tracking-[0.28em] transition-colors ${
                        isActive ? "text-red-200" : "text-white/32 group-hover:text-cyan-100"
                      }`}
                    >
                      {scene.code}
                    </span>
                    <span>
                      <span className="block text-xl font-extrabold uppercase leading-none 2xl:text-2xl">
                        {scene.menuLabel}
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36 group-hover:text-cyan-100/68">
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
              <span>{pendingId ? "Switching" : "Idle"}</span>
            </div>
          </div>
        </aside>

        <div className="pointer-events-none hidden items-end justify-end pb-4 pr-2 lg:flex">
          <div className="hud-panel w-[320px] border border-white/14 bg-black/16 p-5 text-right backdrop-blur-[2px]">
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
        </div>
      </section>
    </main>
  );
}
