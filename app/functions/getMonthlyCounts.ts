import { logger } from "@/lib/logger";
import clientPromise from "@/lib/mongodb";

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
    monthlyCounts.sort((a, b) => a._id.localeCompare(b._id));
    return { success: true, data: monthlyCounts };
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
    return { success: false, data: [] };
  }
};
