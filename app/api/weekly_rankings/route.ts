import { NextRequest, NextResponse } from "next/server";
import { getTop100LiveResults } from "@/app/functions/getTop100LiveResults";
import { getDateBoundaries } from "@/app/functions/getDateBoundaries";

export const revalidate = 0;

process.env.TZ = "America/New_York";
export async function GET(req: NextRequest) {
  const {
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted,
  } = getDateBoundaries();

  const resultResponse = await getTop100LiveResults(
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted
  );

  return NextResponse.json(resultResponse);
}
