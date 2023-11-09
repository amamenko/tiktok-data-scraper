import { NextRequest, NextResponse } from "next/server";
import { getTop100LiveResults } from "@/app/functions/getTop100LiveResults";
import { getDateBoundaries } from "@/app/functions/getDateBoundaries";

export async function GET(req: NextRequest) {
  const allSearchParams = req.nextUrl?.searchParams;
  const isWeekAgo = allSearchParams?.get("isWeekAgo") || "";

  const {
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted,
  } = getDateBoundaries(!!isWeekAgo);

  const resultResponse = await getTop100LiveResults(
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted
  );

  return NextResponse.json(resultResponse);
}
