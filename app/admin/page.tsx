import React from "react";
import { Metadata } from "next";
import { AdminLogin } from "@/components/Admin/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login | Royalty Talent Agency",
  description:
    "Admin login page for the Royalty Talent Agency regarding Tik Tok daily diamonds.",
  metadataBase: new URL("https://royaltyrankings.vercel.app/admin"),
  openGraph: {
    title: "Admin Login | Royalty Talent Agency",
    description:
      "Admin login page for the Royalty Talent Agency regarding Tik Tok daily diamonds.",
    url: new URL("https://royaltyrankings.vercel.app/admin"),
    images: "/opengraph-image.jpg",
  },
  twitter: {
    title: "Admin Login | Royalty Talent Agency",
    card: "summary_large_image",
    site: "https://royaltyrankings.vercel.app/admin",
    images: "/twitter-image.jpg",
  },
};

export default async function AdminRoute() {
  return <AdminLogin />;
}
