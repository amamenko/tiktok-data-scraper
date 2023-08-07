import { Request, Response } from "express";
import { DailyLive } from "../models/DailyLive";
import { format, startOfWeek, addDays, getUnixTime } from "date-fns";

export const getWeeklyRankings = async (req: Request, res: Response) => {
  const absoluteCurrentDate = new Date();
  const formattedCurrentDate = format(new Date(), "MM/dd/yyyy");

  const weekStartsOnDate = startOfWeek(absoluteCurrentDate); // Sunday
  const weekStartsOnFormatted = format(weekStartsOnDate, "MM/dd/yyyy");
  const boundaryDatesArr = [weekStartsOnFormatted];

  for (let i = 1; i < 7; i++) {
    const addedFormattedDate = format(
      addDays(weekStartsOnDate, i),
      "MM/dd/yyyy"
    );
    boundaryDatesArr.push(addedFormattedDate);
  }

  const dailyLiveLives = await DailyLive.aggregate([
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
        updatedAt: { $first: "$userInfo.updatedAt" },
      },
    },
  ]);
  dailyLiveLives.sort((a, b) => b.diamonds - a.diamonds);
  const topHundredLives = dailyLiveLives.slice(0, 100);
  const topHundredLivesUnixUpdated = topHundredLives.map((live) => {
    return { ...live, updatedAt: getUnixTime(live.updatedAt) * 1000 };
  });
  const weekEndsOnDateUnix = getUnixTime(addDays(weekStartsOnDate, 7)) * 1000;
  const dailyLiveGen = await DailyLive.find(
    { date: formattedCurrentDate },
    { date: 1, updatedAt: 1 }
  ).catch((e) => console.error(e));
  const responseObj = {
    weekStarting: weekStartsOnFormatted,
    refreshAt: weekEndsOnDateUnix,
    lives: topHundredLivesUnixUpdated,
    updatedAt: getUnixTime(dailyLiveGen[0].updatedAt) * 1000,
  };
  res.send(responseObj);
};
