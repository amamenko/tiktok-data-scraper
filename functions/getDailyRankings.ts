import { Request, Response } from "express";
import { logger } from "../logger/logger";
import { DailyLive } from "../models/DailyLive";
import { format } from "date-fns";

export const getDailyRankings = async (req: Request, res: Response) => {
  const queryDate: string = req.query.date ? req.query.date.toString() : "";
  const currentDate = queryDate ? queryDate : format(new Date(), "MM/dd/yyyy");
  const dailyLiveGen = await DailyLive.find(
    { date: currentDate },
    { date: 1, createdAt: 1, updatedAt: 1 }
  ).catch((e) => {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
  });
  const dailyLiveLives = await DailyLive.aggregate([
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
  ]);
  dailyLiveLives.sort((a, b) => b.diamonds - a.diamonds);
  const responseObj = {
    date: dailyLiveGen[0].date,
    createdAt: dailyLiveGen[0].createdAt,
    updatedAt: dailyLiveGen[0].updatedAt,
    lives: dailyLiveLives.slice(0, 100),
  };
  res.send(responseObj);
};
