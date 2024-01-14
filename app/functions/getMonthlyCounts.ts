import { logger } from "@/lib/logger";
import clientPromise from "@/lib/mongodb";
import { parse } from "date-fns";

export const getMonthlyCounts = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("TikTokAgencyScraper");
    const monthlyCounts = await db
      .collection("dailylives")
      .aggregate([
        { $unwind: "$lives" },
        {
          $group: {
            _id: {
              $dateToString: {
                date: "$lives.createdAt",
                format: "%m-%Y",
              },
            },
            diamonds: { $sum: "$lives.diamonds" },
          },
        },
      ])
      .toArray();
    const parsedDateArr = monthlyCounts.map((item) => {
      return {
        ...item,
        date: parse(item._id, "MM-yyyy", new Date()),
      };
    });
    parsedDateArr.sort((a, b) => b.date.getTime() - a.date.getTime());
    return { success: true, data: parsedDateArr };
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return { success: false, data: [] };
  }
};
