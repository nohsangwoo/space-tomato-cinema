import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SpaceTomato Cinema",
    short_name: "SpaceTomato",
    description:
      "우주토마토와 우주정복 콘셉트를 시네마틱 영상 전환형 UX로 구현한 인터랙티브 홈페이지",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020204",
    theme_color: "#ff3b30",
    lang: "ko-KR",
    categories: ["technology", "entertainment", "business"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
