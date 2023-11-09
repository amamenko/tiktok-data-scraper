import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const allSearchParams = req.nextUrl?.searchParams;
  let queryDate = allSearchParams?.get("date") || "";
  const currentDate = queryDate ? queryDate : format(new Date(), "MM/dd/yyyy");
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");
    const dailyLiveGen = await db
      .collection("dailylives")
      .find({ date: currentDate })
      .project({ date: 1, createdAt: 1, updatedAt: 1 })
      .toArray();

    const dailyLiveLives = await db
      .collection("dailylives")
      .aggregate([
        { $match: { date: currentDate } },
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
          $project: {
            _id: 0,
            roomID: "$lives.roomID",
            diamonds: "$lives.diamonds",
            displayID: "$userInfo.displayID",
            userID: "$userInfo.userID",
            avatar: "$userInfo.avatar",
            updatedAt: "$lives.updatedAt",
            createdAt: "$lives.createdAt",
          },
        },
      ])
      .toArray();
    dailyLiveLives.sort((a, b) => b.diamonds - a.diamonds);
    const responseObj = {
      date: dailyLiveGen[0].date,
      createdAt: dailyLiveGen[0].createdAt,
      updatedAt: dailyLiveGen[0].updatedAt,
      lives: dailyLiveLives.slice(0, 100),
    };
    return NextResponse.json(responseObj);
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return NextResponse.json({
      success: false,
    });
  }
}
