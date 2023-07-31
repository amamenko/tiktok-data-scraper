import { Request, Response } from "express";
import { DailyLive } from "../models/DailyLive";
import { format, startOfWeek, addDays, getUnixTime } from "date-fns";

export const getWeeklyRankings = async (req: Request, res: Response) => {
  const absoluteCurrentDate = new Date();

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
      },
    },
  ]);
  dailyLiveLives.sort((a, b) => b.diamonds - a.diamonds);
  const weekEndsOnDateUnix = getUnixTime(addDays(weekStartsOnDate, 6)) * 1000;
  const responseObj = {
    weekStarting: weekStartsOnFormatted,
    refreshAt: weekEndsOnDateUnix,
    lives: dailyLiveLives.slice(0, 100),
  };
  res.send(responseObj);
};
