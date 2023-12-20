import { NextRequest, NextResponse } from "next/server";
import { getTop100LiveResults } from "@/app/functions/getTop100LiveResults";
import { getDateBoundaries } from "@/app/functions/getDateBoundaries";
import clientPromise from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import { format, startOfWeek, sub } from "date-fns";

export async function GET(req: NextRequest) {
  const isWeekAgo = true;
  const previousWeekStart = format(
    startOfWeek(
      sub(new Date(), {
        weeks: 1,
      })
    ),
    "MM/dd/yyyy"
  );

  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");

    const foundDoc = await db.collection("previousweektop100").findOne({
      weekStarting: previousWeekStart,
    });

    if (!foundDoc) {
      // First clear out all previous week's data
      await db.collection("previousweektop100").deleteMany();

      // Then insert the new data
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

      await db.collection("previousweektop100").insertOne(resultResponse);
      return NextResponse.json({
        success: true,
        response: resultResponse,
      });
    } else {
      return NextResponse.json({
        success: true,
        response: `Previous week's top 100 already exists for ${previousWeekStart}`,
      });
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return NextResponse.json({
      success: false,
      response: e,
    });
  }
}
