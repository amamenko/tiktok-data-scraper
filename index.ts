import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import enforce from "express-sslify";
import { scrapeTikTok } from "./functions/scrapeTikTok";
import { DailyLive } from "./models/DailyLive";
import { differenceInMinutes, format } from "date-fns";
import { scrapingSuccessCheck } from "./functions/scrapingSuccessCheck";

const app = express();

// Cross-Origin Requests
app.use(cors());

// To show request body during POST requests
app.use(express.json());

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Scrape Tik Tok stats every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  scrapeTikTok();
});

// Backup script - make sure last scraping ran successfully
// at minutes 3, 13, 23, 33, 43, and 53 past the hour.
// Otherwise - try again
cron.schedule("3,13,23,33,43,53 * * * *", async () => {
  scrapingSuccessCheck();
});

app.get("/api/daily_live", [], async (req: Request, res: Response) => {
  const currentDate = format(new Date(), "MM/dd/yyyy");
  const dailyLiveGen = await DailyLive.find(
    { date: currentDate },
    { date: 1, createdAt: 1, updatedAt: 1 }
  ).catch((e) => console.error(e));
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
  let docDetails = {};
  if (dailyLiveGen && dailyLiveGen[0]) {
    docDetails = dailyLiveGen[0];
  }
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
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
