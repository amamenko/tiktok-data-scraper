import { DailyLive } from "@/interfaces/DailyLive.interface";
import { logger } from "@/lib/logger";
import clientPromise from "@/lib/mongodb";

process.env.TZ = "America/New_York";
export const getCurrentTop100Lives = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");
    const currentTop100Lives = await db
      .collection("currenttop100lives")
      .findOne();
    return currentTop100Lives as unknown as DailyLive;
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return { success: false };
  }
};
