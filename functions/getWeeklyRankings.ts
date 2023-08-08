import { Request, Response } from "express";
import { format, startOfWeek, addDays } from "date-fns";
import { getTop100LiveResults } from "./getTop100LiveResults";

export const getWeeklyRankings = async (req: Request, res: Response) => {
  const absoluteCurrentDate = new Date();
  const formattedCurrentDate = format(absoluteCurrentDate, "MM/dd/yyyy");

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

  return await getTop100LiveResults(
    res,
    boundaryDatesArr,
    weekStartsOnDate,
    formattedCurrentDate,
    weekStartsOnFormatted,
    "weekly"
  );
};
