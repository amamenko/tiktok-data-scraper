import { format, startOfWeek, sub } from "date-fns";

export const getWeekStart = (weeksAgo: number) => {
  return format(
    startOfWeek(
      sub(new Date(), {
        weeks: weeksAgo,
      })
    ),
    "MM/dd/yyyy"
  );
};
