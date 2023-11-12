import { NextRequest, NextResponse } from "next/server";
import { getMonthlyCounts } from "@/app/functions/getMonthlyCounts";

export async function GET(req: NextRequest) {
  const monthlyCountsResponse = await getMonthlyCounts();
  NextResponse.json(monthlyCountsResponse);
}
