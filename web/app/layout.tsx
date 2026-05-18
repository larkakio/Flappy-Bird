import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PRODUCTION_SITE_URL = "https://flappy-bird-sigma-three.vercel.app";
const PRODUCTION_BASE_APP_ID = "6a0aaea01f1ccae4c221e8d0";

const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID?.trim() || PRODUCTION_BASE_APP_ID;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_SITE_URL,
  ),
  title: "Neon Flappy — Cyber Run",
  description:
    "Cyberpunk Flappy Bird on Base. Swipe to thrust through neon gates.",
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
  openGraph: {
    title: "Neon Flappy — Cyber Run",
    description: "Swipe up. Dodge the gates. Sync on Base.",
    images: [{ url: "/app-thumbnail.jpg", width: 1200, height: 628 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-hidden font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
