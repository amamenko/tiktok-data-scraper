import React from "react";
import { Metadata } from "next";
import { getMonthlyCounts } from "../../functions/getMonthlyCounts";
import { MonthlyData } from "@/components/Admin/MonthlyData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Monthly Diamond Counts | Royalty Talent Agency",
  description:
    "Admin page for the Royalty Talent Agency. Monthly Tik Tok diamonds for the agency.",
  metadataBase: new URL("https://royaltyrankings.vercel.app/admin/monthly"),
  openGraph: {
    title: "Admin | Monthly Diamond Counts | Royalty Talent Agency",
    description:
      "Admin page for the Royalty Talent Agency. Monthly Tik Tok diamonds for the agency.",
    url: new URL("https://royaltyrankings.vercel.app/admin/monthly"),
    images: "/opengraph-image.jpg",
  },
  twitter: {
    title: "Admin | Monthly Diamond Counts | Royalty Talent Agency",
    card: "summary_large_image",
    site: "https://royaltyrankings.vercel.app/admin/monthly",
    images: "/twitter-image.jpg",
  },
};

const aggregateMonthlyDiamonds = async () => {
  const monthlyCountsResponse = await getMonthlyCounts();
  return JSON.parse(JSON.stringify(monthlyCountsResponse.data || []));
};

export default async function AdminRoute() {
  const monthlyData = await aggregateMonthlyDiamonds();
  return <MonthlyData monthlyData={monthlyData} />;
}
