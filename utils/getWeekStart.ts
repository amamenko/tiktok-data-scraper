import { format, startOfWeek, sub } from "date-fns";
import "dotenv/config";

process.env.TZ = "America/New_York";
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
