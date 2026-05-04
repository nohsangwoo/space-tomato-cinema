import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { company, siteDescription, siteKeywords, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "우주토마토 | SpaceTomato Cinema by LUDGI",
    template: "%s | SpaceTomato Cinema",
  },
  description: siteDescription,
  applicationName: "SpaceTomato Cinema",
  authors: [{ name: company.legalName, url: "https://info.ludgi.ai" }],
  creator: company.legalName,
  publisher: company.legalName,
  keywords: siteKeywords,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "1024x1024" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  alternates: {
    canonical: "/",
    languages: {
      ko: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "SpaceTomato Cinema",
    title: "우주토마토 | SpaceTomato Cinema by LUDGI",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1730,
        height: 909,
        alt: "우주토마토 시네마틱 게임형 홈페이지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "우주토마토 | SpaceTomato Cinema by LUDGI",
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SpaceTomato Cinema",
              alternateName: ["우주토마토", "SpaceTomato"],
              url: siteUrl,
              inLanguage: "ko-KR",
              description: siteDescription,
              publisher: {
                "@type": "Organization",
                name: company.legalName,
                alternateName: company.englishName,
                url: "https://info.ludgi.ai",
                email: company.email,
                telephone: company.phone,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "인천광역시 연수구",
                  streetAddress: "인천타워대로 323, 에이동 20층",
                  addressCountry: "KR",
                },
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
