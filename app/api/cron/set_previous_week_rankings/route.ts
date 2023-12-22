import { NextRequest, NextResponse } from "next/server";
import { getTop100LiveResults } from "@/app/functions/getTop100LiveResults";
import { getDateBoundaries } from "@/app/functions/getDateBoundaries";
import clientPromise from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import { getWeekStart } from "@/utils/getWeekStart";

export async function GET(req: NextRequest) {
  const previousWeekStart = getWeekStart(1);

  // Week starts to delete
  const twoWeeksAgoStart = getWeekStart(2);
  const threeWeeksAgoStart = getWeekStart(3);
  const fourWeeksAgoStart = getWeekStart(4);
  const fiveWeeksAgoStart = getWeekStart(5);
  const sixWeeksAgoStart = getWeekStart(6);

  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");

    const foundDoc = await db.collection("previousweektop100").findOne({
      weekStarting: previousWeekStart,
    });

    if (!foundDoc) {
      // First clear out all outdated weeks' data - only keep 2 weeks' worth
      await db.collection("previousweektop100").deleteMany({
        weekStarting: {
          $in: [
            twoWeeksAgoStart,
            threeWeeksAgoStart,
            fourWeeksAgoStart,
            fiveWeeksAgoStart,
            sixWeeksAgoStart,
          ],
        },
      });

      // Then insert the new data
      const {
        boundaryDatesArr,
        weekStartsOnDate,
        formattedBeginningDay,
        weekStartsOnFormatted,
      } = getDateBoundaries(1);

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
