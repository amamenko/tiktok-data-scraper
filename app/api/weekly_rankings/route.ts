import { NextRequest, NextResponse } from "next/server";
import { getCurrentTop100Lives } from "@/app/functions/getCurrentTop100Lives";

export const revalidate = 0;

process.env.TZ = "America/New_York";
export async function GET(req: NextRequest) {
  const resultResponse = await getCurrentTop100Lives();
  return NextResponse.json(resultResponse);
}
