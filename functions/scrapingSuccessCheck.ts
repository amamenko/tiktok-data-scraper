import { differenceInMinutes, format } from "date-fns";
import { DailyLive } from "../models/DailyLive";
import { scrapeTikTok } from "./scrapeTikTok";

export const scrapingSuccessCheck = async () => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const dailyLiveGen = await DailyLive.find(
    { date: currentDate },
    { updatedAt: 1 }
  ).catch((e) => console.error(e));
  if (dailyLiveGen && dailyLiveGen[0]) {
    const mostRecentLiveRecord = dailyLiveGen[0] as unknown as {
      [key: string]: Date;
    };
    const updatedAt = mostRecentLiveRecord.updatedAt;
    const difference = differenceInMinutes(new Date(), new Date(updatedAt));
    // Lives document hasn't been updated in the last 5 minutes - try scraping again
    if (difference > 5) scrapeTikTok();
  } else {
    scrapeTikTok();
  }
};
