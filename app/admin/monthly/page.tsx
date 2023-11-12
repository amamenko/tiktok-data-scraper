import React from "react";
import { Metadata } from "next";
import { getMonthlyCounts } from "../../functions/getMonthlyCounts";
import { MonthlyData } from "@/components/Admin/MonthlyData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Royalty Talent Agency",
  description:
    "Admin page for the Royalty Talent Agency regarding Tik Tok daily diamonds.",
  metadataBase: new URL("https://royaltyrankings.vercel.app/admin/monthly"),
};

const aggregateMonthlyDiamonds = async () => {
  const monthlyCountsResponse = await getMonthlyCounts();
  return JSON.parse(JSON.stringify(monthlyCountsResponse.data || []));
};

export default async function AdminRoute() {
  const monthlyData = await aggregateMonthlyDiamonds();
  return <MonthlyData monthlyData={monthlyData} />;
}
