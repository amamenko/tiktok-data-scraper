import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import { getWeekStart } from "@/utils/getWeekStart";
import { LiveRoom } from "@/interfaces/LiveRoom.interface";
import "dotenv/config";

process.env.TZ = "America/New_York";
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");

    const previousWeekStart = getWeekStart(1);

    const foundDoc = await db
      .collection("previousweektop100")
      .findOne({ weekStarting: previousWeekStart });

    if (foundDoc) {
      const modifiedLives = foundDoc.lives.map((live: LiveRoom, i: number) => {
        return {
          ...live,
          lastWeekRank: i,
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
