import { addDays, getUnixTime } from "date-fns";
import { logger } from "@/lib/logger";
import clientPromise from "@/lib/mongodb";

export const getTop100LiveResults = async (
  boundaryDatesArr: string[],
  weekStartsOnDate: Date,
  formattedCurrentDate: string,
  weekStartsOnFormatted: string
) => {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");
    const dailyLiveLives = await db
      .collection("dailylives")
      .aggregate([
        { $match: { date: { $in: boundaryDatesArr } } },
        { $unwind: "$date" },
        { $unwind: "$createdAt" },
        { $unwind: "$updatedAt" },
        { $unwind: "$lives" },
        {
          $lookup: {
            from: "users",
            localField: "lives.userID",
            foreignField: "userID",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $group: {
            _id: "$userInfo.userID",
            diamonds: { $sum: "$lives.diamonds" },
            displayID: { $first: "$userInfo.displayID" },
            userID: { $first: "$userInfo.userID" },
            avatar: { $first: "$userInfo.avatar" },
            updatedAt: { $last: "$userInfo.updatedAt" },
          },
        },
      ])
      .toArray();
    dailyLiveLives.sort((a, b) => b.diamonds - a.diamonds);
    const topHundredLives = dailyLiveLives.slice(0, 100);
    const topHundredLivesUnixUpdated = topHundredLives.map((live) => {
      return { ...live, updatedAt: getUnixTime(live.updatedAt) * 1000 };
    });
    const weekEndsOnDateUnix = getUnixTime(addDays(weekStartsOnDate, 7)) * 1000;
    const dailyLiveGen = await db
      .collection("dailylives")
      .find({ date: formattedCurrentDate })
      .project({ date: 1, updatedAt: 1 })
      .toArray();

    const responseObj = {
      weekStarting: weekStartsOnFormatted,
      refreshAt: weekEndsOnDateUnix,
      lives: topHundredLivesUnixUpdated,
      updatedAt: getUnixTime(dailyLiveGen[0]?.updatedAt) * 1000,
      serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    return responseObj;
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return { success: false };
  }
};
