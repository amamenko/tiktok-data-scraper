import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import { getWeekStart } from "@/utils/getWeekStart";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");

    const previousWeekStart = getWeekStart(1);

    const foundDoc = await db
      .collection("previousweektop100")
      .findOne({ weekStarting: previousWeekStart });

    if (foundDoc) {
      const twoWeeksAgoStart = getWeekStart(2);
      const foundTwoWeeksAgoDoc = await db
        .collection("previousweektop100")
        .findOne({ weekStarting: twoWeeksAgoStart });
      const foundTwoWeeksAgoTop100Lives =
        Array.from(foundTwoWeeksAgoDoc?.lives) || [];
      const modifiedLives = foundDoc.lives.map((live: any) => {
        const foundPreviousWeekRank = foundTwoWeeksAgoTop100Lives?.findIndex(
          (prevLive: any) => prevLive._id === live._id
        );
        return {
          ...live,
          lastWeekRank:
            foundPreviousWeekRank === undefined ? -1 : foundPreviousWeekRank,
        };
      });
      return NextResponse.json({ ...foundDoc, lives: modifiedLives });
    } else {
      return NextResponse.json(false);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return NextResponse.json(false);
  }
}
