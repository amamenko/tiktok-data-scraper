import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers/Providers";
import SessionProvider from "@/components/Providers/SessionProvider";
import { getServerSession } from "next-auth";
import "./globals.css";

const tikTokDisplayFont = localFont({
  variable: "--font-tiktok-display",
  src: [
    {
      path: "../public/fonts/TikTokDisplayRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TikTokDisplayMedium.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/TikTokDisplayBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

const tikTokTextFont = localFont({
  variable: "--font-tiktok-text",
  src: [
    {
      path: "../public/fonts/TikTokTextRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TikTokTextMedium.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/TikTokTextBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Royalty Talent Agency",
  description: "Data from Tik Tok rooms pertaining to daily diamonds.",
  viewport:
    "width=device-width, height=device-height, initial-scale=1, shrink-to-fit=no, viewport-fit=cover",
  metadataBase: new URL("https://royaltyrankings.vercel.app"),
  openGraph: {
    title: "Royalty Talent Agency",
    description: "Data from Tik Tok rooms pertaining to daily diamonds.",
    url: new URL("https://royaltyrankings.vercel.app"),
    images: "/opengraph-image.jpg",
  },
  twitter: {
    title: "Royalty Talent Agency",
    card: "summary_large_image",
    site: "https://royaltyrankings.vercel.app",
    images: "/twitter-image.jpg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${tikTokDisplayFont.className} ${tikTokTextFont.className}`}
      >
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
