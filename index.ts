import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { scrapeTikTok } from "./functions/scrapeTikTok";
import { DailyLive } from "./models/DailyLive";
import { format } from "date-fns";
import { logger } from "./logger/logger";
import { waitForTimeout } from "./functions/waitForTimeout";

const app = express();

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

if (process.env.PROD_SCRAPING_SERVER) {
  // Scrape Tik Tok stats every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    scrapeTikTok();
  });
}

// Restart server every 3 hours at the 35 minute mark
cron.schedule("35 */3 * * *", async () => {
  if (process.env.NODE_ENV === "production") {
    logger("server").info("Restarting server on purpose!");
  } else {
    console.log("Restarting server on purpose!");
  }
  await waitForTimeout(5000);
  process.exit(1);
});

app.get("/api/daily_live", [], async (req: Request, res: Response) => {
  const queryDate: string = req.query.date ? req.query.date.toString() : "";
  const currentDate = queryDate ? queryDate : format(new Date(), "MM/dd/yyyy");
  const dailyLiveGen = await DailyLive.find(
    { date: currentDate },
    { date: 1, createdAt: 1, updatedAt: 1 }
  ).catch((e) => {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(e);
    } else {
      console.error(e);
    }
  });
  const dailyLiveLives = await DailyLive.aggregate([
    { $match: { date: currentDate } },
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
      $project: {
        _id: 0,
        roomID: "$lives.roomID",
        diamonds: "$lives.diamonds",
        displayID: "$userInfo.displayID",
        userID: "$userInfo.userID",
        avatar: "$userInfo.avatar",
        updatedAt: "$lives.updatedAt",
        createdAt: "$lives.createdAt",
      },
    },
  ]);
  const responseObj = {
    date: dailyLiveGen[0].date,
    createdAt: dailyLiveGen[0].createdAt,
    updatedAt: dailyLiveGen[0].updatedAt,
    lives: [...dailyLiveLives],
  };
  res.send(responseObj);
});

app.get("/", (req: Request, res: Response) => {
  res.send("The TikTok data scraper server is up and running!");
});

// Connect to MongoDB with Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    if (process.env.NODE_ENV === "production") {
      logger("server").info("Connected to MongoDB");
    } else {
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV === "production") {
      logger("server").error(err);
    } else {
      console.error(err);
    }
  });

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    logger("server").info(`Listening on port ${port}...`);
  } else {
    console.log(`Listening on port ${port}...`);
  }
});
