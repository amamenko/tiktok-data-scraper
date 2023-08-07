import { Request, Response } from "express";
import { format, startOfWeek, addDays, subDays } from "date-fns";
import { getTop100LiveResults } from "./getTop100LiveResults";

export const getRankingHistory = async (req: Request, res: Response) => {
  const absoluteWeekAgo = subDays(new Date(), 7);
  const formattedWeekAgo = format(absoluteWeekAgo, "MM/dd/yyyy");

  const weekStartsOnDate = startOfWeek(absoluteWeekAgo); // Sunday
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
    formattedWeekAgo,
    weekStartsOnFormatted
  );
};
