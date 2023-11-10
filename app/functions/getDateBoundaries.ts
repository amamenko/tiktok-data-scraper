import { format, startOfWeek, addDays, subDays } from "date-fns";

process.env.TZ = "America/New_York";
export const getDateBoundaries = (isWeekAgo?: boolean) => {
  const beginningDay = isWeekAgo ? subDays(new Date(), 7) : new Date();
  const formattedBeginningDay = format(beginningDay, "MM/dd/yyyy");

  const weekStartsOnDate = startOfWeek(beginningDay); // Sunday
  const weekStartsOnFormatted = format(weekStartsOnDate, "MM/dd/yyyy");
  const boundaryDatesArr = [weekStartsOnFormatted];

  for (let i = 1; i < 7; i++) {
    const addedFormattedDate = format(
      addDays(weekStartsOnDate, i),
      "MM/dd/yyyy"
    );
    boundaryDatesArr.push(addedFormattedDate);
  }
  return {
    boundaryDatesArr,
    weekStartsOnDate,
    formattedBeginningDay,
    weekStartsOnFormatted,
  };
};
